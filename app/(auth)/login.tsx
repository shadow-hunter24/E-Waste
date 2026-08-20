import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link, router } from 'expo-router';
import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('saved_email');
      const savedPassword = await AsyncStorage.getItem('saved_password');
      const savedRememberMe = await AsyncStorage.getItem('remember_me');
      
      if (savedRememberMe === 'true' && savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    } catch (error) {
      console.error('Error loading saved credentials:', error);
    }
  };

  const saveCredentials = async () => {
    try {
      if (rememberMe) {
        await AsyncStorage.setItem('saved_email', email.trim());
        await AsyncStorage.setItem('saved_password', password);
        await AsyncStorage.setItem('remember_me', 'true');
      } else {
        await AsyncStorage.removeItem('saved_email');
        await AsyncStorage.removeItem('saved_password');
        await AsyncStorage.removeItem('remember_me');
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        await saveCredentials();
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
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
        >
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.primary }]}>♻️</Text>
          <ThemedText type="title" style={styles.title}>
            E-Waste Management
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Recycle responsibly, earn rewards
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

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Password</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Enter your password"
              placeholderTextColor={colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              accessibilityLabel="Password input field"
            />
          </View>

          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            accessibilityLabel="Remember me checkbox"
          >
            <View style={[
              styles.checkbox,
              {
                borderColor: colors.border,
                backgroundColor: rememberMe ? colors.primary : 'transparent',
              }
            ]}>
              {rememberMe && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <ThemedText style={styles.rememberMeText}>
              Remember me
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              {
                backgroundColor: colors.primary,
                opacity: isLoading ? 0.7 : 1,
              },
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            accessibilityLabel="Login button"
            accessibilityHint="Tap to sign in to your account"
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.links}>
            <Link href="/register" asChild>
              <TouchableOpacity style={styles.linkButton}>
                <ThemedText style={[styles.linkText, { color: colors.primary }]}>
                  Don't have an account? Sign Up
                </ThemedText>
              </TouchableOpacity>
            </Link>

            <Link href="/forgot-password" asChild>
              <TouchableOpacity style={styles.linkButton}>
                <ThemedText style={[styles.linkText, { color: colors.primary }]}>
                  Forgot Password?
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
  loginButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  links: {
    alignItems: 'center',
    gap: 12,
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberMeText: {
    fontSize: 14,
  },
  demoInfo: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  demoText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
});