'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Check, X as XIcon, Map as MapIcon, Compass, Sparkles, ExternalLink } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { triggerHaptic } from '@/lib/haptics';

interface ToursFeedProps {
  brandColor: string;
  onBack: () => void;
}

interface Tour {
  id: string;
  titleKey: string;
  subtitleKey: string;
  image: string;
  price: string;
  duration: string;
  descriptionKey: string;
  conciergeNoteKey?: string;
  externalUrl?: string;
  category: 'signature' | 'transport';
  includedKeys: string[];
  notIncludedKeys: string[];
}

const MOCK_TOURS: Tour[] = [
  {
    id: 'machu-picchu',
    titleKey: 'tour.mp.title',
    subtitleKey: 'tour.mp.subtitle',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=800&auto=format&fit=crop',
    price: '$299',
    duration: '14h',
    category: 'signature',
    descriptionKey: 'tour.mp.desc',
    conciergeNoteKey: 'tour.mp.note',
    externalUrl: 'https://www.perurail.com',
    includedKeys: ['tour.inc.train', 'tour.inc.guide', 'tour.inc.tickets', 'tour.inc.bus'],
    notIncludedKeys: ['tour.inc.lunch', 'tour.inc.tips'],
  },
  {
    id: 'rainbow-mountain',
    titleKey: 'tour.rm.title',
    subtitleKey: 'tour.rm.subtitle',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop',
    price: '$85',
    duration: '12h',
    category: 'signature',
    descriptionKey: 'tour.rm.desc',
    conciergeNoteKey: 'tour.rm.note',
    externalUrl: 'https://www.rainbowmountainperu.com',
    includedKeys: ['tour.inc.transport', 'tour.inc.guide', 'tour.inc.breakfast', 'tour.inc.oxygen'],
    notIncludedKeys: ['tour.inc.horse', 'tour.inc.tips'],
  },
  {
    id: 'sacred-valley',
    titleKey: 'tour.sv.title',
    subtitleKey: 'tour.sv.subtitle',
    image: 'https://images.unsplash.com/photo-1580828343064-fde4dc20ae2a?q=80&w=800&auto=format&fit=crop',
    price: '$110',
    duration: '10h',
    category: 'signature',
    descriptionKey: 'tour.sv.desc',
    conciergeNoteKey: 'tour.sv.note',
    externalUrl: 'https://www.peru.travel/en/destinations/sacred-valley',
    includedKeys: ['tour.inc.transport', 'tour.inc.guide', 'tour.inc.lunch'],
    notIncludedKeys: ['tour.inc.tourist_ticket'],
  },
  {
    id: 'airport-transfer',
    titleKey: 'tour.transfer.title',
    subtitleKey: 'tour.transfer.subtitle',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800&auto=format&fit=crop',
    price: '$25',
    duration: '30m',
    category: 'transport',
    descriptionKey: 'tour.transfer.desc',
    includedKeys: ['tour.inc.transport', 'tour.inc.driver'],
    notIncludedKeys: ['tour.inc.tips'],
  },
  {
    id: 'train-station',
    titleKey: 'tour.train.title',
    subtitleKey: 'tour.train.subtitle',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop',
    price: '$45',
    duration: '2h',
    category: 'transport',
    descriptionKey: 'tour.train.desc',
    includedKeys: ['tour.inc.transport'],
    notIncludedKeys: ['tour.inc.tips'],
  },
];

