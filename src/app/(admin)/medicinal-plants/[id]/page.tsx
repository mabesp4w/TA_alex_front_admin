/** @format */

"use client";

import React from "react";
import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PlantDetail from "@/components/pages/medicinal-plants/PlantDetail";

export default function PlantDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? Number(params.id) : 0;

  return (
    <MainLayout>
      <PlantDetail plantId={id} />
    </MainLayout>
  );
}
