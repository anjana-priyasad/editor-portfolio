/**
 * WebGL Water Ripple Shader Utilities
 * ─────────────────────────────────────────────────────────────────────────────
 * Vertex + Fragment shaders for organic water-ripple distortion with
 * a warm-sepia → full-colour reveal tied to a "clarity" uniform.
 *
 * DEVELOPER TUNING HOOKS — search for ⚙ to find tuneable constants.
 */

/* ──────────────────────────────────────────────
   VERTEX SHADER
   Pass-through: projects full-screen quad, forwards UV coords.
────────────────────────────────────────────── */
export const VERT_SRC = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord  = a_texCoord;
  }
`;

/* ──────────────────────────────────────────────
   FRAGMENT SHADER
   • Multi-sample soft blur (dissolves as clarity → 1.0)
   • 6 independent expanding-ring ripples
   • Warm-sepia tone at clarity 0 → full colour at clarity 1
   ⚙ RIPPLE_WAVE_FREQ  — tightness of each ring (higher = tighter bands)
   ⚙ RIPPLE_SPEED      — how fast the wavefront expands (world-space units/s)
   ⚙ RIPPLE_DECAY      — how quickly ripple amplitude dies (per second)
   ⚙ RIPPLE_AMPLITUDE  — max UV distortion per ripple
   ⚙ BLUR_MAX          — max UV spread for the blur samples
────────────────────────────────────────────── */
export const FRAG_SRC = `
  precision mediump float;

  uniform sampler2D u_image;
  uniform float     u_clarity;   /* 0 = warm sepia, 1 = full colour — NO blur ever */

  /* ── Ripple data (6 slots, flat uniforms for WebGL 1.0 compat) ─────────── */
  uniform float u_rPos0x; uniform float u_rPos0y;
  uniform float u_rAge0;  uniform float u_rAct0;
  uniform float u_rPos1x; uniform float u_rPos1y;
  uniform float u_rAge1;  uniform float u_rAct1;
  uniform float u_rPos2x; uniform float u_rPos2y;
  uniform float u_rAge2;  uniform float u_rAct2;
  uniform float u_rPos3x; uniform float u_rPos3y;
  uniform float u_rAge3;  uniform float u_rAct3;
  uniform float u_rPos4x; uniform float u_rPos4y;
  uniform float u_rAge4;  uniform float u_rAct4;
  uniform float u_rPos5x; uniform float u_rPos5y;
  uniform float u_rAge5;  uniform float u_rAct5;

  varying vec2 v_texCoord;

  /* ── ⚙ Shader constants ─────────────────────────────────────────────────── */
  const float RIPPLE_WAVE_FREQ = 24.0;   /* ring tightness (higher = thinner rings) */
  const float RIPPLE_SPEED     = 0.65;   /* wavefront expansion rate               */
  const float RIPPLE_DECAY     = 2.8;    /* amplitude decay (higher = faster fade) */
  const float RIPPLE_AMPLITUDE = 0.016;  /* UV distortion — NO BLUR, pure warp     */

  vec2 computeRipple(vec2 uv, float px, float py, float age, float active) {
    vec2  d    = uv - vec2(px, py);
    float dist = length(d) + 0.0001;
    float front = age * RIPPLE_SPEED;
    float ring  = exp(-pow((dist - front) * RIPPLE_WAVE_FREQ, 2.0));
    float decay = exp(-age * RIPPLE_DECAY);
    return (d / dist) * ring * decay * RIPPLE_AMPLITUDE * active;
  }

  void main() {
    vec2 uv   = v_texCoord;
    vec2 warp = vec2(0.0);

    warp += computeRipple(uv, u_rPos0x, u_rPos0y, u_rAge0, u_rAct0);
    warp += computeRipple(uv, u_rPos1x, u_rPos1y, u_rAge1, u_rAct1);
    warp += computeRipple(uv, u_rPos2x, u_rPos2y, u_rAge2, u_rAct2);
    warp += computeRipple(uv, u_rPos3x, u_rPos3y, u_rAge3, u_rAct3);
    warp += computeRipple(uv, u_rPos4x, u_rPos4y, u_rAge4, u_rAct4);
    warp += computeRipple(uv, u_rPos5x, u_rPos5y, u_rAge5, u_rAct5);

    /* Single sharp sample — NO blur, only ripple warp */
    vec4 col = texture2D(u_image, uv + warp);

    /* ⚙ Black-and-white (idle) ↔ full-colour (hover) — remove block for always-colour */
    float luma = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));
    vec3  bw   = vec3(luma, luma, luma);
    col.rgb = mix(bw, col.rgb, smoothstep(0.05, 0.95, u_clarity));

    gl_FragColor = col;
  }
`;

/* ── Helpers ──────────────────────────────────────────────────────────────── */

export function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('[WaterRipple] Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function createProgram(gl) {
  const vert = compileShader(gl, gl.VERTEX_SHADER,   VERT_SRC);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vert || !frag) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('[WaterRipple] Program link error:', gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

/** Upload a full-screen quad (position + texCoord interleaved). */
export function setupQuad(gl, program) {
  // layout: [x, y, s, t] × 4 vertices
  const verts = new Float32Array([
    -1, -1,  0, 1,
     1, -1,  1, 1,
    -1,  1,  0, 0,
     1,  1,  1, 0,
  ]);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, 'a_position');
  const aTex = gl.getAttribLocation(program, 'a_texCoord');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(aTex);
  gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 16, 8);
}

/** Cache all uniform locations from the program. */
export function cacheUniforms(gl, program) {
  const u = {
    image:   gl.getUniformLocation(program, 'u_image'),
    clarity: gl.getUniformLocation(program, 'u_clarity'),
  };
  for (let i = 0; i < 6; i++) {
    u[`r${i}px`]  = gl.getUniformLocation(program, `u_rPos${i}x`);
    u[`r${i}py`]  = gl.getUniformLocation(program, `u_rPos${i}y`);
    u[`r${i}age`] = gl.getUniformLocation(program, `u_rAge${i}`);
    u[`r${i}act`] = gl.getUniformLocation(program, `u_rAct${i}`);
  }
  return u;
}

/** Load an image URL as a WebGL texture (returns Promise<WebGLTexture|null>). */
export function loadTexture(gl, url) {
  return new Promise((resolve) => {
    const tex = gl.createTexture();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      resolve(tex);
    };
    img.onerror = () => { console.warn('[WaterRipple] Could not load texture:', url); resolve(null); };
    img.src = url;
  });
}
