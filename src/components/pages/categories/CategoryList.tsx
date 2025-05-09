/** @format */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, Plus, Search } from "lucide-react";

import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

import { PlantCategory } from "@/types";
import { useCategoryStore } from "@/stores/categoryStore";

const CategoryList: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<PlantCategory | null>(null);

  // Get data from store
  const { categories, isLoading, fetchCategories, deleteCategory } =
    useCategoryStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) => {
    return category.category_nm
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  // Handle edit category
  const handleEditCategory = (e: React.MouseEvent, category: PlantCategory) => {
    e.stopPropagation();
    router.push(`/categories/${category.id}/edit`);
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (
    e: React.MouseEvent,
    category: PlantCategory
  ) => {
    e.stopPropagation();
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // Close delete confirmation modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      const success = await deleteCategory(categoryToDelete.id);
      if (success) {
        handleCloseDeleteModal();
      }
    }
  };

  // Table columns definition
  const columns = [
    {
      header: "Nama Kategori",
      accessor: "category_nm",
      className: "font-medium",
    },
    {
      header: "Deskripsi",
      accessor: (category: PlantCategory) => (
        <div className="max-w-md truncate">
          {category.description || (
            <span className="text-base-content/50">-</span>
          )}
        </div>
      ),
    },
  ];

  // Actions for each row
  const renderActions = (category: PlantCategory) => (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleEditCategory(e, category)}
      >
        <Edit size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => handleOpenDeleteModal(e, category)}
      >
        <Trash2 size={16} className="text-error" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Kategori</h1>

        <div className="flex gap-2">
          <Link href="/categories/new" passHref>
            <Button variant="primary">
              <Plus size={16} className="mr-1" /> Tambah Kategori
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Cari kategori..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Search size={18} />}
          />
        </div>
      </div>

      {/* Categories table */}
      <Table
        data={filteredCategories}
        columns={columns as any}
        actions={renderActions}
        isLoading={isLoading}
        emptyMessage="Tidak ada kategori. Tambahkan kategori pertama!"
      />

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Hapus Kategori"
        footer={
          <>
            <Button variant="ghost" onClick={handleCloseDeleteModal}>
              Batal
            </Button>
            <Button variant="error" onClick={handleDeleteCategory}>
              Hapus
            </Button>
          </>
        }
      >
        <p>
          Apakah Anda yakin ingin menghapus &quot;
          {categoryToDelete?.category_nm}
          &quot;? Tindakan ini tidak dapat diurangi.
        </p>
        <p className="mt-2 text-warning">
          Catatan: Menghapus kategori ini akan menghapusnya dari semua tanaman
          yang terkait.
        </p>
      </Modal>
    </div>
  );
};

export default CategoryList;
