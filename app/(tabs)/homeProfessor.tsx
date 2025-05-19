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
          style={[styles.button, styles.buttonBlue]}
          onPress={() => router.push('/fase')}
        >
          <Text style={styles.buttonText}>Jogar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonRed]}
          onPress={() => router.push('/ranks')}
        >
          <Text style={styles.buttonText}>Tabela de Ranks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA', // tom claro para fundo
    padding: 0,
    justifyContent: 'flex-start',
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
    fontSize: 35,
    fontWeight: 'bold',
    color: 'white', 
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
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 28,
    alignItems: 'center',
    elevation: 2,
  },
  buttonBlue: {
    backgroundColor: '#1976D2', // azul Poliedro
  },
  buttonRed: {
    backgroundColor: '#E53935', // vermelho Poliedro
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
  },
});