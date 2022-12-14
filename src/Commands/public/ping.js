const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows bot's latency")
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  execute(interaction, client) {
    const response = new EmbedBuilder().setDescription(`ā° Uptime : <t:${parseInt(client.readyTimestamp / 1000)}:R>\nš Ping : ${client.ws.ping}ms`)
    interaction.reply({ embeds: [response] });
  },
};