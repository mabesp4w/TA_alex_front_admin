/** @format */

import * as THREE from "three";

// Proxy untuk Three.js
const originalTHREE = THREE;

// Buat proxy untuk menangani properti yang sudah tidak ada
const THREEProxy = new Proxy(originalTHREE, {
  get: (target, prop) => {
    if (prop === "sRGBEncoding") {
      // Kembalikan konstanta yang setara dengan sRGBEncoding lama
      return 3001;
    }
    return target[prop as keyof typeof target];
  },
});

// Override THREE untuk MindAR
// @ts-expect-error - terpaksa karena MindAR bergantung pada properti lama
window.THREE = THREEProxy;

// Override WebGLRenderer untuk mendukung outputEncoding
const originalWebGLRendererPrototype = THREE.WebGLRenderer.prototype;
const originalSetProperty = Object.getOwnPropertyDescriptor(
  originalWebGLRendererPrototype,
  "outputColorSpace"
)?.set;

if (originalSetProperty) {
  // Tambahkan properti outputEncoding ke WebGLRenderer
  Object.defineProperty(originalWebGLRendererPrototype, "outputEncoding", {
    set: function (encoding) {
      // Jika encoding adalah sRGBEncoding (nilai 3001), atur outputColorSpace ke SRGBColorSpace
      if (encoding === 3001) {
        THREE.ColorManagement.enabled = true;
        this.outputColorSpace = THREE.SRGBColorSpace;
      } else {
        this.outputColorSpace = THREE.LinearSRGBColorSpace;
      }
    },
    get: function () {
      // Jika outputColorSpace adalah SRGBColorSpace, kembalikan nilai 3001 (sRGBEncoding)
      return this.outputColorSpace === THREE.SRGBColorSpace ? 3001 : 3000;
    },
  });
}

// Secara eksplisit import MindAR hanya setelah THREE telah dipatching
// Ini memastikan MindAR menggunakan versi THREE yang sudah dimodifikasi
let MindARThree;
try {
  // Impor dengan penanganan kesalahan
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const MindARModule = require("mind-ar/dist/mindar-image-three.prod");
  MindARThree = MindARModule.MindARThree;

  // Tambahkan log debug
  console.log("MindARThree imported successfully through adapter");
} catch (error) {
  console.error("Failed to import MindARThree:", error);
  // Fallback ke versi dummy jika gagal
  MindARThree = class DummyMindARThree {
    constructor() {
      console.error("Using dummy MindARThree due to import failure");
    }
  };
}

export { MindARThree };
