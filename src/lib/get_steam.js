const { EmbedBuilder } = require("discord.js");
const fetch = require('node-fetch');
const { steamapi_key } = require('../../config.json');

async function get_steam(SteamId, interaction) {
    try {
            try {
                const links = {
                    steamUser: "http://api.steampowered.com/ISteamUser",
                    playerService: "http://api.steampowered.com/IPlayerService"
                }
                const getPlayer = await fetch(`${links.steamUser}/GetPlayerSummaries/v0002/?key=${steamapi_key}&steamids=${SteamId}`).then(res => res.json()).then(json => json['response']);
                const getOwned = await fetch(`${links.playerService}/GetOwnedGames/v0001/?key=${steamapi_key}&steamid=${SteamId}&format=json`).then(res => res.json()).then(json => json['response']);
                const getFriends = await fetch(`${links.steamUser}/GetFriendList/v0001/?key=${steamapi_key}&steamid=${SteamId}&relationship=friend`).then(res => res.json()).then(json => json);
                const getbans = await fetch(`${links.steamUser}/GetPlayerBans/v0001/?key=${steamapi_key}&steamids=${SteamId}`).then(res => res.json()).then(json => json['players']['0']);
                const badges = await fetch(`${links.playerService}/GetBadges/v0001/?key=${steamapi_key}&steamid=${SteamId}&format=json`).then(res => res.json()).then(json => json['response']);

                const a = getPlayer['players']['0']['timecreated'] * 1000;
                const format = {
                    day: 'numeric',
                    month: '2-digit',
                    year: 'numeric',
                  };

                const account = {
                    Status: 'Private',
                    timeCreated: 'Private',
                    gameCount: 'Private',
                    totalFriends: 'Private',
                    country: 'Private/Not selected',
                    gameInfo: 'Private/Not playing',
                    steamLevel: 'Private',
                    steamXp: 'Private',
                    levelProgression: 'Private',
                    steamBadges: 'Private'
                }

                const personastate = ['offline','online', 'busy', 'away','snooze', 'looking to trade','looking to play']
                account.Status = personastate[getPlayer['players']['0']['personastate']] !== undefined ? personastate[getPlayer['players']['0']['personastate']] : 0
               
                if (getPlayer['players']['0']['timecreated']) account.timeCreated = new Date(a).toLocaleString('en-gb', format);
                if (getOwned['game_count']) account.gameCount = getOwned['game_count'];
                if (getFriends['friendslist']) account.totalFriends = getFriends['friendslist']['friends'].length;
                if (getPlayer['players']['0']['loccountrycode']) account.country = getPlayer['players']['0']['loccountrycode'];
                if (getPlayer['players']['0']['gameextrainfo']) account.gameInfo = getPlayer['players']['0']['gameextrainfo'];
                if (badges['player_xp']) {
                    const currentXp = badges['player_xp'] - badges['player_xp_needed_current_level'];
                    account.steamBadges = badges['badges'].length;
                    account.steamXp = badges['player_xp'];
                    account.steamLevel = badges['player_level'];
                    account.levelProgression = `${currentXp} / ${badges['player_xp_needed_to_level_up']}`;
                }

                const succesEmbed = new EmbedBuilder()
                    .setTitle(`${getPlayer['players']['0']['personaname']}'s steam stats`)
                    .addFields({ name: 'Status', value: `${account.Status}`, inline: true })
                    .addFields({ name: 'Account created', value: `${account.timeCreated}`, inline: true })
                    .addFields({ name: 'Friends', value: `${account.totalFriends}`, inline: true })
                    .addFields({ name: 'Owned games', value: `${account.gameCount}`, inline: true })
                    .addFields({ name: 'Country', value: `${account.country}` || 'Not Selected', inline: true })
                    .addFields({ name: 'Badges', value: `${account.steamBadges}`, inline: true })
                    .addFields({ name: 'VAC bans', value: `${getbans['NumberOfVACBans']}`, inline: true })
                    .addFields({ name: 'Game bans', value: `${getbans['NumberOfGameBans']}`, inline: true })
                    .addFields({ name: 'Economy bans', value: `${getbans['EconomyBan']}`, inline: true })
                    .addFields({ name: 'Steam Level', value: `${account.steamLevel}`, inline: true })
                    .addFields({ name: 'Steam XP', value: `${account.steamXp}`, inline: true })
                    .addFields({ name: 'Level Progression', value: `${account.levelProgression}`, inline: true })
                    .addFields({ name: 'Current Playing', value: `${account.gameInfo}`, inline: true })
                    .setThumbnail(getPlayer['players']['0']['avatarfull'])
                    .setURL(getPlayer['players']['0']['profileurl'])
                    .setColor("Green")
                    .setFooter({ text: `Fetched from steam api || ${getPlayer['players']['0']['steamid']}` });
                interaction.reply({ embeds: [succesEmbed] });
            }
            catch (e) {
                console.log(e);
                interaction.reply({ content: 'could not fetch this steam user', ephemeral: true });
            }

    } catch (error) {
    throw error
    }
}
module.exports = { get_steam }