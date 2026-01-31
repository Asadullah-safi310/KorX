import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { AppText } from '../../../components/AppText';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { getImageUrl } from '../../../utils/mediaUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.45;
const CARD_HEIGHT = CARD_WIDTH * 1.6;

interface ApartmentReelCardProps {
  apartment: any;
  onPress: () => void;
}

const ApartmentReelCard = ({ apartment, onPress }: ApartmentReelCardProps) => {
  const theme = useThemeColor();
  const coverImage = apartment.building_images?.[0];
  const unitCount = apartment.Units?.length || 0;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        {coverImage ? (
          <Image 
            source={{ uri: getImageUrl(coverImage) }} 
            style={styles.image} 
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: theme.border + '30' }]}>
            <MaterialCommunityIcons name="office-building" size={40} color={theme.subtext} />
          </View>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <AppText variant="body" weight="bold" color="#fff" numberOfLines={2} style={styles.name}>
              {apartment.apartment_name}
            </AppText>
            
            <View style={styles.badge}>
              <MaterialCommunityIcons name="home-group" size={14} color="#fff" />
              <AppText variant="tiny" weight="bold" color="#fff" style={styles.badgeText}>
                {unitCount} {unitCount === 1 ? 'Home' : 'Homes'}
              </AppText>
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  content: {
    gap: 6,
  },
  name: {
    fontSize: 15,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
  }
});

export default ApartmentReelCard;
