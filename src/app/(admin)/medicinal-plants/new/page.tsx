/** @format */

"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import PlantForm from "@/components/pages/medicinal-plants/PlantForm";

export default function NewPlantPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tambah Tanaman Obat Baru</h1>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <PlantForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
