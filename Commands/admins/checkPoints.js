const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    inlineCode
} = require("discord.js");
const { ArkShopPath, PermissionsPath, CrossDB, VerifiedRoleID } = require('../../config.json');
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
        .setName("checkpoints")
        .setDescription("Shows points of target")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addUserOption(option => option.setName('target').setDescription('Select a target to fetch data from').setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) { 
        const target = interaction.options.getMember("target");
        if (!target.roles.cache.has(VerifiedRoleID)) return interaction.reply({ content: "This user doesn't have the 'verfied' role yet. He must link his account to see his data.", ephemeral : true});
        try {
                CrossChatDB.query(`SELECT * FROM discordsteamlinks WHERE DiscordId = ${target.id}`, function (err, result) {
                    if (err) throw err;
                    if (!result[0]) return interaction.reply({ content: "No data found by this user." , ephemeral : true});
                    ArkShopDB.serialize(() => {
                        ArkShopDB.each(`SELECT Id, Points, CAST(SteamId AS text) AS SteamId FROM Players WHERE SteamId = ${result[0].SteamId}`, (err, row) => {
                            if (err) throw err;
                             interaction.reply({ content: `${inlineCode(target.displayName)} currently has ${inlineCode(row.Points)} points`});
                        });
                    });
                    PermissionDB.serialize(() => {
                        PermissionDB.each(`SELECT Id, Groups, CAST(SteamId AS text) AS SteamId FROM Players WHERE SteamId = ${result[0].SteamId}`, (err, row2) => {
                            if (err) throw err;
                            const groupsClean = row2.Groups.replace(/,*$/, '');
                        interaction.channel.send(`${inlineCode(target.displayName)} is part of ${inlineCode(groupsClean)} group(s)`);
                        });
                    });
                });
        } catch (error) {
            throw error
        }
    },
};