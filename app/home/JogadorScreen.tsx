import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { JogadorDatabase, useJogadorDatabase } from '../../database/jogadorService';

export default function JogadoresScreen() {
  const { create, getAll, update, remove, searchByName } = useJogadorDatabase();
  const router = useRouter();

  const [nomeJogador, setNomeJogador] = useState('');
  const [ra, setRa] = useState('');
  const [serie, setSerie] = useState('');
  const [emailAdmin, setEmailAdmin] = useState('');
  const [emailAluno, setEmailAluno] = useState('');
  const [senhaJogador, setSenhaJogador] = useState('');
  const [idEdit, setIdEdit] = useState<number | null>(null);

  const [jogadores, setJogadores] = useState<JogadorDatabase[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadJogadores();
  }, []);

  const loadJogadores = async () => {
    const data = await getAll();
    setJogadores(data);
  };

  const handleSearch = async (value: string) => {
    setSearch(value);

    if (value.trim() === '') {
      loadJogadores();
    } else {
      const result = await searchByName(value);
      setJogadores(result);
    }
  };

  const handleSalvar = async () => {
    if (!nomeJogador || !ra || !senhaJogador) {
      Alert.alert('Erro', 'Nome, RA e senha são obrigatórios');
      return;
    }

    if (idEdit === null) {
      await create({
        nomeJogador,
        ra,
        serie: parseInt(serie) || 0,
        emailAdmin,
        emailAluno,
        senhaJogador,
      });
    } else {
      await update({
        idJogador: idEdit,
        nomeJogador,
        ra,
        serie: parseInt(serie) || 0,
        emailAdmin,
        emailAluno,
        senhaJogador,
      });
      setIdEdit(null);
    }

    limparCampos();
    loadJogadores();
  };

  const handleEditar = (item: JogadorDatabase) => {
    setIdEdit(item.idJogador);
    setNomeJogador(item.nomeJogador);
    setRa(item.ra);
    setSerie(item.serie.toString());
    setEmailAdmin(item.emailAdmin || '');
    setEmailAluno(item.emailAluno || '');
    setSenhaJogador(item.senhaJogador);
  };

  const handleExcluir = async (id: number) => {
    await remove(id);
    loadJogadores();
  };

  const limparCampos = () => {
    setNomeJogador('');
    setRa('');
    setSerie('');
    setEmailAdmin('');
    setEmailAluno('');
    setSenhaJogador('');
    setIdEdit(null);
    setSearch('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Jogadores</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Jogador"
        value={nomeJogador}
        onChangeText={setNomeJogador}
      />
      <TextInput
        style={styles.input}
        placeholder="RA"
        value={ra}
        onChangeText={setRa}
      />
      <TextInput
        style={styles.input}
        placeholder="Série"
        value={serie}
        onChangeText={setSerie}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Email do Admin"
        value={emailAdmin}
        onChangeText={setEmailAdmin}
      />
      <TextInput
        style={styles.input}
        placeholder="Email do Aluno"
        value={emailAluno}
        onChangeText={setEmailAluno}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senhaJogador}
        onChangeText={setSenhaJogador}
        secureTextEntry
      />

      <Button title={idEdit === null ? 'Salvar' : 'Atualizar'} onPress={handleSalvar} />

      <TextInput
        style={styles.inputSearch}
        placeholder="Buscar por nome"
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={jogadores}
        keyExtractor={(item) => item.idJogador.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.nomeJogador} - RA: {item.ra}</Text>
            <View style={styles.buttons}>
              <Button title="Editar" onPress={() => handleEditar(item)} />
              <Button title="Excluir" color="red" onPress={() => handleExcluir(item.idJogador)} />
            </View>
          </View>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 5, borderRadius: 4,
  },
  inputSearch: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 10, borderRadius: 4,
    backgroundColor: '#f5f5f5',
  },
  item: {
    backgroundColor: '#eee', padding: 10, marginVertical: 5, borderRadius: 4,
  },
  itemText: {
    fontSize: 16, fontWeight: '500',
  },
  buttons: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 5,
  },
});
