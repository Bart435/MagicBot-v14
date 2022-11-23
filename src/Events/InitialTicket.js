const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionsBitField } = require("discord.js");
const connection = require('../db/sql');
module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    if (!interaction.isButton()) return;
    const { guild, member, customId } = interaction;

    if (!["Ingame Help", "Giveaway Winner", "Other"].includes(customId)) return;

    const sqlQuery = `SELECT COUNT(*) FROM kal.tickets;`
    const promise = await new Promise((resolve, reject) => {
      connection.query(sqlQuery, function (err, results) {
        resolve(results[0])
      });
    })
    let id = (promise['COUNT(*)'])
    await guild.channels
      .create({
        name: `${customId + "-" + id.toString()}`,
        type: ChannelType.GuildText,
        parent: "708421636550033478",
        permissionOverwrites: [
          {
            id: member.id,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles],
          },
          {
            id: "551407909674680332",
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles],
          },
          {
            id: "551402765377601546",
            deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles],
          },
        ],
      })
      .then(async (channel) => {
        const sql = `INSERT INTO kal.tickets (membersID, type, channelID) VALUES ?`;
        var values = [
          [member.id, customId, channel.id]
        ];
        connection.query(sql, [values], function (err, results) {
          if (err) throw err;
        })

        const Embed = new EmbedBuilder()
          .setAuthor({
            name: `${guild.name} | Ticket: ${id}`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setDescription(
            `Ticket Opened By: ${member}
              Please wait patiently for a response from the Staff team, in the mean while, describe your issue in as much detail as possible.`
          )
          .setFooter({ text: "The buttons below are Staff Only Buttons." });

        const Buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("close")
            .setLabel("Close Ticket")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("💾"),
        );

        channel.send({
          embeds: [Embed],
          components: [Buttons],
        });
        await channel
          .send({ content: `${member} here is your ticket` })
          .then((m) => {
            setTimeout(() => {
              m.delete().catch(() => { });
            }, 1 * 5000);
          });

        interaction.reply({
          content: `${member} your ticket has been created: ${channel}`,
          ephemeral: true,
        });
      });
  },
};