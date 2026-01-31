export interface User {
  user_id: number;
  username: string;
  email: string | null;
  full_name: string;
  phone: string;
  profile_picture: string | null;
  bio: string | null;
  address: string | null;
  national_id: string | null;
  is_active: boolean;
  role: 'admin' | 'user' | 'agent';
  createdAt?: string;
  updatedAt?: string;
}

export interface Property {
  property_id: number;
  owner_person_id: number | null;
  agent_id: number | null;
  created_by_user_id: number | null;
  status: 'available' | 'under_deal' | 'unavailable';
  property_type: string;
  purpose: string;
  sale_price: number | null;
  rent_price: number | null;
  province_id: number | null;
  district_id: number | null;
  area_id: number | null;
  address: string | null;
  location: string | null;
  city: string | null;
  area_size: string;
  bedrooms: number | null;
  bathrooms: number | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  photos: string[];
  attachments: string[];
  videos: string[];
  is_available_for_sale: boolean;
  is_available_for_rent: boolean;
  is_unavailable: boolean;
  is_photo_available: boolean;
  is_attachment_available: boolean;
  is_video_available: boolean;
  is_parent: boolean;
  parent_property_id: number | null;
  Parent?: {
    property_id: number;
    title: string;
    property_type: string;
  };
  unit_number: string | null;
  floor: string | null;
  unit_type: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Person {
  person_id: number;
  full_name: string;
  phone: string;
  national_id: string;
  email: string | null;
  address: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  client_id: number;
  client_name: string;
  phone: string;
  requirement_type: string;
  property_type: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Deal {
  deal_id: number;
  property_id: number;
  client_id: number;
  final_price: number;
  deal_type: string;
  createdAt?: string;
  updatedAt?: string;
}
