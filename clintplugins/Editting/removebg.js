const fs = require('fs').promises;
const path = require('path');

module.exports = async (context) => {
    const { client, m, mime, uploadtoimgur } = context;

    try {
        const cap = 'By ➥ sir Njabulo AIメ';

        if (!m.quoted) {
            return m.reply('Send the image then tag it with the command.');
        }

        if (!/image/.test(mime)) {
            return m.reply('That is not an image, try again while quoting an actual image.');
        }

        const tempFile = path.join(__dirname, `temp-${Date.now()}.jpg`);
        const fdr = await client.downloadAndSaveMediaMessage(m.quoted, tempFile);

        await m.reply('A moment, Toxic-MD is erasing the background...');

        const fta = await uploadtoimgur(fdr);
        const image = `https://api.dreaded.site/api/removebg?imageurl=${fta}`;

        await client.sendMessage(
            m.chat,
            { image: { url: image }, caption: cap },
            { quoted: m }
        );

        await fs.unlink(tempFile).catch(() => console.warn('Failed to delete temp file'));
    } catch (error) {
        console.error(`RemoveBG error: ${error.message}`);
        await m.reply('An error occurred while processing the image. Please try again.');
    }
};