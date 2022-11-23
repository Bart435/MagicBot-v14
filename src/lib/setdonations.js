const { EmbedBuilder } = require("discord.js");
const connection = require('../db/sql');
const { createMessage } = require("./createmessage");

function setDonations(messageID, channelID, client) {
    const channel = client.channels.cache.get(channelID)
    const sqlQuery = `SELECT name, description FROM mark.shop_item WHERE category_id = 2`
    connection.query(sqlQuery, function (err, results) {
        if (err) console.error(err)
        const embed = new EmbedBuilder()
        .setTitle("Donation Packages")
        .setDescription("All donations go directly towards server cost.\nWe appreciate your help to make MagicArk possible!")
        .setColor('#8a2be2')
        .setThumbnail("https://cdn.discordapp.com/attachments/594935473290608669/1040339335872008192/magicark_banner_steam.jpg")
        .setFooter({ text: "Source: magicark.co.uk" })
        for (let i = 0; i < results.length; i++) {
            embed.addFields({ name: `${results[i].name}` , value: `${results[i].description}`, inline: true })
        }
        embed.addFields({ name: `‎‎‏` , value: `‎‎‏`, inline: true })
        embed.addFields({ name: "‎‎‏" , value: "Donating is possible on our website [magicark.co.uk](https://magicark.co.uk/)\nBeing a donator doesn't that rules don't apply on you.\n\nWe use paypal as our standard payment method. If this is not a option for you. feel free to create a ticket <#708415348046692462>" })
        channel.messages.fetch(messageID).then(message => {
            message.edit({ embeds: [embed] })
        }).catch(err => {
            console.error(err);
            createMessage(channelID, client)
        });
    });   
}
module.exports = { setDonations }
    
    