import AsyncStorage from '@react-native-async-storage/async-storage';
import { NovaCard } from './CardRecognition';

export interface CollectedCard extends NovaCard {
  collectedAt: Date;
  scanCount: number;
}

export class CollectionManager {
  private static readonly STORAGE_KEY = 'nova_card_collection';
  
  // Get all collected cards from storage
  static async getCollection(): Promise<CollectedCard[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (jsonValue) {
        const collection = JSON.parse(jsonValue);
        // Convert date strings back to Date objects
        return collection.map((card: any) => ({
          ...card,
          collectedAt: new Date(card.collectedAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading collection:', error);
      return [];
    }
  }
  
  // Add a card to the collection
  static async addCard(card: NovaCard): Promise<CollectedCard> {
    try {
      const collection = await this.getCollection();
      const existingCard = collection.find(c => c.id === card.id);
      
      if (existingCard) {
        // Card already exists, increment scan count
        existingCard.scanCount += 1;
        await this.saveCollection(collection);
        return existingCard;
      } else {
        // New card, add to collection
        const newCollectedCard: CollectedCard = {
          ...card,
          collectedAt: new Date(),
          scanCount: 1
        };
        collection.push(newCollectedCard);
        await this.saveCollection(collection);
        return newCollectedCard;
      }
    } catch (error) {
      console.error('Error adding card to collection:', error);
      throw error;
    }
  }
  
  // Save collection to storage
  private static async saveCollection(collection: CollectedCard[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(collection);
      await AsyncStorage.setItem(this.STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving collection:', error);
      throw error;
    }
  }
  
  // Check if a card is in the collection
  static async hasCard(cardId: string): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      return collection.some(card => card.id === cardId);
    } catch (error) {
      console.error('Error checking card:', error);
      return false;
    }
  }
  
  // Get collection statistics
  static async getStats(): Promise<{
    totalCards: number;
    totalScans: number;
    rarityCount: Record<string, number>;
    elementCount: Record<string, number>;
  }> {
    try {
      const collection = await this.getCollection();
      
      const stats = {
        totalCards: collection.length,
        totalScans: collection.reduce((sum, card) => sum + card.scanCount, 0),
        rarityCount: {} as Record<string, number>,
        elementCount: {} as Record<string, number>
      };
      
      collection.forEach(card => {
        // Count by rarity
        stats.rarityCount[card.rarity] = (stats.rarityCount[card.rarity] || 0) + 1;
        
        // Count by element
        stats.elementCount[card.element] = (stats.elementCount[card.element] || 0) + 1;
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalCards: 0,
        totalScans: 0,
        rarityCount: {},
        elementCount: {}
      };
    }
  }
  
  // Remove a card from collection (for testing)
  static async removeCard(cardId: string): Promise<void> {
    try {
      const collection = await this.getCollection();
      const filteredCollection = collection.filter(card => card.id !== cardId);
      await this.saveCollection(filteredCollection);
    } catch (error) {
      console.error('Error removing card:', error);
      throw error;
    }
  }
  
  // Clear entire collection (for testing)
  static async clearCollection(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing collection:', error);
      throw error;
    }
  }
}

export default CollectionManager;
