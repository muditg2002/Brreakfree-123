export type IdentityType = 'I lose more than I plan to' | 'I try to stop but relapse' | 'I chase losses' | 'I bet when I’m bored or stressed';

export type LossRange = '₹500–₹2,000' | '₹2,000–₹5,000' | '₹5,000–₹10,000' | '₹10,000+';

export type TriggerType = 'During live matches' | 'Late at night' | 'After a loss' | 'When bored' | 'When stressed' | 'On payday' | 'I just feel like it' | 'Live match' | 'Chasing a loss' | 'Boredom' | 'Stress' | 'Payday';

export type ReasonToStop = 'Losing too much money' | 'Stress and guilt' | 'Impacting studies or work' | 'Family / relationship issues' | 'I just want control again';

export interface UserProfile {
  id: string;
  identities: IdentityType[];
  weeklyLossEstimate: number; // Midpoint of the range
  triggers: TriggerType[];
  reasonToStop: ReasonToStop;
  pledgeVideoUrl?: string;
  onboardingCompleted: boolean;
  createdAt: string;
  sosContact?: {
    name: string;
    phone: string;
  };
}

export interface UrgeEvent {
  id: string;
  timestamp: string;
  trigger: TriggerType;
  outcome: 'avoided' | 'relapsed' | 'escalated';
  moneySaved?: number;
}

export interface RelapseEvent {
  id: string;
  timestamp: string;
  amountLost: number;
  trigger: TriggerType;
  reflection?: string;
  nextTimePlan?: string;
  note?: string;
}

export interface AppState {
  user: UserProfile | null;
  urges: UrgeEvent[];
  relapses: RelapseEvent[];
}
