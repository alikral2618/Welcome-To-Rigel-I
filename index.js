require("dotenv").config()

const { Client, GatewayIntentBits, ActivityType } = require('discord.js'); // 🔥 EKLENDİ
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log(`${client.user.tag} aktif!`);

  const setStatus = () => {
    const statuses = [
      '👀 Sunucuyu izliyor',
      '⚙️ Komutları izliyor',
      `🌐 ${client.guilds.cache.size} sunucuya bakıyor`,
      '🎥 YouTube: @NextAli',
      '🚀 Aktif!'
    ];

    const random = statuses[Math.floor(Math.random() * statuses.length)];

    client.user.setPresence({
      status: 'dnd',
      activities: [{
        name: random,
        type: ActivityType.Watching
      }]
    });

    console.log("Status:", random);
  };

  setStatus();
  setInterval(setStatus, 10000);
});

client.on('messageCreate', message => {
  if (message.content === '.ping') {
    message.reply('Pong!');
  }

  if (message.content === '.join') {
    const { channel } = message.member.voice;
    if (!channel) return message.reply('Önce bir ses kanalına gir!');

    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false
    });

    message.reply(`Ses kanalına katıldım: ${channel.name}`);
  }
});

// Token
console.log("TOKEN:", process.env.TOKEN);
client.login(process.env.TOKEN);
