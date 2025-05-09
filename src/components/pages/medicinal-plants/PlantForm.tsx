/** @format */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import FileUpload from "@/components/ui/FileUpload";

import { MedicinalPlant, MedicinalPlantInput } from "@/types";
import { useCategoryStore } from "@/stores/categoryStore";
import { usePartStore } from "@/stores/partStore";
import { useDiseaseStore } from "@/stores/diseaseStore";
import { usePlantStore } from "@/stores/plantStore";
import useKelasMLApi from "@/stores/api/KelasML";
import SelectDef from "@/components/ui/SelectDef";

interface PlantFormProps {
  initialData?: MedicinalPlant;
  isEdit?: boolean;
}

const PlantForm: React.FC<PlantFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get data from stores
  const { createPlant, updatePlant } = usePlantStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { parts, fetchParts } = usePartStore();
  const { diseases, fetchDiseases } = useDiseaseStore();
  const { dtKelasML, setKelasML } = useKelasMLApi();

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MedicinalPlantInput>({
    defaultValues: initialData
      ? {
          plant_nm: initialData.plant_nm,
          latin_nm: initialData.latin_nm || "",
          description: initialData.description,
          usage_method: initialData.usage_method || "",
          benefits: initialData.benefits,
          categories: initialData.categories?.map((c) => c.id),
          parts: initialData.parts?.map((p) => p.id),
          diseases: initialData.diseases?.map((d) => d.id),
        }
      : {
          plant_nm: "",
          latin_nm: "",
          description: "",
          usage_method: "",
          benefits: "",
          categories: [],
          parts: [],
          diseases: [],
        },
  });

  // Fetch required data on component mount
  useEffect(() => {
    fetchCategories();
    fetchParts();
    fetchDiseases();
    setKelasML();
  }, [fetchCategories, fetchParts, fetchDiseases, initialData, setKelasML]);

  console.log({ dtKelasML });

  // Form submission handler
  const onSubmit = async (data: MedicinalPlantInput) => {
    setIsSubmitting(true);
    console.log({ data });
    try {
      const submitData: MedicinalPlantInput = {
        ...data,
      };

      let success = false;

      if (isEdit && initialData) {
        success = await updatePlant(initialData.id, submitData);
      } else {
        success = await createPlant(submitData);
      }

      if (success) {
        router.push("/medicinal-plants");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format options for select components
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.category_nm,
  }));
  const partOptions = parts.map((p) => ({
    value: p.id,
    label: p.plant_part_nm,
  }));
  const diseaseOptions = diseases.map((d) => ({
    value: d.id,
    label: d.disease_nm,
  }));

  const kelasMLOptions = Object.entries(dtKelasML)
    .filter(([key]) => key !== "0")
    .map(([, value]) => ({
      value: value,
      label: value,
    }));

  console.log({ kelasMLOptions });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plant Name */}
        <SelectDef
          label="Nama Tanaman"
          control={control}
          name="plant_nm"
          errors={errors}
          addClass="col-span-1"
          options={kelasMLOptions}
        />

        {/* Latin Name */}
        <Input
          label="Nama Latin"
          placeholder="Masukkan nama latin (optional)"
          error={errors.latin_nm?.message}
          {...register("latin_nm", {
            maxLength: {
              value: 200,
              message: "Nama latin tidak boleh melebihi 200 karakter",
            },
          })}
        />
      </div>

      {/* Description */}
      <Textarea
        label="Deskripsi"
        placeholder="Masukkan deskripsi (optional)"
        rows={4}
        error={errors.description?.message}
        {...register("description", {})}
      />

      {/* Usage Method */}
      <Textarea
        label="Cara Penggunaan"
        placeholder="Masukkan cara penggunaan (optional)"
        rows={3}
        error={errors.usage_method?.message}
        {...register("usage_method")}
      />

      {/* Benefits */}
      <Textarea
        label="Manfaat"
        placeholder="Masukkan manfaat"
        rows={4}
        error={errors.benefits?.message}
        {...register("benefits", {
          required: "Manfaat wajib diisi",
        })}
      />

      {/* Categories */}
      <div>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <Select
              label="Kategori"
              placeholder="Pilih kategori"
              options={categoryOptions}
              isMulti
              value={categoryOptions.filter((option) =>
                field.value?.includes(option.value as number)
              )}
              onChange={(newValue: any) => {
                field.onChange(
                  newValue ? newValue.map((item: any) => item.value) : []
                );
              }}
            />
          )}
        />
      </div>

      {/* Plant Parts */}
      <div>
        <Controller
          name="parts"
          control={control}
          render={({ field }) => (
            <Select
              label="Bagian Tanaman"
              placeholder="Pilih bagian tanaman"
              options={partOptions}
              isMulti
              value={partOptions.filter((option) =>
                field.value?.includes(option.value as number)
              )}
              onChange={(newValue: any) => {
                field.onChange(
                  newValue ? newValue.map((item: any) => item.value) : []
                );
              }}
            />
          )}
        />
      </div>

      {/* Disease */}
      <div>
        <Controller
          name="diseases"
          control={control}
          render={({ field }) => (
            <Select
              label="Penyakit"
              placeholder="Pilih penyakit"
              options={diseaseOptions}
              isMulti
              value={diseaseOptions.filter((option) =>
                field.value?.includes(option.value as number)
              )}
              onChange={(newValue: any) => {
                field.onChange(
                  newValue ? newValue.map((item: any) => item.value) : []
                );
              }}
            />
          )}
        />
      </div>

      {/* Plant Image */}
      <div>
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <FileUpload
              label="Gambar Tanaman"
              accept="image/*"
              previewUrl={initialData?.image}
              onChange={(file) => field.onChange(file)}
              helper="Unggah gambar tanaman (JPG, PNG, WebP)"
            />
          )}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/medicinal-plants")}
        >
          Batal
        </Button>

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          loadingText={isEdit ? "Memperbarui..." : "Membuat..."}
        >
          {isEdit ? "Memperbarui Tanaman Obat" : "Membuat Tanaman Obat"}
        </Button>
      </div>
    </form>
  );
};

export default PlantForm;
