import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import imgCulling    from '../assets/Culling.webp';
import imgEditing    from '../assets/Editing.webp';
import imgRetouching from '../assets/Retouching.webp';
import './Services.css';

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0,
    transition: { delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
});

const services = [
  {
    img:  imgCulling,
    name: 'Culling',
    desc: 'Every great gallery begins with ruthless, discerning selection. I sift through hundreds of frames to surface only the images that truly breathe — those charged with emotion, perfect light, and the quiet magic that makes a moment irreplaceable.',
  },
  {
    img:  imgEditing,
    name: 'Editing',
    desc: 'Color is the language of feeling. Through meticulous tonal work and signature grading, I translate your raw captures into a cohesive, emotive narrative — each image singing in harmony with the next, true to your vision and timeless in its beauty.',
  },
  {
    img:  imgRetouching,
    name: 'Retouching',
    desc: 'Refinement without artifice. I sculpt light, smooth imperfections, and remove distractions with a gentle hand — preserving what is real while elevating what is extraordinary, until every portrait feels as luminous as the moment it was born.',
  },
];

export default function Services() {
  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-8% 0px" });

  return (
    <section id="services" className="services" ref={inViewRef}>

      {/* ── Section Header ───────────────────── */}
      <motion.div
        className="services__header"
        variants={fadeUp(0.05)}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <span className="services__eyebrow">Our Expertise</span>
        <h2 className="services__title">SERVICES</h2>
        <div className="services__ornament">
          <span className="services__ornament-line" />
          <span className="services__ornament-script">Offerings</span>
          <span className="services__ornament-line" />
        </div>
      </motion.div>

      {/* ── Cards ────────────────────────────── */}
      <div className="services__grid">
        {services.map((s, i) => (
          <motion.div
            key={i}
            className="service-card"
            variants={fadeUp(0.15 + i * 0.15)}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <div className="service-card__image-wrap">
              <img src={s.img} alt={s.name} className="service-card__img" />
            </div>
            <h3 className="service-card__name">{s.name}</h3>
            <p className="service-card__desc">{s.desc}</p>
            <button
              className="service-card__link"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Enquire
              <span className="service-card__link-line" />
            </button>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
