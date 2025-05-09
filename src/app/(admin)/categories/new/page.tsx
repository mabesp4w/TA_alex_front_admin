/** @format */

"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import CategoryForm from "@/components/pages/categories/CategoryForm";

export default function NewCategoryPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tambah Kategori Baru</h1>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <CategoryForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
