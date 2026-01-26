import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Dimensions, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useThemeColor, useCurrentTheme } from '../../../hooks/useThemeColor';
import { propertyService } from '../../../services/property.service';
import propertyStore from '../../../stores/PropertyStore';
import authStore from '../../../stores/AuthStore';
import favoriteStore from '../../../stores/FavoriteStore';
import Avatar from '../../../components/Avatar';
import { getImageUrl } from '../../../utils/mediaUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import ScreenLayout from '../../../components/ScreenLayout';

const { width } = Dimensions.get('window');

const ProfileSection = observer(({ title, user, type }: { title: string; user: any; type: string }) => {
  const router = useRouter();
  const theme = useThemeColor();

  if (!user) return null;

  const handleProfilePress = () => {
    if (user.user_id) {
      router.push(`/person/user_${user.user_id}`);
    } else if (user.id) {
      router.push(`/person/${user.id}`);
    }
  };

  return (
    <View style={styles.profileSectionWrapper}>
      {title ? <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text> : null}
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={handleProfilePress} 
        style={[styles.miniProfileCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <Avatar user={user} size="md" />
        <View style={styles.miniProfileInfo}>
          <Text style={[styles.miniProfileName, { color: theme.text }]}>{user.full_name}</Text>
          <Text style={[styles.miniProfileRole, { color: theme.subtext }]}>
            {type === 'Agent' ? 'Verified Agent' : 'Property Owner'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.subtext} style={styles.miniProfileArrow} />
      </TouchableOpacity>
    </View>
  );
});

const PropertyDetailsScreen = observer(() => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imageScrollRef = useRef<ScrollView>(null);

  const theme = useThemeColor();
  const currentTheme = useCurrentTheme();
  const primaryColor = theme.primary;

  const propertyIdNum = parseInt(id as string);
  const isFavorite = favoriteStore.isFavorite(propertyIdNum);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await propertyService.getPropertyById(id as string);
        setProperty(response.data);
      } catch (err: any) {
        setError('Failed to load property details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const toggleFavorite = () => {
    favoriteStore.toggleFavorite(propertyIdNum);
  };

  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
    if (slide !== activeImageIndex) {
      setActiveImageIndex(slide);
    }
  };

  const canEdit = property && (
    authStore.isAdmin || 
    authStore.user?.user_id === property.created_by_user_id
  );

  const canDeal = property && authStore.isAgent && (
    authStore.user?.user_id === property.created_by_user_id || 
    authStore.user?.user_id === property.agent_id
  );

  const handleDelete = () => {
    Alert.alert(
      'Delete Property',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await propertyStore.deleteProperty(id as string);
              router.back();
            } catch (_err) {
              Alert.alert('Error', 'Failed to delete property');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleCall = (phone: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  if (error || !property) {
    return (
      <ScreenLayout backgroundColor={theme.background}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.danger} />
          <Text style={[styles.errorText, { color: theme.text }]}>{error || 'Property not found'}</Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: primaryColor }]} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Return to Browse</Text>
          </TouchableOpacity>
        </View>
      </ScreenLayout>
    );
  }

  const photos = property.photos || [];
  const price = parseFloat(property.purpose === 'SALE' ? property.sale_price : property.rent_price);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenLayout 
        scrollable 
        backgroundColor={theme.background}
        edges={['bottom', 'left', 'right']}
        bottomSpacing={100}
      >
        {/* Header Image Gallery */}
        <View style={styles.imageContainer}>
          {photos.length > 0 ? (
            <ScrollView 
              ref={imageScrollRef}
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {photos.map((photo: string, index: number) => (
                <View key={index} style={{ width: width }}>
                  <Image 
                    source={{ uri: getImageUrl(photo) ?? undefined }} 
                    style={styles.image} 
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.image, styles.placeholderImage, { backgroundColor: theme.card }]}>
              <Ionicons name="home-outline" size={80} color={theme.border} />
            </View>
          )}

          {/* Top Actions Overlay */}
          <View style={[styles.headerOverlay, { top: insets.top + 10 }]}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => router.back()}
            >
              <BlurView intensity={40} style={styles.blur} tint="dark">
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </BlurView>
            </TouchableOpacity>

            <View style={styles.headerRightActions}>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={toggleFavorite}
              >
                <BlurView intensity={40} style={styles.blur} tint="dark">
                  <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? theme.danger : "#fff"} />
                </BlurView>
              </TouchableOpacity>
              
              {canEdit && (
                <>
                  <TouchableOpacity 
                    style={[styles.iconButton, { marginLeft: 10 }]} 
                    onPress={() => router.push(`/property/create?id=${id}`)}
                  >
                    <BlurView intensity={40} style={styles.blur} tint="dark">
                      <Ionicons name="pencil" size={18} color="#fff" />
                    </BlurView>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.iconButton, { marginLeft: 10 }]} 
                    onPress={handleDelete}
                  >
                    <BlurView intensity={40} style={styles.blur} tint="dark">
                      <Ionicons name="trash" size={18} color="#fff" />
                    </BlurView>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {photos.length > 1 && (
            <View style={styles.imageBadge}>
              <BlurView intensity={40} style={styles.badgeBlur} tint="dark">
                <Text style={styles.imageBadgeText}>{activeImageIndex + 1} / {photos.length}</Text>
              </BlurView>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: theme.background }]}>
          <View style={[styles.indicator, { backgroundColor: theme.border }]} />
          
          <View style={styles.headerInfo}>
            <View style={styles.typeRow}>
              <View style={[styles.typeTag, { backgroundColor: primaryColor + '12' }]}>
                <Text style={[styles.typeTagText, { color: primaryColor }]}>FOR {property.purpose}</Text>
              </View>
              <View style={[styles.typeTag, { backgroundColor: '#10b98112', marginLeft: 8 }]}>
                <Text style={[styles.typeTagText, { color: '#10b981' }]}>{property.property_type}</Text>
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={[styles.priceText, { color: theme.text }]}>
                Rs {price.toLocaleString()}
                {property.purpose === 'RENT' && <Text style={[styles.rentPeriod, { color: theme.subtext }]}> / month</Text>}
              </Text>
            </View>

            <Text style={[styles.titleText, { color: theme.text }]}>
              {property.AreaData?.name || property.DistrictData?.name || property.city} Premium Residence
            </Text>

            <View style={styles.locationContainer}>
              <View style={[styles.locIconBg, { backgroundColor: primaryColor + '10' }]}>
                <Ionicons name="location" size={14} color={primaryColor} />
              </View>
              <Text style={[styles.locationText, { color: theme.subtext }]} numberOfLines={2}>
                {[
                  property.AreaData?.name,
                  property.DistrictData?.name,
                  property.ProvinceData?.name
                ].filter(Boolean).join(', ')}
              </Text>
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresGrid}>
            {property.property_type?.toLowerCase() !== 'plot' && (
              <>
                <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={[styles.featIcon, { backgroundColor: '#3b82f615' }]}>
                    <Ionicons name="bed" size={18} color="#3b82f6" />
                  </View>
                  <Text style={[styles.featValue, { color: theme.text }]}>{property.bedrooms || 0}</Text>
                  <Text style={[styles.featLabel, { color: theme.subtext }]}>Bedrooms</Text>
                </View>
                <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={[styles.featIcon, { backgroundColor: '#8b5cf615' }]}>
                    <Ionicons name="water" size={18} color="#8b5cf6" />
                  </View>
                  <Text style={[styles.featValue, { color: theme.text }]}>{property.bathrooms || 0}</Text>
                  <Text style={[styles.featLabel, { color: theme.subtext }]}>Bathrooms</Text>
                </View>
              </>
            )}
            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.featIcon, { backgroundColor: '#f59e0b15' }]}>
                <Ionicons name="expand" size={18} color="#f59e0b" />
              </View>
              <Text style={[styles.featValue, { color: theme.text }]}>{property.area_size}</Text>
              <Text style={[styles.featLabel, { color: theme.subtext }]}>Sq Ft</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>About this Property</Text>
            <Text style={[styles.description, { color: theme.text, opacity: 0.8 }]}>
              {property.description || 'Experience luxury living in this sophisticated property. Featuring modern amenities and a prime location, this residence offers the perfect blend of comfort and style for discerning individuals.'}
            </Text>
          </View>

          {/* Listing Agent */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Professional Contact</Text>
            <ProfileSection 
              title="" 
              user={property.Agent || property.Creator} 
              type={property.Agent ? "Agent" : "Owner"} 
            />
          </View>
        </View>
      </ScreenLayout>

      {/* Premium Footer */}
      <BlurView intensity={80} tint={currentTheme === 'dark' ? 'dark' : 'light'} style={[styles.footer, { borderTopColor: theme.border, paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.footerInner}>
          {(property.Agent?.phone || property.Creator?.phone) && (
            <TouchableOpacity 
              style={[styles.callBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => handleCall(property.Agent?.phone || property.Creator?.phone)}
            >
              <Ionicons name="call" size={22} color={primaryColor} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.bookBtn, { backgroundColor: primaryColor }]}
            onPress={() => {
              if (canDeal) {
                router.push(`/deal/create?propertyId=${property.property_id}`);
              } else {
                Alert.alert('Inquiry Sent', 'Your interest in this property has been recorded. Our agent will reach out to you within 24 hours.');
              }
            }}
          >
            <Text style={styles.bookBtnText}>{canDeal ? 'Initiate Transaction' : 'Send Inquiry'}</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 400,
    width: '100%',
    position: 'relative',
  },
  imageScroll: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: width,
    height: '100%',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerOverlay: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBadge: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerInfo: {
    marginBottom: 24,
  },
  typeRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeTagText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  rentPeriod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 12,
  },
  featureCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
  featLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  featIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '400',
  },
  profileSectionWrapper: {
    marginTop: 0,
  },
  miniProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  miniProfileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  miniProfileName: {
    fontSize: 16,
    fontWeight: '700',
  },
  miniProfileRole: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  miniProfileArrow: {
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  callBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
});

export default PropertyDetailsScreen;
