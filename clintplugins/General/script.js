module.exports = async (context) => {
  const { client, m, text, botname, prefix = '' } = context;

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

  if (text) {
    return client.sendMessage(m.chat, { text: `Yo, ${m.pushName}, what’s with the extra garbage? Just say !repo, you idiot.` }, { quoted: m });
  }

  try {
    const repoUrl = 'https://api.github.com/repos/NjabuloJ/Njabulo-Jb';
    const response = await fetch(repoUrl);
    const repoData = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch repository data');
    }

    const repoInfo = {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      lastUpdate: repoData.updated_at,
      owner: repoData.owner.login,
      createdAt: repoData.created_at,
      htmlUrl: repoData.html_url
    };

    const createdDate = new Date(repoInfo.createdAt).toLocaleDateString('en-GB');
    const lastUpdateDate = new Date(repoInfo.lastUpdate).toLocaleDateString('en-GB');
    const urlimage = "https://files.catbox.moe/lhmme5.jpg";
    const replyText = `*🌐${botname} Repository 🌐*\n\n` +
                     `🌟 *Sƚαɾʂ*: ${repoInfo.stars}\n` +
                     `🔗 *Fσɾƙʂ*: ${repoInfo.forks}\n` +
                     `📅 *Cɾҽαƚҽԃ*: ${createdDate}\n` +
                     `🕒 *Lαʂƚ Uρԃαƚҽԃ*: ${lastUpdateDate}\n` +
                     `🔍 *Vιʂιƚ*: ${repoInfo.htmlUrl}\n\n` +
                     `@⁨ ${m.pushName}⁩👋 Don't forget to star and fork my repository`;

    const buttons = [
      {
        "buttonId":  `${prefix}ping`,
        "buttonText": { "displayText": "➲stᥲtᥙs ρong" },
        "type": 1
      },
      {
        "buttonId":  `${prefix}menu`,
        "buttonText": { "displayText": "➲stᥲtᥙs ᥕᥱbsιtᥱ " },
        "type": 1
      }
    ];
    
await client.sendMessage(m.chat, {
    image: { url: urlimage },
     caption: replyText,
     buttons: buttons,
        headerType: 4,
      contextInfo: {
        externalAdReply: {
         title: "Repository 🍥Njabulo AI",
         mediaType: 1,
          previewType: 0,
         thumbnailUrl: urlimage,
         renderLargerThumbnail: false,
        },
        },
          }, { quoted: {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: "njᥲbᥙᥣo",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Njabulo-Jb;BOT;;;\nFN:Njabulo-Jb\nitem1.TEL;waid=26777821911:+26777821911\nitem1.X-ABLabel:Bot\nEND:VCARD`
                }
            }
        } });

    
      // Send the audio as a voice note after the ping message
      const audioUrl = 'https://files.catbox.moe/4ufunx.mp3';
      await client.sendMessage(m.chat, {
        audio: { url: audioUrl },
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: m });
        
  } catch (error) {
    console.error('Error in repo command:', error);
    await client.sendMessage(m.chat, { text: `Couldn’t grab repo info, something’s fucked up. Check it yourself: ` }, { quoted: m });
  }
};
