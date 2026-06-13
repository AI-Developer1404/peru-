'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Navigation } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Location } from '@/lib/types';

interface MapViewProps {
  locations: Location[];
  brandColor: string;
  onSelectLocation: (location: Location) => void;
  onBack: () => void;
}

// Category config with emoji & labels
const CATEGORIES: { key: string; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '📍' },
  { key: 'ruins', label: 'Ruins', emoji: '🏛️' },
  { key: 'attraction', label: 'Culture', emoji: '⭐' },
  { key: 'restaurant', label: 'Dining', emoji: '🍽️' },
  { key: 'cafe', label: 'Cafés', emoji: '☕' },
  { key: 'tour', label: 'Tours', emoji: '🚌' },
  { key: 'transport', label: 'Transit', emoji: '🚂' },
  { key: 'market', label: 'Markets', emoji: '🛍️' },
  { key: 'viewpoint', label: 'Views', emoji: '🏔️' },
];

// Get emoji for a location type
function getTypeEmoji(type: string): string {
  const map: Record<string, string> = {
    ruins: '🏛️',
    attraction: '⭐',
    museum: '🏛️',
    restaurant: '🍽️',
    cafe: '☕',
    bar: '🍸',
    tour: '🚌',
    transport: '🚂',
    market: '🛍️',
    shopping: '🛍️',
    viewpoint: '🏔️',
    nature: '🌿',
    park: '🌿',
    spa: '💆',
    wellness: '💆',
  };
  return map[type] || '📍';
}

// Dark map styling via Map ID or inline styles
const DARK_MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || undefined;

export default function MapView({ locations, brandColor, onSelectLocation, onBack }: MapViewProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredLocations = useMemo(() => {
    if (activeCategory === 'all') return locations;
    return locations.filter((l) => l.type === activeCategory);
  }, [locations, activeCategory]);

  // Calculate center from locations
  const center = useMemo(() => {
    if (locations.length === 0) return { lat: -13.516, lng: -71.9785 };
    const avgLat = locations.reduce((s, l) => s + l.lat, 0) / locations.length;
    const avgLng = locations.reduce((s, l) => s + l.lng, 0) / locations.length;
    return { lat: avgLat, lng: avgLng };
  }, [locations]);

  // Available categories based on actual data
  const availableCategories = useMemo(() => {
    const types = new Set(locations.map((l) => l.type));
    return CATEGORIES.filter((c) => c.key === 'all' || types.has(c.key));
  }, [locations]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="relative w-full h-full rounded-2xl border border-white/10 overflow-hidden">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.93 }}
        onClick={onBack}
        className="absolute top-5 left-5 z-10 glass-pill px-4 py-2.5 flex items-center gap-2 text-sm transition-colors"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </motion.button>

      {/* Location count */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute top-5 right-5 z-10 glass-pill px-4 py-2.5 flex items-center gap-2 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        <Navigation className="w-3 h-3" />
        {filteredLocations.length} places to explore
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-28 left-0 right-0 z-10 px-5 overflow-x-auto"
      >
        <div className="flex gap-2 pb-2 w-max mx-auto">
          {availableCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`category-pill flex items-center gap-1.5 ${activeCategory === cat.key ? 'active' : ''}`}
            >
              <span className="text-sm">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Scrollable Location Cards */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-4 left-0 right-0 z-10 px-5 overflow-x-auto"
      >
        <div className="flex gap-3 pb-2 w-max">
          <AnimatePresence mode="popLayout">
            {filteredLocations.map((loc) => (
              <motion.button
                key={loc.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectLocation(loc)}
                className="glass flex items-center gap-3 px-4 py-3 text-left min-w-[220px] max-w-[260px] hover:border-white/20 transition-colors"
              >
                {loc.image_url && (
                  <img
                    src={loc.image_url}
                    alt={loc.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {loc.name}
                  </p>
                  <p className="text-[10px] capitalize" style={{ color: 'var(--text-muted)' }}>
                    {getTypeEmoji(loc.type)} {loc.type}
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Google Maps */}
      {apiKey ? (
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={center}
            defaultZoom={14}
            mapId={DARK_MAP_ID}
            gestureHandling="greedy"
            disableDefaultUI={true}
            style={{ width: '100%', height: '100%' }}
            colorScheme="DARK"
          >
            {filteredLocations.map((loc, index) => (
              <AdvancedMarker
                key={loc.id}
                position={{ lat: loc.lat, lng: loc.lng }}
                onClick={() => onSelectLocation(loc)}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: 0.3 + index * 0.05,
                  }}
                  className="relative cursor-pointer group"
                >
                  {/* Marker circle with emoji */}
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-full text-base shadow-lg border-2 border-white/20 group-hover:border-white/50 group-hover:scale-110 transition-all duration-300"
                    style={{
                      backgroundColor: 'rgba(12, 10, 20, 0.8)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: `0 0 16px ${brandColor}44`,
                    }}
                  >
                    {getTypeEmoji(loc.type)}
                  </span>

                  {/* Hover label */}
                  <span
                    className="absolute left-1/2 -translate-x-1/2 -top-9 whitespace-nowrap text-[11px] font-sans font-medium px-2.5 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      backgroundColor: 'rgba(12, 10, 20, 0.85)',
                      backdropFilter: 'blur(12px)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {loc.name}
                  </span>
                </motion.div>
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      ) : (
        /* Fallback when no API key */
        <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--bg-deep)' }}>
          <div className="text-center px-8">
            <p className="text-lg font-serif mb-3" style={{ color: 'var(--text-primary)' }}>Map Loading...</p>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Add your Google Maps API key to <code className="px-1.5 py-0.5 rounded glass text-[10px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in <code className="px-1.5 py-0.5 rounded glass text-[10px]">.env.local</code> to enable the interactive map.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
