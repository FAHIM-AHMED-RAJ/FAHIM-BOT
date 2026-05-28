const axios = require("axios");

const getBase = async () => {
  const res = await axios.get(
    "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json"
  );
  return res.data.mahmud;
};

module.exports = {
  config: {
    name: "4k",
    version: "1.8",
    author: "MahMUD (FIXED)",
    countDown: 10,
    role: 0,
    category: "AI",
    description: "Enhance image to 4K quality"
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;

    let imgUrl = null;

    // 📌 reply image
    if (event.messageReply?.attachments?.[0]?.type === "photo") {
      imgUrl = event.messageReply.attachments[0].url;
    }

    // 📌 url input
    else if (args[0]) {
      imgUrl = args.join(" ");
    }

    if (!imgUrl) {
      return message.reply("❌ Reply to an image or provide image URL");
    }

    let waitMsg;

    try {
      waitMsg = await message.reply("🎨 Enhancing to 4K... please wait");

      const base = await getBase();

      const apiUrl = `${base}/api/hd?imgUrl=${encodeURIComponent(imgUrl)}`;

      const res = await axios.get(apiUrl, {
        responseType: "stream",
        timeout: 60000
      });

      // remove loading message
      if (waitMsg?.messageID) {
        api.unsendMessage(waitMsg.messageID).catch(() => {});
      }

      return api.sendMessage(
        {
          body: "✅ Here is your 4K enhanced image ✨",
          attachment: res.data
        },
        threadID,
        messageID
      );

    } catch (err) {
      console.log(err);

      if (waitMsg?.messageID) {
        api.unsendMessage(waitMsg.messageID).catch(() => {});
      }

      return api.sendMessage(
        "❌ Failed to enhance image",
        threadID,
        messageID
      );
    }
  }
};