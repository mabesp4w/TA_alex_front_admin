/** @format */

"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import ModelForm from "@/components/pages/3d-models/ModelForm";

export default function NewModelPage() {
  const searchParams = useSearchParams();
  const plantId = searchParams.get("plant")
    ? Number(searchParams.get("plant"))
    : undefined;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tambah Model 3D Baru</h1>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <ModelForm preSelectedPlantId={plantId} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
