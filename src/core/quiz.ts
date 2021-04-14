import * as Discord from 'discord.js';
import ytdl from '../utils/discord-ytdl-core';
import { Game } from '../types/game';
import { 
  Difficulty, 
  QuizData,
  Player,
} from '../types/quiz';
import {
  WrapMsgAsCodeBlock,
  Delay
} from '../utils/helpers';
import { BGM_LIB } from '../data/index'

export class Quiz implements Game {
  // Discord Integration
  client: Discord.Client;
  vc: Discord.VoiceChannel;
  channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;

  // Game Data
  data: QuizData;
  isActive: Boolean;
  listenerEnabled: Boolean;

  constructor(
    client: Discord.Client,
    guildMember: Discord.GuildMember,
    channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel,
    data: {
      host: Discord.User,
      rounds: number,
      durationSecs: number,
      difficulty: Difficulty,
    }
  ) {
    this.isActive = true;
    this.listenerEnabled = false;
    this.client = client;
    this.channel = channel;

    // Check if user is in a voice channel
    if(!guildMember.voice.channel) {
      channel.send(`<@${data.host.id}>, please join a voice channel to start a quiz!`);
      throw new Error(`host ${data.host.id} is not in a voice channel.`);
    } else {
      this.vc = guildMember.voice.channel;
    }

    // Check if bot has vc permissions
    const permissions = this.vc.permissionsFor(client.user!);
    if(!permissions!.has('CONNECT') || !permissions!.has('SPEAK')) {
      throw new Error(`client bot has insufficient permissions for voice channel ${this.vc.id}`);
    }

    this.data = {
      host: data.host,
      players: new Map<string, Player>(),
      difficulty: data.difficulty,
      rounds: data.rounds,
      durationSecs: data.durationSecs,
      history: [],
    };
  }

  async Start(callback: () => void): Promise<void> {
    try {
      // Start the Game
      // TODO: Help message here
      this.channel.send(`<@${this.data.host.id}> is starting a Maplestory Music Quiz!`);
      this.channel.send(WrapMsgAsCodeBlock(`The quiz will start in 20 seconds!`));
      // Join the voice chat
      const connection = await this.vc.join();
      await Delay(20 * 1000);

      for(let i = 1; i <= this.data.rounds; i++) {
        await this.playRound(i, connection);
      }

      this.channel.send(`Thanks for playing!`);
    } finally {
      callback();
    }
  }

  async Listener(user: Discord.User, msg: string): Promise<void> {
    
  }

  // Helper Methods
  //
  async playRound(round: number, connection: Discord.VoiceConnection) {
    // Start the Round
    this.channel.send(WrapMsgAsCodeBlock(`[Round ${round}] Start!`));
    // Randomly pick a song
    // Randomly pick a start time between (0, duration - playtime)
    const video = BGM_LIB[Math.floor(Math.random() * BGM_LIB.length)];
    const info = await ytdl.getInfo(video.youtube);
    const beginAt = Math.floor(
      Math.random() * Math.max(Number(info.videoDetails.lengthSeconds) - this.data.durationSecs, 0)
      );
    const buffer = ytdl(info.videoDetails.video_url, {
          filter: 'audioonly',
          quality: 'highestaudio',
          opusEncoded: true,
          encoderArgs: [
            '-ss', `${beginAt}`,
          ]
        });
    await Delay(1 * 1000); //TODO: Allow some buffer loading
    const dispatcher = connection.play(buffer, { type: 'opus' })
      .on('error', err => {
        console.log(err);
      });
    this.listenerEnabled = true;
    console.log(`Playing: ${video.metadata.title} - ${info.videoDetails.video_url}`)
    await Delay(this.data.durationSecs * 1000);

    // End the round
    this.listenerEnabled = false;
    this.channel.send(WrapMsgAsCodeBlock(`[Round ${round}] Finish!`));
    // TODO: Allow skips
    await Delay(10 * 1000);
    dispatcher.end();
  }

  addPlayer(user: Discord.User): void {
    if(this.data.players.has(user.id)) {
      return;
    }

    // Add the new player
    this.data.players.set(user.id, {
      user: user,
      score: 0,
      history: new Map<number, string>(),
      archived: false
    });
  }

  removePlayer(user: Discord.User): void {
    // Archive the player
    //  - Player stats is kept
    if(this.data.players.has(user.id)) {
      this.data.players.get(user.id)!.archived = true;
    }
  }
}
