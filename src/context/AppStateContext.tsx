"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, UserProfile, UrgeEvent, RelapseEvent } from '../types';

const STORAGE_KEY = 'pause_recovery_state';

const initialState: AppState = {
  user: null,
  urges: [],
  relapses: [],
};

interface AppStateContextType extends AppState {
  setUser: (user: UserProfile) => void;
  addUrge: (urge: UrgeEvent) => void;
  addRelapse: (relapse: RelapseEvent) => void;
  resetProgress: () => void;
  isLoaded: boolean;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setState(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const setUser = (user: UserProfile) => {
    setState(prev => ({ ...prev, user }));
  };

  const addUrge = (urge: UrgeEvent) => {
    setState(prev => ({ ...prev, urges: [urge, ...prev.urges] }));
  };

  const addRelapse = (relapse: RelapseEvent) => {
    setState(prev => ({ ...prev, relapses: [relapse, ...prev.relapses] }));
  };

  const resetProgress = () => {
    setState(initialState);
  };

  return (
    <AppStateContext.Provider value={{ ...state, setUser, addUrge, addRelapse, resetProgress, isLoaded }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
