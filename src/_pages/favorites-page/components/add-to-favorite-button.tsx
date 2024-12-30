import { Id } from "@convex/_generated/dataModel";

import { useIsProductFavorite } from "../hooks/mutation/use-is-favorite-product";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useState } from "react";
import { UseRemoveFromFavorites } from "../hooks/remove-from-favorites";
import { UseAddToFavorites } from "../hooks/add-to-favorites";
import { useToast } from "@/hooks/use-toast";

const AddToFavoriteButton = ({ productId }: { productId: Id<"products"> }) => {
  const { mutate: addToFavorites, isPending: addingFav } = UseAddToFavorites();
  const { mutate: removeFromFavorites, isPending: removingFav } =
    UseRemoveFromFavorites();
  const isFavoriteQuery = useIsProductFavorite(productId);
  const [isFavorite, setIsFavorite] = useState(isFavoriteQuery);

  const { toast } = useToast();

  // Update local state when the query result changes
  useState(() => {
    setIsFavorite(isFavoriteQuery);
  });

  const handleToggleFavorite = async () => {
    const operation = isFavorite ? removeFromFavorites : addToFavorites;
    const successMessage = isFavorite
      ? "Product removed from favorites"
      : "Product added to favorites";

    await operation(
      { productId },
      {
        onSuccess: (response) => {
          if (response && response.success) {
            console.log(successMessage);
            setIsFavorite(!isFavorite); // Toggle the favorite state
          }

          toast({
            variant: "default",
            title: `${successMessage}`,
          });
        },
        onError: (error) => {
          console.error(
            `Error ${isFavorite ? "removing from" : "adding to"} favorites:`,
            error
          );
        },
      }
    );
  };

  return (
    <Button
      onClick={handleToggleFavorite}
      variant="outline"
      size="icon"
      className="rounded-full border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
      type="button"
      disabled={addingFav || removingFav}
    >
      {addingFav || removingFav ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
      ) : isFavorite ? (
        <Heart className="h-4 w-4 text-red-500" fill="red" />
      ) : (
        <Heart className="h-4 w-4 text-gray-500" />
      )}
      <span className="sr-only">
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </span>
    </Button>
  );
};

export default AddToFavoriteButton;
