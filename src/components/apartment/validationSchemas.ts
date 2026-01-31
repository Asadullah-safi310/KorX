import * as Yup from 'yup';

export const initialValues = {
  apartment_name: '',
  total_floors: '',
  total_units: '',
  description: '',
  province_id: '',
  district_id: '',
  area_id: '',
  address: '',
  latitude: null,
  longitude: null,
  facilities: {
    lift: false,
    parking: false,
    generator: false,
    security: false,
    solar: false,
    others: ''
  },
  media: [],
};

export const Step1Schema = Yup.object().shape({
  apartment_name: Yup.string().required('Apartment name is required'),
  total_floors: Yup.number().typeError('Must be a number').required('Total floors is required').positive().integer(),
  total_units: Yup.number().typeError('Must be a number').required('Total units is required').positive().integer(),
  description: Yup.string().required('Description is required'),
});

export const Step2Schema = Yup.object().shape({
  province_id: Yup.string().required('Province is required'),
  district_id: Yup.string().required('District is required'),
  area_id: Yup.string().required('Area is required'),
  address: Yup.string().required('Address is required'),
  latitude: Yup.number().nullable(),
  longitude: Yup.number().nullable(),
});

export const Step3Schema = Yup.object().shape({
  facilities: Yup.object().shape({
    lift: Yup.boolean(),
    parking: Yup.boolean(),
    generator: Yup.boolean(),
    security: Yup.boolean(),
    solar: Yup.boolean(),
    others: Yup.string(),
  }),
});

export const Step4Schema = Yup.object().shape({
  media: Yup.array().min(1, 'At least one image is required'),
});

export const stepSchemas = [
  Step1Schema,
  Step2Schema,
  Step3Schema,
  Step4Schema,
];
