import * as Yup from 'yup';
import { propertyBaseSchema } from '../../../validation/schemas';

export const initialValues = {
  // Step 1
  agent_id: '',
  property_type: 'House',
  purpose: 'SALE',

  // Step 2
  title: '',
  description: '',
  area_size: '',
  bedrooms: 0,
  bathrooms: 0,
  province_id: '',
  district_id: '',
  area_id: '',
  location: '',

  // Step 3
  latitude: null,
  longitude: null,

  // Step 4
  is_available_for_sale: true,
  is_available_for_rent: false,
  sale_price: '',
  rent_price: '',

  // Step 5
  media: [], // This will store new files to upload
  existingMedia: [], // This will store already uploaded media (for edit mode)

  // Step 6
  amenities: [],
};

export const Step1Schema = Yup.object().shape({
  agent_id: Yup.string().nullable(),
  property_type: propertyBaseSchema.property_type,
  purpose: Yup.string().oneOf(['SALE', 'RENT']).required('Purpose is required'),
});

export const Step2Schema = Yup.object().shape({
  title: Yup.string().nullable(),
  description: Yup.string().required('Description is required'),
  area_size: propertyBaseSchema.area_size,
  bedrooms: propertyBaseSchema.bedrooms,
  bathrooms: propertyBaseSchema.bathrooms,
  province_id: Yup.string().required('City is required'),
  district_id: Yup.string().required('District is required'),
  area_id: Yup.string().required('Region is required'),
  location: Yup.string().required('Location is required'),
});

export const Step3Schema = Yup.object().shape({
  latitude: Yup.number().nullable(),
  longitude: Yup.number().nullable(),
});

export const Step4Schema = Yup.object().shape({
  is_available_for_sale: propertyBaseSchema.is_available_for_sale,
  is_available_for_rent: propertyBaseSchema.is_available_for_rent,
  sale_price: propertyBaseSchema.sale_price,
  rent_price: propertyBaseSchema.rent_price,
}).test('at-least-one-purpose', 'Must be available for either sale or rent', function(value) {
    return value.is_available_for_sale || value.is_available_for_rent;
});

export const Step5Schema = Yup.object().shape({
  media: Yup.array(),
}).test('at-least-one-image', 'At least one image is required', function() {
    const { media, existingMedia } = this.parent || {};
    return (media?.length || 0) + (existingMedia?.length || 0) > 0;
});

export const Step6Schema = Yup.object().shape({
  amenities: Yup.array(),
});

export const Step7Schema = Yup.object().shape({});

export const stepSchemas = [
  Step1Schema,
  Step2Schema,
  Step3Schema,
  Step4Schema,
  Step5Schema,
  Step6Schema,
  Step7Schema,
];
