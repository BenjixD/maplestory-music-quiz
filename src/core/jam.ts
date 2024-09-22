import * as DiscordVoice from '@discordjs/voice';
import * as Discord from 'discord.js';
import ytdl from '../utils/discord-ytdl-core';
import Queue from '../utils/queue';
import { Game, Bgm } from '../types/game';
import { BGM_LIB } from '../data/index';
import { DiscordEmbed, MAPLE_ORANGE } from '../utils/embed';
import {
  WrapMsgAsCodeBlock,
  Delay
} from '../utils/helpers';

export class Jam implements Game {
  // Discord Integration
  client: Discord.Client;
  vc: Discord.VoiceChannel;
  channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;

  // Current Connection
  connection: DiscordVoice.VoiceConnection | null;
  dispatcher: DiscordVoice.AudioPlayer | null;
  songQueue: Queue<{
      bgm: Bgm,
      videoDetails: any,
      buffer: any
    }>;

  constructor(
    client: Discord.Client,
    guildMember: Discord.GuildMember,
    channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel,
    data: {
      host: Discord.User
    }
  ) {
    this.client = client;
    this.channel = channel;
    this.connection = null;
    this.dispatcher = null;
    this.songQueue = new Queue<{
      bgm: Bgm,
      videoDetails: any,
      buffer: any,
    }>();

    // Check if user is in a voice channel
    if(!guildMember.voice.channel || guildMember.voice.channel.type === Discord.ChannelType.GuildStageVoice) {
      channel.send(`<@${data.host.id}>, please join a voice channel to start listening!`);
      throw new Error(`host ${data.host.id} is not in a voice channel.`);
    } else {
      this.vc = guildMember.voice.channel;
    }

    // Check if bot has vc permissions
    const permissions = this.vc.permissionsFor(client.user!);
    if(!permissions!.has(Discord.PermissionsBitField.Flags.Connect) ||
    !permissions!.has(Discord.PermissionsBitField.Flags.Speak)) {
      throw new Error(`client bot has insufficient permissions for voice channel ${this.vc.id}`);
    }
  }

  async Start(callback: () => void): Promise<void> {
    // TODO: Help message here
    // Join the voice chat
    const connection = DiscordVoice.joinVoiceChannel({
      channelId: this.vc.id,
      guildId: this.vc.guild.id,
      adapterCreator: this.vc.guild.voiceAdapterCreator,
    });
    await new Promise<void>((res, rej) => {
      connection.on(DiscordVoice.VoiceConnectionStatus.Ready, () => {
        res();
      });
      connection.on(DiscordVoice.VoiceConnectionStatus.Disconnected, () => {
        rej();
      });
    });
    this.connection = connection;
    this.dispatcher = DiscordVoice.createAudioPlayer();
    this.connection.subscribe(this.dispatcher);
    try {
      // Queue the first song and start playing
      await this.queueSong();
      await this.play();
      // TODO: Fix this
      do {
        await Delay(60 * 1000); // Wait every 60 seconds to check if queue is empty
      } while(this.songQueue.length() > 0);
    } finally {
      this.connection.disconnect();
      callback();
    }
  }

  async Listener(user: Discord.User, msg: string): Promise<void> {
    if(msg === '-s' || msg === '--skip') {
      // End the current stream
      this.dispatcher?.stop();
      this.songQueue.pop();
      this.play();
    }
    else if(msg === '-q' || msg === '--quit') {
      this.dispatcher?.stop();
      this.connection?.disconnect();
      this.songQueue.clear();
      this.channel.send('Bye bye!');
    }
  }

  // Helpers Methods
  //

  // Picks a Random song and adds it into the existing queue
  // Note: Calling this function is a mutation!
  async queueSong(): Promise<void> {
    const bgm = BGM_LIB[Math.floor(Math.random() * BGM_LIB.length)];
    const info = await ytdl.getInfo(bgm.youtube);
    const buffer = ytdl(info.videoDetails.video_url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        opusEncoded: true,
      });

    this.songQueue.push({
      bgm: bgm,
      videoDetails: info.videoDetails,
      buffer: buffer
    });
  }

  async play(): Promise<void> {
    // Get a song from the Queue
    const song = await this.songQueue.front();

    if(!song) {
      return;
    }

    this.channel.send(DiscordEmbed({
      color: MAPLE_ORANGE,
      description: `Now Playing: **${song.bgm.metadata.title}**`,
      image: `https://img.youtube.com/vi/${song.bgm.youtube}/0.jpg`,
    }));
    const resource = DiscordVoice.createAudioResource(song.buffer, { inputType: DiscordVoice.StreamType.Opus });
    // play the resource
    this.dispatcher!.play(resource);
    this.dispatcher!.on('stateChange', (oldState, newState) => {
      if(
        oldState.status === DiscordVoice.AudioPlayerStatus.Playing &&
        newState.status === DiscordVoice.AudioPlayerStatus.Idle) {
        // recursive call (This is pretty bad)
        this.songQueue.pop();
        this.play();
      }
    }).on('error', err => {
        console.log(err);
        // recursive call
        this.songQueue.pop();
        this.play();
      });

    // Queue another song in preparation
    this.queueSong();
  }
}
