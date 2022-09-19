const { ButtonInteraction } = require("discord.js");
const connection = require('../db/crosschat');

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    if (!interaction.isButton()) return;
    const { customId, channel, member } = interaction;
    if (!["close"].includes(customId)) return;


    if (!member.roles.cache.find((r) => r.id === "551407909674680332"))
      return interaction.reply({ content: "You cannot use these buttons.", ephemeral: true });

    switch (customId) {
      case "close": {
        const sqlQuery = `UPDATE tickets SET closed = 1 WHERE channelID = ${channel.id}`;
        connection.query(sqlQuery, function (err, results) {
          if (!results) return
          interaction.reply({ content: "This channel will be closed in a couple seconds." });
          setTimeout(() => {
            channel.delete();
          }, 15 * 1000);
        });
      }
        break;
    }
  },
};