import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpSupportScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const email = 'support@example.com';

  const mailto = () => Linking.openURL(`mailto:${email}`);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top','bottom']}>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>Help & Support</ThemedText>
          <ThemedText style={styles.paragraph}>
            Need assistance? Browse FAQs below or contact our support team.
          </ThemedText>

          <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <ThemedText type="defaultSemiBold">Contact us</ThemedText>
            <ThemedText style={styles.paragraph} onPress={mailto}>
              Email: {email}
            </ThemedText>
          </View>

          <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <ThemedText type="defaultSemiBold">FAQs (Coming soon)</ThemedText>
            <ThemedText style={styles.paragraph}>
              We will add frequently asked questions here.
            </ThemedText>
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


