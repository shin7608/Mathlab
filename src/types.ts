export interface Player {
  name: string;
  totalScore: number;
  totalTimeUsed: number; // in seconds
  completedAt: string;
}

export interface Stage {
  id: number;
  title: string;
  roomName: string;
  description: string;
  mission: string;
  narrative: string;
  basePoints: number;
  timeLimit: number; // in seconds
  hints: string[];
}

export interface StageState {
  score: number;
  timeLeft: number;
  hintsRevealedCount: number;
  isCompleted: boolean;
  attempts: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  timeUsed: number;
  date: string;
}
