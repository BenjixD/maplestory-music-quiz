import * as Discord from 'discord.js';

export interface Game {
  Start(callback: () => void): void;
  Listener(user: Discord.User, msg: string): Promise<void>;
}

export interface Bgm {
  description: string,
  filename: string,
  mark: string,
  metadata: {
    albumArtist: string,
    artist: string,
    title: string,
    year: string,
  },
  source: {
    client: string,
    date: string,
    structure: string,
    version: string,
  },
  youtube: string
}