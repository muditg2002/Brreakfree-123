"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Shield, AlertCircle, Play, Timer, TrendingUp, Heart, X, CheckCircle2 } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { TriggerType, RelapseEvent } from '../../types';

const steps = [
  'log',
  'trigger',
  'reflection',
  'plan',
  'finish'
];

export default function RelapseFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [relapseData, setRelapseData] = useState<Partial<RelapseEvent>>({
    timestamp: new Date().toISOString(),
  });
  const { user, addRelapse } = useAppState();
  const router = useRouter();

  const next = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const cancel = () => router.push('/');

  const updateRelapse = (updates: Partial<RelapseEvent>) => {
    setRelapseData(prev => ({ ...prev, ...updates }));
  };

  const complete = () => {
    const finalRelapse: RelapseEvent = {
      id: crypto.randomUUID(),
      timestamp: relapseData.timestamp!,
      amountLost: relapseData.amountLost || 0,
      trigger: relapseData.trigger!,
      reflection: relapseData.reflection || '',
      nextTimePlan: relapseData.nextTimePlan || '',
    };
    addRelapse(finalRelapse);
    router.push('/');
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'log':
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-2 text-zinc-100">Be honest with yourself.</h2>
            <p className="text-zinc-500 mb-8">This is not a failure, it’s a data point. How much did you lose?</p>
            <div className="space-y-4 flex-1">
              {[500, 1000, 2000, 5000].map(amount => (
                <button
                  key={amount}
                  onClick={() => {
                    updateRelapse({ amountLost: amount });
                    next();
                  }}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    relapseData.amountLost === amount 
                      ? 'bg-red-500/10 border-red-500 text-red-500' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
              <div className="relative">
                <input 
                  type="number" 
                  placeholder="Other amount"
                  className="w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-red-500 outline-none"
                  onChange={(e) => updateRelapse({ amountLost: Number(e.target.value) })}
                />
              </div>
            </div>
            <button onClick={next} disabled={!relapseData.amountLost} className="btn-primary w-full mt-8 bg-red-600 hover:bg-red-500">
              Continue
            </button>
          </div>
        );

      case 'trigger':
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
            <h2 className="text-2xl mb-8 text-zinc-100">What led to this?</h2>
            <div className="space-y-4 flex-1">
              {triggers.map(trigger => (
                <button
                  key={trigger}
                  onClick={() => {
                    updateRelapse({ trigger });
                    next();
                  }}
                  className="w-full text-left p-5 rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-red-500 hover:text-red-500 transition-all"
                >
                  {trigger}
                </button>
              ))}
            </div>
          </div>
        );

      case 'reflection':
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-2 text-zinc-100">How do you feel right now?</h2>
            <p className="text-zinc-500 mb-8">Write it down. Future-you needs to remember this feeling.</p>
            <textarea 
              className="flex-1 w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-red-500 outline-none resize-none"
              placeholder="I feel..."
              value={relapseData.reflection}
              onChange={(e) => updateRelapse({ reflection: e.target.value })}
            />
            <button onClick={next} className="btn-primary w-full mt-8 bg-red-600 hover:bg-red-500">
              Continue
            </button>
          </div>
        );

      case 'plan':
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-2 text-zinc-100">What will you do differently?</h2>
            <p className="text-zinc-500 mb-8">Next time this trigger hits, what's the plan?</p>
            <textarea 
              className="flex-1 w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 focus:border-emerald-500 outline-none resize-none"
              placeholder="Next time, I will..."
              value={relapseData.nextTimePlan}
              onChange={(e) => updateRelapse({ nextTimePlan: e.target.value })}
            />
            <button onClick={next} className="btn-primary w-full mt-8">
              Commit to Plan
            </button>
          </div>
        );

      case 'finish':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-8">
              <Heart className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl mb-4 text-zinc-100">Reset. Restart.</h2>
            <p className="text-zinc-400 text-lg mb-12">
              One relapse doesn't erase your progress. You're still here, and you're still trying. That's what matters.
            </p>
            <button onClick={complete} className="btn-primary w-full">
              Back to Dashboard
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
                i === currentStep ? 'bg-red-500 w-8' : i < currentStep ? 'bg-red-500/30' : 'bg-zinc-800'
              }`} 
            />
          ))}
        </div>
        <div className="w-10" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex-1"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
