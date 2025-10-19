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

module.exports = async (context) => {
    const { client, m, mime, packname, author } = context;

    commandQueue.push({
        context,
        run: async ({ client, m, mime, packname, author }) => {
            try {
                if (!m.quoted) {
                    return m.reply('Quote an image or a short video.');
                }

                if (!/image|video/.test(mime)) {
                    return m.reply('That is neither an image nor a short video!');
                }

                if (m.quoted.videoMessage && m.quoted.videoMessage.seconds > 30) {
                    return m.reply('Videos must be 30 seconds or shorter.');
                }

                const tempFile = path.join(__dirname, `temp-sticker-${Date.now()}.${/image/.test(mime) ? 'jpg' : 'mp4'}`);
                await m.reply('A moment, Toxic-MD is creating the sticker...');

                const media = await client.downloadAndSaveMediaMessage(m.quoted, tempFile);

                const stickerResult = new Sticker(media, {
                    pack: packname || '➥ sir Njabulo AIメ Pack',
                    author: author || '➥ sir Njabulo AIメ',
                    type: StickerTypes.FULL,
                    categories: ['🤩', '🎉'],
                    id: '12345',
                    quality: 50, // Lower quality to reduce memory
                    background: 'transparent'
                });

                const buffer = await stickerResult.toBuffer();
                await client.sendMessage(m.chat, { sticker: buffer }, { quoted: m });

                await fs.unlink(tempFile).catch(() => console.warn('Failed to delete temp file'));
            } catch (error) {
                console.error(`Sticker error: ${error.message}`);
                await m.reply('An error occurred while creating the sticker. Please try again.');
            }
        }
    });
};