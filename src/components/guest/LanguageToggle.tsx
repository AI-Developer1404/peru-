'use client';

import { motion } from 'framer-motion';
import { useLanguage } from './LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="glass-pill flex items-center p-1 relative z-50">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          language === 'en' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('es')}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          language === 'es' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'
        }`}
      >
        ES
      </button>
    </div>
  );
}
