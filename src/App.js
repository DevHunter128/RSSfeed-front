import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import Signin from "./pages/Signin/index.js";
import Signup from "./pages/signup";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ForceRedirect from "./components/ForceRedirect";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import ScrollButton from './components/ScrollButton';


function App() {
  const [isConnected, setIsconnected] = useState(false);
  const checkUserToken = () => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user-token"));
      if (user) {
        setIsconnected(true);
      } else {
        setIsconnected(false);
      }
    }
  };
  useEffect(() => {
    checkUserToken();
  }, [isConnected]);

  const Logout = () => {
    if (localStorage.getItem("user-token")) {
      localStorage.clear();
      setIsconnected(false);
    }
  };

  return (
    <BrowserRouter>
      <Header Logout={Logout} />
      <Routes>
        <Route
          path="/signin"
          element={
            <ForceRedirect user={isConnected}>
              <Signin />
            </ForceRedirect>
          }
        />
        <Route
          path="/signup"
          element={
            <ForceRedirect user={isConnected}>
              <Signup />
            </ForceRedirect>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={isConnected}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute user={isConnected}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      <ScrollButton/>
    </BrowserRouter>
  );
}

export default App;
