import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, History, Play, AlertCircle, Settings, BarChart2, PlusCircle } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const { user, urges, relapses } = useAppState();
  const navigate = useNavigate();

  const weeklyUrgesResisted = urges.filter(u => 
    u.outcome === 'avoided' && 
    new Date(u.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  const weeklyMoneySaved = urges
    .filter(u => u.outcome === 'avoided')
    .reduce((acc, u) => acc + (u.moneySaved || 0), 0);

  const lastActivity = urges[0] || relapses[0];

  return (
    <div className="flex-1 flex flex-col p-6 space-y-8 overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="font-display font-bold text-xl">Pause</span>
        </div>
        <button onClick={() => navigate('/stats')} className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors">
          <BarChart2 className="w-6 h-6" />
        </button>
      </div>

      {/* Primary Action */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/urge')}
        className="w-full aspect-square max-h-80 bg-emerald-600 rounded-[3rem] flex flex-col items-center justify-center text-center p-8 shadow-2xl shadow-emerald-600/20 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
          <PlusCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl text-white font-display font-bold mb-2">I feel like betting</h2>
        <p className="text-emerald-100/80 text-sm">Tap this first to regain control</p>
      </motion.button>

      {/* Control Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5 flex flex-col space-y-2">
          <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Control Wins</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-bold text-emerald-500">{weeklyUrgesResisted}</span>
            <span className="text-zinc-500 text-sm">this week</span>
          </div>
        </div>
        <div className="glass-card p-5 flex flex-col space-y-2">
          <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Money Saved</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-bold text-emerald-500">₹{weeklyMoneySaved}</span>
            <span className="text-zinc-500 text-sm">saved</span>
          </div>
        </div>
      </div>

      {/* Last Activity */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Last Activity</span>
          <History className="w-4 h-4 text-zinc-600" />
        </div>
        {lastActivity ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                'outcome' in lastActivity && lastActivity.outcome === 'avoided' 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : 'bg-red-500/10 text-red-500'
              }`}>
                {'outcome' in lastActivity && lastActivity.outcome === 'avoided' ? <Shield className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-medium">
                  {'outcome' in lastActivity ? (lastActivity.outcome === 'avoided' ? 'Urge avoided' : 'Urge escalated') : 'Relapse logged'}
                </p>
                <p className="text-xs text-zinc-500">{formatDistanceToNow(new Date(lastActivity.timestamp))} ago</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-zinc-500 text-sm italic">No activity yet. You're starting fresh.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-zinc-500 text-xs uppercase tracking-wider font-semibold px-1">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/relapse')}
            className="glass-card p-4 flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            <AlertCircle className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-medium">Log relapse</span>
          </button>
          <button 
            onClick={() => navigate('/onboarding')} // In a real app, this would show the video
            className="glass-card p-4 flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            <Play className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-medium">Watch pledge</span>
          </button>
          <button 
            onClick={() => navigate('/sos-setup')}
            className="glass-card p-4 flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-medium">SOS Support</span>
          </button>
          <button 
            onClick={() => navigate('/stats')}
            className="glass-card p-4 flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-medium">Insights</span>
          </button>
        </div>
      </div>

      {/* Emotional Anchor */}
      <div className="text-center pt-4">
        <p className="text-zinc-500 text-sm italic">You’re in control today.</p>
      </div>
    </div>
  );
}
