import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import '@/utils/suppressWebWarnings';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="notifications" 
            options={{ title: 'Notifications', presentation: 'modal' }} 
          />
          <Stack.Screen 
            name="help-support" 
            options={{ title: 'Help & Support', presentation: 'modal' }} 
          />
          <Stack.Screen 
            name="terms-privacy" 
            options={{ title: 'Terms & Privacy', presentation: 'modal' }} 
          />
          <Stack.Screen 
            name="request-details" 
            options={{ 
              title: 'Request Details',
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="submit-waste" 
            options={{ 
              title: 'Submit Waste',
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="payment" 
            options={{ 
              title: 'Payment',
              presentation: 'modal'
            }} 
          />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
