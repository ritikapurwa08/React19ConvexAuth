import { useOutletContext } from "react-router-dom";
import ProductCard from "./product-card";
import { UseGetAllProducts } from "../api/get-all-products";

interface ProductContextType {
  searchQuery: string;
  categoryFilter: string;
}

const ProductPage = () => {
  const { results: products } = UseGetAllProducts();
  const { searchQuery, categoryFilter } =
    useOutletContext<ProductContextType>();

  if (!products) {
    return <div>Loading ......</div>;
  }

  const filteredProducts = products.filter((product) => {
    const searchMatch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch =
      !categoryFilter || product.category === categoryFilter;
    return searchMatch && categoryMatch;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map((product) => (
        <ProductCard showModification={false} key={product._id} {...product} />
      ))}
    </div>
  );
};

export default ProductPage;
