const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const connection = require('../db/timerDB');

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    let timer = setInterval(function () {
        const sqlQuery = `SELECT * FROM timer`
        connection.query(sqlQuery, function (err, results) {
            if (err) console.error(err)
            let channelID = results[0].channelID
            let messageID = results[0].messageID
            let dateValue = results[0].dateValue
            let lastWipe = results[0].lastWipe

            if (channelID && messageID) setTimer(messageID, dateValue, channelID, lastWipe)
            if (!channelID) console.error("ChannelID is not defined")
            if (!messageID) {
                if (channelID) {
                    createMessage(channelID)
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
    function setTimer(messageID, dateValue, channelID, lastWipe) {
        const channel = client.channels.cache.get(channelID)
        const now = new Date().getTime();
        const countDownDate = new Date(dateValue).getTime();
        const embed = new EmbedBuilder().setTitle('**Wipe**').setColor('#8a2be2').addFields({ name: 'Last wipe :', value: lastWipe || "blank" })
        const distance = countDownDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const data = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    
        if (distance > 0) embed.addFields({ name: 'Upcoming wipe :', value: `${data}` })
        if (distance < 0) {
            embed.addFields({ name: 'Upcoming wipe :', value: "**The timer ran out**" })
        }
    
        channel.messages.fetch(messageID).then(message => {
            message.edit({ embeds: [embed] })
        }).catch(err => {
            console.error(err);
            createMessage(channelID)
        });
    }
    
    async function createMessage(channelID) {
        const temp = new EmbedBuilder().setDescription("re");
        const channel = client.channels.cache.get(channelID);
        const msg = await channel.send({ embeds: [temp] });
        const sqlQuery = `UPDATE timer SET messageID = ${msg.id} WHERE channelID = ${channelID}`
        connection.query(sqlQuery, function (err, results) {
            if (err) console.error(err)
            if (!results) console.error("MessageID not succesfully changed")
        })
    }
  },
};
