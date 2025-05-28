import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useJogadorDatabase } from '../../database/jogadorService';

export default function RegistroScreen() {
  const router = useRouter();
  const { create } = useJogadorDatabase();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [ra, setRa] = useState('');
  const [serie, setSerie] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegistro = async () => {
    if (!nome || !email || !ra || !serie || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (nome.length < 6) {
      Alert.alert('Erro', 'O nome deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Verificar a terminação do email
    const emailTrimmed = email.trim().toLowerCase();
    let emailAdmin = '';
    let emailAluno = '';

    if (emailTrimmed.endsWith('@sistemapoliedro.com.br')) {
      emailAdmin = emailTrimmed;
    } else if (emailTrimmed.endsWith('@p4ed.com')) {
      emailAluno = emailTrimmed;
    } else {
      Alert.alert('Erro', 'E-mail inválido. Use um e-mail institucional');
      return;
    }

    try {
      await create({
        nomeJogador: nome.trim(),
        ra: ra.trim(),
        serie: parseInt(serie),
        emailAdmin,
        emailAluno,
        senhaJogador: senha.trim(),
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      router.replace('/'); // Voltar para tela de login
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar conta. Verifique se os dados estão corretos ou se já existem.');
      console.error(error);
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
            <Text style={{ fontSize: 26, color: '#000', fontWeight: 'bold', marginBottom: 10 }}>
              Criar Conta
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nome (mín. 6 caracteres)"
              placeholderTextColor="#888"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail institucional"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="RA (somente números)"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={ra}
              onChangeText={setRa}
            />
            <TextInput
              style={styles.input}
              placeholder="Série (ex: 1, 2, 3)"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={serie}
              onChangeText={setSerie}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha (mín. 6 caracteres)"
              placeholderTextColor="#888"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity style={styles.button} onPress={handleRegistro}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ color: '#007BFF', marginTop: 10 }}>Voltar para Login</Text>
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
