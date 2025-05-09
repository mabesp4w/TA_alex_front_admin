/** @format */

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Leaf,
  Tag,
  Layers,
  Activity,
  PlusCircle,
  CurlyBraces,
} from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";

import { usePlantStore } from "@/stores/plantStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { usePartStore } from "@/stores/partStore";
import { useDiseaseStore } from "@/stores/diseaseStore";
import { useModelStore } from "@/stores/modelStore";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Get data from stores
  const { plants, fetchPlants } = usePlantStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { parts, fetchParts } = usePartStore();
  const { diseases, fetchDiseases } = useDiseaseStore();
  const { models, fetchModels } = useModelStore();

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchPlants(),
          fetchCategories(),
          fetchParts(),
          fetchDiseases(),
          fetchModels(),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [fetchPlants, fetchCategories, fetchParts, fetchDiseases, fetchModels]);

  // Get recent plants (last 5)
  const recentPlants = [...plants]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 5);

  // Dashboard stat cards
  const statCards = [
    {
      title: "Tanaman Obat",
      count: plants.length,
      icon: <Leaf className="h-8 w-8 text-primary" />,
      link: "/medicinal-plants",
      color: "bg-primary/10",
    },
    {
      title: "Kategori",
      count: categories.length,
      icon: <Tag className="h-8 w-8 text-secondary" />,
      link: "/categories",
      color: "bg-secondary/10",
    },
    {
      title: "Bagian Tanaman",
      count: parts.length,
      icon: <Layers className="h-8 w-8 text-accent" />,
      link: "/parts",
      color: "bg-accent/10",
    },
    {
      title: "Penyakit",
      count: diseases.length,
      icon: <Activity className="h-8 w-8 text-info" />,
      link: "/diseases",
      color: "bg-info/10",
    },
    {
      title: "Model 3D",
      count: models.length,
      icon: <CurlyBraces className="h-8 w-8 text-success" />,
      link: "/3d-models",
      color: "bg-success/10",
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-base-content/70">Manajemen Data Tanaman Obat</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoading
            ? // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="card bg-base-100 shadow animate-pulse"
                >
                  <div className="card-body">
                    <div className="h-8 w-8 rounded-full bg-base-300 mb-4"></div>
                    <div className="h-5 w-24 bg-base-300 rounded mb-2"></div>
                    <div className="h-8 w-12 bg-base-300 rounded"></div>
                  </div>
                </div>
              ))
            : // Actual stat cards
              statCards.map((card, index) => (
                <Link href={card.link} key={index}>
                  <div className="card bg-base-100 shadow hover:shadow-md transition-shadow cursor-pointer">
                    <div className="card-body">
                      <div className={`rounded-full p-2 w-fit ${card.color}`}>
                        {card.icon}
                      </div>
                      <h2 className="card-title text-base mt-2">
                        {card.title}
                      </h2>
                      <p className="text-3xl font-bold">{card.count}</p>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {/* Aksi Cepat */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Aksi Cepat</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Link href="/medicinal-plants/new" passHref>
                <Button
                  variant="primary"
                  outline
                  className="w-full justify-start"
                >
                  <PlusCircle size={16} className="mr-2" /> Tambah Tanaman Obat
                </Button>
              </Link>

              <Link href="/categories/new" passHref>
                <Button
                  variant="primary"
                  outline
                  className="w-full justify-start"
                >
                  <PlusCircle size={16} className="mr-2" /> Tambah Kategori
                </Button>
              </Link>

              <Link href="/parts/new" passHref>
                <Button
                  variant="primary"
                  outline
                  className="w-full justify-start"
                >
                  <PlusCircle size={16} className="mr-2" /> Tambah Bagian
                  Tanaman
                </Button>
              </Link>

              <Link href="/diseases/new" passHref>
                <Button
                  variant="primary"
                  outline
                  className="w-full justify-start"
                >
                  <PlusCircle size={16} className="mr-2" /> Tambah Penyakit
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Plants */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Tanaman Obat Terbaru</h2>

              <Link href="/medicinal-plants" passHref>
                <Button variant="ghost" size="sm">
                  Lihat Semua
                </Button>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Nama Tanaman Obat</th>
                    <th>Nama Latin</th>
                    <th>Kategori</th>
                    <th>Terakhir Diperbarui</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td>
                          <div className="h-5 bg-base-300 rounded w-32 animate-pulse"></div>
                        </td>
                        <td>
                          <div className="h-5 bg-base-300 rounded w-24 animate-pulse"></div>
                        </td>
                        <td>
                          <div className="h-5 bg-base-300 rounded w-20 animate-pulse"></div>
                        </td>
                        <td>
                          <div className="h-5 bg-base-300 rounded w-16 animate-pulse"></div>
                        </td>
                        <td>
                          <div className="h-8 bg-base-300 rounded w-20 animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                  ) : recentPlants.length > 0 ? (
                    // Actual recent plants
                    recentPlants.map((plant) => (
                      <tr key={plant.id}>
                        <td className="font-medium">{plant.plant_nm}</td>
                        <td>
                          <span className="italic">
                            {plant.latin_nm || "-"}
                          </span>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-1">
                            {plant.categories?.map((category, idx) => (
                              <span key={idx} className="badge badge-sm">
                                {category.category_nm}
                              </span>
                            ))}
                            {(!plant.categories ||
                              plant.categories.length === 0) &&
                              "-"}
                          </div>
                        </td>
                        <td>
                          {new Date(plant.updated_at).toLocaleDateString()}
                        </td>
                        <td>
                          <Link href={`/medicinal-plants/${plant.id}`} passHref>
                            <Button variant="ghost" size="sm">
                              Lihat
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // No plants state
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        <div className="text-base-content/70">
                          No Tanaman Obat ditemukan. Tambahkan tanaman obat
                          pertama!
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
