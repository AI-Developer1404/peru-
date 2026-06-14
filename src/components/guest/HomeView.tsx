'use client';

import { motion } from 'framer-motion';
import { Compass, Sparkles, Wifi, Mountain, Clock, MapPin, Train } from 'lucide-react';
import type { Hotel } from '@/lib/types';
import TipsCarousel from '@/components/guest/TipsCarousel';

interface HomeViewProps {
  hotel: Hotel;
  brandColor: string;
  onExploreMap: () => void;
  onOpenChat: () => void;
  onShowWifi: () => void;
  onOpenTransit: () => void;
}

// Staggered reveal animation
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.8 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomeView({ hotel, brandColor, onExploreMap, onOpenChat, onShowWifi, onOpenTransit }: HomeViewProps) {
  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen min-h-dvh flex flex-col items-center px-6 text-center pt-[18vh] pb-32"
    >
      {/* Subheading */}
      <motion.p
        variants={fadeUp}
        className="text-[10px] tracking-[0.4em] uppercase mb-5 font-sans font-medium"
        style={{ color: 'var(--accent-color)' }}
      >
        Your stay at
      </motion.p>

      {/* Hotel Name — Playfair Display */}
      <motion.h1
        variants={fadeUp}
        className="font-serif font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-4 max-w-2xl tracking-tight"
      >
        {hotel.name}
      </motion.h1>

      {/* Decorative divider */}
      <motion.div
        variants={fadeUp}
        className="w-16 h-px mb-7"
        style={{
          background: `linear-gradient(90deg, transparent, var(--brand-color), transparent)`,
        }}
      />

      {/* Tagline */}
      <motion.p
        variants={fadeUp}
        className="font-light text-sm sm:text-base max-w-lg mb-8 leading-relaxed font-sans"
        style={{ color: 'var(--text-secondary)' }}
      >
        Everything you need for an unforgettable experience —
        hand-picked recommendations, live transit info, and your personal AI travel assistant.
      </motion.p>

      {/* CTA Buttons — 3 actions */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mb-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onExploreMap}
          className="btn-brand w-full sm:w-auto"
        >
          <Compass className="w-4 h-4" />
          Discover Cusco
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onOpenTransit}
          className="btn-ghost w-full sm:w-auto"
        >
          <Train className="w-4 h-4" />
          Tours & Transit
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onOpenChat}
          className="btn-ghost w-full sm:w-auto"
        >
          <Sparkles className="w-4 h-4" />
          Ask Your Guide
        </motion.button>
      </motion.div>

      {/* Quick Info Cards */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap justify-center gap-3 mb-6"
      >
        <div className="glass-pill px-4 py-2 flex items-center gap-2 text-xs">
          <Mountain className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>3,400m altitude</span>
        </div>
        <div className="glass-pill px-4 py-2 flex items-center gap-2 text-xs">
          <Clock className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>GMT-5 · Peru</span>
        </div>
        <div className="glass-pill px-4 py-2 flex items-center gap-2 text-xs">
          <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Cusco, Peru</span>
        </div>
      </motion.div>

      {/* WiFi button */}
      {hotel.wifi_ssid && (
        <motion.button
          variants={fadeUp}
          whileTap={{ scale: 0.97 }}
          onClick={onShowWifi}
          className="flex items-center gap-2 text-xs transition-colors font-sans mb-10"
          style={{ color: 'var(--text-muted)' }}
        >
          <Wifi className="w-3.5 h-3.5" />
          Connect to WiFi
        </motion.button>
      )}

      {/* Tips Carousel — local travel tips */}
      <motion.div variants={fadeUp} className="w-full max-w-md">
        <TipsCarousel brandColor={brandColor} />
      </motion.div>
    </motion.main>
  );
}
