import { getFileExtension } from "@/helpers/getFileExtension";
import { getFileNameWithExtension } from "@/helpers/getFileNameWithExtension";
import { useEffect, useState, useRef } from "react";
import { getContentType } from "@/helpers/getContentType";

import * as tus from "tus-js-client";
import * as FileSystem from "expo-file-system";

type Params = {
  bucketName: string;
  uri: string;
};

export function useStorageUpload({ bucketName, uri }: Params) {
  const [bytesUploaded, setBytesUploaded] = useState(0);
  const [bytesTotal, setBytesTotal] = useState(0);
  const [error, setError] = useState<Error | tus.DetailedError | null>(null);
  const [onLoading, setOnLoading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<null | string>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileExtension = getFileExtension(uri);
  const fileName = getFileNameWithExtension(uri);
  const ContentType = getContentType(fileExtension);

  const uploadRef = useRef<tus.Upload | null>(null);

  const startUpload = () => {
    if (!uploadRef.current) return;
    setOnLoading(true);
    uploadRef.current.findPreviousUploads().then(function (previousUploads) {
      if (!uploadRef.current) return;
      if (previousUploads.length) {
        uploadRef.current.resumeFromPreviousUpload(previousUploads[0]);
      }
      uploadRef.current.start();
    });
  };

  const stopUpload = () => {
    if (!uploadRef.current) return;
    uploadRef.current.abort();
  };

  useEffect(() => {
    console.log("useEffect do hook =", getFileNameWithExtension(uri));
    const upload = new tus.Upload({ uri } as any, {
      endpoint: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      headers: {
        authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_KEY}`,
        "x-upsert": "true",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: {
        bucketName: bucketName,
        objectName: `chat/${fileName}`,
        ContentType,
        cacheControl: "3600",
      },
      chunkSize: 6 * 1024 * 1024,
      onError: function (error) {
        setError(error);
        setOnLoading(false);
        console.log("Failed because: " + error);
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        setBytesUploaded(bytesUploaded);
        setBytesTotal(bytesTotal);
        let percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + "%");
      },
      onSuccess: function () {
        setUploadSuccess(true);
        setOnLoading(false);
        setUploadUrl(
          `${process.env.EXPO_PUBLIC_SUPABASE_URL}/${process.env.EXPO_PUBLIC_SUPABASE_CHAT_BUCKET}/chat/${fileName}`
        );
        console.log("Download %s from %s", upload.file, upload.url);
        console.log("upload success");
      },
    });

    uploadRef.current = upload;

    return () => {
      if (uploadRef.current) {
        uploadRef.current.abort();
      }
    };
  }, []);

  return {
    bytesTotal,
    bytesUploaded,
    onLoading,
    error,
    uploadUrl,
    uploadSuccess,
    startUpload,
    stopUpload,
  };
}
