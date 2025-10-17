import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroARSceneNavigator,
  ViroImage,
  ViroNode,
  ViroAnimations,
  ViroARImageMarker,
  ViroARTrackingTargets
} from "@reactvision/react-viro";
import { 
  ViroTrackingStateConstants,
  ViroARTrackingReasonConstants
} from "@reactvision/react-viro";
import { CollectionManager } from '../utils/CollectionManager';
import { CardRecognition, NOVA_CARDS } from '../utils/CardRecognition';

interface ARScannerScreenProps {
  navigation: any;
}

// Register AR image targets for cards 1–6
ViroARTrackingTargets.createTargets({
  card1: {
    source: require('../assets/card_images/card1.jpeg'),
    orientation: "Up",
    physicalWidth: 0.05,
    type: 'Image'
  },
  card2: {
    source: require('../assets/card_images/card2.png'),
    orientation: "Up",
    physicalWidth: 0.05,
    type: 'Image'
  },
  card3: {
    source: require('../assets/card_images/card3.png'),
    orientation: "Up",
    physicalWidth: 0.05,
    type: 'Image'
  },
  card4: {
    source: require('../assets/card_images/card4.png'),
    orientation: "Up",
    physicalWidth: 0.05,
    type: 'Image'
  },
  card5: {
    source: require('../assets/card_images/card5.png'),
    orientation: "Up",
    physicalWidth: 0.05,
    type: 'Image'
  },
  card6: {
    source: require('../assets/card_images/card6.png'),
    orientation: "Up",
    physicalWidth: 0.05,
    type: 'Image'
  },
});

// AR result images for each card
const arResults: Record<string, any> = {
  card1: require('../assets/robot.png'),
  // card2: require('../assets/18.png'),
  card3: require('../assets/17.png'),
  card4: require('../assets/18.png'),
  card5: require('../assets/20.png'),
  card6: require('../assets/19.png'),
};

// Mapping from card key to Nova card ID
const cardKeyToNovaId: Record<string, string> = {
  card1: 'NOVA_001',
  // card2: 'NOVA_002',
  card3: 'NOVA_003',
  card4: 'NOVA_004',
  card5: 'NOVA_005',
  card6: 'NOVA_006',
};

// AR Scene component that uses image markers
const NovaARScene = ({ onCardDetected, allARImages, currentImageIndex, setCurrentImageIndex }: { 
  onCardDetected: (cardKey: string | null) => void;
  allARImages: any[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
}) => {
  const [isTracking, setIsTracking] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [currentCard, setCurrentCard] = useState<string | null>(null);

  // Add a fallback timer to show robot if marker isn't detected
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isTracking) {
        setShowFallback(true);
        console.log("Showing fallback robot");
      }
    }, 8000); // 8 seconds timeout
    
    return () => clearTimeout(timer);
  }, []);

  function onInitialized(state: any, reason: any) {
    console.log("AR tracking state:", state);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setIsTracking(true);
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      setIsTracking(false);
    }
  }

  // Animation for the robot image - Add bobbleCycle
  ViroAnimations.registerAnimations({
    bobble: {
      properties: {
        positionY: "+=0.01"
      },
      easing: "EaseInEaseOut",
      duration: 1000
    },
    bobbleDown: {
      properties: {
        positionY: "-=0.01"
      },
      easing: "EaseInEaseOut",
      duration: 1000
    }
  });

  // Helper to render AR markers for all cards
  const renderMarkers = () => Object.keys(arResults).map(cardKey => (
    <ViroARImageMarker
      key={cardKey}
      target={cardKey}
      onAnchorFound={() => {
        // Only set current card if no card is currently detected
        if (!currentCard) {
          setIsTracking(true);
          setCurrentCard(cardKey);
          onCardDetected(cardKey);
          console.log(`Card ${cardKey} found!`);
        }
      }}
    >
      {/* Only show AR image if this is the currently detected card */}
      {currentCard === cardKey && (
        <ViroNode position={[0, 0, 0]} scale={[1, 1, 1]}>
          <ViroImage
            height={0.25}
            width={0.25}
            position={[0, 0.1, 0]}
            source={allARImages[currentImageIndex]}
            animation={{
              name: "bobbleCycle",
              run: true,
              loop: true
            }}
            onClick={() => {
              // Cycle through AR images when tapped
              const newIndex = (currentImageIndex + 1) % allARImages.length;
              setCurrentImageIndex(newIndex);
              console.log(`Switched to AR image ${newIndex + 1}`);
            }}
          />
        </ViroNode>
      )}
    </ViroARImageMarker>
  ));

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {renderMarkers()}
      {/* Status text - only shown when not tracking any image and no fallback */}
      {!isTracking && !showFallback && (
        <ViroText
          text="Point camera at Nova card"
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -0.5]}
          style={styles.instructionText}
          outerStroke={{type: "Outline", width: 2, color: '#000'}}
        />
      )}
    </ViroARScene>
  );
};

// Main component
const ARScannerScreen: React.FC<ARScannerScreenProps> = ({ navigation }) => {
  const [capturedCards, setCapturedCards] = useState<string[]>([]);
  const [currentDetectedCard, setCurrentDetectedCard] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // All available AR images for cycling
  const allARImages = [
    require('../assets/17.png'),
    require('../assets/18.png'),
    require('../assets/19.png'),
    require('../assets/20.png'),
  ];

  const handleCardCaptured = (cardId: string) => {
    setCapturedCards(prev => [...prev, cardId]);
    setCurrentDetectedCard(null);
    // Optionally navigate back to collection after a delay
    setTimeout(() => {
      navigation && navigation.navigate && navigation.navigate('KoleksiSeriNova');
    }, 2000);
  };

  const captureCard = async () => {
    if (!currentDetectedCard) return;

    try {
      const novaId = cardKeyToNovaId[currentDetectedCard];
      const card = NOVA_CARDS.find(c => c.id === novaId);
      if (card) {
        await CollectionManager.addCard(card);
        handleCardCaptured(novaId);
        // Clear current detection so new cards can be detected
        setCurrentDetectedCard(null);
        Alert.alert(
          'Kartu Ditangkap!',
          `${card.name} telah ditambahkan ke koleksi Anda.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error capturing card:', error);
      Alert.alert('Error', 'Gagal menangkap kartu. Coba lagi.');
    }
  };

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => <NovaARScene 
            onCardDetected={setCurrentDetectedCard}
            allARImages={allARImages}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
          />,
        }}
        style={styles.arView}
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova AR Experience</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Nova Card Scanner</Text>
        <Text style={styles.instructionsText}>
          • Point your camera at a Nova card{'\n'}
          • Hold steady until Nova appears{'\n'}
          • Nova will appear automatically if needed
        </Text>
      </View>

      {/* Capture button when card is detected */}
      {currentDetectedCard && (
        <View style={styles.captureContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={captureCard}>
            <Text style={styles.captureButtonText}>📸 Tangkap Kartu</Text>
          </TouchableOpacity>
        </View>
      )}
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
  textStyle: {
    fontFamily: "Arial",
    fontSize: 24,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
  instructionText: {
    fontFamily: "Arial",
    fontSize: 24,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
  captureText: {
    fontFamily: "Arial",
    fontSize: 20,
    color: "#ffe066",
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
  captureContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 15,
  },
  captureButton: {
    backgroundColor: '#ffe066',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  captureButtonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ARScannerScreen;