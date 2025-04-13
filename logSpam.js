// logSpam.js
const fs = require("fs");
const path = require("path");

const logSpam = (videoId, commentText) => {
    const logPath = path.join(__dirname, "spam-log.json");
    const logEntry = {
        videoId,
        timestamp: new Date().toISOString(),
        comment: commentText,
    };

    const logData = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : [];
    logData.push(logEntry);
    fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
};

module.exports = logSpam;
