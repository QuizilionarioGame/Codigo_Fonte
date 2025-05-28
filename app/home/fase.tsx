import React, { useEffect, useState, useRef } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQuestoesDatabase, QuestoesDatabase } from '../../database/questoesService';
import { useRankingDatabase } from '../../database/rankingService';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FaseScreen() {
  const { getQuestoesPorDificuldade } = useQuestoesDatabase();
  const { saveOrUpdateRanking } = useRankingDatabase();

  

  const [questoes, setQuestoes] = useState<QuestoesDatabase[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [alternativas, setAlternativas] = useState<string[]>([]);
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedSkip, setUsedSkip] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const [tempo, setTempo] = useState(0);
  const timerRef = useRef<number | null>(null);


  const prizeMoney = [
    10000, 50000, 100000, 200000,
    300000, 400000, 500000, 600000,
    700000, 800000, 900000, 1000000
  ];

  useEffect(() => {
    carregarQuestoes();
    iniciarCronometro();
    return pararCronometro;
  }, []);

  useEffect(() => {
    if (questoes.length > 0) {
      const q = questoes[currentQuestionIndex];
      const alternativasCompletas = [
        q.resposta1,
        q.resposta2,
        q.resposta3,
        q.resposta4,
        q.respostaCorreta,
      ];
      const embaralhadas = alternativasCompletas.sort(() => Math.random() - 0.5);
      setAlternativas(embaralhadas);
    }
  }, [currentQuestionIndex, questoes]);

  const iniciarCronometro = () => {
    pararCronometro();
    setTempo(0);
    timerRef.current = setInterval(() => {
      setTempo((prev) => prev + 1);
    }, 1000);
  };

  const pararCronometro = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const salvarRanking = async () => {
  const jogadorId = await AsyncStorage.getItem('jogadorId');
  const nomeJogador = await AsyncStorage.getItem('nomeJogador');

  if (jogadorId && nomeJogador) {
    await saveOrUpdateRanking({
      idJogador: Number(jogadorId),
      nomeJogador: nomeJogador,
      qntdPontos: score,
      qntdTempo: tempo,
    });
  } else {
    console.log('❌ Não foi possível obter dados do jogador para salvar ranking');
  }
};


  const carregarQuestoes = async () => {
    try {
      const faceis = await getQuestoesPorDificuldade('Facil');
      const medias = await getQuestoesPorDificuldade('Medio');
      const dificeis = await getQuestoesPorDificuldade('Dificil');

      const todasQuestoes = [...faceis, ...medias, ...dificeis];

      if (todasQuestoes.length < 12) {
        Alert.alert('Erro', 'Não há questões suficientes no banco.');
        return;
      }

      setQuestoes(todasQuestoes);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar questões.');
    }
  };

  const handleAnswer = (resposta: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(resposta);
    setShowFeedback(true);

    const questaoAtual = questoes[currentQuestionIndex];
    const isCorrect = resposta === questaoAtual.respostaCorreta;

    if (isCorrect) {
      const newScore = prizeMoney[currentQuestionIndex];
      setScore(newScore);
    }

    setTimeout(async () => {
      if (isCorrect) {
        if (currentQuestionIndex === questoes.length - 1) {
          pararCronometro();
          await salvarRanking();
          Alert.alert('Parabéns!', `Você ganhou R$${prizeMoney[currentQuestionIndex].toLocaleString('pt-BR')}!Tempo total: ${tempo} segundos.`);
          resetGame();
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      } else {
        pararCronometro();
        await salvarRanking();
        Alert.alert('Fim de jogo!', `Você errou! Seu prêmio final é R$${score.toLocaleString('pt-BR')}Tempo total: ${tempo} segundos.`);
        resetGame();
      }
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1000);
  };

  const handleFiftyFifty = () => {
    if (usedFiftyFifty) return;
    const questaoAtual = questoes[currentQuestionIndex];
    const alternativasErradas = alternativas.filter(alt => alt !== questaoAtual.respostaCorreta);
    const alternativasParaExcluir = alternativasErradas.slice(0, 2);
    const novasAlternativas = alternativas.filter(alt => !alternativasParaExcluir.includes(alt));
    setAlternativas(novasAlternativas);
    setUsedFiftyFifty(true);
  };

  const handleSkip = () => {
    if (usedSkip) return;

    if (currentQuestionIndex === questoes.length - 1) {
      pararCronometro();
      salvarRanking();
      Alert.alert('Fim de jogo!', `Você ganhou R$${score.toLocaleString('pt-BR')}!Tempo total: ${tempo} segundos`);
      resetGame();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setUsedSkip(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setUsedFiftyFifty(false);
    setUsedSkip(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    iniciarCronometro();
    carregarQuestoes();
  };

  const renderFases = () => {
    const col1 = [];
    const col2 = [];
    for (let i = 0; i < 6; i++) {
      col1.push(
        <View key={i} style={styles.faseRow}>
          <Text style={styles.faseText}>{i + 1}. (R${prizeMoney[i].toLocaleString('pt-BR')})</Text>
          {currentQuestionIndex === i && <View style={styles.bolinha} />}
        </View>
      );
      col2.push(
        <View key={i + 6} style={styles.faseRow}>
          <Text style={styles.faseText}>{i + 7}. (R${prizeMoney[i + 6].toLocaleString('pt-BR')})</Text>
          {currentQuestionIndex === i + 6 && <View style={styles.bolinha} />}
        </View>
      );
    }
    return (
      <View style={styles.fasesContainer}>
        <View style={styles.faseCol}>{col1}</View>
        <View style={styles.faseCol}>{col2}</View>
      </View>
    );
  };

  if (questoes.length === 0) {
    return (
      <View style={styles.loading}>
        <Text style={{ fontSize: 20, color: '#333' }}>Carregando questões...</Text>
      </View>
    );
  }

  const questaoAtual = questoes[currentQuestionIndex];

  return (
    <ImageBackground
      source={require('@/assets/images/chuvaDinheiro2.png')}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.18 }}
    >
      <View style={styles.overlay}>
        <Text style={{ color: '#FFD166', textAlign: 'center', marginBottom: 5, fontWeight: 'bold' }}>
          ⏱️ Tempo: {tempo}s
        </Text>

        {renderFases()}

        <View style={styles.questionBox}>
          <Text style={styles.question}>{questaoAtual.pergunta}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {alternativas.map((alt, index) => {
            let backgroundColor = 'rgba(26, 81, 92, 0.8)';
            if (showFeedback) {
              if (alt === questaoAtual.respostaCorreta) backgroundColor = '#06D6A0';
              else if (alt === selectedAnswer) backgroundColor = '#EF476F';
            }
            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, { backgroundColor }]}
                onPress={() => handleAnswer(alt)}
                disabled={showFeedback}
              >
                <Text style={styles.optionText} numberOfLines={2} adjustsFontSizeToFit>
                  {alt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.extraButton, { backgroundColor: '#FFD166', opacity: usedFiftyFifty ? 0.5 : 1 }]}
            onPress={handleFiftyFifty}
            disabled={usedFiftyFifty}
          >
            <Text style={styles.extraButtonText}>Excluir 2 alternativas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.extraButton, { backgroundColor: '#EF476F', opacity: usedSkip ? 0.5 : 1 }]}
            onPress={handleSkip}
            disabled={usedSkip}
          >
            <Text style={styles.extraButtonText}>Pular rodada</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 180, 216, 0.11)',
    padding: 12,
    justifyContent: 'center',
  },
  fasesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  faseCol: {
    flex: 1,
    alignItems: 'flex-start',
  },
  faseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  faseText: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  bolinha: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF476F',
    marginLeft: 4,
    borderWidth: 2,
    borderColor: '#FFD166',
  },
  questionBox: {
    backgroundColor: '#073B4C',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFD166',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD166',
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    height: 50,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  optionText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  extraButton: {
    height: 50,
    minWidth: 150,
    paddingHorizontal: 10,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
