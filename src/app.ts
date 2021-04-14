import * as Discord from 'discord.js';
import { Game } from './types/game';
import { Quiz } from './core/quiz';
import { Jam } from './core/jam';
import {
  token,
  prefix
} from './.config.json';

const client = new Discord.Client();
const games = new Map<Discord.Guild, Game>();

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

  if(msg === '-p' || msg === '--play') {
    makeQuizHandler(message);
  }
  else if(msg === '-l' || msg === '--listen') {
    makeJamHandler(message);
  }
  else {
    try {
      // Delegate all other commands to the games themselves
      if(message.guild === null) {
        return;
      }
      const game = games.get(message.guild);
      if(game) game.Listener(message.author, msg);
    } catch(err) {
      helpHandler(message, err);
    }
  }
});

function helpHandler(message: Discord.Message, err: Error) {
  message.channel.send(`TBD - help!`);
}

// Game Mode Creation
function makeJamHandler(message: Discord.Message) {
  // Avoid DM messages?
  if(message.guild === null) {
    return;
  }

  if(games.has(message.guild)) {
    message.channel.send(`<@${message.author.id}>, an ongoing session is already happening in this Server!`);
    return;
  }

  try {
    const game = new Jam(client, message.member!, message.channel, {
      host: message.author,
    });
    games.set(message.guild, game);
    game.Start(() => {
      games.delete(message.guild!);
    });
  } catch(err) {
    console.log(err);
  }
}

function makeQuizHandler(message: Discord.Message) {
  // Avoid DM messages?
  if(message.guild === null) {
    return;
  }

  if(games.has(message.guild)) {
    message.channel.send(`<@${message.author.id}>, an ongoing session is already happening in this Server!`);
    return;
  }

  try {
    // TODO: hardcoded values
    const game = new Quiz(client, message.member!, message.channel, {
      host: message.author,
      rounds: 20,
      difficulty: 'any',
      durationSecs: 30,
    });
    games.set(message.guild, game);
    game.Start(() => {
      games.delete(message.guild!);
    });
  } catch(err) {
    console.log(err);
  }
}

client.login(token);






