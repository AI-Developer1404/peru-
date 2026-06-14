'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Sparkles, Train } from 'lucide-react';

type ActiveView = 'home' | 'map' | 'chat' | 'transit';

interface BottomNavProps {
  activeView: ActiveView;
  brandColor: string;
  onChange: (view: ActiveView) => void;
}

const navItems: { id: ActiveView; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'map', label: 'Discover', icon: Compass },
  { id: 'transit', label: 'Transit', icon: Train },
  { id: 'chat', label: 'Guide', icon: Sparkles },
];

export default function BottomNav({ activeView, brandColor, onChange }: BottomNavProps) {
  return (
    <motion.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
    >
      <div className="glass-pill px-2 py-2 flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => onChange(item.id)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-colors duration-300"
              aria-label={item.label}
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
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
