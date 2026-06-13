'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen min-h-dvh flex items-center justify-center px-6 bg-[#09090b]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-sans font-semibold tracking-tight text-7xl mb-3 text-neutral-300">404</h1>
        <p className="text-neutral-600 text-sm mb-8 font-sans">This page doesn&apos;t exist.</p>
        <Link href="/">
          <motion.span whileTap={{ scale: 0.97 }} className="btn-ghost">
            Go Home
          </motion.span>
        </Link>
      </motion.div>
    </main>
  );
}
