const axios = require('axios');

// Fetching dynamic API URL from GitHub
const getBaseApiUrl = async () => {
    try {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
    } catch (e) {
        return "https://noobs-api.top"; // Fallback URL
    }
};

// শুধু "bot" ট্রিগার হিসেবে থাকবে
const triggerWords = ["bot"];

const LOCKED_AUTHOR = "FARHAN-KHAN";

module.exports = {
    config: {
        name: "bot",
        aliases: ["Bot", "বট"],
        version: "11.1.0",
        author: "FARHAN-KHAN", // 🔒 LOCKED AUTHOR
        countDown: 0,
        role: 0,
        description: "Bot responds only to 'bot' trigger with funny dialogues or AI.",
        category: "fun",
        guide: { 
            en: "{pn} [text]\n{pn} teach [q] - [a]\n{pn} list" 
        }
    },

    onStart: async function ({ api, event, args, usersData, commandName }) {
        const { threadID, messageID, senderID } = event;
        const baseUrl = await getBaseApiUrl();

        try {
            const name = await usersData.getName(senderID);

            if (!args[0]) {
                return api.sendMessage({
                    body: `𓆩» ${name} «𓆪\nবলুন আমি "বট" আপনাকে কিভাবে সাহায্য করতে পারি? 😘`,
                    mentions: [{ tag: name, id: senderID }]
                }, threadID, (err, info) => {
                    if (!err) global.GoatBot?.onReply?.set(info.messageID, { commandName, author: senderID });
                }, messageID);
            }

            const action = args[0].toLowerCase();

            if (action === "teach") {
                const input = args.slice(1).join(" ");
                const [trigger, ...responsesArr] = input.split(" - ");
                const responses = responsesArr.join(" - ");
                if (!trigger || !responses) return api.sendMessage("⚠️ Format: teach ask - reply", threadID, messageID);

                const res = await axios.post(`${baseUrl}/api/jan/teach`, {
                    trigger,
                    responses,
                    userID: senderID
                });

                return api.sendMessage(`✅ Added: ${trigger} -> ${responses}`, threadID, messageID);
            }

            // Default AI Response
            const res = await axios.post(`${baseUrl}/api/hinata`, { 
                text: args.join(" "), 
                style: 3, 
                attachments: event.attachments || [] 
            });

            return api.sendMessage(res.data.message, threadID, (err, info) => {
                if (!err) global.GoatBot?.onReply?.set(info.messageID, { commandName, author: senderID });
            }, messageID);

        } catch (err) {
            return api.sendMessage("API Busy! ❌", threadID, messageID);
        }
    },

    onReply: async function ({ api, event, commandName }) {
        if (api.getCurrentUserID() == event.senderID) return;

        try {
            const baseUrl = await getBaseApiUrl();
            const res = await axios.post(`${baseUrl}/api/hinata`, { 
                text: event.body?.toLowerCase() || "hi", 
                style: 3, 
                attachments: event.attachments || [] 
            });

            return api.sendMessage(res.data.message, event.threadID, (err, info) => {
                if (!err) global.GoatBot?.onReply?.set(info.messageID, { commandName, author: event.senderID });
            }, event.messageID);

        } catch (err) {}
    },

    onChat: async function ({ api, event, usersData, commandName }) {
        const { body, senderID, threadID, messageID } = event;
        if (!body) return;

        const lowerBody = body.toLowerCase();

        // চেক করবে মেসেজটি "bot" দিয়ে শুরু হয়েছে কি না
        if (triggerWords.some(word => lowerBody.startsWith(word))) {
            const text = body.replace(/^bot\s*/i, "").trim();

            if (!text) {
                const name = await usersData.getName(senderID);

                const randomReplies = [
                    "ওই জান এতো কিউট ক্যান তুমি-😫🫶🌸",
"আমার বস 𝗙𝗔𝗛𝗜𝗠 এখন প্রেম করার ট্রেনিং নিচ্ছে-🐸📚💘",
"এতো ডাকিস ক্যান বিয়া করবি নাকি-🙄💍🌺",
"জান তোমারে দেখলে আমার WiFi কানেক্ট হয়ে যায়-📶😫💖",
"চোখ মারিস না জান CPU হ্যাং হয়ে যায়-🥴💻🌸",
"আমার বস 𝗙𝗔𝗛𝗜𝗠 এর জন্য একটা সুন্দরী মাইয়া ভাড়া দেন-🐸🤧",
"তুমি কি জাদুকর নাকি আমার ঘুম চুরি করলা-😵‍💫🌙💘",
"এত সুন্দর হওয়া আইনত অপরাধ-🚨😾🌺",
"জান তুমি রিপ্লাই না দিলে আমি ইমোশনালি ড্যামেজ-😩💔",
"ওই মামা প্রেম করবা নাকি শুধু Seen দিবা-🥲📩",
"তোমার হাসিতে ৪জি নেটওয়ার্ক ফুল স্পিড চলে-📶😽",
"আমার বস 𝗙𝗔𝗛𝗜𝗠 কে জামাই বানাইলে জীবন সেট-😌💍",
"ওই সুন্দরী তোমারে দেখে ব্যাটারিও ফুল চার্জ-🔋😫",
"জান তুমি অনলাইন আসলেই বসন্ত লাগে-🌸🤭",
"আমারে Ignore কইরা লাভ নাই আমি আবার আইমু-🐸😼",
"তোমারে দেখলে মশারাও প্রেমে পড়ে যায়-🦟😫💘",
"এতো attitude দেখাইস না পরে কাইন্দা inbox করবা-🙂🤲",
"ওই মাইয়া তোমার চোখ দুইটা dangerous level cute-😵💖",
"আমার বস 𝗙𝗔𝗛𝗜𝗠 এর প্রেমে পড়লে refund নাই-🐸🚫💘",
"জান তোমারে ছাড়া notification ও ভালো লাগে না-📱😔",
"তুমি কি Google নাকি সবকিছু তোমার মাঝেই পাই-🌚🔍",
"আজকে প্রেম দিবা নাকি কালকে আবার আসবো-🐸🌺",
"তোমার জন্য ৭টা সিম ভাঙছি জান-😫📵",
"ওই কিউটি একটু হাসো হৃদপিণ্ডে বাতাস লাগুক-🫠💨",
"আমার বস 𝗙𝗔𝗛𝗜𝗠 এর future bou কোথায় হারাইছে-😪💍",
"তোমারে দেখলে মনে হয় biriyani free পাইছি-🤤🍗",
"জান একটু কাছে আসো bluetooth connect করমু-📶😹",
"এতো সুন্দর ক্যান বলো তো সরকার জানে-🙂🌸",
"তুমি reply দিলে মনে হয় Eid চলে আসছে-🌙🫶",
"আমার বস 𝗙𝗔𝗛𝗜𝗠 একদম innocent শুধু একটু romantic-🐸😌💘"
                ];

                const rand = randomReplies[Math.floor(Math.random() * randomReplies.length)];

                return api.sendMessage({
                    body: `𓆩» ${name} «𓆪\n\n${rand}`,
                    mentions: [{ tag: name, id: senderID }]
                }, threadID, messageID);
            }

            try {
                const baseUrl = await getBaseApiUrl();
                const { data } = await axios.post(`${baseUrl}/api/hinata`, { text: text, style: 3 });
                api.sendMessage(data.message, threadID, messageID);
            } catch (err) {}
        }
    }
};

// 🔒 AUTHOR LOCK (FULL PROTECTION)
if (module.exports.config.author !== "FARHAN-KHAN") {
    console.log("❌ AUTHOR CHANGED! BOT STOPPED");
    process.exit(1);
    }
