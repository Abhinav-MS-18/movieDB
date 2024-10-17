import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const Navbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get user data from localStorage

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user from localStorage
    setIsLoggedIn(false); // Update login state in App component
    navigate("/signin"); // Redirect to the Sign In page after logout
  };

  return (
    <nav className="bg-gray-900 text-white py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Center-aligned buttons */}
        <div className="flex space-x-8 text-lg justify-center w-full">
          <button
            className="px-4 py-2 hover:bg-gray-700 rounded"
            onClick={() => navigate("/")}
          >
            Home
          </button>
          <button
            className="px-4 py-2 hover:bg-gray-700 rounded"
            onClick={() => navigate("/filter")}
          >
            Filter
          </button>
          <button
            className="px-4 py-2 hover:bg-gray-700 rounded"
            onClick={() => navigate("/watchlist")}
          >
            My Watchlist
          </button>
          <button
            className="px-4 py-2 hover:bg-gray-700 rounded"
            onClick={() => navigate("/analysis")}
          >
            Analysis
          </button>
          <button
            className="px-4 py-2 hover:bg-gray-700 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Right-aligned user avatar and name */}
        <div className="flex items-center space-x-5 ml-auto">
          <Avatar className="size-16">
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
          <span className="text-xl">{user?.name.charAt(0).toUpperCase() + user.name.slice(1)}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
