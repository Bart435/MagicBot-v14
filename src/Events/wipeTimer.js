const { EmbedBuilder } = require("discord.js");
const connection = require('../db/sql');
const { createMessage } = require('../lib/createmessage')
const { setTimer } = require('../lib/settimer')
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    let timer = setInterval(function () {
        const sqlQuery = `SELECT * FROM kal.timer`
        connection.query(sqlQuery, function (err, results) {
            if (err) console.error(err)
            let channelID = results[0].channelID
            let messageID = results[0].messageID
            let dateValue = results[0].dateValue
            let lastWipe = results[0].lastWipe

            if (channelID && messageID) setTimer(messageID, dateValue, channelID, lastWipe, client)
            if (!channelID) console.error("ChannelID is not defined")
            if (!messageID) {
                if (channelID) {
                    createMessage(channelID, client)
                } else {
                    console.error("ChannelID is not defined")
                }
            }
            if (!dateValue) {
                const channel = client.channels.cache.get(channelID)
                const embed = new EmbedBuilder().setTitle('**Wipe**').setColor('#8a2be2').addFields({ name: 'Last wipe :', value: lastWipe || "blank" }).addFields({ name: 'Upcoming wipe :', value: "No date found" })
                channel.messages.fetch(messageID).then(message => {
                    message.edit({ embeds: [embed] })
                }).catch(err => {
                    console.error(err);
                });
            }
        });
    }, 10000);
  },
};
