import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';

import authStore from '../../../stores/AuthStore';
import propertyStore from '../../../stores/PropertyStore';
import { useThemeColor } from '../../../hooks/useThemeColor';
import AddPropertyWizard from '../../../components/property/AddProperty/AddPropertyWizard';

const PropertyCreateScreen = observer(() => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = Boolean(id);

  const theme = useThemeColor();
  const background = theme.background;
  const primary = theme.primary;

  const isLoading = authStore.isLoading;
  const isAuthenticated = authStore.isAuthenticated;

  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [initialValues, setInitialValues] = useState<any>(null);

  const fetchPropertyData = useCallback(async () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }

    if (isEditing) {
      try {
        setInitialLoading(true);
        const property = await propertyStore.fetchPropertyById(id as string);
        if (property) {
          setInitialValues({
            agent_id: String(property.agent_id || ''),
            property_type: property.property_type || 'House',
            purpose: property.purpose || 'SALE',
            title: property.title || '',
            description: property.description || '',
            area_size: property.area_size?.toString() || '',
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 0,
            province_id: property.province_id ? String(property.province_id) : '',
            district_id: property.district_id ? String(property.district_id) : '',
            area_id: property.area_id ? String(property.area_id) : '',
            location: property.location || property.address || '',
            latitude: property.latitude ? Number(property.latitude) : null,
            longitude: property.longitude ? Number(property.longitude) : null,
            is_available_for_sale: !!property.is_available_for_sale,
            is_available_for_rent: !!property.is_available_for_rent,
            sale_price: property.sale_price?.toString() || '',
            sale_currency: property.sale_currency || 'AF',
            rent_price: property.rent_price?.toString() || '',
            rent_currency: property.rent_currency || 'AF',
            media: [],
            existingMedia: (property.photos || []).map((p: string) => ({ url: p, type: 'photo' })),
            amenities: Array.isArray(property.amenities) 
              ? property.amenities 
              : (typeof property.amenities === 'string' && property.amenities.startsWith('[')
                  ? JSON.parse(property.amenities) 
                  : []),
          });
        }
      } catch {
        Alert.alert('Error', 'Failed to load property data');
        router.back();
      } finally {
        setInitialLoading(false);
      }
    }
  }, [id, isEditing, router, isLoading, isAuthenticated]);

  useEffect(() => {
    fetchPropertyData();
  }, [fetchPropertyData]);

  const handleFinish = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  if (initialLoading || authStore.isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  return (
    <AddPropertyWizard 
      initial={initialValues} 
      isEditing={isEditing} 
      propertyId={id}
      onFinish={handleFinish} 
    />
  );
});

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PropertyCreateScreen;
