/** @format */

import { create } from "zustand";
import { Disease, DiseaseInput } from "../types";
import { diseaseApi } from "../lib/api";
import toast from "react-hot-toast";

interface DiseaseState {
  diseases: Disease[];
  currentDisease: Disease | null;
  isLoading: boolean;
  error: string | null;

  fetchDiseases: () => Promise<void>;
  fetchDiseaseById: (id: number) => Promise<void>;
  createDisease: (disease: DiseaseInput) => Promise<boolean>;
  updateDisease: (
    id: number,
    disease: Partial<DiseaseInput>
  ) => Promise<boolean>;
  deleteDisease: (id: number) => Promise<boolean>;
  resetCurrentDisease: () => void;
}

export const useDiseaseStore = create<DiseaseState>((set) => ({
  diseases: [],
  currentDisease: null,
  isLoading: false,
  error: null,

  fetchDiseases: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await diseaseApi.getAll();
      set({ diseases: response.results || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to fetch diseases",
        isLoading: false,
      });
      toast.error("Failed to fetch diseases");
    }
  },

  fetchDiseaseById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const disease = await diseaseApi.getById(id);
      set({ currentDisease: disease, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.detail || "Failed to fetch disease details",
        isLoading: false,
      });
      toast.error("Failed to fetch disease details");
    }
  },

  createDisease: async (disease: DiseaseInput) => {
    set({ isLoading: true, error: null });
    try {
      const newDisease = await diseaseApi.create(disease);
      set((state) => ({
        diseases: [...state.diseases, newDisease],
        isLoading: false,
      }));
      toast.success("Disease created successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to create disease",
        isLoading: false,
      });
      toast.error("Failed to create disease");
      return false;
    }
  },

  updateDisease: async (id: number, disease: Partial<DiseaseInput>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedDisease = await diseaseApi.update(id, disease);
      set((state) => ({
        diseases: state.diseases.map((d) => (d.id === id ? updatedDisease : d)),
        currentDisease: updatedDisease,
        isLoading: false,
      }));
      toast.success("Disease updated successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to update disease",
        isLoading: false,
      });
      toast.error("Failed to update disease");
      return false;
    }
  },

  deleteDisease: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await diseaseApi.delete(id);
      set((state) => ({
        diseases: state.diseases.filter((d) => d.id !== id),
        isLoading: false,
      }));
      toast.success("Disease deleted successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to delete disease",
        isLoading: false,
      });
      toast.error("Failed to delete disease");
      return false;
    }
  },

  resetCurrentDisease: () => {
    set({ currentDisease: null });
  },
}));
