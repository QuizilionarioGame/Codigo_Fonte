import { getDatabaseConnection } from './connection';

export const createTables = () => {
  const db = getDatabaseConnection();

  db.withTransactionSync(() => {
    db.execAsync(`
      CREATE TABLE IF NOT EXISTS Jogador (
        idJogador INTEGER PRIMARY KEY AUTOINCREMENT,
        nomeJogador TEXT UNIQUE NOT NULL,
        ra TEXT UNIQUE NOT NULL,
        serie INTEGER,
        emailAdmin TEXT,
        emailAluno TEXT,
        senhaJogador TEXT NOT NULL,
        CHECK (LENGTH(nomeJogador) >= 6),
        CHECK (LENGTH(senhaJogador) >= 6)
      );

      CREATE TABLE IF NOT EXISTS Ranking (
        idRanking INTEGER PRIMARY KEY AUTOINCREMENT,
        Jogador_idJogador INTEGER,
        nomeJogador TEXT,
        qntdPontos REAL,
        qntdTempo REAL,
        FOREIGN KEY (Jogador_idJogador) REFERENCES Jogador(idJogador)
      );

      CREATE TABLE IF NOT EXISTS Questoes (
        idQuestoes INTEGER PRIMARY KEY AUTOINCREMENT,
        materia INTEGER,
        dificuldade TEXT,
        pergunta TEXT,
        resposta1 TEXT,
        resposta2 TEXT,
        resposta3 TEXT,
        resposta4 TEXT,
        respostaCorreta TEXT
      );

      CREATE TABLE IF NOT EXISTS Partida (
        idPartida INTEGER PRIMARY KEY AUTOINCREMENT,
        jogador_idJogador INTEGER,
        idQuestoes INTEGER,
        FOREIGN KEY (jogador_idJogador) REFERENCES Jogador(idJogador),
        FOREIGN KEY (idQuestoes) REFERENCES Questoes(idQuestoes)
      );
    `);
  });

  
};
