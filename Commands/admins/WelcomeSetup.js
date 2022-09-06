const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const DB = require("../../Schemas/WelcomeSetupDB");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcomesetup")
    .setDescription("Setup welcome channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option => option.setName('welcome').setDescription('Select the welcome channel').setRequired(true))
    .addChannelOption(option => option.setName('general').setDescription('Select the general channel').setRequired(true))
    .addChannelOption(option => option.setName('rules').setDescription('Select the rules channel').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Select the role to give upon joining').setRequired(true)),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { options, guild } = interaction;

    try {
      const WelcomeChannel = options.getChannel("welcome");
      const GeneralChannel = options.getChannel("general");
      const RulesChannel = options.getChannel("rules");
      const Role = options.getRole("role");

      await DB.findOneAndUpdate(
        { GuildID: guild.id },
        {
          WelcomeChannel: WelcomeChannel.id,
          GeneralChannel: GeneralChannel.id,
          RulesChannel: RulesChannel.id,
          Role: Role.id,
        },
        {
          new: true,
          upsert: true,
        }
      );

      const WelcomeSetup = new EmbedBuilder()
        .setDescription(
          "Successfully setup the welcome system"
        )
        .setColor("Green");

      await guild.channels.cache
        .get(WelcomeChannel.id)
        .send({ embeds: [WelcomeSetup] })
        .then((m) => {
          setTimeout(() => {
            m.delete().catch(() => { });
          }, 1 * 7500);
        });

      interaction.reply({
        content: "Done",
        ephemeral: true,
      });
    } catch (err) {
      const errEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(
          "An error occurred while setting up the welcome system"
        )
        .setDescription(`\`\`\`${err}\`\`\``);
      console.log(err);
      interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }
  },
};