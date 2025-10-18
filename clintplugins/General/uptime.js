module.exports = async (context) => {
  const { client, m, text, botname } = context;

  if (text) {
    return client.sendMessage(m.chat, { text: `◈━━━━━━━━━━━━━━━━◈\n│❒ What’s with the extra crap, ${m.pushName}? Just say !uptime, dumbass.` }, { quoted: m });
  }

  try {
    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      const daysDisplay = days > 0 ? `${days} ${days === 1 ? 'day' : 'days'}, ` : '';
      const hoursDisplay = hours > 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}, ` : '';
      const minutesDisplay = minutes > 0 ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}, ` : '';
      const secsDisplay = secs > 0 ? `${secs} ${secs === 1 ? 'second' : 'seconds'}` : '';

      return (daysDisplay + hoursDisplay + minutesDisplay + secsDisplay).replace(/,\s*$/, '');
    };

    const uptimeText = formatUptime(process.uptime());
    const imageUrl = "https://i.imgur.com/bdx9ImP.jpeg";
    const buttons = [
  {
    buttonId:   `${prefix}ping`,
    buttonText: { displayText: '📊 ping' },
    type: 1
  },
  {
    buttonId:  `${prefix}menu`,
    buttonText: { displayText: '🤔 Help' },
    type: 1
  },
  {
    buttonId:  `${prefix}alive`,
    buttonText: { displayText: '⏰ alive' },
    type: 1
  }
];
      
const buttonMessage = {
  image: { url: imageUrl },
  caption: `⏰ *Uptime*: ${uptimeText}`,
  footer: 'Njabulo-AI',
  buttons: buttons,
  headerType: 1
};

await client.sendMessage(m.chat, buttonMessage, { quoted: m });
                        
  } catch (error) {
    console.error('Error in uptime command:', error);
    await client.sendMessage(m.chat, { text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Yo, something’s fucked up with the uptime check. Try again later, loser.` }, { quoted: m });
  }
};
