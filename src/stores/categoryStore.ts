/** @format */

import { create } from "zustand";
import { PlantCategory, PlantCategoryInput } from "../types";
import { categoryApi } from "../lib/api";
import toast from "react-hot-toast";

interface CategoryState {
  categories: PlantCategory[];
  currentCategory: PlantCategory | null;
  isLoading: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  fetchCategoryById: (id: number) => Promise<void>;
  createCategory: (category: PlantCategoryInput) => Promise<boolean>;
  updateCategory: (
    id: number,
    category: Partial<PlantCategoryInput>
  ) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  resetCurrentCategory: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  currentCategory: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoryApi.getAll();
      console.log(response);
      set({ categories: response.results || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to fetch categories",
        isLoading: false,
      });
      toast.error("Failed to fetch plant categories");
    }
  },

  fetchCategoryById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const category = await categoryApi.getById(id);
      set({ currentCategory: category, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.detail || "Failed to fetch category details",
        isLoading: false,
      });
      toast.error("Failed to fetch category details");
    }
  },

  createCategory: async (category: PlantCategoryInput) => {
    set({ isLoading: true, error: null });
    try {
      const newCategory = await categoryApi.create(category);
      set((state) => ({
        categories: [...state.categories, newCategory],
        isLoading: false,
      }));
      toast.success("Plant category created successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to create category",
        isLoading: false,
      });
      toast.error("Failed to create plant category");
      return false;
    }
  },

  updateCategory: async (id: number, category: Partial<PlantCategoryInput>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCategory = await categoryApi.update(id, category);
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === id ? updatedCategory : c
        ),
        currentCategory: updatedCategory,
        isLoading: false,
      }));
      toast.success("Plant category updated successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to update category",
        isLoading: false,
      });
      toast.error("Failed to update plant category");
      return false;
    }
  },

  deleteCategory: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await categoryApi.delete(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        isLoading: false,
      }));
      toast.success("Plant category deleted successfully");
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || "Failed to delete category",
        isLoading: false,
      });
      toast.error("Failed to delete plant category");
      return false;
    }
  },

  resetCurrentCategory: () => {
    set({ currentCategory: null });
  },
}));
