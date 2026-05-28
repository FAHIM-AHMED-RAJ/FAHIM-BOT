const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const API_JSON =
  "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports = {
  config: {
    name: "sound",
    version: "2.0.0",
    author: "MR_FARHAN (GPT UPGRADE)",
    countDown: 5,
    role: 0,
    category: "media"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    let query = args.join(" ").trim();

    if (!query) {
      return api.sendMessage(
        "❌ Please provide a sound name OR type 'trending'",
        threadID,
        messageID
      );
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      // GET API BASE
      const config = await axios.get(API_JSON);
      const baseApi = config.data?.api;
      if (!baseApi) throw new Error("API missing");

      let url;

      // 🔥 TRENDING MODE
      if (query.toLowerCase() === "trending") {
        url = `${baseApi}/soundmeme?trending=true`;
      } else {
        url = `${baseApi}/soundmeme?q=${encodeURIComponent(query)}`;
      }

      const res = await axios.get(url);
      const result = res.data?.results?.[0];

      if (!result?.sound) {
        throw new Error("No sound found");
      }

      const filePath = path.join(
        __dirname,
        "cache",
        `sound_${Date.now()}.mp3`
      );

      await fs.ensureDir(path.dirname(filePath));

      const audio = await axios.get(result.sound, {
        responseType: "arraybuffer"
      });

      await fs.writeFile(filePath, Buffer.from(audio.data));

      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage(
        {
          body: `🎧 SOUND READY\n━━━━━━━━━━━━━━\n\n🎵 ${result.title || "Unknown"}`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );

    } catch (err) {
      console.error(err);

      api.setMessageReaction("❌", messageID, () => {}, true);

      return api.sendMessage(
        "❌ Sound not found or API error",
        threadID,
        messageID
      );
    }
  }
};