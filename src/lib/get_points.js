const { ArkShopPath } = require('../../config.json');
const sqlite3 = require('sqlite3').verbose();
const ArkShopDB = new sqlite3.Database(ArkShopPath);
const { get_groups } = require('./get_groups')

function get_points(steamId, embed, interaction) {
    ArkShopDB.serialize(() => {
      ArkShopDB.each(`SELECT Id, Points, CAST(SteamId AS text) AS SteamId FROM Players WHERE SteamId = ${steamId}`, (err, row) => {
          if (err) throw err;
          embed.addFields({ name: "Points:", value: `${row.Points}` })
          get_groups(steamId, embed, interaction) 
      });
    });
}
module.exports = { get_points }