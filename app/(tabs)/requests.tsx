import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { apiService } from '@/services/api';
import { PickupRequest, RequestStatus } from '@/types/request';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RequestsScreen() {
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadRequests();
  }, []);

  // Refresh requests when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getRequests();
      if (response.success && response.data) {
        setRequests(response.data);
      } else {
        if (response.error === 'Unauthorized') {
          router.replace('/(auth)/login');
          return;
        }
        console.error('Failed to load requests:', response.error);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING':
        return colors.warning;
      case 'ACCEPTED':
        return colors.primary;
      case 'ON_ROUTE':
        return colors.secondary;
      case 'COMPLETED':
        return colors.success;
      case 'REJECTED':
        return colors.error;
      default:
        return colors.placeholder;
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case 'PENDING':
        return 'clock.fill';
      case 'ACCEPTED':
        return 'checkmark.seal.fill';
      case 'ON_ROUTE':
        return 'paperplane.fill';
      case 'COMPLETED':
        return 'checkmark.seal.fill';
      case 'REJECTED':
        return 'xmark.circle.fill';
      default:
        return 'clock.fill';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRequestPress = (requestId: number) => {
    router.push({
      pathname: '/request-details',
      params: { requestId },
    });
  };

  const handleSubmitNew = () => {
    router.push('/submit-waste');
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading requests...</ThemedText>
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
            Pickup Requests
          </ThemedText>
          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={handleSubmitNew}
            accessibilityLabel="Submit new waste"
            accessibilityHint="Tap to submit new e-waste for pickup"
          >
            <IconSymbol
              name="plus.circle.fill"
              size={20}
              color="#FFFFFF"
            />
            <ThemedText style={[styles.submitButtonText, { color: '#FFFFFF' }]}>
              New Request
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Requests List */}
        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol
              name="list.bullet"
              size={64}
              color={colors.placeholder}
            />
            <ThemedText type="subtitle" style={styles.emptyTitle}>
              No Requests Yet
            </ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Submit your first e-waste pickup request to get started
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.emptyButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleSubmitNew}
            >
              <ThemedText style={[styles.emptyButtonText, { color: '#FFFFFF' }]}>
                Submit First Request
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.requestsContainer}>
            {requests.map((request) => (
              <TouchableOpacity
                key={request.id}
                style={[
                  styles.requestCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => handleRequestPress(request.id)}
                accessibilityLabel={`Request ${request.id} - ${request.status}`}
                accessibilityHint="Tap to view request details"
              >
                <View style={styles.requestHeader}>
                  <View style={styles.requestInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.requestId}>
                      Request #{request.id}
                    </ThemedText>
                    <ThemedText style={styles.requestDate}>
                      {formatDate(request.created_at)}
                    </ThemedText>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(request.status) },
                  ]}>
                    <IconSymbol
                      name={getStatusIcon(request.status)}
                      size={16}
                      color="#FFFFFF"
                    />
                    <ThemedText style={[styles.statusText, { color: '#FFFFFF' }]}>
                      {request.status.replace('_', ' ')}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.requestDetails}>
                  <ThemedText style={styles.address} numberOfLines={2}>
                    📍 {request.pickup_address}
                  </ThemedText>
                  <ThemedText style={styles.amount}>
                    💰 ₵{Number(request.total_amount ?? 0).toFixed(2)}
                  </ThemedText>
                </View>

                <View style={styles.requestFooter}>
                  <ThemedText style={styles.itemsCount}>
                    {((request.items || []).length)} item{((request.items || []).length) !== 1 ? 's' : ''}
                  </ThemedText>
                  <ThemedText style={styles.paymentMethod}>
                    💳 {request.payment_method}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  requestsContainer: {
    gap: 16,
  },
  requestCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestId: {
    fontSize: 16,
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  requestDetails: {
    marginBottom: 12,
  },
  address: {
    fontSize: 14,
    marginBottom: 6,
    opacity: 0.8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsCount: {
    fontSize: 12,
    opacity: 0.7,
  },
  paymentMethod: {
    fontSize: 12,
    opacity: 0.7,
  },
});
