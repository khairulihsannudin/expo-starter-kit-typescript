import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Alert } from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroTrackingReason,
} from "@reactvision/react-viro";
import { CardRecognition } from '../../utils/CardRecognition';
import { CollectionManager } from '../../utils/CollectionManager';

interface ARScannerScreenProps {
  navigation?: any;
}

// AR Scene component - follows App2.tsx approach
const NovaARScene = () => {
  const [text, setText] = useState("Initializing AR...");

  function onInitialized(state: any, reason: ViroTrackingReason) {
    console.log("AR tracking state:", state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText("AR Ready! Point at Nova Card QR Code");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      setText("AR Unavailable");
    } else {
      setText("Initializing AR...");
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.arText}
      />
    </ViroARScene>
  );
};

const ARScannerScreen: React.FC<ARScannerScreenProps> = ({ navigation }) => {
  const goBack = () => {
    navigation && navigation.goBack();
  };

  // Test function for manual QR input
  const testQRCode = () => {
    Alert.prompt(
      'Test QR Code',
      'Masukkan QR Code untuk testing:',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Test', 
          onPress: async (qrCode?: string) => {
            if (!qrCode) return;
            
            // Use direct QR code recognition
            const result = CardRecognition.recognizeQRCode(qrCode);
            
            if (result.success && result.card) {
              // Add card to collection
              const collectedCard = await CollectionManager.addCard(result.card);
              const isNewCard = collectedCard.scanCount === 1;
              
              Alert.alert(
                isNewCard ? 'Kartu Baru Ditemukan! 🎉' : 'Kartu Ditemukan! ✨',
                `Nama: ${result.card.name}\n` +
                `Rarity: ${result.card.rarity}\n` +
                `Element: ${result.card.element}\n` +
                `ATK: ${result.card.attack} | DEF: ${result.card.defense} | HP: ${result.card.health}\n\n` +
                `${result.card.description}`,
                [
                  { text: 'OK', onPress: () => {} },
                  {
                    text: 'Lihat Koleksi',
                    onPress: () => navigation.goBack()
                  }
                ]
              );
            } else {
              Alert.alert('QR Code Tidak Valid', 'QR Code tidak dikenali sebagai kartu Nova.');
            }
          }
        }
      ],
      'plain-text',
      'NOVA_STARBOT_001_LEGENDARY_TOOTH_GUARDIAN'
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* AR Scene - same as in App2.tsx */}
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: NovaARScene,
        }}
        style={styles.arView}
      />
      
      {/* Header Overlay */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AR Scanner</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Instructions Overlay */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Cara Menggunakan:</Text>
        <Text style={styles.instructionsText}>
          1. Arahkan kamera ke QR Code pada kartu Nova{'\n'}
          2. Pastikan QR Code terlihat jelas dalam frame{'\n'}
          3. AR akan menunjukkan info dari kartu{'\n'}
          4. Kartu akan otomatis ditambahkan ke koleksi
        </Text>
        
        <TouchableOpacity style={styles.testButton} onPress={testQRCode}>
          <Text style={styles.testButtonText}>Test QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  arView: {
    flex: 1,
  },
  arText: {
    fontFamily: "Arial",
    fontSize: 28,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  instructionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  instructionsTitle: {
    color: '#ffe066',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionsText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  testButton: {
    backgroundColor: '#ffe066',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 16,
    alignSelf: 'center',
  },
  testButtonText: {
    color: '#222',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ARScannerScreen;
