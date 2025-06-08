
import CryptoJS from 'crypto-js';

export class EncryptionService {
  private static generateKey(password: string, salt: string): string {
    // PBKDF2 key derivation
    return CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 1000
    }).toString();
  }

  /**
   * Encrypt data using AES-256
   */
  static encrypt(data: string, secretKey: string): string {
    try {
      // Generate a random salt
      const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
      
      // Generate a key using PBKDF2
      const key = this.generateKey(secretKey, salt);
      
      // Encrypt the data
      const encrypted = CryptoJS.AES.encrypt(data, key).toString();
      
      // Return salt and encrypted data
      return `${salt}:${encrypted}`;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data using AES-256
   */
  static decrypt(encryptedData: string, secretKey: string): string {
    try {
      // Split salt and data
      const [salt, data] = encryptedData.split(':');
      
      // Generate the key using PBKDF2
      const key = this.generateKey(secretKey, salt);
      
      // Decrypt the data
      const decrypted = CryptoJS.AES.decrypt(data, key);
      
      // Return as UTF-8 string
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Hash data using SHA-256 (for passwords, etc.)
   */
  static hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }
}
