// src/components/products/UpdateProductDialog.tsx
import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CustomInput from "@/components/forms/custom-input";
import CustomTextarea from "@/components/forms/custom-textarea";
import CustomSelect from "@/components/forms/custom-select";
import CustomNumberInput from "@/components/forms/custom-number-input";
import SubmitLoader from "@/components/custom/app-components/loaders/submit-loader";
import { Form } from "@/components/ui/form";
import { useGenerateUploadUrl } from "@/_pages/blog-page/api/use-generate-upload-url";
import ProductImagesUploadButton from "./product-image-upload-button";
import { Id } from "@convex/_generated/dataModel";
import { UpdateProductType, useUpdateProduct } from "../api/update-product";
import { UseGetProductById } from "../api/use-get-product-by-id";
import { CategoryOptionForSelect } from "../api/create-product";

interface UpdateProductDialogProps {
  productId: Id<"products">;
  open: boolean;
  setOpen: (open: boolean) => void;
}

type ProductWithImageUpload = UpdateProductType & {
  imagesStorageIds?: Id<"_storage">[];
};

const UpdateProductDialog: React.FC<UpdateProductDialogProps> = ({
  productId,
  open,
  setOpen,
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const imageElementRef = useRef<HTMLInputElement>(null);

  const { product } = UseGetProductById({ id: productId });

  const {
    mutate: updateProduct,
    isPending: updatingProduct,
    form: updateForm,
  } = useUpdateProduct();

  const { mutate: generateUploadUrl, isPending: generatingImage } =
    useGenerateUploadUrl();

  const handleImageSelect = (images: File[]) => {
    setSelectedImages(images);
  };

  const handleUpdateProduct = async (datas: UpdateProductType) => {
    try {
      const values: ProductWithImageUpload = {
        ...datas,
        id: productId,
        imagesStorageIds: product?.imagesStorageIds || [],
      };
      if (selectedImages.length > 0) {
        const imageStorageIds: Id<"_storage">[] = [];
        for (const image of selectedImages) {
          const url = await generateUploadUrl(
            {},
            {
              throwError: true,
            }
          );

          if (!url) throw new Error("URL not found.");

          const result = await fetch(url, {
            method: "POST",
            headers: { "Content-type": image.type },
            body: image,
          });

          if (!result.ok) throw new Error("Failed to upload image.");

          const { storageId } = await result.json();

          imageStorageIds.push(storageId);
        }
        values.imagesStorageIds = imageStorageIds;
      }
      await updateProduct(values, { throwError: true });
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Update Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>Update Product Details</DialogDescription>
        </DialogHeader>
        <Form {...updateForm}>
          <form
            className="space-y-4"
            onSubmit={updateForm.handleSubmit(handleUpdateProduct)}
          >
            <CustomInput
              control={updateForm.control}
              name="name"
              label="Enter Product Name"
              placeholder="Enter Product Name"
              disabled={updatingProduct || generatingImage}
            />
            <CustomTextarea
              control={updateForm.control}
              label="Enter Product Description"
              placeholder="Enter Product Description"
              disabled={updatingProduct || generatingImage}
              name="description"
            />
            <CustomSelect
              options={CategoryOptionForSelect}
              control={updateForm.control}
              placeholder="Select Category"
              name="category"
              label="Select Category"
              disabled={updatingProduct || generatingImage}
            />
            <CustomNumberInput
              control={updateForm.control}
              name="price"
              label="Enter Product Price"
              placeholder="Enter Product Price"
              disabled={updatingProduct || generatingImage}
            />
            <div className="w-full h-full ">
              <ProductImagesUploadButton
                images={selectedImages}
                setImages={setSelectedImages}
                imageRef={imageElementRef}
                onImagesSelected={handleImageSelect}
              />
            </div>
            <DialogFooter className="p-0">
              <SubmitLoader
                defaultText="Update Product"
                loadingText="Updating Product"
                loadingIcon={Loader2}
                loadingState={updatingProduct || generatingImage}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProductDialog;
