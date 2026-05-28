const { GoatWrapper } = require("fca-liane-utils");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "video",
    version: "3.0.0",
    author: "MR_FARHAN (GPT FIXED)",
    countDown: 5,
    role: 0,
    shortDescription: "YouTube video downloader",
    category: "media"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    let query = args.join(" ").trim();

    if (!query || query.toLowerCase() === "video") {
      return api.sendMessage(
        "❌ Give a video name\n📌 Example: video mr beast",
        threadID,
        messageID
      );
    }

    let tempMsg;

    try {
      tempMsg = await api.sendMessage(
        `🔍 Searching video...\n⏳ Please wait`,
        threadID
      );

      // 🔥 SEARCH API (SAFE HANDLING)
      const searchRes = await axios.get(
        `https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(query)}`
      );

      const data = searchRes.data;
      const video = Array.isArray(data) ? data[0] : data?.results?.[0];

      if (!video?.url) throw new Error("No video found");

      // update message
      if (tempMsg?.messageID) {
        api.unsendMessage(tempMsg.messageID).catch(() => {});
      }

      const downloading = await api.sendMessage(
        `🎬 Found:\n📌 ${video.title}\n⬇️ Downloading...`,
        threadID
      );

      // 🔥 DOWNLOAD API SAFE
      const dlRes = await axios.get(
        `https://yt-api-imran.vercel.app/api?url=${encodeURIComponent(video.url)}`
      );

      const downloadUrl = dlRes.data?.downloadUrl;
      if (!downloadUrl) throw new Error("Download failed");

      const buffer = (
        await axios.get(downloadUrl, { responseType: "arraybuffer" })
      ).data;

      const filePath = path.join(
        process.cwd(),
        "cache",
        `video_${Date.now()}.mp4`
      );

      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, buffer);

      await api.sendMessage(
        {
          body: `🎬 VIDEO READY\n━━━━━━━━━━━━━━\n📌 ${video.title}`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );

      if (downloading?.messageID) {
        api.unsendMessage(downloading.messageID).catch(() => {});
      }

    } catch (err) {
      console.log(err);

      if (tempMsg?.messageID) {
        api.unsendMessage(tempMsg.messageID).catch(() => {});
      }

      return api.sendMessage(
        `❌ Error: ${err.message || "Something went wrong"}`,
        threadID,
        messageID
      );
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });