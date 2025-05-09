/** @format */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, Plus, Search } from "lucide-react";

import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

import { Disease } from "@/types";
import { useDiseaseStore } from "@/stores/diseaseStore";

const DiseaseList: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [diseaseToDelete, setDiseaseToDelete] = useState<Disease | null>(null);

  // Get data from store
  const { diseases, isLoading, fetchDiseases, deleteDisease } =
    useDiseaseStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter diseases based on search term
  const filteredDiseases = diseases.filter((disease) => {
    return disease.disease_nm?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle edit disease
  const handleEditDisease = (e: React.MouseEvent, disease: Disease) => {
    e.stopPropagation();
    router.push(`/diseases/${disease.id}/edit`);
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (e: React.MouseEvent, disease: Disease) => {
    e.stopPropagation();
    setDiseaseToDelete(disease);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDiseaseToDelete(null);
  };

  // Handle delete disease
  const handleDeleteDisease = async () => {
    if (diseaseToDelete) {
      const success = await deleteDisease(diseaseToDelete.id);
      if (success) {
        handleCloseDeleteModal();
      }
    }
  };

  // Table columns definition
  const columns = [
    {
      header: "Nama Penyakit",
      accessor: "disease_nm",
      className: "font-medium",
    },
    {
      header: "Deskripsi",
      accessor: (disease: Disease) => (
        <div className="max-w-md truncate">{disease.description}</div>
      ),
    },
    {
      header: "Gejala",
      accessor: (disease: Disease) => (
        <div className="max-w-md truncate">
          {disease.symptoms || <span className="text-base-content/50">-</span>}
        </div>
      ),
    },
  ];

  // Actions for each row
  const renderActions = (disease: Disease) => (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleEditDisease(e, disease)}
      >
        <Edit size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleOpenDeleteModal(e, disease)}
      >
        <Trash2 size={16} className="text-error" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Penyakit</h1>

        <div className="flex gap-2">
          <Link href="/diseases/new" passHref>
            <Button variant="primary">
              <Plus size={16} className="mr-1" /> Tambah Penyakit
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cari penyakit..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Search size={18} />}
          />
        </div>
      </div>

      {/* Diseases table */}
      <Table
        data={filteredDiseases}
        columns={columns as any}
        actions={renderActions}
        isLoading={isLoading}
        emptyMessage="Tidak ada penyakit. Tambahkan penyakit pertama!"
      />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Hapus Penyakit"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseDeleteModal}>
              Batal
            </Button>
            <Button variant="error" onClick={handleDeleteDisease}>
              Hapus
            </Button>
          </>
        }
      >
        <p>
          Apakah Anda yakin ingin menghapus &quot;{diseaseToDelete?.disease_nm}
          &quot;? Tindakan ini tidak dapat diurangi.
        </p>
        <p className="mt-2 text-warning">
          Catatan: Menghapus penyakit ini akan menghapusnya dari semua tanaman
          yang terkait.
        </p>
      </Modal>
    </div>
  );
};

export default DiseaseList;
