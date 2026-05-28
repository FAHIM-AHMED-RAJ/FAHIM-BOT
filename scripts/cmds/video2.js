const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs-extra");
const path = require("path");

async function searchVideo(query) {
  const res = await yts(query);
  return res.videos?.[0];
}

async function getDownloadUrl(videoId) {
  try {
    const res = await axios.get(
      `https://api.dotslash.ml/ytdl?url=https://www.youtube.com/watch?v=${videoId}`
    );
    return res.data?.url || res.data?.downloadUrl;
  } catch {
    return null;
  }
}

module.exports = {
  config: {
    name: "video2",
    version: "1.0.0",
    author: "MR_FARHAN (GPT)",
    role: 0,
    category: "media"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    const query = args.join(" ").trim();

    if (!query) {
      return api.sendMessage(
        "❌ ভিডিও নাম দাও\n📌 Example: video2 mr beast",
        threadID,
        messageID
      );
    }

    let msg;

    try {
      msg = await api.sendMessage("🔍 Searching video...", threadID);

      const video = await searchVideo(query);

      if (!video) {
        return api.sendMessage("❌ Video পাওয়া যায়নি", threadID, messageID);
      }

      const videoId = video.videoId;

      await api.unsendMessage(msg.messageID).catch(() => {});

      const msg2 = await api.sendMessage(
        `🎬 Found:\n📌 ${video.title}\n⬇️ Downloading...`,
        threadID
      );

      const downloadUrl = await getDownloadUrl(videoId);

      if (!downloadUrl) {
        return api.sendMessage(
          "❌ Download link পাওয়া যায়নি",
          threadID,
          messageID
        );
      }

      const filePath = path.join(
        __dirname,
        "cache",
        `video2_${Date.now()}.mp4`
      );

      await fs.ensureDir(path.dirname(filePath));

      const buffer = await axios.get(downloadUrl, {
        responseType: "arraybuffer",
        timeout: 60000
      });

      await fs.writeFile(filePath, buffer.data);

      await api.sendMessage(
        {
          body: `🎬 VIDEO2 READY\n━━━━━━━━━━\n📌 ${video.title}`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );

      if (msg2?.messageID) {
        api.unsendMessage(msg2.messageID).catch(() => {});
      }

    } catch (err) {
      console.log(err);
      return api.sendMessage(
        "❌ Error: " + (err.message || "failed"),
        threadID,
        messageID
      );
    }
  }
};