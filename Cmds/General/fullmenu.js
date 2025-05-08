const { DateTime } = require('luxon');
const fs = require('fs');
const { getSettings } = require('../../Database/config');

module.exports = {
  name: 'fullmenu',
  aliases: ['allmenu', 'commandslist'],
  description: 'Displays the full bot command menu by category',
  run: async (context) => {
    const { client, m, totalCommands, mode, pict, botname } = context;

    // Handle invalid input
    if (context.text) {
      return client.sendMessage(m.chat, { text: `❦━━━━━━━━━━━━━━━━❦\n│❒ Please use *${context.prefix}fullmenu* without extra text. Let's keep it simple! 😊` }, { quoted: m });
    }

    try {
      // Retrieve settings to get the current prefix
      const settings = await getSettings();
      if (!settings) {
        await client.sendMessage(m.chat, { text: `❦━━━━━━━━━━━━━━━━❦\n│❒ Oops, couldn't load settings. Try again later!` }, { quoted: m });
        return;
      }

      const effectivePrefix = settings.prefix || ''; // Use empty string for prefixless mode

      const categories = [
        { name: 'General', emoji: '📜' },
        { name: 'Settings', emoji: '🛠️' },
        { name: 'Owner', emoji: '👑' },
        { name: 'Heroku', emoji: '☁️' },
        { name: 'Wa-Privacy', emoji: '🔒' },
        { name: 'Groups', emoji: '👥' },
        { name: 'AI', emoji: '🧠' },
        { name: 'Media', emoji: '🎬' },
        { name: 'Editting', emoji: '✂️' },
        { name: 'Logo', emoji: '🎨' },
        { name: '+18', emoji: '🔞' },
        { name: 'Utils', emoji: '🔧' }
      ];

      const getGreeting = () => {
        const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;
        if (currentHour >= 5 && currentHour < 12) return 'Good Morning, early riser! 🌞';
        if (currentHour >= 12 && currentHour < 18) return 'Good Afternoon, sunshine! 🌞';
        if (currentHour >= 18 && currentHour < 22) return 'Good Evening, star gazer! 🌙';
        return 'Good Night, moon chaser! 🌌';
      };

      const getCurrentTimeInNairobi = () => {
        return DateTime.now().setZone('Africa/Nairobi').toLocaleString(DateTime.TIME_SIMPLE);
      };

      const toFancyFont = (text, isUpperCase = false) => {
        const fonts = {
          'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝙿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
          'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
          'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
          'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
        };
        return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
          .split('')
          .map(char => fonts[char] || char)
          .join('');
      };

      const toCustomFont = (text, isUpperCase = false) => {
        const fonts = {
          'A': 'A', 'B': 'Ⴆ', 'C': 'ƈ', 'D': 'ԃ', 'E': 'ҽ', 'F': 'ϝ', 'G': 'ɠ', 'H': 'ԋ', 'I': 'ι', 'J': 'ʝ', 'K': 'ƙ', 'L': 'ʅ', 'M': 'ɱ',
          'N': 'ɳ', 'O': 'σ', 'P': 'ρ', 'Q': 'ϙ', 'R': 'ɾ', 'S': 'ʂ', 'T': 'ƚ', 'U': 'υ', 'V': 'ʋ', 'W': 'ɯ', 'X': 'x', 'Y': 'ყ', 'Z': 'ȥ',
          'a': 'α', 'b': 'Ⴆ', 'c': 'ƈ', 'd': 'ԃ', 'e': 'ҽ', 'f': 'ϝ', 'g': 'ɠ', 'h': 'ԋ', 'i': 'ι', 'j': 'ʝ', 'k': 'ƙ', 'l': 'ʅ', 'm': 'ɱ',
          'n': 'ɳ', 'o': 'σ', 'p': 'ρ', 'q': 'ϙ', 'r': 'ɾ', 's': 'ʂ', 't': 'ƚ', 'u': 'υ', 'v': 'ʋ', 'w': 'ɯ', 'x': 'x', 'y': 'ყ', 'z': 'ȥ'
        };
        return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
          .split('')
          .map(char => fonts[char] || char)
          .join('');
      };

      let menuText = `❦━━━━━━━━━━━━━━━━❦\n│☆ *Welcome to ${toFancyFont(botname)}!* ☢\n\n`;
      menuText += `${getGreeting()} @${m.sender.split('@')[0]}\n\n`;
      menuText += `👤 *${toCustomFont('User')}*: @${m.sender.split('@')[0]}\n`;
      menuText += `🤖 *${toCustomFont('Bot')}*: ${toFancyFont(botname)}\n`;
      menuText += `📋 *${toCustomFont('Total Commands')}*: ${totalCommands}\n`;
      menuText += `🕒 *${toCustomFont('Time')}*: ${getCurrentTimeInNairobi()}\n`;
      menuText += `🔣 *${toCustomFont('Prefix')}*: ${effectivePrefix || 'None'}\n`;
      menuText += `🌐 *${toCustomFont('Mode')}*: ${mode}\n`;
      menuText += `📚 *${toCustomFont('Library')}*: Baileys\n`;
      menuText += `\n❦━━━━━━━━━━━━━━━━❦\n\n`;

      menuText += `*📖 Full Command Menu ☠*\n`;

      for (const category of categories) {
        const commandFiles = fs.readdirSync(`./Cmds/${category.name}`).filter(file => file.endsWith('.js'));
        if (commandFiles.length === 0 && category.name !== '+18') continue;

        const fancyCategory = toCustomFont(category.name, true);
        menuText += `\n❲${fancyCategory} ${category.emoji}❳\n`;

        if (category.name === '+18') {
          const plus18Commands = ['xvideo'];
          for (const cmd of plus18Commands) {
            const fancyCommandName = toFancyFont(cmd);
            menuText += `  ➤ *${fancyCommandName}*\n`;
          }
        }

        for (const file of commandFiles) {
          const commandName = file.replace('.js', '');
          const fancyCommandName = toFancyFont(commandName);
          menuText += `  ➤ *${fancyCommandName}*\n`;
        }
      }

      menuText += `\n❦━━━━━━━━━━━━━━━━❦\n`;
      menuText += `*Explore the power of ${toFancyFont(botname)}! ☆*\n`;
      menuText += `Powered by Toxic-MD\n`;
      menuText += `❦☠☆☢\n`;

      await client.sendMessage(m.chat, {
        text: menuText,
        footer: `Powered by Toxic-MD`,
        buttons: [
          { buttonId: `${effectivePrefix}repo`, buttonText: { displayText: `📂 ${toFancyFont('REPO')}` }, type: 1 }
        ],
        headerType: 1,
        contextInfo: {
          externalAdReply: {
            showAdAttribution: false,
            title: `${botname}`,
            body: `Ready to explore, @${m.sender.split('@')[0]}?`,
            thumbnail: pict,
            sourceUrl: `https://github.com/xhclintohn/Toxic-MD`,
            mediaType: 1,
            renderLargerThumbnail: true
          },
          mentionedJid: [m.sender] // Mention the user
        }
      }, { quoted: m });

    } catch (error) {
      console.error('Error generating full menu:', error);
      await client.sendMessage(m.chat, {
        text: `❦━━━━━━━━━━━━━━━━❦\n│❒ Sorry, something went wrong with the menu. Try again later!\n\nPowered by Toxic-MD`
      }, { quoted: m });
    }
  }
};