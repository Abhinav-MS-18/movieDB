import React from "react";
import {
  Menubar,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
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
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger onClick={() => navigate("/")}>Home</MenubarTrigger>
          <MenubarTrigger onClick={() => navigate("/movies")}>Movies</MenubarTrigger>
          <MenubarTrigger onClick={() => navigate("/filter")}>Filter</MenubarTrigger>
          <MenubarTrigger onClick={() => navigate("/watchlist")}>My Watchlist</MenubarTrigger>
          
          <MenubarSeparator />

          {/* Logout Button */}
          <MenubarTrigger onClick={handleLogout}>Logout</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </>
  );
};

export default Navbar;
