import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { resetarGuilda } from './estruturaGuilda.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

client.once('ready', async () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) return console.error('Guilda não encontrada.');
  await resetarGuilda(guild);
  console.log('Reset concluído.');
  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
