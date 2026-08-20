import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SubmitScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSubmitWaste = () => {
    router.push('/submit-waste');
  };

  const handleViewRequests = () => {
    router.push('/(tabs)/requests');
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
          <ThemedText type="title" style={styles.title}>
            Submit E-Waste
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Turn your electronic waste into cash
          </ThemedText>
        </View>

        {/* Main Action */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.mainActionCard,
              {
                backgroundColor: colors.primary,
                borderColor: colors.border,
              },
            ]}
            onPress={handleSubmitWaste}
            accessibilityLabel="Submit new waste"
            accessibilityHint="Tap to start submitting e-waste for pickup"
          >
            <View style={styles.mainActionContent}>
              <IconSymbol
                name="plus.circle.fill"
                size={48}
                color="#FFFFFF"
              />
              <View style={styles.mainActionText}>
                <ThemedText style={[styles.mainActionTitle, { color: '#FFFFFF' }]}>
                  Submit New Request
                </ThemedText>
                <ThemedText style={[styles.mainActionSubtitle, { color: '#FFFFFF', opacity: 0.9 }]}>
                  Schedule a pickup for your e-waste and get paid
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Process Steps */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            How It Works
          </ThemedText>
          
          <View style={styles.stepsContainer}>
            <View style={[
              styles.stepCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <ThemedText style={[styles.stepNumberText, { color: '#FFFFFF' }]}>
                  1
                </ThemedText>
              </View>
              <View style={styles.stepContent}>
                <ThemedText type="defaultSemiBold" style={styles.stepTitle}>
                  Select Items
                </ThemedText>
                <ThemedText style={styles.stepDescription}>
                  Choose the types and quantities of e-waste you want to recycle
                </ThemedText>
              </View>
            </View>

            <View style={[
              styles.stepCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <ThemedText style={[styles.stepNumberText, { color: '#FFFFFF' }]}>
                  2
                </ThemedText>
              </View>
              <View style={styles.stepContent}>
                <ThemedText type="defaultSemiBold" style={styles.stepTitle}>
                  Get Quote
                </ThemedText>
                <ThemedText style={styles.stepDescription}>
                  Receive an instant quote based on current market prices
                </ThemedText>
              </View>
            </View>

            <View style={[
              styles.stepCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <ThemedText style={[styles.stepNumberText, { color: '#FFFFFF' }]}>
                  3
                </ThemedText>
              </View>
              <View style={styles.stepContent}>
                <ThemedText type="defaultSemiBold" style={styles.stepTitle}>
                  Schedule Pickup
                </ThemedText>
                <ThemedText style={styles.stepDescription}>
                  Choose your preferred pickup location and time
                </ThemedText>
              </View>
            </View>

            <View style={[
              styles.stepCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <ThemedText style={[styles.stepNumberText, { color: '#FFFFFF' }]}>
                  4
                </ThemedText>
              </View>
              <View style={styles.stepContent}>
                <ThemedText type="defaultSemiBold" style={styles.stepTitle}>
                  Get Paid
                </ThemedText>
                <ThemedText style={styles.stepDescription}>
                  Receive payment via Mobile Money or cash on pickup
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Accepted Items */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Accepted Items
          </ThemedText>
          
          <View style={styles.itemsContainer}>
            <View style={[
              styles.itemCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
              <IconSymbol
                name="laptopcomputer"
                size={24}
                color={colors.primary}
              />
              <ThemedText type="defaultSemiBold" style={styles.itemTitle}>
                Computers & Laptops
              </ThemedText>
            </View>

            <View style={[
              styles.itemCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
              <IconSymbol
                name="iphone"
                size={24}
                color={colors.primary}
              />
              <ThemedText type="defaultSemiBold" style={styles.itemTitle}>
                Mobile Phones
              </ThemedText>
            </View>

            <View style={[
              styles.itemCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
              <IconSymbol
                name="tv"
                size={24}
                color={colors.primary}
              />
              <ThemedText type="defaultSemiBold" style={styles.itemTitle}>
                TVs & Monitors
              </ThemedText>
            </View>

            <View style={[
              styles.itemCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
              <IconSymbol
                name="battery.100"
                size={24}
                color={colors.primary}
              />
              <ThemedText type="defaultSemiBold" style={styles.itemTitle}>
                Batteries
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.quickActionCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={handleViewRequests}
          >
            <IconSymbol
              name="list.bullet"
              size={24}
              color={colors.primary}
            />
            <View style={styles.quickActionText}>
              <ThemedText type="defaultSemiBold" style={styles.quickActionTitle}>
                View My Requests
              </ThemedText>
              <ThemedText style={styles.quickActionSubtitle}>
                Track your pickup status and history
              </ThemedText>
            </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  mainActionCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
  },
  mainActionContent: {
    alignItems: 'center',
  },
  mainActionText: {
    marginTop: 16,
    alignItems: 'center',
  },
  mainActionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  mainActionSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  stepsContainer: {
    gap: 16,
  },
  stepCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  quickActionCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickActionText: {
    marginLeft: 16,
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
});
