
const { SlashCommandBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { getGuildSettings, resetPermissions, createCategoriesAndChannels } = require('./utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetguilda')
        .setDescription('Reseta a configuração da guilda'),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const prisma = new PrismaClient();

        // Checa se o usuário tem permissão de admin
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply('Você não tem permissão para usar esse comando.');
        }

        // Reseta as permissões e categorias
        try {
            await prisma.guild.update({
                where: { id: guildId },
                data: { reset: true },
            });
            await resetPermissions(guildId);
            await createCategoriesAndChannels(guildId);

            interaction.reply('Guilda resetada com sucesso!');
        } catch (error) {
            console.error(error);
            interaction.reply('Ocorreu um erro ao resetar a guilda.');
        } finally {
            await prisma.$disconnect();
        }
    },
};
module.exports = resetGuilda; // se tiver uma função chamada resetGuilda
