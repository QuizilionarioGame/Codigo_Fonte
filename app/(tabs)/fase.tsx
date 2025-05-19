import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mockQuestions = [
  { pergunta: 'Qual é a capital da França?', alternativas: ['Paris', 'Londres', 'Berlim', 'Roma', 'Madri'], correta: 'Paris' },
  { pergunta: 'Qual é o maior planeta do sistema solar?', alternativas: ['Terra', 'Marte', 'Júpiter', 'Saturno', 'Vênus'], correta: 'Júpiter' },
  { pergunta: 'Quem pintou a Mona Lisa?', alternativas: ['Van Gogh', 'Leonardo da Vinci', 'Picasso', 'Michelangelo', 'Rembrandt'], correta: 'Leonardo da Vinci' },
  { pergunta: 'Qual é o menor país do mundo?', alternativas: ['Vaticano', 'Mônaco', 'San Marino', 'Liechtenstein', 'Andorra'], correta: 'Vaticano' },
  { pergunta: 'Qual é o elemento químico com símbolo O?', alternativas: ['Oxigênio', 'Ouro', 'Ósmio', 'Óxido', 'Órgon'], correta: 'Oxigênio' },
  { pergunta: 'Qual é o idioma mais falado no mundo?', alternativas: ['Inglês', 'Mandarim', 'Espanhol', 'Hindi', 'Árabe'], correta: 'Mandarim' },
  { pergunta: 'Qual é o maior oceano do mundo?', alternativas: ['Atlântico', 'Pacífico', 'Índico', 'Ártico', 'Antártico'], correta: 'Pacífico' },
  { pergunta: 'Quem escreveu "Dom Quixote"?', alternativas: ['Miguel de Cervantes', 'Shakespeare', 'Victor Hugo', 'Tolstói', 'Kafka'], correta: 'Miguel de Cervantes' },
  { pergunta: 'Qual é a fórmula química da água?', alternativas: ['H2O', 'CO2', 'O2', 'H2', 'HO'], correta: 'H2O' },
  { pergunta: 'Qual é o maior deserto do mundo?', alternativas: ['Saara', 'Antártico', 'Gobi', 'Kalahari', 'Atacama'], correta: 'Antártico' },
  { pergunta: 'Quem foi o primeiro homem a pisar na Lua?', alternativas: ['Neil Armstrong', 'Buzz Aldrin', 'Yuri Gagarin', 'Michael Collins', 'John Glenn'], correta: 'Neil Armstrong' },
  { pergunta: 'Qual é o país com a maior população do mundo?', alternativas: ['China', 'Índia', 'EUA', 'Indonésia', 'Brasil'], correta: 'China' },
];

export default function FaseScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(mockQuestions[0]);
  const [alternativas, setAlternativas] = useState(mockQuestions[0].alternativas);
  const [usedFiftyFifty, setUsedFiftyFifty] = useState(false);
  const [usedSkip, setUsedSkip] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const prizeMoney = [10000, 50000, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000];

  useEffect(() => {
    setCurrentQuestion(mockQuestions[currentQuestionIndex]);
    setAlternativas(mockQuestions[currentQuestionIndex].alternativas);
  }, [currentQuestionIndex]);

  const handleAnswer = (resposta: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(resposta);
    setShowFeedback(true);

    const isCorrect = resposta === currentQuestion.correta;
    if (isCorrect) {
      const newScore = prizeMoney[currentQuestionIndex];
      setScore(newScore);
    }

    setTimeout(() => {
      if (isCorrect) {
        if (currentQuestionIndex === mockQuestions.length - 1) {
          Alert.alert('Parabéns!', `Você ganhou R$${prizeMoney[currentQuestionIndex].toLocaleString('pt-BR')}!`);
          resetGame();
        } else {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
      } else {
        Alert.alert('Fim de jogo!', `Você errou! Seu prêmio final é R$${score.toLocaleString('pt-BR')}.`);
        resetGame();
      }
      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1500);
  };

  const handleFiftyFifty = () => {
    if (usedFiftyFifty) return;

    const alternativasErradas = alternativas.filter((alt) => alt !== currentQuestion.correta);
    const alternativasParaExcluir = alternativasErradas.slice(0, 2);
    const novasAlternativas = alternativas.filter((alt) => !alternativasParaExcluir.includes(alt));
    setAlternativas(novasAlternativas);
    setUsedFiftyFifty(true);
  };

  const handleSkip = () => {
    if (usedSkip) return;

    if (currentQuestionIndex === mockQuestions.length - 1) {
      Alert.alert('Fim de jogo!', `Você ganhou R$${score.toLocaleString('pt-BR')}!`);
      resetGame();
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
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
  };

  const renderFases = () => {
    const col1 = [];
    const col2 = [];
    for (let i = 0; i < 6; i++) {
      col1.push(
        <View key={i} style={styles.faseRow}>
          <Text style={styles.faseText}>
            {i + 1}. (R${prizeMoney[i].toLocaleString('pt-BR')})
          </Text>
          {currentQuestionIndex === i && <View style={styles.bolinha} />}
        </View>
      );
      col2.push(
        <View key={i + 6} style={styles.faseRow}>
          <Text style={styles.faseText}>
            {i + 7}. (R${prizeMoney[i + 6].toLocaleString('pt-BR')})
          </Text>
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

  return (
    <ImageBackground
      source={require('@/assets/images/chuvaDinheiro2.png')}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{ opacity: 0.18 }}
    >
      <View style={styles.overlay}>
        {renderFases()}
        <View style={styles.questionBox}>
          <Text style={styles.question}>{currentQuestion.pergunta}</Text>
        </View>
        <View style={styles.optionsContainer}>
          {alternativas.map((alt, index) => {
            let backgroundColor = 'rgba(26, 81, 92, 0.8)';
            if (showFeedback) {
              if (alt === currentQuestion.correta) backgroundColor = '#06D6A0';
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
            <Text style={styles.extraButtonText} numberOfLines={1} adjustsFontSizeToFit>
              Excluir 2 alternativas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.extraButton, { backgroundColor: '#EF476F', opacity: usedSkip ? 0.5 : 1 }]}
            onPress={handleSkip}
            disabled={usedSkip}
          >
            <Text style={styles.extraButtonText} numberOfLines={1} adjustsFontSizeToFit>
              Pular rodada
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 180, 216, 0.11)',
    padding: 18,
    justifyContent: 'center',
  },
  fasesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  faseCol: {
    flex: 1,
    alignItems: 'flex-start',
  },
  faseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 2,
  },
  faseText: {
    fontSize: 16,
    color: '#FFD166',
    marginRight: 6,
    fontWeight: 'bold',
    textShadowColor: '#073B4C',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    padding: 18,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#FFD166',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD166',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    height: 50,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 3,
  },
  optionText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#073B4C',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 12,
  },
  extraButton: {
    height: 60,
    minWidth: 160,
    paddingHorizontal: 12,
    borderRadius: 12,
    flex: 1,
    shadowColor: 'black',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraButtonText: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});