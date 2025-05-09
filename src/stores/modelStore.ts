/** @format */

import { create } from "zustand";
import { Plant3DModel, Plant3DModelInput } from "../types";
import { model3dApi } from "../lib/api";
import toast from "react-hot-toast";

interface ModelState {
  models: Plant3DModel[];
  currentModel: Plant3DModel | null;
  isLoading: boolean;
  error: string | null;

  fetchModels: () => Promise<void>;
  fetchModelById: (id: number) => Promise<void>;
  fetchModelsByPlantId: (plantId: number) => Promise<void>;
  createModel: (model: Plant3DModelInput) => Promise<boolean>;
  updateModel: (
    id: number,
    model: Partial<Plant3DModelInput>
  ) => Promise<boolean>;
  deleteModel: (id: number) => Promise<boolean>;
  resetCurrentModel: () => void;
}

export const useModelStore = create<ModelState>((set) => ({
  models: [],
  currentModel: null,
  isLoading: false,
  error: null,

  fetchModels: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await model3dApi.getAll();
      set({ models: response.results || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to fetch 3D models",
        isLoading: false,
      });
      toast.error("Failed to fetch plant 3D models");
    }
  },

  fetchModelById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const model = await model3dApi.getById(id);
      set({ currentModel: model, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to fetch model details",
        isLoading: false,
      });
      toast.error("Failed to fetch 3D model details");
    }
  },

  fetchModelsByPlantId: async (plantId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await model3dApi.getAll();
      const plantModels = (response.results || []).filter(
        (model) => model.plant === plantId
      );
      set({ models: plantModels, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.detail || "Failed to fetch plant 3D models",
        isLoading: false,
      });
      toast.error("Failed to fetch plant 3D models");
    }
  },

  createModel: async (model: Plant3DModelInput) => {
    set({ isLoading: true, error: null });
    try {
      const newModel = await model3dApi.create(model);
      set((state) => ({
        models: [...state.models, newModel],
        isLoading: false,
      }));
      toast.success("3D model created successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to create 3D model",
        isLoading: false,
      });
      toast.error("Failed to create 3D model");
      return false;
    }
  },

  updateModel: async (id: number, model: Partial<Plant3DModelInput>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedModel = await model3dApi.update(id, model);
      set((state) => ({
        models: state.models.map((m) => (m.id === id ? updatedModel : m)),
        currentModel: updatedModel,
        isLoading: false,
      }));
      toast.success("3D model updated successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to update 3D model",
        isLoading: false,
      });
      toast.error("Failed to update 3D model");
      return false;
    }
  },

  deleteModel: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await model3dApi.delete(id);
      set((state) => ({
        models: state.models.filter((m) => m.id !== id),
        isLoading: false,
      }));
      toast.success("3D model deleted successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to delete 3D model",
        isLoading: false,
      });
      toast.error("Failed to delete 3D model");
      return false;
    }
  },

  resetCurrentModel: () => {
    set({ currentModel: null });
  },
}));
