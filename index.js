require("dotenv").config()

const { Client, GatewayIntentBits, ActivityType, PermissionsBitField } = require('discord.js');
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

// 🔥 BURASI DÜZGÜN EVENT
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content === '!ping') {
    return message.reply('Pong!');
  }

  if (message.content === '!join') {
    const { channel } = message.member.voice;
    if (!channel) return message.reply('Önce bir ses kanalına gir!');

    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false
    });

    return message.reply(`Ses kanalına katıldım: ${channel.name}`);
  }

  // 🔥 TEMİZLE KOMUTU (DOĞRU YERDE)
  if (message.content.startsWith('+temizle')) {
    const args = message.content.split(' ');
    const miktar = parseInt(args[1]);

    if (!miktar || miktar < 1 || miktar > 100) {
      return message.reply('Lütfen 1 ile 100 arasında bir sayı gir!');
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('Mesajları silmek için yetkin yok!');
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return message.reply('Botun mesajları silme yetkisi yok!');
    }

    try {
      const deleted = await message.channel.bulkDelete(miktar, true);

      message.channel.send(`${deleted.size} mesaj başarıyla silindi!`).then(msg => {
        setTimeout(() => msg.delete(), 5000);
      });

    } catch (err) {
      console.error(err);
      message.reply('Mesajlar silinemedi. 14 günden eski mesajlar silinemez.');
    }
  }
});

client.login(process.env.TOKEN);