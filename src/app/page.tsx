'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-neutral-200 font-sans selection:bg-white/10 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-serif text-sm font-medium tracking-wide text-neutral-100">Cinematic Concierge</span>
          <div className="flex gap-4">
            <Link href="/login">
              <span className="text-sm text-neutral-400 hover:text-white transition-colors">Log In</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white mb-6 leading-[1.1]"
          >
            Stuur geen PDF&apos;s meer.<br className="hidden sm:block" /> Geen inlogmuren voor je gasten.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Vervang je informatiemap door een slimme web-app. Geen app-downloads nodig, binnen 48 uur live.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <motion.span whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors">
                Start Nu
              </motion.span>
            </Link>
            <Link href="/h/demo">
              <motion.span whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/[0.1] text-white text-sm font-medium hover:bg-white/[0.04] transition-colors">
                Bekijk Demo
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* De cijfers Section */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-12 text-center font-semibold">De Cijfers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-3xl text-white font-medium tracking-tight mb-2">+11,2%</p>
              <p className="text-sm text-neutral-400 leading-relaxed">Prijsruimte bij +1 punt review. (Cornell University)</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-3xl text-white font-medium tracking-tight mb-2">65%</p>
              <p className="text-sm text-neutral-400 leading-relaxed">Van de vragen aan de receptie is repetitief. (Skift Research)</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <p className="text-3xl text-white font-medium tracking-tight mb-2">+30%</p>
              <p className="text-sm text-neutral-400 leading-relaxed">Conversie bij gebruik van visuele gidsen. (Expedia Data)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waarom verlies je marges? */}
      <section className="py-24 border-t border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-medium text-white mb-4 tracking-tight">Waarom verlies je marges?</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Ouderwetse gastcommunicatie kost tijd, frustreert gasten en beperkt upselling-mogelijkheden.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border-l border-white/[0.1]">
              <h3 className="text-white font-medium mb-2">De inlogmuur-frictie</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">Gasten weigeren apps te downloaden of in te loggen voor een verblijf van 2 nachten. De conversie zakt direct in.</p>
            </div>
            <div className="p-6 border-l border-white/[0.1]">
              <h3 className="text-white font-medium mb-2">De receptie-stroom</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">Medewerkers besteden uren aan het uitleggen van WiFi-codes en restaurant-tips in plaats van hospitality.</p>
            </div>
            <div className="p-6 border-l border-white/[0.1]">
              <h3 className="text-white font-medium mb-2">De statische PDF-valkuil</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">PDF&apos;s zijn niet interactief, verouderen snel en bieden geen premium ervaring die past bij je merk.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Binnen 48 uur live */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-medium text-white mb-6 tracking-tight">Binnen 48 uur live</h2>
          <p className="text-base text-neutral-400 leading-relaxed mb-10">
            Wij cureren de content en trainen de AI. Jij plaatst de QR-code en bent klaar. Geen technische kennis vereist.
          </p>
          <Link href="/signup">
            <motion.span whileTap={{ scale: 0.97 }} className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors">
              Begin met digitaliseren
            </motion.span>
          </Link>
        </div>
      </section>
      
      <footer className="py-8 border-t border-white/[0.04] text-center text-xs text-neutral-600">
        <p>&copy; {new Date().getFullYear()} Cinematic Concierge. All rights reserved.</p>
      </footer>
    </main>
  );
}
