import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import port1 from '../assets/portfolio 1.webp';
import port2 from '../assets/portfolio 2.webp';
import port3 from '../assets/portfolio 3.webp';
import port4 from '../assets/portfolio 4.webp';
import port5 from '../assets/portfolio 5.webp';
import port6 from '../assets/portfolio 6.webp';
import port7 from '../assets/portfolio 7.webp';
import port8 from '../assets/portfolio 8.webp';
import port9 from '../assets/portfolio 9.webp';
import './Portfolio.css';

const SLIDES = [
  { img: port1, title: "Isabella & James",  location: "Tuscany · Italy" },
  { img: port2, title: "Amara & Elliot",    location: "Santorini · Greece" },
  { img: port3, title: "Sophie & Thomas",   location: "Provence · France" },
  { img: port4, title: "Elena & Marco",     location: "Lake Como · Italy" },
  { img: port5, title: "Claire & Liam",     location: "Amalfi Coast · Italy" },
  { img: port6, title: "Natasha & Oliver",  location: "Vienna · Austria" },
  { img: port7, title: "Mei & David",       location: "Kyoto · Japan" },
  { img: port8, title: "Priya & Rohan",     location: "Jaipur · India" },
  { img: port9, title: "Charlotte & Hugo",  location: "Paris · France" },
];

const INTERVAL = 5000;

export default function Portfolio() {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const intervalRef = useRef(null);

  const go = useCallback((idx) => {
    setCurrent(((idx % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  /* Auto-slide — restarts on slide change so progress bar syncs */
  useEffect(() => {
    if (paused) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [paused, current, next]);

  return (
    <section id="portfolio" className="portfolio">

      {/* ── Header ───────────────────────────── */}
      <div className="portfolio__header">
        <span className="portfolio__eyebrow">Our Work</span>
        <h2 className="portfolio__title">PORTFOLIO</h2>
        <div className="portfolio__ornament">
          <span className="portfolio__ornament-line" />
          <span className="portfolio__ornament-script">Galleries</span>
          <span className="portfolio__ornament-line" />
        </div>
      </div>

      {/* ── Slideshow stage ──────────────────── */}
      <div
        className="portfolio__stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* All slides rendered, crossfade via CSS opacity */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`portfolio__slide${i === current ? ' portfolio__slide--active' : ''}`}
          >
            <img src={slide.img} alt={slide.title} className="portfolio__slide-img" />
          </div>
        ))}

        {/* Bottom gradient overlay */}
        <div className="portfolio__overlay" />

        {/* Slide info — animated on change */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="portfolio__info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="portfolio__info-location">{SLIDES[current].location}</span>
            <h3 className="portfolio__info-title">{SLIDES[current].title}</h3>
          </motion.div>
        </AnimatePresence>

        {/* Arrow buttons */}
        <button className="portfolio__arrow portfolio__arrow--prev" onClick={prev} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 14L6 9L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="portfolio__arrow portfolio__arrow--next" onClick={next} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Auto-slide progress bar */}
        <div className="portfolio__progress">
          <div
            key={`${current}-${paused}`}
            className={`portfolio__progress-bar${!paused ? ' portfolio__progress-bar--running' : ''}`}
          />
        </div>
      </div>

      {/* ── Dot indicators ───────────────────── */}
      <div className="portfolio__dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`portfolio__dot${i === current ? ' portfolio__dot--active' : ''}`}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Slide counter ────────────────────── */}
      <div className="portfolio__counter">
        <span className="portfolio__counter-current">{String(current + 1).padStart(2, '0')}</span>
        <span> / </span>
        <span>{String(SLIDES.length).padStart(2, '0')}</span>
      </div>

    </section>
  );
}
