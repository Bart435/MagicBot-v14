const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    inlineCode
} = require("discord.js");
const { ArkShopPath, PermissionsPath, CrossDB, VerifiedRoleID} = require('../../config.json');
const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql');
const ArkShopDB = new sqlite3.Database(ArkShopPath);
const PermissionDB = new sqlite3.Database(PermissionsPath);
const CrossChatDB = mysql.createConnection({
    host: CrossDB.host,
    user: CrossDB.user,
    password: CrossDB.password,
    database: CrossDB.database
});
module.exports = {
    data: new SlashCommandBuilder()
        .setName("points")
        .setDescription("Shows you shop points")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) { 
        if (!interaction.member.roles.cache.has(VerifiedRoleID)) return interaction.reply({ content: "You don't have the role 'Verfied' yet. To obtain this role. Link your steam with discord inside <#1015980346044579971>", ephemeral : true});
        const { channel } = interaction;
        try {
            CrossChatDB.connect(function (err) {
                if (err) throw err;
                CrossChatDB.query(`SELECT * FROM discordsteamlinks WHERE DiscordId = ${interaction.user.id}`, function (err, result) {
                    if (err) throw err;
                    if (!result[0]) return interaction.reply({ content: "No data found by this user." , ephemeral : true});
                    ArkShopDB.serialize(() => {
                        ArkShopDB.each(`SELECT Id, Points, CAST(SteamId AS text) AS SteamId FROM Players WHERE SteamId = ${result[0].SteamId}`, (err, row) => {
                            if (err) throw err;
                             interaction.reply({ content: `You currently have ${inlineCode(row.Points)} points`});
                        });
                    });
                    ArkShopDB.close();
                    PermissionDB.serialize(() => {
                        PermissionDB.each(`SELECT Id, Groups, CAST(SteamId AS text) AS SteamId FROM Players WHERE SteamId = ${result[0].SteamId}`, (err, row2) => {
                            if (err) throw err;
                            const groupsClean = row2.Groups.replace(/,*$/, '');
                            channel.send(`You are part of the ${inlineCode(groupsClean)} group(s)`);
                        });
                    });
                    PermissionDB.close();
                });
            });
        } catch (error) {
            throw error
        }
    },
};