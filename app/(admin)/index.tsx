import { useGlobalContext } from '@/lib/global-provider';
import { Redirect } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminDashboard() {
  // Ambil 'admin' dan fungsi 'logout' dari konteks global
  const { admin, loading, isLogged, logout } = useGlobalContext();

  // Jika masih loading atau belum login, arahkan ke halaman sign-in
  if (!loading && !isLogged) {
    return <Redirect href="/sign-in" />;
  }

  const handleLogout = () => {
    // Panggil fungsi logout dari konteks
    logout();
    // Tidak perlu redirect manual, karena perubahan isLogged akan ditangani oleh _layout.tsx
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard Admin</Text>
          <Text style={styles.subtitle}>Selamat datang kembali,</Text>
          <Text style={styles.adminName}>{admin?.name || 'Admin'}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Rubik-Bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0AEC0',
    fontFamily: 'Rubik-Regular',
  },
  adminName: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Rubik-SemiBold',
  },
  logoutButton: {
    backgroundColor: '#E53E3E', // Warna merah untuk logout
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto', // Posisikan di bawah
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Rubik-SemiBold',
  },
});
