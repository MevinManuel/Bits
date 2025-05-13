import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import '../styles/global.css';

const { width } = Dimensions.get('window');
const BOARD_SIZE = 8; // 8x8 chess board
const CELL_SIZE = Math.floor(width * 0.9 / BOARD_SIZE);

export default function NQueens() {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(false)));
  const [queensPlaced, setQueensPlaced] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [invalidMove, setInvalidMove] = useState(null);

  const isUnderAttack = (row, col, currentBoard) => {
    // Check row
    if (currentBoard[row].includes(true)) return true;

    // Check column
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (currentBoard[i][col]) return true;
    }

    // Check diagonals
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (currentBoard[i][j]) {
          if (Math.abs(row - i) === Math.abs(col - j)) return true;
        }
      }
    }

    return false;
  };

  const handleCellPress = (row, col) => {
    if (gameWon) return;

    setBoard(currentBoard => {
      const newBoard = currentBoard.map(row => [...row]);

      if (newBoard[row][col]) {
        // Remove queen
        newBoard[row][col] = false;
        setQueensPlaced(prev => prev - 1);
        setInvalidMove(null);
        return newBoard;
      }

      if (isUnderAttack(row, col, newBoard)) {
        setInvalidMove({ row, col });
        setTimeout(() => setInvalidMove(null), 1000);
        return currentBoard;
      }

      // Place queen
      newBoard[row][col] = true;
      setQueensPlaced(prev => prev + 1);
      setInvalidMove(null);
      return newBoard;
    });
  };

  useEffect(() => {
    if (queensPlaced === BOARD_SIZE) {
      setGameWon(true);
    }
  }, [queensPlaced]);

  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(false)));
    setQueensPlaced(0);
    setGameWon(false);
    setInvalidMove(null);
  };

  const getCellStyle = (row, col) => {
    const isBlackCell = (row + col) % 2 === 1;
    const isInvalid = invalidMove?.row === row && invalidMove?.col === col;

    return [
      styles.cell,
      isBlackCell ? styles.blackCell : styles.whiteCell,
      isInvalid && styles.invalidCell
    ];
  };

  return (
    <ImageBackground 
      source={require('../../assets/queens.png')} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>N-Queens</Text>
        <Text style={styles.subtitle}>Place {BOARD_SIZE} queens on the board</Text>
        
        <View style={styles.board}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((hasQueen, colIndex) => (
                <TouchableOpacity
                  key={colIndex}
                  style={getCellStyle(rowIndex, colIndex)}
                  onPress={() => handleCellPress(rowIndex, colIndex)}
                  activeOpacity={0.7}
                >
                  {hasQueen && <Text style={styles.queen}>👑</Text>}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.counter}>Queens Placed: {queensPlaced}/{BOARD_SIZE}</Text>

        {gameWon && (
          <View style={styles.overlay}>
            <Text style={styles.winText}>Congratulations!</Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
              <Text style={styles.resetText}>Play Again</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  title: {
    fontSize: 36,
    color: '#fff',
    fontFamily: 'Modak',
    marginBottom: 8,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  board: {
    width: CELL_SIZE * BOARD_SIZE,
    height: CELL_SIZE * BOARD_SIZE,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#333',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  whiteCell: {
    backgroundColor: '#f0d9b5',
  },
  blackCell: {
    backgroundColor: '#ba2a3f',
  },
  invalidCell: {
    backgroundColor: '#ff6b6b',
  },
  queen: {
    fontSize: 24,
  },
  counter: {
    fontSize: 20,
    color: '#fff',
    marginTop: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winText: {
    fontSize: 36,
    color: '#fff',
    fontFamily: 'Modak',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  resetButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 20,
  },
  resetText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'Modak',
  },
});