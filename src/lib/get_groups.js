const { PermissionsPath } = require('../../config.json');
const sqlite3 = require('sqlite3').verbose();
const PermissionDB = new sqlite3.Database(PermissionsPath);

function get_groups(steamId, embed, interaction) {
    PermissionDB.serialize(() => {
        PermissionDB.each(`SELECT Id, Groups, CAST(SteamId AS text) AS SteamId FROM Players WHERE SteamId = ${steamId}`, (err, row2) => {
            if (err) throw err;
            let groupsClean = row2.Groups.replace(/,*$/, '');
            embed.addFields({ name: "Groups:", value: `${groupsClean}` })
            interaction.reply({ embeds: [embed] })
        });
    });
}
module.exports = { get_groups }