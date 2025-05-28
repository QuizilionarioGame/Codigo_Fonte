import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { createTables } from '../database/setup';
import { verificarQuestoesPorDificuldade, testConnection, verificarSeTemQuestoes } from '@/database/testConnection';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export default function Layout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const prepararBanco = async () => {
      const dbDir = FileSystem.documentDirectory + 'SQLite';
      const dbPath = dbDir + '/meuBanco.db';

      // Cria a pasta SQLite se não existir
      const dirInfo = await FileSystem.getInfoAsync(dbDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
      }

      // Verifica se o banco já existe no dispositivo
      const fileInfo = await FileSystem.getInfoAsync(dbPath);
      if (!fileInfo.exists) {
        try {
          const asset = Asset.fromModule(require('../assets/meuBanco.db'));
          await asset.downloadAsync();

          await FileSystem.copyAsync({
            from: asset.localUri!,
            to: dbPath,
          });

          console.log('✅ Banco copiado dos assets');
        } catch (error) {
          console.warn('⚠️ Nenhum banco encontrado nos assets. Será criado um novo banco vazio.');
        }
      } else {
        console.log('✅ Banco já existe no dispositivo');
      }

      // Cria as tabelas caso não existam
      await createTables();

      // Testes e logs
      const conectado = await testConnection();
      console.log('🟢 Banco conectado?', conectado);

      const temQuestoes = await verificarSeTemQuestoes();
      console.log('📋 Existem questões no banco?', temQuestoes);

      const porDificuldade = await verificarQuestoesPorDificuldade();
      console.log('📊 Dados detalhados:', porDificuldade);

      setDbReady(true);
    };

    prepararBanco();
  }, []);

  if (!dbReady) {
    return null; // 🔥 Aqui você pode retornar uma tela de loading se quiser
  }

  return (
    <SQLiteProvider databaseName="meuBanco.db">
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}
