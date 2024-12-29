// src/components/products/UpdateProductDialog.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import ProductImagesUploadButton from "./product-image-upload-button";
import { Id } from "@convex/_generated/dataModel";
import { UseGetProductById } from "../api/use-get-product-by-id";
import { CategoryOptionForSelect } from "../api/create-product";
import { useImageUpload } from "../api/use-image-upload-hook";
import {
  productType,
  productZodType,
  UseUpdateProduct,
} from "../api/update-product";

interface UpdateProductDialogProps {
  productId: Id<"products">;
}

const UpdateProductDialog: React.FC<UpdateProductDialogProps> = ({
  productId,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUpdating, setIsUpdating] = useState(false); // prevent multiple update while one update is going
  const imageElementRef = useRef<HTMLInputElement>(null);
  const [submitLoading, setSubmitLoading] = useState(false); // Unified loading state

  const { product } = UseGetProductById({ id: productId });

  const { loading: imageUploadLoading, uploadImages } = useImageUpload();

  const {
    mutate: updateProduct,
    isPending: updatingProduct,
    productZodForm,
  } = UseUpdateProduct();

  const handleImageSelect = (images: File[]) => {
    // Filter out null or undefined images
    const validImages = images.filter(Boolean) as File[];

    // Only update if there are valid images
    if (validImages.length > 0) {
      setSelectedImages(validImages);
    } else {
      setSelectedImages([]); // reset the selected images
    }
  };

  const handleUpdateProduct = async (datas: productZodType) => {
    if (isUpdating) {
      return; // Prevent multiple updates if already updating
    }

    setIsUpdating(true);
    setSubmitLoading(true);

    try {
      const { ...rest } = datas;

      const existingImageIds = product?.imagesStorageIds || []; // get existing or default to empty array

      let newImageStorageIds: Id<"_storage">[] = [];

      if (selectedImages.length > 0) {
        newImageStorageIds = await uploadImages(selectedImages);
      }

      const updatedImageIds = [...existingImageIds, ...newImageStorageIds];

      const values: productType = {
        ...rest,
        id: productId,
        imagesStorageIds: updatedImageIds, // Use existing image IDs as default if no new image
      };

      await updateProduct({ ...values }, { throwError: true });
      setOpen(false);
      setSelectedImages([]); // Reset selected images after successful update
    } catch (e) {
      console.error("Error updating product:", e); // Log the error with more detail
    } finally {
      setIsUpdating(false); // allow update again
      setSubmitLoading(false); // Stop loading
    }
  };
  // Use useEffect to set form values when product data is available
  useEffect(() => {
    if (product) {
      productZodForm.setValue("name", product.name);
      productZodForm.setValue("description", product.description);
      productZodForm.setValue("category", product.category);
      productZodForm.setValue("price", product.price);
      productZodForm.setValue("imagesStorageIds", product.imagesStorageIds);
    }
  }, [product, productZodForm.setValue, productZodForm]);

  const isFormDisabled =
    submitLoading || updatingProduct || imageUploadLoading || isUpdating;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Update Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>Update Product Details</DialogDescription>
        </DialogHeader>
        <Form {...productZodForm}>
          <form
            className="space-y-4"
            onSubmit={productZodForm.handleSubmit(handleUpdateProduct)}
          >
            <CustomInput
              control={productZodForm.control}
              name="name"
              label="Enter Product Name"
              placeholder="Enter Product Name"
              disabled={isFormDisabled}
            />
            <CustomTextarea
              control={productZodForm.control}
              label="Enter Product Description"
              placeholder="Enter Product Description"
              disabled={isFormDisabled}
              name="description"
            />
            <CustomSelect
              options={CategoryOptionForSelect}
              control={productZodForm.control}
              placeholder="Select Category"
              name="category"
              label="Select Category"
              disabled={isFormDisabled}
            />
            <CustomNumberInput
              control={productZodForm.control}
              name="price"
              label="Enter Product Price"
              placeholder="Enter Product Price"
              disabled={isFormDisabled}
            />
            <div className="w-full h-40 ">
              <ProductImagesUploadButton
                images={selectedImages}
                setImages={setSelectedImages}
                imageRef={imageElementRef}
                onImagesSelected={handleImageSelect}
                onClearImages={() => setSelectedImages([])} // for update
                //  onClearImages={()=> setSelectedImages([])} // for create
              />
            </div>
            <div className="flex ">
              <SubmitLoader
                defaultText="Update Product"
                loadingText="Updating Product"
                loadingIcon={Loader2}
                loadingState={submitLoading}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProductDialog;
