const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { getGuildSettings, resetPermissions, createCategoriesAndChannels } = require('../../utils'); // ajuste o caminho se necessário

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetguilda')
        .setDescription('Reseta a configuração da guilda')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // define a permissão mínima

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const prisma = new PrismaClient();

        // Check se o membro tem permissão (redundante, já que o SlashCommandBuilder já filtra)
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: '❌ Você não tem permissão para usar esse comando.',
                ephemeral: true,
            });
        }

        try {
            // Marca como resetado no banco de dados
            await prisma.guild.update({
                where: { id: guildId },
                data: { reset: true },
            });

            // Executa as funções de reset
            await resetPermissions(guildId);
            await createCategoriesAndChannels(guildId);

            await interaction.reply('✅ Guilda resetada com sucesso!');
        } catch (error) {
            console.error('Erro ao resetar guilda:', error);
            await interaction.reply('❌ Ocorreu um erro ao resetar a guilda.');
        } finally {
            await prisma.$disconnect();
        }
    },
};
