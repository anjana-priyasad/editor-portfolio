import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import MagneticButton from './MagneticButton';
import './Header.css';

const navLinks = ['HOME', 'PORTFOLIO', 'SERVICES', 'ABOUT'];

export default function Header({ onContactOpen, onNavigate }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [shimmering,  setShimmering]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* GCS shimmer — triggers on mount, then every 30 s */
  useEffect(() => {
    const trigger = () => {
      setShimmering(true);
      setTimeout(() => setShimmering(false), 1400);
    };
    const t = setTimeout(trigger, 800);          // first fire after 0.8 s
    const interval = setInterval(trigger, 15000); // every 15 s
    return () => { clearTimeout(t); clearInterval(interval); };
  }, []);

  const go = (link) => {
    setMenuOpen(false);
    if (onNavigate) {
      onNavigate(link.toLowerCase());
    } else {
      document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner">

        {/* Logo */}
        <div className="header__logo">
          <span className={`logo__monogram${shimmering ? ' logo__monogram--glow' : ''}`}>
            {['G','C','S'].map((l, i) => (
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
          <MagneticButton
            className="nav__cta"
            onClick={onContactOpen}
            radius={70}
            strength={0.38}
            data-cursor="book"
          >
            Contact Me
          </MagneticButton>
        </nav>

        {/* Hamburger */}
        <button className="header__burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`header__mobile-menu${menuOpen ? ' header__mobile-menu--open' : ''}`}>
        {navLinks.map((link) => (
          <button key={link} className="mobile-nav__link" onClick={() => go(link)}>{link}</button>
        ))}
        <button className="mobile-nav__link mobile-nav__cta"
          onClick={() => { setMenuOpen(false); onContactOpen(); }}>
          Contact Me
        </button>
      </div>
    </header>
  );
}
