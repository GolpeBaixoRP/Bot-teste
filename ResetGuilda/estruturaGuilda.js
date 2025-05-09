export async function resetarGuilda(guild) {
  console.log('Limpando canais e cargos antigos...');

  // Apaga canais (menos o cargo do bot)
  const canais = await guild.channels.fetch();
  for (const canal of canais.values()) {
    try {
      await canal.delete();
    } catch (e) {
      console.warn(`Erro ao deletar canal ${canal.name}:`, e.message);
    }
  }

  // Apaga cargos (exceto @everyone e o do bot)
  const cargos = await guild.roles.fetch();
  for (const cargo of cargos.values()) {
    if (cargo.name !== '@everyone' && !cargo.managed) {
      try {
        await cargo.delete();
      } catch (e) {
        console.warn(`Erro ao deletar cargo ${cargo.name}:`, e.message);
      }
    }
  }

  console.log('Criando estrutura...');

  const categoriasInfo = [
    { nome: 'Administração', canaisTexto: ['📋・regras', '📢・anúncios'] },
    { nome: 'Geral', canaisTexto: ['💬・geral', '🤖・comandos'] },
    { nome: 'Suporte', canaisTexto: ['🎫・abrir-ticket'] }
  ];

  for (const categoria of categoriasInfo) {
    const cat = await guild.channels.create({
      name: categoria.nome,
      type: 4
    });

    for (const nomeCanal of categoria.canaisTexto) {
      await guild.channels.create({
        name: nomeCanal,
        type: 0,
        parent: cat.id
      });
    }
  }

  const cargosInfo = ['👑 Fundador', '🔧 Staff', '👥 Membro'];
  for (const nome of cargosInfo) {
    await guild.roles.create({ name: nome });
  }

  console.log('Estrutura recriada com sucesso!');
}
