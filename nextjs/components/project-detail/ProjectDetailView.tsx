import { Project } from "@/server/db/schema";
import React from "react";
import ProjectDetailHeader from "./ProjectDetailHeader";
import ProjectDetailStepper from "./ProjectDetailStepper";
import ProjectDetailBody from "./ProjectDetailBody";

interface ProjectDetailViewProps {
  project: Project;
}

function ProjectDetailView({ project }: ProjectDetailViewProps) {
  return (
    <div>
      <ProjectDetailHeader />
      <ProjectDetailStepper />
      <ProjectDetailBody />
    </div>
  );
}

export default ProjectDetailView;
