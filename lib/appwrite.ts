import {
  Client,
  Databases,
  ID,
  Models,
  Query,
} from 'react-native-appwrite';
import { hashPassword } from './hash-service';
import { encryptData, decryptData } from './encryption-service'; 

// --- Definisi Tipe ---
export interface Admin extends Models.Document {
  name: string;
  email: string;
  userType: 'admin';
  password?: string;
}

// ... (konfigurasi Appwrite tetap sama) ...
export const config = {
  platform: 'com.unram.crypto',
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  adminCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ADMIN_COLLECTION_ID,
};

if (!config.adminCollectionId) {
  throw new Error(
    'ID Koleksi Admin (ADMIN_COLLECTION_ID) belum diatur di environment variables.'
  );
}

export const client = new Client()
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const databases = new Databases(client);

/**
 * Mendaftarkan admin baru langsung ke database.
 */
export async function registerAdmin(
  name: string,
  email: string,
  plainTextPassword: string
): Promise<Models.Document> {
  try {
    const existingUsers = await databases.listDocuments(
      config.databaseId!,
      config.adminCollectionId!,
      [Query.equal('email', email)]
    );

    if (existingUsers.documents.length > 0) {
      throw new Error('Pengguna dengan email ini sudah terdaftar.');
    }

    const hashedPassword = hashPassword(plainTextPassword);
    const encryptedName = encryptData(name); // <-- ENKRIPSI NAMA

    const newUserDocument = await databases.createDocument(
      config.databaseId!,
      config.adminCollectionId!,
      ID.unique(),
      {
        name: encryptedName, // <-- SIMPAN NAMA TERENKRIPSI
        email,
        userType: 'admin',
        password: hashedPassword,
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
    const hashedPassword = hashPassword(plainTextPassword);

    const adminDocs = await databases.listDocuments<Admin>(
      config.databaseId!,
      config.adminCollectionId!,
      [Query.equal('email', email)]
    );

    if (adminDocs.documents.length === 0) {
      throw new Error('Email atau password salah.');
    }

    const adminData = adminDocs.documents[0];

    if (adminData.password !== hashedPassword) {
      throw new Error('Email atau password salah.');
    }

    // Dekripsi nama sebelum mengembalikan data admin
    const decryptedAdmin: Admin = {
      ...adminData,
      name: decryptData(adminData.name), // <-- DEKRIPSI NAMA
    };

    return decryptedAdmin;
  } catch (error: any) {
    console.error('Gagal login manual:', error);
    throw new Error(error.message || 'Kredensial tidak valid.');
  }
}