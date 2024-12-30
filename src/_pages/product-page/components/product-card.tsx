import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductImageCarousel from "./product-image-carousel";
import UpdateProductDialog from "./update-product-dialog";
import DeleteProductDialog from "./delete-product-dialog";

type ProductType = Doc<"products">;

const ProductCard: React.FC<ProductType> = ({
  _id,
  category,
  description,
  name,
  price,
  _creationTime,
  imagesStorageIds,
}) => {
  const imageUrls =
    useQuery(
      api.upload.getImagesUrl,
      imagesStorageIds ? { imageStorageIds: imagesStorageIds } : "skip"
    ) || undefined;

  const formattedPrice = price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const timeAgo = _creationTime
    ? formatDistanceToNow(new Date(_creationTime), { addSuffix: true })
    : null;

  return (
    <Card key={_id} className="relative">
      <div className="relative h-52">
        <ProductImageCarousel images={imageUrls} name={name} />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {description.length > 200
            ? `${description.substring(0, 200)}...`
            : description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <div className="text-lg font-semibold text-primary">
            ${formattedPrice}
          </div>
          {timeAgo && (
            <div className="text-sm text-gray-500">Created {timeAgo}</div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full size-8 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ShoppingCart className="size-4" />
          </Button>
        </div>
        <div>
          <DeleteProductDialog productName={name} productId={_id} />
          <UpdateProductDialog productId={_id} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
