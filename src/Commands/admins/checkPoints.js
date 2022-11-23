const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, inlineCode, EmbedBuilder } = require("discord.js");
const connection = require('../../db/sql');
const { get_points } = require('../../lib/get_points')

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
        const sqlQuery = `SELECT * FROM kal.discordsteamlinks WHERE DiscordId = ${target.id}`
        connection.query(sqlQuery, function(err, results) {
          if (results <= 0) return interaction.reply({ content: "No data found", ephemeral: true })
          if (results[0].SteamId <= 0) return interaction.reply({ content: "User has not linked there discord to ark", ephemeral: true })
          let steamId = `${results[0].SteamId}`
          let embed = new EmbedBuilder().setTitle(`${target.displayName}'s info`).setColor("#8a2be2").setThumbnail("https://cdn.discordapp.com/attachments/594935473290608669/1040339335872008192/magicark_banner_steam.jpg").addFields({ name: "Steamid:", value: `${steamId}` })
          get_points(steamId, embed, interaction)
        });

  },
};