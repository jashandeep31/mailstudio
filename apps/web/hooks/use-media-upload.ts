import { getPresignedUrl } from "@/services/util-services";
import axios from "axios";
import { useState } from "react";
type MediaData =
  | {
      state: "nothing";
    }
  | {
      state: "uploading";
      percentage: number;
    }
  | {
      state: "uploaded";
      id: string;
    };

export const useUploadMedia = () => {
  const [uploadState, setUploadState] = useState<MediaData>({
    state: "nothing",
  });

  const presignedUrl = async (file: File) => {
    return await getPresignedUrl({
      key: "attachment",
      fileName: file.name,
      size: file.size,
      contentType: file.type,
    });
  };

  const uploadToStorage = async (signedUrl: string, id: string, file: File) => {
    try {
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadState({
            state: "uploading",
            percentage,
          });
        },
      });
      setUploadState({
        state: "uploaded",
        id,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const uploadMedia = async (file: File) => {
    setUploadState({
      state: "nothing",
    });
    const response = await presignedUrl(file);
    uploadToStorage(response.url, response.key, file);
  };
  return {
    uploadState,
    uploadMedia,
  };
};
