import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { apiService } from '@/services/api';
import { router } from 'expo-router';
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

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiService.forgotPassword(trimmed);
      if (res.success) {
        Alert.alert(
          'Check Your Email',
          'If an account exists for this email, a reset link has been sent.',
          [
            { text: 'Back to Login', onPress: () => router.replace('/(auth)/login') },
          ]
        );
      } else {
        Alert.alert('Error', res.error || 'Unable to process request.');
      }
    } catch (e) {
      Alert.alert('Network Error', 'Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={[styles.logo, { color: colors.primary }]}>🔒</Text>
            <ThemedText type="title" style={styles.title}>
              Forgot Password
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Enter your email to receive a password reset link.
            </ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Email</ThemedText>
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
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                accessibilityLabel="Email input field"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: colors.primary,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
              accessibilityLabel="Send reset link"
              accessibilityHint="Sends a password reset link to your email"
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={() => router.replace('/(auth)/login')}>
              <ThemedText style={[styles.linkText, { color: colors.primary }]}>
                Back to Login
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
