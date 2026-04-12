import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import gayanFull from '../assets/gayan 01.png';
import WaterRipplePhoto from './WaterRipplePhoto';
import './About.css';
import './Hero.css'; /* Re-using the Hero CSS for the right column styles */

const LETTERS = ['G', 'A', 'Y', 'A', 'N'];

const letterVariants = {
  hidden:  { opacity: 0, y: 36 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.18 + i * 0.11, duration: 0.78, ease: [0.22, 1, 0.36, 1] },
  }),
};
const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0,
    transition: { delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
});

export default function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const waterY    = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const gayanY    = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  
  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-10% 0px" });

  return (
    <section id="about" className="about-section" ref={containerRef}>
      <div className="hero-grid" ref={inViewRef} style={{ alignItems: 'center' }}>
        
        {/* Left Side: About Text */}
        <div className="hero-left px-8">
          <motion.div variants={fadeUp(0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <span className="section-eyebrow section-eyebrow--dark mb-4">The Artist</span>
            <h2 className="section-title section-title--dark mb-8 text-4xl">Hi</h2>
            <div className="about__ornament mb-8">
              <span className="about__ornament-line" />
              <span className="about__ornament-diamond" />
            </div>
            <div className="about__bio-text space-y-6 text-gray-600">
              <p>
                I am Gayan C. Silva — a wedding photo editor and retoucher with over eight years of experience crafting visual narratives for couples across four continents. My philosophy is rooted in the belief that a wedding photograph should feel as profound as the moment it captures.
              </p>
              <p>
                My style bridges the warmth of film photography with the precision of digital artistry. I work with natural textures, rich tones, and the subtle poetry of available light — treating each image not as a record, but as a chapter in a story that will be treasured for generations.
              </p>
              <p>
                I collaborate exclusively with discerning photographers and studios who share a commitment to the extraordinary. Every gallery I touch receives the same unwavering attention to detail, from the first frame to the last.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Reusing Gayan Portrait / Typography scene */}
        <div className="hero-right">
          <div className="hero-scene-container">
            <div className="hero-circle-accent">
              <div className="hero-circle-inner" />
            </div>

            <div className="hero-scene">
              <div className="hero-bracket hero-bracket--tl" />
              <div className="hero-bracket hero-bracket--tr" />
              <div className="hero-bracket hero-bracket--bl" />
              <div className="hero-bracket hero-bracket--br" />

              <motion.div style={{ y: waterY }} className="hero-watermark-c">
                G C S
              </motion.div>

              <motion.div style={{ y: gayanY }} className="hero-gayan">
                {LETTERS.map((l, i) => (
                  <motion.span
                    key={i}
                    variants={letterVariants}
                    custom={i}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    className="hero-gayan-letter"
                  >
                    {l}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                style={{ y: portraitY }}
                className="hero-portrait-wrap"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.35, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <WaterRipplePhoto src={gayanFull} className="hero-portrait-canvas" />
              </motion.div>
            </div>
          </div>

          <div className="hero-footer relative mt-8">
            <motion.div className="hero-bottom-meta" variants={fadeUp(0.65)} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
              <div className="hero-csilva">
                <span className="hero-csilva-c">C.</span>
                <span className="hero-csilva-silva">SILVA</span>
              </div>
              <motion.div className="flex items-center justify-start w-full mt-4 pl-2 opacity-90"
                variants={fadeUp(0.75)} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
                <span className="text-[16px] italic text-[#777777]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Premium <span className="uppercase tracking-[0.4em] ml-3 text-[11px] font-sans font-medium text-[#444444] not-italic">Photo Editor</span>
                </span>
                <div className="flex-1 h-[1px] bg-[#888888]/30 ml-6 mr-10 relative">
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border border-[#888888]/70 rotate-45"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
