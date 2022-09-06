const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows help embed.")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#8a2be2")
            .setTitle("**all commands**")
            .setFooter({ text: "Made by Bart#8888" })
            .setTimestamp()
            .addFields(
                { name: '‎‎‎‎', value: 'Commands available for everyone.' },
                { name: '**Basic**', value: '/help\n/suggestion\n/ping\n/points', inline: true },
                { name: '**Fun**', value: '/8ball', inline: true },
                { name: '‎‎‎‎', value: 'Commands available for staff.' },
                { name: '**Admin only**', value: '/clear\n/giveaway\n/poll\n/checkpoints\n/checksteam', inline: true },
            );
        interaction.reply({ embeds: [embed] });
    },
};