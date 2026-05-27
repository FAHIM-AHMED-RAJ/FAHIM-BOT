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
                    "-আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ 😇😘",
  "-সুন্দর মাইয়া মানেই-🥱-আমার বস 𝐅𝐀𝐇𝐈𝐌 𝐂𝐇𝐎𝐖𝐃𝐇𝐔𝐑𝐘 এর বউ-😽🫶-আর বাকি গুলো আমার বেয়াইন-🙈🐸🤗",
  "-কিরে-🫵-তরা নাকি  prem করস-😐🐸-আমারে একটা করাই দিলে কি হয়-🥺",
  "__Bot বলে অসম্মান করচ্ছিছ,😰😿",
  "-হুদাই আমারে  শয়তানে লারে-😝😑☹️",
  "- বেডি মানুষ বড় ভেজাইল্লা🤧🔪",
  "⎯তো্ঁর্ঁ ন্ঁজ্ঁরে্ঁ স্ঁম্ঁস্যা্ঁ আ্ঁছে্ঁ  ন্ঁজ্ঁর্ঁ ঠি্ঁক্ঁ ক্ঁর্ঁ-🐸🫣⎯⃝''",
  "-চু্ঁপ্ঁ থা্ঁক্ঁ তু্ঁই্ঁ 🫵 বি্ঁছা্ঁনা্ঁয়্ঁ মু্ঁতো্ঁস্ঁ 😽⎯͢⎯⃝🩷🍒🙂",
  "___মন দে !🙂🫴---ছিনি মিনি খেলমু 🤭🤭",
  "- ওই 🫵 তোমারে প্রচুর ভাল্লাগে-😽-সময় মতো প্রপোজ করমু বুঝছো-🔨😼-ছিট খালি রাইখো- 🥱🐸🥵",
  "-আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস ফাহিম কে দান করেন-🥱🐰🍒",
  "-ইস কেউ যদি বলতো-🙂-আমার শুধু  তোমাকেই লাগবে-💜🌸",
  "-অনুমতি দিলাম-𝙋𝙧𝙤𝙥𝙤𝙨𝙚 কর বস আরিয়ান কে-🐸😾🔪",
  "-প্রিয়-🥺 -তোমাকে না পেলে আমি সত্যি-😪 -আরেকজন কে-😼 -পটাতে বাধ্য হবো-😑🤧",
  "- দুনিয়ার সবাই প্রেম করে.!🤧 -আর মানুষ আমার বস আরিয়ান কে সন্দেহ করে.!🐸",
  "-তোর কথা তোর বাড়ি কেউ শুনে না তো আমি কোনো শুনবো__🤔😂",
  "—যারে দেহি তারেই ভাল্লাগে..!🙈- মনে হয় রুচি বাড়ছে..!😀😋 তুমি কি দেখো তোমাকেও তো  ভাল্লাগে - 😩🫢🫣",
  "-বুকের বাম পাশে এসি সহ একটা ফ্লাট খালি আছে...একজন বিশ্বস্ত ভাড়াটিয়া চাই😊...!🙈👀",
  "-একদিন ঠাস করে😎🔪 কিউট হয়ে যামু_😩 তারপর তোগোরে  আর পাত্তা দিমু না __🐸🌚🙂",
  "-ভাই তুই একটু আমার কাছে আই তরে মাইরা আমি ঘুমামু_👊😴",
  "-এই আন্টির মেয়ে-🫢🙈-𝐔𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐚𝐡-😽🫶-আসলেই তো স্বাদ-🥵💦-এতো স্বাদ কেন-🤔-সেই স্বাদ-😋",
  "-চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে-😑😒🐸⚒️",
  "- সানিলিওন  আফারে ধর্ষনের হুমকি দিয়ে আসলাম - 🤗 -আর 🫵তুমি যামারে খেয়ে দিবা সেই ভয় দেখাও ননসেন বেডি..!🥱😼",
  "--নাটক কম করো প্রিয় তুমি যে অন্য জনে আসক্ত তা তোমার ব্যবহারেই বুঝা যায় প্রিয়__😒🦋",
  "__বড় আর হইলাম কই, এখনো \n\n-আকাশ দিয়ে হেলিকপ্টার গেলে তাকাই থাকা আমি...! 🌻🙂",
  "-আমাকে এত ডাকছেন কেন আপনার কি চরিত্রের সমস্যা আছে-🤨🤭😼",
  "-𝗜 𝗟𝗢𝗩𝗢 𝗬𝗢𝗨-😽-আহারে ভাবছো তোমারে প্রোপজ করছি-🥴-থাপ্পর দিয়া কিডনী লক করে দিব-😒-ভুল পড়া বের করে দিবো-🤭🐸",
  "জান তোমার নানি'রে আমার হাতে তুলে দিবা-🙊🙆‍♂",
  "-আমি একটা দুধের শিশু-😇-🫵𝗬𝗢𝗨🐸💦",
  "-নাটক কম করো পিও-🙃-তুমি যে অন্য জনের pream এ আসক্ত..! সেটা তোমার ব্যাবহার দেখেই বুজা যায় পিও..! 🐸👍🏾",
  "__চুনা ও চুনা আমার বস 𝐅𝐀𝐇𝐈𝐌 𝐂𝐇𝐎𝐖𝐃𝐇𝐔𝐑𝐘 এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না-😪🤧😭",
  "-জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽",
  "- ঝাং 🫵 থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ-🌺🤤💦",
  "-শুনবো না 😼 তুমি আমাকে প্রেম করাই দাও নি 🥺 পচা তুমি 🥺",
  "-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে-🥲🤦‍♂️🤧",
  "-আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧",
  "আমি এখন বস 𝐅𝐀𝐇𝐈𝐌 𝐂𝐇𝐎𝐖𝐃𝐇𝐔𝐑𝐘 এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻",
  "-আজ একটা বিন নেই বলে ফেসবুকের নাগিন-🤧-গুলোরে আমার বস 𝐅𝐀𝐇𝐈𝐌 𝐂𝐇𝐎𝐖𝐃𝐇𝐔𝐑𝐘 ধরতে পারছে না-🐸🥲",
  "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো-🥱😘",
  "-হুম জান তোমার অইখানে উম্মমাহ-😷😘",
  "—যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂-আমার বস 𝐅𝐀𝐇𝐈𝐌 𝐂𝐇𝐎𝐖𝐃𝐇𝐔𝐑𝐘 এর সাথে  প্রেম করে তাকে দেখিয়ে দাও-🙈🐸🤗",
  "-আন্টি-🙆-আপনার মেয়ে-👰‍♀️-রাতে আমারে ভিদু কল দিতে বলে🫣-🥵🤤💦",
  "-শখের নারী  বিছানায় মু'তে..!🙃🥴",
  "-এই'নেও🔑চাবী 😒𝘪𝘯𝘣𝘰𝘹-এর 🔐তালা খুলে মেছেজ দেও📥🫠🤗 𝐈 𝐚𝐦 𝐒𝐢𝐧𝐠𝐥𝐞 🙂",
  "আমি গরীব এর সাথে কথা বলি না-😼😼",
  "-ওই বেডি তোমার বাসায় না আমার বস আরিয়ান মেয়ে দেখতে গেছিলো-🙃-নাস্তা আনারস আর দুধ দিছো-🙄🤦‍♂️-বইন কইলেই তো হয় বয়ফ্রেন্ড আছে-🥺🤦‍♂-আমার বস 𝐅𝐀𝐇𝐈𝐌 𝐂𝐇𝐎𝐖𝐃𝐇𝐔𝐑𝐘 কে জানে মারার কি দরকার-🙄🤧",
  "-আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি-🤗",
  "-𝚘𝐢𝐢-ইত্তু 🤏 ভালু’পাসা দিবা-🫣🥺🐼",
  "-জান মেয়ে হলে চিপায় আসো ইউটিউব থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽",
  "-আমাকে এতো না ডেকছ কেন ভলো টালো বাসো নাকি🤭🙈",
  "-আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇",
  "-বালিকা━👸-𝐃𝐨 𝐲𝐨𝐮-🫵-বিয়া-𝐦𝐞-😽-আমি তোমাকে-😻-আম্মু হইতে সাহায্য করব-🙈🥱",
  "-আর কত বার ডাকবি ,শুনছি তো,🤭🙈",
  "-আমাকে এতো না ডেকে বস 𝐅𝐀𝐇𝐈𝐌 𝐂𝐇𝐎𝐖𝐃𝐇𝐔𝐑𝐘 কে একটা গফ দে-🙄😌",
  "-আরে Bolo আমার জান ,কেমন আছো?-😚😍 ",
  "-হ্যাঁ জানু , এইদিক এ আসো কিস দেই 🤭💋"
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
