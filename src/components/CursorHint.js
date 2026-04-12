/**
 * CursorHint
 * ─────────────────────────────────────────────
 * Animated fake hand cursor that slides from a
 * mid-screen position toward the "Contact Me"
 * button, taps it, then fades out.
 * Fires once after a short delay on page load.
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CursorHint.css';

function HandIcon() {
  return (
    <svg
      viewBox="0 0 40 48" width="36" height="44"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className="cursor-hint__hand"
    >
      {/* Palm */}
      <path
        d="M14 22V8a3 3 0 0 1 6 0v10"
        stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round"
      />
      <path
        d="M20 18V6a3 3 0 0 1 6 0v12"
        stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round"
      />
      <path
        d="M26 18V10a3 3 0 0 1 6 0v12"
        stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round"
      />
      <path
        d="M14 22a3 3 0 0 0-3 3v6c0 7.18 5.82 13 13 13s13-5.82 13-13v-8a3 3 0 0 0-6 0"
        stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M14 22v-3a3 3 0 0 0-6 0v9"
        stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round"
      />
    </svg>
  );
}

/* Phases: hidden → appear → travel → tap → gone */
export default function CursorHint() {
  const [show,    setShow]    = useState(false);
  const [target,  setTarget]  = useState({ x: 0, y: 0 });
  const [origin,  setOrigin]  = useState({ x: 0, y: 0 });
  const [tapping, setTapping] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      const btn = document.querySelector('.nav__cta');
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const tx = rect.left + rect.width  / 2;
      const ty = rect.top  + rect.height / 2;

      /* Start somewhere in the lower-middle of the viewport */
      const sx = window.innerWidth  * 0.38;
      const sy = window.innerHeight * 0.62;

      setOrigin({ x: sx, y: sy });
      setTarget({ x: tx, y: ty });
      setShow(true);

      /* Tap after travel (1.4s) */
      setTimeout(() => setTapping(true),  1800);
      /* Hide */
      setTimeout(() => setShow(false),    2700);
    }, 3200);

    return () => clearTimeout(delay);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="cursor-hint"
          /* Start at origin, travel to target */
          initial={{ x: origin.x, y: origin.y, opacity: 0, scale: 1 }}
          animate={{
            x:       target.x,
            y:       target.y,
            opacity: 1,
            scale:   tapping ? 0.82 : 1,
          }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.35 } }}
          transition={{
            x:       { duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] },
            y:       { duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] },
            opacity: { duration: 0.4 },
            scale:   { duration: 0.15 },
          }}
        >
          <HandIcon />

          {/* Ripple ring on tap */}
          {tapping && (
            <motion.span
              className="cursor-hint__ripple"
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
