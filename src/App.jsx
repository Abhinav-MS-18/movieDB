import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./SignIn"; // Make sure this path is correct
import Movies from "./Movies"; // Make sure this path is correct
import Signup from "./Signup"; // Make sure this path is correct
import Navbar from "./Navbar"; // Navbar component
import Filter from "./Filter"; // New Filter component
import Watchlist from "./Watchlist";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    // Check if the user is logged in by checking localStorage
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user); // Set to true if user data is found, otherwise false
  }, []); // Run only once when component mounts

  return (
    <Router>
      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}{" "}
      {/* Conditionally render Navbar if logged in */}
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/filter" element={<Filter />} /> {/* New Filter route */}
        <Route path="/watchlist" element={<Watchlist />} />
        <Route
          path="/signin"
          element={<SignIn setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
