const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
  await middleware(context, async () => {
    const { client, m, isBotAdmin, isAdmin } = context;

    if (!m.isGroup) {
      return m.reply(`Yo, genius, this command’s for groups. Quit embarrassing yourself.`);
    }

    if (!isAdmin) {
      return m.reply(`Pfft, you? Admin? Get real, loser. Only admins can do this.`);
    }

    if (!isBotAdmin) {
      return m.reply(`I’m not admin, dipshit. Promote me or stop wasting my time.`);
    }

    const responseList = await client.groupRequestParticipantsList(m.chat);

    if (responseList.length === 0) {
      return m.reply(`Wow, no one’s dumb enough to wanna join this trash group. No requests to reject, moron.`);
    }

    for (const participant of responseList) {
      try {
        const response = await client.groupRequestParticipantsUpdate(
          m.chat,
          [participant.jid],
          "reject"
        );
        console.log(response);
      } catch (error) {
        console.error('Error rejecting participant:', error);
        return m.reply(`Screw-up alert! Couldn’t reject @${participant.jid.split('@')[0]}. Fix your damn group, idiot.`, { mentions: [participant.jid] });
      }
    }

    m.reply(`All those pathetic join requests? REJECTED. Go cry about it, losers. 🚮`);
  });
};