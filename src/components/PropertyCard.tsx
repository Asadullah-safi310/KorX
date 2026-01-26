import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Pressable, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getImageUrl } from '../utils/mediaUtils';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  FadeInDown
} from 'react-native-reanimated';

import { useThemeColor } from '../hooks/useThemeColor';
import { AppText } from './AppText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DefaultPropertyImage = require('../../assets/images/property.jpg');

interface PropertyCardProps {
  property: any;
  onPress: () => void;
  index?: number;
  variant?: 'default' | 'compact';
}

const PropertyCard = ({ property, onPress, index = 0, variant = 'default' }: PropertyCardProps) => {
  const themeColors = useThemeColor();
  const [activeIndex, setActiveIndex] = useState(0);
  
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const photos = property.photos && property.photos.length > 0 ? property.photos : [];
  
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    if (viewSize > 0) {
      const index = Math.round(contentOffset / viewSize);
      setActiveIndex(index);
    }
  };

  const formatPrice = (price: any) => {
    if (!price) return '-';
    const num = parseFloat(price);
    if (num >= 10000000) return `Rs ${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `Rs ${(num / 100000).toFixed(2)} Lac`;
    return `Rs ${num.toLocaleString()}`;
  };

  const getPropertyDisplayPrice = (property: any) => {
    if (property.purpose === 'SALE' || property.purpose === 'BOTH') {
      return property.sale_price ? `Rs ${parseFloat(property.sale_price).toLocaleString()}` : 'Price on Request';
    }
    return property.rent_price ? `Rs ${parseFloat(property.rent_price).toLocaleString()} / mo` : 'Price on Request';
  };

  const isSale = property.is_available_for_sale || property.purpose === 'SALE' || property.purpose === 'BOTH';
  const isRent = property.is_available_for_rent || property.purpose === 'RENT' || property.purpose === 'BOTH';
  
  const propertyTitle = property.title || property.property_type || 'Modern Living Space';
  const addressCandidates = [
    property.city,
    property.DistrictData?.name || property.district,
    property.location,
    property.AreaData?.name,
    property.ProvinceData?.name,
  ].filter(Boolean);
  const uniqueAddressParts: string[] = [];
  const seenAddress = new Set<string>();
  addressCandidates.forEach((part) => {
    const normalized = part.trim().toLowerCase();
    if (normalized && !seenAddress.has(normalized)) {
      seenAddress.add(normalized);
      uniqueAddressParts.push(part.trim());
    }
  });
  const fullAddress = uniqueAddressParts.join(', ');

  const renderImageItem = ({ item }: { item: string }) => (
    <View style={variant === 'compact' ? styles.compactImageContainer : styles.imageContainer}>
      <Image 
        source={{ uri: getImageUrl(item) || undefined }} 
        style={variant === 'compact' ? styles.compactImage : styles.image} 
        resizeMode="cover"
      />
    </View>
  );

  const PaginationDots = ({ length, active }: { length: number; active: number }) => {
    if (length <= 1) return null;
    return (
      <View style={styles.paginationDots}>
        {Array.from({ length: Math.min(length, 8) }).map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.dot, 
              { backgroundColor: i === active ? '#fff' : 'rgba(255,255,255,0.5)' },
              i === active && { width: 12 }
            ]} 
          />
        ))}
      </View>
    );
  };

  if (variant === 'compact') {
    const displayPrice = getPropertyDisplayPrice(property);
    const locationLabel = property.location || property.city || 'Your Property';
    const typeLabel = property.property_type || 'Property';
    const bedLabel = property.bedrooms ?? '-';
    const areaLabel = property.area_size ?? '-';

    return (
      <Animated.View 
        entering={FadeInDown.delay(index * 100).duration(500)}
        style={[animatedStyle]}
      >
        <TouchableOpacity 
          activeOpacity={0.92}
          onPress={onPress}
          style={[styles.compactCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
        >
          <View style={styles.compactMedia}>
            {photos.length > 0 ? (
              <FlatList
                data={photos}
                renderItem={renderImageItem}
                keyExtractor={(item, idx) => `compact-${idx}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.compactFlatList}
              />
            ) : (
              <Image source={DefaultPropertyImage} style={styles.compactImage} />
            )}
            
            <View style={styles.compactImageOverlay} />
            
            <View style={styles.compactBadgeRow}>
              {isSale && (
                <View style={[styles.compactTag, { backgroundColor: '#e0f2ff' }]}> 
                  <AppText variant="caption" weight="bold" color="#0369a1">For Sale</AppText>
                </View>
              )}
              {isRent && (
                <View style={[styles.compactTag, { backgroundColor: '#ecfccb' }]}> 
                  <AppText variant="caption" weight="bold" color="#166534">For Rent</AppText>
                </View>
              )}
            </View>
            
            <PaginationDots length={photos.length} active={activeIndex} />

            <View style={styles.compactFavorite}>
              <Ionicons name="heart-outline" size={18} color="#fff" />
            </View>
          </View>

          <View style={styles.compactBody}>
            <View style={styles.compactHeaderRow}>
              <AppText variant="title" weight="bold" numberOfLines={1} style={{ flex: 1, marginRight: 10 }}>
                {locationLabel}
              </AppText>
              <View style={[styles.compactTypeBadge, { backgroundColor: themeColors.background }]}> 
                <AppText variant="caption" weight="bold" color={themeColors.subtext} numberOfLines={1}>
                  {typeLabel}
                </AppText>
              </View>
            </View>
            <AppText variant="h3" weight="bold" color={themeColors.primary} numberOfLines={1} style={{ marginBottom: 10 }}>
              {displayPrice}
            </AppText>
            <View style={styles.compactMetaRow}>
              <View style={styles.compactMetaItem}>
                <Ionicons name="bed-outline" size={14} color={themeColors.subtext} />
                <AppText variant="small" weight="medium">{bedLabel} BHK</AppText>
              </View>
              <View style={[styles.compactSeparator, { backgroundColor: themeColors.border }]} />
              <View style={styles.compactMetaItem}>
                <MaterialCommunityIcons name="vector-square" size={14} color={themeColors.subtext} />
                <AppText variant="small" weight="medium">{areaLabel} sqft</AppText>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(500)}
      style={[animatedStyle]}
    >
      <Pressable 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={({ pressed }) => [
          styles.container, 
          { 
            backgroundColor: themeColors.card, 
            borderColor: themeColors.border,
          }
        ]}
      >
        {/* Image Section */}
        <View style={styles.imageWrapper}>
          {photos.length > 0 ? (
            <FlatList
              data={photos}
              renderItem={renderImageItem}
              keyExtractor={(item, idx) => `default-${idx}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.flatList}
            />
          ) : (
            <Image source={DefaultPropertyImage} style={styles.image} resizeMode="cover" />
          )}

          {photos.length > 1 && (
            <View style={styles.imageCountBadge}>
              <AppText variant="caption" weight="bold" color="#fff">{activeIndex + 1}/{photos.length}</AppText>
            </View>
          )}

          <PaginationDots length={photos.length} active={activeIndex} />
          
          <TouchableOpacity 
            style={[styles.favoriteBtn, { backgroundColor: '#fff' }]}
            activeOpacity={0.8}
          >
            <Ionicons name="heart" size={18} color="#ff4d4d" />
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.priceRow}>
            <View style={styles.priceContainer}>
              <AppText variant="h3" weight="bold" numberOfLines={1}> 
                {isSale ? formatPrice(property.sale_price) : formatPrice(property.rent_price)}
                <AppText variant="small" color="#94a3b8"> / {isRent && !isSale ? 'mo' : 'yr'}</AppText>
              </AppText>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#fbbf24" />
              <AppText variant="small" weight="bold" style={{ marginLeft: 4 }}>4.0</AppText>
            </View>
          </View>

          <View style={styles.titleRow}>
            <AppText variant="title" weight="bold" numberOfLines={1} style={{ flex: 1, marginRight: 12 }}>
              {propertyTitle}
            </AppText>
            
            <View style={styles.featureRow}>
              <View style={styles.featureItem}>
                <Ionicons name="bed-outline" size={18} color="#94a3b8" />
                <AppText variant="body" weight="medium" style={{ marginLeft: 6 }}>{property.bedrooms || 0}</AppText>
              </View>
              <View style={styles.featureItem}>
                <MaterialCommunityIcons name="bathtub-outline" size={18} color="#94a3b8" />
                <AppText variant="body" weight="medium" style={{ marginLeft: 6 }}>{property.bathrooms || 0}</AppText>
              </View>
            </View>
          </View>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color="#94a3b8" />
            <AppText variant="body" color={themeColors.subtext} numberOfLines={1} style={{ marginLeft: 6, flex: 1 }}>
              {fullAddress || 'Location details'}
            </AppText>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  compactCard: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 20,
    width: SCREEN_WIDTH - 40,
  },
  compactMedia: {
    height: 190,
    width: '100%',
    position: 'relative',
  },
  compactFlatList: {
    width: '100%',
    height: '100%',
  },
  compactImageContainer: {
    width: SCREEN_WIDTH - 40,
    height: 190,
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  compactBadgeRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 2,
  },
  compactTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  compactTagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  compactFavorite: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  compactBody: {
    padding: 16,
  },
  compactHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  compactTitle: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },
  compactTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  compactTypeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  compactPrice: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  compactMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compactMetaText: {
    fontSize: 13,
    fontWeight: '600',
  },
  compactSeparator: {
    width: 1,
    height: 18,
    marginHorizontal: 12,
  },
  imageWrapper: {
    height: 240,
    width: '100%',
    position: 'relative',
  },
  flatList: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    width: SCREEN_WIDTH - 40,
    height: 240,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  paginationDots: {
    position: 'absolute',
    bottom: 12,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  imageCountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 2,
  },
  imageCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  infoSection: {
    padding: 16,
    paddingHorizontal: 18,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2563eb',
  },
  priceSubText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94a3b8',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fffbeb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#b45309',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});

export default PropertyCard;
