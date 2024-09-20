import ProjectDetailView from "@/components/project-detail/ProjectDetailView";
import { notFound } from "next/navigation";
import React from "react";

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // TODO: Make a query to the DB to grab the project with projectID
  // TODO: Pass project to our children components

  // TODO: If not found, return 404 page

  return <ProjectDetailView />;
}
