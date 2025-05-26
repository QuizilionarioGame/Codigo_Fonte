import { useSQLiteContext } from 'expo-sqlite';

export type QuestoesDatabase = {
  idQuestoes: number;
  materia: number;
  dificuldade: 'facil' | 'medio' | 'dificil';
  pergunta: string;
  resposta1: string;
  resposta2: string;
  resposta3: string;
  resposta4: string;
  respostaCorreta: string;
};

export function useQuestoesDatabase() {
  const database = useSQLiteContext();

  // CREATE
  async function create(data: Omit<QuestoesDatabase, 'idQuestoes'>) {
    const statement = await database.prepareAsync(
      `INSERT INTO Questoes 
      (materia, dificuldade, pergunta, resposta1, resposta2, resposta3, resposta4, respostaCorreta) 
      VALUES ($materia, $dificuldade, $pergunta, $resposta1, $resposta2, $resposta3, $resposta4, $respostaCorreta)`
    );

    try {
      const result = await statement.executeAsync({
        $materia: data.materia,
        $dificuldade: data.dificuldade,
        $pergunta: data.pergunta,
        $resposta1: data.resposta1,
        $resposta2: data.resposta2,
        $resposta3: data.resposta3,
        $resposta4: data.resposta4,
        $respostaCorreta: data.respostaCorreta,
      });

      const insertedRowId = result.lastInsertRowId;
      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  // READ - Buscar todas as questões
  async function getAll() {
    try {
      const query = 'SELECT * FROM Questoes';

      const response = await database.getAllAsync<QuestoesDatabase>(query);

      return response;
    } catch (error) {
      throw error;
    }
  }

  // READ - Buscar por ID
  async function show(idQuestoes: number) {
    try {
      const query = 'SELECT * FROM Questoes WHERE idQuestoes = ?';

      const response = await database.getFirstAsync<QuestoesDatabase>(query, [
        idQuestoes,
      ]);

      return response;
    } catch (error) {
      throw error;
    }
  }

  // UPDATE
  async function update(data: QuestoesDatabase) {
    const statement = await database.prepareAsync(
      `UPDATE Questoes 
      SET materia = $materia, 
          dificuldade = $dificuldade, 
          pergunta = $pergunta, 
          resposta1 = $resposta1, 
          resposta2 = $resposta2, 
          resposta3 = $resposta3, 
          resposta4 = $resposta4, 
          respostaCorreta = $respostaCorreta 
      WHERE idQuestoes = $idQuestoes`
    );

    try {
      await statement.executeAsync({
        $idQuestoes: data.idQuestoes,
        $materia: data.materia,
        $dificuldade: data.dificuldade,
        $pergunta: data.pergunta,
        $resposta1: data.resposta1,
        $resposta2: data.resposta2,
        $resposta3: data.resposta3,
        $resposta4: data.resposta4,
        $respostaCorreta: data.respostaCorreta,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  // DELETE
  async function remove(idQuestoes: number) {
    try {
      await database.execAsync(
        'DELETE FROM Questoes WHERE idQuestoes = ' + idQuestoes
      );
    } catch (error) {
      throw error;
    }
  }
  
   async function getQuestoesPorDificuldade(dificuldade: string) {
    const query = `
      SELECT * FROM Questoes
      WHERE dificuldade = ?
      ORDER BY RANDOM()
      LIMIT 4
    `;
    const result = await database.getAllAsync<QuestoesDatabase>(query, [dificuldade]);
    return result;
  }


  return { create, getAll, show, update, remove, getQuestoesPorDificuldade  };
}
