const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  inlineCode
} = require("discord.js");
const { resolve, reject } = require("node-superfetch");
const { ArkShopPath, PermissionsPath, VerifiedRoleID } = require('../../config.json');
const sqlite3 = require('sqlite3').verbose();
const connection = require('../../db/crosschat');
const ArkShopDB = new sqlite3.Database(ArkShopPath);
const PermissionDB = new sqlite3.Database(PermissionsPath);


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
      

      async function get_steamid(test){
        const sqlQuery = `SELECT * FROM discordsteamlinks WHERE DiscordId = ${target.id}`
        const promise = await new Promise((resolve, reject) => {
          connection.query(sqlQuery, function(err, results){
            let SteamId = `${results[0].SteamId}`
            resolve(SteamId)
          });
        })
        if (!promise) return interaction.reply({ content: "No data found" })
          get_points(promise)
          get_groups(promise) 
      }
      function get_points(promise) {
        ArkShopDB.serialize(() => {
          ArkShopDB.each(`SELECT Id, Points, CAST(SteamId AS text) AS SteamId FROM Players WHERE SteamId = ${promise}`, (err, row) => {
              if (err) throw err;
              interaction.reply({ content: `${inlineCode(target.displayName)} currently has ${inlineCode(row.Points)} points`});
          });
        });
        
      }
      function get_groups(promise) {
          PermissionDB.serialize(() => {
              PermissionDB.each(`SELECT Id, Groups, CAST(SteamId AS text) AS SteamId FROM Players WHERE SteamId = ${promise}`, (err, row2) => {
                  if (err) throw err;
                  let groupsClean = row2.Groups.replace(/,*$/, '');
                  interaction.channel.send(`${inlineCode(target.displayName)} is part of ${inlineCode(groupsClean)} group(s)`);
              });
          });
      }
      get_steamid();
  },
};