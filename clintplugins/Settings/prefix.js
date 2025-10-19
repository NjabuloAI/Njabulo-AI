const { getSettings, updateSetting } = require('../../Database/config');
const ownerMiddleware = require('../../utility/botUtil/Ownermiddleware');

module.exports = async (context) => {
  await ownerMiddleware(context, async () => {
    const { m, args } = context;
    const newPrefix = args[0];

    const settings = await getSettings();

    if (newPrefix === 'null') {
      if (!settings.prefix) {
        return await m.reply(
          ` Already prefixless, you clueless twit! 😈` +
          ` Stop wasting my time! 🖕` 
        );
      }
      await updateSetting('prefix', '');
      await m.reply(
        `Prefix obliterated! 🔥` +
        `I’m prefixless now, bow down! 😈\n`
      );
    } else if (newPrefix) {
      if (settings.prefix === newPrefix) {
        return await m.reply(
          ` Prefix is already ${newPrefix}, moron! 😈\n` +
          ` Try something new, fool! 🥶` 
        );
      }
      await updateSetting('prefix', newPrefix);
      await m.reply(
        `New prefix set to ${newPrefix}! 🔥` +
        `Obey the new order, king! 😈`
      );
    } else {
      await m.reply(
        ` Current Prefix: ${settings.prefix || 'No prefix, peasant! 🥶'}\n` +
        ` Use "${settings.prefix || '.'}prefix null" to go prefixless or "${settings.prefix || '.'}prefix <symbol>" to set one, noob!\n` 
      );
    }
  });
};