import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { UseGetCurrentUser } from "../api/use-current-user";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const UserButton = () => {
  const { signOut } = useAuthActions();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = UseGetCurrentUser();

  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const userNameTextIcon = user?.name?.charAt(0)?.toUpperCase() || "?";

  const handleSignOut = async () => {
    setIsLoading(true);
    setError("");

    await signOut()
      .then(() => {
        navigate("/auth");
        console.log(location.pathname);

        toast({
          variant: "default",
          title: "Signed Out Successfully",
        });
      })
      .catch((err) => {
        toast({
          variant: "default",
          title: "Somethings went wrong ",
        });
        setError("Failed to sign out. Please try again.");
        console.error("Sign Out Error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="size-9 rounded-full hover:bg-none bg-none"
          variant={"ghost"}
        >
          <Avatar className="size-9 flex justify-center items-center">
            {user?.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : (
              <AvatarFallback className="size-9 font-bold border border-black bg-pink-500/70 hover:bg-pink-800/70 text-black rounded-full">
                {userNameTextIcon}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        className="w-60 mt-2 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-md"
      >
        <DropdownMenuItem className="cursor-default px-3 py-2">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {user?.name ? user.name : "Guest User"}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email || "No email provided"}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button type="button" variant={"ghost"} asChild>
            <Link to="/user-profile">Edit Profile</Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={handleSignOut}
          className="hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 px-3 py-2"
        >
          <div className="flex items-center gap-1 text-gray-900 dark:text-gray-100">
            <LogOut className="w-4 h-4 text-gray-500 dark:text-gray-400" /> Sign
            Out
            {loading && (
              <Loader2 className="w-4 h-4 animate-spin text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </DropdownMenuItem>
        {error && (
          <DropdownMenuItem className="text-xs text-red-500 hover:bg-transparent cursor-default px-3 py-2">
            {error}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
