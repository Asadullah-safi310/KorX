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
import { AppText } from '../../AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

import StepOwnership from './steps/StepOwnership';
import StepDetails from './steps/StepDetails';
import StepLocation from './steps/StepLocation';
import StepPricing from './steps/StepPricing';
import StepMedia from './steps/StepMedia';
import StepReview from './steps/StepReview';
import StepAmenities from './steps/StepAmenities';
import { stepSchemas, initialValues } from './validationSchemas';
import { useAddPropertyWizard } from './useAddPropertyWizard';
import { useThemeColor } from '../../../hooks/useThemeColor';
import propertyStore from '../../../stores/PropertyStore';


const ALL_STEPS = [
  { title: 'Owner & Type', component: StepOwnership },
  { title: 'Basic Info', component: StepDetails },
  { title: 'Location', component: StepLocation, key: 'location' },
  { title: 'Pricing', component: StepPricing },
  { title: 'Media', component: StepMedia },
  { title: 'Amenities', component: StepAmenities, key: 'amenities' },
  { title: 'Final Review', component: StepReview },
];

const WizardInner = observer(({ onFinish, isEditing, propertyId, currentStep, setCurrentStep, steps }: any) => {
  const theme = useThemeColor();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 100;
  const [loading, setLoading] = useState(false);
  
  const {
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isLastStep,
    progress,
    values,
    initialValues: formInitialValues,
  } = useAddPropertyWizard(steps.length, currentStep, setCurrentStep);

  const ActiveComponent = steps[currentStep].component;

  const handleSubmitListing = async () => {
    try {
      setLoading(true);
      const payload = {
        ...values,
        amenities: values.amenities || [],
        area_size: Number(values.area_size),
        bedrooms: values.bedrooms ? Number(values.bedrooms) : null,
        bathrooms: values.bathrooms ? Number(values.bathrooms) : null,
        sale_price: values.sale_price ? Number(values.sale_price) : null,
        rent_price: values.rent_price ? Number(values.rent_price) : null,
        province_id: values.province_id ? Number(values.province_id) : null,
        district_id: values.district_id ? Number(values.district_id) : null,
        area_id: values.area_id ? Number(values.area_id) : null,
        owner_person_id: values.owner_person_id ? Number(values.owner_person_id) : null,
        agent_id: values.agent_id ? Number(values.agent_id) : null,
        apartment_id: values.apartment_id ? Number(values.apartment_id) : null,
      };

      let id = propertyId;
      if (isEditing) {
        await propertyStore.updateProperty(id, payload);
      } else {
        const response = await propertyStore.createProperty(payload);
        id = response.property_id;
      }

      // Handle Media Upload
      if (values.media && values.media.length > 0) {
        const formData = new FormData();
        values.media.forEach((file: any) => {
          formData.append('files', {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          } as any);
        });
        await propertyStore.uploadPropertyFiles(id, formData);
      }

      // Handle existing media deletion
      if (isEditing && formInitialValues.existingMedia) {
        const initialMedia = formInitialValues.existingMedia;
        const currentMedia = values.existingMedia || [];
        
        const deletedMedia = initialMedia.filter((initial: any) => 
          !currentMedia.some((current: any) => current.url === initial.url)
        );

        for (const file of deletedMedia) {
          await propertyStore.deletePropertyFile(id, file.url, file.type || 'photo');
        }
      }
      
      Alert.alert('Success', `Property ${isEditing ? 'updated' : 'created'} successfully!`, [
        { text: 'OK', onPress: () => onFinish ? onFinish() : router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  const handleNext = async () => {
    if (isLastStep) {
      await handleSubmitListing();
    } else {
      await goToNextStep();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Premium Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={isFirstStep ? handleClose : goToPreviousStep}
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

      {/* Content Area */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <ActiveComponent onEditStep={(idx: number) => setCurrentStep(idx)} />
      </KeyboardAvoidingView>

      {/* Sticky Premium Footer */}
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
          
          {currentStep === 2 && (
            <TouchableOpacity 
              style={[styles.skipButton, { borderColor: theme.border }]} 
              onPress={goToNextStep}
            >
              <AppText variant="small" weight="semiBold" color={theme.subtext}>Skip</AppText>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[
              styles.nextButton, 
              { backgroundColor: theme.primary },
              (!isFirstStep || currentStep === 2) && { flex: 2 }
            ]} 
            onPress={handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <AppText variant="body" weight="bold" color="#fff" style={{ fontSize: 17 }}>
                  {isLastStep ? 'Finalize' : 'Continue'}
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

const AddPropertyWizard = ({ initial, isEditing, propertyId, onFinish }: any) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const values = initial || initialValues;
  const isInherited = values.parent_property_id != null || values.apartment_id != null;
  
  const steps = ALL_STEPS.filter(step => {
    if (isInherited && (step.key === 'location' || step.key === 'amenities')) {
      return false;
    }
    return true;
  });

  const activeSchema = stepSchemas[ALL_STEPS.indexOf(steps[currentStep])];
  
  return (
    <Formik
      initialValues={values}
      validationSchema={activeSchema}
      enableReinitialize={true}
      onSubmit={() => {}}
    >
      <WizardInner 
        isEditing={isEditing} 
        propertyId={propertyId} 
        onFinish={onFinish} 
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        steps={steps}
      />
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  headerSubtitle: {
  },
  headerTitle: {
  },
  progressContainer: {
    marginLeft: 10,
  },
  progressCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercent: {
  },
  progressBarOuter: {
    height: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  content: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    flex: 1,
    height: 56,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  backButtonText: {
  },
  skipButton: {
    paddingHorizontal: 15,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
  },
  nextButton: {
    flex: 1,
    height: 56,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
  },
});

export default AddPropertyWizard;
