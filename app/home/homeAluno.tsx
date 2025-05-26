import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeAluno() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />

      {/* 🔷 Header */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/iconePoliedro.png')}
          style={styles.icon}
        />
        <Text style={styles.title}>Menu Aluno</Text>
      </View>

      {/* 🔷 Menu */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.button, styles.buttonBlue]}
          onPress={() => router.push('/home/fase')}
        >
          <Text style={styles.buttonText}>Jogar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonRed]}
          onPress={() => router.push('/rank/rankAluno')}
        >
          <Text style={styles.buttonText}>Estatísticas do Aluno</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonYellow]}
          onPress={() => router.replace('/')}
        >
          <Text style={[styles.buttonText, { color: '#000' }]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
    justifyContent: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
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
    marginBottom: 20,
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
    backgroundColor: '#FFEB3B',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#fff',
  },
});
