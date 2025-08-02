const { getSettings, getSudoUsers } = require("../Database/config");

module.exports = async (client, m, store) => {
    try {
        if (!m || !m.message || m.key.fromMe) return;

        const settings = await getSettings();
        if (!settings || !settings.antilink) return;

        const botNumber = await client.decodeJid(client.user.id);
        const sender = m.sender ? await client.decodeJid(m.sender) : null;
        const senderNumber = sender ? sender.split('@')[0] : null;

        if (!m.isGroup || !sender || !senderNumber) return;

        const groupMetadata = await client.groupMetadata(m.chat).catch(() => null);
        if (!groupMetadata) return;

        const participants = groupMetadata.participants || [];
        const admins = participants.filter(p => p.admin === "admin" || p.admin === "superadmin").map(p => p.id);

        if (admins.includes(sender)) return;

        const messageContent = (
            m.message?.conversation ||
            m.message?.extendedTextMessage?.text ||
            m.message?.imageMessage?.caption ||
            m.message?.videoMessage?.caption ||
            ""
        ).trim();

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if (!urlRegex.test(messageContent)) return;

        const isBotAdmin = admins.includes(botNumber);
        if (!isBotAdmin) return;

        try {
            await client.sendMessage(m.chat, {
                delete: m.key
            });
            await client.sendMessage(m.chat, {
                text: `◈━━━━━━━━━━━━━━━━◈\n│❒ Yo, ${m.pushName || "No Name"}! Links are banned here, you dumbass! 😈 Keep it up, and you’re toast! 🦁\n┗━━━━━━━━━━━━━━━┛`
            }, { quoted: m });
        } catch (e) {
            console.error("Toxic-MD Antilink Error:", e);
        }
    } catch (e) {
        console.error("Toxic-MD Antilink Error:", e);
    }
};