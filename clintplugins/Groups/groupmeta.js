const middleware = require('../../utility/botUtil/middleware');

module.exports = async (context) => {
    await middleware(context, async () => {
        const { client, m, text, prefix, pict } = context;

        const args = text.trim().split(/ +/);
        const command = args[0]?.toLowerCase() || '';
        const newText = args.slice(1).join(' ').trim();

        switch (command) {
            case 'setgroupname':
                if (!newText) return m.reply(`Yo, give me a new group name! Usage: ${prefix}setgroupname <new name>`);
                if (newText.length > 100) return m.reply('Group name can’t be longer than 100 characters, genius! 😑');

                try {
                    await client.groupUpdateSubject(m.chat, newText);
                    await m.reply(`Group name slammed to "${newText}"! Let’s keep the chaos going! 😈`, {
                        contextInfo: {
                            externalAdReply: {
                                title: `➥ sir Njabulo AIメ`,
                                body: `Group Update`,
                                previewType: "PHOTO",
                                thumbnail: pict,
                                sourceUrl: 'https://github.com/xhclintohn/Toxic-MD'
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error updating group subject:', error);
                    await m.reply('Failed to update group name. WhatsApp’s acting up, not me! 😬');
                }
                break;

            case 'setgroupdesc':
                if (!newText) return m.reply(`Gimme a new description! Usage: ${prefix}setgroupdesc <new description>`);

                try {
                    await client.groupUpdateDescription(m.chat, newText);
                    await m.reply('Group description updated! Time to flex that new vibe! 🔥', {
                        contextInfo: {
                            externalAdReply: {
                                title: `➥ sir Njabulo AIメ`,
                                body: `Group Update`,
                                previewType: "PHOTO",
                                thumbnail: pict,
                                sourceUrl: 'https://github.com/xhclintohn/Toxic-MD'
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error updating group description:', error);
                    await m.reply('Couldn’t update the description. Blame WhatsApp’s nonsense! 😬');
                }
                break;

            case 'setgrouprestrict':
                const action = newText.toLowerCase();
                if (!['on', 'off'].includes(action)) return m.reply(`Usage: ${prefix}setgrouprestrict <on|off>`);

                try {
                    const restrict = action === 'on';
                    await client.groupSettingUpdate(m.chat, restrict ? 'locked' : 'unlocked');
                    await m.reply(`Group editing is now ${restrict ? 'locked to admins only' : 'open to all members'}! Keep it toxic! 😎`, {
                        contextInfo: {
                            externalAdReply: {
                                title: `➥ sir Njabulo AIメ`,
                                body: `Group Update`,
                                previewType: "PHOTO",
                                thumbnail: pict,
                                sourceUrl: 'https://github.com/xhclintohn/Toxic-MD'
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error updating group settings:', error);
                    await m.reply('Failed to update group settings. WhatsApp’s tripping again! 😬');
                }
                break;

            default:
                await m.reply(`Invalid groupmeta command! Use ${prefix}setgroupname, ${prefix}setgroupdesc, or ${prefix}setgrouprestrict`);
        }
    });
};