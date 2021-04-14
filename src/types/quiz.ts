import * as Discord from 'discord.js';

// A MMQ Game Instance
export type Difficulty = 'easy' | 'medium' | 'hard' | 'any'

export interface QuizData {
  host: Discord.User;
  players: Map<string, Player>;
  difficulty: Difficulty;
  rounds: number;
  durationSecs: number;
  history: RoundData[];
}

export interface RoundData {
  id: number;
  ans: string;
}

export interface Player {
  user: Discord.User
  score: number;
  history: Map<number, string>;
  archived: Boolean;
}