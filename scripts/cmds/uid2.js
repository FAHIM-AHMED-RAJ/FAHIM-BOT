const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "uid2",
    version: "1.0.0",
    author: "MR_FARHAN (GPT)",
    role: 0,
    category: "info"
  },

  onStart: async function ({ api, event, args, usersData }) {
    const { threadID, messageID, senderID, type, messageReply, mentions } = event;

    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, "uid2_box.png");

    await fs.ensureDir(cacheDir);

    // 🔥 TARGET USER
    let targetID = senderID;

    if (type === "message_reply") {
      targetID = messageReply.senderID;
    } else if (Object.keys(mentions || {}).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (args[0] && !isNaN(args[0])) {
      targetID = args[0];
    }

    let loading;

    try {
      loading = await api.sendMessage("🧊 Creating UID2 BOX...", threadID);

      const userData = await usersData.get(targetID) || {};
      const name = (userData.name || "Unknown User").toUpperCase();

      // CANVAS
      const w = 1200;
      const h = 500;
      const canvas = createCanvas(w, h);
      const ctx = canvas.getContext("2d");

      // BACKGROUND
      ctx.fillStyle = "#070a12";
      ctx.fillRect(0, 0, w, h);

      // OUTER BOX
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 5;
      ctx.strokeRect(25, 25, w - 50, h - 50);

      // INNER BOX
      ctx.strokeStyle = "rgba(0,255,255,0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, w - 100, h - 100);

      // LEFT PANEL
      ctx.fillStyle = "#111827";
      ctx.fillRect(70, 70, 400, 360);

      // AVATAR LOAD
      const avatarUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512`;

      let avatarBuffer;
      try {
        const res = await axios.get(avatarUrl, { responseType: "arraybuffer" });
        avatarBuffer = res.data;
      } catch {
        const fallback = `https://graph.facebook.com/${targetID}/picture?type=large`;
        const res = await axios.get(fallback, { responseType: "arraybuffer" });
        avatarBuffer = res.data;
      }

      const avatar = await loadImage(avatarBuffer);

      // AVATAR BOX
      const cx = 270;
      const cy = 250;
      const size = 150;

      ctx.fillStyle = "#000";
      ctx.fillRect(cx - 120, cy - 120, 240, 240);

      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 6;
      ctx.strokeRect(cx - 120, cy - 120, 240, 240);

      ctx.drawImage(avatar, cx - size, cy - size, size * 2, size * 2);

      // TEXT RIGHT SIDE
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 55px Arial";
      ctx.fillText(name, 520, 180);

      ctx.fillStyle = "#00ffff";
      ctx.font = "bold 30px Arial";
      ctx.fillText(`UID2: ${targetID}`, 520, 250);

      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "25px Arial";
      ctx.fillText("▣ ADVANCED BOX PROFILE ▣", 520, 320);

      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "20px Arial";
      ctx.fillText("SYSTEM STATUS: ONLINE", 520, 370);

      // SAVE
      const buffer = canvas.toBuffer("image/png");
      await fs.writeFile(filePath, buffer);

      if (loading?.messageID) api.unsendMessage(loading.messageID);

      return api.sendMessage(
        {
          body: `🧊 UID2 BOX PROFILE: ${targetID}`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );

    } catch (err) {
      console.error(err);

      try {
        if (loading?.messageID) api.unsendMessage(loading.messageID);
      } catch {}

      return api.sendMessage(
        "❌ Failed to generate UID2 box",
        threadID,
        messageID
      );
    }
  }
};