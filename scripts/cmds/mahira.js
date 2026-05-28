const axios = require("axios");

const typing = async (api, threadID, ms = 2000) => {
  try {
    if (typeof api.sendTypingIndicator === "function") {
      await api.sendTypingIndicator(threadID, true);
      await new Promise(r => setTimeout(r, ms));
      await api.sendTypingIndicator(threadID, false);
    }
  } catch {}
};

module.exports = {
  config: {
    name: "baby",
    version: "4.1",
    author: "GPT FIXED",
    shortDescription: "Auto reply (mahira only)",
    category: "box chat"
  },

  onChat: async function ({ api, event, message, usersData }) {
    const text = event.body ? event.body.trim().toLowerCase() : "";

    // 🔥 AUTO REPLY ONLY IF "mahira" EXISTS
    if (!text.includes("mahira")) return;

    const threadID = event.threadID;
    const senderName = await usersData.getName(event.senderID);

    try {
      await typing(api, threadID, 2000);

      const replies = [
        "হ্যাঁ জান বলো 😚",
        "আমি আছি 🥰",
        "কি বলবে? 💖",
        "হুম শুনছি 😘",
        `হাই ${senderName} 🫶`
      ];

      return message.reply(
        replies[Math.floor(Math.random() * replies.length)],
        (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "baby"
            });
          }
        }
      );

    } catch (err) {
      console.error(err.message);
    }
  }
};