const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "sing",
    version: "2.0.0",
    author: "MR_FARHAN (API FIX)",
    role: 0,
    category: "music",
    countDown: 5
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    const query = args.join(" ").trim();

    if (!query) {
      return api.sendMessage(
        "❌ গান লিখো\n📌 Example: sing see you again",
        threadID,
        messageID
      );
    }

    let msg;

    try {
      // 🔍 SEARCH SONG
      msg = await api.sendMessage("🎵 Searching song...", threadID);

      const search = await yts(query);
      const video = search?.videos?.[0];

      if (!video) {
        return api.sendMessage("❌ Song পাওয়া যায়নি", threadID, messageID);
      }

      const title = video.title;

      if (msg?.messageID) {
        api.unsendMessage(msg.messageID).catch(() => {});
      }

      const loading = await api.sendMessage(
        `🎶 Found:\n📌 ${title}\n⬇️ Downloading...`,
        threadID
      );

      // 🔥 STABLE AUDIO API
      const apiUrl = `https://api.dotslash.ml/ytmp3?url=${encodeURIComponent(video.url)}`;

      const res = await axios.get(apiUrl);

      const downloadUrl = res.data?.url || res.data?.downloadUrl;

      if (!downloadUrl) {
        return api.sendMessage(
          "❌ Download link পাওয়া যায়নি (API issue)",
          threadID,
          messageID
        );
      }

      // cache folder
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const filePath = path.join(cacheDir, `song_${Date.now()}.mp3`);

      const audio = await axios.get(downloadUrl, {
        responseType: "arraybuffer",
        timeout: 60000
      });

      await fs.writeFile(filePath, audio.data);

      await api.sendMessage(
        {
          body:
            `🎵 MUSIC READY\n━━━━━━━━━━\n` +
            `📌 Title: ${title}\n` +
            `━━━━━━━━━━`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );

      if (loading?.messageID) {
        api.unsendMessage(loading.messageID).catch(() => {});
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