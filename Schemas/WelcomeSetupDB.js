const { model, Schema } = require("mongoose");

module.exports = model(
  "WelcomeSetup",
  new Schema({
    GuildID: String,
    WelcomeChannel: String,
    GeneralChannel: String,
    RulesChannel: String,
    Role: String,
    Description: String,
  })
);
