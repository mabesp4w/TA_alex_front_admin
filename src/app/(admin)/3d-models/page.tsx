/** @format */

"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import ModelList from "@/components/pages/3d-models/ModelList";

export default function ModelsPage() {
  return (
    <MainLayout>
      <ModelList />
    </MainLayout>
  );
}
