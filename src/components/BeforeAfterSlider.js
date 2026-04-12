import React, { useState, useRef, useCallback } from 'react';
import beforeImg from '../assets/before.jpg';
import afterImg from '../assets/after.jpg';
import './BeforeAfterSlider.css';

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const updatePosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onMouseMove = useCallback((e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  const onTouchStart = useCallback((e) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  const onTouchMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    updatePosition(e.touches[0].clientX);
  }, [isDragging, updatePosition]);

  return (
    <div
      className={`ba-slider${isDragging ? ' ba-slider--dragging' : ''}`}
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
    >
      {/* After image — base layer */}
      <img src={afterImg} alt="After editing" className="ba-slider__img ba-slider__img--after" draggable={false} />

      {/* Before image — clipped layer */}
      <div
        className="ba-slider__before-wrap"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={beforeImg} alt="Before editing" className="ba-slider__img ba-slider__img--before" draggable={false} />
      </div>

      {/* Divider line + handle */}
      <div
        className="ba-slider__divider"
        style={{ left: `${position}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <div className="ba-slider__handle">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M8 11 L4 7 L4 15 Z" fill="currentColor"/>
            <path d="M14 11 L18 7 L18 15 Z" fill="currentColor"/>
            <line x1="11" y1="3" x2="11" y2="19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="ba-slider__label ba-slider__label--before">Before</span>
      <span className="ba-slider__label ba-slider__label--after">After</span>
    </div>
  );
}
