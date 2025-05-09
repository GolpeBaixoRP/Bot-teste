
const { PermissionsBitField } = require('discord.js');

async function resetPermissions(guildId) {
    const guild = await client.guilds.fetch(guildId);
    const roles = guild.roles.cache;

    // Resetando as permissões
    roles.forEach(role => {
        role.setPermissions(PermissionsBitField.Flags.SendMessages);
    });
}

async function createCategoriesAndChannels(guildId) {
    const guild = await client.guilds.fetch(guildId);

    // Criando as categorias e canais de texto
    const category = await guild.channels.create({
        name: 'Tickets',
        type: 'GUILD_CATEGORY',
    });

    await guild.channels.create({
        name: 'geral',
        type: 'GUILD_TEXT',
        parent: category.id,
    });

    await guild.channels.create({
        name: 'suporte',
        type: 'GUILD_TEXT',
        parent: category.id,
    });
}

module.exports = { resetPermissions, createCategoriesAndChannels };
