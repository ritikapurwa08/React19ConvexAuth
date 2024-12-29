import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/hint";
import { Input } from "@/components/ui/input";
import { UploadIcon, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ImageUploadAndShowImageProps = {
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  onImageSelected?: (image: File | null) => void;
  imageRef: React.RefObject<HTMLInputElement>;
};

const ImageUploadAndShowImage = ({
  image,
  setImage,
  imageRef,
  onImageSelected,
}: ImageUploadAndShowImageProps) => {
  const [imageURL, setImageURL] = useState<string | null>(null);

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      setImage(file);
      if (file) {
        setImageURL(URL.createObjectURL(file));
      } else {
        setImageURL(null);
      }
      onImageSelected?.(file);
    },
    [onImageSelected, setImage]
  );

  const handleRemoveImage = useCallback(() => {
    setImage(null);
    setImageURL(null);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
    onImageSelected?.(null);
  }, [onImageSelected, imageRef, setImage]);

  useEffect(() => {
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, [imageURL]);

  useEffect(() => {
    if (!image) {
      setImageURL(null);
    }
  }, [image]);
  return (
    <div id="fantom-editor-input" className="flex flex-col">
      <Input
        type="file"
        accept="image/*"
        ref={imageRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {!!image && (
        <div className="p-2 relative group">
          <div className="relative w-full ">
            <img
              src={imageURL!}
              className="rounded-xl  overflow-hidden border object-cover"
              alt="uploaded"
            />
            <Hint label="Remove Image">
              <Button
                className="rounded-full bg-black/60 hover:bg-black absolute -top-2.5 -right-2.5 size-6 border-2 border-white text-white items-center justify-center z-[4px]  opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-in-out"
                type="button"
                onClick={handleRemoveImage}
              >
                <XIcon className="size-3.5" />
              </Button>
            </Hint>
          </div>
        </div>
      )}
      <Button size="sm" type="button" onClick={() => imageRef.current?.click()}>
        <UploadIcon />
      </Button>
    </div>
  );
};

export default ImageUploadAndShowImage;
