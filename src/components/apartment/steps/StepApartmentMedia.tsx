import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFormikContext } from 'formik';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { validateFileSize, getImageUrl } from '../../../utils/mediaUtils';
import { AppText } from '../../AppText';

const { width } = Dimensions.get('window');
const GRID_SPACING = 12;
const ITEM_WIDTH = (width - 40 - (GRID_SPACING * 2)) / 3;

const StepApartmentMedia = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const theme = useThemeColor();
  const [loading, setLoading] = useState(false);

  const handlePickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to upload photos.');
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newMedia = [...values.media];
        for (const asset of result.assets) {
          const isValidSize = await validateFileSize(asset.uri, 10);
          if (!isValidSize) {
            Alert.alert('File too large', `Image ${asset.fileName || ''} exceeds 10MB limit.`);
            continue;
          }
          newMedia.push({
            uri: asset.uri,
            name: asset.fileName || `img_${Date.now()}.jpg`,
            mimeType: asset.mimeType || 'image/jpeg',
          });
        }
        setFieldValue('media', newMedia);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick images');
    } finally {
      setLoading(false);
    }
  };

  const removeMedia = (index: number) => {
    const newMedia = [...values.media];
    newMedia.splice(index, 1);
    setFieldValue('media', newMedia);
  };

  const removeExistingMedia = (index: number) => {
    const newExisting = [...(values.existingMedia || [])];
    newExisting.splice(index, 1);
    setFieldValue('existingMedia', newExisting);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <AppText variant="h2" weight="bold" style={{ color: theme.text }}>Building Photos</AppText>
      <AppText variant="caption" style={[{ color: theme.subtext }, styles.sectionSubtitle]}>
        Add photos of the building exterior, lobby, and shared spaces.
      </AppText>

      <TouchableOpacity 
        style={[styles.mainUploadCard, { backgroundColor: theme.primary + '08', borderColor: theme.primary + '20' }]} 
        onPress={handlePickImages}
        activeOpacity={0.7}
      >
        <View style={[styles.uploadIconCircle, { backgroundColor: theme.primary }]}>
          <Ionicons name="camera" size={28} color="#fff" />
        </View>
        <AppText variant="title" weight="bold" style={{ color: theme.text }}>Add Building Photos</AppText>
        <AppText variant="caption" weight="medium" style={{ color: theme.subtext }}>Upload up to 10 images</AppText>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.primary} />
          <AppText variant="caption" weight="medium" style={{ color: theme.subtext }}>Processing photos...</AppText>
        </View>
      )}

      <View style={styles.mediaGrid}>
        {/* Existing Media (Editing) */}
        {(values.existingMedia || []).map((item: any, index: number) => (
          <View key={`existing-${index}`} style={styles.mediaWrapper}>
            <View style={[styles.mediaItemContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Image source={{ uri: getImageUrl(item.url) }} style={styles.mediaPreview} />
              <TouchableOpacity 
                style={styles.removeBtn} 
                activeOpacity={0.8}
                onPress={() => removeExistingMedia(index)}
              >
                <BlurView intensity={60} tint="dark" style={styles.blurRemove}>
                  <Ionicons name="close" size={14} color="#fff" />
                </BlurView>
              </TouchableOpacity>
              <View style={styles.badge}>
                <AppText variant="caption" style={{ color: '#fff', fontSize: 8 }}>SAVED</AppText>
              </View>
            </View>
          </View>
        ))}

        {/* New Media */}
        {values.media.map((item: any, index: number) => (
          <View key={`new-${index}`} style={styles.mediaWrapper}>
            <View style={[styles.mediaItemContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
              <TouchableOpacity 
                style={styles.removeBtn} 
                activeOpacity={0.8}
                onPress={() => removeMedia(index)}
              >
                <BlurView intensity={60} tint="dark" style={styles.blurRemove}>
                  <Ionicons name="close" size={14} color="#fff" />
                </BlurView>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {values.media.length === 0 && (!values.existingMedia || values.existingMedia.length === 0) && (
          <View style={[styles.emptyGrid, { backgroundColor: theme.border + '10' }]}>
            <MaterialCommunityIcons name="image-multiple-outline" size={40} color={theme.border} />
            <AppText variant="caption" weight="semiBold" style={{ color: theme.subtext }}>No photos added yet</AppText>
          </View>
        )}
      </View>

      {touched.media && errors.media && !values.existingMedia?.length && (
        <View style={[styles.errorBox, { backgroundColor: theme.danger + '10' }]}>
          <AppText variant="caption" weight="semiBold" style={{ color: theme.danger }}>{errors.media as string}</AppText>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 120, paddingHorizontal: 20, paddingTop: 10 },
  sectionSubtitle: { marginBottom: 24, marginTop: 2 },
  mainUploadCard: { height: 160, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', gap: 10 },
  uploadIconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, gap: 10 },
  mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: GRID_SPACING, marginTop: 30 },
  mediaWrapper: { width: ITEM_WIDTH, aspectRatio: 1 },
  mediaItemContainer: { width: '100%', height: '100%', borderRadius: 16, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  mediaPreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeBtn: { position: 'absolute', top: 6, right: 6, zIndex: 10 },
  blurRemove: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  emptyGrid: { width: '100%', height: 120, borderRadius: 20, justifyContent: 'center', alignItems: 'center', gap: 10 },
  errorBox: { marginTop: 20, padding: 12, borderRadius: 12, alignItems: 'center' },
  badge: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
});

export default StepApartmentMedia;
