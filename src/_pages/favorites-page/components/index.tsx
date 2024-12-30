// Update the path if needed
import ProductCard from "@/_pages/product-page/components/product-card";
import { GetAllFavoriteProducts } from "../hooks/query/get-all-favorite-products";
import { Loader2 } from "lucide-react";

const FavoritePage = () => {
  const { data } = GetAllFavoriteProducts();

  if (data === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Your Favorite Products
        </h1>

        {data?.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 text-lg">
              You don't have any favorite products yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {data?.map((favProduct) => (
              <div key={favProduct?._id}>
                {favProduct ? (
                  <ProductCard key={favProduct._id} {...favProduct} />
                ) : (
                  "What are you doing"
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritePage;
