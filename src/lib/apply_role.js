function apply_role(discordID, client) {
    const guild = client.guilds.cache.get("551402765377601546");
    guild.members.fetch(discordID).then(member => {
        if (member.roles.cache.has("713490889938436147")) return
        if (!member.roles.cache.has("713490889938436147")) {
            try {
                member.roles.add("713490889938436147")
            } catch (error) {
                throw error;
            }
        }
    })
}
module.exports = { apply_role }