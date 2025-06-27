import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Admin } from './appwrite';

// Definisikan tipe untuk konteks global
interface GlobalContextType {
  isLogged: boolean;
  admin: Admin | null;
  setAdmin: React.Dispatch<React.SetStateAction<Admin | null>>;
  loading: boolean;
  logout: () => void; // <<< TAMBAHKAN FUNGSI LOGOUT DI SINI
}

// Buat konteks
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Hook kustom untuk menggunakan konteks
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext harus digunakan di dalam GlobalProvider');
  }
  return context;
};

// Komponen Provider
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);
  
  // <<< INI FUNGSI LOGOUT-NYA
  const logout = () => {
    setAdmin(null);
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged: !!admin,
        admin,
        setAdmin,
        loading,
        logout, // <<< SEDIAKAN FUNGSI LOGOUT KE KOMPONEN ANAK
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
