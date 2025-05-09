/** @format */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import { Disease, DiseaseInput } from "@/types";
import { useDiseaseStore } from "@/stores/diseaseStore";

interface DiseaseFormProps {
  initialData?: Disease;
  isEdit?: boolean;
}

const DiseaseForm: React.FC<DiseaseFormProps> = ({
  initialData,
  isEdit = false,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get actions from store
  const { createDisease, updateDisease } = useDiseaseStore();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiseaseInput>({
    defaultValues: initialData
      ? {
          disease_nm: initialData.disease_nm,
          description: initialData.description,
          symptoms: initialData.symptoms || "",
        }
      : {
          disease_nm: "",
          description: "",
          symptoms: "",
        },
  });

  // Form submission handler
  const onSubmit = async (data: DiseaseInput) => {
    setIsSubmitting(true);

    try {
      let success = false;

      if (isEdit && initialData) {
        success = await updateDisease(initialData.id, data);
      } else {
        success = await createDisease(data);
      }

      if (success) {
        router.push("/diseases");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Disease Name */}
      <Input
        label="Nama Penyakit"
        placeholder="Masukkan nama penyakit"
        error={errors.disease_nm?.message}
        {...register("disease_nm", {
          required: "Nama penyakit wajib diisi",
          maxLength: {
            value: 200,
            message: "Disease name cannot exceed 200 characters",
          },
        })}
      />

      {/* Description */}
      <Textarea
        label="Deskripsi"
        placeholder="Masukkan deskripsi penyakit (opsional)"
        rows={4}
        error={errors.description?.message}
        {...register("description", {})}
      />

      {/* Symptoms */}
      <Textarea
        label="Gejala"
        placeholder="Masukkan gejala penyakit (opsional)"
        rows={4}
        error={errors.symptoms?.message}
        {...register("symptoms")}
      />

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/diseases")}
        >
          Batal
        </Button>

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          loadingText={isEdit ? "Memperbarui..." : "Menambahkan..."}
        >
          {isEdit ? "Simpan Perubahan" : "Tambah Penyakit"}
        </Button>
      </div>
    </form>
  );
};

export default DiseaseForm;
