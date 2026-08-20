import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    momo_number: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }

    if (!formData.momo_number.trim()) {
      Alert.alert('Error', 'Please enter your Mobile Money number');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        momo_number: formData.momo_number.trim(),
        address: formData.address.trim() || undefined,
      };

      const result = await register(userData);
      if (result.success) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
      } else {
        Alert.alert('Registration Failed', result.error || 'Failed to create account');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.primary }]}>♻️</Text>
          <ThemedText type="title" style={styles.title}>
            Create Account
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Join us in making the world greener
          </ThemedText>
        </View>

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
              placeholder="Enter your full name"
              placeholderTextColor={colors.placeholder}
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              autoCapitalize="words"
              autoCorrect={false}
              accessibilityLabel="Full name input field"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Email *</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.placeholder}
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              accessibilityLabel="Email input field"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Password *</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter your password (min 6 characters)"
              placeholderTextColor={colors.placeholder}
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Password input field"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Confirm Password *</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Confirm your password"
              placeholderTextColor={colors.placeholder}
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Confirm password input field"
            />
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
              placeholder="Enter your phone number"
              placeholderTextColor={colors.placeholder}
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              keyboardType="phone-pad"
              autoComplete="tel"
              accessibilityLabel="Phone number input field"
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
              placeholder="Enter your MoMo number"
              placeholderTextColor={colors.placeholder}
              value={formData.momo_number}
              onChangeText={(value) => updateFormData('momo_number', value)}
              keyboardType="phone-pad"
              accessibilityLabel="Mobile money number input field"
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
              placeholder="Enter your address"
              placeholderTextColor={colors.placeholder}
              value={formData.address}
              onChangeText={(value) => updateFormData('address', value)}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              accessibilityLabel="Address input field"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.registerButton,
              {
                backgroundColor: colors.primary,
                opacity: isLoading ? 0.7 : 1,
              },
            ]}
            onPress={handleRegister}
            disabled={isLoading}
            accessibilityLabel="Register button"
            accessibilityHint="Tap to create your account"
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.links}>
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.linkButton}>
                <ThemedText style={[styles.linkText, { color: colors.primary }]}>
                  Already have an account? Sign In
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  registerButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  links: {
    alignItems: 'center',
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
