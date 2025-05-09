/** @format */

// Define types based on Django models

export interface MedicinalPlant {
  id: number;
  plant_nm: string;
  latin_nm?: string;
  description: string;
  usage_method?: string;
  benefits: string;
  image?: string;
  created_at: string;
  updated_at: string;
  categories?: PlantCategory[];
  parts?: PlantPart[];
  diseases?: DiseaseWithRelation[];
  models_3d?: Plant3DModel[];
}

export interface PlantCategory {
  id: number;
  category_nm: string;
  description?: string;
}

export interface PlantPart {
  id: number;
  plant_part_nm: string;
  description?: string;
}

export interface Disease {
  id: number;
  disease_nm: string;
  description: string;
  symptoms?: string;
}

export interface DiseaseWithRelation extends Disease {
  notes?: string; // From PlantDiseaseRelation
}

export interface Plant3DModel {
  id: number;
  plant: number; // Foreign key to MedicinalPlant
  title: string;
  description?: string;
  model_file: string;
  file_size?: number;
  created_at: string;
  updated_at: string;
  is_default: boolean;
}

// Relation types (for many-to-many relationships)
export interface PlantCategoryRelation {
  plant: number;
  category: number;
}

export interface PlantPartRelation {
  plant: number;
  part: number;
}

export interface PlantDiseaseRelation {
  plant: number;
  disease: number;
  notes?: string;
}

// Form input types
export interface MedicinalPlantInput {
  plant_nm: string;
  latin_nm?: string;
  description: string;
  usage_method?: string;
  benefits: string;
  image?: File | null;
  categories?: number[];
  parts?: number[];
  diseases?: number[];
}

export interface PlantCategoryInput {
  category_nm: string;
  description?: string;
}

export interface PlantPartInput {
  plant_part_nm: string;
  description?: string;
}

export interface DiseaseInput {
  disease_nm: string;
  description: string;
  symptoms?: string;
}

export interface Plant3DModelInput {
  plant: number;
  title: string;
  description?: string;
  model_file: File;
  is_default: boolean;
}

// API Response types
export interface ApiResponse<T> {
  results?: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
  detail?: string;
  data?: T;
}

// User
export interface User {
  id: number;
  name: string;
  email: string;
}

// static
export interface KelasML {
  id: number;
  kelas_nm: string;
}
