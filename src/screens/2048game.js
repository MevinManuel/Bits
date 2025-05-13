import React, { useEffect, useState } from 'react';
import '../styles/global.css';

import {
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
  Text,
  ImageBackground
} from 'react-native';
import { Button, Title } from 'react-native-paper';
import bgImage from '../../assets/bac.png'; // 🔁 Adjust path as needed

const GRID_SIZE = 4;
const CELL_SIZE = Math.floor(Dimensions.get('window').width * 0.9 / GRID_SIZE);
const SWIPE_THRESHOLD = 50;

export default function Game2048Screen() {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (e, gestureState) => {
      const { dx, dy } = gestureState;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          dx > 0 ? moveRight() : moveLeft();
        }
      } else {
        if (Math.abs(dy) > SWIPE_THRESHOLD) {
          dy > 0 ? moveDown() : moveUp();
        }
      }
    },
  });

  const initializeGame = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    addNewTile(newGrid);
    addNewTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
  };

  const addNewTile = (currentGrid) => {
    const emptyCells = [];
    currentGrid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === null) emptyCells.push([i, j]);
      });
    });
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const moveGrid = (direction) => {
    const newGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const rotateGrid = (grid) => {
      const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          newGrid[i][j] = grid[GRID_SIZE - 1 - j][i];
        }
      }
      return newGrid;
    };

    const mergeLine = (line) => {
      const merged = Array(GRID_SIZE).fill(null);
      let pos = 0;
      for (let i = 0; i < GRID_SIZE; i++) {
        if (line[i] !== null) {
          if (merged[pos - 1] === line[i]) {
            merged[pos - 1] = merged[pos - 1] * 2;
            newScore += merged[pos - 1];
            moved = true;
          } else {
            merged[pos] = line[i];
            if (pos !== i) moved = true;
            pos++;
          }
        }
      }
      return merged;
    };

    let gridToProcess = newGrid;
    if (direction === 'up') gridToProcess = rotateGrid(rotateGrid(rotateGrid(newGrid)));
    if (direction === 'right') gridToProcess = rotateGrid(rotateGrid(newGrid));
    if (direction === 'down') gridToProcess = rotateGrid(newGrid);

    for (let i = 0; i < GRID_SIZE; i++) {
      gridToProcess[i] = mergeLine(gridToProcess[i]);
    }

    if (direction === 'up') gridToProcess = rotateGrid(gridToProcess);
    if (direction === 'right') gridToProcess = rotateGrid(rotateGrid(gridToProcess));
    if (direction === 'down') gridToProcess = rotateGrid(rotateGrid(rotateGrid(gridToProcess)));

    if (moved) {
      addNewTile(gridToProcess);
      setGrid(gridToProcess);
      setScore(newScore);
      checkGameOver(gridToProcess);
    }
  };

  const moveLeft = () => moveGrid('left');
  const moveRight = () => moveGrid('right');
  const moveUp = () => moveGrid('up');
  const moveDown = () => moveGrid('down');

  const checkGameOver = (currentGrid) => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentGrid[i][j] === null) return;
        if (i < GRID_SIZE - 1 && currentGrid[i][j] === currentGrid[i + 1][j]) return;
        if (j < GRID_SIZE - 1 && currentGrid[i][j] === currentGrid[i][j + 1]) return;
      }
    }
    setGameOver(true);
  };

  const getTileColor = (value) => {
    const colors = {
      2: 'rgb(255, 238, 215)',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };
    
    return value ? colors[value] || '#3e1f27' : '#faebef';
  };

  return (
    <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
      <View style={styles.container} {...panResponder.panHandlers}>
        <Title style={styles.title}>2048</Title>
        <Text style={styles.score}>Score: {score}</Text>
        <View style={styles.gridContainer}>
          {grid.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((cell, j) => (
                <View key={j} style={[styles.cell, { backgroundColor: getTileColor(cell) }]}>
                  <Text style={styles.cellText}>{cell !== null ? cell : ''}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        {gameOver && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <Button mode="contained" onPress={initializeGame} style={styles.restartButton}>
              Restart
            </Button>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
  },
  title: {
    paddingTop: 10,
    paddingBottom: 20,
    color: '#fff',
    fontSize: 58,
    fontFamily: 'Modak',
  },
  score: {
    fontSize: 25,
    color: 'rgba(50, 42, 42, 0.88)',
    marginBottom: 20,
    fontFamily: 'Modak',
  },
  gridContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e1c26',
    fontFamily: 'Modak',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverText: {
    fontSize: 32,
    color: '#ba2a3f',
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Modak',
  },
  restartButton: {
    backgroundColor: '#ba2a3f',
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});
