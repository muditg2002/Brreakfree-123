import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Camera, Shield, TrendingDown, Target, Heart, Play, Square, RefreshCcw } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { IdentityType, LossRange, TriggerType, ReasonToStop, UserProfile } from '../types';
import { saveVideo } from '../utils/db';

const steps = [
  'landing',
  'identity',
  'loss',
  'triggers',
  'reason',
  'pledge',
  'urge-intro',
  'practice',
  'account'
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    identities: [],
    triggers: [],
  });
  const { setUser } = useAppState();
  const navigate = useNavigate();

  const next = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const completeOnboarding = () => {
    const finalProfile: UserProfile = {
      id: crypto.randomUUID(),
      identities: profile.identities || [],
      weeklyLossEstimate: profile.weeklyLossEstimate || 0,
      triggers: profile.triggers || [],
      reasonToStop: profile.reasonToStop || 'I just want control again',
      pledgeVideoUrl: profile.pledgeVideoUrl,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    setUser(finalProfile);
    navigate('/');
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'landing':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center h-full px-8 text-center"
          >
            <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mb-8">
              <Shield className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-4xl mb-4">Trying to stop betting… but keep going back?</h1>
            <p className="text-zinc-400 text-lg mb-12">This app helps you pause before you lose control.</p>
            <button onClick={next} className="btn-primary w-full flex items-center justify-center gap-2">
              Start <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        );

      case 'identity':
        const identities: IdentityType[] = [
          'I lose more than I plan to',
          'I try to stop but relapse',
          'I chase losses',
          'I bet when I’m bored or stressed'
        ];
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-8">Which one feels most like you?</h2>
            <div className="space-y-4 flex-1">
              {identities.map(id => (
                <button
                  key={id}
                  onClick={() => {
                    const current = profile.identities || [];
                    if (current.includes(id)) {
                      updateProfile({ identities: current.filter(i => i !== id) });
                    } else {
                      updateProfile({ identities: [...current, id] });
                    }
                  }}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    profile.identities?.includes(id) 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
            <button 
              onClick={next} 
              disabled={!profile.identities?.length}
              className="btn-primary w-full mt-8"
            >
              Continue
            </button>
          </div>
        );

      case 'loss':
        const losses: { label: LossRange; value: number }[] = [
          { label: '₹500–₹2,000', value: 1250 },
          { label: '₹2,000–₹5,000', value: 3500 },
          { label: '₹5,000–₹10,000', value: 7500 },
          { label: '₹10,000+', value: 15000 }
        ];
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-2">How much do you roughly lose per week?</h2>
            <p className="text-zinc-500 mb-8">This helps us estimate your future savings.</p>
            <div className="space-y-4 flex-1">
              {losses.map(loss => (
                <button
                  key={loss.label}
                  onClick={() => updateProfile({ weeklyLossEstimate: loss.value })}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    profile.weeklyLossEstimate === loss.value 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  {loss.label}
                </button>
              ))}
            </div>
            <button 
              onClick={next} 
              disabled={!profile.weeklyLossEstimate}
              className="btn-primary w-full mt-8"
            >
              Continue
            </button>
          </div>
        );

      case 'triggers':
        const triggers: TriggerType[] = [
          'During live matches',
          'Late at night',
          'After a loss',
          'When bored',
          'When stressed',
          'On payday'
        ];
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-8">When are you most likely to bet?</h2>
            <div className="grid grid-cols-1 gap-4 flex-1">
              {triggers.map(trigger => (
                <button
                  key={trigger}
                  onClick={() => {
                    const current = profile.triggers || [];
                    if (current.includes(trigger)) {
                      updateProfile({ triggers: current.filter(t => t !== trigger) });
                    } else {
                      updateProfile({ triggers: [...current, trigger] });
                    }
                  }}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    profile.triggers?.includes(trigger) 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  {trigger}
                </button>
              ))}
            </div>
            <button 
              onClick={next} 
              disabled={!profile.triggers?.length}
              className="btn-primary w-full mt-8"
            >
              Continue
            </button>
          </div>
        );

      case 'reason':
        const reasons: ReasonToStop[] = [
          'Losing too much money',
          'Stress and guilt',
          'Impacting studies or work',
          'Family / relationship issues',
          'I just want control again'
        ];
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-8">Why do you want to stop?</h2>
            <div className="space-y-4 flex-1">
              {reasons.map(reason => (
                <button
                  key={reason}
                  onClick={() => updateProfile({ reasonToStop: reason })}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    profile.reasonToStop === reason 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
            <button 
              onClick={next} 
              disabled={!profile.reasonToStop}
              className="btn-primary w-full mt-8"
            >
              Continue
            </button>
          </div>
        );

      case 'pledge':
        return (
          <div className="p-8 flex flex-col h-full">
            <h2 className="text-2xl mb-4">Record a message to yourself</h2>
            <p className="text-zinc-400 mb-8">
              A short video for when the urge hits. Remind future-you why you're doing this.
            </p>
            <VideoRecorder 
              reasonToStop={profile.reasonToStop || 'I want control'} 
              onComplete={(url) => {
                updateProfile({ pledgeVideoUrl: url });
                next();
              }} 
            />
            <button onClick={next} className="btn-ghost w-full mt-4">Skip for now</button>
          </div>
        );

      case 'urge-intro':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/20">
              <Target className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl mb-4">I feel like betting</h2>
            <p className="text-zinc-400 text-lg mb-12">
              When the urge hits, tap this first. We’ll help you pause and regain control.
            </p>
            <button onClick={next} className="btn-primary w-full">
              Try it now
            </button>
          </div>
        );

      case 'practice':
        return <PracticeMode onComplete={next} />;

      case 'account':
        return (
          <div className="p-8 flex flex-col h-full items-center justify-center text-center">
            <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center mb-8">
              <Heart className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl mb-4">Save your progress</h2>
            <p className="text-zinc-400 mb-12">
              Keep track of your control wins and money saved.
            </p>
            <div className="w-full space-y-4">
              <button onClick={completeOnboarding} className="btn-primary w-full">Continue with Google</button>
              <button onClick={completeOnboarding} className="btn-secondary w-full">Continue with Email</button>
              <button onClick={completeOnboarding} className="btn-ghost w-full">Continue as Guest</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-bg">
      {currentStep > 0 && currentStep < steps.length - 1 && (
        <div className="p-4 flex items-center justify-between">
          <button onClick={prev} className="p-2 text-zinc-500">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-1">
            {steps.slice(1, -1).map((_, i) => (
              <div 
                key={i} 
                className={`h-1 w-4 rounded-full transition-all ${
                  i === currentStep - 1 ? 'bg-emerald-500 w-8' : 'bg-zinc-800'
                }`} 
              />
            ))}
          </div>
          <div className="w-10" />
        </div>
      )}
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

function VideoRecorder({ reasonToStop, onComplete }: { reasonToStop: string, onComplete: (url: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      await saveVideo(blob);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  if (videoUrl) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden relative">
          <video src={videoUrl} controls className="w-full h-full object-cover" />
        </div>
        <div className="mt-8 space-y-4">
          <button onClick={() => onComplete(videoUrl)} className="btn-primary w-full">Use this video</button>
          <button onClick={() => setVideoUrl(null)} className="btn-secondary w-full flex items-center justify-center gap-2">
            <RefreshCcw className="w-5 h-5" /> Retake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden relative">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        <div className="absolute bottom-8 left-8 right-8 text-white text-sm bg-black/50 backdrop-blur-sm p-4 rounded-xl text-center">
          "I want to stop because {reasonToStop.toLowerCase()}. Remember how it feels to lose."
        </div>
      </div>
      <div className="mt-8">
        {!recording ? (
          <button onClick={startRecording} className="btn-primary w-full flex items-center justify-center gap-2">
            <Camera className="w-5 h-5" /> Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} className="bg-red-600 hover:bg-red-500 text-white font-semibold py-4 px-6 rounded-2xl w-full flex items-center justify-center gap-2">
            <Square className="w-5 h-5" /> Stop Recording
          </button>
        )}
      </div>
    </div>
  );
}

function PracticeMode({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<'countdown' | 'calm' | 'success'>('countdown');
  const [count, setCount] = useState(5);

  React.useEffect(() => {
    if (stage === 'countdown' && count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'countdown' && count === 0) {
      setStage('calm');
    }
  }, [count, stage]);

  if (stage === 'countdown') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h2 className="text-xl text-zinc-500 mb-8 uppercase tracking-widest">Practice Mode</h2>
        <div className="text-8xl font-display font-bold mb-8 text-emerald-500">{count}</div>
        <p className="text-2xl">Pause. Don't act.</p>
      </div>
    );
  }

  if (stage === 'calm') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h2 className="text-3xl mb-8">Take a deep breath.</h2>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 bg-emerald-500/20 rounded-full flex items-center justify-center mb-12"
        >
          <div className="w-16 h-16 bg-emerald-500/40 rounded-full" />
        </motion.div>
        <button onClick={() => setStage('success')} className="btn-primary w-full">
          I'm okay now
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-8">
        <ChevronRight className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl mb-4">First micro-win!</h2>
      <p className="text-zinc-400 mb-12">You just practiced taking back control. It gets easier every time.</p>
      <button onClick={onComplete} className="btn-primary w-full">
        Finish Onboarding
      </button>
    </div>
  );
}
