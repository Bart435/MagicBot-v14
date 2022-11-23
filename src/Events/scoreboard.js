const connection = require('../db/sql');
const { createMessage } = require("../lib/createmessage");
const { setScoreboard } = require('../lib/setscoreboard')

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    let timer = setInterval(function () {
        const sqlQuery = `SELECT * FROM kal.discordposts WHERE MsgKey = 'scoreboard'`
        connection.query(sqlQuery, function (err, results) {
            if (err) console.error(err)
            let channelID = results[0].ChatChannelId
            let messageID = results[0].MsgId

            if (channelID && messageID) setScoreboard(messageID, channelID, client)
            if (!channelID) console.error("ChannelID is not defined")
            if (!messageID) {
                if (channelID) {
                    createMessage(channelID, client)
                } else {
                    console.error("ChannelID is not defined")
                }
            }
        });
    }, 600000);
  },
};
