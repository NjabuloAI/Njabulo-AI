const fetch = require('node-fetch');

module.exports = async (context) => {
    const { client, m, text, botname } = context;

    if (!botname) {
        return m.reply(`Bot’s screwed, no botname set. Yell at your dev, dipshit.`);
    }

    if (!text) {
        return m.reply(`Oi, ${m.pushName}, you forgot the damn prompt! Try: .imagine a badass dragon burning shit.`);
    }

    try {
        const encodedText = encodeURIComponent(text);
        const apiUrl = `https://api.shizo.top/ai/imagine?apikey=shizo&prompt=${encodedText}`;
        const response = await fetch(apiUrl, { timeout: 10000 });
        if (!response.ok) {
            throw new Error(`API puked with status ${response.status}`);
        }

        const data = await response.json();
        if (!data.status || !data.msg) {
            return m.reply(`API’s useless, ${m.pushName}! No image, try again, loser.`);
        }

        await client.sendMessage(
            m.chat,
            {
                image: { url: data.msg },
                caption: `*🍥General by Njabulo AI*`
            },
            { quoted: m }
        );
    } catch (error) {
        await m.reply(`Shit broke, ${m.pushName}! Couldn’t generate your stupid image. Try later, you whiny prick.`);
    }
};
