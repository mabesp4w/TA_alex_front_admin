/** @format */

import axios from "axios";
import Cookies from "js-cookie";
import {
  ApiResponse,
  MedicinalPlant,
  MedicinalPlantInput,
  PlantCategory,
  PlantCategoryInput,
  PlantPart,
  PlantPartInput,
  Disease,
  DiseaseInput,
  Plant3DModel,
  Plant3DModelInput,
} from "../types";
import { BASE_URL } from "@/services/baseURL";

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use((config) => {
  const token = Cookies.get("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
const API_ENDPOINTS = {
  MEDICINAL_PLANTS: "/crud/medicinal-plants/",
  CATEGORIES: "/crud/categories/",
  PARTS: "/crud/parts/",
  DISEASES: "/crud/diseases/",
  MODELS_3D: "/crud/3d-models/",
};

// Helper function to handle file uploads
const createFormData = (data: any) => {
  const formData = new FormData();

  // Convert regular fields to FormData
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      // Handle file uploads
      if (key === "image" || key === "model_file") {
        if (data[key] instanceof File) {
          formData.append(key, data[key]);
        }
      }
      // Handle arrays (for many-to-many relationships)
      else if (Array.isArray(data[key])) {
        data[key].forEach((item: any, index: number) => {
          if (typeof item === "object") {
            Object.keys(item).forEach((subKey) => {
              formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
            });
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      }
      // Handle regular fields
      else if (typeof data[key] !== "object") {
        formData.append(key, data[key].toString());
      }
      // Handle nested objects
      else {
        formData.append(key, JSON.stringify(data[key]));
      }
    }
  });

  return formData;
};

// Tanaman Obat API
export const medicinalPlantApi = {
  getAll: async (): Promise<ApiResponse<MedicinalPlant>> => {
    const response = await api.get(API_ENDPOINTS.MEDICINAL_PLANTS);
    return response.data;
  },

  getById: async (id: number): Promise<MedicinalPlant> => {
    const response = await api.get(`${API_ENDPOINTS.MEDICINAL_PLANTS}${id}/`);
    return response.data;
  },

  create: async (plant: MedicinalPlantInput): Promise<MedicinalPlant> => {
    const formData = createFormData(plant);
    const response = await api.post(API_ENDPOINTS.MEDICINAL_PLANTS, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (
    id: number,
    plant: Partial<MedicinalPlantInput>
  ): Promise<MedicinalPlant> => {
    const formData = createFormData(plant);
    const response = await api.patch(
      `${API_ENDPOINTS.MEDICINAL_PLANTS}${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.MEDICINAL_PLANTS}${id}/`);
  },
};

// Plant Categories API
export const categoryApi = {
  getAll: async (): Promise<ApiResponse<PlantCategory>> => {
    const response = await api.get(API_ENDPOINTS.CATEGORIES);
    return response.data;
  },

  getById: async (id: number): Promise<PlantCategory> => {
    const response = await api.get(`${API_ENDPOINTS.CATEGORIES}${id}/`);
    return response.data;
  },

  create: async (category: PlantCategoryInput): Promise<PlantCategory> => {
    const response = await api.post(API_ENDPOINTS.CATEGORIES, category);
    return response.data;
  },

  update: async (
    id: number,
    category: Partial<PlantCategoryInput>
  ): Promise<PlantCategory> => {
    const response = await api.patch(
      `${API_ENDPOINTS.CATEGORIES}${id}/`,
      category
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.CATEGORIES}${id}/`);
  },
};

// Plant Parts API
export const partApi = {
  getAll: async (): Promise<ApiResponse<PlantPart>> => {
    const response = await api.get(API_ENDPOINTS.PARTS);
    return response.data;
  },

  getById: async (id: number): Promise<PlantPart> => {
    const response = await api.get(`${API_ENDPOINTS.PARTS}${id}/`);
    return response.data;
  },

  create: async (part: PlantPartInput): Promise<PlantPart> => {
    const response = await api.post(API_ENDPOINTS.PARTS, part);
    return response.data;
  },

  update: async (
    id: number,
    part: Partial<PlantPartInput>
  ): Promise<PlantPart> => {
    const response = await api.patch(`${API_ENDPOINTS.PARTS}${id}/`, part);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.PARTS}${id}/`);
  },
};

// Diseases API
export const diseaseApi = {
  getAll: async (): Promise<ApiResponse<Disease>> => {
    const response = await api.get(API_ENDPOINTS.DISEASES);
    return response.data;
  },

  getById: async (id: number): Promise<Disease> => {
    const response = await api.get(`${API_ENDPOINTS.DISEASES}${id}/`);
    return response.data;
  },

  create: async (disease: DiseaseInput): Promise<Disease> => {
    const response = await api.post(API_ENDPOINTS.DISEASES, disease);
    return response.data;
  },

  update: async (
    id: number,
    disease: Partial<DiseaseInput>
  ): Promise<Disease> => {
    const response = await api.patch(
      `${API_ENDPOINTS.DISEASES}${id}/`,
      disease
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.DISEASES}${id}/`);
  },
};

// 3D Models API
export const model3dApi = {
  getAll: async (): Promise<ApiResponse<Plant3DModel>> => {
    const response = await api.get(API_ENDPOINTS.MODELS_3D);
    return response.data;
  },

  getById: async (id: number): Promise<Plant3DModel> => {
    const response = await api.get(`${API_ENDPOINTS.MODELS_3D}${id}/`);
    return response.data;
  },

  create: async (model: Plant3DModelInput): Promise<Plant3DModel> => {
    const formData = createFormData(model);
    const response = await api.post(API_ENDPOINTS.MODELS_3D, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (
    id: number,
    model: Partial<Plant3DModelInput>
  ): Promise<Plant3DModel> => {
    const formData = createFormData(model);
    const response = await api.patch(
      `${API_ENDPOINTS.MODELS_3D}${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${API_ENDPOINTS.MODELS_3D}${id}/`);
  },
};

export default {
  medicinalPlantApi,
  categoryApi,
  partApi,
  diseaseApi,
  model3dApi,
};
