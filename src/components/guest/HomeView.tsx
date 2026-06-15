'use client';

import { motion } from 'framer-motion';
import { Compass, Sparkles, Wifi, Mountain, Clock, MapPin, Train } from 'lucide-react';
import type { Hotel } from '@/lib/types';
import TipsCarousel from '@/components/guest/TipsCarousel';
import { useLanguage } from './LanguageContext';

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
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomeView({ hotel, brandColor, onExploreMap, onOpenChat, onShowWifi, onOpenTransit }: HomeViewProps) {
  const { t } = useLanguage();

  return (
    <motion.main
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full h-screen overflow-y-auto hide-scrollbar flex flex-col items-center px-6 text-center pt-[18vh] pb-32"
    >
      {/* Subheading */}
      <motion.p
        variants={fadeUp}
        className="text-[10px] tracking-[0.4em] uppercase mb-5 font-sans font-medium"
        style={{ color: 'var(--accent-color)' }}
      >
        {t('home.subtitle')}
      </motion.p>

      {/* Hotel Name — Playfair Display */}
      <motion.h1
        variants={fadeUp}
        className="font-serif font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-4 max-w-2xl tracking-tight"
        style={{ textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
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
        className="font-light text-sm sm:text-base max-w-lg mb-10 leading-relaxed font-sans drop-shadow-md"
        style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
      >
        {t('home.tagline')}
      </motion.p>

      {/* CTA Navigation Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mb-10">
        <button 
          onClick={onExploreMap}
          className="glass p-5 rounded-2xl flex flex-col items-center justify-center gap-3 col-span-1 sm:col-span-2 hover:bg-white/10 transition-colors"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `rgba(var(--brand-rgb), 0.15)` }}>
            <Compass className="w-6 h-6" style={{ color: 'var(--brand-color)' }} />
          </div>
          <span className="font-medium font-sans" style={{ color: 'var(--text-primary)' }}>{t('home.btn.discover')}</span>
        </button>

        <button 
          onClick={onOpenTransit}
          className="glass p-5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5">
            <Train className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <span className="font-medium text-sm font-sans" style={{ color: 'var(--text-primary)' }}>{t('home.btn.transit')}</span>
        </button>

        <button 
          onClick={onOpenChat}
          className="glass p-5 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5">
            <Sparkles className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <span className="font-medium text-sm font-sans" style={{ color: 'var(--text-primary)' }}>{t('home.btn.guide')}</span>
        </button>
      </motion.div>

      {/* Quick Info Cards */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap justify-center gap-3 mb-6"
      >
        <div className="glass-pill px-4 py-2 flex items-center gap-2 text-xs">
          <Mountain className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>3,400m {t('home.altitude')}</span>
        </div>
        <div className="glass-pill px-4 py-2 flex items-center gap-2 text-xs">
          <Clock className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>GMT-5 · Perú</span>
        </div>
        <div className="glass-pill px-4 py-2 flex items-center gap-2 text-xs">
          <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--accent-color)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Cusco, Perú</span>
        </div>
      </motion.div>

      {/* WiFi button */}
      {hotel.wifi_ssid && (
        <motion.button
          variants={fadeUp}
          whileTap={{ scale: 0.97 }}
          onClick={onShowWifi}
          className="glass-pill px-6 py-3.5 flex items-center justify-center gap-2.5 text-sm transition-colors font-sans font-medium mb-12 hover:bg-white/15"
          style={{ color: 'var(--text-primary)', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
        >
          <Wifi className="w-4 h-4" style={{ color: 'var(--brand-color)' }} />
          Connect to {hotel.name} Wi-Fi
        </motion.button>
      )}

      {/* Tips Carousel — local travel tips */}
      <motion.div variants={fadeUp} className="w-full max-w-md">
        <TipsCarousel brandColor={brandColor} />
      </motion.div>
    </motion.main>
  );
}
