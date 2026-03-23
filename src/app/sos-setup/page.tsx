"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Shield, Heart, Phone, User, Save, Trash2, AlertCircle } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';

export default function SOSSetup() {
  const { user, setUser } = useAppState();
  const [contact, setContact] = useState({
    name: user?.sosContact?.name || '',
    phone: user?.sosContact?.phone || '',
  });
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    if (user) {
      setUser({
        ...user,
        sosContact: contact.name && contact.phone ? contact : undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleRemove = () => {
    if (user) {
      setUser({
        ...user,
        sosContact: undefined,
      });
      setContact({ name: '', phone: '' });
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-8 overflow-y-auto pb-24 bg-brand-bg">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/')} className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl text-zinc-100">SOS Support</h1>
      </div>

      {/* Info Card */}
      <div className="glass-card p-6 bg-emerald-500/10 border-emerald-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-zinc-100">Trusted Contact</h2>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Add a friend or family member who knows about your recovery. When you're in a high-risk moment, 
          you can quickly reach out to them for support.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-zinc-500 px-1">Contact Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input 
                type="text" 
                placeholder="e.g. Mom, Best Friend"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className="w-full p-4 pl-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-zinc-500 px-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
              <input 
                type="tel" 
                placeholder="+91 98765 43210"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full p-4 pl-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <button 
            onClick={handleSave}
            disabled={!contact.name || !contact.phone}
            className={`btn-primary w-full flex items-center justify-center gap-2 ${saved ? 'bg-emerald-500' : ''}`}
          >
            {saved ? <Heart className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saved ? 'Saved!' : 'Save Contact'}
          </button>
          
          {user?.sosContact && (
            <button 
              onClick={handleRemove}
              className="btn-ghost w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-5 h-5" /> Remove Contact
            </button>
          )}
        </div>
      </div>

      {/* Privacy Note */}
      <div className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
        <AlertCircle className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-500 leading-relaxed">
          Your contact information is stored locally on your device and is never shared with our servers. 
          We only use it to provide a quick link for you to call or message them.
        </p>
      </div>
    </div>
  );
}
