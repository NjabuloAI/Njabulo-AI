const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, args, Owner, botname } = context;

        // Basic context checks with line-styled toxic replies
        if (!botname) {
            console.error(`Join-Error: botname missing in context.`);
            return m.reply(
                `Bot’s fucked. No botname in context. Yell at your dev, dumbass.\n◈━━━━━━━━━━━━━━━━◈`
            );
        }

        if (!Owner) {
            console.error(`Join-Error: Owner missing in context.`);
            return m.reply(
                `bot’s broken. No owner in context. Go cry to the dev.\n◈━━━━━━━━━━━━━━━━◈`
            );
        }

        // Accept link from: command arg, replied message, or raw text anywhere
        let raw = (text && text.trim()) || (m.quoted && ((m.quoted.text) || (m.quoted && m.quoted.caption))) || "";
        raw = String(raw || "").trim();

        if (!raw) {
            return m.reply(
                `Provide a real group invite link or reply to one. Example: *${args && args[0] ? args[0] : '.join https://chat.whatsapp.com/abcdef...'}*\n◈━━━━━━━━━━━━━━━━◈`
            );
        }

        // Extract invite code robustly (supports full URL or plain code)
        const urlRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i;
        const match = raw.match(urlRegex);
        let inviteCode = match ? match[1] : null;

        // If no URL, maybe user sent only the code
        if (!inviteCode) {
            // take first token (in case user typed ".join <code>")
            const token = raw.split(/\s+/)[0];
            // simple validation: must be alphanumeric-ish and length > 10 (len varies)
            if (/^[A-Za-z0-9_-]{8,}$/.test(token)) {
                inviteCode = token;
            }
        }

        if (!inviteCode) {
            return m.reply(
                `That ain't a valid link or invite code. Don’t waste my time.`
            );
        }

        inviteCode = inviteCode.replace(/\?.*$/, '').trim(); // strip query params if any

        try {
            // Get info first so we can show subject in success message
            const info = await client.groupGetInviteInfo(inviteCode);
            const subject = info?.subject || info?.groupMetadata?.subject || "Unknown Group";

            // Try to accept invite
            await client.groupAcceptInvite(inviteCode);

            return m.reply(
                `✅ Joined: *${subject}*\n Don’t spam, or I’ll ghost you. — ${botname}\n◈━━━━━━━━━━━━━━━━◈`
            );
        } catch (error) {
            // Log for debugging
            console.error(`[JOIN-ERROR] invite=${inviteCode}`, error && (error.stack || error));

            // Try to normalize the error status code from various shapes
            const status =
                (error && error.output && error.output.statusCode) ||
                error?.statusCode ||
                error?.status ||
                (error?.data && (error.data.status || error.data)) ||
                (error?.response && error.response.status) ||
                null;

            // Map common cases (keeping your original messages but a bit polished)
            if (status === 400 || status === 404) {
                return m.reply(
                    `❌ Group does not exist or the link is invalid. Stop sending me trash links.`
                );
            }
            if (status === 401) {
                return m.reply(
                    `🚫 I was previously removed from that group. I can’t rejoin using this link.`
                );
            }
            if (status === 409) {
                return m.reply(
                    `🤨 I’m already in that group, genius. You trying to confuse me?`
                );
            }
            if (status === 410) {
                return m.reply(
                    `🔄 That invite link was reset. Get a fresh one and try again.`
                );
            }
            if (status === 403) {
                return m.reply(
                    `🔒 I don’t have permission to join that group. Maybe it’s private.`
                );
            }
            if (status === 500) {
                return m.reply(
                    `📛 That group is full or server error. Try later or check the link.`
                );
            }

            // If nothing matched, try to present a helpful message including raw error text
            const shortMsg = (error && (error.message || (typeof error === 'string' ? error : 'Unknown error'))) || 'Unknown error';
            return m.reply(
                `💀 Failed to join: ${shortMsg}\nCheck the link or try again. If it persists, check logs.`
            );
        }
    });
};