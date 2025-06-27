import {
  Client,
  Databases,
  ID,
  Models,
  Query,
} from 'react-native-appwrite';
import { hashPassword } from './hash-service';

// --- Definisi Tipe (Gunakan 'password' agar konsisten) ---
export interface Admin extends Models.Document {
  name: string;
  email: string;
  userType: 'admin';
  password?: string; // Atribut ini akan berisi hash
}

// --- Konfigurasi Appwrite (tetap sama) ---
export const config = {
  platform: 'com.unram.crypto',
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  adminCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ADMIN_COLLECTION_ID,
};

// Validasi Konfigurasi
if (!config.adminCollectionId) {
  throw new Error(
    'ID Koleksi Admin (ADMIN_COLLECTION_ID) belum diatur di environment variables.'
  );
}

// Inisialisasi Klien Appwrite
export const client = new Client()
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const databases = new Databases(client);

// =================================================================
// LAYANAN OTENTIKASI MANUAL (HANYA DATABASE)
// =================================================================

/**
 * Mendaftarkan admin baru langsung ke database.
 */
export async function registerAdmin(
  name: string,
  email: string,
  plainTextPassword: string // Ubah nama parameter agar lebih jelas
): Promise<Models.Document> {
  try {
    // Periksa apakah email sudah ada di database
    const existingUsers = await databases.listDocuments(
      config.databaseId!,
      config.adminCollectionId!,
      [Query.equal('email', email)]
    );

    if (existingUsers.documents.length > 0) {
      throw new Error('Pengguna dengan email ini sudah terdaftar.');
    }

    // Hash kata sandi yang diberikan pengguna
    const hashedPassword = hashPassword(plainTextPassword);

    // Buat dokumen baru di koleksi 'admins'
    // Gunakan nama atribut 'password' sesuai dengan yang ada di Appwrite
    const newUserDocument = await databases.createDocument(
      config.databaseId!,
      config.adminCollectionId!,
      ID.unique(),
      {
        name,
        email,
        userType: 'admin',
        password: hashedPassword, // <<<< PERUBAHAN DI SINI
      }
    );

    return newUserDocument;
  } catch (error: any) {
    console.error('Gagal mendaftarkan admin secara manual:', error);
    throw new Error(error.message || 'Terjadi kesalahan saat pendaftaran.');
  }
}

/**
 * Login admin secara manual.
 */
export async function signInAdmin(email: string, plainTextPassword: string): Promise<Admin> {
  try {
    // Hash kata sandi yang dimasukkan saat login
    const hashedPassword = hashPassword(plainTextPassword);

    // Cari dokumen admin berdasarkan email
    const adminDocs = await databases.listDocuments<Admin>(
      config.databaseId!,
      config.adminCollectionId!,
      [Query.equal('email', email)]
    );

    if (adminDocs.documents.length === 0) {
      throw new Error('Email atau password salah.');
    }

    const adminData = adminDocs.documents[0];

    // Bandingkan hash dari input dengan hash yang tersimpan di database
    // Gunakan nama atribut 'password' untuk mengambil data hash
    if (adminData.password !== hashedPassword) { // <<<< PERUBAHAN DI SINI
      throw new Error('Email atau password salah.');
    }

    // Jika berhasil, kembalikan data admin.
    return adminData;
  } catch (error: any) {
    console.error('Gagal login manual:', error);
    throw new Error(error.message || 'Kredensial tidak valid.');
  }
}
