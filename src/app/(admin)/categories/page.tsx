/** @format */

"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import CategoryList from "@/components/pages/categories/CategoryList";

export default function CategoriesPage() {
  return (
    <MainLayout>
      <CategoryList />
    </MainLayout>
  );
}
