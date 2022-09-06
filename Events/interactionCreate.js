const { CommandInteraction, InteractionType, codeBlock } = require("discord.js");
module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {CommandInteraction} interaction
   */
  execute(interaction, client) {
    const command = client.commands.get(interaction.commandName);
    const channel = client.channels.cache.get("964243527926186064");
    if (interaction.isChatInputCommand()) {
      if (!command) return interaction.reply({ content: "This command is outdated!" });

      command.execute(interaction, client);
      channel.send("```css\n"+ "[discord]" + ` ${interaction.user.username} - channel: ${interaction.channel.name} - Command: ${command.data.name}` + "```");
    }

    if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
      command.autocomplete(interaction, client);
    }
  },
};
