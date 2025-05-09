/** @format */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, Plus, Search, Star, Eye } from "lucide-react";
import Show3d from "./Show3d";

import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

import { Plant3DModel } from "@/types";
import { useModelStore } from "@/stores/modelStore";
import { usePlantStore } from "@/stores/plantStore";

const ModelList: React.FC = () => {
  // router
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<Plant3DModel | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Plant3DModel | null>(null);

  // Get data from stores
  const { models, isLoading, fetchModels, deleteModel } = useModelStore();
  const { plants, fetchPlants } = usePlantStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchPlants();

    fetchModels();
  }, [fetchModels, fetchPlants]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter models based on search term
  const filteredModels = models.filter((model) => {
    return model.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Open view model modal
  const handleViewModel = (model: Plant3DModel) => {
    setSelectedModel(model);
    setIsViewModalOpen(true);
  };

  // Handle edit model
  const handleEditModel = (e: React.MouseEvent, model: Plant3DModel) => {
    e.stopPropagation();
    router.push(`/3d-models/${model.id}/edit`);
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (e: React.MouseEvent, model: Plant3DModel) => {
    e.stopPropagation();
    setModelToDelete(model);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setModelToDelete(null);
  };

  // Handle delete model
  const handleDeleteModel = async () => {
    if (modelToDelete) {
      const success = await deleteModel(modelToDelete.id);
      if (success) {
        handleCloseDeleteModal();
      }
    }
  };

  // Table columns definition
  const columns = [
    {
      header: "Judul",
      accessor: (model: Plant3DModel) => (
        <div className="flex items-center">
          <span className="font-medium">{model.title}</span>
          {model.is_default && <Star size={16} className="ml-2 text-warning" />}
        </div>
      ),
    },
    {
      header: "Tanaman",
      accessor: (model: Plant3DModel) => {
        const plant = plants.find((p) => p.id === model.plant);
        return plant ? (
          plant.plant_nm
        ) : (
          <span className="text-base-content/50">Unknown</span>
        );
      },
    },
    {
      header: "Deskripsi",
      accessor: (model: Plant3DModel) => (
        <div className="max-w-md truncate">
          {model.description || <span className="text-base-content/50">-</span>}
        </div>
      ),
    },
    {
      header: "Ukuran File",
      accessor: (model: Plant3DModel) =>
        model.file_size ? (
          formatFileSize(model.file_size)
        ) : (
          <span className="text-base-content/50">-</span>
        ),
    },
    {
      header: "Terakhir Diperbarui",
      accessor: (model: Plant3DModel) =>
        new Date(model.updated_at).toLocaleDateString(),
    },
  ];

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
  };

  // Actions for each row
  const renderActions = (model: Plant3DModel) => (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="sm" onClick={() => handleViewModel(model)}>
        <Eye size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleEditModel(e, model)}
      >
        <Edit size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleOpenDeleteModal(e, model)}
      >
        <Trash2 size={16} className="text-error" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">3D Models</h1>

        <div className="flex gap-2">
          <Link href="/3d-models/new" passHref>
            <Button variant="primary">
              <Plus size={16} className="mr-1" /> Tambah Model 3D
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Search size={18} />}
          />
        </div>
      </div>

      {/* Models table */}
      <Table
        data={filteredModels}
        columns={columns}
        actions={renderActions}
        isLoading={isLoading}
        onRowClick={handleViewModel}
        emptyMessage={
          "Tidak ada model 3D ditemukan. Tambah model 3D pertama Anda!"
        }
      />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Delete 3D Model"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="error" onClick={handleDeleteModel}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete &quot;{modelToDelete?.title}&quot;?
          This action cannot be undone.
        </p>
      </Modal>

      {/* View model modal */}
      {selectedModel && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={selectedModel.title}
          size="lg"
          footer={
            <Button variant="ghost" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="aspect-video flex items-center justify-center bg-base-200 rounded-lg">
              <div className="text-center p-6">
                <p className="mb-2">3D Model Viewer</p>
                <p className="text-sm text-base-content/70">
                  {selectedModel.model_file && (
                    <Show3d modelUrl={selectedModel.model_file} />
                  )}
                </p>
              </div>
            </div>

            {selectedModel.description && (
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p>{selectedModel.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium mb-1">Tanaman</h3>
                <p>
                  {plants.find((p) => p.id === selectedModel.plant)?.plant_nm ||
                    "Unknown"}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Model Default</h3>
                <p>{selectedModel.is_default ? "Ya" : "Tidak"}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Ukuran File</h3>
                <p>
                  {selectedModel.file_size
                    ? formatFileSize(selectedModel.file_size)
                    : "Unknown"}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Terakhir Diperbarui</h3>
                <p>{new Date(selectedModel.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ModelList;
