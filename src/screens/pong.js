import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground
} from 'react-native';

const { width, height } = Dimensions.get('window');
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_SIZE = 20;
const BALL_SPEED = 15;

export default function PingPongGame() {
  const [ball, setBall] = useState({ x: width / 2, y: height / 2 });
  const [ballDir, setBallDir] = useState({ x: BALL_SPEED, y: BALL_SPEED });
  const [paddle1X, setPaddle1X] = useState((width - PADDLE_WIDTH) / 2);
  const [paddle2X, setPaddle2X] = useState((width - PADDLE_WIDTH) / 2);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [winner, setWinner] = useState(null);

  const gameLoop = useRef(null);
  const speedInterval = useRef(null);

  // Ball position and direction refs to prevent flickering
  const ballRef = useRef({ ...ball });
  const ballDirRef = useRef({ ...ballDir });
  
  // Update refs when state changes
  useEffect(() => {
    ballRef.current = ball;
    ballDirRef.current = ballDir;
  }, [ball, ballDir]);
  
  // moveBall now uses useCallback with predictive collision detection
  const moveBall = useCallback(() => {
    setBall(prevBall => {
      // Calculate new position with current direction and speed
      let newX = prevBall.x + ballDirRef.current.x * speedMultiplier;
      let newY = prevBall.y + ballDirRef.current.y * speedMultiplier;
      let newDir = { ...ballDirRef.current };
      
      // Store previous position for collision detection
      const prevX = prevBall.x;
      const prevY = prevBall.y;

      // Wall collision (sides)
      if (newX <= 0 || newX + BALL_SIZE >= width) {
        newDir.x *= -1;
        // Adjust position to prevent sticking to wall
        newX = newX <= 0 ? 0 : width - BALL_SIZE;
      }

      const paddle1Y = height - 140;
      const paddle2Y = 30;
      
      // Predictive collision detection for paddle 1 (bottom)
      // Check if ball will cross the paddle in this frame
      if (prevY + BALL_SIZE <= paddle1Y && newY + BALL_SIZE >= paddle1Y) {
        // Check if ball is horizontally within paddle bounds
        if (newX + BALL_SIZE >= paddle1X && newX <= paddle1X + PADDLE_WIDTH) {
          newDir.y *= -1;
          // Place ball exactly at paddle surface to prevent passing through
          newY = paddle1Y - BALL_SIZE;
        }
      }
      
      // Standard collision for paddle 1 (bottom) as backup
      else if (
        newY + BALL_SIZE >= paddle1Y &&
        newY <= paddle1Y + PADDLE_HEIGHT &&
        newX + BALL_SIZE >= paddle1X &&
        newX <= paddle1X + PADDLE_WIDTH
      ) {
        newDir.y *= -1;
        // Place ball exactly at paddle surface
        newY = paddle1Y - BALL_SIZE;
      }
      
      // Predictive collision detection for paddle 2 (top)
      // Check if ball will cross the paddle in this frame
      if (prevY >= paddle2Y + PADDLE_HEIGHT && newY <= paddle2Y + PADDLE_HEIGHT) {
        // Check if ball is horizontally within paddle bounds
        if (newX + BALL_SIZE >= paddle2X && newX <= paddle2X + PADDLE_WIDTH) {
          newDir.y *= -1;
          // Place ball exactly at paddle surface to prevent passing through
          newY = paddle2Y + PADDLE_HEIGHT;
        }
      }
      
      // Standard collision for paddle 2 (top) as backup
      else if (
        newY <= paddle2Y + PADDLE_HEIGHT &&
        newY + BALL_SIZE >= paddle2Y &&
        newX + BALL_SIZE >= paddle2X &&
        newX <= paddle2X + PADDLE_WIDTH
      ) {
        newDir.y *= -1;
        // Place ball exactly at paddle surface
        newY = paddle2Y + PADDLE_HEIGHT;
      }

      // Bottom boundary - Player 2 scores
      if (newY + BALL_SIZE > height) {
        setScore(prev => {
          const newScore = { ...prev, p2: prev.p2 + 1 };
          if (newScore.p2 >= 3) {
            setWinner('Player 2');
            setIsGameRunning(false);
          }
          return newScore;
        });
        resetBall();
        return prevBall;
      }

      // Top boundary - Player 1 scores
      if (newY < 0) {
        setScore(prev => {
          const newScore = { ...prev, p1: prev.p1 + 1 };
          if (newScore.p1 >= 3) {
            setWinner('Player 1');
            setIsGameRunning(false);
          }
          return newScore;
        });
        resetBall();
        return prevBall;
      }

      // Update direction ref to ensure consistent state
      setBallDir(newDir);
      ballDirRef.current = newDir;
      return { x: newX, y: newY };
    });
  }, [speedMultiplier, paddle1X, paddle2X]); // Remove ballDir from dependencies since we use ref

  useEffect(() => {
    if (isGameRunning) {
      // Use requestAnimationFrame for smoother animation
      let lastTime = 0;
      const frameRate = 1000 / 60; // Target 60fps
      
      const runGameLoop = (timestamp) => {
        if (!isGameRunning) return;
        
        const deltaTime = timestamp - lastTime;
        if (deltaTime >= frameRate) {
          moveBall();
          lastTime = timestamp;
        }
        
        gameLoop.current = requestAnimationFrame(runGameLoop);
      };
      
      gameLoop.current = requestAnimationFrame(runGameLoop);
      
      // Speed increase interval remains the same
      speedInterval.current = setInterval(() => {
        setSpeedMultiplier(prev => Math.min(prev + 0.5, 5)); // Cap speed multiplier at 5
      }, 5000);
    }

    return () => {
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
      }
      clearInterval(speedInterval.current);
    };
  }, [isGameRunning, moveBall]);

  const startGame = () => {
    resetBall();
    setScore({ p1: 0, p2: 0 });
    setWinner(null);
    setIsGameRunning(true);
  };

  const resetBall = () => {
    const newBallDir = { x: BALL_SPEED, y: BALL_SPEED };
    setBall({ x: width / 2, y: height / 2 });
    setBallDir(newBallDir);
    ballDirRef.current = newBallDir;
    setSpeedMultiplier(1);
  };

  const movePaddle = (player, dir) => {
    const delta = 30;
    if (player === 1) {
      setPaddle1X(prev => Math.max(0, Math.min(width - PADDLE_WIDTH, prev + delta * dir)));
    } else {
      setPaddle2X(prev => Math.max(0, Math.min(width - PADDLE_WIDTH, prev + delta * dir)));
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Player 2 Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => movePaddle(2, -1)} style={styles.button}>
            <Text>⬅️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => movePaddle(2, 1)} style={styles.button}>
            <Text>➡️</Text>
          </TouchableOpacity>
        </View>

        {/* Game area */}
        <View style={styles.gameArea}>
          <Text style={styles.score}>P1: {score.p1} - P2: {score.p2}</Text>
          <View style={[styles.paddle, { top: 30, left: paddle2X }]} />
          <View style={[styles.ball, { top: ball.y, left: ball.x }]} />
          <View style={[styles.paddle, { top: height - 140, left: paddle1X }]} />

          {!isGameRunning && (
            <TouchableOpacity onPress={startGame} style={styles.startButton}>
              <Text style={styles.startText}>
                {winner ? `${winner} Wins! Restart Game` : 'Start Game'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Player 1 Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => movePaddle(1, -1)} style={styles.button}>
            <Text>⬅️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => movePaddle(1, 1)} style={styles.button}>
            <Text>➡️</Text>
          </TouchableOpacity>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  paddle: {
    position: 'absolute',
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: '#f5c542',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#222',
  },
  button: {
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  score: {
    position: 'absolute',
    top: height / 2 - 20,
    alignSelf: 'center',
    color: 'white',
    fontSize: 18,
  },
  startButton: {
    position: 'absolute',
    top: height / 2 - 60,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  startText: {
    color: 'ba2a3f',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
