async function loadCommands(client) {
  const fs = require("fs");
  const { setTimeout } = require("timers/promises");
  let commandsArray = [];

  const commandsFolders = fs.readdirSync("./Commands");
  for (const folder of commandsFolders) {
    const commandFiles = fs
      .readdirSync(`./Commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const commandFile = require(`../Commands/${folder}/${file}`);

      client.commands.set(commandFile.data.name, commandFile);
      commandsArray.push(commandFile.data.toJSON());
      continue;
    }
  }
  client.application.commands.set(commandsArray);

  await setTimeout(2000)
  console.log('\x1b[32m%s\x1b[0m' ,'Commands Loaded');
}

module.exports = { loadCommands };