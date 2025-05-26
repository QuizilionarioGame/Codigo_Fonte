import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('meuBanco.db');

export const getDatabaseConnection = (): SQLite.SQLiteDatabase => {
  console.log('✅ Banco aberto em: meuBanco.db');
  return db;
};

// ✔️ Verifica se a conexão está ativa
export const testConnection = async (): Promise<boolean> => {
  const db = getDatabaseConnection();

  try {
    const result = await db.getFirstAsync<{ test: number }>('SELECT 1 as test;');
    console.log('📶 Banco conectado, resultado:', result);
    return true;
  } catch (error) {
    console.error('🚫 Erro na conexão com o banco:', error);
    return false;
  }
};

// ✔️ Testa quantas questões há no banco, por dificuldade
export const verificarQuestoesPorDificuldade = async () => {
  const db = getDatabaseConnection();

  try {
    const faceis = await db.getAllAsync('SELECT * FROM Questoes WHERE dificuldade = ?', ['Facil']);
    const medias = await db.getAllAsync('SELECT * FROM Questoes WHERE dificuldade = ?', ['Medio']);
    const dificeis = await db.getAllAsync('SELECT * FROM Questoes WHERE dificuldade = ?', ['Dificil']);

    console.log(`🟢 Fáceis: ${faceis.length}`);
    console.log(`🟡 Médias: ${medias.length}`);
    console.log(`🔴 Difíceis: ${dificeis.length}`);

    return {
      faceis: faceis.length,
      medias: medias.length,
      dificeis: dificeis.length,
    };
  } catch (error) {
    console.error('🚫 Erro ao verificar dados na tabela questoes:', error);
    return {
      faceis: 0,
      medias: 0,
      dificeis: 0,
    };
  }
};

// ✔️ Verifica se existem quaisquer questões no banco
export const verificarSeTemQuestoes = async (): Promise<boolean> => {
  const db = getDatabaseConnection();

  try {
    const result = await db.getFirstAsync<{ total: number }>(
      'SELECT COUNT(*) as total FROM questoes'
    );
    console.log('📊 Total de questões no banco:', result?.total);
    return (result?.total || 0) > 0;
  } catch (error) {
    console.error('🚫 Erro ao verificar dados na tabela questoes:', error);
    return false;
  }
};
