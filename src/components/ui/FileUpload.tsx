/** @format */

import React, { forwardRef, useRef, useState } from "react";
import { Upload } from "lucide-react";
import Resizer from "react-image-file-resizer";
import Image from "next/image";
import Show3d from "../pages/3d-models/Show3d";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
interface FileUploadProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  error?: string;
  helper?: string;
  previewUrl?: string;
  onChange?: (file: File | null) => void;
  onResize?: (blob: Blob) => void;
  resizeOptions?: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
  };
  accept?: string;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      error,
      helper,
      previewUrl,
      onChange,
      onResize,
      resizeOptions = {
        maxWidth: 800,
        maxHeight: 800,
        quality: 80,
      },
      accept = "image/*",
      className = "",
      ...props
    },
    ref
  ) => {
    const [preview, setPreview] = useState<string | null>(previewUrl || null);
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Forward ref handling
    React.useImperativeHandle(
      ref,
      () => fileInputRef.current as HTMLInputElement
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;

      // Clear preview if no file selected
      if (!file) {
        setPreview(null);
        setModelUrl(null);
        if (onChange) onChange(null);
        return;
      }

      // Handle image files with preview
      if (file.type.startsWith("image/")) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const result = e.target?.result as string;
          setPreview(result);
          setModelUrl(null);
        };
        fileReader.readAsDataURL(file);

        // Resize image if needed
        if (onResize && resizeOptions) {
          try {
            Resizer.imageFileResizer(
              file,
              resizeOptions.maxWidth,
              resizeOptions.maxHeight,
              "JPEG",
              resizeOptions.quality,
              0,
              (uri) => {
                if (uri instanceof Blob) {
                  onResize(uri);
                }
              },
              "blob"
            );
          } catch (err) {
            console.error("Error resizing image:", err);
          }
        }
      }
      // Handle 3D model files
      else if (
        file.type.includes("model") ||
        /\.(glb|gltf|obj|fbx|stl|dae)$/i.test(file.name)
      ) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const result = e.target?.result as string;
          setModelUrl(result);
          setPreview(null);
        };
        fileReader.readAsDataURL(file);
      }
      // Handle other file types
      else {
        setPreview(null);
        setModelUrl(null);
      }

      // Call onChange with selected file
      if (onChange) onChange(file);
    };

    const handleRemoveFile = () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setPreview(null);
      setModelUrl(null);
      if (onChange) onChange(null);
    };

    const handleBrowseClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const is3DModel = modelUrl && !preview;

    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text font-medium">{label}</span>
          </label>
        )}

        <div className="flex flex-col gap-4">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            {...props}
          />

          {/* File upload dropzone */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center
              ${error ? "border-error" : "border-base-300"}
              ${className}
              cursor-pointer hover:bg-base-200 transition-colors`}
            onClick={handleBrowseClick}
          >
            {!preview && !modelUrl ? (
              <>
                <Upload size={32} className="text-base-content/70 mb-2" />
                <div className="text-center space-y-1">
                  <p className="font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-base-content/70">
                    {accept === "image/*"
                      ? "SVG, PNG, JPG or GIF (max. 2MB)"
                      : accept.includes("model")
                      ? "GLB, GLTF, OBJ, FBX, STL or DAE file"
                      : "Upload a file"}
                  </p>
                </div>
              </>
            ) : (
              <div className="relative w-full">
                {/* Preview for images */}
                {preview && !is3DModel && (
                  <Image
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-64 object-contain rounded-md"
                    width={400}
                    height={300}
                  />
                )}

                {/* Preview for 3D models */}
                {is3DModel && <Show3d modelUrl={modelUrl} />}

                {/* Generic file preview */}
                {!preview && !is3DModel && (
                  <div className="text-center p-4 bg-base-200 rounded-md">
                    <p className="font-medium">File selected</p>
                    <p className="text-sm text-base-content/70 truncate">
                      {fileInputRef.current?.files?.[0]?.name}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-circle btn-sm btn-error absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                >
                  <span className="sr-only">Remove file</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {(error || helper) && (
          <label className="label">
            {error && (
              <span className="label-text-alt text-error">{error}</span>
            )}
            {!error && helper && (
              <span className="label-text-alt">{helper}</span>
            )}
          </label>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
