'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Bus, Train, Car, Clock, MapPin, ExternalLink, AlertTriangle } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface TransitPanelProps {
  brandColor: string;
  onBack: () => void;
}

interface TransitRoute {
  id: string;
  icon: typeof Bus;
  name: string;
  type: 'bus' | 'train' | 'taxi';
  description: string;
  schedule: string;
  price: string;
  duration: string;
  bookingUrl?: string;
  tip?: string;
}

const TRANSIT_ROUTES: TransitRoute[] = [
  {
    id: 'sacred-valley',
    icon: Bus,
    name: 'Sacred Valley Day Tour',
    type: 'bus',
    description: 'Full-day guided tour: Pisac ruins & market, Ollantaytambo fortress, and Chinchero weaving community. Includes lunch.',
    schedule: 'Daily departure at 8:00 AM · Returns ~6:00 PM',
    price: '~120 PEN (€30) per person',
    duration: '10 hours',
    tip: 'Book at reception the evening before. Bring sunscreen and a warm layer.',
  },
  {
    id: 'perurail-expedition',
    icon: Train,
    name: 'PeruRail Expedition → Machu Picchu',
    type: 'train',
    description: 'Scenic train from Poroy station through the Urubamba valley to Aguas Calientes. Large panoramic windows.',
    schedule: 'Departures: 6:10 AM · 7:45 AM · 8:25 AM',
    price: 'From USD $79 one-way',
    duration: '3h 30min',
    bookingUrl: 'https://www.perurail.com',
    tip: 'Book at least 1 week ahead during peak season (Jun–Aug). Poroy station is 20 min by taxi.',
  },
  {
    id: 'perurail-vistadome',
    icon: Train,
    name: 'PeruRail Vistadome → Machu Picchu',
    type: 'train',
    description: 'Premium service with larger panoramic windows, onboard snacks, live entertainment, and traditional dance performance.',
    schedule: 'Departures: 7:05 AM · 8:55 AM',
    price: 'From USD $99 one-way',
    duration: '3h 30min',
    bookingUrl: 'https://www.perurail.com',
    tip: 'Sit on the left side for the best valley views.',
  },
  {
    id: 'rainbow-mountain',
    icon: Bus,
    name: 'Rainbow Mountain (Vinicunca)',
    type: 'bus',
    description: 'Day trip to the colorful Vinicunca mountain at 5,200m altitude. Includes transport, guide, and basic breakfast.',
    schedule: 'Pickup at 4:00 AM · Returns ~5:00 PM',
    price: '~100 PEN (€25) per person',
    duration: '13 hours',
    tip: 'Only attempt after 2–3 days of acclimatization. Very strenuous. Bring coca candy.',
  },
  {
    id: 'taxi',
    icon: Car,
    name: 'Taxi & Uber in Cusco',
    type: 'taxi',
    description: 'Taxis are plentiful in the center. Uber also operates in Cusco and is generally reliable.',
    schedule: 'Available 24/7',
    price: '5–10 PEN within the center · 15–20 PEN to airport',
    duration: 'Varies',
    tip: 'Always agree on the price before getting in a taxi. Use official taxis or Uber at night.',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const typeColors: Record<string, string> = {
  bus: '#D4956A',
  train: '#7C9EB2',
  taxi: '#B8A471',
};

export default function TransitPanel({ brandColor, onBack }: TransitPanelProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col w-full h-full rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'var(--bg-elevated)', backdropFilter: 'blur(40px)' }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-white/[0.06]">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        </motion.button>
        <div>
          <p className="text-sm font-sans font-medium" style={{ color: 'var(--text-primary)' }}>{t('transit.title')}</p>
          <p className="text-[11px] font-sans" style={{ color: 'var(--text-muted)' }}>{t('transit.subtitle')}</p>
        </div>
      </div>

      {/* Routes list */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto px-5 py-5 space-y-4"
      >
        {TRANSIT_ROUTES.map((route) => {
          const Icon = route.icon;
          const accentColor = typeColors[route.type] || brandColor;

          return (
            <motion.div
              key={route.id}
              variants={fadeUp}
              className="glass p-5 space-y-3"
            >
              {/* Title row */}
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${accentColor}18` }}
                >
                  <Icon className="w-4 h-4" style={{ color: accentColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-sans font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    {route.name}
                  </h3>
                  <p className="text-xs leading-relaxed font-sans" style={{ color: 'var(--text-secondary)' }}>
                    {route.description}
                  </p>
                </div>
              </div>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2">
                <span className="glass-pill px-3 py-1.5 text-[10px] flex items-center gap-1.5">
                  <Clock className="w-3 h-3" style={{ color: 'var(--accent-color)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{route.schedule}</span>
                </span>
                <span className="glass-pill px-3 py-1.5 text-[10px] flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" style={{ color: 'var(--accent-color)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{route.duration}</span>
                </span>
              </div>

              {/* Price */}
              <p className="text-xs font-sans font-medium" style={{ color: accentColor }}>
                {route.price}
              </p>

              {/* Tip */}
              {route.tip && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: 'rgba(var(--brand-rgb), 0.06)' }}>
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-color)' }} />
                  <p className="text-[11px] leading-relaxed font-sans" style={{ color: 'var(--text-secondary)' }}>
                    {route.tip}
                  </p>
                </div>
              )}

              {/* Booking link */}
              {route.bookingUrl && (
                <a
                  href={route.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium transition-opacity hover:opacity-80"
                  style={{ color: accentColor }}
                >
                  <ExternalLink className="w-3 h-3" />
                  {t('transit.book')} →
                </a>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
