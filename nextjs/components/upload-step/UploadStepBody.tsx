"use client";

import { Asset } from "@/server/db/schema";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { AudioLines, FileMinus, Video, File, Dot, Trash } from "lucide-react";
import { Button } from "../ui/button";

interface UploadStepBodyProps {
  projectId: string;
  setDeleteAssetId: React.Dispatch<React.SetStateAction<string | null>>;
}

function UploadStepBody({ projectId, setDeleteAssetId }: UploadStepBodyProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadAssets, setUploadAssets] = useState<Asset[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchAssets = async () => {
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
    };

    fetchAssets();
  }, [projectId]);

  // fetch all assets processing jobs - polling

  if (isLoading) {
    return (
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 mt-3">
        <h3 className="font-bold text-lg mb-2 sm:mb-0">Uploaded Files:</h3>
        <div>{/* TODO: Token usage bar on the right */} Progress bar</div>
      </div>
      <ul className="space-y-1">
        {uploadAssets.map((asset) => (
          <li
            key={asset.id}
            className="flex items-center justify-between hover:bg-gray-100 rounded-lg transition-all duration-100 px-3 py-2 group"
          >
            <span className="flex items-center text-semibold min-w-0 flex-1 mr-2">
              <FileIconLoader fileType={asset.fileType} />
              <div className="flex flex-col ml-3 w-full min-w-0">
                <span className="font-medium text-sm sm:text-base truncate">
                  {asset.title}
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center text-gray-500 w-full min-w-0">
                  <p className="text-xs sm:text-sm truncate">
                    Job Status: Unknown
                  </p>
                  <Dot className="hidden sm:flex flex-shrink-0" />
                  <p className="text-xs sm:text-sm truncate">Tokens: ???</p>
                </div>
              </div>
            </span>
            <Button
              onClick={() => setDeleteAssetId(asset.id)}
              className="text-red-500 bg-transparent shadow-none hover:bg-transparent flex-shrink-0 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-100"
            >
              <Trash className="h-5 w-5" />
              <span className="hidden lg:inline ml-2">Delete</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UploadStepBody;

// Extra components
function FileIconLoader({ fileType }: { fileType: string }) {
  switch (fileType) {
    case "video":
      return <Video className="h-5 w-5 flex-shrink-0 text-main" />;
    case "audio":
      return <AudioLines className="h-5 w-5 flex-shrink-0 text-main" />;
    case "text":
      return <File className="h-5 w-5 flex-shrink-0 text-main" />;
    case "markdown":
      return <FileMinus className="h-5 w-5 flex-shrink-0 text-main" />;
    default:
      return <File className="h-5 w-5 flex-shrink-0 text-main" />;
  }
}
