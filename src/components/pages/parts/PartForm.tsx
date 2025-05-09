/** @format */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import { PlantPart, PlantPartInput } from "@/types";
import { usePartStore } from "@/stores/partStore";

interface PartFormProps {
  initialData?: PlantPart;
  isEdit?: boolean;
}

const PartForm: React.FC<PartFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get actions from store
  const { createPart, updatePart } = usePartStore();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlantPartInput>({
    defaultValues: initialData
      ? {
          plant_part_nm: initialData.plant_part_nm,
          description: initialData.description || "",
        }
      : {
          plant_part_nm: "",
          description: "",
        },
  });

  // Form submission handler
  const onSubmit = async (data: PlantPartInput) => {
    setIsSubmitting(true);

    try {
      let success = false;

      if (isEdit && initialData) {
        success = await updatePart(initialData.id, data);
      } else {
        success = await createPart(data);
      }

      if (success) {
        router.push("/parts");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Part Name */}
      <Input
        label="Nama Bagian Tanaman"
        placeholder="Masukkan nama bagian tanaman"
        error={errors.plant_part_nm?.message}
        {...register("plant_part_nm", {
          required: "Nama bagian tanaman wajib diisi",
          maxLength: {
            value: 100,
            message: "Nama bagian tanaman tidak boleh melebihi 100 karakter",
          },
        })}
      />

      {/* Description */}
      <Textarea
        label="Deskripsi"
        placeholder="Masukkan deskripsi bagian tanaman (opsional)"
        rows={4}
        error={errors.description?.message}
        {...register("description")}
      />

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/parts")}
        >
          Batal
        </Button>

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          loadingText={isEdit ? "Memperbarui..." : "Menambahkan..."}
        >
          {isEdit ? "Simpan Perubahan" : "Tambah Bagian Tanaman"}
        </Button>
      </div>
    </form>
  );
};

export default PartForm;
