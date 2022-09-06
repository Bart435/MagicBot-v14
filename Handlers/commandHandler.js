function loadCommands(client) {
  const fs = require("fs");

  let commandsArray = [];
  let developerArray = [];

  const commandsFolders = fs.readdirSync("./Commands");
  for (const folder of commandsFolders) {
    const commandFiles = fs
      .readdirSync(`./Commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const commandFile = require(`../Commands/${folder}/${file}`);

      client.commands.set(commandFile.data.name, commandFile);

      if (commandFile.developer) developerArray.push(commandFile.data.toJSON());
      else commandsArray.push(commandFile.data.toJSON());
      continue;
    }
  }
  client.application.commands.set(commandsArray);

  const developerGuild = client.guilds.cache.get(client.config.developerGuild);

  developerGuild.commands.set(developerArray);
}

module.exports = { loadCommands };
