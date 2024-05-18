import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Leaderboard from "./pages/Leaderboard";
import { Toaster } from "react-hot-toast";
import { useContext, useEffect } from "react";
import axios from "axios";
import { Context, server } from "./main";
import Header from "./components/Header";
import UpcomingContests from "./pages/UpcomingContests";

import Community from "./pages/Community";
import CodingStats from "./pages/CodingStats";

function App() {
  const { setUser, setIsAuthenticated} = useContext(Context);

  useEffect(() => {
    axios
      .get(`${server}/users/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(true);
        
      })
      .catch((error) => {
        setUser({});
        setIsAuthenticated(false);
        
      });
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/upcomingcontests" element={<UpcomingContests />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/community" element={<Community />} />
        <Route path="/codingstats" element={<CodingStats />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
