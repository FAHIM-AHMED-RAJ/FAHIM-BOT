const axios = require("axios");

let imageIndex = 0;
let songIndex = 0;

module.exports = {
  config: {
    name: "adminmention",
    version: "20.0.0",
    author: "Farhan-Khan",
    countDown: 0,
    role: 0,
    shortDescription: "Fast caption + image reply",
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

    // 🖼️ Image list
    const images = [
      "https://files.catbox.moe/fxre5k.mp4",
      "https://files.catbox.moe/zkfe54.mp4",
      "https://files.catbox.moe/rbpxmu.mp4",
      "https://files.catbox.moe/zah3gd.mp4",
      "https://files.catbox.moe/dnuqtb.mp4",
      "https://files.catbox.moe/euhh1j.mp4",
      "https://files.catbox.moe/28zdh0.mp4",
      "https://files.catbox.moe/u6uhih.mp4",
      "https://files.catbox.moe/kjuygx.mp4",
      "https://files.catbox.moe/agbbr7.mp4",
      "https://files.catbox.moe/v0c93q.mp4",
      "https://files.catbox.moe/vn4iiv.mp4",
      "https://files.catbox.moe/lw4gip.mp4",
      "https://files.catbox.moe/7dhh65.mp4",
      "https://files.catbox.moe/t1o8nu.mp4",
      "https://files.catbox.moe/53ki3x.mp4",
      "https://files.catbox.moe/2riyds.mp4",
      "https://files.catbox.moe/u2inzy.mp4",
      "https://files.catbox.moe/zabqtx.mp4",
      "https://files.catbox.moe/lvat8q.mp4",
      "https://files.catbox.moe/8iohbn.mp4",
      "https://files.catbox.moe/zs1v3i.mp4",
      "https://files.catbox.moe/sdcjc6.mp4",
      "https://files.catbox.moe/2rjsbf.mp4",
      "https://files.catbox.moe/545cye.mp4",
      "https://files.catbox.moe/4o50lr.mp4",
      "https://files.catbox.moe/2xzljw.mp4",
      "https://files.catbox.moe/t005nq.mp4",
      "https://files.catbox.moe/hkuu1g.mp4",
      "https://files.catbox.moe/s462pk.mp4",
      "https://files.catbox.moe/esuxkr.mp4",
      "https://files.catbox.moe/f8xkp2.mp4",
      "https://files.catbox.moe/7ng9cb.mp4",
      "https://files.catbox.moe/mhi9ty.mp4",
      "https://files.catbox.moe/91pi11.mp4"
    ];

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

    const imageUrl = images[imageIndex];
    imageIndex = (imageIndex + 1) % images.length;

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
      // ⚡ Fast Image Fetch
      const imgStream = await axios({
        url: imageUrl,
        method: "GET",
        responseType: "stream",
        timeout: 5000,
        headers: { "User-Agent": "Mozilla/5.0" }
      });

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
        attachment: [
          imgStream.data,
          songStream.data
        ]
      });

    } catch (err) {
      console.log("❌ Media error:", err.message);
      await message.reply("😢 মিডিয়া দিতে পারলাম না");
    }
  }
};