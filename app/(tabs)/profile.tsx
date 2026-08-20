import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    momo_number: user?.momo_number || '',
    address: user?.address || '',
  });

  // Avatar upload removed (reverting to initials-only avatar)

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form data
      setFormData({
        name: user?.name || '',
        phone: user?.phone || '',
        momo_number: user?.momo_number || '',
        address: user?.address || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.momo_number.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        momo_number: formData.momo_number.trim(),
        address: formData.address.trim() || undefined,
      });

      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => { 
            await logout(); 
            router.replace('/(auth)/login'); 
          } 
        },
      ]
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePicturePress = async () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => pickImageFromCamera() },
        { text: 'Gallery', onPress: () => pickImageFromGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleImageSelected(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery permission is required to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleImageSelected(result.assets[0].uri);
    }
  };

  const handleImageSelected = async (imageUri: string) => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      if (!user) {
        Alert.alert('Error', 'Please log in again to update your profile picture');
        router.push('/login');
        return;
      }

      // For now, we'll just update the local state
      // In a real app, you'd upload to server first
      const result = await updateProfile({
        profile_image_url: imageUri,
      });

      if (result.success) {
        Alert.alert('Success', 'Profile picture updated successfully!');
      } else {
        if (result.error === 'Unauthorized') {
          Alert.alert('Session Expired', 'Please log in again to continue');
          router.push('/login');
        } else {
          Alert.alert('Error', result.error || 'Failed to update profile picture');
        }
      }
    } catch (error) {
      console.error('Profile picture update error:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <TouchableOpacity 
              style={[styles.avatar, { backgroundColor: colors.primary }]}
              onPress={handleProfilePicturePress}
            >
              {user?.profile_picture ? (
                <Image 
                  source={{ uri: user.profile_picture }} 
                  style={styles.profileImage}
                />
              ) : (
                <ThemedText style={[styles.avatarText, { color: '#FFFFFF' }]}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </ThemedText>
              )}
              <View style={[styles.cameraIcon, { backgroundColor: colors.primary }]}>
                <IconSymbol name="plus.circle.fill" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <ThemedText type="title" style={styles.profileName}>
                {user?.name || 'User'}
              </ThemedText>
              <ThemedText style={styles.profileEmail}>
                {user?.email || 'user@example.com'}
              </ThemedText>
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.editButton,
              {
                backgroundColor: isEditing ? colors.error : colors.primary,
                borderColor: colors.border,
              },
            ]}
            onPress={isEditing ? handleSave : handleEditToggle}
            disabled={isLoading}
          >
            <ThemedText style={[styles.editButtonText, { color: '#FFFFFF' }]}>
              {isLoading ? 'Saving...' : (isEditing ? 'Save' : 'Edit')}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Profile Form */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Personal Information
          </ThemedText>
          
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Full Name *</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                placeholder="Enter your full name"
                placeholderTextColor={colors.placeholder}
                editable={isEditing}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                    opacity: 0.6,
                  },
                ]}
                value={user?.email || ''}
                placeholder="Email address"
                placeholderTextColor={colors.placeholder}
                editable={false}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <ThemedText style={styles.helperText}>
                Email cannot be changed
              </ThemedText>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Phone Number *</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.placeholder}
                editable={isEditing}
                keyboardType="phone-pad"
                autoComplete="tel"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Mobile Money Number *</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={formData.momo_number}
                onChangeText={(value) => updateFormData('momo_number', value)}
                placeholder="Enter your MoMo number"
                placeholderTextColor={colors.placeholder}
                editable={isEditing}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Address (Optional)</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={formData.address}
                onChangeText={(value) => updateFormData('address', value)}
                placeholder="Enter your address"
                placeholderTextColor={colors.placeholder}
                editable={isEditing}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Account Actions
          </ThemedText>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => router.push('/notifications')}
            >
              <IconSymbol
                name="bell.fill"
                size={24}
                color={colors.primary}
              />
              <View style={styles.actionText}>
                <ThemedText type="defaultSemiBold" style={styles.actionTitle}>
                  Notifications
                </ThemedText>
                <ThemedText style={styles.actionSubtitle}>
                  Manage notification preferences
                </ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => router.push('/help-support')}
            >
              <IconSymbol
                name="questionmark.circle.fill"
                size={24}
                color={colors.primary}
              />
              <View style={styles.actionText}>
                <ThemedText type="defaultSemiBold" style={styles.actionTitle}>
                  Help & Support
                </ThemedText>
                <ThemedText style={styles.actionSubtitle}>
                  Get help and contact support
                </ThemedText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => router.push('/terms-privacy')}
            >
              <IconSymbol
                name="doc.text.fill"
                size={24}
                color={colors.primary}
              />
              <View style={styles.actionText}>
                <ThemedText type="defaultSemiBold" style={styles.actionTitle}>
                  Terms & Privacy
                </ThemedText>
                <ThemedText style={styles.actionSubtitle}>
                  View terms of service and privacy policy
                </ThemedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              {
                backgroundColor: colors.error,
                borderColor: colors.border,
              },
            ]}
            onPress={handleLogout}
          >
            <IconSymbol
              name="rectangle.portrait.and.arrow.right"
              size={20}
              color="#FFFFFF"
            />
            <ThemedText style={[styles.logoutButtonText, { color: '#FFFFFF' }]}>
              Logout
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    opacity: 0.6,
  },
  actionsContainer: {
    gap: 12,
  },
  actionCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
