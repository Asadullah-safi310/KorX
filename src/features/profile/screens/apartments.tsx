import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import apartmentStore from '../../../stores/ApartmentStore';
import authStore from '../../../stores/AuthStore';
import { useThemeColor } from '../../../hooks/useThemeColor';
import ScreenLayout from '../../../components/ScreenLayout';

const ApartmentsScreen = observer(() => {
  const router = useRouter();
  const themeColors = useThemeColor();

  const fetchApartments = useCallback(async () => {
    if (!authStore.user) return;
    await apartmentStore.fetchMyApartments();
  }, []);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  const onRefresh = () => {
    fetchApartments();
  };

  const renderApartmentItem = ({ item }: any) => {
    if (!item) return null;
    // Custom card for Apartment Building
    return (
      <TouchableOpacity 
        style={[styles.apartmentCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
        onPress={() => router.push(`/apartment/${item.id}`)}
      >
        <View style={[styles.apartmentImagePlaceholder, { backgroundColor: themeColors.background }]}>
          <MaterialCommunityIcons name="office-building" size={32} color={themeColors.primary} />
        </View>
        <View style={styles.apartmentInfo}>
          <Text style={[styles.apartmentName, { color: themeColors.text }]} numberOfLines={1}>
            {item.apartment_name}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={themeColors.subtext} />
            <Text style={[styles.locationText, { color: themeColors.subtext }]} numberOfLines={1}>
              {item.DistrictData?.name}, {item.ProvinceData?.name}
            </Text>
          </View>
          <View style={styles.unitBadge}>
            <Text style={[styles.unitBadgeText, { color: themeColors.primary }]}>
              {item.Units?.length || 0} Homes
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={themeColors.border} />
      </TouchableOpacity>
    );
  };

  return (
    <ScreenLayout backgroundColor={themeColors.background} scrollable={false}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={[styles.headerBtn, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}
        >
          <Ionicons name="arrow-back" size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>My Apartments</Text>
        <TouchableOpacity 
          onPress={() => router.push('/apartment/create')} 
          style={[styles.headerBtn, { backgroundColor: themeColors.primary, borderColor: themeColors.primary }]}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.topContainer}>
        <Text style={[styles.description, { color: themeColors.subtext }]}>
          Manage your apartment buildings and add homes inside them.
        </Text>
      </View>

      {apartmentStore.loading && !apartmentStore.apartments.length ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={themeColors.primary} />
        </View>
      ) : (
        <FlatList
          data={apartmentStore.myApartments || []}
          keyExtractor={(item, index) => item?.id?.toString() || `apartment-${index}`}
          renderItem={renderApartmentItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={apartmentStore.loading} onRefresh={onRefresh} tintColor={themeColors.primary} />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconBox, { backgroundColor: themeColors.card }]}>
                <MaterialCommunityIcons name="office-building-marker-outline" size={60} color={themeColors.border} />
              </View>
              <Text style={[styles.emptyTitle, { color: themeColors.text }]}>No apartments listed</Text>
              <Text style={[styles.emptySubtitle, { color: themeColors.subtext }]}>
                You haven't listed any apartment buildings yet. Click the + button to add your first building.
              </Text>
            </View>
          }
        />
      )}
    </ScreenLayout>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  topContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
    gap: 16,
  },
  apartmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 16,
  },
  apartmentImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apartmentInfo: {
    flex: 1,
  },
  apartmentName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
  },
  unitBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  unitBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyIconBox: {
    width: 120,
    height: 120,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    opacity: 0.7,
  },
});

export default ApartmentsScreen;
