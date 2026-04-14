/**
 * MobileNav — bottom tab bar (app-like, mobile only)
 * Replaces the hamburger menu on screens ≤ 768 px.
 * Active section is detected via IntersectionObserver.
 */
import React, { useState, useEffect } from 'react';
import './MobileNav.css';

/* ── Icons ──────────────────────────────────── */
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
       stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);
const PortfolioIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
       stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const ServicesIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
       stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
  </svg>
);
const AboutIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
       stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const ContactIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
       stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
  </svg>
);

const NAV_ITEMS = [
  { id: 'home',      label: 'Home',      Icon: HomeIcon      },
  { id: 'portfolio', label: 'Portfolio', Icon: PortfolioIcon },
  { id: 'services',  label: 'Services',  Icon: ServicesIcon  },
  { id: 'about',     label: 'About',     Icon: AboutIcon     },
  { id: 'contact',   label: 'Contact',   Icon: ContactIcon   },
];

export default function MobileNav({ onContactOpen, onNavigate }) {
  const [active, setActive] = useState('home');
  const [ripple, setRipple] = useState(null);

  /* Detect which section is in view */
  useEffect(() => {
    const observers = NAV_ITEMS
      .filter(item => item.id !== 'contact')
      .map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const obs = new IntersectionObserver(
          ([entry]) => { if (entry.isIntersecting) setActive(id); },
          { threshold: 0.35 }
        );
        obs.observe(el);
        return obs;
      });
    return () => observers.forEach(obs => obs?.disconnect());
  }, []);

  const handleTap = (item) => {
    setRipple(item.id);
    setTimeout(() => setRipple(null), 420);

    if (item.id === 'contact') {
      onContactOpen();
    } else {
      setActive(item.id);
      if (onNavigate) {
        onNavigate(item.id);
      } else {
        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <div className="mobile-nav__track">
        {NAV_ITEMS.map(item => {
          const isActive  = active === item.id;
          const isRipple  = ripple === item.id;
          const isContact = item.id === 'contact';
          return (
            <button
              key={item.id}
              className={[
                'mobile-nav__item',
                isActive  ? 'mobile-nav__item--active'  : '',
                isContact ? 'mobile-nav__item--contact' : '',
              ].join(' ')}
              onClick={() => handleTap(item)}
              aria-label={item.label}
            >
              {/* Ripple circle on tap */}
              {isRipple && <span className="mobile-nav__ripple" aria-hidden="true"/>}

              <span className="mobile-nav__icon">
                <item.Icon />
              </span>
              <span className="mobile-nav__label">{item.label}</span>

              {/* Active pip */}
              {isActive && !isContact && (
                <span className="mobile-nav__pip" aria-hidden="true"/>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
