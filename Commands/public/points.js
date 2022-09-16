const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    inlineCode
} = require("discord.js");
const { ArkShopPath, PermissionsPath, VerifiedRoleID} = require('../../config.json');
const sqlite3 = require('sqlite3').verbose();
const ArkShopDB = new sqlite3.Database(ArkShopPath);
const PermissionDB = new sqlite3.Database(PermissionsPath);
const connection = require('../../db/crosschat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("points")
        .setDescription("Shows you shop points")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) { 
        if (!interaction.member.roles.cache.has(VerifiedRoleID)) return interaction.reply({ content: "You don't have the role 'Verfied' yet. To obtain this role. Link your steam with discord inside <#1015980346044579971>", ephemeral : true});
        function get_steamid(){
            connection.query(`SELECT * FROM discordsteamlinks WHERE DiscordId = ${interaction.user.id}`, function(err, results){
              if(err) throw err;
              if (!results[0]) return interaction.reply({ content: "No data found by this user." , ephemeral : true});
              let SteamId = `${results[0].SteamId}`
              get_points(SteamId)
              get_groups(SteamId) 
            });
          }
          function get_points(SteamId) {
            ArkShopDB.serialize(() => {
              ArkShopDB.each(`SELECT Id, Points, CAST(SteamId AS text) AS SteamId FROM Players WHERE SteamId = ${SteamId}`, (err, row) => {
                  if (err) throw err;
                  interaction.reply({ content: `${inlineCode(interaction.member.displayName)} currently has ${inlineCode(row.Points)} points`});
              });
            });
            
          }
        function get_groups(SteamId) {
              PermissionDB.serialize(() => {
                PermissionDB.each(`SELECT Id, Groups, CAST(SteamId AS text) AS SteamId FROM Players WHERE SteamId = ${SteamId}`, (err, row2) => {
                      if (err) throw err;
                      let groupsClean = row2.Groups.replace(/,*$/, '');
                      interaction.channel.send(`${inlineCode(interaction.member.displayName)} is part of ${inlineCode(groupsClean)} group(s)`);
                  });
              });
        }
        get_steamid();
    },
};