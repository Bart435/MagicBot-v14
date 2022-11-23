const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("A complete giveaway system")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('start')
                .setDescription('Start a giveaway')
                .addStringOption(option => option.setName('duration').setDescription('Provide a duration for this giveaway (1m, 1h, 1d)').setRequired(true))
                .addIntegerOption(option => option.setName('winners').setDescription('Select the amount of winners for this giveaway').setRequired(true))
                .addStringOption(option => option.setName('prize').setDescription('Provide the name of the prize').setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription('Select a channel to send the giveaway to').setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('actions')
                .setDescription('Options for giveaways')
                .addStringOption(option => option.setName('options').setDescription('Select an option').addChoices(
                    { name: 'end', value: 'end' },
                    { name: 'pause', value: 'pause' },
                    { name: 'unpause', value: 'unpause' },
                    { name: 'reroll', value: 'reroll' },
                    { name: 'delete', value: 'delete' },
                ).setRequired(true))
                .addStringOption(option => option.setName('message-id').setDescription('Provide the message id of the giveaway').setRequired(true))
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction, client) {
        const Sub = interaction.options.getSubcommand();

        switch (Sub) {
            case "start": {
                const gchannel = interaction.options.getChannel("channel") || interaction.channel;
                const duration = interaction.options.getString("duration");
                const winnerCount = interaction.options.getInteger("winners");
                const prize = interaction.options.getString("prize");

                client.giveawaysManager.start(gchannel, {
                    duration: ms(duration),
                    winnerCount,
                    prize,
                    messages: {
                        giveaway: "🐌 GIVEAWAY STARTED 🐌",
                        giveawayEnded: "🐌 GIVEAWAY ENDED 🐌",
                        winMessage: '**Congratulations**, {winners}! You won **{this.prize}**! 🐌🐌'
                    }
                }).then(async () => {
                    return interaction.reply({ content: "Giveaway was successfully started.", ephemeral: true });
                }).catch((err) => {
                    return interaction.reply({ content: `An error has occurred\n\`${err}\``, ephemeral: true });
                })
            }
            break;

            case "actions": {
                const choice = interaction.options.getString("options");
                const messageId = interaction.options.getString("message-id");

                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

                if (!giveaway) {
                    return interaction.reply({ content: `Unable to find the giveaway with the message id : ${messageId} in this guild.`, ephemeral: true });
                }

                switch (choice) {
                    case "end": {
                        client.giveawaysManager.end(messageId).then(() => {
                            return interaction.reply({ content: "Giveaway has been ended.", ephemeral: true })
                        }).catch((err) => {
                            return interaction.reply({ content: `An error has occurred\n\`${err}\``, ephemeral: true });
                        });
                    }
                    break;
                    case "pause": {
                        client.giveawaysManager.pause(messageId).then(() => {
                            return interaction.reply({ content: "Giveaway has been paused.", ephemeral: true })
                        }).catch((err) => {
                            return interaction.reply({ content: `An error has occurred\n\`${err}\``, ephemeral: true });
                        });
                    }
                    break;
                    case "unpause": {
                        client.giveawaysManager.unpause(messageId).then(() => {
                            return interaction.reply({ content: "Giveaway has been unpaused.", ephemeral: true })
                        }).catch((err) => {
                            return interaction.reply({ content: `An error has occurred\n\`${err}\``, ephemeral: true });
                        });
                    }
                    break;
                    case "reroll": {
                        client.giveawaysManager.reroll(messageId).then(() => {
                            return interaction.reply({ content: "Giveaway has been rerolled.", ephemeral: true })
                        }).catch((err) => {
                            return interaction.reply({ content: `An error has occurred\n\`${err}\``, ephemeral: true });
                        });
                    }
                    break;
                    case "delete": {
                        client.giveawaysManager.delete(messageId).then(() => {
                            return interaction.reply({ content: "Giveaway has been deleted.", ephemeral: true });
                        }).catch((err) => {
                            return interaction.reply({ content: `An error has occurred\n\`${err}\``, ephemeral: true });
                        });
                    }
                    break;
                }
            }
            break;
            default: {
                console.log("Error in giveaway command.")
            }
        }
    },
};