import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Admin } from './appwrite'; // Hanya perlu tipe Admin

// Definisikan tipe untuk konteks global
interface GlobalContextType {
  isLogged: boolean;
  admin: Admin | null;
  setAdmin: React.Dispatch<React.SetStateAction<Admin | null>>; // Fungsi untuk mengatur admin
  loading: boolean;
  refetch: () => void; // Fungsi untuk memuat ulang jika diperlukan
}

// Buat konteks dengan nilai awal 'undefined'
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Komponen Provider
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  // Karena kita tidak lagi mengambil sesi dari Appwrite saat aplikasi dimulai,
  // kita hanya perlu menghentikan status loading setelah komponen dimuat.
  useEffect(() => {
    // Di sini Anda bisa menambahkan logika untuk memeriksa penyimpanan lokal (AsyncStorage)
    // jika Anda ingin sesi tetap ada setelah aplikasi ditutup.
    // Untuk saat ini, kita anggap pengguna harus login setiap kali.
    setLoading(false);
  }, []);

  // Fungsi refetch bisa digunakan untuk memicu pembaruan state jika diperlukan
  const refetch = () => {
    // Implementasi bisa ditambahkan di sini jika ada data lain yang perlu dimuat ulang
    console.log('Refetch dipanggil, state admin saat ini:', admin);
  };

  // Status login sekarang sepenuhnya bergantung pada state 'admin'
  const isLogged = !!admin;

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        admin,
        setAdmin, // Sediakan fungsi setAdmin ke komponen anak
        loading,
        refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Hook kustom untuk menggunakan konteks
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext harus digunakan di dalam GlobalProvider');
  }
  return context;
};

export default GlobalProvider;
