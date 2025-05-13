import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '../styles/global.css';


const { width } = Dimensions.get('window');
const MOLE_SIZE = 100;
const MOLE_POSITIONS = 8; 

export default function WhackAMole() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const savedScore = await AsyncStorage.getItem('moleHighScore');
        if (savedScore) {
          setHighScore(parseInt(savedScore));
        }
      } catch (e) {
        console.error('Failed to load high score:', e);
      }
    };
    loadHighScore();
  }, []);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [intervalDelay, setIntervalDelay] = useState(1000); // start slow

  const moleInterval = useRef(null);
  const timerInterval = useRef(null);

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setIntervalDelay(1000);
    setGameStarted(true);

    // Game timer countdown
    timerInterval.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          endGame();
        }
        return prev - 1;
      });
    }, 1000);

    // Mole appearance logic
    moleInterval.current = setInterval(() => {
      setActiveIndex(Math.floor(Math.random() * MOLE_POSITIONS));
      setIntervalDelay(prev => Math.max(300, prev - 50)); // speed up gradually
    }, intervalDelay);
  };

  // Handle mole speed increase
  useEffect(() => {
    if (gameStarted) {
      clearInterval(moleInterval.current);
      moleInterval.current = setInterval(() => {
        setActiveIndex(Math.floor(Math.random() * MOLE_POSITIONS));
        setIntervalDelay(prev => Math.max(300, prev - 50));
      }, intervalDelay);
    }
  }, [intervalDelay]);

  const endGame = async () => {
    clearInterval(moleInterval.current);
    clearInterval(timerInterval.current);
    setActiveIndex(null);
    setGameStarted(false);
    
    if (score > highScore) {
      setHighScore(score);
      try {
        await AsyncStorage.setItem('moleHighScore', score.toString());
      } catch (e) {
        console.error('Failed to save high score:', e);
      }
    }
  };

  const whackMole = async (index) => {
    if (index === activeIndex && gameStarted) {
      setScore(prev => {
        const newScore = prev + 1;
        if (newScore > highScore) {
          setHighScore(newScore);
          AsyncStorage.setItem('moleHighScore', newScore.toString());
        }
        return newScore;
      });
      setActiveIndex(null); // immediately hide mole
    }
  };

  const renderMoles = () => {
    return Array.from({ length: MOLE_POSITIONS }).map((_, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.moleHole,
          activeIndex === index && styles.activeMole
        ]}
        onPress={() => whackMole(index)}
        activeOpacity={0.8}
      >
        {activeIndex === index && <Text style={styles.moleText}>🐹</Text>}
      </TouchableOpacity>
    ));
  };

  return (
    <ImageBackground
      source={require('../../assets/mole.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.header}>Whack-a-Mole</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.highScore}>High Score: {highScore}</Text>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>

      <View style={styles.grid}>
        {renderMoles()}
      </View>

      {!gameStarted && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startText}>Start Game</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.startButton, styles.resetButton]} 
            onPress={async () => {
              try {
                await AsyncStorage.removeItem('moleHighScore');
                setHighScore(0);
              } catch (e) {
                console.error('Failed to reset high score:', e);
              }
            }}
          >
            <Text style={styles.startText}>Reset High Score</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
  },
  header: {
    paddingTop: 15, // Adjust as neede
    fontSize: 38,
    fontFamily: 'Modak',
    marginBottom: 10,
  },
  score: {
    fontSize: 25,
    marginBottom: 5,
  },
  highScore: {
    fontSize: 20,
    marginBottom: 5,
    color: '#000000',
    fontFamily: 'Modak',
  },
  timer: {
    fontSize: 14,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: width - 40,
    justifyContent: 'center',
  },
  moleHole: {
    width: MOLE_SIZE,
    height: MOLE_SIZE,
    backgroundColor: '#6c4f3d',
    margin: 10,
    borderRadius: MOLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeMole: {
    backgroundColor: '#ba2a3f',
  },
  moleText: {
    fontSize: 30,
  },
  startButton: {
    marginTop: 25,
    backgroundColor: '#ba2a3f',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },
  startText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Modak',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  resetButton: {
    backgroundColor: '#4a4a4a',
  },
});
