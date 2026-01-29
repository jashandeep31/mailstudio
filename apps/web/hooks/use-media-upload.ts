import { getPresignedUrl } from "@/services/util-services";
import { getPreSignedUrlSchema } from "@repo/shared";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
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

  const presignedUrl = async (
    file: File,
    type: z.infer<typeof getPreSignedUrlSchema>["key"],
  ) => {
    try {
      const res = await getPresignedUrl({
        key: type,
        fileName: file.name,
        size: file.size,
        contentType: file.type,
      });
      return res;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log(e.response?.data.message);
        toast.error(
          e.response?.data.message || "Please try again with valid file type",
        );
      }
      throw e;
    }
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
  const uploadMedia = async (
    file: File,
    type: z.infer<typeof getPreSignedUrlSchema>["key"],
  ) => {
    setUploadState({
      state: "nothing",
    });
    const response = await presignedUrl(file, type);
    if (!response) return;
    uploadToStorage(response.url, response.key, file);
  };
  return {
    uploadState,
    uploadMediaFun: uploadMedia,
  };
};
