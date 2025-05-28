import { useSQLiteContext } from 'expo-sqlite';

export type RankingDatabase = {
  idRanking: number;
  Jogador_idJogador: number;
  nomeJogador: string;
  qntdPontos: number;
  qntdTempo: number;
};

export function useRankingDatabase() {
  const database = useSQLiteContext();

  // 🔥 Salvar ou atualizar o ranking
  async function saveOrUpdateRanking(data: {
    idJogador: number;
    nomeJogador: string;
    qntdPontos: number;
    qntdTempo: number;
  }) {
    try {
      const existing = await database.getFirstAsync<RankingDatabase>(
        'SELECT * FROM Ranking WHERE Jogador_idJogador = ?',
        [data.idJogador]
      );

      if (existing) {
        // Se tiver mais pontos ou mesmo pontos mas tempo menor, atualiza
        if (
          data.qntdPontos > existing.qntdPontos ||
          (data.qntdPontos === existing.qntdPontos && data.qntdTempo < existing.qntdTempo)
        ) {
          await database.runAsync(
            `UPDATE Ranking 
             SET nomeJogador = ?, qntdPontos = ?, qntdTempo = ? 
             WHERE Jogador_idJogador = ?`,
            [data.nomeJogador, data.qntdPontos, data.qntdTempo, data.idJogador]
          );
        }
      } else {
        // Se não existir, cria
        await database.runAsync(
          `INSERT INTO Ranking (nomeJogador, Jogador_idJogador, qntdPontos, qntdTempo) 
           VALUES (?, ?, ?, ?)`,
          [data.nomeJogador, data.idJogador, data.qntdPontos, data.qntdTempo]
        );
      }
    } catch (error) {
      console.error('❌ Erro ao salvar ou atualizar ranking:', error);
    }
  }

  // 🔥 Buscar ranking de um jogador pelo ID
  async function getRankingByJogadorId(idJogador: number) {
    try {
      const result = await database.getFirstAsync<RankingDatabase>(
        'SELECT * FROM Ranking WHERE Jogador_idJogador = ?',
        [idJogador]
      );
      return result;
    } catch (error) {
      console.error('❌ Erro ao buscar ranking:', error);
      return null;
    }
  }
  // 🔥 Buscar todos do ranking ordenados
    async function getAllRanking() {
    const query = `
    SELECT Ranking.*, Jogador.ra, Jogador.serie 
    FROM Ranking 
    INNER JOIN Jogador 
    ON Jogador.idJogador = Ranking.Jogador_idJogador
    ORDER BY qntdPontos DESC, qntdTempo ASC
  `;
  const result = await database.getAllAsync<any>(query);
  return result;
}


  return { saveOrUpdateRanking, getRankingByJogadorId, getAllRanking  };
}
