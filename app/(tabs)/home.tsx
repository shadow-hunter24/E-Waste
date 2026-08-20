import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSubmitWaste = () => {
    router.push('/submit-waste');
  };

  const handleViewRequests = () => {
    router.push('/(tabs)/requests');
  };

  const handleViewPayments = () => {
    router.push('/(tabs)/payments');
  };

  const handleViewProfile = () => {
    router.push('/(tabs)/profile');
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
          <View style={styles.welcomeSection}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.logo, { color: '#FFFFFF' }]}>♻️</Text>
            </View>
            <View style={styles.welcomeText}>
              <ThemedText type="title" style={styles.welcomeTitle}>
                Welcome back!
              </ThemedText>
              <ThemedText style={styles.welcomeSubtitle}>
                {user?.name || 'User'}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          
          <TouchableOpacity
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.primary,
                borderColor: colors.border,
              },
            ]}
            onPress={handleSubmitWaste}
            accessibilityLabel="Submit waste button"
            accessibilityHint="Tap to submit new e-waste for pickup"
          >
            <View style={styles.actionContent}>
              <IconSymbol
                name="plus.circle.fill"
                size={32}
                color="#FFFFFF"
              />
              <View style={styles.actionText}>
                <ThemedText style={[styles.actionTitle, { color: '#FFFFFF' }]}>
                  Submit Waste
                </ThemedText>
                <ThemedText style={[styles.actionSubtitle, { color: '#FFFFFF', opacity: 0.9 }]}>
                  Schedule a pickup for your e-waste
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Your Activity
          </ThemedText>
          
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleViewRequests}
              accessibilityLabel="View requests"
              accessibilityHint="Tap to view your pickup requests"
            >
              <IconSymbol
                name="list.bullet"
                size={24}
                color={colors.primary}
              />
              <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                0
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                Active Requests
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleViewPayments}
              accessibilityLabel="View payments"
              accessibilityHint="Tap to view your payment history"
            >
              <IconSymbol
                name="creditcard.fill"
                size={24}
                color={colors.primary}
              />
              <ThemedText type="defaultSemiBold" style={styles.statNumber}>
                ₵0
              </ThemedText>
              <ThemedText style={styles.statLabel}>
                Total Earned
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Features
          </ThemedText>
          
          <View style={styles.featuresContainer}>
            <TouchableOpacity
              style={[
                styles.featureCard,
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
              <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
                Track Requests
              </ThemedText>
              <ThemedText style={styles.featureDescription}>
                Monitor your pickup status
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.featureCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleViewPayments}
            >
              <IconSymbol
                name="creditcard.fill"
                size={24}
                color={colors.primary}
              />
              <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
                Payment History
              </ThemedText>
              <ThemedText style={styles.featureDescription}>
                View your earnings
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.featureCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleViewProfile}
            >
              <IconSymbol
                name="person.fill"
                size={24}
                color={colors.primary}
              />
              <ThemedText type="defaultSemiBold" style={styles.featureTitle}>
                Profile
              </ThemedText>
              <ThemedText style={styles.featureDescription}>
                Manage your account
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <View style={[
            styles.infoCard,
            {
              backgroundColor: colors.accent,
              borderColor: colors.border,
            },
          ]}>
            <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
              ♻️ Why Recycle E-Waste?
            </ThemedText>
            <ThemedText style={styles.infoText}>
              Electronic waste contains valuable materials that can be recovered and reused. 
              By recycling, you help protect the environment and earn money for your efforts.
            </ThemedText>
          </View>
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
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 48,
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    marginBottom: 4,
  },
  welcomeSubtitle: {
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
  actionCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 20,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  featuresContainer: {
    gap: 12,
  },
  featureCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 16,
    marginLeft: 12,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    marginLeft: 12,
    opacity: 0.7,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
