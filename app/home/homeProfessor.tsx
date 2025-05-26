import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeProfessor() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />

      <View style={styles.header}>
        <Image
          source={require('@/assets/images/iconePoliedro.png')}
          style={styles.icon}
        />
        <Text style={styles.title}>Menu Professor</Text>
      </View>

      <View style={styles.menu}>

        
        <TouchableOpacity
          style={[styles.button, styles.buttonYellow]}
          onPress={() => router.push('/home/JogadorScreen')}
        >
          <Text style={styles.buttonTextBlack}>CRUD Jogadores</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonYellow]}
          onPress={() => router.push('/home/QuestoesScreen')}
        >
          <Text style={styles.buttonTextBlack}>CRUD Questões</Text>
        </TouchableOpacity>

        
        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          onPress={() => router.push('/home/fase')}
        >
          <Text style={styles.buttonText}>Jogar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonRed]}
          onPress={() => router.push('/rank/ranks')}
        >
          <Text style={styles.buttonText}>Tabela de Ranks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonYellow]}
          onPress={() => router.replace('/')} // 🔥 Agora volta para a tela de login
        >
          <Text style={styles.buttonTextBlack}>Sair</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 0,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingVertical: 25,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 15,
    elevation: 4,
    marginBottom: 25,
    paddingTop: 60,
  },
  icon: {
    width: 65,
    height: 65,
    marginRight: 10,
  },
  title: {
    fontSize: 30, // 🔥 Reduzido para caber melhor
    fontWeight: 'bold',
    color: 'white',
    flexShrink: 1, // 🔥 Faz o texto não estourar na linha
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  menu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 2,
  },
  buttonBlue: {
    backgroundColor: '#1976D2',
  },
  buttonRed: {
    backgroundColor: '#E53935',
  },
  buttonYellow: {
    backgroundColor: '#FFD166',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  buttonTextBlack: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
