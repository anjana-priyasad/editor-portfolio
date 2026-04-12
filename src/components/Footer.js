import React from 'react';
import './Contact.css';

function FiverrIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.004 15.588a.995.995 0 1 0 .002-1.99.995.995 0 0 0-.002 1.99zm-.996-3.705h-1.712c-.297 0-.4.09-.4.396v4.bubbles h1.63v-4.074h.482zm-3.324-3.308c0-.55-.452-.993-1.005-.993-.547 0-.997.445-.997.993v.617h-1.03c-1.217 0-1.987.748-1.987 2.01v1.752c0 1.273.77 2.01 1.986 2.01h.298v-1.632h-.168c-.42 0-.614-.193-.614-.602v-1.528c0-.41.195-.607.614-.607h.901v4.369h1.604v-4.369h.398zm-6.422-.008c0-.55-.45-.993-1.002-.993-.55 0-.998.443-.998.993v.617H9.231c-.676 0-1.18.219-1.518.65-.33.43-.492 1.03-.492 1.83v.992c0 .803.162 1.404.492 1.832.338.43.842.652 1.518.652h1.66v-1.633h-1.5c-.418 0-.614-.193-.614-.602V11.33c0-.41.196-.606.614-.606h.266v4.368h1.605zm-5.987 0c0-.55-.45-.993-1.002-.993-.55 0-.997.443-.997.993v.617H3.24c-.676 0-1.18.219-1.518.65-.33.43-.49 1.03-.49 1.83v.992c0 .803.16 1.404.49 1.832.338.43.842.652 1.518.652H4.9v-1.633H3.4c-.418 0-.613-.193-.613-.602V11.33c0-.41.195-.606.613-.606h.264v4.368H5.27z"/>
    </svg>
  );
}

export default function Footer({ onContactOpen }) {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* Left — brand + copyright */}
        <div className="footer__left">
          <div className="footer__brand">
            <span className="footer__logo">GCS</span>
            <span className="footer__tagline">Wedding Photo Editor &amp; Retoucher</span>
          </div>
          <div className="footer__copy">
            <p>&copy; 2026 Gayan C. Silva. All rights reserved.</p>
            <p className="footer__credit">
              Design &amp; Developed by{' '}
              <a href="https://wikendy.com" target="_blank" rel="noopener noreferrer"
                className="footer__credit-link">
                Wikendy Digital
              </a>
            </p>
          </div>
        </div>

        {/* Right — nav + fiverr */}
        <div className="footer__right">
          <nav className="footer__nav">
            {['HOME', 'PORTFOLIO', 'SERVICES', 'ABOUT'].map(link => (
              <button key={link} className="footer__link"
                onClick={() => scrollTo(link.toLowerCase())}>
                {link}
              </button>
            ))}
            <button className="footer__link" onClick={onContactOpen}>CONTACT</button>
          </nav>

          <a
            href="https://www.fiverr.com/silvadgc"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__fiverr"
          >
            <span className="footer__live-dot" />
            <FiverrIcon size={14} />
            Hire on Fiverr
          </a>
        </div>

      </div>
    </footer>
  );
}
