/** @format */

"use client";

import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import PartList from "@/components/pages/parts/PartList";

export default function PartsPage() {
  return (
    <MainLayout>
      <PartList />
    </MainLayout>
  );
}
