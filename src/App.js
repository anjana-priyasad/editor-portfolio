import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Cursor       from './components/Cursor';
import Header       from './components/Header';
import MobileNav    from './components/MobileNav';
import Hero         from './components/Hero';
import About        from './components/About';
import Difference   from './components/Difference';
import Portfolio    from './components/Portfolio';
import Services     from './components/Services';
import Testimonials from './components/Testimonials';
import Contact      from './components/Contact';
import Footer       from './components/Footer';
import './App.css';
import './mobile.css';

function App() {
  const [contactOpen, setContactOpen] = useState(false);

  /* Navigate to a section — close contact overlay first if open */
  const navigateTo = (sectionId) => {
    if (contactOpen) {
      setContactOpen(false);
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 480);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Cursor />

      <div className="App">
        <Header
          onContactOpen={() => setContactOpen(true)}
          onNavigate={navigateTo}
        />
        <main>
          <Hero />
          <About />
          <Difference />
          <Portfolio />
          <Services />
          <Testimonials />
        </main>
        <Footer onContactOpen={() => setContactOpen(true)} />
      </div>

      {/* App-like bottom nav — mobile only */}
      <MobileNav onContactOpen={() => setContactOpen(true)} />

      {/* Contact page overlay */}
      <AnimatePresence>
        {contactOpen && (
          <Contact key="contact" onClose={() => setContactOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
