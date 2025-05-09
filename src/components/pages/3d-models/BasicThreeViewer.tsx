/**
 * @format
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-expect-error
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// @ts-expect-error
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface BasicThreeViewerProps {
  modelUrl: string;
}

const BasicThreeViewer: React.FC<BasicThreeViewerProps> = ({ modelUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingStatus, setLoadingStatus] = useState<string>(
    "Preparing viewer..."
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fungsi setup Three.js
  useEffect(() => {
    if (!containerRef.current) return;

    setLoadingStatus("Initializing 3D viewer...");
    let animationFrameId: number;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // Renderer dengan pesan debug lebih baik
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      renderer.setPixelRatio(window.devicePixelRatio);
      // @ts-expect-error
      renderer.outputEncoding = THREE.sRGBEncoding;
      containerRef.current.innerHTML = ""; // Bersihkan container
      containerRef.current.appendChild(renderer.domElement);
    } catch (err) {
      console.error("Failed to create WebGL renderer:", err);
      setLoadError("Failed to initialize 3D renderer");
      return;
    }

    // Lighting - lebih banyak cahaya untuk memastikan model terlihat
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Lebih terang
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);

    // Helper - tambahkan grid untuk debugging
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Axes helper untuk orientasi
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    // Placeholder cube - lebih besar dan berwarna cerah untuk debugging
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff5533 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    setLoadingStatus("Loading 3D model...");

    // Load model dengan pesan status
    let modelLoaded = false;
    const loader = new GLTFLoader();

    try {
      if (modelUrl) {
        loader.load(
          modelUrl,
          // @ts-expect-error
          (gltf) => {
            scene.remove(cube); // Hapus placeholder

            setLoadingStatus("Processing model...");

            // Model berhasil di-load
            const model = gltf.scene;
            scene.add(model);
            modelLoaded = true;

            // Debug info
            console.log("Model loaded successfully:", model);

            // Auto-center dan auto-scale model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            console.log("Model size:", size);
            console.log("Model center:", center);

            // Reset posisi ke tengah
            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;

            // Set posisi kamera berdasarkan ukuran model
            const maxDim = Math.max(size.x, size.y, size.z);
            const distance = maxDim * 1.5;
            camera.position.set(distance, distance / 2, distance);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
            camera.updateProjectionMatrix();

            // Reset controls untuk melihat model
            controls.target.set(0, 0, 0);
            controls.update();

            setLoadingStatus(""); // Clear loading status
          },
          // Progress callback
          // @ts-expect-error
          (xhr) => {
            if (xhr.lengthComputable) {
              const percent = Math.round((xhr.loaded / xhr.total) * 100);
              setLoadingStatus(`Loading model: ${percent}%`);
            }
          },
          // Error callback
          // @ts-expect-error
          (error) => {
            console.error("Error loading model:", error);
            setLoadError(`Failed to load model: ${error.message}`);
          }
        );
      }
    } catch (err) {
      console.error("Failed to load model:", err);
      setLoadError(
        `Failed to load model: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }

    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotasi cube placeholder jika model belum di-load
      if (!modelLoaded) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      // Hapus elemen renderer dari DOM
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      // Dispose semua objek Three.js
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();

          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <div className="relative w-full h-64 bg-base-200 rounded-lg">
      <div ref={containerRef} className="w-full h-full"></div>

      {/* Loading indicator */}
      {loadingStatus && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-200 bg-opacity-70">
          <div className="text-center">
            <div className="loading loading-spinner loading-md mb-2"></div>
            <p className="text-sm">{loadingStatus}</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-200 bg-opacity-90">
          <div className="text-center p-4">
            <p className="text-error mb-2">Error</p>
            <p className="text-sm text-base-content/70">{loadError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicThreeViewer;
