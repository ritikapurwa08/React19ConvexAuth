import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/custom/app-components/navbar/navbar";
import ProductLayout from "./_pages/product-page/components/product-layout";
import ProductPage from "./_pages/product-page/components/product-list";
import AuthPage from "./_pages/auth-page/components/auth-page";
import CreateProductPage from "./_pages/product-page/components/create-product-page";
import FavoritePage from "./_pages/favorites-page/components";
import HomePage from "./_pages/home-page/comonents/home-page";
import CartPage from "./_pages/cart-page/components/cart-page";
import { useConvexAuth } from "convex/react";
import UserProfilePage from "./_pages/user-page/components/user-profile-page";
import { Toaster } from "./components/ui/toaster";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl">Loading...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children;
};

const App = () => {
  const { isLoading } = useConvexAuth();

  return (
    <>
      <Navbar />

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-4xl">Loading...</h1>
        </div>
      ) : (
        <main>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProductPage />} />
            </Route>
            <Route
              path="/products/create"
              element={
                <ProtectedRoute>
                  <CreateProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-profile"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<div>Page not found</div>} />
          </Routes>
          <Toaster />
        </main>
      )}
    </>
  );
};

export default App;
