const { EmbedBuilder } = require("discord.js");
const connection = require('../db/sql');
const { createMessage } = require("./createmessage");

function setScoreboard(messageID, channelID, client) {
    const channel = client.channels.cache.get(channelID)
    const sqlQuery1 = `SELECT MinutesPlayed, Name FROM kal.lethalquests_stats ORDER BY MinutesPlayed DESC LIMIT 5`
    const sqlQuery2 = `SELECT TamedDinoKills, Name FROM kal.lethalquests_stats ORDER BY TamedDinoKills DESC LIMIT 5`
    const sqlQuery3 = `SELECT BossKills, Name FROM kal.lethalquests_stats ORDER BY BossKills DESC LIMIT 5`
    const sqlQuery4 = 'SELECT `K/D` AS "kd", Name FROM kal.lethalquests_stats ORDER BY `K/D` DESC LIMIT 5'
    const sqlQuery5 = `SELECT PlayerKills, Name FROM kal.lethalquests_stats ORDER BY PlayerKills DESC LIMIT 5`
    const sqlQuery6 = `SELECT TotalDeaths, Name FROM kal.lethalquests_stats ORDER BY TotalDeaths DESC LIMIT 5`

    const embed = new EmbedBuilder().setTitle("Scoreboard").setColor("#8a2be2")
    connection.query(sqlQuery1, function (err, results) {
        const minutesPlayed = []
        if (err) console.error(err)
        for (let i = 0; i < results.length; i++) {
            let string = results[i].MinutesPlayed
            const hours = parseInt(results[i].MinutesPlayed) / 60
            minutesPlayed.push(`${results[i].Name.substring(0, 9)} - ${hours.toFixed(1)}`)
        }
        const message = "```" + `${minutesPlayed[0]}\n${minutesPlayed[1]}\n${minutesPlayed[2]}\n${minutesPlayed[3]}\n${minutesPlayed[4]}` + "```"
        embed.addFields({ name: 'Hours played', value: message, inline: true })

        connection.query(sqlQuery2, function (err, results) {
            const TamedDinoKills = []
            if (err) console.error(err)
            for (let i = 0; i < results.length; i++) {
                TamedDinoKills.push(`${results[i].Name.substring(0, 9)} - ${results[i].TamedDinoKills}`)
            }
            const message = "```" + `${TamedDinoKills[0]}\n${TamedDinoKills[1]}\n${TamedDinoKills[2]}\n${TamedDinoKills[3]}\n${TamedDinoKills[4]}` + "```"
            embed.addFields({ name: 'Tamed Dinos killed', value: message, inline: true })

            connection.query(sqlQuery3, function (err, results) {
                const BossKills = []
                if (err) console.error(err)
                for (let i = 0; i < results.length; i++) {

                    BossKills.push(`${results[i].Name.substring(0, 9)} - ${results[i].BossKills}`)
                }
                const message = "```" + `${BossKills[0]}\n${BossKills[1]}\n${BossKills[2]}\n${BossKills[3]}\n${BossKills[4]}` + "```"
                embed.addFields({ name: 'Bosskills', value: message, inline: true })

                connection.query(sqlQuery4, function (err, results) {
                    const kd = []
                    if (err) console.error(err)
                    for (let i = 0; i < results.length; i++) {
                        kd.push(`${results[i].Name.substring(0, 9)} - ${results[i].kd}`)
                    }
                    const message = "```" + `${kd[0]}\n${kd[1]}\n${kd[2]}\n${kd[3]}\n${kd[4]}` + "```"
                    embed.addFields({ name: 'K / D', value: message, inline: true })

                    connection.query(sqlQuery5, function (err, results) {
                        const PlayerKills = []
                        if (err) console.error(err)
                        for (let i = 0; i < results.length; i++) {
                            PlayerKills.push(`${results[i].Name.substring(0, 9)} - ${results[i].PlayerKills}`)
                        }
                        const message = "```" + `${PlayerKills[0]}\n${PlayerKills[1]}\n${PlayerKills[2]}\n${PlayerKills[3]}\n${PlayerKills[4]}` + "```"
                        embed.addFields({ name: 'PlayerKills', value: message, inline: true })

                        connection.query(sqlQuery6, function (err, results) {
                            const TotalDeaths = []
                            if (err) console.error(err)
                            for (let i = 0; i < results.length; i++) {
                                TotalDeaths.push(`${results[i].Name.substring(0, 9)} - ${results[i].TotalDeaths}`)
                            }
                            const message = "```" + `${TotalDeaths[0]}\n${TotalDeaths[1]}\n${TotalDeaths[2]}\n${TotalDeaths[3]}\n${TotalDeaths[4]}` + "```"
                            embed.addFields({ name: 'TotalDeaths', value: message, inline: true })
                            channel.messages.fetch(messageID).then(message => {
                                message.edit({ embeds: [embed] })
                            }).catch(err => {
                                console.error(err);
                                createMessage(channelID, client)
                            });                            
                        });
                    });
                });
            });
        });
    });
}
module.exports = { setScoreboard }