import { signInAdmin } from '@/lib/appwrite';
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

export default function SignInAdminScreen() {
  const router = useRouter();
  const { setAdmin } = useGlobalContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password harus diisi.');
      return;
    }

    setIsSubmitting(true);
    try {
      const adminData = await signInAdmin(email, password);
      
      setAdmin(adminData);

      router.replace('/');

    } catch (error: any) {
      Alert.alert('Error Login', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Admin Login</Text>

        <View style={styles.formContainer}>
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
            style={[styles.button, { opacity: isSubmitting ? 0.7 : 1 }]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('./sign-up')} disabled={isSubmitting}>
          <Text style={styles.link}>Buat akun admin baru</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#161622' },
  formContainer: { paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: 'white', fontFamily: 'Rubik-Bold' },
  input: { backgroundColor: '#232533', color: 'white', borderWidth: 1, borderColor: '#333', padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16, fontFamily: 'Rubik-Regular' },
  button: { backgroundColor: '#0BBEBB', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16, fontFamily: 'Rubik-SemiBold' },
  link: { marginTop: 20, color: '#0BBEBB', textAlign: 'center', fontWeight: '600', fontSize: 16, fontFamily: 'Rubik-Medium' },
});
