module.exports = async (context) => {
    const { client, m, participants, text } = context;

    if (!m.isGroup) {
        return client.sendMessage(
            m.chat,
            { text: 'Command meant for groups.' },
            { quoted: m }
        );
    }

    try {
        const mentions = participants.map(a => a.id);
        const txt = [
            `Ready to fuck shit up? *➥ sir Njabulo AIメ* `,
            `❒ Hi You have been tagged here.`,
            `  Message: ${text ? text : 'No Message!'}`,
            '',
            ...mentions.map(id => `📧 @${id.split('@')[0]}`),
            `Nice to fuck shit up? *tage people* `
        ].join('\n');

        await client.sendMessage(
            m.chat,
            { text: txt, mentions },
            { quoted: m }
        );
    } catch (error) {
        console.error(`Tagall error: ${error.message}`);
        await client.sendMessage(
            m.chat,
            { text: 'Failed to tag participants. Try again later.' },
            { quoted: m }
        );
    }
};