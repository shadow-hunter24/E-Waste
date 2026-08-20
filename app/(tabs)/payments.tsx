import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { apiService } from '@/services/api';
import { PickupRequest } from '@/types/request';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<PickupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getPaymentHistory();
      if (response.success && response.data) {
        setPayments(response.data);
      } else {
        if (response.error === 'Unauthorized') {
          // Token cleared already in api layer
          // Navigate to login
          // Lazy import to avoid circular deps
          router.replace('/(auth)/login');
          return;
        }
        console.error('Failed to load payments:', response.error);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
    setRefreshing(false);
  };

  const calculateTotalEarnings = () => {
    return payments
      .filter(payment => payment.status === 'COMPLETED')
      .reduce((total, payment) => total + Number(payment.total_amount ?? 0), 0);
  };

  const calculatePendingEarnings = () => {
    return payments
      .filter(payment => payment.status === 'ACCEPTED' || payment.status === 'ON_ROUTE')
      .reduce((total, payment) => total + Number(payment.total_amount ?? 0), 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const completedPayments = payments.filter(payment => payment.status === 'COMPLETED');
  const pendingPayments = payments.filter(payment => 
    payment.status === 'ACCEPTED' || payment.status === 'ON_ROUTE'
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading payments...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Payments & Earnings
          </ThemedText>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[
            styles.summaryCard,
            {
              backgroundColor: colors.success,
              borderColor: colors.border,
            },
          ]}>
            <IconSymbol
              name="creditcard.fill"
              size={24}
              color="#FFFFFF"
            />
            <ThemedText style={[styles.summaryAmount, { color: '#FFFFFF' }]}>
              ₵{calculateTotalEarnings().toFixed(2)}
            </ThemedText>
            <ThemedText style={[styles.summaryLabel, { color: '#FFFFFF', opacity: 0.9 }]}>
              Total Earned
            </ThemedText>
          </View>

          <View style={[
            styles.summaryCard,
            {
              backgroundColor: colors.warning,
              borderColor: colors.border,
            },
          ]}>
            <IconSymbol
              name="clock.fill"
              size={24}
              color="#FFFFFF"
            />
            <ThemedText style={[styles.summaryAmount, { color: '#FFFFFF' }]}>
              ₵{calculatePendingEarnings().toFixed(2)}
            </ThemedText>
            <ThemedText style={[styles.summaryLabel, { color: '#FFFFFF', opacity: 0.9 }]}>
              Pending
            </ThemedText>
          </View>
        </View>

        {/* Completed Payments */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Completed Payments ({completedPayments.length})
          </ThemedText>
          
          {completedPayments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol
                name="creditcard"
                size={48}
                color={colors.placeholder}
              />
              <ThemedText style={styles.emptyText}>
                No completed payments yet
              </ThemedText>
            </View>
          ) : (
            <View style={styles.paymentsContainer}>
              {completedPayments.map((payment) => (
                <View
                  key={payment.id}
                  style={[
                    styles.paymentCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.paymentHeader}>
                    <ThemedText type="defaultSemiBold" style={styles.paymentId}>
                      Request #{payment.id}
                    </ThemedText>
                    <ThemedText style={[styles.paymentAmount, { color: colors.success }]}>
                      +₵{Number(payment.total_amount ?? 0).toFixed(2)}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.paymentDetails}>
                    <ThemedText style={styles.paymentDate}>
                      {formatDate(payment.updated_at)}
                    </ThemedText>
                    <ThemedText style={styles.paymentMethod}>
                      💳 {payment.payment_method}
                    </ThemedText>
                  </View>
                  
                  <ThemedText style={styles.paymentItems} numberOfLines={1}>
                    {(payment.items || []).length} item{(payment.items || []).length !== 1 ? 's' : ''} • {payment.pickup_address}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Pending Payments */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Pending Payments ({pendingPayments.length})
          </ThemedText>
          
          {pendingPayments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <IconSymbol
                name="clock.fill"
                size={48}
                color={colors.placeholder}
              />
              <ThemedText style={styles.emptyText}>
                No pending payments
              </ThemedText>
            </View>
          ) : (
            <View style={styles.paymentsContainer}>
              {pendingPayments.map((payment) => (
                <View
                  key={payment.id}
                  style={[
                    styles.paymentCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.paymentHeader}>
                    <ThemedText type="defaultSemiBold" style={styles.paymentId}>
                      Request #{payment.id}
                    </ThemedText>
                    <ThemedText style={[styles.paymentAmount, { color: colors.warning }]}>
                      ₵{Number(payment.total_amount ?? 0).toFixed(2)}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.paymentDetails}>
                    <ThemedText style={styles.paymentDate}>
                      {formatDate(payment.created_at)}
                    </ThemedText>
                    <ThemedText style={[styles.paymentStatus, { color: colors.warning }]}>
                      ⏳ {payment.status.replace('_', ' ')}
                    </ThemedText>
                  </View>
                  
                  <ThemedText style={styles.paymentItems} numberOfLines={1}>
                    {(payment.items || []).length} item{(payment.items || []).length !== 1 ? 's' : ''} • {payment.pickup_address}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
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
              💰 Payment Information
            </ThemedText>
            <ThemedText style={styles.infoText}>
              • Payments are processed within 24-48 hours after pickup completion{'\n'}
              • Mobile Money payments are sent to your registered MoMo number{'\n'}
              • Cash payments are made directly to you during pickup{'\n'}
              • Contact support if you have any payment issues
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    opacity: 0.7,
  },
  paymentsContainer: {
    gap: 12,
  },
  paymentCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentId: {
    fontSize: 16,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  paymentMethod: {
    fontSize: 12,
    opacity: 0.7,
  },
  paymentStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  paymentItems: {
    fontSize: 12,
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
