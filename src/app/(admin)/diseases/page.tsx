/** @format */

"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import DiseaseList from "@/components/pages/diseases/DiseaseList";

export default function DiseasesPage() {
  return (
    <MainLayout>
      <DiseaseList />
    </MainLayout>
  );
}
