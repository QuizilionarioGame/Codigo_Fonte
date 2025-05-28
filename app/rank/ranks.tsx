import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, ActivityIndicator, Alert, Button } from 'react-native';
import { useRankingDatabase } from '@/database/rankingService';
import { router } from 'expo-router';

export default function RanksScreen() {
  const { getAllRanking } = useRankingDatabase();
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarRanking();
  }, []);

  const carregarRanking = async () => {
    try {
      const dados = await getAllRanking();
      if (dados.length === 0) {
        Alert.alert('Aviso', 'Não há dados de ranking no momento.');
      }
      setAlunos(dados);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
      Alert.alert('Erro', 'Falha ao carregar ranking.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View
      style={[
        styles.rankItem,
        { backgroundColor: index % 2 === 0 ? '#F1FAFB' : '#F5F5F5' }
      ]}
    >
      <Text style={styles.rankPosition}>{index + 1}º</Text>
      <View style={styles.rankDetails}>
        <Text style={styles.rankName}>{item.nomeJogador}</Text>
        <Text style={styles.rankInfo}>RA: {item.ra}</Text>
        <Text style={styles.rankInfo}>Série: {item.serie}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.rankScore}>{item.qntdPontos} pts</Text>
        <Text style={styles.rankTempo}>{item.qntdTempo} seg</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/iconePoliedro.png')}
          style={styles.icon}
        />
        <Text style={styles.title}>Ranking dos Alunos</Text>
      </View>
      <FlatList
        data={alunos}
        keyExtractor={(item) => String(item.Jogador_idJogador)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        onEndReachedThreshold={0.5}
      />
      <View style={{ marginTop: 20 }}>
                    <Button title="Voltar" onPress={() => router.back()} />
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 15,
    elevation: 4,
    marginBottom: 40,
    paddingTop: 60,
  },
  icon: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    borderLeftWidth: 8,
    borderLeftColor: '#00B4D8',
    marginHorizontal: 20,
  },
  rankPosition: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD166',
    marginRight: 18,
  },
  rankDetails: {
    flex: 1,
  },
  rankName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#073B4C',
  },
  rankInfo: {
    fontSize: 14,
    color: '#118AB2',
  },
  rankScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#06D6A0',
  },
  rankTempo: {
    fontSize: 13,
    color: '#EF476F',
  },
});
