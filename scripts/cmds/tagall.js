const fs = require("fs");

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const DB_FILE = "./tagall_onebyone.json";

// 🔥 memory load
let db = {};
if (fs.existsSync(DB_FILE)) {
  db = JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// 🔥 GLOBAL STOP FLAG (IMPORTANT FIX)
let stopTagAll = {};

module.exports = {
  config: {
    name: "tagall",
    version: "9.0.0",
    author: "MR_FARHAN",
    role: 0,
    shortDescription: "Fixed 1-by-1 tagall with proper stop",
    category: "group"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const text = (event.body || "").trim();
    const threadID = event.threadID;

    // ❌ OFF (REAL STOP FIX)
    if (text.toLowerCase() === "/tagall off") {
      stopTagAll[threadID] = true;

      if (db[threadID]) delete db[threadID];
      saveDB();

      return api.sendMessage("❌ TagAll STOPPED successfully", threadID);
    }

    // ▶️ CONTINUE
    if (text.toLowerCase() === "/tagall continue") {
      if (!db[threadID]) {
        return api.sendMessage("⚠️ কোনো saved session নেই", threadID);
      }

      stopTagAll[threadID] = false;

      return runTag(api, threadID, db[threadID]);
    }

    // ▶️ START
    if (!text.toLowerCase().startsWith("/tagall")) return;

    const msg = text.replace(/\/tagall/i, "").trim();

    if (!msg) {
      return api.sendMessage("⚠️ ব্যবহার: /tagall আপনার মেসেজ", threadID);
    }

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const members = threadInfo.participantIDs;
      const userInfo = await api.getUserInfo(members);

      db[threadID] = {
        msg,
        members,
        userInfo,
        index: 0
      };

      stopTagAll[threadID] = false;

      saveDB();

      api.sendMessage(
        `📢 1-by-1 TagAll Started\n📝 ${msg}\n👥 Total: ${members.length}`,
        threadID
      );

      return runTag(api, threadID, db[threadID]);

    } catch (err) {
      console.log(err);
      return api.sendMessage("❌ Error occurred", threadID);
    }
  }
};

// ---------------- CORE ----------------
async function runTag(api, threadID, data) {
  const { msg, members, userInfo } = data;

  for (let i = data.index; i < members.length; i++) {

    // 🔥 REAL STOP CHECK (IMPORTANT FIX)
    if (stopTagAll[threadID]) {
      data.index = i;
      db[threadID] = data;
      saveDB();

      return api.sendMessage("⛔ TagAll Stopped", threadID);
    }

    const id = members[i];
    const name = userInfo[id]?.name || "User";

    const body = ` ${msg} @${name}`;

    await api.sendMessage({
      body,
      mentions: [
        {
          id,
          tag: name,
          fromIndex: body.indexOf(name)
        }
      ]
    }, threadID);

    // save progress
    data.index = i + 1;
    db[threadID] = data;
    saveDB();

    // 🔥 safe delay
    await delay(1500);
  }

  // finished cleanup
  delete db[threadID];
  delete stopTagAll[threadID];

  saveDB();

  return api.sendMessage("✅ TagAll Complete", threadID);
                             }
