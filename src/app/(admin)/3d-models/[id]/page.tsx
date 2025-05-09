/** @format */

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Show3d from "@/components/pages/3d-models/Show3d";

import { useModelStore } from "@/stores/modelStore";

export default function ModelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? Number(params.id) : 0;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    currentModel,
    isLoading,
    error,
    fetchModelById,
    deleteModel,
    resetCurrentModel,
  } = useModelStore();

  useEffect(() => {
    if (id) {
      fetchModelById(id);
    }

    // Reset current model on unmount
    return () => {
      resetCurrentModel();
    };
  }, [id, fetchModelById, resetCurrentModel]);

  // Handle delete model
  const handleDeleteModel = async () => {
    if (currentModel) {
      const success = await deleteModel(currentModel.id);
      if (success) {
        router.push("/3d-models");
      }
    }
  };

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
            The 3D model you are looking for could not be found or has been
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="flex items-center gap-1 text-sm text-base-content/70 mb-2">
              <Link href="/3d-models" className="hover:underline">
                3D Models
              </Link>
              <span className="mx-1">/</span>
              <span className="truncate">{currentModel.title}</span>
            </div>

            <h1 className="text-2xl font-bold">{currentModel.title}</h1>
          </div>

          <div className="flex gap-2">
            <Link href={`/3d-models/${currentModel.id}/edit`} passHref>
              <Button variant="ghost" outline>
                <Edit size={16} className="mr-1" /> Edit
              </Button>
            </Link>

            <Button
              variant="error"
              outline
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={16} className="mr-1" /> Delete
            </Button>
          </div>
        </div>

        {/* 3D Model Viewer */}
        <Show3d modelUrl={currentModel.model_file} />

        {/* Delete confirmation modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete 3D Model"
          footer={
            <>
              <Button
                variant="ghost"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="error" onClick={handleDeleteModel}>
                Delete
              </Button>
            </>
          }
        >
          <p>
            Are you sure you want to delete &quot;{currentModel.title}&quot;?
            This action cannot be undone.
          </p>
        </Modal>
      </div>
    </MainLayout>
  );
}
