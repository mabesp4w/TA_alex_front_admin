/** @format */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import { PlantCategory, PlantCategoryInput } from "@/types";
import { useCategoryStore } from "@/stores/categoryStore";

interface CategoryFormProps {
  initialData?: PlantCategory;
  isEdit?: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get actions from store
  const { createCategory, updateCategory } = useCategoryStore();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlantCategoryInput>({
    defaultValues: initialData
      ? {
          category_nm: initialData.category_nm,
          description: initialData.description || "",
        }
      : {
          category_nm: "",
          description: "",
        },
  });

  // Form submission handler
  const onSubmit = async (data: PlantCategoryInput) => {
    setIsSubmitting(true);

    try {
      let success = false;

      if (isEdit && initialData) {
        success = await updateCategory(initialData.id, data);
      } else {
        success = await createCategory(data);
      }

      if (success) {
        router.push("/categories");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nama Kategori */}
      <Input
        label="Nama Kategori"
        placeholder="Enter nama kategori"
        error={errors.category_nm?.message}
        {...register("category_nm", {
          required: "Nama kategori wajib diisi",
          maxLength: {
            value: 100,
            message: "Nama kategori tidak boleh melebihi 100 karakter",
          },
        })}
      />

      {/* Deskripsi */}
      <Textarea
        label="Deskripsi"
        placeholder="Enter deskripsi (optional)"
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/categories")}
        >
          Batal
        </Button>

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          loadingText={isEdit ? "Memperbarui..." : "Menambahkan..."}
        >
          {isEdit ? "Simpan Perubahan" : "Tambah Kategori"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
