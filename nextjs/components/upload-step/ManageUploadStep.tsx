"use client";

import React, { useState } from "react";
import UploadStepHeader from "./UploadStepHeader";
import UploadStepBody from "./UploadStepBody";
import ConfirmationModal from "../ConfirmationModal";
import axios from "axios";
import toast from "react-hot-toast";

interface ManageUploadStepProps {
  projectId: string;
}

function ManageUploadStep({ projectId }: ManageUploadStepProps) {
  const [deleteAssetId, setDeleteAssetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `/api/projects/${projectId}/assets?assetId=${deleteAssetId}`
      );
      toast.success("Asset deleted successfully");
      // TODO: Refetch assets
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
      <UploadStepHeader projectId={projectId} />
      <UploadStepBody
        projectId={projectId}
        setDeleteAssetId={setDeleteAssetId}
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
