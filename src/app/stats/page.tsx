"use client";

import React from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, TrendingUp, Shield, AlertCircle, Calendar, Trophy, ArrowUpRight, ArrowDownRight, Heart } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { format, subDays, isSameDay } from 'date-fns';

export default function Stats() {
  const { urges, relapses } = useAppState();
  const router = useRouter();

  const totalMoneySaved = urges
    .filter(u => u.outcome === 'avoided')
    .reduce((acc, u) => acc + (u.moneySaved || 0), 0);

  const totalRelapses = relapses.length;
  const totalUrgesResisted = urges.filter(u => u.outcome === 'avoided').length;

  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();

  const dailyStats = last7Days.map(day => {
    const dayUrges = urges.filter(u => isSameDay(new Date(u.timestamp), day) && u.outcome === 'avoided').length;
    const dayRelapses = relapses.filter(r => isSameDay(new Date(r.timestamp), day)).length;
    return { day, dayUrges, dayRelapses };
  });

  const maxVal = Math.max(...dailyStats.map(d => Math.max(d.dayUrges, d.dayRelapses)), 1);

  return (
    <div className="flex-1 flex flex-col p-6 space-y-8 overflow-y-auto pb-24 bg-brand-bg">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/')} className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl text-zinc-100">Your Progress</h1>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-4">
        <div className="glass-card p-6 bg-emerald-500/10 border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Net Money Saved</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-4xl font-display font-bold text-zinc-100">₹{totalMoneySaved}</div>
          <p className="text-zinc-500 text-sm mt-2">Based on your weekly loss estimate</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Urges Resisted</span>
            <div className="text-2xl font-display font-bold text-emerald-500 mt-1">{totalUrgesResisted}</div>
          </div>
          <div className="glass-card p-5">
            <span className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Relapses</span>
            <div className="text-2xl font-display font-bold text-red-500 mt-1">{totalRelapses}</div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Last 7 Days</h3>
          <Calendar className="w-4 h-4 text-zinc-600" />
        </div>
        <div className="h-40 flex items-end justify-between gap-2">
          {dailyStats.map((stat, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end gap-1 h-32">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(stat.dayUrges / maxVal) * 100}%` }}
                  className="w-full bg-emerald-500 rounded-t-sm min-h-[2px]"
                />
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(stat.dayRelapses / maxVal) * 100}%` }}
                  className="w-full bg-red-500 rounded-t-sm min-h-[2px]"
                />
              </div>
              <span className="text-[10px] text-zinc-600 font-medium">{format(stat.day, 'EEE')}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-xs text-zinc-500">Resisted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-xs text-zinc-500">Relapsed</span>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-4">
        <h3 className="text-zinc-500 text-xs uppercase tracking-wider font-semibold px-1">Milestones</h3>
        <div className="space-y-3">
          {[
            { label: 'First Win', desc: 'Resisted your first urge', icon: Shield, completed: totalUrgesResisted >= 1 },
            { label: 'Consistency', desc: 'Resisted 5 urges', icon: Trophy, completed: totalUrgesResisted >= 5 },
            { label: 'Control Master', desc: 'Resisted 10 urges', icon: Heart, completed: totalUrgesResisted >= 10 },
          ].map((milestone, i) => (
            <div key={i} className={`glass-card p-4 flex items-center gap-4 ${milestone.completed ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${milestone.completed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-600'}`}>
                <milestone.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-100">{milestone.label}</h4>
                <p className="text-xs text-zinc-500">{milestone.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
