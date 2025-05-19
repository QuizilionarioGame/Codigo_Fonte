import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

// Simulação de função para buscar dados do aluno no banco de dados
// Substitua por chamada real ao backend futuramente
const fetchAlunoStats = async (alunoId: string) => {
  // Exemplo de retorno simulado
  return {
    nome: 'João Silva',
    email:'123456@p4ed.com',
    ra: 123456,
    serie: '3º Ano',
    premioMaximo: 'R$ 1.000,00',
    tempoTotal: '12m 30s',
  };
};

export default function RankAluno() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Substitua '123456' pelo ID do aluno logado
    fetchAlunoStats('123456').then((dados) => {
      setStats(dados);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976D2" />
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
          <Text style={styles.value}>{stats.premioMaximo}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Melhor Tempo:</Text>
          <Text style={styles.value}>{stats.tempoTotal}</Text>
        </View>
      </View>
      <View style={styles.footerDecor}>
        <View style={[styles.circle, { backgroundColor: '#00BCD4', left: 30, bottom: 30 }]} />
        <View style={[styles.circle, { backgroundColor: '#FFD54F', right: 40, bottom: 60 }]} />
        <View style={[styles.circle, { backgroundColor: '#E53935', left: '45%', bottom: 10 }]} />
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
    backgroundColor: '#1976D2', // azul Poliedro
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0,
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
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '90%',
    elevation: 4,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
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
  footerDecor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    zIndex: -1,
  },
  circle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.18,
  },
});