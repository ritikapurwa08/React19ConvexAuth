// src/components/products/DeleteProductDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Id } from "@convex/_generated/dataModel";
import { UseDeleteProduct } from "../api/use-delete-product";

interface DeleteProductDialogProps {
  productId: Id<"products">;
  productName: string; // To show product name
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  productId,
  productName,
}) => {
  const [open, setOpen] = useState(false);
  const {
    mutate: deleteProduct,
    isPending,
    data: deleteData,
  } = UseDeleteProduct();

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(
        { id: productId },
        {
          onSuccess: () => {
            setOpen(false);
          },
          throwError: true,
        }
      );

      console.log(`Product ID: ${deleteData} has been deleted successfully.`);
    } catch (e) {
      console.error(`Error deleting product ID: ${productId}`, e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>Delete Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Product Confirmation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete product " {productName} " and its
            associated images? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => {
              handleDeleteProduct();
            }}
            disabled={isPending}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductDialog;
