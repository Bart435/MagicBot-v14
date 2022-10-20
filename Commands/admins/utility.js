const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const connection = require('../../db/timerDB'); 
module.exports = {
    data: new SlashCommandBuilder()
        .setName("utility")
        .setDescription("Sends embeds")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('embeds')
                .setDescription('All static embeds')
                .addStringOption(option => option.setName('embed').setDescription('select the embed you would like').addChoices(
                    { name: 'banappeal', value: 'banappeal' },
                    { name: 'rules', value: 'rules' },
                    { name: 'donation', value: 'donation' },
                    { name: 'modlist', value: 'modlist' },
                ).setRequired(true))
                .addChannelOption(option => option.setName('channel').setDescription('select the channel you want the embed to be send in').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('wipe')
                .setDescription('wipe embed')
                .addStringOption(option => option.setName('last').setDescription('Last wipe date').setRequired(true))
                .addStringOption(option => option.setName('upcoming').setDescription('data type : mm/dd/yy hh/mm/ss').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('ticket')
                .setDescription('ticket setup')
        ),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case "embeds": {
                const choice = interaction.options.getString('embed');
                const channel = interaction.options.getChannel('channel');
                switch (choice) {
                    case "banappeal": {
                        const banembed = new EmbedBuilder()
                            .setTitle('**Ban appeal**')
                            .setDescription('A ban appeal can be made in a <#708415348046692462> in the follow format:')
                            .setColor('#8a2be2')
                            .setFooter({ text: 'A unban is not guaranteed!' })
                            .addFields(
                                { name: '‎‎', value: 'Steam 64id (find it here: https://steamid.io/) -\nCharacter name -\nTribe name -\nMap banned on -\nReason for ban (if known) -\nWhy you should be unbanned -' });
                        channel.send({ embeds: [banembed] });
                        interaction.reply({ content: "Embed has been send", ephemeral: true });
                    }
                        break;
                    case "rules": {
                        const disembed = new EmbedBuilder()
                            .setTitle('**Rules**')
                            .setColor('#8a2be2')
                            .setDescription("Just like all other community servers there are rules that need be enforced. For both your and our safety. Also discord expect us as 'Community' that there guidelines are followed and enforced. So we would want to ask all of you to follow our rules the best you can. To improve everyones play experience and feeling safe in both the discord and in our ark servers. Thank you.")
                            .addFields(
                                { name: '**Ingame Rules: **', value: "Punishment for all rules will vary on a case to case basis. Any infraction could result in a ban / tribe wipe / warning, These are all at admin discretion. If you act like a piece of shit by thinking the rules don’t apply to you then you won’t last long here.\nOur ingame rules can be found on the website. (https://magicark.co.uk/) or by clicking [here](https://magicark.co.uk/rules/)" },
                                { name: '‎‎‏', value: "‎‎‏" },
                                { name: '**Discord Rules: **', value: "Taking part of this discord community we expect you to behave your self. We expect you to use common sense and to follow both Discord TOS and community guidelines. Constantly harrasing someone can result in to punishments. Punishments will always be at staffs discretion. Discord TOS & community guidelines can be found by the following links (https://discord.com/terms) (https://discord.com/guidelines)" },
                                { name: '‎‎‏', value: "‎‎‏" },
                                { name: '**Notes**', value: "Punishments can vary between cases. Constantly finding the edges of the rules can result in a punishments. Rule breaking reports, Cheating reports and questions within our servers will and can only be dealt with through our ticket system exclusively. If there are any problems regarding a admin. Please message 1 of the owners." }
                            );

                        channel.send({ embeds: [disembed] });
                        interaction.reply({ content: "Embed has been send", ephemeral: true });
                    }
                        break;
                    case "donation": {
                        const donembed = new EmbedBuilder()
                            .setTitle('**Donations**')
                            .setDescription('*All donations go directly towards server cost. \n We appreciate your help to make MagicArk possible!*\n**__Donations rewards:__**')
                            .setColor('#8a2be2')
                            .setTimestamp()
                            .addFields(
                                { name: '\u200B', value: "Donation prices are in euro's." },
                                { name: 'Bronze', value: '*Price: €10*\n*5.000 arc points*\n*VIP for in-game shop*\n*Donator role discord*', inline: true },
                                { name: 'Silver', value: '*Price: €20*\n*12.000 arc points*\n*VIP for in-game shop*\n*150 Points per hour*\n*Donator role discord*', inline: true },
                                { name: 'Gold', value: '*Price: €30*\n*26.000 arc points*\n*VIP for in-game shop*\n*200 Points per hour*\n*Donator role discord*', inline: true },
                                { name: 'Diamond', value: '*Price: €50*\n*65.000 arc points*\n*VIP for in-game shop*\n*300 Points per hour*\n*Donator role discord*', inline: true },
                                { name: 'Platinum', value: '*Price: €75*\n*100.000 arc points*\n*VIP for in-game shop*\n*400 Points per hour*\n*Donator role discord*\n*Additional 30 character levels', inline: true },
                                { name: '\u200B\u200B\u200B', value: '\u200B\u200B\u200B', inline: true },
                                { name: '\u200B', value: 'Donations are dealt with automaticly through our website. (https://magicark.co.uk/donate/)\nBeing a donator does not mean you are immume to our rules!\n' },
                                { name: '\u200B', value: 'We accept donation via paypal. If paypal is not a possibility for you, Contact <@338363146206969858> to discuss other options.' });
                        channel.send({ embeds: [donembed] });
                        interaction.reply({ content: "Embed has been send", ephemeral: true });
                    }
                        break;
                    case "modlist": {
                        const mods = new EmbedBuilder()
                            .setTitle('**Mods**')
                            .setDescription('List of the mods you will require to join our servers\n\nThis channel is still work in progress.')
                            .setColor('#8a2be2')
                            .addFields(
                                { name: '‎‎‏', value: 'You can download the mods by visiting the Mod page. [click here](https://steamcommunity.com/sharedfiles/filedetails/?id=2870396732) to go to the mod list directly.' },
                                { name: '‎‎‏', value: 'Server settings can be found on the magicark website [click here](https://magicark.co.uk/) to get to the website' })
                            .setImage('https://cdn.discordapp.com/attachments/426029113816514560/944290262551785592/magic_ark_750x537.png')
                        channel.send({ embeds: [mods] })
                        interaction.reply({ content: "Embed has been send", ephemeral: true });
                    }
                        break;
                }
            }
                break;
                case "wipe": {
                    const last = interaction.options.getString("last");
                    const upcoming = interaction.options.getString("upcoming")
                    const sqlQuery = `SELECT * FROM timer`
                    connection.query(sqlQuery, function (err, results) {
                        if (err) console.error(err)
                        let channelID = results[0].channelID
                        if (!channelID) interaction.reply({ content: "channelID not defined", ephemeral: true })
                        if (channelID) setWipeDate(channelID)
                    });
                    function setWipeDate(channelID) {
                        const sqlQuery = `UPDATE timer SET dateValue = ${JSON.stringify(upcoming)}, lastWipe = ${JSON.stringify(last)}, addedBy = ${JSON.stringify(interaction.user.id)} WHERE channelID = ${channelID}`
                        connection.query(sqlQuery, function (err, results) {
                            if (err) console.error(err)
                            if (!results) console.error("date not succesfully changed")
                            interaction.reply({ content: "Timer has been confirmed", ephemeral: true })
                        })
                    }
                }
                    break;
            case "ticket": {
                const { guild, channel } = interaction;
                const Buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("Ingame Help")
                        .setLabel("Ingame Help")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("Giveaway Winner")
                        .setLabel("Giveaway Winner")
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("Other")
                        .setLabel("Other")
                        .setStyle(ButtonStyle.Success),
                );
                const Embed = new EmbedBuilder()
                    .setAuthor({
                        name: guild.name + " | Ticketing System",
                        iconURL: guild.iconURL({ dynamic: true }),
                    })
                    .setDescription("You can choose between categories below. Press the button that fits your ticket the best.")
                    .setColor("#36393f");

                channel.send({ embeds: [Embed], components: [Buttons] });

                interaction.reply({ content: "Done", ephemeral: true });
            }
        }
    },
};
