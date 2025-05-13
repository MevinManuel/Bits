import React, { useEffect, useRef, useState } from 'react';
import '../styles/global.css';

import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Text,
  ImageBackground
} from 'react-native';

const CELL_SIZE = 20;
const GRID_SIZE = 20;
const BOARD_SIZE = CELL_SIZE * GRID_SIZE;

const INIT_POSITION = [{ x: 5, y: 5 }];
const INIT_DIRECTION = { x: 1, y: 0 }; // moving right

export default function SnakeGame() {
  const [snake, setSnake] = useState(INIT_POSITION);
  const [direction, setDirection] = useState(INIT_DIRECTION);
  const [food, setFood] = useState(generateFood(INIT_POSITION));
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { dx, dy } = gestureState;
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 10 && directionRef.current.x !== -1) {
            directionRef.current = { x: 1, y: 0 };
          } else if (dx < -10 && directionRef.current.x !== 1) {
            directionRef.current = { x: -1, y: 0 };
          }
        } else {
          if (dy > 10 && directionRef.current.y !== -1) {
            directionRef.current = { x: 0, y: 1 };
          } else if (dy < -10 && directionRef.current.y !== 1) {
            directionRef.current = { x: 0, y: -1 };
          }
        }
      },
    })
  ).current;

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isGameOver) return;

      // Always use the latest refs for direction and snake
      const currentDirection = directionRef.current;
      const currentSnake = snakeRef.current;
      const currentFood = foodRef.current;
      const newHead = {
        x: currentSnake[currentSnake.length - 1].x + currentDirection.x,
        y: currentSnake[currentSnake.length - 1].y + currentDirection.y,
      };

      // Wrap around walls
      if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
      if (newHead.x >= GRID_SIZE) newHead.x = 0;
      if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
      if (newHead.y >= GRID_SIZE) newHead.y = 0;

      // Check for self collision
      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return;
      }

      let newSnake = [...currentSnake, newHead];
      let ateFood = (newHead.x === currentFood.x && newHead.y === currentFood.y);

      if (ateFood) {
        // Generate new food in a free cell
        const nextFood = generateFood(newSnake);
        setFood(nextFood);
        foodRef.current = nextFood;
        setScore(prevScore => {
          const newScore = prevScore + 1;
          // Update high score if current score is higher
          if (newScore > highScore) {
            setHighScore(newScore);
          }
          return newScore;
        });
        // Snake grows, do not remove tail
        snakeRef.current = newSnake;
        setSnake(newSnake);
        return;
      }

      newSnake.shift(); // Remove tail if not eating

      snakeRef.current = newSnake;
      setSnake(newSnake);
    }, 150);

    return () => clearInterval(intervalId);
  }, [isGameOver]);

  function generateFood(snakeBody) {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!snakeBody.some(seg => seg.x === newFood.x && seg.y === newFood.y)) break;
    }
    return newFood;
  }

  function restartGame() {
    setSnake(INIT_POSITION);
    setDirection(INIT_DIRECTION);
    directionRef.current = INIT_DIRECTION;
    const newFood = generateFood(INIT_POSITION);
    setFood(newFood);
    foodRef.current = newFood;
    snakeRef.current = INIT_POSITION;
    setIsGameOver(false);
    setScore(0);
  }

  return (
    <ImageBackground 
      source={require('../../assets/Snake.png')} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container} {...panResponder.panHandlers}>
        <View style={styles.board}>
        {snake.map((segment, index) => (
          <View
            key={index}
            style={[
              styles.snake,
              {
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
              },
            ]}
          />
        ))}
        <View
          style={[
            styles.food,
            {
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
            },
          ]}
        />
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.highScoreText}>High Score: {highScore}</Text>
        </View>
        {isGameOver && (
          <View style={styles.gameOver}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <Text style={styles.finalScoreText}>Final Score: {score}</Text>
            <View style={styles.restartButton} onTouchEnd={restartGame}>
              <Text style={styles.restartButtonText}>Restart</Text>
            </View>
          </View>
        )}
        </View>
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
    backgroundColor: 'rgba(40, 0, 0, 0.7)', // Dark red-tinted background
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#1a0000', // Darker red-tinted board
    position: 'relative',
    borderWidth: 2,
    borderColor: '#500000',
  },
  snake: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#ba2a3f', // Bright red for snake
  },
  food: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Bright accent red for food
  },
  gameOver: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(80,0,0,0.85)', // Dark red overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    color: '#ffdddd', // Light red for text
    fontSize: 32,
    fontWeight: 'bold',
  },
  scoreContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  scoreText: {
    color: '#f0f0f0', // Light grey for score
    fontSize: 24,
    fontFamily: 'Modak',
    textAlign: 'right',
    marginRight: 15,

  },
  highScoreText: {
    color: '#ffcc99', // Light orange for high score
    fontSize: 18,
    fontFamily: 'Modak',
    textAlign: 'right',
    marginTop: 5,
    marginRight: 15,

  },
  finalScoreText: {
    fontFamily: 'Modak',
    color: '#ffdddd',
    fontSize: 24,
    marginTop: 10,
  },
  restartButton: {
    backgroundColor: '#ba2a3f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#ffdddd',
  },
  restartButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Modak',
  },
});