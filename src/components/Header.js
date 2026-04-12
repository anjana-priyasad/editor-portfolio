import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import MagneticButton from './MagneticButton';
import './Header.css';

const navLinks = ['HOME', 'PORTFOLIO', 'SERVICES', 'ABOUT'];

/* ─────────────────────────────────────────────────────
   MagneticCTA
   The button physically moves toward the cursor when
   the cursor enters its magnetic field (~200 px).
   It also tilts slightly and glows.
───────────────────────────────────────────────────── */
function MagneticCTA({ children, onClick }) {
  const ref      = useRef(null);
  const rafRef   = useRef(null);
  const targetRef = useRef({ tx: 0, ty: 0, tilt: 0 });
  const currentRef = useRef({ tx: 0, ty: 0, tilt: 0 });

  const [near,  setNear]  = useState(false);
  const [glow,  setGlow]  = useState(0);   /* 0–1 */
  const [tilt,  setTilt]  = useState(0);

  const THRESHOLD = 190;   /* px from centre that activates the pull */
  const MAX_PULL  = 46;    /* max px the button travels */
  const MAX_TILT  = 9;     /* max rotation in degrees */
  const LERP      = 0.13;  /* smoothing factor */

  /* ── smooth animation loop ── */
  const animate = useCallback(() => {
    const c = currentRef.current;
    const t = targetRef.current;
    c.tx   += (t.tx   - c.tx)   * LERP;
    c.ty   += (t.ty   - c.ty)   * LERP;
    c.tilt += (t.tilt - c.tilt) * LERP;

    if (ref.current) {
      ref.current.style.transform =
        `translate(${c.tx}px, ${c.ty}px) rotate(${c.tilt}deg)`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  /* ── track cursor ── */
  useEffect(() => {
    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < THRESHOLD) {
        const factor = 1 - dist / THRESHOLD;          /* 0 at edge → 1 at centre */
        const pull   = Math.pow(factor, 1.4);          /* ease in the pull */
        targetRef.current.tx   = dx * pull * (MAX_PULL / THRESHOLD) * 1.6;
        targetRef.current.ty   = dy * pull * (MAX_PULL / THRESHOLD) * 1.6;
        targetRef.current.tilt = (dx / THRESHOLD) * MAX_TILT * pull;
        setNear(true);
        setGlow(factor);
        setTilt(targetRef.current.tilt);
      } else {
        targetRef.current.tx   = 0;
        targetRef.current.ty   = 0;
        targetRef.current.tilt = 0;
        setNear(false);
        setGlow(0);
        setTilt(0);
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  /* Dynamic shadow/glow that deepens as button is pulled */
  const shadowStyle = near ? {
    boxShadow: `
      0 ${8 + glow * 20}px ${20 + glow * 36}px rgba(0,0,0,${0.18 + glow * 0.28}),
      0 0 ${6 + glow * 22}px ${glow * 6}px rgba(255,255,255,${glow * 0.22})
    `,
  } : {};

  return (
    <button
      ref={ref}
      className={`nav__cta nav__cta--mag${near ? ' nav__cta--pulled' : ''}`}
      style={shadowStyle}
      onClick={onClick}
      data-cursor="contact"
    >
      {children}
      {/* Energy aura — visible when near */}
      <span
        className="mag-aura"
        style={{ opacity: glow * 0.9 }}
        aria-hidden="true"
      />
      {/* Tilt shimmer line */}
      {near && (
        <span
          className="mag-shimmer"
          style={{ transform: `rotate(${-tilt * 1.5}deg)` }}
          aria-hidden="true"
        />
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────── */
export default function Header({ onContactOpen, onNavigate }) {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [shimmering, setShimmering] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* GCS letter shimmer every 15 s */
  useEffect(() => {
    const trigger = () => {
      setShimmering(true);
      setTimeout(() => setShimmering(false), 1400);
    };
    const t = setTimeout(trigger, 800);
    const iv = setInterval(trigger, 15000);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, []);

  const go = (link) => {
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate(link.toLowerCase());
    } else {
      document.getElementById(link.toLowerCase())
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner">

        {/* Logo */}
        <div className="header__logo">
          <span className={`logo__monogram${shimmering ? ' logo__monogram--glow' : ''}`}>
            {['G', 'C', 'S'].map((l, i) => (
              <span key={l} className="logo__letter" style={{ '--i': i }}>{l}</span>
            ))}
          </span>
          <span className="logo__divider" />
          <span className="logo__subtitle">Photo Editing</span>
        </div>

        {/* Desktop Nav */}
        <nav className="header__nav">
          {navLinks.map((link) => (
            <MagneticButton
              key={link}
              className="nav__link"
              onClick={() => go(link)}
              radius={55}
              strength={0.28}
              data-cursor="explore"
            >
              {link}
            </MagneticButton>
          ))}

          {/* Magnetic Contact Me */}
          <MagneticCTA onClick={onContactOpen}>
            Contact Me
          </MagneticCTA>
        </nav>

        {/* Hamburger */}
        <button className="header__burger"
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`header__mobile-menu${menuOpen ? ' header__mobile-menu--open' : ''}`}>
        {navLinks.map((link) => (
          <button key={link} className="mobile-nav__link" onClick={() => go(link)}>
            {link}
          </button>
        ))}
        <button className="mobile-nav__link mobile-nav__cta"
          onClick={() => { setMenuOpen(false); onContactOpen(); }}>
          Contact Me
        </button>
      </div>
    </header>
  );
}
