import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useQuestoesDatabase, QuestoesDatabase } from '../../database/questoesService';

export default function QuestoesScreen() {
  const { create, getAll, update, remove } = useQuestoesDatabase();

  const [pergunta, setPergunta] = useState('');
  const [resposta1, setResposta1] = useState('');
  const [resposta2, setResposta2] = useState('');
  const [resposta3, setResposta3] = useState('');
  const [resposta4, setResposta4] = useState('');
  const [respostaCorreta, setRespostaCorreta] = useState('');
  const [dificuldade, setDificuldade] = useState('');
  const [materia, setMateria] = useState('');
  const [idEdit, setIdEdit] = useState<number | null>(null);

  const [questoes, setQuestoes] = useState<QuestoesDatabase[]>([]);

  useEffect(() => {
    loadQuestoes();
  }, []);

  const loadQuestoes = async () => {
    const data = await getAll();
    setQuestoes(data);
  };

  const handleSalvar = async () => {
    if (!pergunta || !respostaCorreta) {
      Alert.alert('Erro', 'Pergunta e resposta correta são obrigatórias');
      return;
    }

    if (idEdit === null) {
      await create({
        materia: parseInt(materia) || 0,
        dificuldade: dificuldade  as 'facil' | 'medio' | 'dificil',
        pergunta,
        resposta1,
        resposta2,
        resposta3,
        resposta4,
        respostaCorreta,
      });
    } else {
      await update({
        idQuestoes: idEdit,
        materia: parseInt(materia) || 0,
        dificuldade: dificuldade  as 'facil' | 'medio' | 'dificil',
        pergunta,
        resposta1,
        resposta2,
        resposta3,
        resposta4,
        respostaCorreta,
      });
      setIdEdit(null);
    }

    limparCampos();
    loadQuestoes();
  };

  const handleEditar = (item: QuestoesDatabase) => {
    setIdEdit(item.idQuestoes);
    setMateria(item.materia.toString());
    setDificuldade(item.dificuldade);
    setPergunta(item.pergunta);
    setResposta1(item.resposta1);
    setResposta2(item.resposta2);
    setResposta3(item.resposta3);
    setResposta4(item.resposta4);
    setRespostaCorreta(item.respostaCorreta);
  };

  const handleExcluir = async (id: number) => {
    await remove(id);
    loadQuestoes();
  };

  const limparCampos = () => {
    setPergunta('');
    setResposta1('');
    setResposta2('');
    setResposta3('');
    setResposta4('');
    setRespostaCorreta('');
    setDificuldade('');
    setMateria('');
    setIdEdit(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Questões</Text>

      <TextInput
        style={styles.input}
        placeholder="Pergunta"
        value={pergunta}
        onChangeText={setPergunta}
      />
      <TextInput
        style={styles.input}
        placeholder="Resposta 1"
        value={resposta1}
        onChangeText={setResposta1}
      />
      <TextInput
        style={styles.input}
        placeholder="Resposta 2"
        value={resposta2}
        onChangeText={setResposta2}
      />
      <TextInput
        style={styles.input}
        placeholder="Resposta 3"
        value={resposta3}
        onChangeText={setResposta3}
      />
      <TextInput
        style={styles.input}
        placeholder="Resposta 4"
        value={resposta4}
        onChangeText={setResposta4}
      />
      <TextInput
        style={styles.input}
        placeholder="Resposta Correta"
        value={respostaCorreta}
        onChangeText={setRespostaCorreta}
      />
      <TextInput
        style={styles.input}
        placeholder="Dificuldade"
        value={dificuldade}
        onChangeText={setDificuldade}
      />
      <TextInput
        style={styles.input}
        placeholder="Matéria (número)"
        value={materia}
        onChangeText={setMateria}
        keyboardType="numeric"
      />

      <Button title={idEdit === null ? 'Salvar' : 'Atualizar'} onPress={handleSalvar} />

      <FlatList
        data={questoes}
        keyExtractor={(item) => item.idQuestoes.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.pergunta}</Text>
            <View style={styles.buttons}>
              <Button title="Editar" onPress={() => handleEditar(item)} />
              <Button title="Excluir" color="red" onPress={() => handleExcluir(item.idQuestoes)} />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 5, borderRadius: 4,
  },
  item: {
    backgroundColor: '#eee', padding: 10, marginVertical: 5, borderRadius: 4,
  },
  buttons: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 5,
  },
});
