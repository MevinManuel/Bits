import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import tugImage from '../../assets/tug.png';
import '../styles/global.css';


export default function TugOfWar() {
  const WINNING_SCORE =20;
  const [score, setScore] = useState(0);
  const [winner, setWinner] = useState(null);

  const handleTap = (player) => {
    if (winner) return;
    setScore((prevScore) => {
      const newScore = player === 'top' ? prevScore - 1 : prevScore + 1;
      if (newScore <= -WINNING_SCORE) setWinner('Player 1');
      else if (newScore >= WINNING_SCORE) setWinner('Player 2');
      return newScore;
    });
  };

  const restartGame = () => {
    setScore(0);
    setWinner(null);
  };

  const progressPercent = 50 + (score / (WINNING_SCORE * 2)) * 100;
  const { height } = Dimensions.get('window');

  return (
    <ImageBackground source={tugImage} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.tapArea, { backgroundColor: 'transparent', borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}
          activeOpacity={0.7}
          onPress={() => handleTap('top')}
          disabled={!!winner}
        >
          <Text style={styles.playerText}>Player 1</Text>
        </TouchableOpacity>

        <View style={styles.ropeContainer} pointerEvents="none">
          <View style={styles.ropeTrack}>
            <View style={[styles.progress, { top: `${progressPercent}%` }]} />
            <View style={[styles.flag, { top: `${progressPercent}%` }]}> 
              <Text style={styles.flagText}>🏳️</Text>
            </View>
          </View>
          <Text style={styles.scoreText}>{score}</Text>
        </View>

        <TouchableOpacity
          style={[styles.tapArea, { backgroundColor: 'transparent', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }]}
          activeOpacity={0.7}
          onPress={() => handleTap('bottom')}
          disabled={!!winner}
        >
          <Text style={styles.playerText}>Player 2</Text>
        </TouchableOpacity>

        {winner && (
          <View style={styles.overlay} pointerEvents="box-none">
            <Text style={styles.winnerText}>{winner} Wins!</Text>
            <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
              <Text style={styles.restartText}>Restart</Text>
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
    flexDirection: 'column', // vertical mode
    height: '100%',
    width: '100%',
    flex: 1,
    // backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tapArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor removed for transparency
  },
  playerText: {
    color: 'white',
    fontSize: 28,
    fontFamily: 'Modak',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    transform: [{ rotate: '90deg' }, { translateY: -50 }]
  },
  ropeContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateY: -0.5 * Dimensions.get('window').height * 0.8 }, { translateX: -30 }],
    height: '80%',
    width: 60,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ropeTrack: {
    position: 'relative',
    height: '100%',
    width: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'visible',
  },
  progress: {
    position: 'absolute',
    left: -10,
    width: 30,
    height: 8,
    backgroundColor: '#000000',
    borderRadius: 2,
    zIndex: 2,
  },
  flag: {
    position: 'absolute',
    left: -20,
    zIndex: 3,
  },
  flagText: {
    fontSize: 22,
  },
  scoreText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  winnerText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  restartButton: {
    backgroundColor: '#ba2a3f',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
  },
  restartText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Modak',
  },
});
