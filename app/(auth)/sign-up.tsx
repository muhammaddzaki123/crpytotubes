import { registerAdmin, signInAdmin } from '@/lib/appwrite'; 
import { useGlobalContext } from "@/lib/global-provider"; 
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet, ScrollView } from 'react-native';

export default function SignUpAdminScreen() {
  const router = useRouter();
  const { refetch } = useGlobalContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Semua kolom harus diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerAdmin(name, email, password);
      
      await signInAdmin(email, password);

      await refetch();
      router.replace('/'); 

    } catch (error: any) {

      Alert.alert("Error Registrasi", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Registrasi Admin Baru</Text>
        <Text style={styles.subtitle}>Peringatan: Halaman ini hanya untuk development.</Text>
        
        <TextInput
          placeholder="Nama Lengkap"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={isSubmitting}
          style={[styles.button, { backgroundColor: isSubmitting ? '#999' : '#0BBEBB' }]}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Mendaftarkan...' : 'Daftar & Masuk'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('./sign-in')}>
          <Text style={styles.link}>Sudah punya akun? Login di sini</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#161622' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10,
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: { 
    backgroundColor: '#232533',
    color: 'white',
    borderWidth: 1, 
    borderColor: '#333', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    fontSize: 16 
  },
  button: { 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
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
    fontSize: 16
  }
});
