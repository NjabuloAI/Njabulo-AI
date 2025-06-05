module.exports = async (context) => {
  const { client, m, text } = context;
  const yts = require("yt-search");
  const fetch = require("node-fetch");
  const ytdl = require("ytdl-core"); // Fallback for audio

  const formatStylishReply = (message) => {
    return `◈━━━━━━━━━━━━━━━━◈\n│❒ ${message}\n◈━━━━━━━━━━━━━━━━◈`;
  };

  if (!text) {
    return m.reply(formatStylishReply("Yo, dumbass, give me a song name! 🎵 Don’t waste my time."));
  }

  if (text.length > 100) {
    return m.reply(formatStylishReply("What’s this essay, loser? Keep the song name short, max 100 chars."));
  }

  try {
    const { videos } = await yts(text);
    if (!videos || videos.length === 0) {
      throw new Error("No songs found, you got shit taste. 😕 Try something else.");
    }

    const song = videos[0];
    const apiKey = "gifted_api_se5dccy";
    const apiUrl = `https://api.giftedtech.web.id/api/download/dlmp3?apikey=${apiKey}&url=${encodeURIComponent(song.url)}`;

    let audioUrl, title = song.title, quality = "128Kbps"; // Default quality
    let response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error("Download server’s being a bitch. 🚫 Trying fallback...");
    }

    const data = await response.json();
    if (data.success && data.result?.download_url) {
      audioUrl = data.result.download_url;
      title = data.result.title || song.title;
      quality = data.result.quality || "128Kbps";

      // Validate audio URL (basic HEAD request)
      const headResponse = await fetch(audioUrl, { method: 'HEAD', timeout: 5000 });
      if (!headResponse.ok || !headResponse.headers.get('content-length') || parseInt(headResponse.headers.get('content-length')) > 16 * 1024 * 1024) {
        console.log(`Invalid or oversized audio file at ${audioUrl}, size: ${headResponse.headers.get('content-length')}`);
        throw new Error("API audio file’s messed up, switching to backup plan.");
      }
    } else {
      throw new Error("Couldn’t snag the audio, server’s useless. 😞 Falling back...");
    }

    const artist = song.author?.name || "Unknown Artist";
    const views = song.views?.toLocaleString() || "Unknown";
    const duration = song.duration?.toString() || "Unknown";
    const uploaded = song.ago || "Unknown";
    const thumbnail = data.result.thumbnail || song.thumbnail || "";
    const videoUrl = song.url;

    await m.reply(formatStylishReply(`Grabbing *${title}* for you, hold your damn horses! 🎧`));

    const caption = `◈━━━━━━━━━━━━━━━━◈\n` +
                   `│❒ *${title}* for ${m.pushName}! Jam out, you legend! 🎶\n` +
                   `│🎤 *Artist*: ${artist}\n` +
                   `│👀 *Views*: ${views}\n` +
                   `│⏱ *Duration*: ${duration}\n` +
                   `│📅 *Uploaded*: ${uploaded}\n` +
                   `│🔊 *Quality*: ${quality}\n` +
                   (thumbnail ? `│🖼 *Thumbnail*: ${thumbnail}\n` : '') +
                   `│🔗 *Video*: ${videoUrl}\n` +
                   `◈━━━━━━━━━━━━━━━━◈\n` +
                   `Powered by Toxic-MD`;

    await client.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`,
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error in play command:", error);

    // Fallback to ytdl-core if API fails
    if (error.message.includes("fallback") || error.message.includes("messed up")) {
      try {
        console.log(`Falling back to ytdl-core for ${song.url}`);
        const info = await ytdl.getInfo(song.url);
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });
        audioUrl = format.url;
        title = info.videoDetails.title;
        quality = format.audioBitrate ? `${format.audioBitrate}kbps` : "Unknown";
        const artist = info.videoDetails.author.name || "Unknown Artist";
        const views = info.videoDetails.viewCount?.toLocaleString() || "Unknown";
        const duration = (info.videoDetails.lengthSeconds / 60).toFixed(2) + " mins";
        const uploaded = new Date(info.videoDetails.publishDate).toLocaleDateString() || "Unknown";
        const videoUrl = song.url;

        await m.reply(formatStylishReply(`API flaked, grabbing *${title}* with backup, chill! 🎧`));

        const caption = `◈━━━━━━━━━━━━━━━━◈\n` +
                       `│❒ *${title}* for ${m.pushName}! Jam out, you legend! 🎶\n` +
                       `│🎤 *Artist*: ${artist}\n` +
                       `│👀 *Views*: ${views}\n` +
                       `│⏱ *Duration*: ${duration}\n` +
                       `│📅 *Uploaded*: ${uploaded}\n` +
                       `│🔊 *Quality*: ${quality}\n` +
                       `│🔗 *Video*: ${videoUrl}\n` +
                       `◈━━━━━━━━━━━━━━━━◈\n` +
                       `Powered by Toxic-MD`;

        await client.sendMessage(m.chat, {
          audio: { url: audioUrl },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`,
          caption: caption
        }, { quoted: m });
        return;
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        return m.reply(formatStylishReply(`Shit’s really broken: ${fallbackError.message} 😢 Pick another song, or I’m out!`));
      }
    }

    return m.reply(formatStylishReply(`Shit went wrong: ${error.message} 😢 Got another song, or you giving up?`));
  }
};