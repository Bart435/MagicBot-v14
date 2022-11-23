const { EmbedBuilder, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     *
     * @param {GuildMember} member
     */
    async execute(member) {
        const { user, guild } = member;
        const channel = member.guild.channels.cache.get("594936318342201359")
        member.roles.add('956624675511881808').catch((err) => {
            console.log(err);
        });

        const WelcomeEmbed = new EmbedBuilder().setColor("#8a2be2")
            .setAuthor({name: `${user.tag}`, iconURL: user.displayAvatarURL({dynamic: true})})
            .setThumbnail(user.displayAvatarURL({dynamic: true, size: 512}))
            .setDescription(`
                **Welcome** ${member} to **${guild.name}**!\n
                **Account Created**: <t:${parseInt(user.createdTimestamp / 1000)}:R>\n
		        **Account ID**: || ${user.id} || \n
                **Latest Member Count**: \`${guild.memberCount}\``
            )

        channel.send({ embeds: [WelcomeEmbed] });
    },
};
