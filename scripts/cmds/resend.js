const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const cache = new Map();

// Global toggle
let isEnabled = true;

// Thread-wise toggle
const threadSettings = new Map();

// ensure cache folder
fs.ensureDirSync(path.join(__dirname, "cache"));

module.exports = {
  config: {
    name: "resend",
    version: "5.0",
    author: "MR_FARHAN",
    role: 0,
    category: "events"
  },

  // Command handler (on/off)
  onStart: async ({ api, event }) => {
    const args = event.body.split(" ");

    // Global OFF
    if (args[1] === "off") {
      isEnabled = false;
      return api.sendMessage("❌ Resend system GLOBAL OFF", event.threadID);
    }

    // Global ON
    if (args[1] === "on") {
      isEnabled = true;
      return api.sendMessage("✅ Resend system GLOBAL ON", event.threadID);
    }

    // Thread OFF
    if (args[1] === "offthis") {
      threadSettings.set(event.threadID, false);
      return api.sendMessage("❌ This thread resend OFF", event.threadID);
    }

    // Thread ON
    if (args[1] === "onthis") {
      threadSettings.set(event.threadID, true);
      return api.sendMessage("✅ This thread resend ON", event.threadID);
    }
  },

  onChat: async ({ api, event, usersData }) => {

    // Check global OFF
    if (!isEnabled) return;

    // Check thread OFF
    if (threadSettings.get(event.threadID) === false) return;

    // Save message
    if (event.type === "message" || event.type === "message_reply") {
      cache.set(event.messageID, {
        body: event.body,
        senderID: event.senderID,
        attachments: event.attachments
      });
    }

    // Detect unsend
    if (event.type === "message_unsend") {
      const msg = cache.get(event.messageID);
      if (!msg) return;

      let name = "Unknown User";
      try {
        const user = await usersData.get(msg.senderID);
        name = user.name;
      } catch (e) {}

      let text = `😏 ভাবছস ডিলিট দিলে বাঁচবি?

আমি থাকতে তোর msg গায়েব হবে না! ${name}

📝 ${msg.body || "No text"}`;

      // Attachment handle
      if (msg.attachments && msg.attachments.length > 0) {
        const streams = [];

        for (let file of msg.attachments) {
          try {
            const filePath = path.join(
              __dirname,
              "cache",
              file.filename || Date.now()
            );

            const res = await axios.get(file.url, {
              responseType: "arraybuffer"
            });

            fs.writeFileSync(filePath, Buffer.from(res.data));
            streams.push(fs.createReadStream(filePath));
          } catch (e) {}
        }

        return api.sendMessage(
          { body: text, attachment: streams },
          event.threadID,
          () => {
            streams.forEach(s => {
              try {
                fs.unlinkSync(s.path);
              } catch {}
            });
          }
        );
      }

      api.sendMessage(text, event.threadID);
    }
  }
};
