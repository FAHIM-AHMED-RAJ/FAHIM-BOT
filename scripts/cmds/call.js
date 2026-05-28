const { getStreamsFromAttachment } = global.utils;

const mediaTypes = ["photo", "png", "animated_image", "video", "audio"];

const TARGET_THREAD_ID = "25012294875129251";

module.exports = {
  config: {
    name: "call",
    aliases: ["callad", "called"],
    version: "1.7",
    author: "Farhan (FIXED GPT)",
    countDown: 5,
    role: 0,
    category: "admin"
  },

  onStart: async function ({ args, message, event, usersData, threadsData, api }) {
    if (!args[0]) {
      return message.reply("❌ Please enter your message");
    }

    const { senderID, threadID } = event;

    const senderName = await usersData.getName(senderID);

    let groupName = "Private Chat";

    try {
      const threadInfo = await threadsData.get(threadID);
      groupName = threadInfo?.threadName || "Group Chat";
    } catch {}

    const msg =
      "==📨 USER MESSAGE 📨==\n" +
      `- Name: ${senderName}\n` +
      `- UID: ${senderID}\n` +
      `- From: ${groupName}\n\n` +
      `📩 Message:\n${args.join(" ")}`;

    let attachments = [];

    try {
      attachments = await getStreamsFromAttachment(
        [
          ...(event.attachments || []),
          ...(event.messageReply?.attachments || [])
        ].filter(item => mediaTypes.includes(item.type))
      );
    } catch {}

    const formMessage = {
      body: msg,
      mentions: [
        {
          id: senderID,
          tag: senderName
        }
      ],
      attachment: attachments
    };

    try {
      const info = await api.sendMessage(formMessage, TARGET_THREAD_ID);

      global.GoatBot.onReply.set(info.messageID, {
        commandName: "call",
        threadID: threadID,
        userID: senderID
      });

      return message.reply("✅ Message sent to admin");
    } catch (err) {
      console.log(err);
      return message.reply("❌ Failed to send message to admin");
    }
  },

  onReply: async function ({ api, event, args, Reply }) {
    if (!Reply) return;
    if (event.threadID !== TARGET_THREAD_ID) return;

    const userThread = Reply.threadID;
    if (!userThread) return;

    const text = args.join(" ");

    try {
      return api.sendMessage(
        `📩 Admin Reply:\n\n${text}`,
        userThread
      );
    } catch (err) {
      console.log(err);
    }
  }
};