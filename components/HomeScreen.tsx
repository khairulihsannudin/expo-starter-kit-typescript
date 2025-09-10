import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// Placeholders for your assets
const novaLogo = require('../assets/robot.png');
// const cardBg1 = require('../assets/card1.png'); // Replace with your actual card background
// const cardBg2 = require('../assets/card2.png'); // Replace with your actual card background

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
        <View style={styles.cardBg}>
          <Text style={styles.cardTitle}>AYO!!</Text>
          <Text style={styles.cardText}>KOLEKSI SERI NOVA THE STARBOOK DAN TAKLUKAN SELURUH MISINYA BERSAMA NOVA!!</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.card}>
        <View style={styles.cardBg}>
          <Text style={styles.cardTitle}>LESGOO!!</Text>
          <Text style={styles.cardText}>MULAI PETUALANGAN DI DUNIA GIGI BERSAMA NOVA!!</Text>
          <Image source={novaLogo} style={styles.cardNova} />
        </View>
      </View>
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
  },
  headerIcon: {
    width: 48,
    height: 48,
    marginRight: 8,
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
  },
  cardBg: {
    width: '100%',
    minHeight: 120,
    padding: 16,
    justifyContent: 'center',
    position: 'relative',
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
    textAlign: 'right',
  },
  cardNova: {
    width: 64,
    height: 64,
    position: 'absolute',
    right: 16,
    bottom: 8,
  },
});

export default HomeScreen;
