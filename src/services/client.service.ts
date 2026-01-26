import api from './api';

export const clientService = {
  getClients: async () => {
    return api.get('/clients');
  },
  getClientById: async (id: string | number) => {
    return api.get(`/clients/${id}`);
  },
  createClient: async (clientData: any) => {
    return api.post('/clients', clientData);
  },
  deleteClient: async (id: string | number) => {
    return api.delete(`/clients/${id}`);
  }
};
