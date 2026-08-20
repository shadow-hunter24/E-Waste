import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { apiService } from '@/services/api';
import { WasteType, WasteItem, WasteSubmissionForm } from '@/types/waste';

type FormStep = 'waste-selection' | 'details' | 'review';

export default function SubmitWasteScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [currentStep, setCurrentStep] = useState<FormStep>('waste-selection');
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
  const [selectedItems, setSelectedItems] = useState<WasteItem[]>([]);
  const [pickupAddress, setPickupAddress] = useState(user?.address || '');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'MOMO' | 'CASH'>('MOMO');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadWasteTypes();
  }, []);

  const loadWasteTypes = async () => {
    try {
      const response = await apiService.getWasteTypes();
      if (response.success && response.data) {
        setWasteTypes(response.data);
      }
    } catch (error) {
      console.error('Error loading waste types:', error);
    }
  };

  const addWasteItem = (wasteType: WasteType) => {
    const existingItem = selectedItems.find(item => item.waste_type_id === wasteType.id);
    
    if (existingItem) {
      setSelectedItems(prev => 
        prev.map(item => 
          item.waste_type_id === wasteType.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems(prev => [...prev, { waste_type_id: wasteType.id, quantity: 1 }]);
    }
  };

  const removeWasteItem = (wasteTypeId: number) => {
    setSelectedItems(prev => prev.filter(item => item.waste_type_id !== wasteTypeId));
  };

  const updateItemQuantity = (wasteTypeId: number, quantity: number) => {
    if (quantity <= 0) {
      removeWasteItem(wasteTypeId);
      return;
    }
    
    setSelectedItems(prev => 
      prev.map(item => 
        item.waste_type_id === wasteTypeId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getSelectedItemQuantity = (wasteTypeId: number) => {
    const item = selectedItems.find(item => item.waste_type_id === wasteTypeId);
    return item?.quantity || 0;
  };

  const calculateTotalAmount = () => {
    return selectedItems.reduce((total, item) => {
      const wasteType = wasteTypes.find(wt => wt.id === item.waste_type_id);
      if (wasteType) {
        return total + (wasteType.price_per_unit * item.quantity);
      }
      return total;
    }, 0);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 'waste-selection':
        return selectedItems.length > 0;
      case 'details':
        return pickupAddress.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (!canProceedToNextStep()) return;

    switch (currentStep) {
      case 'waste-selection':
        setCurrentStep('details');
        break;
      case 'details':
        setCurrentStep('review');
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'details':
        setCurrentStep('waste-selection');
        break;
      case 'review':
        setCurrentStep('details');
        break;
    }
  };

  const handleSubmit = async () => {
    if (!canProceedToNextStep()) return;

    setIsSubmitting(true);
    try {
      const formData: WasteSubmissionForm = {
        pickup_address: pickupAddress.trim(),
        landmark: landmark.trim() || undefined,
        items: selectedItems,
        payment_method: paymentMethod,
        notes: notes.trim() || undefined,
      };

      const response = await apiService.createRequest(formData);
      
      if (response.success) {
        Alert.alert(
          'Success!',
          'Your waste pickup request has been submitted successfully. You will receive a confirmation shortly.',
          [
            {
              text: 'View Request',
              onPress: () => {
                router.push(`/request-details?requestId=${response.data?.id}`);
              },
            },
            {
              text: 'View All Requests',
              onPress: () => router.push('/(tabs)/requests'),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to submit request. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderWasteSelectionStep = () => (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.stepTitle}>
        Select Waste Items
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        Choose the types and quantities of e-waste you want to recycle
      </ThemedText>

      <View style={styles.wasteTypesContainer}>
        {wasteTypes.map((wasteType) => {
          const quantity = getSelectedItemQuantity(wasteType.id);
          const isSelected = quantity > 0;
          
          return (
            <View
              key={wasteType.id}
              style={[
                styles.wasteTypeCard,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <View style={styles.wasteTypeHeader}>
                <ThemedText
                  type="defaultSemiBold"
                  style={[
                    styles.wasteTypeName,
                    { color: isSelected ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {wasteType.name}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.wasteTypePrice,
                    { color: isSelected ? '#FFFFFF' : colors.primary },
                  ]}
                >
                  ₵{wasteType.price_per_unit}/{wasteType.unit}
                </ThemedText>
              </View>
              
              <ThemedText
                style={[
                  styles.wasteTypeDescription,
                  { color: isSelected ? '#FFFFFF' : colors.text, opacity: isSelected ? 0.9 : 0.7 },
                ]}
              >
                {wasteType.description}
              </ThemedText>

              {isSelected ? (
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={[styles.quantityButton, { backgroundColor: '#FFFFFF' }]}
                    onPress={() => updateItemQuantity(wasteType.id, quantity - 1)}
                  >
                    <IconSymbol name="xmark.circle.fill" size={16} color={colors.primary} />
                  </TouchableOpacity>
                  
                  <ThemedText
                    style={[styles.quantityText, { color: colors.primary }]}
                  >
                    {quantity} {wasteType.unit}
                  </ThemedText>
                  
                  <TouchableOpacity
                    style={[styles.quantityButton, { backgroundColor: '#FFFFFF' }]}
                    onPress={() => updateItemQuantity(wasteType.id, quantity + 1)}
                  >
                    <IconSymbol name="plus.circle.fill" size={16} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.addButton, { borderColor: colors.primary }]}
                  onPress={() => addWasteItem(wasteType)}
                >
                  <IconSymbol name="plus.circle.fill" size={16} color={colors.primary} />
                  <ThemedText style={[styles.addButtonText, { color: colors.primary }]}>
                    Add Item
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      {selectedItems.length > 0 && (
        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <ThemedText type="defaultSemiBold" style={styles.summaryTitle}>
            Selected Items
          </ThemedText>
          {selectedItems.map((item) => {
            const wasteType = wasteTypes.find(wt => wt.id === item.waste_type_id);
            if (!wasteType) return null;
            
            return (
              <View key={item.waste_type_id} style={styles.summaryItem}>
                <ThemedText style={styles.summaryItemText}>
                  {wasteType.name} - {item.quantity} {wasteType.unit}
                </ThemedText>
                <ThemedText style={[styles.summaryItemPrice, { color: colors.primary }]}>
                  ₵{(wasteType.price_per_unit * item.quantity).toFixed(2)}
                </ThemedText>
              </View>
            );
          })}
          <View style={styles.summaryTotal}>
            <ThemedText type="defaultSemiBold" style={styles.summaryTotalText}>
              Total: ₵{calculateTotalAmount().toFixed(2)}
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );

  const renderDetailsStep = () => (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.stepTitle}>
        Pickup Details
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        Provide pickup location and payment information
      </ThemedText>

      <View style={styles.formSection}>
        <ThemedText style={styles.label}>Pickup Address *</ThemedText>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Enter your full address"
          placeholderTextColor={colors.placeholder}
          value={pickupAddress}
          onChangeText={setPickupAddress}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.formSection}>
        <ThemedText style={styles.label}>Landmark (Optional)</ThemedText>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="e.g., Near the blue gate, Behind the church"
          placeholderTextColor={colors.placeholder}
          value={landmark}
          onChangeText={setLandmark}
        />
      </View>

      <View style={styles.formSection}>
        <ThemedText style={styles.label}>Payment Method *</ThemedText>
        <View style={styles.paymentOptions}>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              {
                backgroundColor: paymentMethod === 'MOMO' ? colors.primary : colors.surface,
                borderColor: paymentMethod === 'MOMO' ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setPaymentMethod('MOMO')}
          >
            <IconSymbol
              name="iphone"
              size={20}
              color={paymentMethod === 'MOMO' ? '#FFFFFF' : colors.primary}
            />
            <ThemedText
              style={[
                styles.paymentOptionText,
                { color: paymentMethod === 'MOMO' ? '#FFFFFF' : colors.text },
              ]}
            >
              Mobile Money
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              {
                backgroundColor: paymentMethod === 'CASH' ? colors.primary : colors.surface,
                borderColor: paymentMethod === 'CASH' ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setPaymentMethod('CASH')}
          >
            <IconSymbol
              name="creditcard.fill"
              size={20}
              color={paymentMethod === 'CASH' ? '#FFFFFF' : colors.primary}
            />
            <ThemedText
              style={[
                styles.paymentOptionText,
                { color: paymentMethod === 'CASH' ? '#FFFFFF' : colors.text },
              ]}
            >
              Cash
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formSection}>
        <ThemedText style={styles.label}>Additional Notes (Optional)</ThemedText>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Any special instructions or additional information"
          placeholderTextColor={colors.placeholder}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.stepContainer}>
      <ThemedText type="subtitle" style={styles.stepTitle}>
        Review & Submit
      </ThemedText>
      <ThemedText style={styles.stepDescription}>
        Review your request details before submitting
      </ThemedText>

      <View style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <ThemedText type="defaultSemiBold" style={styles.reviewSectionTitle}>
          Selected Items
        </ThemedText>
        {selectedItems.map((item) => {
          const wasteType = wasteTypes.find(wt => wt.id === item.waste_type_id);
          if (!wasteType) return null;
          
          return (
            <View key={item.waste_type_id} style={styles.reviewItem}>
              <View style={styles.reviewItemLeft}>
                <ThemedText type="defaultSemiBold" style={styles.reviewItemName}>
                  {wasteType.name}
                </ThemedText>
                <ThemedText style={styles.reviewItemDetails}>
                  {item.quantity} {wasteType.unit} × ₵{wasteType.price_per_unit}
                </ThemedText>
              </View>
              <ThemedText style={[styles.reviewItemPrice, { color: colors.primary }]}>
                ₵{(wasteType.price_per_unit * item.quantity).toFixed(2)}
              </ThemedText>
            </View>
          );
        })}

        <View style={styles.reviewDivider} />

        <ThemedText type="defaultSemiBold" style={styles.reviewSectionTitle}>
          Pickup Details
        </ThemedText>
        <View style={styles.reviewDetail}>
          <ThemedText style={styles.reviewDetailLabel}>Address:</ThemedText>
          <ThemedText style={styles.reviewDetailValue}>{pickupAddress}</ThemedText>
        </View>
        {landmark && (
          <View style={styles.reviewDetail}>
            <ThemedText style={styles.reviewDetailLabel}>Landmark:</ThemedText>
            <ThemedText style={styles.reviewDetailValue}>{landmark}</ThemedText>
          </View>
        )}
        <View style={styles.reviewDetail}>
          <ThemedText style={styles.reviewDetailLabel}>Payment:</ThemedText>
          <ThemedText style={styles.reviewDetailValue}>{paymentMethod}</ThemedText>
        </View>

        <View style={styles.reviewDivider} />

        <View style={styles.reviewTotal}>
          <ThemedText type="title" style={styles.reviewTotalLabel}>
            Total Amount
          </ThemedText>
          <ThemedText type="title" style={[styles.reviewTotalAmount, { color: colors.primary }]}>
            ₵{calculateTotalAmount().toFixed(2)}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepDots}>
        <View
          style={[
            styles.stepDot,
            {
              backgroundColor: currentStep === 'waste-selection' ? colors.primary : colors.border,
            },
          ]}
        />
        <View
          style={[
            styles.stepDot,
            {
              backgroundColor: currentStep === 'details' ? colors.primary : colors.border,
            },
          ]}
        />
        <View
          style={[
            styles.stepDot,
            {
              backgroundColor: currentStep === 'review' ? colors.primary : colors.border,
            },
          ]}
        />
      </View>
      <ThemedText style={styles.stepText}>
        Step {currentStep === 'waste-selection' ? 1 : currentStep === 'details' ? 2 : 3} of 3
      </ThemedText>
    </View>
  );

  const renderNavigationButtons = () => (
    <View style={styles.navigationButtons}>
      {currentStep !== 'waste-selection' && (
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.secondaryButton,
            { borderColor: colors.border },
          ]}
          onPress={handlePreviousStep}
        >
          <ThemedText style={[styles.navButtonText, { color: colors.text }]}>
            Back
          </ThemedText>
        </TouchableOpacity>
      )}

      {currentStep !== 'review' ? (
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.primaryButton,
            {
              backgroundColor: canProceedToNextStep() ? colors.primary : colors.border,
              opacity: canProceedToNextStep() ? 1 : 0.5,
            },
          ]}
          onPress={handleNextStep}
          disabled={!canProceedToNextStep()}
        >
          <ThemedText style={[styles.navButtonText, { color: '#FFFFFF' }]}>
            Next
          </ThemedText>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.primaryButton,
            {
              backgroundColor: colors.primary,
              opacity: isSubmitting ? 0.7 : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <ThemedText style={[styles.navButtonText, { color: '#FFFFFF' }]}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.right" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <ThemedText style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            Submit Waste
          </ThemedText>
          <View style={styles.headerSpacer} />
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {currentStep === 'waste-selection' && renderWasteSelectionStep()}
          {currentStep === 'details' && renderDetailsStep()}
          {currentStep === 'review' && renderReviewStep()}
        </ScrollView>

        {/* Navigation */}
        {renderNavigationButtons()}
      </KeyboardAvoidingView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  stepIndicator: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  stepDots: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  stepText: {
    fontSize: 14,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 24,
  },
  wasteTypesContainer: {
    gap: 16,
  },
  wasteTypeCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  wasteTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wasteTypeName: {
    fontSize: 16,
    flex: 1,
  },
  wasteTypePrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  wasteTypeDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginTop: 16,
  },
  summaryTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryItemText: {
    fontSize: 14,
    flex: 1,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
    marginTop: 8,
  },
  summaryTotalText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
  },
  reviewSectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewItemLeft: {
    flex: 1,
  },
  reviewItemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  reviewItemDetails: {
    fontSize: 14,
    opacity: 0.7,
  },
  reviewItemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 16,
  },
  reviewDetail: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 80,
  },
  reviewDetailValue: {
    fontSize: 14,
    flex: 1,
  },
  reviewTotal: {
    alignItems: 'center',
    marginTop: 16,
  },
  reviewTotalLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  reviewTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  navButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
