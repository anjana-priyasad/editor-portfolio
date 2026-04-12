/**
 * Contact page overlay
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-screen overlay with:
 *   • Top: section header (eyebrow + title)
 *   • Middle: portrait (water ripple) | form — side by side
 *   • Bottom: intro text, contact info, social links
 */

import React, { useState, useRef, useEffect } from 'react';
import { Mail, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import gayanImg from '../assets/gayan.png';
import WaterRipplePhoto from './WaterRipplePhoto';
import './Contact.css';

function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

/* ── ⚙ Seed particle constants ───────────────── */
const SEED_COUNT      = 36;
const BASE_SPEED      = 0.45;
const SCROLL_BOOST    = 1.4;
const SWAY_AMPLITUDE  = 0.32;

function makeSeed(W, H) {
  return {
    x:       Math.random() * W,
    y:       H + Math.random() * 120,
    vy:      BASE_SPEED + Math.random() * 0.5,
    vx:      (Math.random() - 0.5) * SWAY_AMPLITUDE,
    angle:   Math.random() * Math.PI * 2,
    aVel:    (Math.random() - 0.5) * 0.025,
    size:    4 + Math.random() * 5,
    stemLen: 14 + Math.random() * 12,
    opacity: 0.1 + Math.random() * 0.18,
  };
}

function drawSeed(ctx, s) {
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(s.angle);
  ctx.globalAlpha = s.opacity;
  ctx.strokeStyle = 'rgba(160,160,160,0.85)';
  ctx.lineWidth   = 0.8;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, s.stemLen);
  ctx.stroke();

  const n = 5;
  for (let j = 0; j < n; j++) {
    const t  = j / n;
    const py = s.stemLen * (0.55 + t * 0.42);
    const l  = s.size * (1 - t * 0.35);
    ctx.beginPath(); ctx.moveTo(0, py);
    ctx.quadraticCurveTo( l * 0.55, py - l * 0.32, l, py - l * 0.9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, py);
    ctx.quadraticCurveTo(-l * 0.55, py - l * 0.32,-l, py - l * 0.9); ctx.stroke();
  }

  ctx.fillStyle = 'rgba(160,160,160,0.65)';
  ctx.beginPath();
  ctx.arc(0, 0, 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function PampasCanvas() {
  const canvasRef    = useRef(null);
  const seedsRef     = useRef([]);
  const scrollRef    = useRef(0);
  const rafRef       = useRef(null);
  const sectionRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let   W = 0, H = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      seedsRef.current  = Array.from({ length: SEED_COUNT }, () => makeSeed(W, H));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onScroll = () => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const ratio = Math.max(0, Math.min(1, 1 - rect.bottom / window.innerHeight));
      scrollRef.current = ratio;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const boost = 1 + scrollRef.current * SCROLL_BOOST;

      seedsRef.current.forEach((s) => {
        drawSeed(ctx, s);
        s.x    += s.vx + Math.sin(s.y * 0.012) * 0.28;
        s.y    -= s.vy * boost;
        s.angle += s.aVel;
        s.opacity = Math.min(s.opacity + 0.002, 0.28);
        if (s.y < -60) Object.assign(s, makeSeed(W, H));
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div ref={sectionRef} className="pampas-wrap">
      <canvas ref={canvasRef} className="pampas-canvas"/>
    </div>
  );
}

/* ── Contact page overlay ────────────────────── */
export default function Contact({ onClose }) {
  const [form, setForm] = useState({ name:'', email:'', service:'', message:'' });
  const [sent, setSent] = useState(false);
  const onChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); setSent(true); };

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      className="contact-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Back button */}
      <button className="contact-page__back" onClick={onClose} aria-label="Close">
        <ArrowLeft size={16} strokeWidth={1.5} />
        <span>Back</span>
      </button>

      <div className="contact-page__scroll">
        <section className="contact">
          <PampasCanvas />

          <div className="contact__inner">

            {/* ── Top: section header ──────────── */}
            <div className="contact__header">
              <span className="section-eyebrow section-eyebrow--dark">Let's Begin</span>
              <h2 className="contact__title">Start Your Story</h2>
              <div className="contact__ornament">
                <span className="contact__ornament-line" />
                <span className="contact__ornament-diamond" />
                <span className="contact__ornament-line" />
              </div>
            </div>

            {/* ── Middle: portrait + form ───────── */}
            <div className="contact__main">
              {/* Portrait with water ripple */}
              <div className="contact__portrait">
                <WaterRipplePhoto src={gayanImg} className="contact__portrait-canvas" />
              </div>

              {/* Form */}
              <div className="contact__form-wrap">
                {sent ? (
                  <div className="contact__success">
                    <CheckCircle size={40} strokeWidth={1} />
                    <h3>Message Received</h3>
                    <p>Thank you for reaching out. I'll be in touch within 24 hours.</p>
                  </div>
                ) : (
                  <form className="contact__form" onSubmit={onSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="name">Full Name</label>
                        <input id="name" name="name" type="text" required className="form-input"
                          value={form.name} onChange={onChange} placeholder="Your name" />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input id="email" name="email" type="email" required className="form-input"
                          value={form.email} onChange={onChange} placeholder="your@email.com" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="service">Service Required</label>
                      <select id="service" name="service" required className="form-input form-select"
                        value={form.service} onChange={onChange}>
                        <option value="" disabled>Select a service</option>
                        <option>Artistic Color Grading</option>
                        <option>High-End Skin Retouching</option>
                        <option>Album &amp; Gallery Culling</option>
                        <option>Full Gallery Editing</option>
                        <option>Background Replacement</option>
                        <option>Fine Art Enhancement</option>
                        <option>Full Package / Multiple Services</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="message">Tell Me About Your Project</label>
                      <textarea id="message" name="message" required rows={5}
                        className="form-input form-textarea" value={form.message} onChange={onChange}
                        placeholder="Share the details of your wedding, your editing vision, and any reference styles you love..." />
                    </div>
                    <button type="submit" className="form-submit">
                      <span>Send Enquiry</span>
                      <Send size={12} strokeWidth={2} />
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* ── Bottom: intro + info + socials ── */}
            <div className="contact__lower">
              <p className="contact__intro">
                Whether you're a photographer seeking a trusted editing partner, or a couple wishing to gift their photographer the finest post-production, I'd love to hear from you.
              </p>
              <div className="contact__info">
                <div className="contact__info-item">
                  <Mail size={14} strokeWidth={1.5} />
                  <span>hello@gayancsilva.com</span>
                </div>
                <div className="contact__info-item">
                  <span className="contact__info-response">Response within 24 hours</span>
                </div>
              </div>
              <div className="contact__socials-row">
                <a href="#!" className="social-link" aria-label="Instagram">
                  <div className="social-link__icon"><InstagramIcon size={16} /></div>
                  <span>@gayancsilva</span>
                </a>
                <div className="contact__availability">
                  <span className="availability-dot" />
                  <span>Currently accepting new clients for Q3 2026</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </motion.div>
  );
}
