const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const DB = require('../../Schemas/TicketSetup')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticketsetup")
        .setDescription("Setup your ticketing message")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option => option.setName('channel').setDescription('Select the ticket creation channel').setRequired(true))
        .addChannelOption(option => option.setName('category').setDescription("Select the ticket channels's creation category").setRequired(true))
        .addChannelOption(option => option.setName('transcripts').setDescription('Select the transcripts channel').setRequired(true))
        .addRoleOption(option => option.setName('handlers').setDescription("Select the ticket handler's role").setRequired(true))
        .addRoleOption(option => option.setName('everyone').setDescription("Provide the @everyone role. ITS IMPORTANT!").setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const { guild, options } = interaction;
        try {
            const Channel = options.getChannel("channel");
            const Category = options.getChannel("category");
            const Transcripts = options.getChannel("transcripts");
            const Handlers = options.getRole("handlers");
            const Everyone = options.getRole("everyone");

            const Description = "You can choose between categories below. Press the button that fits your ticket the best."

            const Button1 = "Ingame Help"
            const Button2 = "Giveaway Winner"
            const Button3 = "Other"

            await DB.findOneAndUpdate(
                { GuildID: guild.id },
                {
                    Channel: Channel.id,
                    Category: Category.id,
                    Transcripts: Transcripts.id,
                    Handlers: Handlers.id,
                    Everyone: Everyone.id,
                    Description: Description,
                    Buttons: [Button1, Button2, Button3],
                },
                {
                    new: true,
                    upsert: true,
                }
            );

            const Buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(Button1)
                    .setLabel(Button1)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(Button2)
                    .setLabel(Button2)
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(Button3)
                    .setLabel(Button3)
                    .setStyle(ButtonStyle.Success),
            );

            const Embed = new EmbedBuilder()
                .setAuthor({
                    name: guild.name + " | Ticketing System",
                    iconURL: guild.iconURL({ dynamic: true }),
                })
                .setDescription(Description)
                .setColor("#36393f");

            await guild.channels.cache
                .get(Channel.id)
                .send({ embeds: [Embed], components: [Buttons] });

            interaction.reply({ content: "Done", ephemeral: true });
        } catch (err) {
            const errEmbed = new EmbedBuilder().setColor("Red").setDescription(
                `⛔ | An error occured while setting up your ticket system\n**what to make sure of?**
              1. Make sure none of your buttons' names are duplicated
              2. Make sure you use this format for your buttons => Name,Emoji
              3. Make sure your button names do not exceed 200 characters
              4. Make sure your button emojis, are actually emojis, not ids.`
            );
            console.log(err);
            interaction.reply({ embeds: [errEmbed] });
        }
    },
};
