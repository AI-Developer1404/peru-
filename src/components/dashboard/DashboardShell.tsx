/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Hotel, MapPin, BookOpen, QrCode, CreditCard, LogOut,
  Plus, Trash2, Save, ExternalLink, ChevronRight,
} from 'lucide-react';
import type { Hotel as HotelType, Location, KnowledgeBaseEntry } from '@/lib/types';
import type { User } from '@supabase/supabase-js';
import QRCodeGenerator from '@/components/dashboard/QRCodeGenerator';

type Tab = 'hotel' | 'locations' | 'knowledge' | 'qrcode' | 'billing';

interface DashboardShellProps {
  user: User;
  hotel: HotelType | null;
  locations: Location[];
  knowledgeBase: KnowledgeBaseEntry[];
}

const tabs: { id: Tab; label: string; icon: typeof Hotel }[] = [
  { id: 'hotel', label: 'Hotel', icon: Hotel },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
  { id: 'qrcode', label: 'QR Code', icon: QrCode },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function DashboardShell({
  user,
  hotel: initialHotel,
  locations: initialLocations,
  knowledgeBase: initialKB,
}: DashboardShellProps) {
  const [tab, setTab] = useState<Tab>('hotel');
  const [hotel, setHotel] = useState(initialHotel);
  const [locations, setLocations] = useState(initialLocations);
  const [knowledgeBase, setKnowledgeBase] = useState(initialKB);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Hotel form
  const [hotelForm, setHotelForm] = useState({
    name: hotel?.name ?? '',
    slug: hotel?.slug ?? '',
    brand_color: hotel?.brand_color ?? '#c9a96e',
    wifi_ssid: hotel?.wifi_ssid ?? '',
    wifi_password: hotel?.wifi_password ?? '',
    background_video_url: hotel?.background_video_url ?? '',
    welcome_audio_url: hotel?.welcome_audio_url ?? '',
    logo_url: hotel?.logo_url ?? '',
  });

  const handleSaveHotel = async () => {
    setSaving(true);
    if (hotel) {
      const { data } = await supabase.from('hotels').update(hotelForm).eq('id', hotel.id).select().single();
      if (data) setHotel(data);
    } else {
      const { data } = await supabase.from('hotels').insert({ ...hotelForm, user_id: user.id }).select().single();
      if (data) setHotel(data);
    }
    setSaving(false);
    router.refresh();
  };

  // Location CRUD
  const [locForm, setLocForm] = useState({ name: '', lat: '', lng: '', type: 'attraction', description: '', audio_guide_url: '' });
  const handleAddLocation = async () => {
    if (!hotel || !locForm.name) return;
    const { data } = await supabase.from('locations').insert({
      hotel_id: hotel.id, name: locForm.name,
      lat: parseFloat(locForm.lat), lng: parseFloat(locForm.lng),
      type: locForm.type, description: locForm.description,
      audio_guide_url: locForm.audio_guide_url || null,
    }).select().single();
    if (data) setLocations([...locations, data]);
    setLocForm({ name: '', lat: '', lng: '', type: 'attraction', description: '', audio_guide_url: '' });
  };
  const handleDeleteLocation = async (id: string) => {
    await supabase.from('locations').delete().eq('id', id);
    setLocations(locations.filter((l) => l.id !== id));
  };

  // Knowledge Base CRUD
  const [kbForm, setKbForm] = useState({ title: '', document_text: '' });
  const handleAddKB = async () => {
    if (!hotel || !kbForm.document_text) return;
    const { data } = await supabase.from('knowledge_base').insert({
      hotel_id: hotel.id, title: kbForm.title, document_text: kbForm.document_text,
    }).select().single();
    if (data) setKnowledgeBase([data, ...knowledgeBase]);
    setKbForm({ title: '', document_text: '' });
  };
  const handleDeleteKB = async (id: string) => {
    await supabase.from('knowledge_base').delete().eq('id', id);
    setKnowledgeBase(knowledgeBase.filter((k) => k.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleSubscribe = async () => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, email: user.email }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  const handleFileUpload = async (file: File, field: string) => {
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('hotel-assets').upload(path, file);
    if (error) return;
    const { data: { publicUrl } } = supabase.storage.from('hotel-assets').getPublicUrl(data.path);
    setHotelForm((prev) => ({ ...prev, [field]: publicUrl }));
  };

  const fadeIn = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  };

  return (
    <div className="min-h-screen bg-[var(--dash-bg)] text-neutral-200 font-sans">
      {/* ====== TOP HEADER ====== */}
      <header className="border-b border-[var(--dash-border)] sticky top-0 z-30 bg-[var(--dash-bg)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-serif text-base font-medium tracking-tight text-neutral-100">Cinematic Concierge</span>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
            <span className="text-xs text-neutral-500">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            {hotel && (
              <a
                href={`/h/${hotel.slug}`}
                target="_blank"
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors px-3 py-1.5 rounded-lg border border-white/[0.06] hover:border-white/[0.1]"
              >
                <ExternalLink className="w-3 h-3" /> Preview
              </a>
            )}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-white/[0.04] text-neutral-600 hover:text-neutral-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* ====== SIDEBAR NAV ====== */}
        <nav className="hidden md:block w-48 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-white/[0.06] text-neutral-100'
                      : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ====== MOBILE TAB BAR ====== */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--dash-border)] bg-[var(--dash-bg)]/90 backdrop-blur-xl px-4 py-2 flex justify-around">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2 text-[10px] transition-colors ${
                  tab === t.id ? 'text-neutral-100' : 'text-neutral-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label.split(' ')[0]}
              </button>
            );
          })}
        </nav>

        {/* ====== MAIN CONTENT ====== */}
        <main className="flex-1 min-w-0 pb-24 md:pb-0">
          <AnimatePresence mode="wait">
            {/* HOTEL TAB */}
            {tab === 'hotel' && (
              <motion.div key="hotel" {...fadeIn} className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif font-medium mb-1">Hotel Settings</h2>
                  <p className="text-xs text-neutral-500">Configure your hotel profile and media</p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 block font-sans">Hotel Name</label>
                      <input value={hotelForm.name} onChange={(e) => setHotelForm((p) => ({ ...p, name: e.target.value }))} className="input-field" placeholder="The Grand Hotel" />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 block font-sans">URL Slug</label>
                      <input value={hotelForm.slug} onChange={(e) => setHotelForm((p) => ({ ...p, slug: e.target.value }))} className="input-field" placeholder="the-grand-hotel" />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 block font-sans">Brand Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={hotelForm.brand_color} onChange={(e) => setHotelForm((p) => ({ ...p, brand_color: e.target.value }))} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                        <input value={hotelForm.brand_color} onChange={(e) => setHotelForm((p) => ({ ...p, brand_color: e.target.value }))} className="input-field" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 block font-sans">Logo</label>
                      <div className="flex items-center gap-3">
                        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo_url')}
                          className="text-sm text-neutral-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-white/[0.06] file:text-neutral-300 hover:file:bg-white/[0.1] cursor-pointer" />
                        {hotelForm.logo_url && <img src={hotelForm.logo_url} alt="Logo" className="w-10 h-10 rounded-lg object-contain bg-white/5" />}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 block font-sans">WiFi SSID</label>
                      <input value={hotelForm.wifi_ssid} onChange={(e) => setHotelForm((p) => ({ ...p, wifi_ssid: e.target.value }))} className="input-field" placeholder="Hotel_WiFi" />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 block font-sans">WiFi Password</label>
                      <input value={hotelForm.wifi_password} onChange={(e) => setHotelForm((p) => ({ ...p, wifi_password: e.target.value }))} className="input-field" placeholder="Password123" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 block font-sans">Background Video</label>
                    <input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'background_video_url')}
                      className="text-sm text-neutral-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-white/[0.06] file:text-neutral-300 cursor-pointer" />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 block font-sans">Welcome Audio</label>
                    <input type="file" accept="audio/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'welcome_audio_url')}
                      className="text-sm text-neutral-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-white/[0.06] file:text-neutral-300 cursor-pointer" />
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveHotel} disabled={saving} className="btn-brand">
                    <Save className="w-4 h-4" />{saving ? 'Saving...' : hotel ? 'Update Hotel' : 'Create Hotel'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* LOCATIONS TAB */}
            {tab === 'locations' && (
              <motion.div key="locations" {...fadeIn} className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif font-medium mb-1">Locations</h2>
                  <p className="text-xs text-neutral-500">Curate places for your guests to explore</p>
                </div>
                {!hotel ? (
                  <p className="text-neutral-600 text-sm">Create a hotel first to add locations.</p>
                ) : (
                  <>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 space-y-4">
                      <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Add New Location</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input value={locForm.name} onChange={(e) => setLocForm((p) => ({ ...p, name: e.target.value }))} className="input-field" placeholder="Name" />
                        <input value={locForm.lat} onChange={(e) => setLocForm((p) => ({ ...p, lat: e.target.value }))} className="input-field" placeholder="Latitude" type="number" step="any" />
                        <input value={locForm.lng} onChange={(e) => setLocForm((p) => ({ ...p, lng: e.target.value }))} className="input-field" placeholder="Longitude" type="number" step="any" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select value={locForm.type} onChange={(e) => setLocForm((p) => ({ ...p, type: e.target.value }))} className="input-field">
                          {['restaurant', 'cafe', 'bar', 'attraction', 'museum', 'shopping', 'spa', 'beach', 'park', 'transport', 'other'].map((t) => (
                            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                          ))}
                        </select>
                        <input value={locForm.audio_guide_url} onChange={(e) => setLocForm((p) => ({ ...p, audio_guide_url: e.target.value }))} className="input-field" placeholder="Audio guide URL (optional)" />
                      </div>
                      <textarea value={locForm.description} onChange={(e) => setLocForm((p) => ({ ...p, description: e.target.value }))} className="input-field min-h-[80px]" placeholder="Description" />
                      <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddLocation} className="btn-brand"><Plus className="w-4 h-4" /> Add Location</motion.button>
                    </div>
                    <div className="space-y-2">
                      {locations.map((loc) => (
                        <div key={loc.id} className="rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 flex items-center justify-between group">
                          <div>
                            <p className="text-sm font-medium text-neutral-200">{loc.name}</p>
                            <p className="text-[11px] text-neutral-600">{loc.type} · {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</p>
                          </div>
                          <button onClick={() => handleDeleteLocation(loc.id)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-neutral-600 hover:text-red-400 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* KNOWLEDGE BASE TAB */}
            {tab === 'knowledge' && (
              <motion.div key="knowledge" {...fadeIn} className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif font-medium mb-1">Knowledge Base</h2>
                  <p className="text-xs text-neutral-500">Information the AI Concierge uses to answer guest questions</p>
                </div>
                {!hotel ? (
                  <p className="text-neutral-600 text-sm">Create a hotel first.</p>
                ) : (
                  <>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 space-y-4">
                      <input value={kbForm.title} onChange={(e) => setKbForm((p) => ({ ...p, title: e.target.value }))} className="input-field" placeholder="Document title" />
                      <textarea value={kbForm.document_text} onChange={(e) => setKbForm((p) => ({ ...p, document_text: e.target.value }))} className="input-field min-h-[120px]" placeholder="Enter information the AI concierge should know..." />
                      <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddKB} className="btn-brand"><Plus className="w-4 h-4" /> Add Document</motion.button>
                    </div>
                    <div className="space-y-2">
                      {knowledgeBase.map((kb) => (
                        <div key={kb.id} className="rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 group">
                          <div className="flex items-start justify-between mb-1.5">
                            <p className="text-sm font-medium text-neutral-200">{kb.title || 'Untitled'}</p>
                            <button onClick={() => handleDeleteKB(kb.id)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-neutral-600 hover:text-red-400 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-neutral-600 line-clamp-2">{kb.document_text}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* QR CODE TAB */}
            {tab === 'qrcode' && (
              <motion.div key="qrcode" {...fadeIn} className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif font-medium mb-1">QR Code</h2>
                  <p className="text-xs text-neutral-500">Print this QR code for your hotel rooms</p>
                </div>
                {hotel ? (
                  <QRCodeGenerator slug={hotel.slug} brandColor={hotel.brand_color} hotelName={hotel.name} logoUrl={hotel.logo_url} />
                ) : (
                  <p className="text-neutral-600 text-sm">Create a hotel first.</p>
                )}
              </motion.div>
            )}

            {/* BILLING TAB */}
            {tab === 'billing' && (
              <motion.div key="billing" {...fadeIn} className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif font-medium mb-1">Billing</h2>
                  <p className="text-xs text-neutral-500">Manage your subscription</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-10 text-center max-w-md mx-auto">
                  <CreditCard className="w-8 h-8 mx-auto mb-4 text-neutral-700" />
                  <h3 className="font-serif text-lg mb-2">Unlock Premium</h3>
                  <p className="text-neutral-500 text-xs mb-8 leading-relaxed max-w-xs mx-auto">
                    Unlimited locations, AI concierge, custom branding, audio guides, and priority support.
                  </p>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubscribe} className="btn-brand w-full">Subscribe Now</motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
