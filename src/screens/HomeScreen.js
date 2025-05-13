import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ScrollView,
  Linking,
} from 'react-native';

const { width } = Dimensions.get('window');

const GameCard = ({ title, onPress, image }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <ImageBackground source={image} style={styles.image} imageStyle={styles.imageStyle}>
      <View style={styles.overlay}>
        <Text style={styles.cardText}>{title}</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const games = [
    { title: '', route: '2048', image: require('../../assets/2048.png') },
    { title: '', route: 'pong', image: require('../../assets/pong.png') },
    { title: '', route: 'wordle', image: require('../../assets/7.png') },
    { title: '', route: 'moles', image: require('../../assets/molee.png') },
    { title: '', route: 'tugofwar', image: require('../../assets/tugg.png') },
    { title: '', route: 'nqueens', image: require('../../assets/queens.png') },
    { title: '', route: 'snake', image: require('../../assets/Snake.png') },
  ];

  const openGitHub = () => {
    Linking.openURL('https://github.com/MevinManuel'); // Replace with your GitHub
  };

  const openLinkedIn = () => {
    Linking.openURL('https://www.linkedin.com/in/mevin-manuel-b3b670275/'); // Replace with your LinkedIn
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        {games.map((game, index) => (
          <GameCard
            key={index}
            title={game.title}
            onPress={() => navigation.navigate(game.route)}
            image={game.image}
          />
        ))}

        <TouchableOpacity style={styles.footerButton} onPress={openGitHub}>
          <Text style={styles.footerButtonText}>Creator's GitHub</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.footerButton, { backgroundColor: 'rgba(214, 43, 43, 0.92)',}]} onPress={openLinkedIn}>
          <Text style={[styles.footerButtonText, { fontFamily: 'Modak',}] }>Contact</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingVertical: 16,
  },
  container: {
    alignItems: 'center',
    paddingBottom: 32,
    paddingTop: 30,
  },
  card: {
    width: width - 32,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  imageStyle: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Modak',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  footerButton: {
    width: width - 32,
    paddingVertical: 14,
    backgroundColor: '#333',
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
