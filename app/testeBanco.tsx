import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function TesteBanco() {
  const database = useSQLiteContext();

  useEffect(() => {
    const verificarQuestoes = async () => {
      const faceis = await database.getAllAsync(
        'SELECT * FROM questoes WHERE dificuldade = ?', 
        ['facil']
      );
      const medias = await database.getAllAsync(
        'SELECT * FROM questoes WHERE dificuldade = ?', 
        ['medio']
      );
      const difíceis = await database.getAllAsync(
        'SELECT * FROM questoes WHERE dificuldade = ?', 
        ['dificil']
      );

      console.log(`🟢 Fáceis: ${faceis.length}`);
      console.log(`🟡 Médias: ${medias.length}`);
      console.log(`🔴 Difíceis: ${difíceis.length}`);
    };

    verificarQuestoes();
  }, []);

  return (
    <View>
      <Text>Veja no console o resultado da busca no banco.</Text>
    </View>
  );
}
