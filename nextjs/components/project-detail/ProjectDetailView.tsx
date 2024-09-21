"use client";

import { Project } from "@/server/db/schema";
import React, { useState } from "react";
import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectDetailStepper from "./ProjectDetailStepper";
// import ProjectDetailBody from "./ProjectDetailBody";
import ConfirmationModal from "../ConfirmationModal";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const steps = [
  { name: "Upload Media", tab: "upload" },
  { name: "Prompts", tab: "prompts" },
  { name: "Generate", tab: "generate" },
];

interface ProjectDetailViewProps {
  project: Project;
}

function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/projects/${project.id}`);
      toast.success("Project deleted successfully");
      router.push("/projects?deleted=true");
    } catch (error) {
      console.error("Failed to delete project", error);
      toast.error("Failed to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8 bg-white space-y-12">
      <ProjectDetailHeader
        project={project}
        setShowDeleteConfirmation={setShowDeleteConfirmation}
      />
      <ProjectDetailStepper
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        steps={steps}
      />
      {/* <ProjectDetailBody currentStep={currentStep} /> */}

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        isLoading={isDeleting}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default ProjectDetailView;
