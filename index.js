const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages, GuildMessageReactions } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, GuildMessageReactions],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./src/lib/eventhandler");
const { loadCommands } = require("./src/lib/commandhandler");

client.commands = new Collection();
client.config = require("./config.json");

require("./src/Systems/GiveAwaySys")(client);
    
client.on("error", (err) => console.log(err));
process.on("unhandledRejection", (reason, p) => console.log(reason, p));
process.on("uncaughtException", (err, origin) => console.log(err, origin));
process.on("uncaughtExceptionMonitor", (err, origin) =>console.log(err, origin));
process.on("warning", (warn) => console.log(warn));

client.login(client.config.token)
  .then(async () => {
    loadEvents(client);
    loadCommands(client);
  }).catch((err) => console.log(err));