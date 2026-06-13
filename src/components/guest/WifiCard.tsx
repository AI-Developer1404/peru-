'use client';

import { motion } from 'framer-motion';
import { X, Copy, Check, Wifi } from 'lucide-react';
import { useState } from 'react';

interface WifiCardProps {
  ssid: string;
  password: string;
  onClose: () => void;
}

export default function WifiCard({ ssid, password, onClose }: WifiCardProps) {
  const [copied, setCopied] = useState(false);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative glass-heavy p-8 w-full max-w-xs text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        </button>

        <div className="w-12 h-12 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.15)' }}>
          <Wifi className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
        </div>

        <p className="text-[10px] tracking-[0.3em] uppercase mb-5 font-sans" style={{ color: 'var(--text-muted)' }}>
          WiFi Access
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-1 font-sans" style={{ color: 'var(--text-muted)' }}>Network</p>
            <p className="text-lg font-serif font-medium" style={{ color: 'var(--text-primary)' }}>{ssid}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-1 font-sans" style={{ color: 'var(--text-muted)' }}>Password</p>
            <p className="text-lg font-mono tracking-wide" style={{ color: 'var(--text-primary)' }}>{password}</p>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={copyPassword}
          className="btn-ghost w-full text-xs py-2.5"
        >
          {copied ? (
            <><Check className="w-3.5 h-3.5" /> Copied</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy Password</>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
