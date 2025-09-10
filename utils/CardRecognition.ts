// Card database with Nova characters and their properties
export interface NovaCard {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  element: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Light' | 'Dark';
  attack: number;
  defense: number;
  health: number;
  description: string;
  image: string;
  qrCode?: string; // QR code data for recognition
}

export const NOVA_CARDS: NovaCard[] = [
  {
    id: 'NOVA_001',
    name: 'Nova The Starbot - Tooth Guardian',
    rarity: 'Legendary',
    element: 'Light',
    attack: 95,
    defense: 90,
    health: 100,
    description: 'Pelindung gigi utama dengan kekuatan cahaya bintang yang melindungi dari semua ancaman',
    image: 'nova_starbot.png',
    qrCode: 'NOVA_STARBOT_001_LEGENDARY_TOOTH_GUARDIAN'
  },
  {
    id: 'NOVA_002',
    name: 'Nova Fire Warrior',
    rarity: 'Epic',
    element: 'Fire',
    attack: 85,
    defense: 70,
    health: 80,
    description: 'Pejuang api yang melawan bakteri jahat',
    image: 'nova_fire_warrior.png',
    qrCode: 'NOVA_FIRE_002_EPIC'
  },
  {
    id: 'NOVA_003',
    name: 'Nova Aqua Healer',
    rarity: 'Rare',
    element: 'Water',
    attack: 60,
    defense: 80,
    health: 90,
    description: 'Penyembuh dengan kekuatan air yang menyegarkan',
    image: 'nova_aqua_healer.png',
    qrCode: 'NOVA_AQUA_003_RARE'
  },
  {
    id: 'NOVA_004',
    name: 'Nova Earth Guardian',
    rarity: 'Epic',
    element: 'Earth',
    attack: 75,
    defense: 95,
    health: 85,
    description: 'Penjaga bumi yang melindungi enamel gigi',
    image: 'nova_earth_guardian.png',
    qrCode: 'NOVA_EARTH_004_EPIC'
  },
  {
    id: 'NOVA_005',
    name: 'Nova Wind Scout',
    rarity: 'Common',
    element: 'Air',
    attack: 70,
    defense: 60,
    health: 70,
    description: 'Pengintai angin yang cepat dan lincah',
    image: 'nova_wind_scout.png',
    qrCode: 'NOVA_WIND_005_COMMON'
  },
  {
    id: 'NOVA_006',
    name: 'Nova Shadow Ninja',
    rarity: 'Rare',
    element: 'Dark',
    attack: 80,
    defense: 65,
    health: 75,
    description: 'Ninja bayangan yang menyerang dalam kegelapan',
    image: 'nova_shadow_ninja.png',
    qrCode: 'NOVA_SHADOW_006_RARE'
  }
];

// Card recognition functions
export class CardRecognition {
  
  // Direct QR code recognition for real scanner
  static recognizeQRCode(qrData: string): {
    success: boolean;
    card: NovaCard | null;
    method: 'qr';
    error?: string;
  } {
    const card = this.findCardByQRCode(qrData);
    if (card) {
      return {
        success: true,
        card,
        method: 'qr'
      };
    }
    
    return {
      success: false,
      card: null,
      method: 'qr',
      error: 'QR Code tidak dikenali sebagai kartu Nova yang valid.'
    };
  }
  
  // Simulate QR code detection from camera input
  static async detectQRCode(_imageData: string): Promise<string | null> {
    // Simulate QR code detection delay
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    
    // Simulate different detection results
    const mockQRCodes = NOVA_CARDS.map(card => card.qrCode);
    const randomIndex = Math.floor(Math.random() * mockQRCodes.length);
    
    // 80% chance of successful detection
    if (Math.random() > 0.2) {
      return mockQRCodes[randomIndex] || null;
    }
    
    return null;
  }
  
  // Find card by QR code
  static findCardByQRCode(qrCode: string): NovaCard | null {
    return NOVA_CARDS.find(card => card.qrCode === qrCode) || null;
  }
  
  // Simulate image recognition for cards without QR codes
  static async recognizeCardImage(_imageData: string): Promise<NovaCard | null> {
    // Simulate image processing delay
    await new Promise<void>(resolve => setTimeout(resolve, 2000));
    
    // Mock image recognition - randomly select a card
    const randomIndex = Math.floor(Math.random() * NOVA_CARDS.length);
    
    // 70% chance of successful recognition
    if (Math.random() > 0.3) {
      return NOVA_CARDS[randomIndex];
    }
    
    return null;
  }
  
  // Main recognition function that tries both QR and image recognition
  static async recognizeCard(imageData: string): Promise<{
    success: boolean;
    card: NovaCard | null;
    method: 'qr' | 'image' | null;
    error?: string;
  }> {
    try {
      // First try QR code detection
      const qrCode = await this.detectQRCode(imageData);
      if (qrCode) {
        const card = this.findCardByQRCode(qrCode);
        if (card) {
          return {
            success: true,
            card,
            method: 'qr'
          };
        }
      }
      
      // If QR fails, try image recognition
      const card = await this.recognizeCardImage(imageData);
      if (card) {
        return {
          success: true,
          card,
          method: 'image'
        };
      }
      
      return {
        success: false,
        card: null,
        method: null,
        error: 'Kartu tidak dapat dikenali. Pastikan kartu terlihat jelas.'
      };
      
    } catch (error) {
      return {
        success: false,
        card: null,
        method: null,
        error: 'Terjadi kesalahan saat memindai kartu.'
      };
    }
  }
  
  // Get rarity color for UI display
  static getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'Common': return '#8e8e93';
      case 'Rare': return '#007aff';
      case 'Epic': return '#af52de';
      case 'Legendary': return '#ff9500';
      default: return '#8e8e93';
    }
  }
  
  // Get element color for UI display
  static getElementColor(element: string): string {
    switch (element) {
      case 'Fire': return '#ff3b30';
      case 'Water': return '#007aff';
      case 'Earth': return '#34c759';
      case 'Air': return '#5ac8fa';
      case 'Light': return '#ffcc02';
      case 'Dark': return '#8e8e93';
      default: return '#8e8e93';
    }
  }
}

export default CardRecognition;
