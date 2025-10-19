const fs = require("fs");
const path = require("path");
const yts = require("yt-search");
const axios = require("axios");

const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

module.exports = async (context) => {
  const { client, m, prefix, pict, text } = context;

  const formatStylishReply = (message) => {
    return `${message}\n> Pσɯҽɾҽԃ Ⴆყ NנɐႦυℓσ נႦ`;
  };

  if (!text) {
    return client.sendMessage(
      m.chat,
      { text: formatStylishReply("Yo, drop a song name, fam! 🎵 Ex: .play Not Like Us") },
      { quoted: m, ad: true }
    );
  }

  if (text.length > 100) {
    return client.sendMessage(
      m.chat,
      { text: formatStylishReply("Keep it short, homie! Song name max 100 chars. 📝") },
      { quoted: m, ad: true }
    );
  }

  try {
    const searchQuery = `${text} official`;
    const searchResult = await yts(searchQuery);
    const video = searchResult.videos[0];
    if (!video) {
      return client.sendMessage(
        m.chat,
        { text: formatStylishReply("No tunes found, bruh! 😕 Try another search!") },
        { quoted: m, ad: true }
      );
    }

    const buttons = [
        {
          "buttonId": `${prefix}img`,
          "buttonText": { "displayText": "🎸audio" },
          "type": 1
        },
        {
          "buttonId": `${prefix}image`,
          "buttonText": { "displayText": "📄document" },
          "type": 1
        },
      ];
    const videoInfo = `*🍥General by Njabulo AI*\n\n`+
                      `🎧 *Title:* ${video.title}\n` +
                      `👀 *Views:* ${video.views}\n` +
                                   
                      `0:00 ─〇───── : *${video.duration.timestamp}*\n` +
                      `*⇆ㅤ ||◁ㅤ❚❚ㅤ▷||ㅤ ↻*`;

    await client.sendMessage(
      m.chat,
      {
        image: { url: video.thumbnail },
        caption: videoInfo,
        buttons: buttons,
        headerType: 4,
        contextInfo: {
         isForwarded: true,
         forwardedNewsletterMessageInfo: {
         newsletterJid: '120363399999197102@newsletter',
         newsletterName: "╭••➤®Njabulo AI🍥",
         serverMessageId: 143,
        }
      }
      },
      { quoted: m, ad: true }
    );

    // Use the new API endpoint
    const apiUrl = `https://api.privatezia.biz.id/api/downloader/ytmp3?url=${encodeURIComponent(video.url)}`;
    
    // Call the API
    const response = await axios.get(apiUrl);
    const apiData = response.data;

    // Check if the API call was successful
    if (!apiData.status || !apiData.result || !apiData.result.downloadUrl) {
      throw new Error("API failed to process the video");
    }

    const timestamp = Date.now();
    const fileName = `audio_${timestamp}.mp3`;
    const filePath = path.join(tempDir, fileName);

    // Download the audio file from the API's download URL
    const audioResponse = await axios({
      method: "get",
      url: apiData.result.downloadUrl,
      responseType: "stream",
      timeout: 600000,
    });

    const writer = fs.createWriteStream(filePath);
    audioResponse.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
      throw new Error("Download failed or file is empty");
    }

    await client.sendMessage(
      m.chat,
      {
        audio: { url: filePath },
        mimetype: "audio/mpeg",
        fileName: `${(apiData.result.title || video.title).substring(0, 100)}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: apiData.result.title || video.title,
            body: `${video.author.name || "Unknown Artist"}`,
            thumbnailUrl: apiData.result.thumbnail || video.thumbnail || "https://via.placeholder.com/120x90",
            sourceUrl: video.url,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: m, ad: true }
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    await client.sendMessage(
      m.chat,
      { text: formatStylishReply(`Yo, we hit a snag: ${error.message}. Pick another track! 😎`) },
      { quoted: m, ad: true }
    );
  }
};
