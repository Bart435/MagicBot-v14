const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

const connection = require('../../db/sql');
const { get_points } = require('../../lib/get_points')
  
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
      const steamId = interaction.options.getString("target");
      const sqlQuery = `SELECT * FROM kal.discordsteamlinks WHERE SteamId = ${steamId}`
      connection.query(sqlQuery, function(err, results){
          if (err) throw err;
          if (results <= 0) return interaction.reply({ content: "No data found", ephemeral: true })
          if (results[0].DiscordId <= 0) return interaction.reply({ content: "User has not linked there discord to ark", ephemeral: true })
          let discordId = `${results[0].DiscordId}`
          let embed = new EmbedBuilder().setColor("#8a2be2").setThumbnail("https://cdn.discordapp.com/attachments/594935473290608669/1040339335872008192/magicark_banner_steam.jpg").addFields({ name: "Steamid:", value: `${steamId}` }, { name: "Discord:", value: `<@${discordId}>` })
          get_points(steamId, embed, interaction)
      });
  },
};