import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import { useFormikContext } from 'formik';
import { useThemeColor } from '../../../../hooks/useThemeColor';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


// Safe import for react-native-maps
let MapView: any;
let Marker: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  try {
    // Temporarily commented out to fix 'RNMapsAirModule' error as per original file
    // const Maps = require('react-native-maps');
    // MapView = Maps.default;
    // Marker = Maps.Marker;
    // PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.error('Failed to load react-native-maps', e);
  }
}

const StepLocation = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const theme = useThemeColor();

  const onMapPress = (e: any) => {
    const coordinate = e.nativeEvent?.coordinate;
    if (coordinate) {
      setFieldValue('latitude', coordinate.latitude);
      setFieldValue('longitude', coordinate.longitude);
    }
  };

  const initialRegion = {
    latitude: values.latitude || 33.6844, // Default to Islamabad
    longitude: values.longitude || 73.0479,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const renderError = (field: string) => {
    if (touched[field] && errors[field]) {
      return <Text style={[styles.errorText, { color: theme.danger }]}>{errors[field] as string}</Text>;
    }
    return null;
  };

  const isMapAvailable = Platform.OS !== 'web' && MapView;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Map Placement</Text>
      <Text style={[styles.sectionSubtitle, { color: theme.subtext }]}>
        {isMapAvailable 
          ? 'Pin the exact location of your property on the map.' 
          : 'Interactive map is currently unavailable. Please provide coordinates.'}
      </Text>

      <View style={[styles.mapWrapper, { borderColor: theme.border, backgroundColor: theme.card }]}>
        {isMapAvailable ? (
          <MapView
            style={styles.map}
            onPress={onMapPress}
            initialRegion={initialRegion}
            provider={PROVIDER_GOOGLE || 'google'}
          >
            {values.latitude && values.longitude && (
              <Marker
                coordinate={{ latitude: values.latitude, longitude: values.longitude }}
                title="Property Location"
              />
            )}
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <View style={[styles.placeholderIcon, { backgroundColor: theme.primary + '10' }]}>
              <MaterialCommunityIcons name="map-marker-radius-outline" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.placeholderText, { color: theme.text }]}>Map Preview Restricted</Text>
            <Text style={[styles.placeholderSubtext, { color: theme.subtext }]}>
              Manual coordinate entry is required.
            </Text>
          </View>
        )}
        
        {isMapAvailable && (
          <View style={styles.mapOverlay}>
            <View style={[styles.overlayBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
              <Ionicons name="information-circle" size={14} color="#fff" />
              <Text style={styles.overlayText}>Tap to place marker</Text>
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.coordsGrid}>
        <View style={styles.coordBox}>
          <Text style={[styles.coordLabel, { color: theme.subtext }]}>LATITUDE</Text>
          <View style={[styles.coordInput, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={values.latitude ? String(values.latitude) : ''}
              onChangeText={(v) => setFieldValue('latitude', parseFloat(v) || null)}
              keyboardType="numeric"
              placeholder="0.000000"
              placeholderTextColor={theme.subtext}
            />
          </View>
        </View>
        <View style={styles.coordBox}>
          <Text style={[styles.coordLabel, { color: theme.subtext }]}>LONGITUDE</Text>
          <View style={[styles.coordInput, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              value={values.longitude ? String(values.longitude) : ''}
              onChangeText={(v) => setFieldValue('longitude', parseFloat(v) || null)}
              keyboardType="numeric"
              placeholder="0.000000"
              placeholderTextColor={theme.subtext}
            />
          </View>
        </View>
      </View>
      {renderError('latitude')}
      {renderError('longitude')}
      
      <View style={[styles.tipBox, { backgroundColor: theme.primary + '08', borderColor: theme.primary + '20' }]}>
        <Ionicons name="bulb-outline" size={20} color={theme.primary} />
        <Text style={[styles.tipText, { color: theme.text }]}>
          Precise location helps buyers find your property and increases trust in your listing.
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
    marginBottom: 20,
    marginTop: 2,
  },
  mapWrapper: {
    height: 320,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    marginBottom: 24,
    position: 'relative',
  },
  map: { 
    flex: 1,
  },
  mapPlaceholder: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  placeholderSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  overlayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  overlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  coordsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  coordBox: {
    flex: 1,
    gap: 6,
  },
  coordLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginLeft: 4,
  },
  coordInput: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    fontWeight: '600',
  },
  tipBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 20,
    gap: 12,
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  errorText: { 
    fontSize: 12, 
    marginTop: 4, 
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default StepLocation;
