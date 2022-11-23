const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const connection = require('../../db/sql');
const { get_steam } = require('../../lib/get_steam')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("checksteam")
        .setDescription("fetches data from steam")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addUserOption(option => option.setName('target').setDescription('Select a target fetch data from').setRequired(true)),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    execute(interaction) { 
        const target = interaction.options.getMember("target");
        connection.query(`SELECT * FROM kal.discordsteamlinks WHERE DiscordId = ${target.id}`, function(err, results){
            if(err) throw err;
            if (results <= 0) return interaction.reply({ content: "No data found", ephemeral: true })
            if (results[0].SteamId <= 0) return interaction.reply({ content: "User has not linked there discord to ark", ephemeral: true })
            let SteamId = `${results[0].SteamId}`
            get_steam(SteamId, interaction)
        });

    },
};