import {
  Account,
  Avatars,
  Client,
  Databases,
  Functions,
  ID,
  Models,
  Query,
  Storage,
} from 'react-native-appwrite';
import { hashPassword } from './hash-service';

// --- Definisi Tipe (Tambahkan hashedPassword) ---
export interface Admin extends Models.Document {
  name: string;
  email: string;
  userType: 'admin';
  accountId: string;
  hashedPassword?: string; // Properti untuk menyimpan hash manual
}

// --- Konfigurasi Appwrite ---
export const config = {
  platform: 'com.unram.gumisaq',
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
export const storage = new Storage(client);
export const account = new Account(client);
export const avatars = new Avatars(client);
export const functions = new Functions(client);

// =================================================================
// LAYANAN OTENTIKASI ADMIN (VERSI MANUAL)
// =================================================================


export async function registerAdmin(
  name: string,
  email: string,
  password: string
): Promise<Models.Document> {
  try {
    const hashedPassword = hashPassword(password);

    const newAccount = await account.create(
      ID.unique(),
      email,
      ID.unique(32), 
      name
    );

    if (!newAccount) {
      throw new Error('Gagal membuat akun dasar admin.');
    }

    // Simpan data admin, termasuk hash manual, ke koleksi 'admins'
    return await databases.createDocument(
      config.databaseId!,
      config.adminCollectionId!,
      newAccount.$id,
      {
        name,
        email,
        userType: 'admin',
        accountId: newAccount.$id,
        hashedPassword: hashedPassword, // Simpan hash di sini
      }
    );
  } catch (error: any) {
    console.error('Gagal mendaftarkan admin:', error);
    // Hapus pesan error yang terlalu teknis untuk pengguna
    if (error.message.includes('A user with the same email already exists')) {
      throw new Error('Pengguna dengan email ini sudah terdaftar.');
    }
    throw new Error('Terjadi kesalahan saat pendaftaran.');
  }
}

/**
 * Login admin secara manual.
 * Mencari pengguna di database, mengambil hash, dan membandingkannya.
 */
export async function signInAdmin(email: string, password: string): Promise<Admin> {
  try {
    // Hash kata sandi yang dimasukkan saat login
    const hashedPassword = hashPassword(password);

    // Cari dokumen admin berdasarkan email di koleksi 'admins'
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
    if (adminData.hashedPassword !== hashedPassword) {
      throw new Error('Email atau password salah.');
    }

    // Jika berhasil, kembalikan data admin.
    // Ini akan dianggap "login" di level aplikasi (tanpa sesi Appwrite).
    return adminData;
  } catch (error: any) {
    console.error('Gagal login manual:', error);
    throw new Error(error.message || 'Kredensial tidak valid.');
  }
}

/**
 * TIDAK DIGUNAKAN DALAM ALUR LOGIN MANUAL.
 * Fungsi ini tidak bisa diandalkan untuk memeriksa status login
 * karena tidak ada sesi Appwrite yang valid.
 */
export async function getCurrentUser(): Promise<Admin | null> {
  return null;
}

/**
 * Logout sekarang hanya berarti membersihkan state di aplikasi.
 * Tidak ada sesi Appwrite yang perlu dihapus untuk alur manual ini.
 */
export async function logout(): Promise<void> {
  // Tidak ada implementasi yang diperlukan di sini karena tidak ada sesi server.
  return Promise.resolve();
}
