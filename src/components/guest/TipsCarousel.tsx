'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Mountain, Shield, Coins, Droplets, Sun } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface TipsCarouselProps {
  brandColor: string;
}

interface TipCard {
  id: string;
  icon: typeof Mountain;
  title: string;
  items: string[];
  accentColor: string;
}

const TIPS: TipCard[] = [
  {
    id: 'altitude',
    icon: Mountain,
    title: 'Altitude Tips',
    accentColor: '#7C9EB2',
    items: [
      'Take it easy your first 24 hours — no strenuous activity',
      'Drink coca tea (mate de coca), available at reception',
      'Stay hydrated: aim for 3+ liters of water per day',
      'Avoid alcohol on your first night at altitude',
      'Wait 2–3 days before attempting Rainbow Mountain',
      'Headaches and mild nausea are normal — they pass',
    ],
  },
  {
    id: 'safety',
    icon: Shield,
    title: 'Safety & Essentials',
    accentColor: '#D4956A',
    items: [
      'Cusco is generally safe — but watch for pickpockets in crowds',
      'Use official taxis or Uber, especially after dark',
      'Keep valuables in the hotel safe, not on you',
      'Drink only bottled water — tap water is not safe',
      'The hotel has 24/7 security and a front desk',
      'Save the hotel phone number in your contacts',
    ],
  },
  {
    id: 'money',
    icon: Coins,
    title: 'Money & Tipping',
    accentColor: '#B8A471',
    items: [
      'Currency: Peruvian Sol (PEN). 1 EUR ≈ 4 soles',
      'Best exchange: banks on Plaza de Armas or ATMs (BCP)',
      'Tip 10% at restaurants — it\'s the local standard',
      'Round up taxi fares to the nearest sol',
      'Markets accept cash only — bring small bills',
      'Credit cards accepted at most restaurants and shops',
    ],
  },
  {
    id: 'weather',
    icon: Sun,
    title: 'Weather & Packing',
    accentColor: '#9BB07C',
    items: [
      'Dry season (May–Oct): sunny days, cold nights (2–15°C)',
      'Wet season (Nov–Apr): afternoon rain showers, warmer',
      'UV index is extreme at 3,400m — always wear sunscreen',
      'Bring layers: warm mornings, hot midday, cool evenings',
      'A rain jacket is essential year-round',
      'Comfortable walking shoes — cobblestone streets are steep',
    ],
  },
  {
    id: 'water',
    icon: Droplets,
    title: 'Food & Drink',
    accentColor: '#7C9EB2',
    items: [
      'Try ceviche, lomo saltado, and ají de gallina',
      'San Pedro Market has incredible fresh juices for 3 soles',
      'Chicharrón sandwiches are a local breakfast favorite',
      'Pisco Sour — Peru\'s national cocktail. Try it.',
      'Vegetarian? Try Green Point or The Meeting Place',
      'Street food is generally safe at busy stalls',
    ],
  },
];

export default function TipsCarousel({ brandColor }: TipsCarouselProps) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => setActiveIndex((i) => (i + 1) % TIPS.length);
  const goPrev = () => setActiveIndex((i) => (i - 1 + TIPS.length) % TIPS.length);

  const tip = TIPS[activeIndex];
  const Icon = tip.icon;

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium" style={{ color: 'var(--text-muted)' }}>
          {t('tips.title')}
        </p>
        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goPrev}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          </motion.button>
          <span className="text-[10px] font-sans tabular-nums mx-1" style={{ color: 'var(--text-muted)' }}>
            {activeIndex + 1}/{TIPS.length}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={goNext}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          </motion.button>
        </div>
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tip.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="glass p-5"
        >
          {/* Card header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${tip.accentColor}18` }}
            >
              <Icon className="w-4 h-4" style={{ color: tip.accentColor }} />
            </div>
            <h3 className="text-sm font-sans font-medium" style={{ color: 'var(--text-primary)' }}>
              {tip.title}
            </h3>
          </div>

          {/* Items */}
          <ul className="space-y-2.5">
            {tip.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className="w-1 h-1 rounded-full mt-[7px] flex-shrink-0"
                  style={{ backgroundColor: tip.accentColor }}
                />
                <span className="text-xs leading-relaxed font-sans" style={{ color: 'var(--text-secondary)' }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {TIPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-4 h-1.5' : 'w-1.5 h-1.5'
            }`}
            style={{
              backgroundColor: i === activeIndex ? brandColor : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
