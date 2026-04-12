/**
 * WaterRipplePhoto
 * ─────────────────────────────────────────────────────────────────────────────
 * WebGL canvas: warm-sepia idle state → full-colour on hover, with organic
 * expanding-ring water ripples. IMAGE IS ALWAYS SHARP — zero blur, pure warp.
 *
 * Props:
 *   src        image URL to load as texture (imported asset)
 *   className  extra CSS classes
 *   darkBg     set true when the canvas sits on a dark background
 *              (sets a dark CSS bg so transparent PNGs look clean)
 *
 * ⚙ DEVELOPER TUNING — adjust at top of this file:
 *   CLARITY_SPEED   speed of sepia → colour reveal (units/s)
 *   RIPPLE_THROTTLE min UV distance between successive ripple spawns
 *   RIPPLE_LIFETIME max age (seconds) before a ripple slot is reused
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { createProgram, setupQuad, cacheUniforms, loadTexture } from '../utils/waterRipple';

/* ⚙ Tuning */
const CLARITY_SPEED    = 4.0;
const RIPPLE_THROTTLE  = 0.05;
const RIPPLE_LIFETIME  = 2.0;
const MAX_RIPPLES      = 6;
const IDLE_CLARITY     = 0.12;   /* subtle warm-colour hint at rest (0=pure sepia) */
const IDLE_RIPPLE_MS   = 3200;   /* ms between auto-spawned idle ripples            */

const makeRipple = () => ({ x: 0.5, y: 0.5, age: 0, act: 0 });

export default function WaterRipplePhoto({ src, className = '', darkBg = false }) {
  const canvasRef        = useRef(null);
  const glRef            = useRef(null);
  const progRef          = useRef(null);
  const unifRef          = useRef(null);
  const rafRef           = useRef(null);
  const lastTsRef        = useRef(0);
  const clarityRef       = useRef(IDLE_CLARITY);   /* start with warm hint */
  const targetClarityRef = useRef(IDLE_CLARITY);
  const ripplesRef       = useRef(Array.from({ length: MAX_RIPPLES }, makeRipple));
  const rippleIdxRef     = useRef(0);

  /* ── Draw one frame ─────────────────────────────────────────────────────── */
  const draw = useCallback(() => {
    const gl = glRef.current;
    const u  = unifRef.current;
    if (!gl || !u) return;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u.clarity, clarityRef.current);
    ripplesRef.current.forEach((r, i) => {
      gl.uniform1f(u[`r${i}px`],  r.x);
      gl.uniform1f(u[`r${i}py`],  r.y);
      gl.uniform1f(u[`r${i}age`], r.age);
      gl.uniform1f(u[`r${i}act`], r.act);
    });
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, []);

  /* ── Lifecycle ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!src) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* alpha:true so transparent PNGs (cutouts) render cleanly */
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return;
    glRef.current = gl;

    /* Transparent clear colour */
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const prog = createProgram(gl);
    if (!prog) return;
    progRef.current = prog;
    gl.useProgram(prog);
    setupQuad(gl, prog);
    unifRef.current = cacheUniforms(gl, prog);
    gl.uniform1i(unifRef.current.image, 0);

    let running = true;
    let ro      = null;

    loadTexture(gl, src).then((tex) => {
      if (!running || !tex) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);

      let resizeRaf = null;
      const resize = () => {
        const { width, height } = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width  = Math.round(width  * dpr);
        canvas.height = Math.round(height * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      resize();
      ro = new ResizeObserver(() => {
        /* Defer to next animation frame — prevents "ResizeObserver loop" warnings */
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(resize);
      });
      ro.observe(canvas);

      const tick = (ts) => {
        if (!running) return;
        const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
        lastTsRef.current = ts;

        /* Smooth clarity */
        const diff = targetClarityRef.current - clarityRef.current;
        clarityRef.current += diff * Math.min(dt * CLARITY_SPEED, 1);

        /* Age ripples */
        ripplesRef.current = ripplesRef.current.map((r) =>
          r.act ? { ...r, age: r.age + dt, act: r.age < RIPPLE_LIFETIME ? 1 : 0 } : r
        );

        draw();
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    });

    return () => {
      running = false;
      ro?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [src, draw]);

  /* ── Ripple helpers ─────────────────────────────────────────────────────── */
  const addRipple = useCallback((nx, ny) => {
    const idx = rippleIdxRef.current % MAX_RIPPLES;
    ripplesRef.current[idx] = { x: nx, y: 1 - ny, age: 0, act: 1 };
    rippleIdxRef.current++;
  }, []);

  const getUV = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
  };

  /* ── Mouse handlers ─────────────────────────────────────────────────────── */
  const onEnter = useCallback((e) => {
    targetClarityRef.current = 1;
    const [x, y] = getUV(e);
    addRipple(x, y);
  }, [addRipple]);

  const onLeave = useCallback(() => {
    targetClarityRef.current = IDLE_CLARITY; /* return to warm hint, not full sepia */
  }, []);

  const onMove = useCallback((e) => {
    if (targetClarityRef.current < 0.05) return;
    const [nx, ny] = getUV(e);
    const prev = ripplesRef.current[(rippleIdxRef.current - 1 + MAX_RIPPLES) % MAX_RIPPLES];
    const dx = nx - prev.x;
    const dy = (1 - ny) - prev.y;
    if (Math.sqrt(dx * dx + dy * dy) > RIPPLE_THROTTLE) addRipple(nx, ny);
  }, [addRipple]);

  /* ── Idle ripple timer — keeps photo alive at rest ───────────────────────── */
  useEffect(() => {
    const id = setInterval(() => {
      /* Only spawn when not hovered */
      if (targetClarityRef.current <= IDLE_CLARITY + 0.05) {
        /* Spawn near centre with slight random offset */
        addRipple(0.35 + Math.random() * 0.3, 0.3 + Math.random() * 0.35);
      }
    }, IDLE_RIPPLE_MS);
    return () => clearInterval(id);
  }, [addRipple]);

  return (
    <canvas
      ref={canvasRef}
      className={`water-ripple-canvas ${className}`}
      style={darkBg ? { background: '#1C1410' } : {}}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="explore"
    />
  );
}
