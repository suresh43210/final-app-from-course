"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import UploadStepHeader from "./UploadStepHeader";
import UploadStepBody from "./UploadStepBody";
import ConfirmationModal from "../ConfirmationModal";
import axios from "axios";
import toast from "react-hot-toast";
import { Asset } from "@/server/db/schema";
import { upload } from "@vercel/blob/client";

interface ManageUploadStepProps {
  projectId: string;
}

function ManageUploadStep({ projectId }: ManageUploadStepProps) {
  const [browserFiles, setBrowserFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadAssets, setUploadAssets] = useState<Asset[]>([]);
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<Asset[]>(
        `/api/projects/${projectId}/assets`
      );
      setUploadAssets(response.data);
      console.log("Uploaded assets", response.data);
    } catch (error) {
      console.error("Failed to fetch assets", error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const getFileType = (file: File) => {
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    if (file.type === "text/plain") return "text";
    if (file.type === "text/markdown") return "markdown";
    return "other";
  };

  const handleUpload = async () => {
    // check if files are uploaded
    setUploading(true);

    try {
      // upload files
      const uploadPromises = browserFiles.map(async (file) => {
        const fileData = {
          projectId,
          title: file.name,
          fileType: getFileType(file),
          mimeType: file.type,
          size: file.size,
        };

        const filename = `${projectId}/${file.name}`;
        const result = await upload(filename, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          multipart: true,
          clientPayload: JSON.stringify(fileData),
        });

        return result;
      });

      const uploadResults = await Promise.all(uploadPromises);

      // Fetch assets
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchAssets();

      toast.success(`Successfully uploaded ${uploadResults.length} files`);
      setBrowserFiles([]);
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    } catch (error) {
      console.error("Error in upload process:", error);
      toast.error("Failed to upload one or more files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `/api/projects/${projectId}/assets?assetId=${deleteAssetId}`
      );
      toast.success("Asset deleted successfully");
      fetchAssets();
    } catch (error) {
      console.error("Failed to delete project", error);
      toast.error("Failed to delete asset. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteAssetId(null);
    }
  };

  return (
    <div>
      <UploadStepHeader
        setBrowserFiles={setBrowserFiles}
        browserFiles={browserFiles}
        inputFileRef={inputFileRef}
        handleUpload={handleUpload}
        uploading={uploading}
      />
      <UploadStepBody
        isLoading={isLoading}
        setDeleteAssetId={setDeleteAssetId}
        uploadAssets={uploadAssets}
      />
      <ConfirmationModal
        isOpen={!!deleteAssetId}
        title={"Delete Asset"}
        message={
          "Are you sure you want to delete this asset? This action cannot be undone."
        }
        onClose={() => {
          setDeleteAssetId(null);
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default ManageUploadStep;
