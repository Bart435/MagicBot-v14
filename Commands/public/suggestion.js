const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggestion")
        .setDescription("Submits your suggestion")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .addStringOption(option =>
            option.setName('suggestion')
                .setDescription('Enter the suggestion you want to make')
                .setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        const suggestion = interaction.options.getString("suggestion");
        const channel = interaction.guild.channels.cache.find(ch => ch.name === '💡suggestions💡');

        const failed = new EmbedBuilder()
            .setDescription("There is no channel called 💡suggestions💡 in this server")

        const reply = new EmbedBuilder()
            .setDescription("Your suggestion has been submitted!")

        const sug = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL({ dyanmic: true })
            })
            .setColor('#8a2be2')
            .setDescription(`${suggestion}`)
            .setTimestamp()

        if (channel) {
            interaction.reply({ embeds: [reply], ephemeral: true });

            const message = channel.send({ embeds: [sug], fetchReply: true }).then((msg) => {
                msg.react("👍");
                msg.react("👎");
            }).catch((err) => {
                throw err;
            });
        } else {
            interaction.reply({ embeds: [failed], ephemeral: true });
        };
    },
};