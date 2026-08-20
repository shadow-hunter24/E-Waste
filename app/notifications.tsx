import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>Notifications</ThemedText>
          <ThemedText style={styles.paragraph}>
            Manage your notification preferences here. You will be able to enable or disable updates about requests, payments, and promotions.
          </ThemedText>

          <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <ThemedText type="defaultSemiBold">Coming soon</ThemedText>
            <ThemedText style={styles.paragraph}>Notification settings will appear here.</ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  paragraph: { fontSize: 14, lineHeight: 20, opacity: 0.85 },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, marginTop: 16 },
});


