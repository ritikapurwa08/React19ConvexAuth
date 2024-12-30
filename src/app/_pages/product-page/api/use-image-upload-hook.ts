import { useState } from "react";
import { Id } from "@convex/_generated/dataModel";
import { useGenerateUploadUrl } from "@/app/_pages/blog-page/api/use-generate-upload-url";

type UseImageUploadResult = {
  loading: boolean;
  uploadImages: (files: File[]) => Promise<Id<"_storage">[]>;
  error: Error | null;
};

export const useImageUpload = (): UseImageUploadResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const uploadImages = async (files: File[]): Promise<Id<"_storage">[]> => {
    setLoading(true);
    setError(null); // Clear any previous errors
    const storageIds: Id<"_storage">[] = [];

    try {
      for (const file of files) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error("URL not found.");
        }

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error(`Failed to upload image: ${file.name}`);
        }

        const { storageId } = await result.json();
        storageIds.push(storageId);
      }
      return storageIds;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    uploadImages,
    error,
  };
};
