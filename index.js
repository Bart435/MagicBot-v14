const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, GuildMessageReactions } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, GuildMessageReactions],
  partials: [User, Message, GuildMember, ThreadMember],
});

client.commands = new Collection();
client.config = require("./config.json");

require("./Systems/GiveAwaySys")(client);

client.on("error", (err) => console.log(err));
process.on("unhandledRejection", (reason, p) => console.log(reason, p));
process.on("uncaughtException", (err, origin) => console.log(err, origin));
process.on("uncaughtExceptionMonitor", (err, origin) =>
  console.log(err, origin)
);
process.on("warning", (warn) => console.log(warn));

client
  .login(client.config.token)
  .then(() => {
    loadEvents(client);
    loadCommands(client);
  })
  .catch((err) => console.log(err));
