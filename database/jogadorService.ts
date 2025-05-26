import { useSQLiteContext } from 'expo-sqlite';

export type JogadorDatabase = {
  idJogador: number;
  nomeJogador: string;
  ra: string;
  serie: number;
  emailAdmin: string | null;
  emailAluno: string | null;
  senhaJogador: string;
};

export function useJogadorDatabase() {
  const database = useSQLiteContext();

  
  // CREATE
  async function create(data: Omit<JogadorDatabase, 'idJogador'>) {
    const statement = await database.prepareAsync(
      `INSERT INTO Jogador 
      (nomeJogador, ra, serie, emailAdmin, emailAluno, senhaJogador) 
      VALUES ($nomeJogador, $ra, $serie, $emailAdmin, $emailAluno, $senhaJogador)`
    );

    try {
      const result = await statement.executeAsync({
        $nomeJogador: data.nomeJogador,
        $ra: data.ra,
        $serie: data.serie,
        $emailAdmin: data.emailAdmin,
        $emailAluno: data.emailAluno,
        $senhaJogador: data.senhaJogador,
      });

      return { insertedRowId: result.lastInsertRowId };
    } catch (error) {
      console.log('Erro ao criar jogador:', error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  // GET ALL
  async function getAll() {
    try {
      const query = 'SELECT * FROM Jogador ORDER BY nomeJogador ASC';
      const response = await database.getAllAsync<JogadorDatabase>(query);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // SEARCH by name (contém letras digitadas)
  async function searchByName(nome: string) {
    try {
      const query =
        'SELECT * FROM Jogador WHERE nomeJogador LIKE ? ORDER BY nomeJogador ASC';
      const response = await database.getAllAsync<JogadorDatabase>(
        query,
        `%${nome}%`
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  // SHOW (buscar por id)
  async function show(idJogador: number) {
    try {
      const query = 'SELECT * FROM Jogador WHERE idJogador = ?';
      const response = await database.getFirstAsync<JogadorDatabase>(query, [
        idJogador,
      ]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // UPDATE
  async function update(data: JogadorDatabase) {
    const statement = await database.prepareAsync(
      `UPDATE Jogador 
      SET nomeJogador = $nomeJogador, 
          ra = $ra, 
          serie = $serie, 
          emailAdmin = $emailAdmin, 
          emailAluno = $emailAluno, 
          senhaJogador = $senhaJogador 
      WHERE idJogador = $idJogador`
    );

    try {
      await statement.executeAsync({
        $idJogador: data.idJogador,
        $nomeJogador: data.nomeJogador,
        $ra: data.ra,
        $serie: data.serie,
        $emailAdmin: data.emailAdmin,
        $emailAluno: data.emailAluno,
        $senhaJogador: data.senhaJogador,
      });
    } catch (error) {
      console.log('Erro ao atualizar jogador:', error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  // DELETE
  async function remove(idJogador: number) {
    try {
      await database.execAsync(
        'DELETE FROM Jogador WHERE idJogador = ' + idJogador
      );
    } catch (error) {
      throw error;
    }
  }
  // Função de login
  async function checkLogin(email: string, senha: string) {
    const query = `
      SELECT * FROM Jogador 
      WHERE (emailAdmin = ? OR emailAluno = ?) 
      AND senhaJogador = ?
    `;

    const result = await database.getFirstAsync(query, [email, email, senha]);

    return result; 
  }


  return { create, getAll, searchByName, update, remove, checkLogin, show };
}
