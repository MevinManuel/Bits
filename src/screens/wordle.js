import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  View,
  ScrollView,
  ImageBackground
} from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import bgImage from '../../assets/3.png'; // 🔁 Adjust the path if needed

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

const WORDS = [
  'REACT', 'SWIFT', 'PLANT', 'WORLD', 'CHAIR',
  'TABLE', 'BRUSH', 'GHOST', 'WATER', 'TRUCK',
  'BLEND', 'CRISP', 'SUGAR', 'NIGHT', 'ALERT',
  'CLOUD', 'TREND', 'SHEEP', 'MOUSE', 'GRAPE',
  'PAINT', 'VIRUS', 'ROBOT', 'LUNCH', 'FRUIT',
  'TRAIL', 'FLOOD', 'MUSIC', 'VOICE', 'STORM',
  'DREAM', 'BRICK', 'GLASS', 'SHAPE', 'DANCE',
  'LASER', 'PIZZA', 'MOVIE', 'WOMAN', 'GLOVE',
  'STAGE', 'SCORE', 'BRAIN', 'FIELD', 'SMILE',
  'PHOTO', 'DOUBT', 'BRAVE', 'SLEEP', 'CYCLE'
];

export default function WordleGameScreen() {
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [results, setResults] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(newWord);
    setCurrentGuess('');
    setGuesses([]);
    setResults([]);
    setGameOver(false);
    setWon(false);
  };

  const checkGuess = (guess) => {
    const result = [];
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');

    guessLetters.forEach((letter, i) => {
      if (letter === targetLetters[i]) {
        result[i] = 'correct';
        targetLetters[i] = '*';
        guessLetters[i] = '*';
      }
    });

    guessLetters.forEach((letter, i) => {
      if (letter === '*') return;
      const targetIndex = targetLetters.indexOf(letter);
      if (targetIndex !== -1) {
        result[i] = 'present';
        targetLetters[targetIndex] = '*';
      } else {
        result[i] = 'absent';
      }
    });

    return result;
  };

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) {
      Alert.alert('Invalid guess', `Word must be ${WORD_LENGTH} letters long`);
      return;
    }

    const guess = currentGuess.toUpperCase();
    const result = checkGuess(guess);

    const updatedGuesses = [...guesses, guess];
    const updatedResults = [...results, result];
    setGuesses(updatedGuesses);
    setResults(updatedResults);
    setCurrentGuess('');

    if (result.every(r => r === 'correct')) {
      setGameOver(true);
      setWon(true);
      Alert.alert('Congratulations!', 'You won! Play again?', [
        { text: 'Play Again', onPress: startNewGame }
      ]);
    } else if (updatedGuesses.length >= MAX_ATTEMPTS) {
      setGameOver(true);
      Alert.alert('Game Over', `The word was ${targetWord}. Try again?`, [
        { text: 'Play Again', onPress: startNewGame }
      ]);
    }
  };

  const getColorForResult = (result) => {
    switch (result) {
      case 'correct': return '#D32F2F';
      case 'present': return '#FF7043';
      case 'absent': return '#B0BEC5';
      default: return '#ccc';
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Title style={styles.title}>Wordle</Title>

          <View style={styles.guessesContainer}>
            {guesses.map((guess, i) => (
              <View key={i} style={styles.guessRow}>
                {guess.split('').map((letter, j) => (
                  <View
                    key={j}
                    style={[
                      styles.letter,
                      { backgroundColor: getColorForResult(results[i][j]) }
                    ]}
                  >
                    <Title style={styles.letterText}>{letter}</Title>
                  </View>
                ))}
              </View>
            ))}

            {!gameOver && guesses.length < MAX_ATTEMPTS && (
              <View style={styles.inputContainer}>
                <TextInput
                  value={currentGuess}
                  onChangeText={text => setCurrentGuess(text.toUpperCase())}
                  maxLength={WORD_LENGTH}
                  style={styles.input}
                  autoCapitalize="characters"
                  mode="outlined"
                  theme={{ colors: { primary: '#D32F2F' } }}
                />
                <Button
                  mode="contained"
                  onPress={submitGuess}
                  disabled={currentGuess.length !== WORD_LENGTH}
                  style={styles.submitButton}
                >
                  Submit
                </Button>
              </View>
            )}
          </View>

          {gameOver && (
            <Button mode="contained" onPress={startNewGame} style={styles.newGameButton}>
              New Game
            </Button>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // transparent dark overlay for readability
  },
  title: {
    fontSize: 36,
    paddingTop: 30,
    marginVertical: 20,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  guessesContainer: {
    alignItems: 'center',
    width: '100%',
  },
  guessRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  letter: {
    width: 55,
    height: 55,
    margin: 4,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  letterText: {
    fontSize: 26,
    color: '#FFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: 230,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#ba2a3f',
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  newGameButton: {
    marginTop: 30,
    backgroundColor: '#ba2a3f',
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
