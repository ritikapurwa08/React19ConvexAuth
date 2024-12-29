import { Form } from "@/components/ui/form";
import { useState, useRef } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CustomInput from "@/components/forms/custom-input";
import CustomTextarea from "@/components/forms/custom-textarea";
import CustomSelect from "@/components/forms/custom-select";
import CustomNumberInput from "@/components/forms/custom-number-input";
import SubmitLoader from "@/components/custom/app-components/loaders/submit-loader";
import {
  CategoryOptionForSelect,
  CreateProductType,
  UseCreateProduct,
} from "../api/create-product";
import { Id } from "@convex/_generated/dataModel";
import ProductImagesUploadButton from "./product-image-upload-button";
import { useImageUpload } from "../api/use-image-upload-hook";

type ProductWithImageUpload = CreateProductType & {
  imagesStorageIds?: Id<"_storage">[];
};

const CreateProductPage = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const imageElementRef = useRef<HTMLInputElement>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const { mutate: CreateProduct, form: ZodFormValidator } = UseCreateProduct();
  const {
    loading: imageUploadLoading,
    uploadImages,
    error: imageError,
  } = useImageUpload();

  const handleImageSelect = (images: File[]) => {
    setSelectedImages(images);
  };

  const handleCreateProduct = async (datas: CreateProductType) => {
    setSubmitLoading(true);

    try {
      const values: ProductWithImageUpload = {
        ...datas,
        imagesStorageIds: [],
      };

      if (selectedImages.length > 0) {
        const imageStorageIds = await uploadImages(selectedImages);
        values.imagesStorageIds = imageStorageIds;
      }

      await CreateProduct(values, {
        onSuccess: (data) => {
          setSuccessMessage("Product created successfully!");
          ZodFormValidator.reset();
          setSelectedImages([]);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
          console.log(data);
        },
        onError: (error) => {
          console.log(error);
        },
        onSettled: () => {
          setSubmitLoading(false);
        },
        throwError: true,
      });
    } catch (error) {
      setSubmitLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create New Product
        </h2>
        {successMessage && (
          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {imageError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error Uploading Image</AlertTitle>
            <AlertDescription>{imageError.message}</AlertDescription>
          </Alert>
        )}
        <Form {...ZodFormValidator}>
          <form
            className="space-y-4"
            onSubmit={ZodFormValidator.handleSubmit(handleCreateProduct)}
          >
            <CustomInput
              control={ZodFormValidator.control}
              name="name"
              label="Enter Product Name"
              placeholder="Enter Product Name"
              disabled={submitLoading || imageUploadLoading}
            />
            <CustomTextarea
              control={ZodFormValidator.control}
              label="Enter Product Description"
              placeholder="Enter Product Description"
              disabled={submitLoading || imageUploadLoading}
              name="description"
            />
            <CustomSelect
              options={CategoryOptionForSelect}
              control={ZodFormValidator.control}
              placeholder="Select Category"
              name="category"
              label="Select Category"
              disabled={submitLoading || imageUploadLoading}
            />
            <CustomNumberInput
              control={ZodFormValidator.control}
              name="price"
              label="Enter Product Price"
              placeholder="Enter Product Price"
              disabled={submitLoading || imageUploadLoading}
            />
            <div className="w-full h-full ">
              <ProductImagesUploadButton
                images={selectedImages}
                setImages={setSelectedImages}
                imageRef={imageElementRef}
                onImagesSelected={handleImageSelect}
              />
            </div>

            <SubmitLoader
              defaultText="Create Product"
              loadingText="Creating Product"
              loadingIcon={Loader2}
              loadingState={submitLoading || imageUploadLoading} // Include image loading state
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateProductPage;
