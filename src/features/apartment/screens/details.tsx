import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Dimensions, 
  ScrollView, 
  RefreshControl,
  FlatList,
  Alert
} from 'react-native';
import { AppText } from '../../../components/AppText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useThemeColor } from '../../../hooks/useThemeColor';
import apartmentStore from '../../../stores/ApartmentStore';
import authStore from '../../../stores/AuthStore';
import PropertyCard from '../../../components/PropertyCard';
import { getImageUrl } from '../../../utils/mediaUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import ScreenLayout from '../../../components/ScreenLayout';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 350;

const ApartmentDetailsScreen = observer(() => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useThemeColor();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'homes'>('features');

  const apartmentId = Number(id);

  const fetchData = useCallback(async () => {
    if (!apartmentId) return;
    try {
      await Promise.all([
        apartmentStore.fetchApartmentById(apartmentId),
        apartmentStore.fetchApartmentUnits(apartmentId)
      ]);
    } catch (error) {
      console.error('Error fetching apartment details:', error);
    }
  }, [apartmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (apartmentStore.loading && !apartmentStore.currentApartment) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const apartment = apartmentStore.currentApartment;
  const units = apartmentStore.apartmentUnits;

  if (!apartment) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <AppText variant="body" color={theme.text}>Apartment not found</AppText>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <AppText variant="body" color={theme.primary}>Go Back</AppText>
        </TouchableOpacity>
      </View>
    );
  }

  const isOwner = authStore.user?.user_id === apartment.created_by || authStore.isAdmin;

  const renderFacility = (key: string, label: string, icon: string, provider: 'Ionicons' | 'MaterialCommunityIcons' = 'Ionicons') => {
    if (!apartment.facilities?.[key]) return null;
    return (
      <View style={[styles.facilityItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {provider === 'Ionicons' ? (
          <Ionicons name={icon as any} size={20} color={theme.primary} />
        ) : (
          <MaterialCommunityIcons name={icon as any} size={20} color={theme.primary} />
        )}
        <AppText variant="caption" color={theme.text} style={{ marginTop: 4 }}>{label}</AppText>
      </View>
    );
  };

  const images = apartment.building_images || [];

  return (
    <ScreenLayout backgroundColor={theme.background} scrollable={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          {images.length > 0 ? (
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Image 
                  source={{ uri: getImageUrl(item) }} 
                  style={styles.headerImage} 
                  contentFit="cover" 
                />
              )}
            />
          ) : (
            <View style={[styles.headerImage, { backgroundColor: theme.card, justifyContent: 'center', alignItems: 'center' }]}>
              <MaterialCommunityIcons name="office-building" size={80} color={theme.border} />
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.backButton, { top: insets.top + 10 }]} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {isOwner && (
            <View style={[styles.headerActions, { top: insets.top + 10 }]}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => router.push({
                  pathname: '/apartment/create',
                  params: { id: apartment.id }
                })}
              >
                <Ionicons name="pencil" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.danger + 'CC' }]} 
                onPress={() => {
                  Alert.alert(
                    'Delete Apartment',
                    'Are you sure you want to delete this apartment building? This action cannot be undone.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { 
                        text: 'Delete', 
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await apartmentStore.deleteApartment(apartment.id);
                            router.back();
                          } catch (error: any) {
                            const msg = error?.response?.data?.error || error?.message || 'Failed to delete apartment';
                            Alert.alert('Error', msg);
                          }
                        }
                      }
                    ]
                  );
                }}
              >
                <Ionicons name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <AppText variant="h2" weight="bold" color={theme.text}>{apartment.apartment_name}</AppText>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={theme.primary} />
              <AppText variant="body" color={theme.subtext} style={{ marginLeft: 4 }}>
                {apartment.address}, {apartment.DistrictData?.name}, {apartment.ProvinceData?.name}
              </AppText>
            </View>
          </View>

          {/* Tab Bar */}
          <View style={[styles.tabBar, { borderBottomColor: theme.border }]}>
            <TouchableOpacity 
              style={[styles.tabItem, activeTab === 'features' && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab('features')}
            >
              <AppText 
                variant="body" 
                weight={activeTab === 'features' ? "bold" : "regular"}
                color={activeTab === 'features' ? theme.primary : theme.subtext}
              >
                Features
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabItem, activeTab === 'homes' && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab('homes')}
            >
              <AppText 
                variant="body" 
                weight={activeTab === 'homes' ? "bold" : "regular"}
                color={activeTab === 'homes' ? theme.primary : theme.subtext}
              >
                Homes ({units.length})
              </AppText>
            </TouchableOpacity>
          </View>

          {activeTab === 'features' ? (
            <>
              {/* Description */}
              <View style={styles.section}>
                <AppText variant="h3" weight="bold" color={theme.text} style={styles.sectionTitle}>About Building</AppText>
                <AppText variant="body" color={theme.text} style={styles.description}>
                  {apartment.description || 'No description available for this building.'}
                </AppText>
              </View>

              {/* Facilities */}
              <View style={styles.section}>
                <AppText variant="h3" weight="bold" color={theme.text} style={styles.sectionTitle}>Building Facilities</AppText>
                <View style={styles.facilitiesGrid}>
                  {renderFacility('lift', 'Lift', 'elevator-passenger-outline', 'MaterialCommunityIcons')}
                  {renderFacility('parking', 'Parking', 'car-outline')}
                  {renderFacility('generator', 'Generator', 'engine-outline', 'MaterialCommunityIcons')}
                  {renderFacility('security', 'Security', 'shield-checkmark-outline')}
                  {renderFacility('solar', 'Solar', 'solar-power-variant-outline', 'MaterialCommunityIcons')}
                </View>
              </View>
            </>
          ) : (
            /* Units Section */
            <View style={styles.section}>
              <View style={styles.unitsHeader}>
                <AppText variant="h3" weight="bold" color={theme.text}>Building Units</AppText>
                {isOwner && (
                  <TouchableOpacity 
                    style={[styles.addUnitBtn, { backgroundColor: theme.primary }]}
                    onPress={() => router.push({
                      pathname: '/property/create',
                      params: { apartmentId: apartment.id }
                    })}
                  >
                    <Ionicons name="add" size={18} color="#fff" />
                    <AppText variant="caption" weight="bold" color="#fff">Add Home in this Apartment</AppText>
                  </TouchableOpacity>
                )}
              </View>

              {units.length > 0 ? (
                <View style={styles.unitsList}>
                  {units.map((unit, index) => (
                    <PropertyCard 
                      key={unit.property_id} 
                      property={unit} 
                      index={index}
                      onPress={() => router.push(`/property/${unit.property_id}`)}
                    />
                  ))}
                </View>
              ) : (
                <View style={[styles.emptyUnits, { backgroundColor: theme.card }]}>
                  <Ionicons name="home-outline" size={40} color={theme.border} />
                  <AppText variant="body" color={theme.subtext} style={{ marginTop: 10 }}>
                    No homes listed in this building yet.
                  </AppText>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
});

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { height: HEADER_HEIGHT, width: width, position: 'relative' },
  headerImage: { width: width, height: HEADER_HEIGHT },
  backButton: { position: 'absolute', left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  headerActions: { position: 'absolute', right: 20, flexDirection: 'row', gap: 10 },
  actionButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, backgroundColor: 'white' },
  headerInfo: { marginBottom: 24 },
  titleRow: { marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, marginBottom: 20 },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { marginBottom: 12 },
  description: { lineHeight: 22 },
  facilitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  facilityItem: { width: (width - 64) / 3, padding: 12, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  unitsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  addUnitBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, gap: 4 },
  unitsList: { gap: 16 },
  emptyUnits: { padding: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#ddd' }
});

export default ApartmentDetailsScreen;
