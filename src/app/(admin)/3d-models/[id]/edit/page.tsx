/** @format */

"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import ModelForm from "@/components/pages/3d-models/ModelForm";
import Button from "@/components/ui/Button";

import { useModelStore } from "@/stores/modelStore";

export default function EditModelPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? Number(params.id) : 0;

  const { currentModel, isLoading, error, fetchModelById, resetCurrentModel } =
    useModelStore();

  useEffect(() => {
    if (id) {
      fetchModelById(id);
    }

    // Reset current model on unmount
    return () => {
      resetCurrentModel();
    };
  }, [id, fetchModelById, resetCurrentModel]);

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
  if (error || !currentModel) {
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
          <h2 className="text-xl font-bold mb-2">3D Model Not Found</h2>
          <p className="text-base-content/70 mb-6">
            The 3D model you are trying to edit could not be found or has been
            removed.
          </p>
          <Link href="/3d-models" passHref>
            <Button variant="primary">
              <ArrowLeft size={16} className="mr-1" /> Back to 3D Models
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
              <Link href="/3d-models" passHref>
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={16} className="mr-1" /> Back to 3D Models
                </Button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold">Edit 3D Model</h1>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <ModelForm initialData={currentModel} isEdit={true} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
