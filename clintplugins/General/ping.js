const { getSettings } = require('../../Database/config');
const axios = require('axios');

module.exports = {
  name: 'ping',
  aliases: ['p'],
  description: 'Checks the bot\'s response time, uptime, and status with a sassy vibe',
  run: async (context) => {
    const { client, m, toxicspeed } = context;

    try {
      // Validate m.sender
      if (!m.sender || typeof m.sender !== 'string' || !m.sender.includes('@s.whatsapp.net')) {
        console.error(`Invalid m.sender: ${JSON.stringify(m.sender)}`);
        return m.reply(`◎━━━━━━━━━━━━━━━━◎\n│❒ Can't read your number, genius! Try again.\nCheck https://github.com/xhclintohn/Toxic-MD\n◎━━━━━━━━━━━━━━━━◎`);
      }

      // Validate toxicspeed
      if (typeof toxicspeed !== 'number' || isNaN(toxicspeed)) {
        console.error(`Invalid toxicspeed: ${toxicspeed}`);
        return m.reply(`◎━━━━━━━━━━━━━━━━◎\n│❒ Ping's broken, @${m.sender.split('@')[0]}! Speed data's fucked.\nCheck https://github.com/xhclintohn/Toxic-MD\n◎━━━━━━━━━━━━━━━━◎`, { mentions: [m.sender] });
      }

      // Retrieve settings to get the current prefix
      const settings = await getSettings();
      if (!settings) {
        return m.reply(`◎━━━━━━━━━━━━━━━━◎\n│❒ Error: Couldn't load settings, you dumb fuck.\nCheck https://github.com/xhclintohn/Toxic-MD\n◎━━━━━━━━━━━━━━━━◎`);
      }

      const toFancyFont = (text, isUpperCase = false) => {
        const fonts = {
          'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈',
          'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕',
          'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢',
          'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯'
        };
        return (isUpperCase ? text.toUpperCase() : text.toLowerCase())
          .split('')
          .map(char => fonts[char] || char)
          .join('');
      };

      // Uptime
      const formatUptime = (seconds) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        const daysDisplay = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}, ` : '';
        const hoursDisplay = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}, ` : '';
        const minutesDisplay =  minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}, ` : '';
        const secsDisplay = secs > 0 ? `${secs} ${secs === 1 ? 'second' : 'seconds'}` : '';

        return (daysDisplay + hoursDisplay + minutesDisplay + secsDisplay).replace(/,\s*$/, '');
      };

      const userNumber = m.sender.split('@')[0];
      const pingTime = toxicspeed.toFixed(4);
      const uptimeText = formatUptime(process.uptime());
      const botName = 'Toxic-MD';

      const listButton = {
        text: `◎━━━━━━━━━━━━━━━━◎\n│❒ *Pong, @${m.pushName}!* 🏓\n\n│ ⏱️ *Response Time*: ${pingTime}ms\n│ ⏰ *Uptime*: ${uptimeText}\n│ 🟢 *Status*: Active\n\nI'm running like a damn beast! 😈\n\n> Pσɯҽɾҽԃ Ⴆყ Toxic-MD\n◎━━━━━━━━━━━━━━━━◎`,
        footer: 'Toxic-MD',
        mentions: [m.sender],
        buttonText: "Select an option",
        sections: [
          {
            title: "Toxic-MD Options",
            rows: [
              {
                title: "📊 Bot Stats",
                description: "Get bot stats",
                rowId: "bot_stats"
              },
              {
                title: "ℹ️ Help",
                description: "Get help",
                rowId: "bot_help"
              }
            ]
          }
        ]
      };

      if (context.pict) {
        listButton.headerType = 1;
        listButton.thumbnail = context.pict;
      }

      await client.sendMessage(m.chat, listButton);

    } catch (error) {
      console.error(`Ping command fucked up: ${error.stack}`);
      await client.sendMessage(m.chat, {
        text: `◎━━━━━━━━━━━━━━━━◎\n│❒ Ping's fucked, @${m.sender.split('@')[0]}! Try again, you slacker.\nCheck https://github.com/xhclintohn/Toxic-MD\n◎━━━━━━━━━━━━━━━━◎`,
        mentions: [m.sender]
      }, { quoted: m });
    }
  }
};
