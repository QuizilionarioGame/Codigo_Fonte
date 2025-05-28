import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ExportarBanco() {
  const handleExport = async () => {
    const dbName = 'meuBanco.db';
    const dbPath = FileSystem.documentDirectory + 'SQLite/' + dbName;

    const fileInfo = await FileSystem.getInfoAsync(dbPath);

    if (fileInfo.exists) {
      try {
        await Sharing.shareAsync(dbPath);
        console.log('✅ Banco exportado com sucesso!');
      } catch (error) {
        console.error('Erro ao exportar:', error);
      }
    } else {
      Alert.alert('Erro', '❌ Banco não encontrado no dispositivo.');
      console.log('❌ Banco não encontrado em:', dbPath);
    }
  };

  return (
    <View style={{ marginTop: 100 }}>
      <Button title="📤 Exportar Banco" onPress={handleExport} />
    </View>
  );
}
