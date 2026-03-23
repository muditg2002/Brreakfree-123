import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, Shield, AlertCircle, Calendar, BarChart2, Heart } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { format, subDays, isSameDay } from 'date-fns';

export default function Stats() {
  const { urges, relapses } = useAppState();
  const navigate = useNavigate();

  const totalSaved = urges
    .filter(u => u.outcome === 'avoided')
    .reduce((acc, u) => acc + (u.moneySaved || 0), 0);

  const totalRelapsed = relapses.reduce((acc, r) => acc + r.amountLost, 0);
  const netSaved = totalSaved - totalRelapsed;

  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();

  const dailyStats = last7Days.map(day => {
    const dayUrges = urges.filter(u => isSameDay(new Date(u.timestamp), day));
    const dayRelapses = relapses.filter(r => isSameDay(new Date(r.timestamp), day));
    return {
      date: day,
      urges: dayUrges.length,
      relapses: dayRelapses.length,
      saved: dayUrges.filter(u => u.outcome === 'avoided').reduce((acc, u) => acc + (u.moneySaved || 0), 0)
    };
  });

  return (
    <div className="flex-1 flex flex-col p-6 space-y-8 overflow-y-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-zinc-500">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl">Progress Insight</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4">
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <span className="text-zinc-500 text-xs uppercase tracking-widest mb-2 font-semibold">Net Money Saved</span>
          <div className="text-5xl font-display font-bold text-emerald-500 mb-2">₹{netSaved}</div>
          <p className="text-zinc-500 text-sm">Total saved minus relapses</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <Shield className="w-5 h-5 text-emerald-500 mb-3" />
            <div className="text-2xl font-display font-bold">{urges.filter(u => u.outcome === 'avoided').length}</div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider">Urges Resisted</p>
          </div>
          <div className="glass-card p-5">
            <AlertCircle className="w-5 h-5 text-red-500 mb-3" />
            <div className="text-2xl font-display font-bold">{relapses.length}</div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider">Relapses Logged</p>
          </div>
        </div>
      </div>

      {/* Weekly Chart (Simple Visualization) */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm uppercase tracking-widest font-semibold text-zinc-500">Last 7 Days</h3>
          <Calendar className="w-4 h-4 text-zinc-600" />
        </div>
        <div className="flex items-end justify-between h-32 gap-2">
          {dailyStats.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col-reverse gap-1 h-full">
                {/* Visualizing urges resisted as emerald bars */}
                <div 
                  className="bg-emerald-500/40 rounded-t-sm w-full" 
                  style={{ height: `${Math.min(day.urges * 20, 100)}%` }}
                />
                {/* Visualizing relapses as red bars */}
                <div 
                  className="bg-red-500/40 rounded-t-sm w-full" 
                  style={{ height: `${Math.min(day.relapses * 20, 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-600 font-medium uppercase">{format(day.date, 'eee')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trigger Insights */}
      <div className="space-y-4">
        <h3 className="text-zinc-500 text-xs uppercase tracking-wider font-semibold px-1">Top Triggers</h3>
        <div className="space-y-2">
          {Array.from(new Set([...urges, ...relapses].map(e => e.trigger))).slice(0, 3).map(trigger => {
            const count = [...urges, ...relapses].filter(e => e.trigger === trigger).length;
            return (
              <div key={trigger} className="glass-card p-4 flex items-center justify-between">
                <span className="text-sm font-medium">{trigger}</span>
                <span className="text-zinc-500 text-xs">{count} times</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recovery Badges */}
      <div className="space-y-4">
        <h3 className="text-zinc-500 text-xs uppercase tracking-wider font-semibold px-1">Recovery Badges</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {urges.length > 0 && (
            <div className="flex-shrink-0 w-24 h-24 glass-card flex flex-col items-center justify-center text-center p-2">
              <Shield className="w-6 h-6 text-emerald-500 mb-2" />
              <span className="text-[10px] font-bold uppercase">First Win</span>
            </div>
          )}
          {relapses.length > 0 && (
            <div className="flex-shrink-0 w-24 h-24 glass-card flex flex-col items-center justify-center text-center p-2">
              <Heart className="w-6 h-6 text-red-500 mb-2" />
              <span className="text-[10px] font-bold uppercase">Honest Log</span>
            </div>
          )}
          {totalSaved > 5000 && (
            <div className="flex-shrink-0 w-24 h-24 glass-card flex flex-col items-center justify-center text-center p-2">
              <TrendingUp className="w-6 h-6 text-emerald-500 mb-2" />
              <span className="text-[10px] font-bold uppercase">₹5k Saved</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
