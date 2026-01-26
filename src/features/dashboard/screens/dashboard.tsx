import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, RefreshControl, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import authStore from '../../../stores/AuthStore';
import propertyStore from '../../../stores/PropertyStore';
import favoriteStore from '../../../stores/FavoriteStore';
import { adminService } from '../../../services/admin.service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '../../../hooks/useThemeColor';
import ScreenLayout from '../../../components/ScreenLayout';
import { AppText } from '../../../components/AppText';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
];

const RECENT_SEARCHES = [
  'Buy in India',
  'Independent House/Villa',
  'All Recent Searches'
];

const StatCard = ({ icon, label, value, color }: any) => {
  const themeColors = useThemeColor();
  return (
    <View style={[styles.statCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
      <View style={[styles.statIconBadge, { backgroundColor: color + '15' }]}>
        {React.cloneElement(icon, { size: 20, color: color })}
      </View>
      <View style={styles.statInfo}>
        <AppText variant="title" weight="bold">{value}</AppText>
        <AppText variant="caption" weight="medium" color={themeColors.subtext}>{label}</AppText>
      </View>
    </View>
  );
};


const AdminDashboard = observer(() => {
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    totalProperties: 0,
    totalDeals: 0,
    propertiesForSale: 0,
    propertiesForRent: 0,
    totalAgents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const themeColors = useThemeColor();

  const fetchStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading && !refreshing) {
    return (
      <ScreenLayout backgroundColor="#f8fafc">
        <View style={[styles.centered, { backgroundColor: '#f8fafc' }]}>

        <ActivityIndicator size="small" color={themeColors.primary} />
      </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      scrollable
      backgroundColor={themeColors.background}
      bottomSpacing={100}
      scrollProps={{
        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />,
        showsVerticalScrollIndicator: false,
      }}
    >
      <View style={[styles.premiumHeader, { paddingTop: insets.top + 10 }]}>
        <View style={styles.premiumHeaderTop}>
          <View>
            <AppText variant="h1" weight="bold" color={themeColors.text}>Admin Console</AppText>
            <AppText variant="small" weight="medium" color={themeColors.subtext}>System status: Operational</AppText>
          </View>
          <TouchableOpacity 
            style={[styles.premiumProfileBtn, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons name="shield-checkmark" size={24} color={themeColors.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.premiumStatsRow, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={styles.premiumMetaItem}>
            <AppText variant="h3" weight="bold" color={themeColors.text}>{stats.totalUsers}</AppText>
            <AppText variant="caption" weight="semiBold" color={themeColors.subtext} style={{ textTransform: 'uppercase' }}>Users</AppText>
          </View>
          <View style={[styles.premiumMetaDivider, { backgroundColor: themeColors.border }]} />
          <View style={styles.premiumMetaItem}>
            <AppText variant="h3" weight="bold" color={themeColors.text}>{stats.totalAgents || 0}</AppText>
            <AppText variant="caption" weight="semiBold" color={themeColors.subtext} style={{ textTransform: 'uppercase' }}>Agents</AppText>
          </View>
          <View style={[styles.premiumMetaDivider, { backgroundColor: themeColors.border }]} />
          <View style={styles.premiumMetaItem}>
            <AppText variant="h3" weight="bold" color={themeColors.text}>{stats.totalDeals}</AppText>
            <AppText variant="caption" weight="semiBold" color={themeColors.subtext} style={{ textTransform: 'uppercase' }}>Deals</AppText>
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.sectionHeaderRow}>
          <AppText variant="title" weight="bold" color={themeColors.text}>Global Statistics</AppText>
        </View>
        
        <View style={styles.statsGrid}>
          <StatCard 
            label="Total Properties"
            value={stats.totalProperties}
            color="#3b82f6"
            icon={<Ionicons name="business" />}
          />
          <StatCard 
            label="Active Deals"
            value={stats.totalDeals}
            color="#f59e0b"
            icon={<MaterialCommunityIcons name="handshake" />}
          />
          <StatCard 
            label="For Sale"
            value={stats.propertiesForSale}
            color="#10b981"
            icon={<Ionicons name="pricetag" />}
          />
          <StatCard 
            label="For Rent"
            value={stats.propertiesForRent}
            color="#8b5cf6"
            icon={<Ionicons name="key" />}
          />
        </View>

        <View style={[styles.sectionHeaderRow, { marginTop: 20 }]}>
          <AppText variant="title" weight="bold" color={themeColors.text}>Management Tools</AppText>
        </View>
        
        <View style={styles.adminToolGrid}>
          <TouchableOpacity 
            style={[styles.premiumToolCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push('/(tabs)/people')}
          >
            <View style={[styles.toolIconContainer, { backgroundColor: '#3b82f615' }]}>
              <Ionicons name="people" size={24} color="#3b82f6" />
            </View>
            <AppText variant="body" weight="bold" color={themeColors.text}>Users</AppText>
            <AppText variant="caption" color={themeColors.subtext}>Roles & permissions</AppText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.premiumToolCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push('/(tabs)/properties')}
          >
            <View style={[styles.toolIconContainer, { backgroundColor: '#10b98115' }]}>
              <Ionicons name="business" size={24} color="#10b981" />
            </View>
            <AppText variant="body" weight="bold" color={themeColors.text}>Properties</AppText>
            <AppText variant="caption" color={themeColors.subtext}>Review all listings</AppText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.premiumToolCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push('/(tabs)/insights')}
          >
            <View style={[styles.toolIconContainer, { backgroundColor: '#f59e0b15' }]}>
              <Ionicons name="bar-chart" size={24} color="#f59e0b" />
            </View>
            <AppText variant="body" weight="bold" color={themeColors.text}>Insights</AppText>
            <AppText variant="caption" color={themeColors.subtext}>Analyze growth</AppText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.premiumToolCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={[styles.toolIconContainer, { backgroundColor: '#8b5cf615' }]}>
              <Ionicons name="settings" size={24} color="#8b5cf6" />
            </View>
            <AppText variant="body" weight="bold" color={themeColors.text}>Settings</AppText>
            <AppText variant="caption" color={themeColors.subtext}>System platform</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenLayout>
  );
});

const UserDashboard = observer(() => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerRef = useRef<FlatList>(null);
  const router = useRouter();
  const themeColors = useThemeColor();

  const fetchData = async () => {
    await propertyStore.fetchPublicProperties(10);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeBannerIndex < BANNER_IMAGES.length - 1) {
        bannerRef.current?.scrollToIndex({ index: activeBannerIndex + 1, animated: true });
        setActiveBannerIndex(activeBannerIndex + 1);
      } else {
        bannerRef.current?.scrollToIndex({ index: 0, animated: true });
        setActiveBannerIndex(0);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [activeBannerIndex]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderBannerItem = ({ item }: { item: string }) => (
    <View style={styles.bannerItem}>
      <Image source={{ uri: item }} style={styles.bannerImage} contentFit="cover" />
      <View style={styles.bannerOverlay}>
        <AppText weight="bold" style={styles.bannerText}>#KabTak{"\n"}Puchoge</AppText>
      </View>
    </View>
  );

  const FeaturedProjectCard = observer(({ property, index, onPress }: any) => {
    const theme = useThemeColor();
    const router = useRouter();
    const isFavorite = favoriteStore.isFavorite(property.property_id);

    const price = property.sale_price 
      ? `₹${property.sale_price >= 10000000 ? (property.sale_price / 10000000).toFixed(2) + ' Cr' : (property.sale_price / 100000).toFixed(2) + ' L'}`
      : property.rent_price 
        ? `₹${property.rent_price.toLocaleString()}/mo`
        : 'Price on Request';

    const isSale = property.is_available_for_sale || property.purpose === 'SALE' || property.purpose === 'BOTH';
    const isRent = property.is_available_for_rent || property.purpose === 'RENT' || property.purpose === 'BOTH';

    const toggleFavorite = (e: any) => {
      e.stopPropagation();
      if (!authStore.isAuthenticated) {
        router.push('/login');
        return;
      }
      favoriteStore.toggleFavorite(property.property_id);
    };

    return (
      <TouchableOpacity 
        style={styles.featuredCard} 
        activeOpacity={0.9}
        onPress={onPress}
      >
        <View style={styles.cardImageContainer}>
          <Image 
            source={{ uri: property.photos?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6' }} 
            style={styles.featuredImage}
            contentFit="cover"
          />
          <View style={styles.cardTopTags}>
            {(isSale || isRent) && (
              <View style={styles.availabilityDot} />
            )}
            {isSale && (
              <View style={[styles.statusTag, { backgroundColor: '#e0f2ff' }]}>
                <AppText variant="caption" weight="bold" color="#0369a1" style={{ fontSize: 10 }}>For Sale</AppText>
              </View>
            )}
            {isRent && (
              <View style={[styles.statusTag, { backgroundColor: '#ecfccb' }]}>
                <AppText variant="caption" weight="bold" color="#166534" style={{ fontSize: 10 }}>For Rent</AppText>
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.heartBtnSmall} 
            onPress={toggleFavorite}
            activeOpacity={0.7}
          >
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#ff4d4d" : "#fff"} />
          </TouchableOpacity>

          <View style={styles.imageBottomOverlay}>
            <View style={styles.possessionTag}>
              <Ionicons name="home-outline" size={12} color="#fff" />
              <AppText variant="caption" color="#fff" style={{ fontSize: 10, textTransform: 'capitalize' }}>{property.property_type || 'Property'}</AppText>
            </View>
          </View>
        </View>

        <View style={styles.featuredInfo}>
          <View style={styles.priceRowModern}>
            <AppText variant="h3" weight="bold" color={theme.text}>{price}</AppText>
            <View style={[styles.configBadge, { backgroundColor: theme.primary + '10' }]}>
              <AppText variant="caption" weight="bold" color={theme.primary} style={{ fontSize: 11 }}>{property.bedrooms} BHK</AppText>
            </View>
          </View>
          
          {property.title ? (
            <AppText variant="body" weight="bold" color={theme.text} numberOfLines={1} style={styles.featuredTitleModern}>
              {property.title}
            </AppText>
          ) : null}
          
          <View style={styles.locationRowModern}>
            <Ionicons name="location-sharp" size={14} color={theme.subtext} />
            <AppText variant="small" weight="medium" color={theme.subtext} numberOfLines={1} style={{ fontSize: 13 }}>
              {property.location || property.area_id || 'India'}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  return (
    <ScreenLayout
      scrollable
      backgroundColor={themeColors.background}
      bottomSpacing={120}
      scrollProps={{
        refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />,
        showsVerticalScrollIndicator: false,
      }}
    >
      {/* Banner Section with Premium Overlay */}
      <View style={styles.bannerContainer}>
        <FlatList
          ref={bannerRef}
          data={BANNER_IMAGES}
          renderItem={renderBannerItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveBannerIndex(index);
          }}
          keyExtractor={(_, index) => index.toString()}
        />
        
        {/* Banner Indicators */}
        <View style={styles.bannerIndicators}>
          {BANNER_IMAGES.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.indicator, 
                { backgroundColor: index === activeBannerIndex ? '#fff' : 'rgba(255,255,255,0.4)' },
                index === activeBannerIndex && { width: 20 }
              ]} 
            />
          ))}
        </View>

        {/* Premium Search Bar Overlay */}
        <View style={styles.searchBarContainer}>
          <View style={[styles.modernSearchBar, { backgroundColor: '#fff' }]}>
            <Ionicons name="search-outline" size={22} color="#666" style={styles.searchIcon} />
            <TouchableOpacity 
              style={styles.searchTouch}
              activeOpacity={1}
              onPress={() => router.push('/search')}
            >
              <AppText variant="body" weight="medium" color="#333" style={{ fontSize: 17 }}>
                Search &quot;Noida&quot;
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.micBtn}>
              <Ionicons name="mic-outline" size={24} color={themeColors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modern Recent Searches */}
      <View style={styles.modernRecentSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modernRecentScroll}>
          <View style={styles.recentLabelContainer}>
            <MaterialCommunityIcons name="history" size={18} color={themeColors.subtext} />
            <AppText variant="caption" weight="bold" color={themeColors.subtext} style={{ lineHeight: 14 }}>Recent{"\n"}Search</AppText>
          </View>
          {RECENT_SEARCHES.map((search, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.modernChip, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            >
              <AppText variant="small" weight="semiBold" color={themeColors.text}>{search}</AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Projects Section */}
      <View style={styles.projectsSection}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <AppText variant="h2" weight="bold" color="#001f3f">Projects in High Demand</AppText>
            <AppText variant="small" weight="medium" color={themeColors.subtext} style={{ marginTop: 4 }}>The most explored projects in India</AppText>
          </View>
        </View>
        
        {propertyStore.loading && propertyStore.publicProperties.length === 0 ? (
          <View style={styles.premiumLoader}>
            <ActivityIndicator size="small" color={themeColors.primary} />
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.projectsList}
            snapToInterval={width * 0.75 + 20}
            decelerationRate="fast"
          >
            {propertyStore.publicProperties.map((property, index) => (
              <FeaturedProjectCard 
                key={property.property_id}
                property={property}
                index={index}
                onPress={() => router.push(`/property/${property.property_id}`)}
              />
            ))}
          </ScrollView>
        )}
      </View>
      
    </ScreenLayout>
  );
});

export default observer(function DashboardScreen() {
  if (authStore.isAdmin) {
    return <AdminDashboard />;
  }
  // Agents now see the Public Dashboard (UserDashboard) as well
  return <UserDashboard />;
});

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  premiumHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  premiumGreeting: {
    letterSpacing: -0.8,
  },
  premiumSubtext: {
    marginTop: 2,
  },
  premiumProfileBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  premiumStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  premiumMetaItem: {
    flex: 1,
    alignItems: 'center',
  },
  premiumMetaValue: {
  },
  premiumMetaLabel: {
    marginTop: 4,
    letterSpacing: 0.5,
  },
  premiumMetaDivider: {
    width: 1,
    height: 24,
  },
  mainContent: {
    padding: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contentSectionTitle: {
    letterSpacing: -0.4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  adminToolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  premiumToolCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  toolIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  toolTitle: {
    letterSpacing: -0.3,
  },
  toolDesc: {
    marginTop: 4,
  },
  bannerContainer: {
    height: 360,
    position: 'relative',
  },
  bannerItem: {
    width: width,
    height: 360,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 20,
    top: 80,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    borderRadius: 12,
  },
  bannerText: {
    color: '#fff',
    fontSize: 48,
    lineHeight: 52,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  bannerIndicators: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    flexDirection: 'row',
    gap: 6,
  },
  indicator: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
  searchBarContainer: {
    position: 'absolute',
    bottom: -32,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  modernSearchBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  searchTouch: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
  },
  micBtn: {
    padding: 4,
  },
  modernRecentSection: {
    marginTop: 64,
    paddingLeft: 20,
  },
  recentLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    gap: 8,
  },
  recentSearchLabel: {
  },
  modernChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
  modernChipText: {
  },
  projectsSection: {
    marginTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  projectsTitle: {
    letterSpacing: -0.8,
    color: '#001f3f',
  },
  projectsSubtitle: {
    marginTop: 4,
    opacity: 0.7,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '800',
  },
  projectsList: {
    paddingRight: 20,
    paddingVertical: 12,
  },
  featuredCard: {
    width: width * 0.75,
    marginRight: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  cardImageContainer: {
    height: 150,
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  cardTopTags: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
    zIndex: 2,
    alignItems: 'center',
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availabilityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  heartBtnSmall: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  imageBottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  possessionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  possessionTextSmall: {
    color: '#fff',
  },
  featuredInfo: {
    padding: 16,
  },
  priceRowModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  featuredPriceModern: {
    letterSpacing: -0.5,
  },
  configBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  configText: {
  },
  featuredTitleModern: {
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  locationRowModern: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredLocationModern: {
  },
  premiumLoader: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Agent specific styles
  agentHero: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  heroGreeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },
  heroSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  heroProfileBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 22,
    padding: 2,
  },
  agentQuickActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heroActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heroActionLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  agentMainContent: {
    padding: 20,
  },
  agentSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 15,
    marginTop: 10,
  },
  listingOverviewSection: {
    marginTop: 10,
  },
  inventoryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  inventoryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inventoryLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  inventoryValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 4,
  },
  shortcutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  shortcutItem: {
    width: (width - 52) / 3,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  shortcutIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  shortcutLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
  },
  // Admin specific styles
  adminHero: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  adminMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 15,
    marginTop: 5,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  metaLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  adminToolGridV2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  adminToolCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  adminToolIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  adminToolTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  adminToolDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 14,
  },
});
