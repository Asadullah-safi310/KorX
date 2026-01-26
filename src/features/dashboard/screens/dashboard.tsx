import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, RefreshControl, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, ScrollView } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import authStore from '../../../stores/AuthStore';
import propertyStore from '../../../stores/PropertyStore';
import { adminService } from '../../../services/admin.service';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '../../../hooks/useThemeColor';
import ScreenLayout from '../../../components/ScreenLayout';
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
        <Text style={[styles.statValue, { color: themeColors.text }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: themeColors.subtext }]}>{label}</Text>
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
            <Text style={[styles.premiumGreeting, { color: themeColors.text }]}>Admin Console</Text>
            <Text style={[styles.premiumSubtext, { color: themeColors.subtext }]}>System status: Operational</Text>
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
            <Text style={[styles.premiumMetaValue, { color: themeColors.text }]}>{stats.totalUsers}</Text>
            <Text style={[styles.premiumMetaLabel, { color: themeColors.subtext }]}>Users</Text>
          </View>
          <View style={[styles.premiumMetaDivider, { backgroundColor: themeColors.border }]} />
          <View style={styles.premiumMetaItem}>
            <Text style={[styles.premiumMetaValue, { color: themeColors.text }]}>{stats.totalAgents || 0}</Text>
            <Text style={[styles.premiumMetaLabel, { color: themeColors.subtext }]}>Agents</Text>
          </View>
          <View style={[styles.premiumMetaDivider, { backgroundColor: themeColors.border }]} />
          <View style={styles.premiumMetaItem}>
            <Text style={[styles.premiumMetaValue, { color: themeColors.text }]}>{stats.totalDeals}</Text>
            <Text style={[styles.premiumMetaLabel, { color: themeColors.subtext }]}>Deals</Text>
          </View>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.contentSectionTitle, { color: themeColors.text }]}>Global Statistics</Text>
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
          <Text style={[styles.contentSectionTitle, { color: themeColors.text }]}>Management Tools</Text>
        </View>
        
        <View style={styles.adminToolGrid}>
          <TouchableOpacity 
            style={[styles.premiumToolCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push('/(tabs)/people')}
          >
            <View style={[styles.toolIconContainer, { backgroundColor: '#3b82f615' }]}>
              <Ionicons name="people" size={24} color="#3b82f6" />
            </View>
            <Text style={[styles.toolTitle, { color: themeColors.text }]}>Users</Text>
            <Text style={[styles.toolDesc, { color: themeColors.subtext }]}>Roles & permissions</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.premiumToolCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push('/(tabs)/properties')}
          >
            <View style={[styles.toolIconContainer, { backgroundColor: '#10b98115' }]}>
              <Ionicons name="business" size={24} color="#10b981" />
            </View>
            <Text style={[styles.toolTitle, { color: themeColors.text }]}>Properties</Text>
            <Text style={[styles.toolDesc, { color: themeColors.subtext }]}>Review all listings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.premiumToolCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push('/(tabs)/insights')}
          >
            <View style={[styles.toolIconContainer, { backgroundColor: '#f59e0b15' }]}>
              <Ionicons name="bar-chart" size={24} color="#f59e0b" />
            </View>
            <Text style={[styles.toolTitle, { color: themeColors.text }]}>Insights</Text>
            <Text style={[styles.toolDesc, { color: themeColors.subtext }]}>Analyze growth</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.premiumToolCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={[styles.toolIconContainer, { backgroundColor: '#8b5cf615' }]}>
              <Ionicons name="settings" size={24} color="#8b5cf6" />
            </View>
            <Text style={[styles.toolTitle, { color: themeColors.text }]}>Settings</Text>
            <Text style={[styles.toolDesc, { color: themeColors.subtext }]}>System platform</Text>
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
        <Text style={styles.bannerText}>#KabTak{"\n"}Puchoge</Text>
      </View>
    </View>
  );

  const FeaturedProjectCard = ({ property, index, onPress }: any) => {
    const theme = useThemeColor();
    const price = property.sale_price 
      ? `₹${property.sale_price >= 10000000 ? (property.sale_price / 10000000).toFixed(2) + ' Cr' : (property.sale_price / 100000).toFixed(2) + ' L'}`
      : property.rent_price 
        ? `₹${property.rent_price.toLocaleString()}/mo`
        : 'Price on Request';

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
            <View style={styles.newLaunchTag}>
              <Text style={styles.newLaunchText}>NEW LAUNCH</Text>
            </View>
            <View style={styles.reraBadgeSmall}>
              <Text style={styles.reraTextSmall}>RERA</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.heartBtnSmall}>
            <Ionicons name="heart-outline" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.imageBottomOverlay}>
            <View style={styles.possessionTag}>
              <Ionicons name="time-outline" size={12} color="#fff" />
              <Text style={styles.possessionTextSmall}>Possession {new Date().getFullYear() + 2}</Text>
            </View>
          </View>
        </View>

        <View style={styles.featuredInfo}>
          <View style={styles.priceRowModern}>
            <Text style={[styles.featuredPriceModern, { color: theme.text }]}>{price}</Text>
            <View style={[styles.configBadge, { backgroundColor: theme.primary + '10' }]}>
              <Text style={[styles.configText, { color: theme.primary }]}>{property.bedrooms} BHK</Text>
            </View>
          </View>
          
          <Text style={[styles.featuredTitleModern, { color: theme.text }]} numberOfLines={1}>
            {property.title}
          </Text>
          
          <View style={styles.locationRowModern}>
            <Ionicons name="location-sharp" size={14} color={theme.subtext} />
            <Text style={[styles.featuredLocationModern, { color: theme.subtext }]} numberOfLines={1}>
              {property.location || property.area_id || 'India'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
              <Text style={[styles.searchInput, { color: '#333' }]}>
                Search &quot;Noida&quot;
              </Text>
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
            <Text style={[styles.recentSearchLabel, { color: themeColors.subtext }]}>Recent{"\n"}Search</Text>
          </View>
          {RECENT_SEARCHES.map((search, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.modernChip, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
            >
              <Text style={[styles.modernChipText, { color: themeColors.text }]}>{search}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Projects Section */}
      <View style={styles.projectsSection}>
        <View style={styles.sectionHeaderRow}>
          <View>
            <Text style={[styles.projectsTitle, { color: '#001f3f' }]}>Projects in High Demand</Text>
            <Text style={[styles.projectsSubtitle, { color: themeColors.subtext }]}>The most explored projects in India</Text>
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
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  premiumSubtext: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
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
    fontSize: 20,
    fontWeight: '800',
  },
  premiumMetaLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
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
    fontSize: 18,
    fontWeight: '800',
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
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  toolDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
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
    fontWeight: '900',
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
    fontSize: 17,
    fontWeight: '500',
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
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
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
    fontSize: 14,
    fontWeight: '600',
  },
  projectsSection: {
    marginTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  projectsTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.8,
    color: '#001f3f',
  },
  projectsSubtitle: {
    fontSize: 15,
    marginTop: 4,
    fontWeight: '500',
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
  },
  newLaunchTag: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  newLaunchText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  reraBadgeSmall: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reraTextSmall: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
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
    fontSize: 10,
    fontWeight: '700',
  },
  featuredInfo: {
    padding: 16,
  },
  priceRowModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredPriceModern: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  configBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  configText: {
    fontSize: 11,
    fontWeight: '800',
  },
  featuredTitleModern: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  locationRowModern: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredLocationModern: {
    fontSize: 13,
    fontWeight: '500',
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
