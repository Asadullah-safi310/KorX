import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useFormikContext } from 'formik';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColor } from '../../../../hooks/useThemeColor';
import { getImageUrl } from '../../../../utils/mediaUtils';
import personStore from '../../../../stores/PersonStore';
import { AppText } from '../../../AppText';

const { width } = Dimensions.get('window');

interface StepReviewProps {
  onEditStep: (index: number) => void;
}

const StepReview = ({ onEditStep }: StepReviewProps) => {
  const { values } = useFormikContext<any>();
  const theme = useThemeColor();

  const agent = personStore.agents.find(a => String(a.user_id) === values.agent_id);

  const ReviewSection = ({ title, stepIndex, children }: { title: string; stepIndex: number; children: React.ReactNode }) => (
    <View style={[styles.section, { borderColor: theme.border, backgroundColor: theme.card }]}>
      <View style={styles.sectionHeader}>
        <AppText variant="small" weight="bold" style={[{ color: theme.text }, styles.sectionTitle]}>{title}</AppText>
        <TouchableOpacity onPress={() => onEditStep(stepIndex)} style={styles.editBtn}>
          <Ionicons name="create-outline" size={16} color={theme.primary} />
          <AppText variant="tiny" weight="bold" color={theme.primary}>Edit</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const InfoRow = ({ label, value, icon }: { label: string; value: string | number | null | undefined; icon?: any }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLabelContainer}>
        {icon && <MaterialCommunityIcons name={icon} size={16} color={theme.subtext} style={{ marginRight: 6 }} />}
        <AppText variant="small" weight="medium" color={theme.subtext}>{label}</AppText>
      </View>
      <AppText variant="small" weight="bold" color={theme.text} style={styles.infoValue}>{value || 'N/A'}</AppText>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <AppText variant="h2" weight="bold" color={theme.text} style={{ marginBottom: 4 }}>Review Your Listing</AppText>
      <AppText variant="small" color={theme.subtext} style={styles.subTitle}>
        Please double-check all details before submitting your property.
      </AppText>

      <ReviewSection title="Type & Agent" stepIndex={0}>
        <InfoRow label="Property Category" value={values.property_category} icon="shape-outline" />
        <InfoRow label="Property Type" value={values.property_type} icon="home-city-outline" />
        <InfoRow label="Purpose" value={values.purpose} icon="tag-outline" />
        <InfoRow label="Agent" value={agent?.full_name || 'Direct Listing'} icon="account-tie-outline" />
      </ReviewSection>

      <ReviewSection title="Property Details" stepIndex={1}>
        <InfoRow label="Title" value={values.title} icon="format-title" />
        <InfoRow label="Area Size" value={`${values.area_size} Sq. Ft.`} icon="ruler-square" />
        {values.property_type?.toLowerCase() !== 'plot' && (
          <>
            <InfoRow label="Bedrooms" value={values.bedrooms === 10 ? '10+' : values.bedrooms} icon="bed-outline" />
            <InfoRow label="Bathrooms" value={values.bathrooms === 10 ? '10+' : values.bathrooms} icon="water-outline" />
          </>
        )}
        <InfoRow label="Location" value={values.location} icon="map-marker-outline" />
      </ReviewSection>

      <ReviewSection title="Map Location" stepIndex={2}>
        <View style={styles.coordsRow}>
          <View style={styles.coordBadge}>
            <AppText variant="caption" weight="bold" style={styles.coordText}>Lat: {values.latitude ? values.latitude.toFixed(6) : 'Not set'}</AppText>
          </View>
          <View style={styles.coordBadge}>
            <AppText variant="caption" weight="bold" style={styles.coordText}>Lng: {values.longitude ? values.longitude.toFixed(6) : 'Not set'}</AppText>
          </View>
        </View>
      </ReviewSection>

      <ReviewSection title="Pricing" stepIndex={3}>
        {values.is_available_for_sale && (
          <InfoRow label="Sale Price" value={`${values.sale_currency === 'USD' ? '$' : ''}${values.sale_price}${values.sale_currency === 'AF' ? ' AF' : ''}`} />
        )}
        {values.is_available_for_rent && (
          <InfoRow label="Rent Price" value={`${values.rent_currency === 'USD' ? '$' : ''}${values.rent_price}${values.rent_currency === 'AF' ? ' AF' : ''} / month`} />
        )}
      </ReviewSection>

      <ReviewSection title="Media" stepIndex={4}>
        <View style={styles.mediaPreviewList}>
          {values.existingMedia?.map((item: any, idx: number) => (
            <Image key={`ext-${idx}`} source={{ uri: getImageUrl(item.url) || undefined }} style={styles.mediaThumb} contentFit="cover" transition={200} />
          ))}
          {values.media?.filter((m: any) => m.category === 'image').map((item: any, idx: number) => (
            <Image key={`new-${idx}`} source={{ uri: item.uri || undefined }} style={styles.mediaThumb} contentFit="cover" transition={200} />
          ))}
          {values.media?.filter((m: any) => m.category !== 'image').map((item: any, idx: number) => (
             <View key={`file-${idx}`} style={[styles.mediaThumb, styles.fileThumb, { backgroundColor: theme.border + '30' }]}>
                <Ionicons name={item.category === 'video' ? 'videocam' : 'document'} size={20} color={theme.primary} />
             </View>
          ))}
        </View>
        {(values.media.length === 0 && values.existingMedia?.length === 0) && (
            <AppText variant="caption" color={theme.subtext} style={{ textAlign: 'center', marginTop: 10 }}>No media uploaded</AppText>
        )}
      </ReviewSection>

      <ReviewSection title="Amenities" stepIndex={5}>
        <View style={styles.amenitiesGrid}>
          {values.amenities && values.amenities.length > 0 ? (
            values.amenities.map((amenity: string, idx: number) => (
              <View key={idx} style={[styles.amenityBadge, { backgroundColor: theme.primary + '15' }]}>
                <AppText variant="tiny" weight="bold" color={theme.primary}>{amenity}</AppText>
              </View>
            ))
          ) : (
            <AppText variant="caption" color={theme.subtext}>No amenities selected</AppText>
          )}
        </View>
      </ReviewSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },
  subTitle: { 
    marginBottom: 24,
  },
  section: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 10,
  },
  sectionTitle: { 
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  sectionContent: { 
    gap: 12,
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoValue: { 
    flex: 1.5, 
    textAlign: 'right',
  },
  coordsRow: { 
    flexDirection: 'row', 
    gap: 8,
  },
  coordBadge: { 
    backgroundColor: 'rgba(71, 85, 105, 0.1)', 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 8,
  },
  coordText: { 
    color: '#475569',
  },
  mediaPreviewList: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10,
  },
  mediaThumb: { 
    width: (width - 40 - 32 - 30) / 4, 
    height: (width - 40 - 32 - 30) / 4, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  fileThumb: { 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
});

export default StepReview;
