/** @format */

import { create } from "zustand";
import { MedicinalPlant, MedicinalPlantInput } from "../types";
import { medicinalPlantApi } from "../lib/api";
import toast from "react-hot-toast";

interface PlantState {
  plants: MedicinalPlant[];
  currentPlant: MedicinalPlant | null;
  isLoading: boolean;
  error: string | null;

  fetchPlants: () => Promise<void>;
  fetchPlantById: (id: number) => Promise<void>;
  createPlant: (plant: MedicinalPlantInput) => Promise<boolean>;
  updatePlant: (
    id: number,
    plant: Partial<MedicinalPlantInput>
  ) => Promise<boolean>;
  deletePlant: (id: number) => Promise<boolean>;
  resetCurrentPlant: () => void;
}

export const usePlantStore = create<PlantState>((set) => ({
  plants: [],
  currentPlant: null,
  isLoading: false,
  error: null,

  fetchPlants: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await medicinalPlantApi.getAll();
      set({ plants: response.results || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to fetch plants",
        isLoading: false,
      });
      toast.error("Failed to fetch Tanaman Obat");
    }
  },

  fetchPlantById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const plant = await medicinalPlantApi.getById(id);
      set({ currentPlant: plant, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to fetch plant details",
        isLoading: false,
      });
      toast.error("Failed to fetch plant details");
    }
  },

  createPlant: async (plant: MedicinalPlantInput) => {
    set({ isLoading: true, error: null });
    try {
      const newPlant = await medicinalPlantApi.create(plant);
      set((state) => ({
        plants: [...state.plants, newPlant],
        isLoading: false,
      }));
      toast.success("Medicinal plant created successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to create plant",
        isLoading: false,
      });
      toast.error("Failed to create medicinal plant");
      return false;
    }
  },

  updatePlant: async (id: number, plant: Partial<MedicinalPlantInput>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPlant = await medicinalPlantApi.update(id, plant);
      set((state) => ({
        plants: state.plants.map((p) => (p.id === id ? updatedPlant : p)),
        currentPlant: updatedPlant,
        isLoading: false,
      }));
      toast.success("Medicinal plant updated successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to update plant",
        isLoading: false,
      });
      toast.error("Failed to update medicinal plant");
      return false;
    }
  },

  deletePlant: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await medicinalPlantApi.delete(id);
      set((state) => ({
        plants: state.plants.filter((p) => p.id !== id),
        isLoading: false,
      }));
      toast.success("Medicinal plant deleted successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to delete plant",
        isLoading: false,
      });
      toast.error("Failed to delete medicinal plant");
      return false;
    }
  },

  resetCurrentPlant: () => {
    set({ currentPlant: null });
  },
}));
