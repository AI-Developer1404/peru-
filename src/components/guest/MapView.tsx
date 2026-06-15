'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Navigation } from 'lucide-react';
import type { Location } from '@/lib/types';
import { useLanguage } from './LanguageContext';

interface MapViewProps {
  locations: Location[];
  brandColor: string;
  onSelectLocation: (location: Location) => void;
  onBack: () => void;
}

// Category config with emoji & translation keys
const CATEGORIES: { key: string; labelKey: string; emoji: string }[] = [
  { key: 'all', labelKey: 'map.cat.all', emoji: '📍' },
  { key: 'ruins', labelKey: 'map.cat.ruins', emoji: '🏛️' },
  { key: 'attraction', labelKey: 'map.cat.culture', emoji: '⭐' },
  { key: 'restaurant', labelKey: 'map.cat.dining', emoji: '🍽️' },
  { key: 'cafe', labelKey: 'map.cat.cafes', emoji: '☕' },
  { key: 'tour', labelKey: 'map.cat.tours', emoji: '🚌' },
  { key: 'transport', labelKey: 'map.cat.transit', emoji: '🚂' },
  { key: 'market', labelKey: 'map.cat.markets', emoji: '🛍️' },
  { key: 'viewpoint', labelKey: 'map.cat.views', emoji: '🏔️' },
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

export default function MapView({ locations, brandColor, onSelectLocation, onBack }: MapViewProps) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

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

  // Update markers helper
  const updateMarkers = useCallback((L: any, map: any, group: any) => {
    if (!L || !map || !group) return;
    group.clearLayers();

    filteredLocations.forEach((loc) => {
      const customIcon = L.divIcon({
        html: `<div class="relative cursor-pointer group flex items-center justify-center">
                 <span class="flex items-center justify-center w-9 h-9 rounded-full text-base shadow-lg border-2 border-white/20 hover:border-white/50 hover:scale-110 transition-all duration-300"
                       style="background-color: rgba(12, 10, 20, 0.8); backdrop-filter: blur(8px); box-shadow: 0 0 16px ${brandColor}44;">
                   ${getTypeEmoji(loc.type)}
                 </span>
                 <span class="absolute whitespace-nowrap text-[11px] font-sans font-medium px-2.5 py-1 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -top-9"
                       style="background-color: rgba(12, 10, 20, 0.85); backdrop-filter: blur(12px); color: var(--text-primary); z-index: 1000;">
                   ${loc.name}
                 </span>
               </div>`,
        className: 'custom-leaflet-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });
      marker.on('click', () => {
        onSelectLocation(loc);
        map.setView([loc.lat, loc.lng], 15, { animate: true });
      });
      marker.addTo(group);
    });
  }, [filteredLocations, brandColor, onSelectLocation]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const container = mapRef.current;
    
    // Cleanup any existing map instance to prevent "Map container is already initialized" error during hot reloads
    if ((container as any)._leaflet_id) {
      container.innerHTML = '';
      (container as any)._leaflet_id = null;
    }

    // Dynamically inject Leaflet stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    
    // Only append if it doesn't exist
    if (!document.head.querySelector('link[href*="leaflet.css"]')) {
      document.head.appendChild(link);
    }

    let mapInstance: any;

    import('leaflet').then((L) => {
      LRef.current = L;

      // Create Leaflet map instance
      mapInstance = L.map(container, {
        center: [center.lat, center.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = mapInstance;

      // Add CartoDB Voyager tile layer for a clean, recognizable, trustworthy look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
      }).addTo(mapInstance);

      // Create a layer group for markers
      const markersGroup = L.layerGroup().addTo(mapInstance);
      markersGroupRef.current = markersGroup;

      // Initial render of markers
      updateMarkers(L, mapInstance, markersGroup);
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
      // Clean up link only if we added it (might be used by other instances, but safe for now)
      if (link.parentNode && !document.head.querySelector('link[href*="leaflet.css"]')) {
        link.parentNode.removeChild(link);
      }
    };
  }, [center, updateMarkers]);

  // Sync markers when filteredLocations change
  useEffect(() => {
    updateMarkers(LRef.current, mapInstanceRef.current, markersGroupRef.current);
  }, [updateMarkers]);

  return (
    <div className="relative w-full h-full rounded-2xl border border-white/10 overflow-hidden">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.93 }}
        onClick={onBack}
        className="absolute top-5 left-5 z-20 glass-pill px-4 py-2.5 flex items-center gap-2 text-sm transition-colors"
        style={{ color: 'var(--text-secondary)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        {t('map.back')}
      </motion.button>

      {/* Location count */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute top-5 right-5 z-20 glass-pill px-4 py-2.5 flex items-center gap-2 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        <Navigation className="w-3 h-3" />
        {filteredLocations.length} {t('map.places')}
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-28 left-0 right-0 z-20 overflow-x-auto hide-scrollbar"
      >
        <div className="flex gap-2 pb-2 px-5 w-max">
          {availableCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={(e) => {
                setActiveCategory(cat.key);
                e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }}
              className={`category-pill flex items-center gap-1.5 transition-transform ${activeCategory === cat.key ? 'active scale-105' : ''}`}
            >
              <span className="text-sm">{cat.emoji}</span>
              {t(cat.labelKey)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Scrollable Location Cards */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-4 left-0 right-0 z-20 overflow-x-auto hide-scrollbar snap-x snap-mandatory"
      >
        <div className="flex gap-3 pb-2 px-5 w-max">
          <AnimatePresence mode="popLayout">
            {filteredLocations.map((loc) => (
              <motion.button
                key={loc.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  onSelectLocation(loc);
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([loc.lat, loc.lng], 15, { animate: true });
                  }
                }}
                className="glass flex items-center gap-3 p-2.5 pr-4 text-left min-w-[200px] max-w-[240px] rounded-[20px] hover:border-white/30 transition-all snap-center shadow-2xl backdrop-blur-xl"
              >
                {loc.image_url && (
                  <img
                    src={loc.image_url}
                    alt={loc.name}
                    className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {loc.name}
                  </p>
                  <p className="text-[10px] capitalize mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {getTypeEmoji(loc.type)} {loc.type}
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full z-10" style={{ background: 'var(--bg-deep)' }} />
    </div>
  );
}
