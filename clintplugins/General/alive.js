const fs = require('fs');
const path = require('path');

module.exports = async (context) => {
    const { client, m, prefix, pict, botname } = context;

    if (!botname) {
        console.error(`Botname not set, you useless fuck.`);
        return m.reply(`Bot's fucked. No botname in context. Yell at your dev, dipshit.`);
    }

    if (!pict) {
        console.error(`Pict not set, you brain-dead moron.`);
        return m.reply(`No image to send, you idiot. Fix your shitty context.`);
    }

    try {
        const caption = `Yo ${m.pushName}, *${botname}* is alive and ready to fuck shit up! 🖕\nType *${prefix}menu* to see what I can do, you pathetic loser.\n 'cause you're too dumb to code`;

        // Handle pict (image) input
        let imageOptions;
        if (Buffer.isBuffer(pict)) {
            console.log(`[ALIVE-DEBUG] pict is a Buffer, saving to temp file`);
            const tempImagePath = path.join(__dirname, 'temp_alive_image.jpg');
            try {
                fs.writeFileSync(tempImagePath, pict);
                imageOptions = { url: tempImagePath };
            } catch (err) {
                console.error(`[ALIVE-ERROR] Failed to save temp image: ${err.stack}`);
                throw new Error(`Couldn’t process your shitty image buffer, dipshit: ${err.message}`);
            }
        } else if (typeof pict === 'string') {
            console.log(`[ALIVE-DEBUG] pict is a string: ${pict}`);
            // Validate if pict is a valid URL or file path
            if (pict.startsWith('http://') || pict.startsWith('https://') || fs.existsSync(pict)) {
                imageOptions = { url: pict };
            } else {
                throw new Error(`Invalid pict path or URL: ${pict}`);
            }
        } else {
            throw new Error(`pict is some weird-ass type: ${typeof pict}`);
        }

        // Send the image with toxic caption
        await client.sendMessage(m.chat, {
            image: imageOptions,
            caption: caption,
            mentions: [m.sender]
        }, { quoted: m });

        // Clean up temp image if created
        if (imageOptions.url.startsWith(__dirname)) {
            try {
                fs.unlinkSync(imageOptions.url);
                console.log(`[ALIVE-DEBUG] Cleaned up temp image: ${imageOptions.url}`);
            } catch (err) {
                console.error(`[ALIVE-ERROR] Failed to clean up temp image: ${err.stack}`);
            }
        }

        // Audio file paths with extra toxicity
        const possibleAudioPaths = [
            path.join(__dirname, 'xh_clinton', 'test.mp3'),
            path.join(process.cwd(), 'xh_clinton', 'test.mp3'),
            path.join(__dirname, '..', 'xh_clinton', 'test.mp3'),
        ];

        let audioFound = false;
        for (const audioPath of possibleAudioPaths) {
            console.log(`[ALIVE-DEBUG] Checking audio path: ${audioPath}`);
            try {
                if (fs.existsSync(audioPath)) {
                    await client.sendMessage(m.chat, {
                        audio: { url: audioPath },
                        ptt: true,
                        mimetype: 'audio/mpeg',
                        fileName: 'fuck-you.mp3'
                    }, { quoted: m });
                    audioFound = true;
                    console.log(`[ALIVE-DEBUG] Sent audio from: ${audioPath}`);
                    break;
                } else {
                    console.log(`[ALIVE-DEBUG] Audio not found at: ${audioPath}`);
                }
            } catch (err) {
                console.error(`[ALIVE-ERROR] Failed to send audio from ${audioPath}: ${err.stack}`);
            }
        }

        if (!audioFound) {
            console.error('❌ Audio file not found at any path, you incompetent dev');
            await m.reply(`FUCK! ${m.pushName}, couldn't find the voice note.\n│❒ Check xh_clinton/test.mp3, you worthless piece of shit.`);
        }

    } catch (error) {
        console.error(`[ALIVE-ERROR] ALIVE COMMAND CRASHED LIKE YOUR LIFE: ${error.stack}`);
        await m.reply(`SHIT BROKE, ${m.pushName}!\n│❒ Error: ${error.message}\n│❒ Try again when you grow a brain, loser.`);
    }
};