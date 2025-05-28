import { useSQLiteContext } from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type JogadorDatabase = {
  idJogador: number;
  nomeJogador: string;
  ra: string;
  serie: number;
  emailAdmin: string | null;
  emailAluno: string | null;
  senhaJogador: string;
};

export async function getJogadorId(): Promise<number | null> {
  const id = await AsyncStorage.getItem('jogadorId');
  return id ? parseInt(id, 10) : null;
}

export function useJogadorDatabase() {
  const database = useSQLiteContext();

  // ✅ SALVAR LOGIN NA SESSÃO
  async function saveUserSession(email: string) {
    await AsyncStorage.setItem('userEmail', email);
  }

  // ✅ PEGAR JOGADOR ATUAL LOGADO
  async function getJogadorLogado() {
    const email = await AsyncStorage.getItem('userEmail');
    if (!email) return null;

    const result = await database.getFirstAsync<JogadorDatabase>(
      'SELECT * FROM Jogador WHERE emailAluno = ? OR emailAdmin = ?',
      [email, email]
    );
    return result;
  }

  

  // ✅ SAIR DA SESSÃO
  async function logout() {
    await AsyncStorage.removeItem('userEmail');
    
  }

  // ✅ LOGIN
  async function checkLogin(email: string, senha: string) {
    const query = `
      SELECT * FROM Jogador 
      WHERE (emailAdmin = ? OR emailAluno = ?) 
      AND senhaJogador = ?
    `;
    const result = await database.getFirstAsync<JogadorDatabase>(query, [email, email, senha]);
    if (result) {
      await saveUserSession(email);
    
    }
    return result;
  }

  // ✅ CREATE
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

  // ✅ GET ALL
  async function getAll() {
    try {
      const query = 'SELECT * FROM Jogador ORDER BY nomeJogador ASC';
      const response = await database.getAllAsync<JogadorDatabase>(query);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ✅ SEARCH BY NAME
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

  // ✅ SHOW (buscar por id)
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

  // ✅ UPDATE
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

  // ✅ DELETE
  async function remove(idJogador: number) {
    try {
      await database.execAsync(
        'DELETE FROM Jogador WHERE idJogador = ' + idJogador
      );
    } catch (error) {
      throw error;
    }
  }

  return {
    create,
    getAll,
    searchByName,
    update,
    remove,
    checkLogin,
    getJogadorLogado,
    saveUserSession,
    logout,
    show
  };
}
