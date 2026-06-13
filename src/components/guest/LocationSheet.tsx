'use client';

import { motion } from 'framer-motion';
import { X, Play, Pause, ExternalLink, Share2, MapPin } from 'lucide-react';
import { useState, useRef } from 'react';
import type { Location } from '@/lib/types';

interface LocationSheetProps {
  location: Location;
  brandColor: string;
  onClose: () => void;
}

// Type labels for display
const TYPE_LABELS: Record<string, string> = {
  ruins: 'Historical Site',
  attraction: 'Attraction',
  museum: 'Museum',
  restaurant: 'Restaurant',
  cafe: 'Café',
  bar: 'Bar',
  tour: 'Guided Tour',
  transport: 'Transport',
  market: 'Market',
  shopping: 'Shopping',
  viewpoint: 'Viewpoint',
  nature: 'Nature',
  park: 'Park',
  spa: 'Wellness',
  wellness: 'Wellness',
};

export default function LocationSheet({ location, brandColor, onClose }: LocationSheetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleShare = async () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    if (navigator.share) {
      await navigator.share({
        title: location.name,
        text: location.description ?? `Check out ${location.name}`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 glass-heavy rounded-t-3xl max-h-[85vh] overflow-y-auto"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-8 h-1 rounded-full bg-white/15" />
        </div>

        {/* Hero Image */}
        {location.image_url && (
          <div className="mx-4 mt-1 mb-4 rounded-2xl overflow-hidden aspect-[16/9] relative">
            <img
              src={location.image_url}
              alt={location.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}

        <div className="px-6 pb-8 pt-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-serif font-medium text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
                {location.name}
              </h2>
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] uppercase font-sans font-medium px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${brandColor}15`, color: brandColor }}
                >
                  <MapPin className="w-2.5 h-2.5" />
                  {TYPE_LABELS[location.type] || location.type}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <Share2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </motion.button>
            </div>
          </div>

          {/* Description */}
          {location.description && (
            <p
              className="text-sm leading-relaxed mb-6 font-sans font-light"
              style={{ color: 'var(--text-secondary)' }}
            >
              {location.description}
            </p>
          )}

          {/* Audio Guide */}
          {location.audio_guide_url && (
            <div className="glass p-4 flex items-center gap-4 mb-5">
              <audio
                ref={audioRef}
                src={location.audio_guide_url}
                onEnded={() => setIsPlaying(false)}
              />
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={toggleAudio}
                className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${brandColor}cc, ${brandColor})` }}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" style={{ color: 'var(--bg-deep)' }} />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" style={{ color: 'var(--bg-deep)' }} />
                )}
              </motion.button>
              <div>
                <p className="text-sm font-sans font-medium" style={{ color: 'var(--text-primary)' }}>Audio Guide</p>
                <p className="text-[11px] font-sans" style={{ color: 'var(--text-muted)' }}>Tap to listen</p>
              </div>
            </div>
          )}

          {/* Directions link */}
          <motion.a
            whileTap={{ scale: 0.97 }}
            href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand w-full text-center"
          >
            <ExternalLink className="w-4 h-4" />
            Navigate Here
          </motion.a>
        </div>
      </motion.div>
    </>
  );
}
