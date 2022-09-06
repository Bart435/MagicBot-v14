const {
  ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require("discord.js");
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
    const { guild, member, customId } = interaction;

    const Data = await TicketSetupData.findOne({ GuildID: guild.id });
    if (!Data) return;

    if (!["Ingame Help", "Giveaway Winner", "Other"].includes(customId)) return;

    if (!Data.IDs)
      await DB.findOneAndUpdate({ GuildID: guild.id }, { IDs: 0 })
    const ID = Number(Data.IDs) + 1;

    await guild.channels
      .create({
        name: `${customId + "-" + ID}`,
        type: ChannelType.GuildText,
        parent: Data.Category,
        permissionOverwrites: [
          {
            id: member.id,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles],
          },
          {
            id: Data.Handlers,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles],
          },
          {
            id: Data.Everyone,
            deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.AttachFiles],
          },
        ],
      })
      .then(async (channel) => {
        await DB.create({
          GuildID: guild.id,
          MembersID: member.id,
          TicketID: ID,
          ChannelID: channel.id,
          Type: customId,

        });
        await TicketSetupData.findOneAndUpdate({ GuildID: guild.id }, { IDs: ID });

        const Embed = new EmbedBuilder()
          .setAuthor({
            name: `${guild.name} | Ticket: ${ID}`,
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
            .setLabel("Save & Close Ticket")
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