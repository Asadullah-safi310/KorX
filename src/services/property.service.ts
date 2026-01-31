import api from './api';

export const propertyService = {
  getProperties: async (limit?: number, offset?: number) => {
    return api.get('/properties', { params: { limit, offset } });
  },
  getPropertyById: async (id: string | number) => {
    return api.get(`/properties/${id}`);
  },
  searchProperties: async (filters: any) => {
    return api.get('/public/properties/search', { params: filters });
  },
  getUserProperties: async (filters: any) => {
    return api.get('/properties/search', { params: filters });
  },
  getMyProperties: async () => {
    return api.get('/properties/my-properties');
  },
  getPublicProperties: async (limit: number = 6, offset: number = 0) => {
    return api.get('/public/properties/public', { params: { limit, offset } });
  },
  getPublicPropertiesByUser: async (userId: string | number, limit: number = 10) => {
    return api.get(`/public/properties/user/${userId}`, { params: { limit } });
  },
  getDashboardStats: async () => {
    return api.get('/properties/dashboard/stats');
  },
  getCurrentOwner: async (propertyId: string | number) => {
    return api.get(`/person-property-roles/property/${propertyId}/current-owner`);
  },
  createProperty: async (propertyData: any) => {
    return api.post('/properties', propertyData);
  },
  updateProperty: async (id: string | number, propertyData: any) => {
    return api.put(`/properties/${id}`, propertyData);
  },
  uploadPropertyFiles: async (id: string | number, filesData: FormData) => {
    return api.post(`/properties/${id}/upload`, filesData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deletePropertyFile: async (id: string | number, fileUrl: string, type: 'photo' | 'video' | 'attachment') => {
    return api.delete(`/properties/${id}/file`, { data: { fileUrl, type } });
  },
  deleteProperty: async (id: string | number) => {
    return api.delete(`/properties/${id}`);
  },
  getPropertyChildren: async (id: string | number) => {
    return api.get(`/properties/${id}/children`);
  },
  addChildProperty: async (id: string | number, childData: any) => {
    return api.post(`/properties/${id}/children`, childData);
  }
};
