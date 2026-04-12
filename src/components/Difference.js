import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import BeforeAfterSlider from './BeforeAfterSlider';
import './Difference.css';

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0,
    transition: { delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
});

export default function Difference() {
  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-10% 0px" });

  return (
    <section id="difference" className="difference-section" ref={inViewRef}>
      <div className="difference__container">

        <motion.div
          className="difference__header"
          variants={fadeUp(0.1)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <span className="difference__eyebrow">Wedding Photo Editing</span>
          <h2 className="difference__title">See The Difference</h2>
          <div className="difference__ornament">
            <span className="difference__ornament-line" />
            <span className="difference__ornament-script">before &amp; after</span>
            <span className="difference__ornament-line" />
          </div>
          <p className="difference__body">
            Drag to compare before &amp; after. Crafting timeless memories with artistry,
            care, and an eye for the extraordinary.
          </p>
        </motion.div>

        <motion.div
          className="difference__slider-wrap"
          variants={fadeUp(0.3)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <BeforeAfterSlider />
        </motion.div>

      </div>
    </section>
  );
}
