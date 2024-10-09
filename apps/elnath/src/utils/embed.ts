import * as Discord from 'discord.js';

export const MAPLE_ORANGE='#FFA500';

export function DiscordEmbed(params: {
  color: string,
  title?: string,
  url?: string,
  author?: {
    name: string,
    iconURL: string,
    url: string,
  },
  description?: string,
  thumbnail?: string,
  fields?: { name: string, value:string, inline?: boolean }[],
  image?: string,
  showTimestamp?: boolean,
  footer?: { text: string, iconURL?: string }
}): Discord.MessageEmbed {
  const embed = new Discord.MessageEmbed()
    .setColor(params.color)

  if(params.title) embed.setTitle(params.title);
  if(params.url) embed.setURL(params.url);
  if(params.author) embed.setAuthor(params.author.name, params.author.iconURL, params.author.url);
  if(params.description) embed.setDescription(params.description);
  if(params.thumbnail) embed.setThumbnail(params.thumbnail);
  if(params.fields) embed.addFields(...params.fields);
  if(params.image) embed.setImage(params.image);
  if(params.showTimestamp) embed.setTimestamp();
  if(params.footer) embed.setFooter(params.footer.text, params.footer.iconURL);

  return embed;
}