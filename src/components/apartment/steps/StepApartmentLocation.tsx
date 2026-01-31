import React, { useEffect, useState } from 'react';
import { 
  View, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
} from 'react-native';
import { useFormikContext } from 'formik';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { locationService } from '../../../services/location.service';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../AppText';
import Selector from '../../Selector';

const StepApartmentLocation = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const theme = useThemeColor();

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (values.province_id) {
      fetchDistricts(values.province_id);
    } else {
      setDistricts([]);
      setFieldValue('district_id', '');
    }
  }, [values.province_id, setFieldValue]);

  useEffect(() => {
    if (values.district_id) {
      fetchAreas(values.district_id);
    } else {
      setAreas([]);
      setFieldValue('area_id', '');
    }
  }, [values.district_id, setFieldValue]);

  const fetchProvinces = async () => {
    setLoadingProvinces(true);
    try {
      const res = await locationService.getProvinces();
      setProvinces(res.data);
    } catch (err) {
      console.error('Failed to fetch provinces', err);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const fetchDistricts = async (provinceId: string) => {
    setLoadingDistricts(true);
    try {
      const res = await locationService.getDistricts(provinceId);
      setDistricts(res.data);
    } catch (err) {
      console.error('Failed to fetch districts', err);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const fetchAreas = async (districtId: string) => {
    setLoadingAreas(true);
    try {
      const res = await locationService.getAreas(districtId);
      setAreas(res.data);
    } catch (err) {
      console.error('Failed to fetch areas', err);
    } finally {
      setLoadingAreas(false);
    }
  };

  const renderError = (field: string) => {
    if (touched[field] && errors[field]) {
      return <AppText variant="caption" weight="semiBold" style={[{ color: theme.danger }, styles.errorText]}>{errors[field] as string}</AppText>;
    }
    return null;
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <AppText variant="h2" weight="bold" style={{ color: theme.text }}>Location</AppText>
      <AppText variant="small" style={[{ color: theme.subtext }, styles.sectionSubtitle]}>
        Where is this apartment building located?
      </AppText>

      <Selector
        label="Province / City"
        value={values.province_id}
        options={provinces}
        onSelect={(id: string) => setFieldValue('province_id', id)}
        placeholder="Select Province"
        error={touched.province_id && errors.province_id}
        loading={loadingProvinces}
        icon="map-outline"
      />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Selector
            label="District"
            value={values.district_id}
            options={districts}
            onSelect={(id: string) => setFieldValue('district_id', id)}
            placeholder="District"
            error={touched.district_id && errors.district_id}
            loading={loadingDistricts}
            icon="business-outline"
          />
        </View>
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
          <Selector
            label="Area"
            value={values.area_id}
            options={areas}
            onSelect={(id: string) => setFieldValue('area_id', id)}
            placeholder="Area"
            error={touched.area_id && errors.area_id}
            loading={loadingAreas}
            icon="navigate-outline"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <AppText variant="caption" weight="semiBold" style={{ color: theme.text }}>Exact Address</AppText>
        <View style={[styles.textInputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="location-outline" size={20} color={theme.subtext} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            value={values.address}
            onChangeText={(t) => setFieldValue('address', t)}
            placeholder="Street address, nearby landmark..."
            placeholderTextColor={theme.subtext}
          />
        </View>
        {renderError('address')}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 120, paddingHorizontal: 20, paddingTop: 10 },
  sectionSubtitle: { marginBottom: 20, marginTop: 2 },
  row: { flexDirection: 'row' },
  inputGroup: { marginBottom: 20, gap: 8 },
  textInputContainer: { flexDirection: 'row', alignItems: 'center', height: 56, borderWidth: 1.5, borderRadius: 16, paddingHorizontal: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, height: '100%' },
  errorText: { marginTop: 4, marginLeft: 4 },
});

export default StepApartmentLocation;
