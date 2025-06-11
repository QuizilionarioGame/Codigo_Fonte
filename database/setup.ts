import { getDatabaseConnection } from './connection';

export const createTables = () => {
  const db = getDatabaseConnection();

  db.withTransactionSync(() => {
    db.execAsync(`

       DROP TABLE IF EXISTS Partida;
      DROP TABLE IF EXISTS Ranking;
      DROP TABLE IF EXISTS Questoes;
      DROP TABLE IF EXISTS Jogador;

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
        materia TEXT,
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

    db.getFirstAsync('SELECT COUNT(*) as total FROM Questoes').then((result) => {
    const { total } = result as { total: number };
    if (total === 0) {
        db.execAsync(`
              INSERT INTO Questoes (materia, dificuldade, pergunta, resposta1, resposta2, resposta3, resposta4, respostaCorreta) VALUES
('Português', 'Facil', 'Qual das palavras a seguir está escrita corretamente?', 'resgistro', 'resgistro', 'regístro', 'regitro', 'registro'),
('Português', 'Facil', 'Em qual frase há erro de concordância verbal?', 'Os alunos chegaram atrasados.', 'Os livros foram guardados.', 'Houve muitas reclamações.', 'Ocorre muitas reclamações.', 'Os dados foi analisado.'),
('Português', 'Facil', 'Qual alternativa apresenta um verbo no pretérito perfeito?', 'Comeria', 'Dormeria', 'Estudava', 'Estudaria', 'Estudei'),
('Português', 'Facil', 'Qual é o antônimo de “sincero”?', 'Amável', 'Bondoso', 'Verdadeiro', 'Inimigo', 'Falso'),

('Português', 'Medio', 'Assinale a oração subordinada adverbial causal:', 'Choveu muito, por isso não saí.', 'Nenhuma dessas opções.', 'Se chover, não saio.', 'Embora cansado, fui ao trabalho.', 'Como estava cansado, não fui à festa.'),
('Português', 'Medio', 'Na frase "Ele viu o livro que você comprou", o termo "que" é:', 'Pronome possessivo', 'Preposição', 'Pronome pessoal', 'Conjunção', 'Pronome relativo'),
('Português', 'Medio', 'Qual das opções contém uma figura de linguagem chamada “metáfora”?', 'A lua estava no céu.', 'Hoje viajei muito.', 'A casa era pequena.', 'Ele correu muito.', 'Seus olhos são duas estrelas.'),
('Português', 'Medio', 'Em qual alternativa há um erro de regência?', 'Assistimos ao filme.', 'Nenhuma dessas opções.', 'Cheguei a tempo.', 'Esqueci o livro em casa.', 'Preferimos viajar a descansar.'),

('Matemática', 'Facil', 'Quanto é 2 + 2?', '3', '7', '5', '6', '4'),
('Matemática', 'Facil', 'Qual é o dobro de 7?', '13', '10', '12', '9', '14'),
('Matemática', 'Facil', 'Qual é o valor de x em: x + 5 = 10?', '3', '4', '2', '6', '5'),
('Matemática', 'Facil', 'Quanto é 3 x 5?', '16', '8', '10', '12', '15'),

('Matemática', 'Medio', 'Qual é a raiz quadrada de 81?', '7', '8', '6', '10', '9'),
('Matemática', 'Medio', 'Se um triângulo tem lados 3, 4 e 5, ele é:', 'Equilátero', 'Isósceles', 'Escaleno', 'Quadrado', 'Retângulo'),
('Matemática', 'Medio', 'Quanto é 5² + 2²?', '25', '31', '28', '30', '29'),
('Matemática', 'Medio', 'Se a = 2 e b = 3, quanto é ab + b²?', '16', '14', '13', '12', '15'),

('Português', 'Dificil', 'Assinale a alternativa com um erro de colocação pronominal.', 'Mandou-se embora.', 'Emprestou-me o livro.', 'Deu-me o presente.', 'Mandou-me embora.', 'Me emprestou o livro.'),
('Português', 'Dificil', 'Qual das palavras abaixo é um advérbio?', 'Felizarde', 'Feliz', 'Felicidade', 'Rapidamente', 'Felizmente'),
('Português', 'Dificil', 'Qual é a função sintática de "que" na frase: "O livro que comprei é ótimo"?', 'Conjunção', 'Pronome demonstrativo', 'Pronome pessoal', 'Artigo', 'Pronome relativo'),
('Português', 'Dificil', 'O que caracteriza um texto dissertativo-argumentativo?', 'Uso de verbos no imperativo', 'Narrativa linear', 'Verbo com sujeito', 'Predomínio da descrição', 'Apresentação de opinião com argumentos'),

('Matemática', 'Dificil', 'Resolva: 2x² - 8x + 6 = 0. Qual o valor de x?', '1 e 4', '2 e 3', '1 e 2', '2 e 4', '1 e 3'),
('Matemática', 'Dificil', 'A função f(x) = 2x + 1 é crescente, decrescente ou constante?', 'Constante', 'Acelerado', 'Decrescente', 'Parabólica', 'Crescente'),
('Matemática', 'Dificil', 'A soma dos ângulos internos de um polígono de 10 lados é:', '1480°', '1620°', '1800°', '1080°', '1440°'),
('Matemática', 'Dificil', 'Qual o valor de log₂(8)?', '2', '5', '4', '1', '3');

            `);

        console.log('Questões iniciais inseridas.');
      } else {
        console.log('Questões já estão no banco.');
      }



    });

    db.getFirstAsync("SELECT COUNT(*) as total FROM Jogador WHERE emailAluno IS NOT NULL").then((result) => {
    const { total } = result as { total: number };
    if (total === 0) {
      db.execAsync(`
        INSERT INTO Jogador (nomeJogador, ra, serie, emailAluno, senhaJogador) VALUES
        ('Felipe', 'RA2001', 1, 'Felipe@p4ed.com', 'Felipe'),
        ('Gustavo', 'RA2002', 2, 'Gustavo@p4ed.com', 'Gustavo');
      `);
      console.log('Jogadores com emailAluno inseridos.');
    } else {
      console.log('Jogadores com emailAluno já existentes.');
    }
  });

db.getFirstAsync("SELECT COUNT(*) as total FROM Jogador WHERE emailAdmin IS NOT NULL").then((result) => {
    const { total } = result as { total: number };
    if (total === 0) {
      db.execAsync(`
        INSERT INTO Jogador (nomeJogador, ra, serie, emailAdmin, senhaJogador) VALUES
        ('Duarte', 'RA3001', 1, 'Duarte@sistemapoliedro.com.br', 'Duarte'),
        ('Renato', 'RA3002', 2, 'Renato@sistemapoliedro.com.br', 'Renato');
      `);
      console.log('Jogadores com emailAdmin inseridos.');
    } else {
      console.log('Jogadores com emailAdmin já existentes.');
    }
  });

});

  
};
