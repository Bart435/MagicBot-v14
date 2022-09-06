
const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionFlagsBits
} = require("discord.js");
const superagent = require("superagent");
module.exports = {
	data: new SlashCommandBuilder()
		.setName("8ball")
		.setDescription("Answers All Your Questions")
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
		.addStringOption(option =>
			option.setName('question')
				.setDescription('Ask The Question')
				.setRequired(true)
		),
	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		let {
			body
		} = await superagent
			.get(`https://nekos.life/api/v2/8ball`)

		const question = interaction.options.getString("question");

		if (question.length > 2000) return interaction.reply({
			embeds: [new MessageEmbed().setTitle("❌ Can't Run Code With The Strings Given ❌").setColor("RED").setDescription("Question Can't Be More Than 2000 Characters")],
			ephemeral: true
		});

		const Response = new EmbedBuilder()
			.setAuthor({
				name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL({
					dynamic: true,
					size: 512
				})
			})
			.setColor("#8a2be2")
			.setTimestamp()
			.setFields({ name: "Question", value: question })
			.setImage(body.url)

		interaction.reply({ embeds: [Response] });
	},
};