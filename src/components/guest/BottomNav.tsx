'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Sparkles, Train } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { triggerHaptic } from '@/lib/haptics';

type ActiveView = 'home' | 'map' | 'chat' | 'transit';

interface BottomNavProps {
  activeView: ActiveView;
  brandColor: string;
  onChange: (view: ActiveView) => void;
}

const navItems: { id: ActiveView; labelKey: string; icon: typeof Home }[] = [
  { id: 'home', labelKey: 'nav.home', icon: Home },
  { id: 'map', labelKey: 'nav.discover', icon: Compass },
  { id: 'transit', labelKey: 'nav.transit', icon: Train },
  { id: 'chat', labelKey: 'nav.guide', icon: Sparkles },
];

export default function BottomNav({ activeView, brandColor, onChange }: BottomNavProps) {
  const { t } = useLanguage();
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    if (activeView === 'home') {
      const timer1 = setTimeout(() => setShowNudge(true), 4000);
      const timer2 = setTimeout(() => setShowNudge(false), 14000);
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    } else {
      setShowNudge(false);
    }
  }, [activeView]);

  const handleNavClick = (id: ActiveView) => {
    if (activeView !== id) {
      triggerHaptic('light');
      onChange(id);
      if (id === 'chat') setShowNudge(false);
    }
  };

  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-40 bottom-6 mb-[env(safe-area-inset-bottom)] pointer-events-none flex justify-center w-full max-w-md mx-auto">
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto"
      >
        <div className="glass-pill px-2 py-2 flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          const label = t(item.labelKey);

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleNavClick(item.id)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-colors duration-300"
              aria-label={label}
            >
              {/* Active indicator background */}
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: `${brandColor}18` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}

              <Icon
                className="w-[18px] h-[18px] relative z-10 transition-colors duration-300"
                style={{ color: isActive ? brandColor : 'rgba(245,240,235,0.4)' }}
                strokeWidth={isActive ? 2 : 1.5}
              />

              {/* Expand label for active item */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="relative z-10 text-xs font-medium overflow-hidden whitespace-nowrap"
                    style={{ color: brandColor }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Context-Aware AI Nudge */}
              <AnimatePresence>
                {item.id === 'chat' && showNudge && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute bottom-[calc(100%+12px)] right-0 w-max px-3.5 py-2.5 rounded-2xl bg-[#1A1A1A]/95 backdrop-blur-md border border-white/10 text-xs text-white/90 font-sans shadow-xl pointer-events-none"
                  >
                    Looking for local tips? ✨
                    {/* Triangle pointer */}
                    <svg className="absolute -bottom-2 right-6 w-4 h-2 text-[#1A1A1A]/95" viewBox="0 0 16 8" fill="currentColor">
                      <path d="M8 8L0 0H16L8 8Z" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      </motion.nav>
    </div>
  );
}
