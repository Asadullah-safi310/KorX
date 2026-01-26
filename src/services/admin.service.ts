import api from './api';

export const adminService = {
  getStats: async () => {
    return api.get('/admin/stats');
  }
};
