import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Navbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user from localStorage
    setIsLoggedIn(false); // Update login state in App component
    navigate("/signin"); // Redirect to the Sign In page after logout
  };

  return (
    <>
      <nav className="bg-gray-900 text-white py-4">
        <div className="container mx-auto flex justify-center space-x-8 text-lg">
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
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
