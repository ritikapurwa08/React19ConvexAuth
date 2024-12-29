import { Route, Routes } from "react-router-dom";
import Navbar from "./components/custom/app-components/navbar/navbar";
import ProductLayout from "./_pages/product-page/components/product-layout";
import ProductPage from "./_pages/product-page/components/product-list";
import AuthPage from "./_pages/auth-page/components/auth-page";
import CreateProductPage from "./_pages/product-page/components/create-product-page";
import FavoritePage from "./_pages/favorites-page/components";

const HomePage = () => {
  return (
    <div className="p-4 bg-green-100">
      <h1>Home Page Content</h1>
      <p>This is the home page, rendered at the "/" path.</p>
    </div>
  );
};

const CartPage = () => {
  return (
    <div className="p-4 bg-yellow-100">
      <h1>Cart Page Content</h1>
      <p>This is the cart page, rendered at the "/cart" path.</p>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductLayout />}>
          <Route index element={<ProductPage />} />
        </Route>
        <Route path="/products/create" element={<CreateProductPage />} />
        <Route path="/favorites" element={<FavoritePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={null} />
      </Routes>
    </>
  );
};

export default App;
