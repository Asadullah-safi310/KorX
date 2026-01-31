import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useFormikContext } from 'formik';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppText } from '../../AppText';

const FacilityToggle = ({ label, icon, value, onToggle }: any) => {
  const theme = useThemeColor();
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => onToggle(!value)}
      style={[
        styles.facilityItem, 
        { backgroundColor: theme.card, borderColor: theme.border },
        value && { borderColor: theme.primary, backgroundColor: theme.primary + '08' }
      ]}
    >
      <View style={[styles.facilityIcon, { backgroundColor: value ? theme.primary : theme.border + '30' }]}>
        <MaterialCommunityIcons name={icon} size={22} color={value ? '#fff' : theme.subtext} />
      </View>
      <AppText weight="bold" style={{ color: value ? theme.primary : theme.text }}>{label}</AppText>
      <View style={[styles.checkbox, { borderColor: value ? theme.primary : theme.border }]}>
        {value && <Ionicons name="checkmark" size={14} color={theme.primary} />}
      </View>
    </TouchableOpacity>
  );
};

const StepApartmentFacilities = () => {
  const { values, setFieldValue } = useFormikContext<any>();
  const theme = useThemeColor();

  const handleToggle = (key: string, value: boolean) => {
    setFieldValue(`facilities.${key}`, value);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <AppText variant="h2" weight="bold" style={{ color: theme.text }}>Facilities</AppText>
      <AppText variant="small" style={[{ color: theme.subtext }, styles.sectionSubtitle]}>
        Select the amenities available in the building.
      </AppText>

      <View style={styles.facilitiesGrid}>
        <FacilityToggle 
          label="Elevator / Lift" 
          icon="elevator" 
          value={values.facilities.lift} 
          onToggle={(v: boolean) => handleToggle('lift', v)} 
        />
        <FacilityToggle 
          label="Parking Space" 
          icon="car-multiple" 
          value={values.facilities.parking} 
          onToggle={(v: boolean) => handleToggle('parking', v)} 
        />
        <FacilityToggle 
          label="Backup Generator" 
          icon="engine" 
          value={values.facilities.generator} 
          onToggle={(v: boolean) => handleToggle('generator', v)} 
        />
        <FacilityToggle 
          label="24/7 Security" 
          icon="shield-check" 
          value={values.facilities.security} 
          onToggle={(v: boolean) => handleToggle('security', v)} 
        />
        <FacilityToggle 
          label="Solar System" 
          icon="solar-power" 
          value={values.facilities.solar} 
          onToggle={(v: boolean) => handleToggle('solar', v)} 
        />
      </View>

      <View style={styles.inputGroup}>
        <AppText variant="caption" weight="semiBold" style={{ color: theme.text }}>Other Facilities</AppText>
        <View style={[styles.textInputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={values.facilities.others}
            onChangeText={(t) => setFieldValue('facilities.others', t)}
            placeholder="e.g. Gym, Swimming Pool, Rooftop Garden..."
            placeholderTextColor={theme.subtext}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 120, paddingHorizontal: 20, paddingTop: 10 },
  sectionSubtitle: { marginBottom: 20, marginTop: 2 },
  facilitiesGrid: { gap: 12, marginBottom: 24 },
  facilityItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1.5, gap: 12 },
  facilityIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginLeft: 'auto' },
  inputGroup: { gap: 8 },
  textInputContainer: { height: 56, borderWidth: 1.5, borderRadius: 16, paddingHorizontal: 16, justifyContent: 'center' },
  input: { fontSize: 16 },
});

export default StepApartmentFacilities;
