'use client';

import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface AIConciergeProps {
  hotelId: string;
  hotelName: string;
  brandColor: string;
  onBack: () => void;
}

const QUICK_PROMPTS = [
  '🍽️ Best restaurants nearby?',
  '🏔️ Altitude tips for today',
  '🚌 Sacred Valley tour info',
  '🚂 How to get to Machu Picchu?',
];

export default function AIConcierge({ hotelId, hotelName, brandColor, onBack }: AIConciergeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    body: { hotelId },
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to ${hotelName}! 🌿\n\nI'm your personal travel guide — I know Cusco inside and out. Whether you need dining reservations, tour bookings, altitude advice, or hidden local gems, I'm here to help.\n\nWhat can I assist you with?`,
      },
    ],
  });

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const hasOnlyWelcome = messages.length <= 1;

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

        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${brandColor}18` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: brandColor }} />
          </div>
          <div>
            <p className="text-sm font-sans font-medium" style={{ color: 'var(--text-primary)' }}>Your Travel Guide</p>
            <p className="text-[11px] font-sans" style={{ color: 'var(--text-muted)' }}>{hotelName}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed font-sans ${
                  m.role === 'user'
                    ? 'rounded-br-lg'
                    : 'rounded-bl-lg border border-white/[0.05]'
                }`}
                style={
                  m.role === 'user'
                    ? { backgroundColor: `${brandColor}20`, border: `1px solid ${brandColor}18`, color: 'var(--text-primary)' }
                    : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }
                }
              >
                <span className="whitespace-pre-wrap block">{m.content}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Quick prompts — shown only after welcome message */}
        {hasOnlyWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            {QUICK_PROMPTS.map((prompt) => (
              <motion.button
                key={prompt}
                whileTap={{ scale: 0.95 }}
                onClick={() => append({ role: 'user', content: prompt })}
                className="glass text-xs px-3.5 py-2 hover:border-white/20 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {prompt}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Typing indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="border border-white/[0.05] rounded-2xl rounded-bl-lg px-4 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--text-muted)' }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="px-6 pb-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
        <div className="glass flex items-center gap-3 px-4 py-3">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything about Cusco..."
            className="flex-1 bg-transparent text-sm font-sans placeholder:text-white/20 focus:outline-none"
            style={{ color: 'var(--text-primary)' }}
            autoComplete="off"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl transition-all duration-200 disabled:opacity-20"
            style={{
              background: input.trim() ? `linear-gradient(135deg, ${brandColor}cc, ${brandColor})` : 'transparent',
            }}
          >
            <Send className="w-4 h-4" style={{ color: input.trim() ? 'var(--bg-deep)' : 'var(--text-muted)' }} />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
