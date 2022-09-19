const { EmbedBuilder, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     *
     * @param {GuildMember} member
     */
    async execute(member) {
        const { user, guild } = member;

        member.roles.add('956624675511881808').catch((err) => {
            console.log(err);
        });

        const WelcomeEmbed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: `${user.tag}`,
                iconURL: user.displayAvatarURL({
                    dynamic: true,
                }),
            })
            .setThumbnail(
                user.displayAvatarURL({
                    dynamic: true,
                    size: 512,
                })
            )
            .setDescription(
                `
        **Welcome** ${member} to **${guild.name}**!\n
        **Account Created**: <t:${parseInt(user.createdTimestamp / 1000)}:R>\n
		**Account ID**: || ${user.id} || \n
        **Latest Member Count**: \`${guild.memberCount}\``
            )
            .addFields(
                {
                    name: "General",
                    value: `<#551402765377601548>`,
                    inline: true,
                },
                {
                    name: "Rules",
                    value: `<#558062972895756308>`,
                    inline: true,
                }
            );

        await guild.channels.cache
            .get("594936318342201359")
            .send({ embeds: [WelcomeEmbed] });
    },
};
