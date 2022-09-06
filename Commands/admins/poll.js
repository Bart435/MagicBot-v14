const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option.setName('question').setDescription('State the question for the poll').setRequired(true))
    .addStringOption(option => option.setName('yes-or-no').setDescription('Is this a yes or no poll').addChoices(
      { name: 'True', value: 'true' },
      { name: 'False', value: 'false' },
    ).setRequired(true))
    .addStringOption(option => option.setName('options').setDescription('State the options for the poll Option1^Option2^Option3').setRequired(false))
    .addChannelOption(option => option.setName('channel').setDescription('Select a channel to send the message to').setRequired(false)),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const question = interaction.options.getString("question");
    let options = interaction.options.getString("options")
    const yOrNo = interaction.options.getString("yes-or-no");
    const gChannel = interaction.options.getChannel("channel") || interaction.channel;

    switch (yOrNo) {
      case "false":

        if (!options)
          return interaction.reply({ embeds: [new EmbedBuilder().setColor("Red").setDescription("retard")], ephemeral: true })

        const splitOptions = [];
        const emoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']

        options = options.split("^");
        options.forEach(e => {
          if (e.length > 0) {
            splitOptions.push(e.trim())
          }
        });

        if (splitOptions.length > 9)
          return interaction.reply({ embeds: [new EmbedBuilder().setColor("Red").setDescription("Even a kid with down can do better. Cant use more than 9 answers")], ephemeral: true })



        let pollOptions = ` `

        for (let i = 0; i < splitOptions.length; i++) {
          pollOptions = pollOptions + (`\n\n ${emoji[i]} ${splitOptions[i]}`)
        }

        const pollEmbed = new EmbedBuilder()
          .setColor("#8a2be2")
          .setTitle(`**${question}**`)
          .setAuthor({ name: '📮poll📮', })
          .setDescription(pollOptions)
          .setFooter({ text: "Vote by reacting with the buttons below." })
          .setTimestamp()

        const sendMessage = await client.channels.cache.get(gChannel.id).send({ embeds: [pollEmbed] });
        for (let i = 0; i < splitOptions.length; i++) {
          sendMessage.react(`${emoji[i]}`);
        }
        interaction.reply({ embeds: [new EmbedBuilder().setColor("Green").setDescription(`You aint a retard now. also its send to ${gChannel}.`)], ephemeral: true })
        break;

      case "true":
        const pollEmbedYOrNo = new EmbedBuilder()
          .setColor("#8a2be2")
          .setTitle(`**${question}**`)
          .setAuthor({ name: '📮poll📮', })
          .setFooter({ text: "Vote by reacting with the buttons below." })
          .setTimestamp()

        const sendMessageYOrNo = await client.channels.cache.get(gChannel.id).send({ embeds: [pollEmbedYOrNo] });
        sendMessageYOrNo.react("👍")
        sendMessageYOrNo.react("👎")


        interaction.reply({ embeds: [new EmbedBuilder().setColor("Green").setDescription(`You aint a retard now. also its send to ${gChannel}.`)], ephemeral: true })
        break;
    }
  },
};