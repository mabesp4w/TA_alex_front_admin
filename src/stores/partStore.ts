/** @format */

import { create } from "zustand";
import { PlantPart, PlantPartInput } from "../types";
import { partApi } from "../lib/api";
import toast from "react-hot-toast";

interface PartState {
  parts: PlantPart[];
  currentPart: PlantPart | null;
  isLoading: boolean;
  error: string | null;

  fetchParts: () => Promise<void>;
  fetchPartById: (id: number) => Promise<void>;
  createPart: (part: PlantPartInput) => Promise<boolean>;
  updatePart: (id: number, part: Partial<PlantPartInput>) => Promise<boolean>;
  deletePart: (id: number) => Promise<boolean>;
  resetCurrentPart: () => void;
}

export const usePartStore = create<PartState>((set) => ({
  parts: [],
  currentPart: null,
  isLoading: false,
  error: null,

  fetchParts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await partApi.getAll();
      set({ parts: response.results || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to fetch plant parts",
        isLoading: false,
      });
      toast.error("Failed to fetch plant parts");
    }
  },

  fetchPartById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const part = await partApi.getById(id);
      set({ currentPart: part, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to fetch part details",
        isLoading: false,
      });
      toast.error("Failed to fetch plant part details");
    }
  },

  createPart: async (part: PlantPartInput) => {
    set({ isLoading: true, error: null });
    try {
      const newPart = await partApi.create(part);
      set((state) => ({
        parts: [...state.parts, newPart],
        isLoading: false,
      }));
      toast.success("Plant part created successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to create plant part",
        isLoading: false,
      });
      toast.error("Failed to create plant part");
      return false;
    }
  },

  updatePart: async (id: number, part: Partial<PlantPartInput>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPart = await partApi.update(id, part);
      set((state) => ({
        parts: state.parts.map((p) => (p.id === id ? updatedPart : p)),
        currentPart: updatedPart,
        isLoading: false,
      }));
      toast.success("Plant part updated successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to update plant part",
        isLoading: false,
      });
      toast.error("Failed to update plant part");
      return false;
    }
  },

  deletePart: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await partApi.delete(id);
      set((state) => ({
        parts: state.parts.filter((p) => p.id !== id),
        isLoading: false,
      }));
      toast.success("Plant part deleted successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to delete plant part",
        isLoading: false,
      });
      toast.error("Failed to delete plant part");
      return false;
    }
  },

  resetCurrentPart: () => {
    set({ currentPart: null });
  },
}));
