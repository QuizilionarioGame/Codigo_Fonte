import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { JogadorDatabase, useJogadorDatabase } from '../database/jogadorService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { checkLogin } = useJogadorDatabase();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha email e senha.');
      return;
    }

    const user = await checkLogin(email.trim(), password.trim()) as JogadorDatabase | null;


    if (!user) {
      Alert.alert('Erro', 'Conta não encontrada ou senha incorreta.');
      return;
    }

    // 🔥 Verificar se é admin ou aluno
    if (user.emailAdmin === email) {
      router.replace('/home/homeProfessor');
    } else if (user.emailAluno === email) {
      router.replace('/home/homeAluno');
    } else {
      Alert.alert('Erro', 'Email não corresponde a uma conta válida.');
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/fundoLogin.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <BlurView intensity={20} style={styles.blur}>
        <View style={styles.overlay}>
          <View style={styles.poliedroIMG}>
            <Image
              source={require('@/assets/images/iconePoliedro.png')}
              style={styles.logo}
            />
            <Text style={styles.logoText}>Poliedro</Text>
          </View>
          <View style={styles.container}>
            <Text style={{ fontSize: 30, color: '#000', fontWeight: 'bold', marginBottom: 20 }}>
              Login
            </Text>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  blur: { flex: 1 },
  poliedroIMG: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 30,
  },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center',
  },
  container: {
    width: '90%', alignItems: 'center', padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 10,
  },
  logo: {
    width: 80, height: 80, resizeMode: 'contain', marginRight: 10,
  },
  logoText: {
    fontSize: 55, color: '#FFF', fontWeight: 'bold',
  },
  input: {
    width: '100%', height: 50, backgroundColor: '#FFF',
    borderRadius: 8, paddingHorizontal: 15, marginBottom: 15,
    borderWidth: 1, borderColor: '#DDD', fontSize: 16,
  },
  button: {
    width: '100%', height: 50, backgroundColor: '#007BFF',
    borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10,
  },
  buttonText: {
    color: '#FFF', fontSize: 18, fontWeight: 'bold',
  },
});
