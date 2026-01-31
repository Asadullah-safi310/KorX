import { makeAutoObservable, runInAction } from 'mobx';
import apartmentService, { ParentApartment } from '../services/apartment.service';

class ApartmentStore {
  apartments: ParentApartment[] = [];
  myApartments: ParentApartment[] = [];
  currentApartment: ParentApartment | null = null;
  apartmentUnits: any[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fetchApartments = async () => {
    this.loading = true;
    try {
      const data = await apartmentService.getApartments();
      runInAction(() => {
        this.apartments = Array.isArray(data) ? data : [];
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

  fetchMyApartments = async () => {
    this.loading = true;
    try {
      const data = await apartmentService.getMyApartments();
      runInAction(() => {
        this.myApartments = Array.isArray(data) ? data : [];
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

  fetchApartmentById = async (id: number) => {
    if (!id || isNaN(id)) {
      console.warn('Invalid apartment ID passed to fetchApartmentById:', id);
      return null;
    }
    this.loading = true;
    try {
      const data = await apartmentService.getApartmentById(id);
      runInAction(() => {
        if (data && (data.id || (data as any).apartment_id)) {
          // Ensure id field exists even if backend returns apartment_id
          if (!(data as any).id && (data as any).apartment_id) {
            (data as any).id = (data as any).apartment_id;
          }
          this.currentApartment = data;
          this.error = null;
        } else {
          console.warn('Fetched apartment data is invalid:', data);
          this.currentApartment = null;
        }
      });
      return data;
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

  fetchApartmentUnits = async (id: number) => {
    this.loading = true;
    try {
      const data = await apartmentService.getApartmentUnits(id);
      runInAction(() => {
        this.apartmentUnits = data;
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

  createApartment = async (data: Partial<ParentApartment>) => {
    this.loading = true;
    try {
      const newApartment = await apartmentService.createApartment(data);
      if (!newApartment || !newApartment.id) {
        throw new Error('Invalid response from server: Missing apartment ID');
      }
      runInAction(() => {
        this.myApartments.unshift(newApartment);
        this.error = null;
      });
      return newApartment;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message;
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateApartment = async (id: number, data: Partial<ParentApartment>) => {
    if (!id || isNaN(id)) {
      throw new Error('Invalid apartment ID for update');
    }
    this.loading = true;
    try {
      const updatedApartment = await apartmentService.updateApartment(id, data);
      if (!updatedApartment || (!updatedApartment.id && !(updatedApartment as any).apartment_id)) {
        throw new Error('Invalid response from server: Missing apartment ID');
      }
      // Ensure id consistency
      if (!updatedApartment.id && (updatedApartment as any).apartment_id) {
        updatedApartment.id = (updatedApartment as any).apartment_id;
      }
      runInAction(() => {
        const index = this.myApartments.findIndex(a => a.id === id);
        if (index !== -1) {
          this.myApartments[index] = updatedApartment;
        }
        if (this.currentApartment?.id === id) {
          this.currentApartment = updatedApartment;
        }
        this.error = null;
      });
      return updatedApartment;
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message;
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteApartment = async (id: number) => {
    if (!id || isNaN(id)) {
      throw new Error('Invalid apartment ID for deletion');
    }
    this.loading = true;
    try {
      await apartmentService.deleteApartment(id);
      runInAction(() => {
        this.myApartments = this.myApartments.filter(a => a.id !== id);
        this.apartments = this.apartments.filter(a => a.id !== id);
        if (this.currentApartment?.id === id) {
          this.currentApartment = null;
        }
        this.error = null;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message;
      });
      throw error;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  uploadApartmentFiles = async (id: number, filesData: FormData) => {
    try {
      const updatedApartment = await apartmentService.uploadApartmentFiles(id, filesData);
      runInAction(() => {
        if (this.currentApartment?.id === id) {
          this.currentApartment = updatedApartment;
        }
        const index = this.myApartments.findIndex(a => a.id === id);
        if (index !== -1) {
          this.myApartments[index] = updatedApartment;
        }
      });
      return updatedApartment;
    } catch (error: any) {
      throw error;
    }
  };

  deleteApartmentFile = async (id: number, fileUrl: string) => {
    try {
      const updatedApartment = await apartmentService.deleteApartmentFile(id, fileUrl);
      runInAction(() => {
        if (this.currentApartment?.id === id) {
          this.currentApartment = updatedApartment;
        }
        const index = this.myApartments.findIndex(a => a.id === id);
        if (index !== -1) {
          this.myApartments[index] = updatedApartment;
        }
      });
      return updatedApartment;
    } catch (error: any) {
      throw error;
    }
  };
}

const apartmentStore = new ApartmentStore();
export default apartmentStore;
