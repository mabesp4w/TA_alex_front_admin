/** @format */

"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import PlantList from "@/components/pages/medicinal-plants/PlantList";

export default function MedicinalPlantsPage() {
  return (
    <MainLayout>
      <PlantList />
    </MainLayout>
  );
}
