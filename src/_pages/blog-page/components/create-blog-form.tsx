import { useToast } from "@/hooks/use-toast";
import { Id } from "@convex/_generated/dataModel";
import { Form } from "@/components/ui/form";
import { LoaderIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateBlog } from "@/_pages/blog-page/api/create-blog";
import { SubmitHandler } from "react-hook-form";
import ImageUploadAndShowImage from "./image-upload-button";
import { useRef, useState } from "react";
import { useGenerateUploadUrl } from "../api/use-generate-upload-url";
import CustomInput from "@/components/forms/custom-input";
import SubmitLoader from "@/components/custom/app-components/loaders/submit-loader";

type CreateBlogValues = {
  name: string;
  image?: Id<"_storage">;
};

// Define the expected input type for the form submit handler.
export type FormInputType = {
  name: string;
};

const CreateBlogForm = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const imageElementRef = useRef<HTMLInputElement>(null);

  const {
    mutate: createBlog,
    isPending: creatingBlog,
    form: blogForm,
  } = useCreateBlog();

  const { toast } = useToast();

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const handleImageSelect = (image: File | null) => {
    setSelectedImage(image);
  };

  const handleCreateBlog: SubmitHandler<FormInputType> = async (data) => {
    try {
      const values: CreateBlogValues = {
        name: data.name,
        image: undefined,
      };
      if (selectedImage) {
        const url = await generateUploadUrl(
          {},
          {
            throwError: true,
          }
        );

        if (!url) throw new Error("URL not found.");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-type": selectedImage.type },
          body: selectedImage,
        });

        if (!result.ok) throw new Error("Failed to upload image.");

        const { storageId } = await result.json();

        values.image = storageId;
      }
      await createBlog(values, { throwError: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${error} this error came`,
      });
    } finally {
      blogForm.reset();
      setSelectedImage(null);
    }
  };

  return (
    <Card className="max-w-md mx-auto py-6 my-10">
      <CardHeader>
        <CardTitle>Create a Blog With This</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...blogForm}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={blogForm.handleSubmit(handleCreateBlog)}
          >
            <CustomInput
              control={blogForm.control}
              label="Name"
              name="name"
              placeholder="Enter Blog Name "
            />
            <div className="w-full h-full ">
              <ImageUploadAndShowImage
                image={selectedImage}
                setImage={setSelectedImage}
                imageRef={imageElementRef}
                onImageSelected={handleImageSelect}
              />
            </div>
            <CardFooter>
              <SubmitLoader
                loadingState={creatingBlog}
                defaultText="Create Blog"
                loadingText="Creating Blog"
                loadingIcon={LoaderIcon}
              />
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default CreateBlogForm;
