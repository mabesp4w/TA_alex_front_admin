/** @format */

"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import DiseaseForm from "@/components/pages/diseases/DiseaseForm";
import Button from "@/components/ui/Button";

import { useDiseaseStore } from "@/stores/diseaseStore";

export default function EditDiseasePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? Number(params.id) : 0;

  const {
    currentDisease,
    isLoading,
    error,
    fetchDiseaseById,
    resetCurrentDisease,
  } = useDiseaseStore();

  useEffect(() => {
    if (id) {
      fetchDiseaseById(id);
    }

    // Reset current disease on unmount
    return () => {
      resetCurrentDisease();
    };
  }, [id, fetchDiseaseById, resetCurrentDisease]);

  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="w-full h-64 flex items-center justify-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // Error state
  if (error || !currentDisease) {
    return (
      <MainLayout>
        <div className="w-full py-12 flex flex-col items-center justify-center text-center">
          <div className="text-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Disease Not Found</h2>
          <p className="text-base-content/70 mb-6">
            The disease you are trying to edit could not be found or has been
            removed.
          </p>
          <Link href="/diseases" passHref>
            <Button variant="primary">
              <ArrowLeft size={16} className="mr-1" /> Back to Diseases
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/diseases" passHref>
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={16} className="mr-1" /> Back to Diseases
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold">Edit Disease</h1>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <DiseaseForm initialData={currentDisease} isEdit={true} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
