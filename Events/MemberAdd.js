const { EmbedBuilder, GuildMember } = require("discord.js");

const WelcomeSetupData = require("../Schemas/WelcomeSetupDB");

module.exports = {
    name: "guildMemberAdd",
    /**
     *
     * @param {GuildMember} member
     */
    async execute(member) {
        const { user, guild } = member;

        const Data = await WelcomeSetupData.findOne({ GuildID: guild.id });
        if (!Data) return;

        member.roles.add(`${Data.Role}`).catch((err) => {
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
                    value: `<#${Data.GeneralChannel}>`,
                    inline: true,
                },
                {
                    name: "Rules",
                    value: `<#${Data.RulesChannel}>`,
                    inline: true,
                }
            );

        await guild.channels.cache
            .get(Data.WelcomeChannel)
            .send({ embeds: [WelcomeEmbed] });
    },
};
