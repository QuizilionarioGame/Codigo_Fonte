import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';

const mockData = [
  { nome: 'João Silva', ra: '123456', mp: 99, serie: '3º Ano' },
  { nome: 'Maria Oliveira', ra: '654321', mp: 88, serie: '2º Ano' },
  { nome: 'Carlos Santos', ra: '789012', mp: 92, serie: '3º Ano' },
  { nome: 'Ana Costa', ra: '345678', mp: 85, serie: '1º Ano' },
];

export default function RanksScreen() {
  const [alunos, setAlunos] = useState<{ nome: string; ra: string; mp: number; serie: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [...mockData].sort((a, b) => b.mp - a.mp);
        setAlunos(data);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View
      style={[
        styles.rankItem,
        { backgroundColor: index % 2 === 0 ? '#F1FAFB' : '#F5F5F5' } // alterna azul claro e vermelho claro
      ]}
    >
      <Text style={styles.rankPosition}>{index + 1}º</Text>
      <View style={styles.rankDetails}>
        <Text style={styles.rankName}>{item.nome}</Text>
        <Text style={styles.rankInfo}>RA: {item.ra}</Text>
        <Text style={styles.rankInfo}>Série: {item.serie}</Text>
      </View>
      <Text style={styles.rankScore}>{item.mp} pts</Text>
    </View>
  );

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
        keyExtractor={(item) => item.ra}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
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
  },
  icon: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white', 
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  listContainer: {
    padding: 0,
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
    marginLeft: 20,
    marginRight: 20,
  },
  rankPosition: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD166', 
    marginRight: 18,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  rankDetails: {
    flex: 1,
  },
  rankName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#073B4C', // azul escuro
  },
  rankInfo: {
    fontSize: 14,
    color: '#118AB2', // azul Poliedro mais escuro
  },
  rankScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#06D6A0', // verde Poliedro
  },
});