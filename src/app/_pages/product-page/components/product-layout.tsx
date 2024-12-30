import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

const ProductLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home & Garden",
    "Toys",
    "Sports",
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
  };

  const handleCreateProduct = () => {
    navigate("/products/create");
  };

  const productListVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={productListVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto p-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full md:w-1/3"
        />

        <div className="flex gap-4 items-center flex-1 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Category: {categoryFilter || "All"}{" "}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => handleCategoryChange("")}>
                All
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Create Product Button */}
          {location.pathname === "/products" && (
            <Button onClick={handleCreateProduct}>Create Product</Button>
          )}
        </div>
      </div>

      {/* Outlet for Child Routes */}
      <Outlet context={{ searchQuery, categoryFilter }} />
    </motion.div>
  );
};

export default ProductLayout;
