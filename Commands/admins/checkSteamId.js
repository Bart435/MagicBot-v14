const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    inlineCode
  } = require("discord.js");
  const { ArkShopPath, PermissionsPath, VerifiedRoleID } = require('../../config.json');
  const sqlite3 = require('sqlite3').verbose();
  const connection = require('../../db/crosschat');
  const ArkShopDB = new sqlite3.Database(ArkShopPath);
  const PermissionDB = new sqlite3.Database(PermissionsPath);
  
  
  module.exports = {
    data: new SlashCommandBuilder()
        .setName("checksteamid")
        .setDescription("Shows discord related to steamid")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption(option => option.setName('target').setDescription('steamid of the target').setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) { 
        const target = interaction.options.getString("target");
        
        async function get_steamid(){
          
          const sqlQuery = `SELECT * FROM discordsteamlinks WHERE SteamId = ${target}`
          const promise = await new Promise((resolve, reject) => {
            connection.query(sqlQuery, function(err, results){
              if (results <= 0) return interaction.reply({ content: "No data found" })
              let DiscordId = `${results[0].DiscordId}`
              resolve(DiscordId)
            });
          })
          if (!promise) return interaction.reply({ content: "No data found" })
            get_points(promise)
            get_groups(promise) 
        }
        function get_points(promise) {
          ArkShopDB.serialize(() => {
            ArkShopDB.each(`SELECT Id, Points, CAST(SteamId AS text) AS SteamId FROM Players WHERE SteamId = ${target}`, (err, row) => {
                if (err) throw err;
                interaction.reply({ content: `${promise} currently has ${inlineCode(row.Points)} points`});
            });
          });
          
        }
        function get_groups(promise) {
            PermissionDB.serialize(() => {
                PermissionDB.each(`SELECT Id, Groups, CAST(SteamId AS text) AS SteamId FROM Players WHERE SteamId = ${target}`, (err, row2) => {
                    if (err) throw err;
                    let groupsClean = row2.Groups.replace(/,*$/, '');
                    interaction.channel.send(`${promise} is part of ${inlineCode(groupsClean)} group(s)`);
                });
            });
        }
        get_steamid();
    },
  };