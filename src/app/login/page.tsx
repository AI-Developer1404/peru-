'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, Lock } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    router.push(redirect);
    router.refresh();
  };

  return (
    <main className="min-h-screen min-h-dvh flex items-center justify-center px-6 bg-[#09090b]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="font-sans font-semibold tracking-tight text-2xl mb-2">Welcome Back</h1>
          <p className="text-xs text-neutral-500 font-sans">Sign in to manage your hotel</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-7 space-y-5">
          {error && (
            <div className="text-red-400 text-xs bg-red-400/10 px-4 py-3 rounded-lg font-sans">{error}</div>
          )}
          <div>
            <label className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 block font-sans">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@hotel.com" required />
            </div>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 block font-sans">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10" placeholder="••••••••" required />
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading} className="btn-brand w-full">
            <LogIn className="w-4 h-4" />{loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <p className="text-center text-xs text-neutral-600 mt-6 font-sans">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-neutral-400 hover:text-neutral-200 underline underline-offset-4 transition-colors">Sign up</Link>
        </p>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen min-h-dvh flex items-center justify-center bg-[#09090b]">
        <div className="text-center font-sans text-xs text-neutral-500">Loading...</div>
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
