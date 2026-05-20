const axios = require("axios");

let songIndex = 0;

module.exports = {
  config: {
    name: "adminmention",
    version: "20.0.0",
    author: "Farhan-Khan",
    countDown: 0,
    role: 0,
    shortDescription: "Fast caption + song reply",
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    // 🔒 Author lock
    if (this.config.author !== "Farhan-Khan") return;

    const admins = [
      { uid: "61589439339903", names: ["M'ʀ","ফাহিম","fahim","Fahim"] },
      { uid: "61589439339903", names: ["Admin"] }
    ];

    const senderID = String(event.senderID);
    if (admins.some(a => a.uid === senderID)) return;

    const text = (event.body || "").toLowerCase();
    const mentionedIDs = event.mentions ? Object.keys(event.mentions) : [];

    const isMentioning = admins.some(admin =>
      mentionedIDs.includes(admin.uid) ||
      admin.names.some(name => text.includes(name.toLowerCase()))
    );

    if (!isMentioning) return;

    // 🎵 Song list
    const songs = [
      "https://files.catbox.moe/633jsc.mp3",
      "https://files.catbox.moe/xr7tu5.mp3",
      "https://files.catbox.moe/ldigw8.mp3",
      "https://files.catbox.moe/uljq3d.mp3",
      "https://files.catbox.moe/i6mfe7.mp3",
      "https://files.catbox.moe/yhdt2u.mp3",
      "https://files.catbox.moe/802eft.mp3",
      "https://files.catbox.moe/sm9sz0.mp3"
    ];

    const songUrl = songs[songIndex];
    songIndex = (songIndex + 1) % songs.length;

    // ✍️ captions
    const captions = [
      "Mantion_দিস না ফাহিম বস এর মন মন ভালো নেই আস্কে-!💔🥀",
      "- আমার বস ফাহিম এর সাথে কেউ সেক্স করে না থুক্কু টেক্স করে নাহ🫂💔",
      "👉আমার বস 🧛‍♀️🧛‍♀️🧛‍♀️ ফাহিম এখন বিজি আছে । তার ইনবক্সে এ মেসেজ দিয়ে রাখো বস ফ্রি হলে আসবে🧡😁😜🐒",
      "বস ফাহিম কে এত মেনশন না দিয়ে বক্স আসো হট করে দিবো🤷‍ঝাং 😘🥒",
      "বস ফাহিম কে Mantion_দিলে চুম্মাইয়া ঠুটের কালার change কইরা,লামু 💋😾😾🔨",
      "ফাহিম বস এখন বিজি জা বলার আমাকে বলতে পারেন_!!😼🥰",
      "ফাহিম বস কে এতো মেনশন নাহ দিয়া বস কে একটা জি এফ দে 😒 😏",
      "Mantion_না দিয়ে বস ফাহিম এর সাথে সিরিয়াস প্রেম করতে চাইলে ইনবক্স",
      "বস ফাহিম কে মেনশন দিসনা পারলে একটা জি এফ দে",
      "বাল পাকনা Mantion_দিস না বস ফাহিম প্রচুর বিজি আছে 🥵🥀🤐",
      "চুমু খাওয়ার বয়স টা আমার বস ফাহিম চকলেট🍫খেয়ে উড়িয়ে দিল 🤗"
    ];

    const mentionNames = mentionedIDs.map(id => `@${id}`).join(", ");

    const caption = `
✿•≫───────────────≪•✿
『 ${captions[Math.floor(Math.random() * captions.length)]} 』
✿•≫───────────────≪•✿
`;

    try {
      // 🎵 Fast Song Fetch
      const songStream = await axios({
        url: songUrl,
        method: "GET",
        responseType: "stream",
        timeout: 5000,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      await message.reply({
        body: caption,
        attachment: songStream.data
      });

    } catch (err) {
      console.log("❌ Song error:", err.message);
      await message.reply("😢 VOICE দিতে পারলাম না");
    }
  }
};