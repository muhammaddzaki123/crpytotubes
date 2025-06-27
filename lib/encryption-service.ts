// lib/encryption-service.ts

import { AES, enc } from 'crypto-js';

// PERINGATAN: Kunci ini seharusnya tidak disimpan langsung di dalam kode untuk aplikasi produksi.
// Sebaiknya, gunakan variabel lingkungan (environment variables) yang aman atau layanan manajemen kunci.
const secretKey = process.env.EXPO_PUBLIC_CRYPTO_SECRET_KEY || 'kunci-rahasia-default-yang-aman';

if (secretKey === 'kunci-rahasia-default-yang-aman') {
  console.warn('Peringatan Keamanan: Anda menggunakan kunci enkripsi default. Harap atur EXPO_PUBLIC_CRYPTO_SECRET_KEY di environment variables Anda.');
}

/**
 * Mengenkripsi data menggunakan AES.
 * @param data - String data yang akan dienkripsi.
 * @returns String data yang telah terenkripsi.
 */
export function encryptData(data: string): string {
  if (!data) return '';
  return AES.encrypt(data, secretKey).toString();
}

/**
 * Mendekripsi data yang dienkripsi dengan AES.
 * @param encryptedData - String data yang telah terenkripsi.
 * @returns String data dalam bentuk asli.
 */
export function decryptData(encryptedData: string): string {
  if (!encryptedData) return '';
  const bytes = AES.decrypt(encryptedData, secretKey);
  return bytes.toString(enc.Utf8);
}