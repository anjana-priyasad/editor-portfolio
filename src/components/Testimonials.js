import React from 'react';
import './Testimonials.css';

/* ── Data ────────────────────────────────────── */
const reviews = [
  {
    username: 'anjana_111',
    country:  'Sri Lanka', flag: '🇱🇰',
    rating: 5, time: '1 year ago',
    repeat: false,
    avatarColor: '#555555',
    text: "Working with PexelPerfect was a fantastic experience! They delivered high-quality photo edits that went beyond my expectations. The service was fast, reliable, and incredibly professional. I'm thoroughly impressed with the attention to detail and the creative touch added to my photos. Highly recommend PexelPerfect for anyone in need of top-notch photo editing services.",
  },
  {
    username: 'zakariaelmantar',
    country:  'Morocco', flag: '🇲🇦',
    rating: 4.3, time: '1 year ago',
    repeat: false,
    avatarColor: '#444444',
    text: 'good preset',
  },
  {
    username: 'brentis',
    country:  'United States', flag: '🇺🇸',
    rating: 4.3, time: '1 year ago',
    repeat: false,
    avatarColor: '#666666',
    text: 'Exceptional. Will use again!',
  },
  {
    username: 'natalied528',
    country:  'United States', flag: '🇺🇸',
    rating: 5, time: '1 year ago',
    repeat: false,
    avatarColor: '#777777',
    text: 'They were quick to respond and worked with me to create the perfect album. Thank you!',
  },
  {
    username: 'eocpacanada',
    country:  'Canada', flag: '🇨🇦',
    rating: 5, time: '1 year ago',
    repeat: false,
    avatarColor: '#888888',
    text: 'Professional work and went above and beyond. Thank you!',
  },
  {
    username: 'rasinduudayanga',
    country:  'Sri Lanka', flag: '🇱🇰',
    rating: 5, time: '1 year ago',
    repeat: false,
    avatarColor: '#3B3B3B',
    text: 'Pixelperfect is an absolute professional! The wedding photos I sent were beautifully enhanced with perfect color correction and album page design, natural skin retouching, and stunning details. The results exceeded my expectations! Communication was smooth, delivery was fantastic, and the final images looked magical.',
  },
  {
    username: 'elle1992',
    country:  'United States', flag: '🇺🇸',
    rating: 5, time: '1 year ago',
    repeat: false,
    avatarColor: '#999999',
    text: "Was amazing working with this creator. He was attentive, quick, & patient with me. He exceeded my expectations as well as made my life as a photographer so much easier. Will definitely work with him again. I also highly recommend him!",
  },
  {
    username: 'stoicaalin',
    country:  'Romania', flag: '🇷🇴',
    rating: 5, time: '2 months ago',
    repeat: true,
    avatarColor: '#333333',
    text: 'I am not good at reviews. What I can say is that... right now I will send him the next project to edit for me. Good job Boss!',
  },
];

/* ── Star rating ─────────────────────────────── */
function Stars({ rating }) {
  return (
    <div className="tr-stars">
      {[1, 2, 3, 4, 5].map((n) => {
        const pct = Math.min(Math.max(rating - n + 1, 0), 1) * 100;
        return (
          <span key={n} className="tr-star">
            <span className="tr-star__bg">★</span>
            <span className="tr-star__fill" style={{ width: `${pct}%` }}>★</span>
          </span>
        );
      })}
      <span className="tr-rating">{rating}</span>
    </div>
  );
}

/* ── Single review card ──────────────────────── */
function ReviewCard({ review }) {
  return (
    <div className="tr-card">
      <div className="tr-card__header">
        <div className="tr-card__avatar" style={{ background: review.avatarColor }}>
          {review.username[0].toUpperCase()}
        </div>
        <div className="tr-card__meta">
          <span className="tr-card__username">{review.username}</span>
          {review.repeat && <span className="tr-card__repeat">↻ Repeat Client</span>}
          <div className="tr-card__country">
            <span>{review.flag}</span>
            <span>{review.country}</span>
          </div>
        </div>
      </div>

      <div className="tr-card__divider" />

      <div className="tr-meta-row">
        <Stars rating={review.rating} />
        <span className="tr-dot" />
        <span className="tr-time">{review.time}</span>
      </div>

      <p className="tr-card__text">{review.text}</p>
    </div>
  );
}

/* ── Testimonials section ────────────────────── */
export default function Testimonials() {
  /* Duplicate so the loop is seamless */
  const row1 = [...reviews, ...reviews];
  const row2 = [...reviews, ...reviews].reverse();

  return (
    <section id="testimonials" className="testimonials">

      {/* ── Header ───────────────────────────── */}
      <div className="testimonials__header">
        <span className="testimonials__eyebrow">Kind Words</span>
        <h2 className="testimonials__title">TESTIMONIALS</h2>
        <div className="testimonials__ornament">
          <span className="testimonials__ornament-line" />
          <span className="testimonials__ornament-script">voices</span>
          <span className="testimonials__ornament-line" />
        </div>
      </div>

      {/* ── Marquee rows ─────────────────────── */}
      <div className="testimonials__marquee-wrap">
        {/* Row 1 — left */}
        <div className="testimonials__row">
          <div className="testimonials__track">
            {row1.map((r, i) => <ReviewCard key={i} review={r} />)}
          </div>
        </div>
        {/* Row 2 — right (reverse direction) */}
        <div className="testimonials__row">
          <div className="testimonials__track testimonials__track--reverse">
            {row2.map((r, i) => <ReviewCard key={i} review={r} />)}
          </div>
        </div>
      </div>

      {/* ── Edge gradient fades ───────────────── */}
      <div className="testimonials__fade testimonials__fade--left" />
      <div className="testimonials__fade testimonials__fade--right" />

    </section>
  );
}
