/**
 * MagneticButton
 * ─────────────────────────────────────────────────────────────────────────────
 * Framer-motion spring-physics magnetic button wrapper.
 * Within RADIUS pixels the element follows the cursor proportionally;
 * on leave it snaps back with a spring elastic overshoot.
 *
 * ⚙ DEVELOPER TUNING — props or modify defaults below:
 *   radius      px — activation radius
 *   strength    0-1 — how much the element follows the cursor
 *   stiffness   framer-motion spring stiffness
 *   damping     framer-motion spring damping
 */

import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/* ⚙ Default spring config */
const SPRING_CFG = { stiffness: 180, damping: 18, mass: 0.9 };

export default function MagneticButton({
  children,
  className = '',
  radius    = 70,
  strength  = 0.38,
  onClick,
  style,
  ...rest
}) {
  const ref = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, SPRING_CFG);
  const y    = useSpring(rawY, SPRING_CFG);

  const onMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < radius) {
      rawX.set(dx * strength);
      rawY.set(dy * strength);
    } else {
      rawX.set(0);
      rawY.set(0);
    }
  }, [rawX, rawY, radius, strength]);

  const onLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x, y, ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
