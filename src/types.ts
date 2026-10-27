export type BriefcaseEffectType = 
  | '+10'
  | 'x2'
  | 'swap'
  | '/2'
  | '-5'
  | '-10'
  | 'zero'
  | 'none';

export interface Briefcase {
  id: number; // 1 to 8
  effect: BriefcaseEffectType;
  label: string;
  description: string;
  chosenByTeamId: number | null;
  isOpened: boolean;
  isSold: boolean;
}

export interface Team {
  id: number;
  name: string;
  color: string;
  score: number;
  initialBriefcaseId: number | null;
  hasSoldBriefcase: boolean;
  dealOfferPoints: number;
  effectApplied?: string;
}

export interface Question {
  id: number; // 1 to 20
  points: number;
  question: string;
  options?: string[];
  answer: string;
  isAnswered: boolean;
  answeredByTeamId: number | null;
  isCorrect: boolean | null;
}

export type GamePhase = 
  | 'SETUP'
  | 'PICK_BRIEFCASES'
  | 'QUIZ_BOARD'
  | 'DEAL_OR_NO_DEAL'
  | 'REVEAL_BRIEFCASES'
  | 'VICTORY';
