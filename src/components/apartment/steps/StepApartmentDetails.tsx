import React from 'react';
import { 
  View, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
} from 'react-native';
import { useFormikContext } from 'formik';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppText } from '../../AppText';

const StepApartmentDetails = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const theme = useThemeColor();

  const renderError = (field: string) => {
    if (touched[field] && errors[field]) {
      return <AppText variant="caption" weight="semiBold" style={[{ color: theme.danger }, styles.errorText]}>{errors[field] as string}</AppText>;
    }
    return null;
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <AppText variant="h2" weight="bold" style={{ color: theme.text }}>Apartment Details</AppText>
      <AppText variant="small" style={[{ color: theme.subtext }, styles.sectionSubtitle]}>
        Provide the basic information about your apartment building.
      </AppText>

      <View style={styles.inputGroup}>
        <AppText variant="caption" weight="semiBold" style={{ color: theme.text }}>Apartment Name</AppText>
        <View style={[styles.textInputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="office-building" size={20} color={theme.subtext} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={values.apartment_name}
            onChangeText={(t) => setFieldValue('apartment_name', t)}
            placeholder="e.g. Laghman Tower"
            placeholderTextColor={theme.subtext}
          />
        </View>
        {renderError('apartment_name')}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <AppText variant="caption" weight="semiBold" style={{ color: theme.text }}>Total Floors</AppText>
          <View style={[styles.textInputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="layers-outline" size={20} color={theme.subtext} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={values.total_floors?.toString() || ''}
              onChangeText={(t) => setFieldValue('total_floors', t)}
              placeholder="e.g. 10"
              placeholderTextColor={theme.subtext}
              keyboardType="numeric"
            />
          </View>
          {renderError('total_floors')}
        </View>

        <View style={[styles.inputGroup, { flex: 1 }]}>
          <AppText variant="caption" weight="semiBold" style={{ color: theme.text }}>Total Homes/Units</AppText>
          <View style={[styles.textInputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialCommunityIcons name="home-outline" size={20} color={theme.subtext} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={values.total_units?.toString() || ''}
              onChangeText={(t) => setFieldValue('total_units', t)}
              placeholder="e.g. 50"
              placeholderTextColor={theme.subtext}
              keyboardType="numeric"
            />
          </View>
          {renderError('total_units')}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <AppText variant="caption" weight="semiBold" style={{ color: theme.text }}>Building Description</AppText>
        <View style={[styles.textInputContainer, styles.textAreaContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TextInput
            style={[styles.input, styles.textArea, { color: theme.text }]}
            value={values.description}
            onChangeText={(t) => setFieldValue('description', t)}
            placeholder="Describe the building, its history, and unique features..."
            placeholderTextColor={theme.subtext}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
        {renderError('description')}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 120, paddingHorizontal: 20, paddingTop: 10 },
  row: { flexDirection: 'row', gap: 12 },
  sectionSubtitle: { marginBottom: 20, marginTop: 2 },
  inputGroup: { marginBottom: 20, gap: 8 },
  textInputContainer: { flexDirection: 'row', alignItems: 'center', height: 56, borderWidth: 1.5, borderRadius: 16, paddingHorizontal: 16 },
  textAreaContainer: { height: 120, alignItems: 'flex-start', paddingVertical: 12 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, height: '100%' },
  textArea: { height: 100 },
  errorText: { marginTop: 4, marginLeft: 4 },
});

export default StepApartmentDetails;
