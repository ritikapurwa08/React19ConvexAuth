import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { Input } from "@/components/ui/input";
import { UploadIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ImageUploadAndShowImageProps = {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  onImagesSelected?: (images: File[]) => void;
  imageRef: React.RefObject<HTMLInputElement>;
  maxImages?: number; // Allow setting max images
  onClearImages?: () => void; // Callback for clearing images externally
};

const ProductImagesUploadButton = ({
  images,
  setImages,
  imageRef,
  onImagesSelected,
  maxImages = 5, // Default max images
  onClearImages,
}: ImageUploadAndShowImageProps) => {
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setError(null); // Clear previous error

      const files = Array.from(event.target.files || []);
      const currentImageCount = images.length;

      if (currentImageCount + files.length > maxImages) {
        setError(`Maximum ${maxImages} images allowed.`);
        if (imageRef.current) {
          imageRef.current.value = "";
        }
        return;
      }

      const validFiles = files.filter(Boolean) as File[];
      if (validFiles.length === 0) {
        return;
      }

      setImages((prevImages) => [...prevImages, ...validFiles]);
      const urls = validFiles.map((file) => URL.createObjectURL(file));
      setImageURLs((prevUrls) => [...prevUrls, ...urls]);
      onImagesSelected?.([...images, ...validFiles]);
    },
    [maxImages, images, setImages, onImagesSelected, imageRef]
  );

  const handleRemoveImage = useCallback(
    (indexToRemove: number) => {
      setImages((prevImages) =>
        prevImages.filter((_, index) => index !== indexToRemove)
      );

      setImageURLs((prevUrls) => {
        const urlToRemove = prevUrls[indexToRemove];
        if (urlToRemove) {
          URL.revokeObjectURL(urlToRemove);
        }
        return prevUrls.filter((_, index) => index !== indexToRemove);
      });
      onImagesSelected?.(images.filter((_, index) => index !== indexToRemove));

      if (images.length === 1) {
        if (imageRef.current) {
          imageRef.current.value = "";
        }
      }
    },
    [onImagesSelected, imageRef, setImages, images]
  );

  useEffect(() => {
    return () => {
      imageURLs.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imageURLs]);

  useEffect(() => {
    if (images.length === 0) {
      setImageURLs([]);
    }
  }, [images]);

  useEffect(() => {
    if (onClearImages) {
      onClearImages();
    }
  }, [onClearImages]);

  return (
    <div id="fantom-editor-input" className="flex flex-col">
      <Input
        type="file"
        accept="image/*"
        ref={imageRef}
        onChange={handleImageChange}
        className="hidden"
        multiple
      />
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex flex-wrap gap-2">
        {imageURLs.map((url, index) => (
          <div key={index} className="p-2 relative group w-[100px] h-[100px]">
            <div className="relative w-full h-full ">
              <img
                src={url}
                className="rounded-xl overflow-hidden border object-cover"
                alt={`uploaded-${index}`}
              />
              <Hint label="Remove Image">
                <Button
                  className="rounded-full bg-black/60 hover:bg-black absolute -top-2.5 -right-2.5 size-6 border-2 border-white text-white items-center justify-center z-[4px]  opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-in-out"
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                >
                  <XIcon className="size-3.5" />
                </Button>
              </Hint>
            </div>
          </div>
        ))}
      </div>
      <Button size="sm" type="button" onClick={() => imageRef.current?.click()}>
        <UploadIcon />
      </Button>
    </div>
  );
};

export default ProductImagesUploadButton;
