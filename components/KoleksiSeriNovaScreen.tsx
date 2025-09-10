import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { CollectionManager, CollectedCard } from '../utils/CollectionManager';
import { CardRecognition } from '../utils/CardRecognition';

const novaLogo = require('../assets/robot.png');

const KoleksiSeriNovaScreen = ({ navigation }: any) => {
  const [collection, setCollection] = useState<CollectedCard[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ totalCards: 0, totalScans: 0 });

  // Load collection on component mount
  useEffect(() => {
    loadCollection();
  }, []);

  // Load collection from storage
  const loadCollection = async () => {
    try {
      const cards = await CollectionManager.getCollection();
      const collectionStats = await CollectionManager.getStats();
      setCollection(cards);
      setStats(collectionStats);
    } catch (error) {
      console.error('Error loading collection:', error);
    }
  };

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadCollection();
    setRefreshing(false);
  };

  const handleScanPress = () => {
    navigation && navigation.navigate && navigation.navigate('ARScanner');
  };

  // Render individual card item
  const renderCardItem = (card: CollectedCard, index: number) => {
    const rarityColor = CardRecognition.getRarityColor(card.rarity);
    const elementColor = CardRecognition.getElementColor(card.element);
    
    return (
      <View key={card.id} style={[styles.cardItem, { borderColor: rarityColor }]}>
        <View style={styles.cardImageContainer}>
          <Image source={novaLogo} style={styles.cardImage} />
          <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
            <Text style={styles.rarityText}>{card.rarity}</Text>
          </View>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{card.name}</Text>
          <View style={[styles.elementBadge, { backgroundColor: elementColor }]}>
            <Text style={styles.elementText}>{card.element}</Text>
          </View>
          <Text style={styles.cardStats}>
            ATK: {card.attack} | DEF: {card.defense} | HP: {card.health}
          </Text>
          <Text style={styles.scanCount}>Dipindai: {card.scanCount}x</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation && navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Image source={novaLogo} style={styles.headerIcon} />
        <Text style={styles.headerLabel}>Koleksi Seri Nova</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Collection Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalCards}</Text>
          <Text style={styles.statLabel}>Kartu Terkumpul</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalScans}</Text>
          <Text style={styles.statLabel}>Total Scan</Text>
        </View>
      </View>

      {/* Featured Nova Display */}
      {collection.length > 0 && (
        <View style={styles.novaCardContainer}>
          <Image source={novaLogo} style={styles.novaImage} />
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tabBar}>
        <Text style={[styles.tab, styles.tabActive]}>Skins</Text>
        <Text style={styles.tab}>Senjata</Text>
      </View>

      {/* Collection Grid */}
      <View style={styles.collectionContainer}>
        {collection.length > 0 ? (
          <View style={styles.grid}>
            {collection.map((card, index) => renderCardItem(card, index))}
          </View>
        ) : (
          <View style={styles.emptyCollection}>
            <Text style={styles.emptyText}>Belum ada kartu yang dikumpulkan</Text>
            <Text style={styles.emptySubtext}>Scan kartu Nova untuk mulai mengumpulkan!</Text>
          </View>
        )}
      </View>

      {/* Scan Button */}
      <TouchableOpacity style={styles.scanButton} onPress={handleScanPress}>
        <Text style={styles.scanButtonText}>📱 Scan Nova Card with AR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6ed0e0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  backButtonText: {
    color: '#222',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcon: {
    width: 48,
    height: 48,
    marginRight: 8,
  },
  headerLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  novaCardContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  novaImage: {
    width: 180,
    height: 220,
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: '#00bfff',
    borderRadius: 12,
    marginBottom: 8,
  },
  saveButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffe066',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    elevation: 2,
  },
  saveButtonText: {
    color: '#222',
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  tab: {
    fontSize: 16,
    color: '#aaa',
    marginRight: 24,
    fontWeight: '600',
  },
  tabActive: {
    color: '#222',
    borderBottomWidth: 2,
    borderBottomColor: '#222',
  },
  collectionContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  grid: {
    paddingVertical: 8,
  },
  cardItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    elevation: 2,
  },
  cardImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  cardImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  rarityBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  elementBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 4,
  },
  elementText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardStats: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  scanCount: {
    fontSize: 10,
    color: '#999',
  },
  emptyCollection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  scanButton: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    alignSelf: 'center',
    backgroundColor: '#ffe066',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  scanButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default KoleksiSeriNovaScreen;
