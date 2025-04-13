// checkNewCommentWithBot.js
const fs = require("fs");
const updateBlockedWords = () => {
    if (!fs.existsSync("spam-log.json")) return;

    const logData = JSON.parse(fs.readFileSync("spam-log.json"));
    const blockedWords = fs.existsSync("blockedword.json")
        ? JSON.parse(fs.readFileSync("blockedword.json"))
        : [];

    const wordSet = new Set(blockedWords.map(w => w.toLowerCase()));

    const similar = (a, b) => a.includes(b) || b.includes(a);

    const newWords = new Set();

    for (const entry of logData) {
        const words = entry.comment
            .toLowerCase()
            .replace(/[^\w\s]/gi, '')
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
        fs.writeFileSync("blockedword.json", JSON.stringify(updatedWords, null, 2));
        console.log(`🆕 Added ${newWords.size} new blocked words.`);
    } else {
        console.log("✅ No new words to add.");
    }
};

module.exports = updateBlockedWords;
