import { registerAdmin, signInAdmin } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

export default function SignUpAdminScreen() {
  const router = useRouter();
  const { setAdmin } = useGlobalContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Semua kolom harus diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerAdmin(name, email, password);
      
      const adminData = await signInAdmin(email, password);
      
      setAdmin(adminData);

      router.replace('/');

    } catch (error: any) {
      Alert.alert('Error Registrasi', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Registrasi Admin Baru</Text>
        <Text style={styles.subtitle}>
          Peringatan: Halaman ini hanya untuk development.
        </Text>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Nama Lengkap"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#A0AEC0"
          />
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
            onPress={handleRegister}
            disabled={isSubmitting}
            style={[styles.button, { opacity: isSubmitting ? 0.7 : 1 }]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Daftar & Masuk</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('./sign-in')} disabled={isSubmitting}>
          <Text style={styles.link}>Sudah punya akun? Login di sini</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#161622' },
  formContainer: { paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: 'white', fontFamily: 'Rubik-Bold' },
  subtitle: { fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 30, fontFamily: 'Rubik-Regular' },
  input: { backgroundColor: '#232533', color: 'white', borderWidth: 1, borderColor: '#333', padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16, fontFamily: 'Rubik-Regular' },
  button: { backgroundColor: '#0BBEBB', padding: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16, fontFamily: 'Rubik-SemiBold' },
  link: { marginTop: 20, color: '#0BBEBB', textAlign: 'center', fontSize: 16, fontFamily: 'Rubik-Medium' },
});
