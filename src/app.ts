import ytdl from 'ytdl-core';
import * as Discord from 'discord.js';
import {
  GameInstance
} from './utils/game';
import {
  token,
  prefix
} from './.config.json';

// (async () => {
//  // Video Details
//  let info = await ytdl.getInfo(VIDEO_ID);
//  console.log(info.videoDetails);
// })();

const client = new Discord.Client();
const games = new Map<Discord.Channel, GameInstance>();

client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const msg = message.content.slice(prefix.length).trim();

  if(msg === '-p') {
    playGameHandler(message);
  }
  else {
    try {
      // Delegate all other commands to the games themselves
      // ...  
    } catch(err) {
      helpHandler(message, err);
    }
  }
});

function helpHandler(message: Discord.Message, err: Error) {
  message.channel.send(`TBD - help!`);
}

function playGameHandler(message: Discord.Message) {
  if(games.has(message.channel)) {
    message.channel.send(`<@${message.author.id}>, an ongoing game is already happening in this channel!`);
    return;
  }

  try {
    // TODO: hardcoded values
    const game = new GameInstance(client, message.member!, message.channel, {
      host: message.author,
      rounds: 20,
      difficulty: 'any',
      durationSecs: 30,
    });
    games.set(message.channel, game);
    game.start(() => {
      games.delete(message.channel);
    });
  } catch(err) {
    console.log(err);
  }
}

client.login(token);






