import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform
} from 'react-native';
import { AppText } from '../AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

import StepApartmentDetails from './steps/StepApartmentDetails';
import StepApartmentLocation from './steps/StepApartmentLocation';
import StepApartmentFacilities from './steps/StepApartmentFacilities';
import StepApartmentMedia from './steps/StepApartmentMedia';
import { stepSchemas, initialValues } from './validationSchemas';
import { useAddApartmentWizard } from './useAddApartmentWizard';
import { useThemeColor } from '../../hooks/useThemeColor';
import apartmentStore from '../../stores/ApartmentStore';

const steps = [
  { title: 'Building Details', component: StepApartmentDetails },
  { title: 'Location', component: StepApartmentLocation },
  { title: 'Facilities', component: StepApartmentFacilities },
  { title: 'Photos', component: StepApartmentMedia },
];

const WizardInner = observer(({ onFinish, currentStep, setCurrentStep, isEditing, apartmentId, initial }: any) => {
  const theme = useThemeColor();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const {
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isLastStep,
    progress,
    values,
  } = useAddApartmentWizard(steps.length, currentStep, setCurrentStep);

  const ActiveComponent = steps[currentStep].component;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Explicitly define payload to avoid sending extra Formik or UI state fields
      const payload = {
        apartment_name: values.apartment_name,
        description: values.description,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude,
        facilities: values.facilities,
        province_id: values.province_id ? Number(values.province_id) : null,
        district_id: values.district_id ? Number(values.district_id) : null,
        area_id: values.area_id ? Number(values.area_id) : null,
        total_floors: values.total_floors ? Number(values.total_floors) : null,
        total_units: values.total_units ? Number(values.total_units) : null,
      };

      let id = apartmentId;
      if (isEditing && apartmentId) {
        await apartmentStore.updateApartment(apartmentId, payload);
      } else {
        const newApartment = await apartmentStore.createApartment(payload);
        id = newApartment.id;
      }

      // Handle Media Upload
      if (values.media.length > 0) {
        const formData = new FormData();
        values.media.forEach((file: any) => {
          formData.append('files', {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          } as any);
        });
        await apartmentStore.uploadApartmentFiles(id, formData);
      }

      // Handle existing media deletion
      if (isEditing && initial?.existingMedia) {
        const initialMedia = initial.existingMedia;
        const currentMedia = values.existingMedia;
        
        const deletedMedia = initialMedia.filter((initialImg: any) => 
          !currentMedia.some((currentImg: any) => currentImg.url === initialImg.url)
        );

        for (const file of deletedMedia) {
          await apartmentStore.deleteApartmentFile(id, file.url);
        }
      }
      
      Alert.alert('Success', `Apartment building ${isEditing ? 'updated' : 'created'} successfully!`, [
        { text: 'OK', onPress: () => onFinish ? onFinish(id) : router.back() }
      ]);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to save apartment';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (isLastStep) {
      await handleSubmit();
    } else {
      await goToNextStep();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={isFirstStep ? () => router.back() : goToPreviousStep}
            style={[styles.iconButton, { backgroundColor: theme.card }]}
          >
            <Ionicons name={isFirstStep ? "close" : "arrow-back"} size={22} color={theme.text} />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <AppText variant="caption" weight="semiBold" color={theme.subtext} style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
              Step {currentStep + 1} of {steps.length}
            </AppText>
            <AppText variant="title" weight="bold" color={theme.text} style={{ letterSpacing: -0.5 }}>
              {steps[currentStep].title}
            </AppText>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressCircle, { borderColor: theme.border }]}>
              <AppText variant="caption" weight="bold" color={theme.primary}>
                {Math.round(progress)}%
              </AppText>
            </View>
          </View>
        </View>
        <View style={[styles.progressBarOuter, { backgroundColor: theme.border + '30' }]}>
          <View style={[styles.progressBarInner, { width: `${progress}%`, backgroundColor: theme.primary }]} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ActiveComponent />
      </KeyboardAvoidingView>

      <BlurView intensity={80} tint={theme.dark ? 'dark' : 'light'} style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.footerContent}>
          {!isFirstStep && (
            <TouchableOpacity 
              style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.border }]} 
              onPress={goToPreviousStep}
            >
              <AppText variant="body" weight="semiBold" color={theme.text}>Back</AppText>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.nextButton, 
              { backgroundColor: theme.primary },
              !isFirstStep && { flex: 2 }
            ]} 
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <AppText variant="body" weight="bold" color="#fff" style={{ fontSize: 17 }}>
                  {isLastStep ? (isEditing ? 'Update Building' : 'Create Building') : 'Continue'}
                </AppText>
                <Ionicons 
                  name={isLastStep ? "checkmark-circle" : "arrow-forward"} 
                  size={20} 
                  color="#fff" 
                  style={{ marginLeft: 8 }} 
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
});

const AddApartmentWizard = ({ onFinish, initial, isEditing, apartmentId }: any) => {
  const [currentStep, setCurrentStep] = useState(0);
  const activeSchema = stepSchemas[currentStep];
  
  return (
    <Formik
      initialValues={initial || initialValues}
      validationSchema={activeSchema}
      onSubmit={() => {}}
      enableReinitialize
    >
      <WizardInner 
        onFinish={onFinish} 
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isEditing={isEditing}
        apartmentId={apartmentId}
        initial={initial}
      />
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { zIndex: 10, backgroundColor: 'transparent' },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, justifyContent: 'space-between' },
  iconButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTextContainer: { flex: 1, marginLeft: 15 },
  progressContainer: { marginLeft: 10 },
  progressCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  progressBarOuter: { height: 3, width: '100%', overflow: 'hidden' },
  progressBarInner: { height: '100%' },
  content: { flex: 1 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingTop: 15, paddingHorizontal: 20, borderTopWidth: 1.5, borderColor: 'rgba(0,0,0,0.1)' },
  footerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: { flex: 1, height: 56, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5 },
  nextButton: { flex: 1, height: 56, borderRadius: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 4 },
});

export default AddApartmentWizard;
