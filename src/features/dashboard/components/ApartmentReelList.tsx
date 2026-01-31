import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'expo-router';
import { AppText } from '../../../components/AppText';
import { useThemeColor } from '../../../hooks/useThemeColor';
import apartmentStore from '../../../stores/ApartmentStore';
import ApartmentReelCard from './ApartmentReelCard';

const ApartmentReelList = observer(() => {
  const theme = useThemeColor();
  const router = useRouter();

  useEffect(() => {
    apartmentStore.fetchApartments();
  }, []);

  if (apartmentStore.loading && apartmentStore.apartments.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }

  if (apartmentStore.apartments.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="title" weight="bold" color={theme.text}>
          Project In High Demand
        </AppText>
        <AppText variant="caption" weight="medium" color={theme.subtext}>
          Explore premium apartment buildings
        </AppText>
      </View>

      <FlatList
        data={apartmentStore.apartments}
        renderItem={({ item }) => (
          <ApartmentReelCard 
            apartment={item} 
            onPress={() => router.push(`/apartment/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        decelerationRate="fast"
        snapToInterval={Dimensions.get('window').width * 0.45 + 16}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default ApartmentReelList;
