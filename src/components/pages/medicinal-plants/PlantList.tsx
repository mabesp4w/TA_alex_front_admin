/** @format */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, Plus, Search, Filter } from "lucide-react";

import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

import { MedicinalPlant } from "@/types";
import { usePlantStore } from "@/stores/plantStore";
import Image from "next/image";

const PlantList: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState<MedicinalPlant | null>(
    null
  );

  // Get data from store
  const { plants, isLoading, fetchPlants, deletePlant } = usePlantStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter plants based on search term
  const filteredPlants = plants.filter((plant) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      plant.plant_nm?.toLowerCase().includes(searchLower) ||
      (plant.latin_nm && plant.latin_nm.toLowerCase().includes(searchLower))
    );
  });

  // Handle view plant details
  const handleViewPlant = (plant: MedicinalPlant) => {
    router.push(`/medicinal-plants/${plant.id}`);
  };

  // Handle edit plant
  const handleEditPlant = (e: React.MouseEvent, plant: MedicinalPlant) => {
    e.stopPropagation();
    router.push(`/medicinal-plants/${plant.id}/edit`);
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (
    e: React.MouseEvent,
    plant: MedicinalPlant
  ) => {
    e.stopPropagation();
    setPlantToDelete(plant);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPlantToDelete(null);
  };

  // Handle delete plant
  const handleDeletePlant = async () => {
    if (plantToDelete) {
      const success = await deletePlant(plantToDelete.id);
      if (success) {
        handleCloseDeleteModal();
      }
    }
  };

  // Table columns definition
  const columns = [
    {
      header: "Nama Tanaman Obat",
      accessor: (plant: MedicinalPlant) => (
        <div className="font-medium">
          {plant.plant_nm}
          {plant.latin_nm && (
            <p className="text-xs text-base-content/70 italic">
              {plant.latin_nm}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Kategori",
      accessor: (plant: MedicinalPlant) => (
        <div className="flex flex-wrap gap-1">
          {plant.categories?.length ? (
            plant.categories.map((category, index) => (
              <span key={index} className="badge badge-outline badge-sm">
                {category.category_nm}
              </span>
            ))
          ) : (
            <span className="text-base-content/50">-</span>
          )}
        </div>
      ),
    },
    {
      header: "Bagian Tanaman",
      accessor: (plant: MedicinalPlant) => (
        <div className="flex flex-wrap gap-1">
          {plant.parts?.length ? (
            plant.parts.map((part, index) => (
              <span key={index} className="badge badge-sm">
                {part.plant_part_nm}
              </span>
            ))
          ) : (
            <span className="text-base-content/50">-</span>
          )}
        </div>
      ),
    },
    {
      header: "Gambar",
      accessor: (plant: MedicinalPlant) =>
        plant.image ? (
          <div className="avatar">
            <div className="w-12 h-12 rounded">
              <Image
                src={plant.image}
                alt={plant.plant_nm}
                width={50}
                height={50}
              />
            </div>
          </div>
        ) : (
          <div className="w-12 h-12 rounded bg-base-300 flex items-center justify-center">
            <span className="text-xs text-base-content/50">
              Tidak ada gambar
            </span>
          </div>
        ),
    },
  ];

  // Actions for each row
  const renderActions = (plant: MedicinalPlant) => (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleEditPlant(e, plant)}
      >
        <Edit size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleOpenDeleteModal(e, plant)}
      >
        <Trash2 size={16} className="text-error" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Tanaman Obat</h1>

        <div className="flex gap-2">
          <Link href="/medicinal-plants/new" passHref>
            <Button variant="primary">
              <Plus size={16} className="mr-1" /> Tambah Tanaman Obat
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cari tanaman obat..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Search size={18} />}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="ghost">
            <Filter size={16} className="mr-1" /> Filter
          </Button>
        </div>
      </div>

      {/* Plants table */}
      <Table
        data={filteredPlants}
        columns={columns}
        actions={renderActions}
        isLoading={isLoading}
        onRowClick={handleViewPlant}
        emptyMessage="No Tanaman Obat found. Add your first plant!"
      />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Delete Plant"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseDeleteModal}>
              Cancel
            </Button>
            <Button variant="error" onClick={handleDeletePlant}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete &quot;{plantToDelete?.plant_nm}&quot;?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default PlantList;
