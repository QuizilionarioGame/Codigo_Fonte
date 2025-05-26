import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect } from 'react';
import { createTables } from '../database/setup';
import { verificarQuestoesPorDificuldade,testConnection, verificarSeTemQuestoes } from '@/database/testConnection';


export default function Layout() {
  useEffect(() => {
    
    const testar = async () => {
      const conectado = await testConnection();
      console.log('🟢 Banco conectado?', conectado);

      const temQuestoes = await verificarSeTemQuestoes();
      console.log('📋 Existem questões no banco?', temQuestoes);

      const porDificuldade = await verificarQuestoesPorDificuldade();
      console.log('📊 Dados detalhados:', porDificuldade);
    };

    testar();
  }, []);



  return (
    <SQLiteProvider databaseName="meuBanco.db">
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}