export default function ToursFeed({ brandColor, onBack }: ToursFeedProps) {
  const { t } = useLanguage();
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  // Lock body scroll when sheet is open to prevent iOS scroll bug
  useEffect(() => {
    if (selectedTour) {
      document.body.style.overflow = 'hidden';
      triggerHaptic('light');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedTour]);

  const handleBack = () => {
    triggerHaptic('light');
    onBack();
  };

  // Helper for mock translations
  const tMock = (key: string) => {
    const dict: Record<string, string> = {
      'tour.mp.title': 'Machu Picchu VIP',
      'tour.mp.subtitle': 'The Lost City via Vistadome',
      'tour.mp.desc': 'Experience the wonder of the world with a premium guided tour. Includes panoramic train ride, private bus access, and a local expert guide.',
      'tour.mp.note': 'We highly recommend the Vistadome train for the glass roof views of the Andes. It makes the journey just as spectacular as the destination.',
      'tour.rm.title': 'Rainbow Mountain',
      'tour.rm.subtitle': 'Vinicunca 5,200m Trek',
      'tour.rm.desc': 'A challenging but rewarding trek to the famous colorful peaks. We provide oxygen, breakfast, and small-group pacing.',
      'tour.rm.note': 'This is an extremely high altitude excursion. We suggest booking this for your 3rd or 4th day in Cusco to ensure you are fully acclimatized.',
      'tour.sv.title': 'Sacred Valley',
      'tour.sv.subtitle': 'Pisac & Ollantaytambo',
      'tour.sv.desc': 'Explore the ancient agricultural heart of the Inca Empire. Includes a traditional buffet lunch in Urubamba.',
      'tour.sv.note': 'A perfect first-day excursion. The Sacred Valley is at a lower altitude than Cusco, helping you acclimatize gently while seeing incredible sites.',
      'tour.transfer.title': 'Airport Transfer',
      'tour.transfer.subtitle': 'Private SUV to Hotel',
      'tour.transfer.desc': 'A comfortable and safe private transfer from Alejandro Velasco Astete Airport directly to the hotel lobby.',
      'tour.train.title': 'Poroy / Ollantaytambo Drop-off',
      'tour.train.subtitle': 'Direct to your train',
      'tour.train.desc': 'Hassle-free private transport to the train station for your journey to Machu Picchu.',
      'tour.inc.train': 'Vistadome Train',
      'tour.inc.guide': 'Expert Bilingual Guide',
      'tour.inc.tickets': 'Entrance Tickets',
      'tour.inc.bus': 'Consettur Bus',
      'tour.inc.lunch': 'Buffet Lunch',
      'tour.inc.tips': 'Gratuities',
      'tour.inc.transport': 'Private Vehicle',
      'tour.inc.driver': 'Professional Driver',
      'tour.inc.breakfast': 'Breakfast',
      'tour.inc.oxygen': 'Oxygen & First Aid',
      'tour.inc.horse': 'Horse Rental',
      'tour.inc.tourist_ticket': 'Boleto Turístico',
    };
    return t(key) !== key ? t(key) : (dict[key] || key);
  };

  const signatureTours = MOCK_TOURS.filter(t => t.category === 'signature');
  const transportOptions = MOCK_TOURS.filter(t => t.category === 'transport');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div 
      className="w-full h-full relative overflow-y-auto hide-scrollbar pb-32"
      style={{ background: 'var(--bg-elevated)', backdropFilter: 'blur(40px)' }}
    >
      
      {/* Top Bar */}
      <div 
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-6"
        style={{ background: 'linear-gradient(to bottom, rgba(12,10,20,0.6) 0%, rgba(12,10,20,0) 100%)' }}
      >
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={handleBack}
          className="glass-pill px-4 py-2.5 flex items-center gap-2 text-sm transition-colors"
          style={{ color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('map.back')}
        </motion.button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="px-6 mt-2"
      >
        <motion.h1 variants={itemVariants} className="font-serif text-3xl md:text-4xl text-white mb-2">
          Curated Experiences
        </motion.h1>
        <motion.p variants={itemVariants} className="text-white/60 font-sans text-sm md:text-base max-w-md mb-10 leading-relaxed">
          Discover the magic of the Andes with our hand-picked selection of premium tours and reliable transport.
        </motion.p>

        {/* Signature Tours Horizontal Carousel */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-4 h-4" style={{ color: brandColor }} />
            <h2 className="font-sans font-medium text-lg text-white">Signature Tours</h2>
          </div>
          
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory">
            {signatureTours.map((tour) => (
              <motion.div 
                key={tour.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTour(tour)}
                className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] snap-start flex-shrink-0 cursor-pointer group"
              >
                <div className="w-full h-[260px] md:h-[300px] rounded-2xl overflow-hidden relative mb-4">
                  <img src={tour.image} alt={tMock(tour.titleKey)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="glass-pill px-3 py-1 text-[10px] uppercase tracking-wider text-white font-medium">
                      {tour.duration}
                    </span>
                    <span className="font-sans font-medium text-white">{tour.price}</span>
                  </div>
                </div>
                <h3 className="font-serif text-xl text-white mb-1 group-hover:text-white/80 transition-colors">{tMock(tour.titleKey)}</h3>
                <p className="text-white/50 text-sm font-sans line-clamp-1">{tMock(tour.subtitleKey)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Transport Horizontal Carousel */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapIcon className="w-4 h-4" style={{ color: brandColor }} />
            <h2 className="font-sans font-medium text-lg text-white">Private Transport</h2>
          </div>
          
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 -mx-6 px-6 snap-x snap-mandatory">
            {transportOptions.map((tour) => (
              <motion.div 
                key={tour.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTour(tour)}
                className="min-w-[240px] w-[240px] md:min-w-[280px] md:w-[280px] snap-start flex-shrink-0 cursor-pointer group bg-white/5 rounded-2xl p-3 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-full h-28 md:h-32 rounded-xl overflow-hidden relative mb-4">
                  <img src={tour.image} alt={tMock(tour.titleKey)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="px-1 pb-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-serif text-lg text-white">{tMock(tour.titleKey)}</h3>
                    <span className="font-sans font-medium text-white text-sm">{tour.price}</span>
                  </div>
                  <p className="text-white/50 text-xs font-sans line-clamp-1 mb-3">{tMock(tour.subtitleKey)}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-wider">
                    <Clock className="w-3 h-3" /> {tour.duration}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </motion.div>

      {/* Bottom Sheet for Details */}
      <AnimatePresence>
        {selectedTour && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTour(null)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl max-h-[88vh] overflow-y-auto"
              style={{ background: 'var(--bg-elevated)', backdropFilter: 'blur(40px)', borderTop: '1px solid rgba(255,255,255,0.1)', WebkitOverflowScrolling: 'touch' }}
            >
              <div className="flex justify-center pt-3 pb-1 sticky top-0 z-10" style={{ background: 'var(--bg-elevated)' }}>
                <div className="w-12 h-1.5 rounded-full bg-white/20" />
              </div>

              <div className="px-6 pb-12 pt-4">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-serif text-2xl text-white mb-1">{tMock(selectedTour.titleKey)}</h3>
                    <p className="text-white/50 text-sm font-sans">{selectedTour.duration} • {selectedTour.price}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedTour(null)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <XIcon className="w-5 h-5 text-white/70" />
                  </motion.button>
                </div>

                {/* Hero image in sheet */}
                <div className="w-full h-48 rounded-2xl overflow-hidden mb-6">
                  <img src={selectedTour.image} alt="Tour" className="w-full h-full object-cover" />
                </div>

                <div className="mb-8">
                  <p className="text-white/80 font-sans text-sm leading-relaxed">
                    {tMock(selectedTour.descriptionKey)}
                  </p>
                  
                  {selectedTour.conciergeNoteKey && (
                    <div className="mt-5 p-4 rounded-xl bg-white/[0.04] border border-white/10 flex gap-3 items-start">
                      <Sparkles className="w-4 h-4 text-[var(--brand-color)] flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-white/40 block mb-1">Concierge Note</span>
                        <p className="text-white/80 text-xs leading-relaxed font-sans">{tMock(selectedTour.conciergeNoteKey)}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-10 pt-6 border-t border-white/10">
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                    <h4 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-4 font-semibold">Included</h4>
                    <ul className="space-y-3">
                      {selectedTour.includedKeys.map(key => (
                        <li key={key} className="flex items-center gap-3 text-sm text-white/90 font-sans">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-emerald-400" />
                          </div>
                          {tMock(key)}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedTour.notIncludedKeys.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.03]">
                      <h4 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-4 font-semibold">Not Included</h4>
                      <ul className="space-y-3">
                        {selectedTour.notIncludedKeys.map(key => (
                          <li key={key} className="flex items-center gap-3 text-sm text-white/50 font-sans">
                            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                              <XIcon className="w-3 h-3 text-white/30" />
                            </div>
                            {tMock(key)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {selectedTour.externalUrl ? (
                  <motion.a
                    href={selectedTour.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-brand py-4 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    Explore with Provider
                    <ExternalLink className="w-4 h-4" />
                  </motion.a>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-ghost py-4 text-sm font-medium"
                  >
                    Contact Reception
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
