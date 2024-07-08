import { getFileExtension } from "@/helpers/getFileExtension";
import { getFileNameWithExtension } from "@/helpers/getFileNameWithExtension";
import { useEffect, useState } from "react";
import { getContentType } from "@/helpers/getContentType";

import * as tus from "tus-js-client";
import * as FileSystem from "expo-file-system";

type Params = {
  bucketName: string;
  uri?: string;
};

export async function useStorageUpload({ bucketName, uri }: Params) {
  if (!uri) return;
  const filedata = await FileSystem.getInfoAsync(uri);

  if (!filedata.exists) throw "File dont exist";

  const [bytesUploaded, setBytesUploaded] = useState(0);
  const [bytesTotal, setBytesTotal] = useState(0);
  const [error, setError] = useState<Error | tus.DetailedError | null>(null);
  const [onLoading, setonLoading] = useState(true);
  const [uploadUrl, setUploadUrl] = useState<null | string>(null);

  const fileExtension = getFileExtension(uri);
  const fileName = getFileNameWithExtension(uri);
  const contentType = getContentType(fileExtension);

  useEffect(() => {
    let upload = new tus.Upload(
      { uri },
      {
        endpoint: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_KEY}`,
          "x-upsert": "true", // optionally set upsert to true to overwrite existing files
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
        metadata: {
          bucketName: bucketName,
          objectName: fileName,
          contentType,
          cacheControl: 3600,
        },
        chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it

        onError: function (error) {
          setError(error);
          setonLoading(false);
          console.log("Failed because: " + error);
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          setBytesUploaded(bytesUploaded);
          setBytesTotal(bytesTotal);
          let percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(bytesUploaded, bytesTotal, percentage + "%");
        },
        onSuccess: function () {
          setonLoading(false);
          setUploadUrl(
            `${process.env.EXPO_PUBLIC_SUPABASE_URL}/${process.env.EXPO_PUBLIC_SUPABASE_CHAT_BUCKET}/chat/${fileName}`
          );
          console.log("Download %s from %s", upload.file, upload.url);
          console.log(upload, "upload succes");
        },
      }
    );

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads) {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0]);
      }

      // Start the upload
      upload.start();
    });
  }, [bucketName, uri]);

  return {
    bytesTotal,
    bytesUploaded,
    onLoading,
    error,
    uploadUrl,
  };
}
