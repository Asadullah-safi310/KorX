import React from 'react';
import { View, Text, TextInput, Switch, StyleSheet, ScrollView, Platform } from 'react-native';
import { useFormikContext } from 'formik';
import { useThemeColor } from '../../../../hooks/useThemeColor';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const StepPricing = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const theme = useThemeColor();

  const renderError = (field: string) => {
    if (touched[field] && errors[field]) {
      return <Text style={[styles.errorText, { color: theme.danger }]}>{errors[field] as string}</Text>;
    }
    return null;
  };

  const OptionCard = ({ type, label, isActive, onToggle, priceValue, priceField, placeholder }: any) => (
    <View style={[
      styles.optionCard, 
      { backgroundColor: theme.card, borderColor: isActive ? theme.primary : theme.border },
      isActive && { backgroundColor: theme.primary + '05' }
    ]}>
      <View style={styles.optionHeader}>
        <View style={styles.optionInfo}>
          <View style={[styles.typeIcon, { backgroundColor: isActive ? theme.primary + '15' : theme.border + '30' }]}>
            <MaterialCommunityIcons 
              name={type === 'sale' ? 'tag-outline' : 'calendar-clock-outline'} 
              size={24} 
              color={isActive ? theme.primary : theme.subtext} 
            />
          </View>
          <View>
            <Text style={[styles.optionLabel, { color: theme.text }]}>{label}</Text>
            <Text style={[styles.optionSub, { color: theme.subtext }]}>
              {isActive ? 'Currently active' : 'Tap to enable'}
            </Text>
          </View>
        </View>
        <Switch
          value={isActive}
          onValueChange={onToggle}
          trackColor={{ true: theme.primary, false: theme.border }}
          thumbColor={Platform.OS === 'ios' ? undefined : (isActive ? '#fff' : '#f4f3f4')}
        />
      </View>

      {isActive && (
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, { color: theme.text }]}>
            {type === 'sale' ? 'Expected Sale Price' : 'Monthly Rent'}
          </Text>
          <View style={[styles.priceInputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.currency, { color: theme.subtext }]}>Rs</Text>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={priceValue ? String(priceValue) : ''}
              onChangeText={(t) => setFieldValue(priceField, t)}
              keyboardType="numeric"
              placeholder={placeholder}
              placeholderTextColor={theme.subtext}
            />
          </View>
          {renderError(priceField)}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Pricing Strategy</Text>
      <Text style={[styles.sectionSubtitle, { color: theme.subtext }]}>
        How would you like to list your property? You can select one or both.
      </Text>

      <OptionCard
        type="sale"
        label="Available for Sale"
        isActive={values.is_available_for_sale}
        onToggle={(v: boolean) => setFieldValue('is_available_for_sale', v)}
        priceValue={values.sale_price}
        priceField="sale_price"
        placeholder="e.g. 15,000,000"
      />

      <OptionCard
        type="rent"
        label="Available for Rent"
        isActive={values.is_available_for_rent}
        onToggle={(v: boolean) => setFieldValue('is_available_for_rent', v)}
        priceValue={values.rent_price}
        priceField="rent_price"
        placeholder="e.g. 45,000"
      />

      {errors && (errors as any).atLeastOnePurpose && (
        <View style={[styles.globalError, { backgroundColor: theme.danger + '10', borderColor: theme.danger + '30' }]}>
          <Ionicons name="alert-circle-outline" size={20} color={theme.danger} />
          <Text style={[styles.globalErrorText, { color: theme.danger }]}>
            {(errors as any).atLeastOnePurpose}
          </Text>
        </View>
      )}

      <View style={[styles.infoBox, { backgroundColor: theme.border + '20' }]}>
        <Ionicons name="shield-checkmark-outline" size={20} color={theme.subtext} />
        <Text style={[styles.infoText, { color: theme.subtext }]}>
          Your pricing information is stored securely and can be updated at any time.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    paddingBottom: 120,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionSubtitle: { 
    fontSize: 14, 
    marginBottom: 24,
    marginTop: 2,
  },
  optionCard: {
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: { 
    fontSize: 16, 
    fontWeight: '700',
  },
  optionSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  priceContainer: { 
    marginTop: 20, 
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  priceLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 10,
    marginLeft: 4,
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  currency: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginRight: 10,
  },
  input: { 
    flex: 1, 
    fontSize: 18, 
    fontWeight: '700',
  },
  errorText: { 
    fontSize: 12, 
    marginTop: 6, 
    marginLeft: 4,
    fontWeight: '600',
  },
  globalError: { 
    flexDirection: 'row',
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center',
    borderWidth: 1,
    gap: 10,
    marginTop: 10,
  },
  globalErrorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginTop: 30,
    gap: 12,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  }
});

export default StepPricing;
