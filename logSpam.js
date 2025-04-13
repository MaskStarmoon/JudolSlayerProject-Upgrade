// logSpam.js
const fs = require("fs");
const logSpam = (videoId, commentText) => {
    const logEntry = {
        videoId,
        timestamp: new Date().toISOString(),
        comment: commentText,
    };

    const logData = fs.existsSync("spam-log.json") ? JSON.parse(fs.readFileSync("spam-log.json")) : [];
    logData.push(logEntry);
    fs.writeFileSync("spam-log.json", JSON.stringify(logData, null, 2));
};

module.exports = logSpam;
