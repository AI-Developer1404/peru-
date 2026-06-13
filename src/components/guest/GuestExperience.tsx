'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, MapPin, MessageCircle, Wifi, Volume2 } from 'lucide-react';
import type { Hotel, Location } from '@/lib/types';
import { hexToRgb, lightenColor, darkenColor } from '@/lib/utils';
import MapView from '@/components/guest/MapView';
import AIConcierge from '@/components/guest/AIConcierge';
import LocationSheet from '@/components/guest/LocationSheet';

interface GuestExperienceProps {
  hotel: Hotel;
  locations: Location[];
}

export default function GuestExperience({ hotel, locations }: GuestExperienceProps) {
  const [activeSection, setActiveSection] = useState<'home' | 'map' | 'chat'>('home');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showWifi, setShowWifi] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Apply brand color as CSS custom properties
  const brandStyle = {
    '--brand-color': hotel.brand_color,
    '--brand-color-light': lightenColor(hotel.brand_color, 0.15),
    '--brand-color-dark': darkenColor(hotel.brand_color, 0.15),
    '--brand-rgb': hexToRgb(hotel.brand_color),
  } as React.CSSProperties;

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div style={brandStyle} className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      {hotel.background_video_url && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-10"
          poster=""
        >
          <source src={hotel.background_video_url} type="video/mp4" />
        </video>
      )}

      {/* Video overlay gradient */}
      <div className="video-overlay fixed inset-0 -z-[5]" />

      {/* Welcome Audio (hidden) */}
      {hotel.welcome_audio_url && (
        <audio ref={audioRef} src={hotel.welcome_audio_url} onEnded={() => setIsAudioPlaying(false)} />
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeSection === 'home' && (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6"
          >
            {/* Logo */}
            {hotel.logo_url && (
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                src={hotel.logo_url}
                alt={`${hotel.name} logo`}
                className="w-20 h-20 md:w-24 md:h-24 object-contain mb-8 drop-shadow-2xl"
              />
            )}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4"
            >
              Welcome to
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="font-serif text-4xl md:text-6xl font-medium text-center tracking-tight leading-[1.1] mb-4"
            >
              {hotel.name}
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="w-16 h-px mb-8"
              style={{ background: `linear-gradient(90deg, transparent, ${hotel.brand_color}, transparent)` }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-white/50 text-center max-w-md mb-12 font-light"
            >
              Your personal digital concierge. Explore curated local experiences, get directions, and ask our AI assistant anything.
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
            >
              <button
                onClick={() => setActiveSection('map')}
                className="btn-brand flex-1"
              >
                <MapPin className="w-4 h-4" />
                Explore Map
              </button>
              <button
                onClick={() => setActiveSection('chat')}
                className="btn-ghost flex-1"
              >
                <MessageCircle className="w-4 h-4" />
                AI Concierge
              </button>
            </motion.div>
          </motion.main>
        )}

        {activeSection === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen"
          >
            <MapView
              locations={locations}
              brandColor={hotel.brand_color}
              onSelectLocation={setSelectedLocation}
              onBack={() => setActiveSection('home')}
            />
          </motion.div>
        )}

        {activeSection === 'chat' && (
          <motion.div
            key="chat"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative min-h-screen"
          >
            <AIConcierge
              hotelId={hotel.id}
              hotelName={hotel.name}
              brandColor={hotel.brand_color}
              onBack={() => setActiveSection('home')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Controls — always visible */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
        {/* Audio play button */}
        {hotel.welcome_audio_url && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: 'spring' }}
            onClick={toggleAudio}
            className="glass-card p-3 rounded-full hover:bg-white/10 transition-colors"
            aria-label={isAudioPlaying ? 'Pause audio' : 'Play welcome audio'}
          >
            {isAudioPlaying ? (
              <Pause className="w-5 h-5 text-white/80" />
            ) : (
              <Volume2 className="w-5 h-5 text-white/80" />
            )}
          </motion.button>
        )}

        {/* WiFi info button */}
        {hotel.wifi_ssid && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7, type: 'spring' }}
            onClick={() => setShowWifi(!showWifi)}
            className="glass-card p-3 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Show WiFi info"
          >
            <Wifi className="w-5 h-5 text-white/80" />
          </motion.button>
        )}

        {/* Navigation dots */}
        <div className="glass-card flex items-center gap-2 px-4 py-3 rounded-full">
          {(['home', 'map', 'chat'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeSection === section
                  ? 'w-6 rounded-full'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              style={activeSection === section ? { background: hotel.brand_color } : {}}
              aria-label={`Go to ${section}`}
            />
          ))}
        </div>
      </div>

      {/* WiFi Popup */}
      <AnimatePresence>
        {showWifi && hotel.wifi_ssid && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 glass-card-elevated p-6 min-w-[280px]"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-white/40 mb-3">WiFi Access</p>
            <div className="space-y-2">
              <div>
                <span className="text-white/50 text-sm">Network: </span>
                <span className="text-white font-medium">{hotel.wifi_ssid}</span>
              </div>
              <div>
                <span className="text-white/50 text-sm">Password: </span>
                <span className="text-white font-mono font-medium">{hotel.wifi_password}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Bottom Sheet */}
      <AnimatePresence>
        {selectedLocation && (
          <LocationSheet
            location={selectedLocation}
            brandColor={hotel.brand_color}
            onClose={() => setSelectedLocation(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
