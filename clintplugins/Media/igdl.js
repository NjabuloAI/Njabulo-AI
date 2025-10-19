const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text, botname } = context;

    const formatStylishReply = (message) => {
        return `Ready to fuck shit up? *➥ sir Njabulo AIメ*  ${message}`;
    };

    const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`API failed with status ${response.status}`);
                }
                return response;
            } catch (error) {
                if (attempt === retries || error.type !== "request-timeout") {
                    throw error;
                }
                console.error(`Attempt ${attempt} failed: ${error.message}. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };

    if (!text) {
        return m.reply(formatStylishReply("Yo, drop an Instagram link, fam! 📹 Ex: .instagramdl https://www.instagram.com/reel/DOlTuNlEsDm/"));
    }

    if (!text.includes("instagram.com")) {
        return m.reply(formatStylishReply("That’s not a valid Instagram link, you clueless twit! Try again."));
    }

    try {
        const encodedUrl = encodeURIComponent(text);
        const response = await fetchWithRetry(
            `https://api.privatezia.biz.id/api/downloader/alldownload?url=${encodedUrl}`,
            { headers: { Accept: "application/json" }, timeout: 15000 }
        );

        const data = await response.json();

        if (!data || !data.status || !data.result || !data.result.video || !data.result.video.url) {
            return m.reply(formatStylishReply("API’s actin’ shady, no video found! 😢 Try again later."));
        }

        const igVideoUrl = data.result.video.url;
        const title = data.result.title || "No title available";

        if (!igVideoUrl) {
            return m.reply(formatStylishReply("Invalid Instagram data. Make sure the video exists, fam!"));
        }

        const videoResponse = await fetchWithRetry(igVideoUrl, { timeout: 15000 });
        if (!videoResponse.ok) {
            throw new Error(`Failed to download video: HTTP ${videoResponse.status}`);
        }

        const arrayBuffer = await videoResponse.arrayBuffer();
        const videoBuffer = Buffer.from(arrayBuffer);

        await client.sendMessage(
            m.chat,
            {
                video: videoBuffer,
                mimetype: "video/mp4",
                caption: formatStylishReply(`🎥 Instagram Video\n\n📌 *Title:* ${title}`),
                gifPlayback: false,
            },
            { quoted: m }
        );
    } catch (e) {
        console.error("Instagram download error:", e);
        m.reply(formatStylishReply(`Yo, we hit a snag: ${e.message}. Check the URL and try again! 😎`));
    }
};