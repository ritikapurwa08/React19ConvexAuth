import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserButton from "@/_pages/user-page/components/userButton";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Conditionally render the navbar
  if (location.pathname === "/auth") {
    return null;
  }

  return (
    <nav className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo/Home Link */}
        <NavLink
          to="/"
          className="text-2xl font-bold transition-colors hover:text-gray-300"
        >
          Brand
        </NavLink>

        {/* Menu Button for Small Screens */}
        <div className="lg:hidden">
          <Button variant="outline" onClick={toggleMenu}>
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Navigation Links */}
        <div
          className={`lg:flex lg:items-center ${isMenuOpen ? "flex flex-col mt-4 gap-4" : "hidden"} lg:gap-8`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md hover:bg-gray-700 transition-colors ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md hover:bg-gray-700 transition-colors ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md hover:bg-gray-700 transition-colors ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            Favorites
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md hover:bg-gray-700 transition-colors ${
                isActive ? "bg-gray-700" : ""
              }`
            }
          >
            Cart
          </NavLink>
          <div>
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
