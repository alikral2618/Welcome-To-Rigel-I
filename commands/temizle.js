const { PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'temizle',
  description: 'Belirtilen sayıda mesaj siler',
  async execute(message, args) {
    const miktar = parseInt(args[0]);

    if (!miktar || miktar < 1 || miktar > 100) {
      return message.reply('Lütfen 1 ile 100 arasında bir sayı girin!');
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
};