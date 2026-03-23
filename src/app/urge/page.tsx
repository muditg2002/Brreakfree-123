"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Shield, AlertCircle, Play, Timer, TrendingUp, Heart, X, CheckCircle2 } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { TriggerType, UrgeEvent } from '../../types';
import { getVideo } from '../../utils/db';

const steps = [
  'interrupt',
  'triggers',
  'anchor',
  'pledge',
  'delay',
  'success'
];

export default function UrgeFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [urgeData, setUrgeData] = useState<Partial<UrgeEvent>>({
    timestamp: new Date().toISOString(),
    outcome: 'avoided',
  });
  const { user, addUrge } = useAppState();
  const router = useRouter();

  const next = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const cancel = () => router.push('/');

  const updateUrge = (updates: Partial<UrgeEvent>) => {
    setUrgeData(prev => ({ ...prev, ...updates }));
  };

  const complete = () => {
    const finalUrge: UrgeEvent = {
      id: crypto.randomUUID(),
      timestamp: urgeData.timestamp!,
      trigger: urgeData.trigger!,
      outcome: 'avoided',
      moneySaved: user?.weeklyLossEstimate ? Math.round(user.weeklyLossEstimate / 7) : 0,
    };
    addUrge(finalUrge);
    router.push('/');
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'interrupt':
        return <InterruptStep onComplete={next} />;

      case 'triggers':
        const triggers: TriggerType[] = user?.triggers || [
          'During live matches',
          'Late at night',
          'After a loss',
          'When bored',
          'When stressed',
          'On payday'
        ];
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-8 text-zinc-100">What triggered this urge?</h2>
            <div className="space-y-4 flex-1">
              {triggers.map(trigger => (
                <button
                  key={trigger}
                  onClick={() => {
                    updateUrge({ trigger });
                    next();
                  }}
                  className="w-full text-left p-5 rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                >
                  {trigger}
                </button>
              ))}
            </div>
            <button onClick={cancel} className="btn-ghost w-full mt-4">I'm okay, cancel</button>
          </div>
        );

      case 'anchor':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl mb-4 text-zinc-100">Remember the feeling.</h2>
            <p className="text-zinc-400 text-lg mb-12">
              Think about the last time you lost. The stress, the guilt, the empty feeling. 
              Is it worth feeling that again?
            </p>
            <button onClick={next} className="btn-primary w-full">
              It's not worth it
            </button>
          </div>
        );

      case 'pledge':
        return <PledgeStep reasonToStop={user?.reasonToStop || 'I want control'} onComplete={next} />;

      case 'delay':
        const delays = [
          { label: '2 Minutes', value: 2 },
          { label: '5 Minutes', value: 5 },
          { label: '10 Minutes', value: 10 }
        ];
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-4 text-zinc-100">Commit to a short delay</h2>
            <p className="text-zinc-400 mb-8">Urges are like waves. They peak and then fade. Just wait this one out.</p>
            <div className="space-y-4 flex-1">
              {delays.map(delay => (
                <button
                  key={delay.value}
                  onClick={next}
                  className="w-full p-6 rounded-2xl border border-zinc-800 bg-zinc-900 flex items-center justify-between group hover:border-emerald-500 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Timer className="w-6 h-6 text-zinc-500 group-hover:text-emerald-500" />
                    <span className="text-lg font-medium text-zinc-100">{delay.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-emerald-500" />
                </button>
              ))}
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl mb-4 text-zinc-100">You did it!</h2>
            <p className="text-zinc-400 text-lg mb-12">
              That’s one more win for your control. You just saved roughly ₹{user?.weeklyLossEstimate ? Math.round(user.weeklyLossEstimate / 7) : 0}.
            </p>
            <button onClick={complete} className="btn-primary w-full">
              Back to Home
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg">
      <div className="p-4 flex items-center justify-between">
        <button onClick={cancel} className="p-2 text-zinc-500">
          <X className="w-6 h-6" />
        </button>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 w-4 rounded-full transition-all ${
                i === currentStep ? 'bg-emerald-500 w-8' : i < currentStep ? 'bg-emerald-500/30' : 'bg-zinc-800'
              }`} 
            />
          ))}
        </div>
        <div className="w-10" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
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
      <h2 className="text-2xl mb-8 text-zinc-100">Your Pledge</h2>
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
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-48 h-48 rounded-full border-8 border-emerald-500/20 flex items-center justify-center mb-12 relative"
      >
        <div className="text-7xl font-display font-bold text-emerald-500">{count}</div>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, ease: "linear" }}
          className="absolute inset-[-8px] border-8 border-emerald-500 border-t-transparent rounded-full"
        />
      </motion.div>
      <h2 className="text-3xl mb-4 text-zinc-100">Wait. Breathe.</h2>
      <p className="text-zinc-400 text-lg">Don't act on the impulse. Let the first wave pass.</p>
    </div>
  );
}
