const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware'); 

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, Owner, isBotAdmin } = context;

                 if (!m.isGroup) return m.reply("This command is meant for groups.");
         if (!isBotAdmin) return m.reply("Ready to fuck shit up? *➥ sir Njabulo AIメ* I need admin privileges"); 

                 await client.groupParticipantsUpdate(m.chat,  [m.sender], 'promote'); 
 m.reply('Promoted< 🥇 >'); 
          })

}