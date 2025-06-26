import { signInAdmin } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider'; // Pastikan ini provider untuk admin
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet, ScrollView } from 'react-native';

export default function SignInAdminScreen() {
  const router = useRouter();
  const { refetch } = useGlobalContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Panggil fungsi signInAdmin yang sudah diperbarui
      await signInAdmin(email, password);
      
      // Panggil refetch untuk memperbarui state global admin
      await refetch();

      // Redirect ke halaman utama admin setelah berhasil
      // Pastikan '/dashboard' adalah rute yang benar untuk halaman utama admin Anda
      router.replace('/'); 

    } catch (error: any) {
      // Tampilkan pesan error yang lebih spesifik dari Appwrite
      Alert.alert("Error Login", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Admin Login</Text>
        
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#A0AEC0"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#A0AEC0"
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isSubmitting}
          style={[styles.button, { backgroundColor: isSubmitting ? '#999' : '#0BBEBB' }]}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Logging In...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('./sign-up')}>
          <Text style={styles.link}>Buat akun admin baru</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Gaya dasar untuk halaman (bisa disesuaikan dengan tema aplikasi admin)
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#1a202c' // Latar belakang gelap untuk panel admin
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 30, 
    color: 'white' 
  },
  input: { 
    backgroundColor: '#2d3748',
    color: 'white',
    borderWidth: 1, 
    borderColor: '#4a5568', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    fontSize: 16 
  },
  button: { 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  link: { 
    marginTop: 20, 
    color: '#0BBEBB', 
    textAlign: 'center', 
    fontWeight: '600',
    fontSize: 16
  }
});
