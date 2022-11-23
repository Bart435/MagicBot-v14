const connection = require('../db/sql');
const { apply_role } = require('./apply_role');

function find_discordID(steamid, client) {
    const sql = `SELECT DiscordId FROM kal.discordsteamlinks WHERE SteamId = ${steamid}`
    connection.query(sql, function (err, results) {
        if (err) throw err;
        if (results <= 0) return
        const discordID = results[0].DiscordId
        apply_role(discordID, client)
    });
}
module.exports = { find_discordID }