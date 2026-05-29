const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "dog",
    version: "2.2.0",
    author: "Farhan-Khan",
    countDown: 5,
    role: 0,
    category: "fun",
    description: "Dog nose meme edit 🐶",
    guide: "{pn} @mention or reply"
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID, mentions, messageReply } = event;

    const cacheDir = path.join(process.cwd(), "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

    let targetID;
    if (Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (messageReply) {
      targetID = messageReply.senderID;
    } else {
      return message.reply("আরে মামা, কুকুর বানাতে হলে কাউরে মেনশন দে! 🐶");
    }

    try {
      const userInfo = await api.getUserInfo(targetID);
      const userName = userInfo[targetID]?.name || "User";

      const imgLink = "https://i.imgur.com/PLpn3ID.jpeg";
      const filePath = path.join(cacheDir, `dog_${Date.now()}.png`);

      message.reply("দাঁড়া মামা, কুকুর বানাইতেছি... 🐕⏳");

      const accessToken = "6628568379|c1e620fa708a1d5696fb991c1bde5662";
      const targetPfpUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=${accessToken}`;

      const [baseImage, targetPfp] = await Promise.all([
        loadImage(imgLink),
        loadImage(targetPfpUrl)
      ]);

      const canvas = createCanvas(baseImage.width, baseImage.height);
      const ctx = canvas.getContext("2d");

      ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

      // 🎯 FINAL PERFECT (Bigger + Left)
      const pfpSize = 85;   // bigger
      const x = 160;        // left shift
      const y = 115;

      ctx.save();

      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.shadowBlur = 10;

      // Circle crop
      ctx.beginPath();
      ctx.arc(x + pfpSize / 2, y + pfpSize / 2, pfpSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(targetPfp, x, y, pfpSize, pfpSize);
      ctx.restore();

      // Border
      ctx.beginPath();
      ctx.arc(x + pfpSize / 2, y + pfpSize / 2, pfpSize / 2, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(filePath, buffer);

      const finalCaption = `🐶 এই যে দেখ, নতুন কুকুর হাজির!\n\nনাম: ${userName} 😂\nসবাই বলো ভাউ ভাউ! 🐕`;

      return api.sendMessage({
        body: finalCaption,
        mentions: [{ tag: userName, id: targetID }],
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (e) {
      console.error("DOG ERROR:", e);
      return message.reply("মামা কুকুরটা পালাইছে! আবার ট্রাই কর ❌");
    }
  }
};
