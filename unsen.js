module.exports = {
  config: {
    name: "unsendwatch",
    version: "1.0.0",
    author: "MR_FARHAN (GPT)",
    role: 0,
    category: "fun",
    description: "Detect unsent messages and reply funny"
  },

  onStart: async function () {
    // nothing needed
  },

  // message store
  onChat: async function ({ event, api }) {
    const { threadID, messageID, body, type } = event;

    if (!global.unsendCache) global.unsendCache = {};

    // save message
    if (body) {
      global.unsendCache[messageID] = {
        body,
        threadID
      };
    }
  },

  // detect unsend (deleted message event)
  onEvent: async function ({ event, api }) {
    try {
      if (event.logMessageType !== "log:message_unsend") return;

      const mid = event.messageID;
      const data = global.unsendCache?.[mid];

      const replies = [
        "😂 আরে ভাই unsend করলি কেন? ধরা খেয়ে গেছিস!",
        "😏 মেসেজ ডিলিট করে লাভ নাই, আমি দেখছি!",
        "🤣 এইটা লুকানো যাবে না বন্ধু!",
        "👀 টাইপ করছিলা, এখন পালালি কেন?",
        "😆 ওহো! unsend detected!"
      ];

      const msg = replies[Math.floor(Math.random() * replies.length)];

      return api.sendMessage(
        `⚠️ UNSEND DETECTED\n\n${msg}`,
        event.threadID
      );

    } catch (err) {
      console.log(err);
    }
  }
};