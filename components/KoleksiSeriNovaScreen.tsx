import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { CollectionManager, CollectedCard } from '../utils/CollectionManager';
import { CardRecognition } from '../utils/CardRecognition';

// Dynamic card image mapping based on Nova ID
const getCardImage = (novaId: string) => {
  const cardImageMap: Record<string, any> = {
    'NOVA_001': require('../assets/card_images/card1.jpeg'),
    'NOVA_002': require('../assets/card_images/card2.png'),
    'NOVA_003': require('../assets/card_images/card3.png'),
    'NOVA_004': require('../assets/card_images/card4.png'),
    'NOVA_005': require('../assets/card_images/card5.png'),
    'NOVA_006': require('../assets/card_images/card6.png'),
  };
  return cardImageMap[novaId] || require('../assets/card_images/card1.jpeg'); // fallback to card1
};

const novaLogo = require('../assets/robot.png');

// AR result images mapping for saving
const arResultImages = {
  'NOVA_001': require('../assets/card_images/card1.jpeg'),
  // 'NOVA_002': require('../assets/17.png'),
  'NOVA_003': require('../assets/card_images/card3.png'),
  'NOVA_004': require('../assets/card_images/card4.png'),
  'NOVA_005': require('../assets/card_images/card5.png'),
  'NOVA_006': require('../assets/card_images/card6.png'),
};

const KoleksiSeriNovaScreen = ({ navigation }: any) => {
  const [collection, setCollection] = useState<CollectedCard[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ totalCards: 0, totalScans: 0 });
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);

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

  // Save AR result image to photo library
  const saveARImage = async (cardId: string) => {
    // For now, just show a message
    // In a full implementation, you would need:
    // 1. expo-media-library for saving to photo library
    // 2. expo-file-system for file operations
    // 3. Convert require() assets to savable format
    
    Alert.alert(
      'Fitur Simpan',
      `Gambar AR untuk kartu ${cardId} akan disimpan ke galeri foto.\n\nUntuk implementasi penuh, install:\n- expo-media-library\n- expo-file-system`,
      [{ text: 'OK' }]
    );
  };

  const handleScanPress = () => {
    navigation && navigation.navigate && navigation.navigate('ARScanner');
  };

  // Render individual card item
  const renderCardItem = (card: CollectedCard, index: number) => {
    const rarityColor = CardRecognition.getRarityColor(card.rarity);
    const elementColor = CardRecognition.getElementColor(card.element);
    const isSelected = index === selectedCardIndex;


    return (
      <TouchableOpacity
        key={card.id}
        style={[styles.cardItem, { borderColor: isSelected ? '#ffe066' : rarityColor, borderWidth: isSelected ? 3 : 2 }]}
        onPress={() => setSelectedCardIndex(index)}
        activeOpacity={0.7}
      >
        <View style={styles.cardImageContainer}>
          <Image source={getCardImage(card.id)} style={styles.cardImage} />
          <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
            <Text style={styles.rarityText}>{card.rarity}</Text>
          </View>
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.selectedText}>✓</Text>
            </View>
          )}
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
      </TouchableOpacity>
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
          <Image 
            source={arResultImages[collection[selectedCardIndex].id as keyof typeof arResultImages] || require('../assets/17.png')} 
            style={styles.novaImage} 
          />
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => saveARImage(collection[selectedCardIndex].id)}
          >
            <Text style={styles.saveButtonText}>Simpan</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tabBar}>
        <Text style={[styles.tab, styles.tabActive]}>Skins</Text>
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
  selectedIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffe066',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  selectedText: {
    color: '#222',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default KoleksiSeriNovaScreen;
