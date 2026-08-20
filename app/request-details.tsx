import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { apiService } from '@/services/api';
import { PickupRequest } from '@/types/request';

export default function RequestDetailsScreen() {
  const params = useLocalSearchParams<{ requestId?: string }>();
  const requestId = params.requestId ? parseInt(String(params.requestId), 10) : NaN;

  const [request, setRequest] = useState<PickupRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const loadDetails = useCallback(async () => {
    if (!Number.isFinite(requestId)) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await apiService.getRequestDetails(requestId);
      if (response.success && response.data) {
        setRequest(response.data);
      } else {
        if (response.error === 'Unauthorized') {
          router.replace('/(auth)/login');
          return;
        }
        console.error('Failed to load request details:', response.error);
      }
    } catch (error) {
      console.error('Error loading request details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDetails();
    setRefreshing(false);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GH', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const currency = (n: any) => `₵${Number(n ?? 0).toFixed(2)}`;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <ThemedView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Request Details
            </ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: colors.primary }]}>
              <IconSymbol name="list.bullet" size={16} color="#FFFFFF" />
              <ThemedText style={[styles.statusText, { color: '#FFFFFF' }]}>
                {request?.status?.replace('_', ' ') || '—'}
              </ThemedText>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.center}>
              <ThemedText>Loading details...</ThemedText>
            </View>
          ) : !request ? (
            <View style={styles.center}>
              <ThemedText>Request not found.</ThemedText>
            </View>
          ) : (
            <View style={styles.content}>
              {/* Meta */}
              <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <ThemedText type="defaultSemiBold" style={styles.label}>Request ID</ThemedText>
                <ThemedText style={styles.value}>#{request.id}</ThemedText>

                <ThemedText type="defaultSemiBold" style={[styles.label, styles.mt16]}>Created</ThemedText>
                <ThemedText style={styles.value}>{formatDateTime(request.created_at)}</ThemedText>

                <ThemedText type="defaultSemiBold" style={[styles.label, styles.mt16]}>Pickup Address</ThemedText>
                <ThemedText style={styles.value}>{request.pickup_address}</ThemedText>

                {!!(request as any).landmark && (
                  <>
                    <ThemedText type="defaultSemiBold" style={[styles.label, styles.mt16]}>Landmark</ThemedText>
                    <ThemedText style={styles.value}>{(request as any).landmark}</ThemedText>
                  </>
                )}
              </View>

              {/* Items */}
              <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <ThemedText type="subtitle" style={styles.cardTitle}>Items</ThemedText>
                {((request.items || []).length === 0) ? (
                  <ThemedText style={styles.placeholder}>No items</ThemedText>
                ) : (
                  <View style={styles.itemsContainer}>
                    {(request.items || []).map((it, idx) => (
                      <View key={idx} style={styles.itemRow}>
                        <ThemedText style={styles.itemText}>• Type #{it.waste_type_id}</ThemedText>
                        <ThemedText style={styles.itemText}>{Number((it as any).quantity ?? 0)} ×</ThemedText>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Summary */}
              <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <ThemedText type="subtitle" style={styles.cardTitle}>Summary</ThemedText>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>Payment Method</ThemedText>
                  <ThemedText style={styles.summaryValue}>{request.payment_method}</ThemedText>
                </View>
                <View style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>Total Amount</ThemedText>
                  <ThemedText style={styles.summaryValue}>{currency(request.total_amount)}</ThemedText>
                </View>
              </View>
            </View>
          )}
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
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  content: {
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
  },
  value: {
    fontSize: 14,
  },
  mt16: {
    marginTop: 16,
  },
  itemsContainer: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
  },
  placeholder: {
    fontSize: 14,
    opacity: 0.7,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
