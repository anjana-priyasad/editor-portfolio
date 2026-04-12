/**
 * Custom Cursor
 * ─────────────────────────────────────────────────────────────────────────────
 * • Small glowing off-white dot that follows the mouse
 * • Expands + shows a label when hovering [data-cursor] elements
 * • Hides the system cursor globally (set in index.css: cursor: none)
 *
 * Usage on any element:
 *   data-cursor="explore"   → "‹ explore ›"
 *   data-cursor="drag"      → "‹ drag ›"
 *   data-cursor="view"      → "‹ view ›"
 *   data-cursor="book"      → "‹ book now ›"
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './Cursor.css';

const LABELS = {
  explore: '‹ explore ›',
  drag:    '‹ drag ›',
  view:    '‹ view ›',
  book:    '‹ book now ›',
  contact: '‹ contact ›',
  default: '',
};

export default function Cursor() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);

  /* Live position via refs — avoids React re-renders on every mousemove */
  const posRef   = useRef({ x: -200, y: -200 });
  const rafRef   = useRef(null);

  const [label,   setLabel]   = useState('');
  const [active,  setActive]  = useState(false);
  const [hidden,  setHidden]  = useState(false);

  /* Smoothed ring position for lag effect */
  const ringPos  = useRef({ x: -200, y: -200 });

  const animate  = useCallback(() => {
    const { x, y } = posRef.current;

    /* Dot: instant */
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }

    /* Ring: smooth lag (lerp) */
    ringPos.current.x += (x - ringPos.current.x) * 0.14;
    ringPos.current.y += (y - ringPos.current.y) * 0.14;
    if (ringRef.current) {
      ringRef.current.style.transform =
        `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setHidden(false);
    };

    const onLeave  = () => setHidden(true);
    const onEnter  = () => setHidden(false);

    const onOver = (e) => {
      const el = e.target.closest('[data-cursor]');
      if (el) {
        const key = el.dataset.cursor;
        setLabel(LABELS[key] || `‹ ${key} ›`);
        setActive(true);
      } else {
        setLabel('');
        setActive(false);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover',  onOver);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover',  onOver);
    };
  }, [animate]);

  return (
    <>
      {/* Dot — sharp, instant */}
      <div
        ref={dotRef}
        className={`cursor-dot${hidden ? ' cursor--hidden' : ''}${active ? ' cursor-dot--active' : ''}`}
      />
      {/* Ring — lagging halo */}
      <div
        ref={ringRef}
        className={`cursor-ring${hidden ? ' cursor--hidden' : ''}${active ? ' cursor-ring--active' : ''}`}
      >
        {label && <span className="cursor-ring__label">{label}</span>}
      </div>
    </>
  );
}
