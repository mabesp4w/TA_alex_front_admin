/** @format */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, Plus, Search } from "lucide-react";

import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

import { PlantPart } from "@/types";
import { usePartStore } from "@/stores/partStore";

const PartList: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState<PlantPart | null>(null);

  // Get data from store
  const { parts, isLoading, fetchParts, deletePart } = usePartStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter parts based on search term
  const filteredParts = parts.filter((part) => {
    return part.plant_part_nm.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle edit part
  const handleEditPart = (e: React.MouseEvent, part: PlantPart) => {
    e.stopPropagation();
    router.push(`/parts/${part.id}/edit`);
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (e: React.MouseEvent, part: PlantPart) => {
    e.stopPropagation();
    setPartToDelete(part);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPartToDelete(null);
  };

  // Handle delete part
  const handleDeletePart = async () => {
    if (partToDelete) {
      const success = await deletePart(partToDelete.id);
      if (success) {
        handleCloseDeleteModal();
      }
    }
  };

  // Table columns definition
  const columns = [
    {
      header: "Nama Bagian Tanaman",
      accessor: "plant_part_nm",
      className: "font-medium",
    },
    {
      header: "Deskripsi",
      accessor: (part: PlantPart) => (
        <div className="max-w-md truncate">
          {part.description || <span className="text-base-content/50">-</span>}
        </div>
      ),
    },
  ];

  // Actions for each row
  const renderActions = (part: PlantPart) => (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleEditPart(e, part)}
      >
        <Edit size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleOpenDeleteModal(e, part)}
      >
        <Trash2 size={16} className="text-error" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Bagian Tanaman</h1>

        <div className="flex gap-2">
          <Link href="/parts/new" passHref>
            <Button variant="primary">
              <Plus size={16} className="mr-1" /> Tambah Bagian Tanaman
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cari bagian tanaman..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Search size={18} />}
          />
        </div>
      </div>

      {/* Parts table */}
      <Table
        data={filteredParts}
        columns={columns as any}
        actions={renderActions}
        isLoading={isLoading}
        emptyMessage="Tidak ada bagian tanaman. Tambahkan bagian tanaman pertama!"
      />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Hapus Bagian Tanaman"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseDeleteModal}>
              Batal
            </Button>
            <Button variant="error" onClick={handleDeletePart}>
              Hapus
            </Button>
          </>
        }
      >
        <p>
          Apakah Anda yakin ingin menghapus &quot;{partToDelete?.plant_part_nm}
          &quot;? Tindakan ini tidak dapat diurangi.
        </p>
        <p className="mt-2 text-warning">
          Catatan: Menghapus bagian tanaman ini akan menghapusnya dari semua
          tanaman yang terkait.
        </p>
      </Modal>
    </div>
  );
};

export default PartList;
