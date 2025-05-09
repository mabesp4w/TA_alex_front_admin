/** @format */

"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import DiseaseForm from "@/components/pages/diseases/DiseaseForm";

export default function NewDiseasePage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tambah Penyakit Baru</h1>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <DiseaseForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
