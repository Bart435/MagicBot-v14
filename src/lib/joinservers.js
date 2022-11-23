const { EmbedBuilder } = require("discord.js");
const connection = require('../db/sql')
const { createMessage } = require("./createmessage");

function setJoinServers(messageID, channelID, client) {
    const channel = client.channels.cache.get(channelID)
    const sqlQuery = `SELECT ip, port, slug, map_name FROM mark.servers`
    connection.query(sqlQuery, function (err, results) {
        if (err) console.error(err)
        const embed = new EmbedBuilder()
        .setTitle("MagicArk join details")
        .setDescription("All ip's, join buttons & Server add tutorial")
        .setColor('#8a2be2')
        .setThumbnail("https://cdn.discordapp.com/attachments/594935473290608669/1040339335872008192/magicark_banner_steam.jpg")
        .setFooter({ text: "Source: magicark.co.uk" })
        for (let i = 0; i < results.length; i++) {
            embed.addFields({ name: `${results[i].map_name}` , value: `**ip:** ${results[i].ip}:${results[i].port}\n└ [connect](https://magicark.co.uk/join/${results[i].slug})`})
        }
        embed.addFields({ name: "‎‎‏" , value: "Server can be joined by clicking connect under each map\n\nIf you don't know how to add a server to your steam favorites,  [click here](https://www.youtube.com/watch?v=xepOu9-d5GQ) to watch the tutorial we made for you" })
        channel.messages.fetch(messageID).then(message => {
            message.edit({ embeds: [embed] })
        }).catch(err => {
            console.error(err);
            createMessage(channelID, client)
        });
    });   
}
module.exports = { setJoinServers }