module.exports = async (context) => {
  const { client, m, text, botname } = context;

const fetch = require('node-fetch');

  let cap = `Converted By ${botname}`;

  if (m.quoted && m.quoted.text) {
    const forq = m.quoted.text;

    try {
      let response = await fetch('https://carbonara.solopov.dev/api/cook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: forq,
          backgroundColor: '#1F816D',
        }),
      });

      if (!response.ok) return m.reply('Ready to fuck shit up? *➥ sir Njabulo AIメ* \n🤬API failed to fetch a valid response.')

      let per = await response.buffer();

      await client.sendMessage(m.chat, { image: per, caption: cap }, { quoted: m });
    } catch (error) {
      m.reply("😔Ready to fuck shit up? *➥ sir Njabulo AIメ* An error occured\n" + error)
    }
  } else {
    m.reply('Quote a code message');
  }
}