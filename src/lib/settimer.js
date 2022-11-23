const { EmbedBuilder } = require("discord.js");
const { createMessage } = require('./createmessage')

function setTimer(messageID, dateValue, channelID, lastWipe, client) {
    const channel = client.channels.cache.get(channelID)
    const now = new Date().getTime();
    const countDownDate = new Date(dateValue).getTime();
    const embed = new EmbedBuilder()
        .setTitle('**Wipe**')
        .setColor('#8a2be2')
        .addFields({ name: 'Last wipe :', value: lastWipe || "blank" })
        .setThumbnail("https://cdn.discordapp.com/attachments/594935473290608669/1040339335872008192/magicark_banner_steam.jpg")
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
        createMessage(channelID, client)
    });
}
module.exports = { setTimer }