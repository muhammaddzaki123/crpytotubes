import {  logout } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppwrite } from '@/lib/useAppwrite';
import { Models } from 'react-native-appwrite';


const AdminDashboard = () => {
  const { admin, refetch: refetchAdmin } = useGlobalContext();
  const router = useRouter();
  

  const handleLogout = async () => {
    try {
      await logout();
      await refetchAdmin();
    } catch (error: any) {
      Alert.alert("Error Logout", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header Halaman */}
      <View className="flex-row items-center justify-between bg-white px-4 py-4 shadow-sm">
        <View>
          <Text className="text-lg text-gray-500">Selamat Datang,</Text>
          <Text className="text-2xl font-bold text-gray-900">{admin?.name || 'Admin'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="p-2 bg-red-100 rounded-full">
          <Ionicons name="log-out-outline" size={28} color="#EF4444" />
        </TouchableOpacity>
      </View>
      <View>
        halo in adalah tugas sya
        nama : muhammad dzaki al-qushoyi 
        nim F1D022143
      </View>

    </SafeAreaView>
  );
};

export default AdminDashboard;