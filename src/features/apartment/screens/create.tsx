import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import AddApartmentWizard from '../../../components/apartment/AddApartmentWizard';
import apartmentStore from '../../../stores/ApartmentStore';
import { useThemeColor } from '../../../hooks/useThemeColor';

const CreateApartmentScreen = observer(() => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useThemeColor();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(isEditing);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (isEditing) {
      const fetchApartment = async () => {
        try {
          const apartment = await apartmentStore.fetchApartmentById(Number(id));
          if (apartment) {
            setInitialValues({
              apartment_name: apartment.apartment_name || '',
              total_floors: apartment.total_floors?.toString() || '',
              total_units: apartment.total_units?.toString() || '',
              description: apartment.description || '',
              province_id: apartment.province_id ? String(apartment.province_id) : '',
              district_id: apartment.district_id ? String(apartment.district_id) : '',
              area_id: apartment.area_id ? String(apartment.area_id) : '',
              address: apartment.address || '',
              latitude: apartment.latitude || null,
              longitude: apartment.longitude || null,
              facilities: {
                lift: !!apartment.facilities?.lift,
                parking: !!apartment.facilities?.parking,
                generator: !!apartment.facilities?.generator,
                security: !!apartment.facilities?.security,
                solar: !!apartment.facilities?.solar,
                others: apartment.facilities?.others || ''
              },
              existingMedia: (apartment.building_images || []).map((img: string) => ({ url: img, type: 'photo' })),
              media: []
            });
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to load apartment data');
          router.back();
        } finally {
          setLoading(false);
        }
      };
      fetchApartment();
    }
  }, [id, isEditing, router]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <AddApartmentWizard 
      initial={initialValues} 
      isEditing={isEditing} 
      apartmentId={id ? Number(id) : undefined}
    />
  );
});

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default CreateApartmentScreen;
