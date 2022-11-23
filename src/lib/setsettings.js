const { EmbedBuilder } = require("discord.js");
const connection = require('../db/sql');
const { createMessage } = require("./createmessage");

function setSettings(messageID, channelID, client) {
    const channel = client.channels.cache.get(channelID)
    const sqlQuery = `SELECT description FROM mark.server_settings`
    connection.query(sqlQuery, function (err, results) {
        if (err) console.error(err)
        const array = []
        for (let i = 0; i < results.length; i++) {
            array.push(`🔵 ${results[i].description} `)
        }
        const embed = new EmbedBuilder()
        .setTitle("Mods & Server Settings")
        .addFields({ name: "**Server Settings:**", value: `${array.toString().split(' ,').join('\n\n')}` })
        .addFields({ name: "**Mods:**", value: "https://steamcommunity.com/sharedfiles/filedetails/?id=2870396732" })
        .setColor('#8a2be2')
        .setThumbnail("https://cdn.discordapp.com/attachments/594935473290608669/1040339335872008192/magicark_banner_steam.jpg")
        .setFooter({ text: "Source: magicark.co.uk" })
        
        channel.messages.fetch(messageID).then(message => {
            message.edit({ embeds: [embed] })
        }).catch(err => {
            console.error(err);
            createMessage(channelID, client)
        });
    });   
} 
module.exports = { setSettings }
    
