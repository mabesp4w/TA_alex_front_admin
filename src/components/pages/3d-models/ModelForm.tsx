/** @format */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";

import { Plant3DModel, Plant3DModelInput } from "@/types";
import { useModelStore } from "@/stores/modelStore";
import { usePlantStore } from "@/stores/plantStore";

interface ModelFormProps {
  initialData?: Plant3DModel;
  preSelectedPlantId?: number;
  isEdit?: boolean;
}

const ModelForm: React.FC<ModelFormProps> = ({
  initialData,
  preSelectedPlantId,
  isEdit = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get data and actions from stores
  const { createModel, updateModel } = useModelStore();
  const { plants, fetchPlants } = usePlantStore();

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<Plant3DModelInput>({
    defaultValues: initialData
      ? {
          plant: initialData.plant,
          title: initialData.title,
          description: initialData.description || "",
          is_default: initialData.is_default,
        }
      : {
          plant: preSelectedPlantId || 0,
          title: "",
          description: "",
          is_default: false,
        },
  });

  // Fetch plants data on component mount
  useEffect(() => {
    fetchPlants();

    // Set plant ID from URL query parameter if available
    if (!isEdit && preSelectedPlantId) {
      setValue("plant", preSelectedPlantId);
    }
  }, [fetchPlants, isEdit, preSelectedPlantId, setValue]);

  // Form submission handler
  const onSubmit = async (data: Plant3DModelInput) => {
    setIsSubmitting(true);

    try {
      let success = false;

      if (isEdit && initialData) {
        success = await updateModel(initialData.id, data);
      } else {
        success = await createModel(data);
      }

      if (success) {
        // If we have a plant ID, redirect to that plant's 3D models
        if (data.plant) {
          router.push(`/3d-models?plant=${data.plant}`);
        } else {
          router.push("/3d-models");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format options for plant select component
  const plantOptions = plants.map((p) => ({ value: p.id, label: p.plant_nm }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Plant Selection */}
      {!preSelectedPlantId && (
        <div>
          <Controller
            name="plant"
            control={control}
            rules={{ required: "Please select a plant" }}
            render={({ field }) => (
              <Select
                label="Tanaman"
                placeholder="Select a plant"
                options={plantOptions}
                value={
                  plantOptions.find((option) => option.value === field.value) ||
                  null
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onChange={(newValue) => field.onChange(newValue?.value || 0)}
                error={errors.plant?.message}
              />
            )}
          />
        </div>
      )}

      {/* Model Title */}
      <Input
        label="Judul Model"
        placeholder="Masukkan judul model"
        error={errors.title?.message}
        {...register("title", {
          required: "Judul model wajib diisi",
          maxLength: {
            value: 200,
            message: "Model title cannot exceed 200 characters",
          },
        })}
      />

      {/* Description */}
      <Textarea
        label="Deskripsi"
        placeholder="Masukkan deskripsi model (opsional)"
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />

      {/* Model File Upload */}
      {!isEdit && (
        <div>
          <Controller
            name="model_file"
            control={control}
            rules={{ required: "Silahkan unggah file model 3D" }}
            render={({ field }) => (
              <FileUpload
                label="File Model 3D"
                accept=".glb,.gltf,.obj,.fbx,.stl,.dae"
                onChange={(file) => field.onChange(file)}
                error={errors.model_file?.message}
                helper="Unggah file model 3D (GLB, GLTF, OBJ, FBX, STL, DAE)"
              />
            )}
          />
        </div>
      )}

      {/* Is Default Model */}
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-3">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register("is_default")}
          />
          <span className="label-text">
            Setel sebagai model default untuk tanaman ini
          </span>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/3d-models")}
        >
          Batal
        </Button>

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          loadingText={isEdit ? "Memperbarui..." : "Menambahkan..."}
        >
          {isEdit ? "Simpan Perubahan" : "Tambah Model 3D"}
        </Button>
      </div>
    </form>
  );
};

export default ModelForm;
