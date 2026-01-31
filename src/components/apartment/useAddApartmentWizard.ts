import { useMemo } from 'react';
import { useFormikContext } from 'formik';
import { stepSchemas } from './validationSchemas';

export const useAddApartmentWizard = (
  totalSteps: number, 
  currentStep: number, 
  setCurrentStep: (step: number) => void
) => {
  const { validateForm, setTouched, values, initialValues } = useFormikContext<any>();

  const activeSchema = useMemo(() => stepSchemas[currentStep], [currentStep]);

  const goToNextStep = async () => {
    const errors = await validateForm();
    
    if (Object.keys(errors).length === 0) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
        return true;
      }
    } else {
      const touchedFields: any = {};
      Object.keys(errors).forEach(key => {
        touchedFields[key] = true;
      });
      setTouched(touchedFields);
    }
    return false;
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      return true;
    }
    return false;
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const progress = ((currentStep + 1) / totalSteps) * 100;

  return {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isLastStep,
    activeSchema,
    progress,
    values,
    initialValues,
  };
};
