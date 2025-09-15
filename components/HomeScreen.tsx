import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';

// Placeholders for your assets
const novaLogo = require('../assets/robot.png');
const cardBg1 = require('../assets/bgAR.png'); 
const cardBg2 = require('../assets/bgGameAwal.png'); 

const HomeScreen = ({ navigation }: any) => {
  // Navigate to KoleksiSeriNovaScreen
  const handleKoleksiPress = () => {
    navigation && navigation.navigate && navigation.navigate('KoleksiSeriNova');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={novaLogo} style={styles.headerIcon} />
        <View style={styles.headerLabelBox}>
          <Text style={styles.headerLabel}>Nova The Starbook</Text>
        </View>
      </View>
      {/* Cards */}
      <TouchableOpacity style={styles.card} onPress={handleKoleksiPress} activeOpacity={0.8}>
        <ImageBackground source={cardBg1} style={styles.cardBgImage} resizeMode="cover">
          <View style={styles.cardBg}>
            <Text style={styles.cardTitle}>AYO!!</Text>
            <Text style={styles.cardText}>KOLEKSI SERI NOVA THE STARBOOK DAN TAKLUKAN SELURUH MISINYA BERSAMA NOVA!!</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={handleKoleksiPress} activeOpacity={0.8}>
        <ImageBackground source={cardBg2} style={styles.cardBgImage} resizeMode="cover">
          <View style={styles.cardBg}>
            <Text style={styles.cardTitleGame}>LESGOO!!</Text>
            <Text style={styles.cardTextGame}>MULAI PETUALANGAN DI DUNIA GIGI BERSAMA NOVA!!</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6ed0e0',
    alignItems: 'center',
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    rowGap: 50,
  },
  headerIcon: {
    width: 60,
    height: 60,
    marginRight: -15,
    position: 'relative',
    top: -4,
    zIndex: 1,
  },
  headerLabelBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#ffe066',
  },
  headerLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    backgroundColor: 'transparent',
  },
  card: {
    width: '90%',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#fff',
    height: 150,
  },
  cardBg: {
    width: '100%',
    minHeight: 120,
    padding: 16,
    justifyContent: 'center',
    position: 'relative',
  },
  cardBgImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'right',
  },
  cardText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    marginLeft: '30%',
    textAlign: 'right',
  },
  cardTitleGame: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'left',
  },
  cardTextGame: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    marginRight: '30%',
    textAlign: 'left',
  },
});

export default HomeScreen;
