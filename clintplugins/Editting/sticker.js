const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require('fs').promises;
const path = require('path');
const { queue } = require('async');

// Queue to process one sticker at a time
const commandQueue = queue(async (task, callback) => {
    try {
        await task.run(task.context);
    } catch (error) {
        console.error(`Sticker error: ${error.message}`);
    }
    callback();
}, 1); // 1 at a time

// Rate limiting: track last execution time per user
const userLastUsed = new Map();
const RATE_LIMIT_MS = 30000; // 30 seconds cooldown per user

module.exports = async (context) => {
    const { client, m, mime, packname, author } = context;

    // Rate limiting check
    const now = Date.now();
    const lastUsed = userLastUsed.get(m.sender) || 0;
    if (now - lastUsed < RATE_LIMIT_MS) {
        return m.reply(`◈━━━━━━━━━━━━━━━━◈\n❒ Please wait ${Math.ceil((RATE_LIMIT_MS - (now - lastUsed)) / 1000)} seconds before using this command again.\n◈━━━━━━━━━━━━━━━━◈`);
    }

    commandQueue.push({
        context,
        run: async ({ client, m, mime, packname, author }) => {
            try {
                if (!m.quoted) {
                    return m.reply('◈━━━━━━━━━━━━━━━━◈\n❒ Quote an image or a short video.\n◈━━━━━━━━━━━━━━━━◈');
                }

                if (!/image|video/.test(mime)) {
                    return m.reply('◈━━━━━━━━━━━━━━━━◈\n❒ That is neither an image nor a short video!\n◈━━━━━━━━━━━━━━━━◈');
                }

                if (m.quoted.videoMessage && m.quoted.videoMessage.seconds > 30) {
                    return m.reply('◈━━━━━━━━━━━━━━━━◈\n❒ Videos must be 30 seconds or shorter.\n◈━━━━━━━━━━━━━━━━◈');
                }

                const tempFile = path.join(__dirname, `temp-sticker-${Date.now()}.${/image/.test(mime) ? 'jpg' : 'mp4'}`);
                await m.reply('◈━━━━━━━━━━━━━━━━◈\n❒ A moment, Toxic-MD is creating the sticker...\n◈━━━━━━━━━━━━━━━━◈');

                const media = await client.downloadAndSaveMediaMessage(m.quoted, tempFile);

                const stickerResult = new Sticker(media, {
                    pack: packname || 'Toxic-MD Pack',
                    author: author || 'Toxic-MD',
                    type: StickerTypes.FULL,
                    categories: ['🤩', '🎉'],
                    id: '12345',
                    quality: 50, // Lower quality to reduce memory
                    background: 'transparent'
                });

                const buffer = await stickerResult.toBuffer();
                await client.sendMessage(m.chat, { sticker: buffer }, { quoted: m });

                await fs.unlink(tempFile).catch(() => console.warn('Failed to delete temp file'));
                userLastUsed.set(m.sender, Date.now()); // Update last used time
            } catch (error) {
                console.error(`Sticker error: ${error.message}`);
                await m.reply('◈━━━━━━━━━━━━━━━━◈\n❒ An error occurred while creating the sticker. Please try again.\n◈━━━━━━━━━━━━━━━━◈');
            }
        }
    });
};