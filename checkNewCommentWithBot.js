// checkNewCommentWithBot.js
const fs = require("fs");
const path = require("path");

const updateBlockedWords = () => {
    const logPath = path.join(__dirname, "spam-log.json");
    const blockedPath = path.join(__dirname, "blockedword.json");

    if (!fs.existsSync(logPath)) return;

    const logData = JSON.parse(fs.readFileSync(logPath));
    const blockedWords = fs.existsSync(blockedPath)
        ? JSON.parse(fs.readFileSync(blockedPath))
        : [];

    const wordSet = new Set(blockedWords.map(w => w.toLowerCase()));

    const similar = (a, b) => a.includes(b) || b.includes(a);

    const newWords = new Set();

    for (const entry of logData) {
        const words = entry.comment
            .toLowerCase()
            .replace(/[^\w\s]/gi, '') // hapus simbol
            .split(/\s+/);

        for (const word of words) {
            if (
                word.length > 3 &&
                !wordSet.has(word) &&
                ![...wordSet].some(existing => similar(existing, word))
            ) {
                newWords.add(word);
            }
        }
    }

    if (newWords.size > 0) {
        const updatedWords = [...wordSet, ...newWords];
        fs.writeFileSync(blockedPath, JSON.stringify(updatedWords, null, 2));
        console.log(`🆕 Added ${newWords.size} new blocked words.`);
    } else {
        console.log("✅ No new words to add.");
    }
};

module.exports = updateBlockedWords;
