const fs = require('fs');

module.exports = async (context) => {
    const { client, m, participants } = context;

    if (!m.isGroup) {
        return m.reply('Command meant for groups.');
    }

    try {
        const gcdata = await client.groupMetadata(m.chat);
        const vcard = gcdata.participants
            .map((a, i) => {
                const number = a.id.split('@')[0];
                return `BEGIN:VCARD\nVERSION:3.0\nFN:[${i}] +${number}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`;
            })
            .join('\n');

        const cont = './contacts.vcf';

        await m.reply(`A moment, Toxic-MD is compiling ${gcdata.participants.length} contacts into a VCF...`);

        await fs.promises.writeFile(cont, vcard);
        await m.reply('Import this VCF in a separate email account to avoid messing with your contacts...');

        await client.sendMessage(
            m.chat,
            {
                document: fs.readFileSync(cont),
                mimetype: 'text/vcard',
                fileName: 'Group contacts.vcf',
                caption: `VCF for ${gcdata.subject}\n${gcdata.participants.length} contacts`
            },
            { ephemeralExpiration: 86400, quoted: m }
        );

        await fs.promises.unlink(cont);
    } catch (error) {
        console.error(`VCF error: ${error.message}`);
        await m.reply('Ready to fuck shit up? *➥ sir Njabulo AIメ* Failed to generate VCF. Try again later.');
    }
};