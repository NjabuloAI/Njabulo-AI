module.exports = {
  name: 'del',
  aliases: ['delete', 'd'],
  description: 'Deletes the replied-to or quoted message, you lazy fuck',
  run: async (context) => {
    const { client, m, botname } = context;

    if (!botname) {
      console.error(`Botname not set, you useless fuck.`);
      return m.reply(`Bot’s fucked. No botname in context. Yell at the dev, dipshit.`);
    }

    try {
      // Validate m.sender
      if (!m.sender || typeof m.sender !== 'string' || !m.sender.includes('@s.whatsapp.net')) {
        console.error(`Invalid m.sender: ${JSON.stringify(m.sender)}`);
        return m.reply(`Shit’s broken, can’t read your number! Try again, you dumbass.`);
      }

      const userNumber = m.sender.split('@')[0];
      const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
      const isGroup = m.key.remoteJid.endsWith('@g.us');

      // Check for replied-to or quoted message
      let deleteKey = null;
      let quotedSender = null;

      // Try replied-to message (contextInfo)
      if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        const contextInfo = m.message.extendedTextMessage.contextInfo;
        if (contextInfo.stanzaId && contextInfo.participant) {
          deleteKey = {
            remoteJid: contextInfo.remoteJid || m.key.remoteJid,
            fromMe: contextInfo.participant === botJid,
            id: contextInfo.stanzaId,
            participant: contextInfo.participant
          };
          quotedSender = contextInfo.participant;
        }
      }

      // Fallback to quoted message (m.quoted)
      if (!deleteKey && m.quoted && m.quoted.message) {
        deleteKey = {
          remoteJid: m.quoted.key.remoteJid,
          fromMe: m.quoted.fromMe,
          id: m.quoted.key.id,
          participant: m.quoted.key.participant || m.quoted.sender
        };
        quotedSender = m.quoted.sender;
      }

      // If no replied-to or quoted message
      if (!deleteKey) {
        return m.reply(`Reply to or quote a message to delete, you dumbass! 😈`);
      }

      // If in group, check bot admin status for non-bot messages
      if (isGroup && !deleteKey.fromMe) {
        const groupMetadata = await client.groupMetadata(m.key.remoteJid);
        const groupAdmins = groupMetadata.participants.filter(p => p.admin != null).map(p => p.id);
        const isBotAdmin = groupAdmins.includes(botJid);

        if (!isBotAdmin) {
          return m.reply(`I’m not an admin, you lazy fuck! Can’t delete @${quotedSender.split('@')[0]}’s message. Promote me, @${userNumber}!`, {
            mentions: [quotedSender, m.sender]
          });
        }
      }

      // Delete the message
      await client.sendMessage(m.key.remoteJid, { delete: deleteKey });

      await m.reply(`Message deleted, you sneaky bastard @${userNumber}! 🗑️\nPowered by *${botname}* 😈`, {
        mentions: [m.sender]
      });

    } catch (error) {
      console.error(`Del command fucked up: ${error.stack}`);
      await m.reply(`Shit broke, @${m.sender.split('@')[0]}! Couldn’t delete the message. Try again, you useless fuck.`, {
        mentions: [m.sender]
      });
    }
  }
};