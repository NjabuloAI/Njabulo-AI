module.exports = async (context) => {
  const { client, m, text, botname, fetchJson } = context;

  if (!text || text.trim() === '') {
    return m.reply(`Yo, brain-dead moron, give me some text for the Light Effect logo! Use *!lighteffect SomeText* or fuck off! 😡`);
  }

  try {
    const cleanedText = text.trim().slice(0, 50).replace(/[^a-zA-Z0-9\s]/g, '');
    if (cleanedText.length < 3) {
      return m.reply(`What’s this weak-ass text, ${m.pushName}? At least 3 characters, you dumbass! 🙄`);
    }

    const encodedText = encodeURIComponent(cleanedText);
    const data = await fetchJson(`https://api.giftedtech.web.id/api/ephoto360/lighteffect?apikey=gifted&text=${encodedText}`);

    if (data && data.success && data.result && data.result.image_url) {
      const caption = `Here’s your damn *Light Effect* logo, ${m.pushName}! Don’t waste my time again, you dim-witted prick! 😤\n` +
                     `📸 *Text*: ${cleanedText}\n` +
                     `🔗 *Source*: Even ➥ sir Njabulo AIメ’s magic, bitches!\n` +
                     `Powered by *${botname}*`;

      await client.sendMessage(m.chat, { 
        image: { url: data.result.image_url }, 
        caption: caption 
      }, { quoted: m });
    } else {
      await m.reply(`API’s being a bitch, no Light Effect logo for you, loser! Try again later. 😒`);
    }
  } catch (error) {
    console.error('LightEffect API error:', error);
    await m.reply(`Shit hit the fan, ${m.pushName}! Error: ${error.message}. Bug off and try later, you slacker! 😡\nCheck  for help.`);
  }
};