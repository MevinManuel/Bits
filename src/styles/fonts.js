// src/styles/fonts.js
import * as Font from 'expo-font';

export const loadFonts = () => {
  return Font.loadAsync({
    'Modak': require('../../assets/fonts/Modak-Regular.ttf'),
  });
};
