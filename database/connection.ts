import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('meuBanco.db');

export const getDatabaseConnection = (): SQLite.SQLiteDatabase => {
  console.log('✅ Banco aberto em: meuBanco.db');
  return db;
};
