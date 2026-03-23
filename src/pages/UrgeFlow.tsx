import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Shield, AlertCircle, Play, Timer, TrendingUp, Heart, X, CheckCircle2 } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { TriggerType, UrgeEvent } from '../types';
import { getVideo } from '../utils/db';

const steps = [
  'interrupt',
  'trigger',
  'anchor',
  'pledge',
  'delay',
  'financial',
  'decision',
  'success',
  'escalation'
];

export default function UrgeFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [trigger, setTrigger] = useState<TriggerType | null>(null);
  const [delayTime, setDelayTime] = useState<number | null>(null);
  const { user, urges, relapses, addUrge } = useAppState();
  const navigate = useNavigate();

  const next = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSuccess = () => {
    const urge: UrgeEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      trigger: trigger || 'I just feel like it',
      outcome: 'avoided',
      moneySaved: user?.weeklyLossEstimate ? Math.round(user.weeklyLossEstimate / 7) : 500,
    };
    addUrge(urge);
    navigate('/');
  };

  const handleEscalation = () => {
    const urge: UrgeEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      trigger: trigger || 'I just feel like it',
      outcome: 'escalated',
    };
    addUrge(urge);
    setCurrentStep(steps.indexOf('escalation'));
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'interrupt':
        return <InterruptStep onComplete={next} />;

      case 'trigger':
        const triggers: TriggerType[] = [
          'Live match',
          'Chasing a loss',
          'Boredom',
          'Stress',
          'Payday',
          'I just feel like it'
        ];
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-8">What triggered this?</h2>
            <div className="space-y-4 flex-1">
              {triggers.map(t => (
                <button
                  key={t}
                  onClick={() => {
                    setTrigger(t);
                    next();
                  }}
                  className="w-full text-left p-5 rounded-2xl border bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        );

      case 'anchor':
        const lastRelapse = relapses[0];
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl mb-4">Reality Check</h2>
            <div className="glass-card p-6 mb-12 w-full">
              {lastRelapse ? (
                <p className="text-zinc-300 text-lg">
                  Last time you felt this urge, you lost ₹{lastRelapse.amountLost} and felt terrible after.
                </p>
              ) : (
                <p className="text-zinc-300 text-lg">
                  Remember why you started. Betting has cost you {user?.reasonToStop?.toLowerCase() || 'control'}.
                </p>
              )}
            </div>
            <button onClick={next} className="btn-primary w-full">
              I remember. Continue.
            </button>
          </div>
        );

      case 'pledge':
        return <PledgeStep reasonToStop={user?.reasonToStop || 'I want control'} onComplete={next} />;

      case 'delay':
        const delays = [
          { label: 'Wait 2 minutes', value: 2 },
          { label: 'Wait 5 minutes', value: 5 },
          { label: 'Wait 10 minutes', value: 10 }
        ];
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-4">Give yourself time.</h2>
            <p className="text-zinc-500 mb-8">Urges are temporary. They pass if you wait.</p>
            <div className="space-y-4 flex-1">
              {delays.map(d => (
                <button
                  key={d.value}
                  onClick={() => {
                    setDelayTime(d.value);
                    next();
                  }}
                  className="w-full text-left p-5 rounded-2xl border bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center justify-between"
                >
                  <span>{d.label}</span>
                  <Timer className="w-5 h-5 opacity-50" />
                </button>
              ))}
            </div>
          </div>
        );

      case 'financial':
        const dailyLoss = user?.weeklyLossEstimate ? Math.round(user.weeklyLossEstimate / 7) : 500;
        const totalSaved = urges.filter(u => u.outcome === 'avoided').reduce((acc, u) => acc + (u.moneySaved || 0), 0);
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8">
              <TrendingUp className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl mb-8">Financial Control</h2>
            <div className="space-y-6 w-full mb-12">
              <div className="glass-card p-6">
                <p className="text-zinc-500 text-sm uppercase tracking-widest mb-2">If you don't bet now</p>
                <p className="text-4xl font-display font-bold text-emerald-500">Keep ₹{dailyLoss}</p>
              </div>
              <div className="glass-card p-6">
                <p className="text-zinc-500 text-sm uppercase tracking-widest mb-2">Total Saved</p>
                <p className="text-4xl font-display font-bold text-emerald-500">₹{totalSaved + dailyLoss}</p>
              </div>
            </div>
            <button onClick={next} className="btn-primary w-full">
              Continue
            </button>
          </div>
        );

      case 'decision':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <h2 className="text-3xl mb-12">How are you feeling now?</h2>
            <div className="w-full space-y-4">
              <button onClick={handleSuccess} className="btn-primary w-full py-6 text-xl">
                I'm okay now
              </button>
              <button onClick={handleEscalation} className="btn-secondary w-full py-6 text-xl">
                Still feel like betting
              </button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-3xl mb-4">You just took back control.</h2>
            <p className="text-zinc-400 mb-12">What helped most?</p>
            <div className="grid grid-cols-2 gap-4 w-full">
              {['Waiting', 'Pledge video', 'Breathing', 'Money lost'].map(item => (
                <button 
                  key={item} 
                  onClick={() => navigate('/')}
                  className="glass-card p-4 text-sm font-medium hover:bg-emerald-500/10 hover:border-emerald-500 transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        );

      case 'escalation':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
              <Heart className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl mb-4">Stay with us.</h2>
            <p className="text-zinc-400 mb-12">We're here to support you. Don't walk away yet.</p>
            <div className="w-full space-y-4">
              <button onClick={() => setCurrentStep(steps.indexOf('pledge'))} className="btn-primary w-full">Watch pledge again</button>
              <button onClick={() => setCurrentStep(steps.indexOf('delay'))} className="btn-secondary w-full">Start another delay</button>
              <button onClick={() => navigate('/sos-setup')} className="btn-secondary w-full">SOS support</button>
              <button onClick={() => navigate('/')} className="btn-ghost w-full">Exit flow</button>
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
          <X className="w-6 h-6" />
        </button>
        <div className="flex gap-1">
          {steps.slice(0, -2).map((_, i) => (
            <div 
              key={i} 
              className={`h-1 w-4 rounded-full transition-all ${
                i === currentStep ? 'bg-emerald-500 w-8' : 'bg-zinc-800'
              }`} 
            />
          ))}
        </div>
        <div className="w-10" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex-1"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PledgeStep({ reasonToStop, onComplete }: { reasonToStop: string, onComplete: () => void }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      const blob = await getVideo();
      if (blob) {
        setVideoUrl(URL.createObjectURL(blob));
      }
    };
    loadVideo();
  }, []);

  return (
    <div className="p-8 flex flex-col h-full">
      <h2 className="text-2xl mb-8">Your Pledge</h2>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full aspect-[3/4] bg-zinc-900 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
          {videoUrl ? (
            <video src={videoUrl} autoPlay controls className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-16 h-16 text-white/50" />
              </div>
              <p className="text-zinc-500 text-sm">No video pledge recorded.</p>
            </>
          )}
          <div className="absolute bottom-8 left-8 right-8 text-white text-sm bg-black/50 backdrop-blur-sm p-4 rounded-xl z-10">
            "I want to stop because {reasonToStop.toLowerCase()}. Remember how it feels to lose."
          </div>
        </div>
      </div>
      <button onClick={onComplete} className="btn-primary w-full mt-8">
        Watch & Continue
      </button>
    </div>
  );
}

function InterruptStep({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(10);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <h2 className="text-2xl text-zinc-500 mb-12 uppercase tracking-widest">Pattern Interrupt</h2>
      <div className="text-[10rem] font-display font-bold mb-8 text-emerald-500 leading-none">{count}</div>
      <p className="text-3xl font-display">Pause. Don't act.</p>
      <p className="text-zinc-500 mt-4">Breaking impulsive momentum...</p>
    </div>
  );
}
