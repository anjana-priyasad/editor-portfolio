import React from 'react';
import heroImg from '../assets/hero image.png';
import './Hero.css';

export default function Hero() {
  const scrollToPortfolio = () =>
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="hero-section hero-section--simple">
      <img src={heroImg} alt="Gayan C. Silva — Wedding Photo Editor" className="hero-full-img" />
      <div className="hero-overlay-bg" />

      <div className="hero-text-overlay">
        {/* ── Headline ─────────────────────────── */}
        <div className="hero-overlay__headline">
          <span className="hero-overlay__line-one">
            <span className="hero-overlay__serif">YOUR</span>
            <span className="hero-overlay__script">Crafted</span>
            <span className="hero-overlay__serif">WEDDING</span>
          </span>
          <span className="hero-overlay__line-two">PHOTO EDITOR</span>
        </div>

        {/* ── Ornament ─────────────────────────── */}
        <div className="hero-overlay__ornament">
          <span className="hero-overlay__orn-line" />
          <span className="hero-overlay__orn-diamond" />
          <span className="hero-overlay__orn-line" />
        </div>

        {/* ── Tagline ──────────────────────────── */}
        <p className="hero-overlay__tagline">
          Your moments are precious — let me preserve every detail with the care they deserve.
          I handle the editing so you can focus on what matters most.
        </p>

        {/* ── CTA ──────────────────────────────── */}
        <button className="hero-overlay__cta" onClick={scrollToPortfolio}>
          <span>View My Work</span>
          <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
            <path d="M0 5h18M13 1l5 4-5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="hero__scroll">
        <span className="hero__scroll-label">Scroll</span>
        <span className="hero__scroll-bar" />
      </div>
    </section>
  );
}
