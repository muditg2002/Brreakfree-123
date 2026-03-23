import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, AlertCircle, Shield, Heart, X, CheckCircle2 } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { TriggerType, RelapseEvent } from '../types';

const steps = [
  'reset',
  'details',
  'differently',
  'success'
];

export default function RelapseFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [amountLost, setAmountLost] = useState<number>(0);
  const [trigger, setTrigger] = useState<TriggerType | null>(null);
  const { addRelapse } = useAppState();
  const navigate = useNavigate();

  const next = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

  const handleComplete = () => {
    const relapse: RelapseEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      amountLost,
      trigger: trigger || 'I just feel like it',
    };
    addRelapse(relapse);
    navigate('/');
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'reset':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-4xl mb-4">It happened. Let’s reset.</h2>
            <p className="text-zinc-400 text-lg mb-12">One relapse doesn’t erase progress. We’re here to help you get back on track.</p>
            <button onClick={next} className="btn-primary w-full">
              Reset & Continue
            </button>
          </div>
        );

      case 'details':
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
            <h2 className="text-2xl mb-8">What happened?</h2>
            <div className="space-y-6 flex-1">
              <div>
                <label className="text-zinc-500 text-xs uppercase tracking-widest mb-2 block">How much did you lose?</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-2xl">₹</span>
                  <input 
                    type="number" 
                    value={amountLost || ''} 
                    onChange={(e) => setAmountLost(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 pl-10 text-2xl font-display font-bold focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-zinc-500 text-xs uppercase tracking-widest mb-2 block">What triggered it?</label>
                <div className="grid grid-cols-1 gap-3">
                  {triggers.map(t => (
                    <button
                      key={t}
                      onClick={() => setTrigger(t)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        trigger === t 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={next} 
              disabled={!amountLost || !trigger}
              className="btn-primary w-full mt-8"
            >
              Continue
            </button>
          </div>
        );

      case 'differently':
        const options = [
          'Open urge flow sooner',
          'Watch pledge first',
          'Message trusted person',
          'Avoid match notifications',
          'Set stronger delay'
        ];
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-8">What should we help you do differently next time?</h2>
            <div className="space-y-3 flex-1">
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={next}
                  className="w-full text-left p-5 rounded-2xl border bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-emerald-500 hover:text-emerald-500 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-8">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl mb-4">Reset complete.</h2>
            <p className="text-zinc-400 mb-12">You're back in control. Every moment is a new chance.</p>
            <button onClick={handleComplete} className="btn-primary w-full">
              Back to Home
            </button>
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
          {steps.map((_, i) => (
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
