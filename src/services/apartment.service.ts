import api from './api';

export interface ParentApartment {
  id: number;
  apartment_name: string;
  province_id?: number;
  district_id?: number;
  area_id?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  total_floors?: number;
  total_units?: number;
  description?: string;
  facilities?: any;
  building_images?: string[];
  created_by: number;
  status: 'active' | 'inactive';
  ProvinceData?: { name: string };
  DistrictData?: { name: string };
  AreaData?: { name: string };
  Units?: any[];
  Agent?: { full_name: string; email: string };
  createdAt: string;
}

class ApartmentService {
  async getApartments() {
    const response = await api.get<ParentApartment[]>('/public/apartments');
    return response.data;
  }

  async getMyApartments() {
    const response = await api.get<ParentApartment[]>('/apartments/my');
    return response.data;
  }

  async getApartmentById(id: number) {
    const response = await api.get<ParentApartment>(`/public/apartments/${id}`);
    return response.data;
  }

  async createApartment(data: Partial<ParentApartment>) {
    const response = await api.post<ParentApartment>('/apartments', data);
    return response.data;
  }

  async updateApartment(id: number, data: Partial<ParentApartment>) {
    if (!id || isNaN(id)) throw new Error('Invalid ID for updateApartment');
    const response = await api.put<ParentApartment>(`/apartments/${id}`, data);
    return response.data;
  }

  async deleteApartment(id: number) {
    if (!id || isNaN(id)) throw new Error('Invalid ID for deleteApartment');
    const response = await api.delete(`/apartments/${id}`);
    return response.data;
  }

  async getApartmentUnits(id: number) {
    const response = await api.get(`/public/apartments/${id}/properties`);
    return response.data;
  }

  async uploadApartmentFiles(id: number, filesData: FormData) {
    const response = await api.post<ParentApartment>(`/apartments/${id}/upload`, filesData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteApartmentFile(id: number, fileUrl: string) {
    const response = await api.delete<ParentApartment>(`/apartments/${id}/file`, {
      data: { fileUrl }
    });
    return response.data;
  }
}

export default new ApartmentService();
