const { Client } = require("discord.js");
const mongoose = require("mongoose");
const { Database, CrossDB } = require("../config.json");
const mysql = require('mysql');
const CrossChatDB = mysql.createConnection({
    host: CrossDB.host,
    user: CrossDB.user,
    password: CrossDB.password,
    database: CrossDB.database
});
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Client is now logged in as ${client.user.username}`);

    client.user.setPresence({ activities: [{ name: "https://magicark.co.uk/" }] });
    if (!Database) return;
    mongoose.connect(Database, {
      useNewUrlParser: true,
      UseUnifiedTopology: true
    }).then(() => {
      console.log("Connected to mongo")
    }).catch((err) => {
      console.log(err)
    });
    CrossChatDB.connect(function (err) {
      if (err) throw err;
      console.log("connected to mysql");
  });
  },
};
