import { makeAutoObservable, runInAction } from 'mobx';
import { clientService } from '../services/client.service';

class ClientStore {
  clients: any[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchClients = async () => {
    this.loading = true;
    try {
      const response = await clientService.getClients();
      runInAction(() => {
        this.clients = response.data;
        this.error = null;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  fetchClientById = async (id: number | string) => {
    this.loading = true;
    try {
      const response = await clientService.getClientById(id);
      runInAction(() => {
        this.error = null;
      });
      return response.data;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message;
      });
      return null;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  createClient = async (clientData: any) => {
    this.loading = true;
    try {
      await clientService.createClient(clientData);
      await this.fetchClients();
      runInAction(() => {
        this.error = null;
      });
      return true;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.message || error.message;
      });
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteClient = async (id: number | string) => {
    this.loading = true;
    try {
      await clientService.deleteClient(id);
      await this.fetchClients();
      runInAction(() => {
        this.error = null;
      });
      return true;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.response?.data?.error || error.message;
      });
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}

const clientStore = new ClientStore();
export default clientStore;
