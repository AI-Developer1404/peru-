'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VolumeX } from 'lucide-react';
import { hexToRgb, lightenColor, darkenColor } from '@/lib/utils';
import type { Hotel, Location } from '@/lib/types';
import BottomNav from '@/components/guest/BottomNav';
import HomeView from '@/components/guest/HomeView';
import MapView from '@/components/guest/MapView';
import AIConcierge from '@/components/guest/AIConcierge';
import ToursFeed from '@/components/guest/ToursFeed';
import LocationSheet from '@/components/guest/LocationSheet';
import WifiCard from '@/components/guest/WifiCard';

interface GuestLayoutProps {
  hotel: Hotel;
  locations: Location[];
}

type ActiveView = 'home' | 'map' | 'chat' | 'transit';

import { LanguageProvider } from './LanguageContext';
import LanguageToggle from './LanguageToggle';

function GuestLayoutContent({ hotel, locations }: GuestLayoutProps) {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showWifi, setShowWifi] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Dynamic brand CSS variables
  const brandVars = {
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
      audioRef.current.play().catch(() => {});
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  // Spring transition for slide-overs
  const slideUpSpring = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 35,
  };

  return (
    <div style={brandVars} className="relative min-h-screen min-h-dvh font-sans overflow-hidden">
      {/* ========== FULLSCREEN VIDEO ========== */}
      {hotel.background_video_url && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setIsVideoReady(true)}
          className="fixed top-0 left-0 w-screen h-screen object-cover -z-50"
          poster=""
        >
          <source src={hotel.background_video_url} type="video/mp4" />
        </video>
      )}

      {/* Cinematic gradient overlay */}
      <div className="fixed inset-0 -z-40 video-gradient pointer-events-none" />

      {/* Subtle ambient brand glow */}
      <div className="fixed inset-0 -z-30 pointer-events-none overflow-hidden">
        <div
          className="absolute -bottom-[30%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.05] blur-[180px]"
          style={{ background: `radial-gradient(circle, ${hotel.brand_color} 0%, transparent 70%)` }}
        />
      </div>

      {/* Hidden audio element */}
      {hotel.welcome_audio_url && (
        <audio
          ref={audioRef}
          src={hotel.welcome_audio_url}
          onEnded={() => setIsAudioPlaying(false)}
        />
      )}

      {/* ========== LANGUAGE TOGGLE ========== */}
      <div className="fixed top-6 left-6 z-50">
        <LanguageToggle />
      </div>

      {/* ========== FLOATING AUDIO WIDGET ========== */}
      {hotel.welcome_audio_url && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isVideoReady || !hotel.background_video_url ? 1 : 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          whileTap={{ scale: 0.93 }}
          onClick={toggleAudio}
          className="fixed top-6 right-6 z-50 w-11 h-11 rounded-full glass-pill flex items-center justify-center group"
          aria-label={isAudioPlaying ? 'Pause welcome audio' : 'Play welcome audio'}
        >
          {isAudioPlaying ? (
            <>
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ backgroundColor: hotel.brand_color }}
              />
              <div className="flex items-end gap-[2.5px] h-3.5">
                {[0.6, 0.3, 0.8, 0.5].map((d, i) => (
                  <motion.span
                    key={i}
                    animate={{ height: ['25%', '100%', '25%'] }}
                    transition={{ repeat: Infinity, duration: 1.1, delay: d, ease: 'easeInOut' }}
                    className="w-[2px] rounded-full"
                    style={{ backgroundColor: hotel.brand_color }}
                  />
                ))}
              </div>
            </>
          ) : (
            <VolumeX className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200 transition-colors" />
          )}
        </motion.button>
      )}

      {/* ========== VIEW CONTENT ========== */}
      <AnimatePresence mode="wait">
        {activeView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVideoReady || !hotel.background_video_url ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <HomeView
              hotel={hotel}
              brandColor={hotel.brand_color}
              onExploreMap={() => setActiveView('map')}
              onOpenChat={() => setActiveView('chat')}
              onShowWifi={() => setShowWifi(true)}
              onOpenTransit={() => setActiveView('transit')}
            />
          </motion.div>
        )}

        {activeView === 'map' && (
          <motion.div
            key="map"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={slideUpSpring}
            className="fixed top-4 left-4 right-4 bottom-24 md:top-6 md:left-6 md:right-6 md:bottom-28 z-20"
          >
            <MapView
              locations={locations}
              brandColor={hotel.brand_color}
              onSelectLocation={setSelectedLocation}
              onBack={() => setActiveView('home')}
            />
          </motion.div>
        )}

        {activeView === 'transit' && (
          <motion.div
            key="transit"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={slideUpSpring}
            className="fixed top-4 left-4 right-4 bottom-24 md:top-6 md:left-6 md:right-6 md:bottom-28 z-20"
          >
            <ToursFeed
              brandColor={hotel.brand_color}
              onBack={() => setActiveView('home')}
            />
          </motion.div>
        )}

        {activeView === 'chat' && (
          <motion.div
            key="chat"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={slideUpSpring}
            className="fixed top-4 left-4 right-4 bottom-24 md:top-6 md:left-6 md:right-6 md:bottom-28 z-20"
          >
            <AIConcierge
              hotelId={hotel.id}
              hotelName={hotel.name}
              brandColor={hotel.brand_color}
              onBack={() => setActiveView('home')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== BOTTOM NAV ========== */}
      <BottomNav
        activeView={activeView}
        brandColor={hotel.brand_color}
        onChange={setActiveView}
      />

      {/* ========== WIFI CARD ========== */}
      <AnimatePresence>
        {showWifi && hotel.wifi_ssid && (
          <WifiCard
            ssid={hotel.wifi_ssid}
            password={hotel.wifi_password ?? ''}
            onClose={() => setShowWifi(false)}
          />
        )}
      </AnimatePresence>

      {/* ========== LOCATION BOTTOM SHEET ========== */}
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

export default function GuestLayout(props: GuestLayoutProps) {
  return (
    <LanguageProvider>
      <GuestLayoutContent {...props} />
    </LanguageProvider>
  );
}
