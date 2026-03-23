import { useState, useEffect } from 'react';
import { AppState, UserProfile, UrgeEvent, RelapseEvent } from '../types';

const STORAGE_KEY = 'pause_recovery_state';

const initialState: AppState = {
  user: null,
  urges: [],
  relapses: [],
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

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

  return {
    ...state,
    setUser,
    addUrge,
    addRelapse,
    resetProgress,
  };
}
