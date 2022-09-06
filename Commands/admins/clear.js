const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Delets a specified number of messages from a channel or a target")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addNumberOption(option => option.setName('amount').setDescription('Select the amount of message to delete from a channel or target').setRequired(true))
        .addUserOption(option => option.setName('target').setDescription('Select a target to clear their messages').setRequired(false)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const { channel, options } = interaction;
        const Amount = options.getNumber("amount");
        const Target = options.getMember("target");
        const Messages = await channel.messages.fetch();

        if (Target) {
            let i = 0;
            const filterd = [];
            (await Messages).filter((m) => {
                if (m.author.id === Target.id && Amount > i) {
                    filterd.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filterd, true).then(messages => {
                interaction.reply({ content: `Cleared ${messages.size} from ${Target}.` });
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                interaction.reply({ content: `Cleared ${messages.size} from this channel.` });
            })
        }
    },
};