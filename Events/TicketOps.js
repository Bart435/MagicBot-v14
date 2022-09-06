const { ButtonInteraction } = require("discord.js");
const DB = require("../Schemas/Ticket");
const TicketSetupData = require("../Schemas/TicketSetup");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    if (!interaction.isButton()) return;
    const { guild, customId, channel, member } = interaction;
    if (!["close"].includes(customId)) return;

    const TicketSetup = await TicketSetupData.findOne({ GuildID: guild.id });
    if (!TicketSetup)
      return interaction.reply({ content: "The data for this system is outdated." });

    if (!member.roles.cache.find((r) => r.id === TicketSetup.Handlers))
      return interaction.reply({ content: "You cannot use these buttons.", ephemeral: true });

    DB.findOne({ ChannelID: channel.id }, async (err, docs) => {
      if (err) throw err;
      if (!docs)
        return interaction.reply({ content: "No data was found related to this ticket, please delete manual.", ephemeral: true, });
      switch (customId) {
        case "close":
          interaction.reply({ content: "This channel will be closed in a couple seconds." });
          setTimeout(() => {
            channel.delete();
          }, 15 * 1000);
          break;
      }
    });
  },
};