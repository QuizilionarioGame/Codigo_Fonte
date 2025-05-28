import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRankingDatabase } from '@/database/rankingService';
import { useJogadorDatabase } from '@/database/jogadorService';
import { useRouter } from 'expo-router';

export default function RankAluno() {
  const { getRankingByJogadorId } = useRankingDatabase();
  const { show } = useJogadorDatabase();
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const jogadorId = await AsyncStorage.getItem('jogadorId');

      if (!jogadorId) {
        Alert.alert('Erro', 'Não foi possível identificar o aluno logado.');
        router.replace('/'); // Redireciona para login
        return;
      }

      const id = Number(jogadorId);
      const jogador = await show(id);
      const ranking = await getRankingByJogadorId(id);

      if (!jogador) {
        Alert.alert('Erro', 'Jogador não encontrado.');
        setLoading(false);
        return;
      }

      if (!ranking) {
        Alert.alert('Aviso', 'Nenhuma estatística encontrada para este aluno.');
        setStats({
          nome: jogador.nomeJogador,
          ra: jogador.ra,
          serie: jogador.serie,
          melhorPremio: 0,
          melhorTempo: 0,
        });
        setLoading(false);
        return;
      }

      setStats({
        nome: jogador.nomeJogador,
        ra: jogador.ra,
        serie: jogador.serie,
        melhorPremio: ranking.qntdPontos,
        melhorTempo: ranking.qntdTempo,
      });

      setLoading(false);
    } catch (error) {
      console.log('Erro ao buscar estatísticas:', error);
      Alert.alert('Erro', 'Falha ao carregar estatísticas.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: '#333' }}>Nenhum dado encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/iconePoliedro.png')}
          style={styles.icon}
        />
        <Text style={styles.title}>Estatísticas do Aluno</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{stats.nome}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>RA:</Text>
          <Text style={styles.value}>{stats.ra}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Série:</Text>
          <Text style={styles.value}>{stats.serie}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Melhor Prêmio:</Text>
          <Text style={styles.value}>R$ {stats.melhorPremio}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Melhor Tempo:</Text>
          <Text style={styles.value}>{stats.melhorTempo} segundos</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: '#F5F6FA',
    flexGrow: 1,
    alignItems: 'center',
    minHeight: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
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
    width: '100%',
  },
  icon: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: 'white',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '90%',
    elevation: 4,
    marginBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderLeftWidth: 5,
    borderLeftColor: '#00B4D8',
    paddingLeft: 10,
    backgroundColor: '#F1FAFB',
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 38,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 17,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 17,
    color: '#073B4C',
    fontWeight: '600',
  },
});
