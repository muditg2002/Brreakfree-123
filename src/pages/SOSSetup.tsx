import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, Heart, Phone, MessageCircle, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SOSSetup() {
  const [stage, setStage] = useState<'intro' | 'setup' | 'active'>('intro');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const navigate = useNavigate();

  const handleSave = () => {
    setStage('active');
  };

  const renderStage = () => {
    switch (stage) {
      case 'intro':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
              <Heart className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl mb-4">Emergency Support</h2>
            <p className="text-zinc-400 text-lg mb-12">
              Set up a trusted contact for when the urge feels too strong to handle alone.
            </p>
            <button onClick={() => setStage('setup')} className="btn-primary w-full">
              Set up SOS
            </button>
            <button onClick={() => navigate('/')} className="btn-ghost w-full mt-4">
              Maybe later
            </button>
          </div>
        );

      case 'setup':
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-8">Trusted Contact</h2>
            <div className="space-y-6 flex-1">
              <div>
                <label className="text-zinc-500 text-xs uppercase tracking-widest mb-2 block">Contact Name</label>
                <input 
                  type="text" 
                  value={contactName} 
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Mom, Best Friend"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-lg font-medium focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-zinc-500 text-xs uppercase tracking-widest mb-2 block">Phone Number</label>
                <input 
                  type="tel" 
                  value={contactPhone} 
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-lg font-medium focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div className="glass-card p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-1" />
                <p className="text-xs text-zinc-500 leading-relaxed">
                  When you trigger SOS, we'll prompt you to call or message this person. This is private and only stored on your device.
                </p>
              </div>
            </div>
            <button 
              onClick={handleSave} 
              disabled={!contactName || !contactPhone}
              className="btn-primary w-full mt-8"
            >
              Save SOS Contact
            </button>
          </div>
        );

      case 'active':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-8">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl mb-4">SOS is ready.</h2>
            <p className="text-zinc-400 mb-12">You're not alone. Help is just a tap away if you need it.</p>
            <div className="w-full space-y-4">
              <div className="glass-card p-6 flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="font-bold text-lg">{contactName}</p>
                  <p className="text-zinc-500 text-sm">{contactPhone}</p>
                </div>
                <div className="flex gap-4 w-full">
                  <a href={`tel:${contactPhone}`} className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3">
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <a href={`sms:${contactPhone}`} className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3">
                    <MessageCircle className="w-4 h-4" /> SMS
                  </a>
                </div>
              </div>
              <button onClick={() => navigate('/')} className="btn-primary w-full mt-4">
                Back to Home
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg relative">
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 text-zinc-500">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="w-10" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1"
        >
          {renderStage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
