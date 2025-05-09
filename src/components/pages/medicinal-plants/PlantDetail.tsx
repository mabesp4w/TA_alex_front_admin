/** @format */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ChevronRight,
  Leaf,
  Tag,
  Layers,
  Activity,
  ScrollText,
  Heart,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

import { usePlantStore } from "@/stores/plantStore";

interface PlantDetailProps {
  plantId: number;
}

const PlantDetail: React.FC<PlantDetailProps> = ({ plantId }) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Get data from store
  const {
    currentPlant,
    isLoading,
    error,
    fetchPlantById,
    deletePlant,
    resetCurrentPlant,
  } = usePlantStore();

  // Fetch plant data on component mount
  useEffect(() => {
    fetchPlantById(plantId);

    // Reset current plant on unmount
    return () => {
      resetCurrentPlant();
    };
  }, [plantId, fetchPlantById, resetCurrentPlant]);

  // Handle delete plant action
  const handleDeletePlant = async () => {
    if (currentPlant) {
      const success = await deletePlant(currentPlant.id);
      if (success) {
        router.push("/medicinal-plants");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  // Error state
  if (error || !currentPlant) {
    return (
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
        <h2 className="text-xl font-bold mb-2">Plant Not Found</h2>
        <p className="text-base-content/70 mb-6">
          The plant you are looking for could not be found or has been removed.
        </p>
        <Link href="/medicinal-plants" passHref>
          <Button variant="primary">
            <ArrowLeft size={16} className="mr-1" /> Back to Plants
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center gap-1 text-sm text-base-content/70 mb-2">
            <Link href="/medicinal-plants" className="hover:underline">
              Plants
            </Link>
            <ChevronRight size={14} />
            <span className="truncate">{currentPlant.plant_nm}</span>
          </div>

          <h1 className="text-2xl font-bold">
            {currentPlant.plant_nm}
            {currentPlant.latin_nm && (
              <span className="text-base font-normal italic ml-2 text-base-content/70">
                ({currentPlant.latin_nm})
              </span>
            )}
          </h1>
        </div>

        <div className="flex gap-2">
          <Link href={`/medicinal-plants/edit/${currentPlant.id}`} passHref>
            <Button variant="secondary" outline>
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

      {/* Plant details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title flex items-center">
                <Leaf size={18} className="mr-2" /> Description
              </h2>
              <p className="whitespace-pre-line">{currentPlant.description}</p>
            </div>
          </div>

          {/* Usage Method */}
          {currentPlant.usage_method && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title flex items-center">
                  <ScrollText size={18} className="mr-2" /> Usage Method
                </h2>
                <p className="whitespace-pre-line">
                  {currentPlant.usage_method}
                </p>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title flex items-center">
                <Heart size={18} className="mr-2" /> Benefits
              </h2>
              <p className="whitespace-pre-line">{currentPlant.benefits}</p>
            </div>
          </div>

          {/* Diseases it can treat */}
          {currentPlant.diseases && currentPlant.diseases.length > 0 && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h2 className="card-title flex items-center">
                  <Activity size={18} className="mr-2" /> Diseases it can treat
                </h2>

                <div className="space-y-4 pt-2">
                  {currentPlant.diseases.map((disease, index) => (
                    <div key={index} className="p-4 bg-base-200 rounded-lg">
                      <h3 className="font-medium">{disease.disease_nm}</h3>
                      {disease.notes && (
                        <p className="mt-2 text-sm">{disease.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Plant Image */}
          {currentPlant.image && (
            <div className="card bg-base-100 shadow-sm overflow-hidden">
              <figure>
                <img
                  src={currentPlant.image}
                  alt={currentPlant.plant_nm}
                  className="w-full h-auto object-cover"
                />
              </figure>
            </div>
          )}

          {/* Categories */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title flex items-center text-base">
                <Tag size={16} className="mr-2" /> Categories
              </h2>

              <div className="flex flex-wrap gap-2 pt-2">
                {currentPlant.categories &&
                currentPlant.categories.length > 0 ? (
                  currentPlant.categories.map((category, index) => (
                    <div key={index} className="badge badge-lg">
                      {category.category_nm}
                    </div>
                  ))
                ) : (
                  <p className="text-base-content/70">No categories assigned</p>
                )}
              </div>
            </div>
          </div>

          {/* Plant Parts */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title flex items-center text-base">
                <Layers size={16} className="mr-2" /> Plant Parts Used
              </h2>

              <div className="flex flex-wrap gap-2 pt-2">
                {currentPlant.parts && currentPlant.parts.length > 0 ? (
                  currentPlant.parts.map((part, index) => (
                    <div key={index} className="badge badge-primary badge-lg">
                      {part.plant_part_nm}
                    </div>
                  ))
                ) : (
                  <p className="text-base-content/70">
                    No plant parts specified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base">Additional Information</h2>

              <div className="pt-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-base-content/70">Created</div>
                  <div>
                    {new Date(currentPlant.created_at).toLocaleDateString()}
                  </div>

                  <div className="text-base-content/70">Last Updated</div>
                  <div>
                    {new Date(currentPlant.updated_at).toLocaleDateString()}
                  </div>

                  <div className="text-base-content/70">3D Models</div>
                  <div>
                    {currentPlant.models_3d &&
                    currentPlant.models_3d.length > 0 ? (
                      <Link
                        href={`/3d-models?plant=${currentPlant.id}`}
                        className="link link-primary"
                      >
                        View {currentPlant.models_3d.length} model(s)
                      </Link>
                    ) : (
                      <Link
                        href={`/3d-models/new?plant=${currentPlant.id}`}
                        className="link link-primary"
                      >
                        Add 3D model
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Plant"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="error" onClick={handleDeletePlant}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete &quot;{currentPlant.plant_nm}&quot;?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default PlantDetail;
