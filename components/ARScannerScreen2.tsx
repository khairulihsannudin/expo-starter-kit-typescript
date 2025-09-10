import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  ViroARScene,
  ViroText,
  ViroTrackingStateConstants,
  ViroARSceneNavigator,
  ViroTrackingReason,
} from "@reactvision/react-viro";
import { CardRecognition } from '../utils/CardRecognition';
import { CollectionManager } from '../utils/CollectionManager';

const { width, height } = Dimensions.get('window');

interface ARScannerScreenProps {
  navigation?: any;
}

// AR Scene component similar to App2.tsx
const NovaARScene = () => {
  const [text, setText] = useState("Initializing AR...");

  function onInitialized(state: any, reason: ViroTrackingReason) {
    console.log("AR tracking state:", state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText("AR Ready! Scan QR Code");
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
  const [isProcessing, setIsProcessing] = useState(false);

  // Process QR code when detected
  const processQRCode = async (qrData: string) => {
    if (isProcessing || !qrData) return;
    
    setIsProcessing(true);
    
    try {
      console.log('QR Code detected:', qrData);
      
      // Use direct QR code recognition
      const result = CardRecognition.recognizeQRCode(qrData);
      
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
          `${result.card.description}\n\n` +
          `QR Code berhasil dipindai!\n` +
          `${isNewCard ? 'Kartu telah ditambahkan ke koleksi!' : `Scan ke-${collectedCard.scanCount}`}`,
          [
            {
              text: 'Scan Lagi',
              style: 'default',
              onPress: () => {
                setIsProcessing(false);
              }
            },
            {
              text: 'Lihat Koleksi',
              style: 'default',
              onPress: () => {
                navigation && navigation.goBack();
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'QR Code Tidak Dikenali',
          'QR Code ini bukan kartu Nova yang valid. Pastikan Anda memindai QR code dari kartu Nova yang asli.',
          [
            { 
              text: 'Coba Lagi', 
              onPress: () => setIsProcessing(false) 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert(
        'Error',
        'Terjadi kesalahan saat memproses QR code. Silakan coba lagi.',
        [{ 
          text: 'OK', 
          onPress: () => setIsProcessing(false) 
        }]
      );
    }
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
          onPress: (qrCode?: string) => {
            if (qrCode) {
              processQRCode(qrCode);
            }
          }
        }
      ],
      'plain-text',
      'NOVA_STARBOT_001_LEGENDARY_TOOTH_GUARDIAN'
    );
  };

  const goBack = () => {
    navigation && navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="rgba(0,0,0,0.8)" barStyle="light-content" />
      
      {/* AR Scene */}
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
          3. Kamera akan otomatis memindai QR Code{'\n'}
          4. Tunggu hingga kartu terdeteksi dan ditambahkan
        </Text>
        
        <TouchableOpacity 
          style={styles.testButton}
          onPress={testQRCode}
          disabled={isProcessing}
        >
          <Text style={styles.testButtonText}>
            {isProcessing ? 'Processing...' : 'Test QR Code'}
          </Text>
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
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: width * 0.9,
    height: height * 0.5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cameraText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  scanningFrame: {
    width: 250,
    height: 160,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#ffe066',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanningLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    top: '50%',
    backgroundColor: '#ffe066',
    opacity: 0.8,
  },
  animatedLine: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffe066',
  },
  instructionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    position: 'absolute',
    bottom: 0,
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
  cameraPlaceholder: {
    width: width * 0.9,
    height: height * 0.5,
    backgroundColor: '#333',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  permissionButton: {
    backgroundColor: '#ffe066',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  permissionButtonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
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
  frameText: {
    color: '#ffe066',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ARScannerScreen;
