const { EmbedBuilder } = require('discord.js');
const connection = require('../db/sql');

async function createMessage(channelID, client) {
    const temp = new EmbedBuilder().setDescription("Embed coming soon").setColor('#8a2be2');
    const channel = client.channels.cache.get(channelID);
    const msg = await channel.send({ embeds: [temp] });
    const sqlQuery = `UPDATE kal.discordposts SET MsgId = ${msg.id} WHERE ChatChannelId = ${channelID}`
    connection.query(sqlQuery, function (err, results) {
        if (err) console.error(err)
        if (!results) console.error("MessageID not succesfully changed")
    })
}

module.exports = { createMessage };