/** @format */

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import BasicThreeViewer dengan dynamic import
const BasicThreeViewer = dynamic(() => import("./BasicThreeViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-base-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-md mb-2"></div>
        <p className="text-sm text-base-content/70">Loading 3D viewer...</p>
      </div>
    </div>
  ),
});

interface ModelViewerProps {
  modelUrl: string;
}

const Show3d: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  const [mounted, setMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Deteksi browser dengan try-catch
    try {
      if (typeof window !== "undefined") {
        // Cek apakah WebGL tersedia
        const canvas = document.createElement("canvas");
        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if (!gl) {
          console.error("WebGL tidak didukung oleh browser");
          setHasError(true);
        } else {
          setMounted(true);
        }
      }
    } catch (e) {
      console.error("Error saat memeriksa dukungan browser:", e);
      setHasError(true);
    }
  }, []);

  // Handle error
  if (hasError) {
    return (
      <div className="w-full h-64 bg-base-200 rounded-lg flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-error mb-2">Gagal memuat 3D viewer</p>
          <p className="text-sm text-base-content/70">
            Browser Anda mungkin tidak mendukung WebGL
          </p>
        </div>
      </div>
    );
  }

  // Jika tidak ada URL model
  if (!modelUrl) {
    return (
      <div className="w-full h-64 bg-base-200 rounded-lg flex items-center justify-center">
        <p className="text-base-content/70">Model belum dipilih</p>
      </div>
    );
  }

  // Tampilkan viewer hanya jika client-side dan ada modelUrl
  return mounted ? (
    <BasicThreeViewer modelUrl={modelUrl} />
  ) : (
    <div className="w-full h-64 bg-base-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-md mb-2"></div>
        <p className="text-sm text-base-content/70">Initializing viewer...</p>
      </div>
    </div>
  );
};

export default Show3d;
