import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BrowseStartups from "./pages/BrowseStartups";
import CreateStartup from "./pages/CreateStartup";
import MyStartup from "./pages/MyStartup";
import StartupDashboard from "./pages/StartupDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import StartupDetails from "./pages/StartupDetails";
import Messages from "./pages/Messages";
import About from "./pages/About";
import Investors from "./pages/Investors";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseStartups />} />
        <Route path="/startup/:id" element={<StartupDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/investors" element={<Investors />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Investor Routes */}
        <Route
          path="/investor-dashboard"
          element={
            <ProtectedRoute role="Investor">
              <InvestorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Startup Founder Routes */}
        <Route
          path="/create"
          element={
            <ProtectedRoute role="Startup">
              <CreateStartup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-startup"
          element={
            <ProtectedRoute role="Startup">
              <MyStartup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/startup-dashboard"
          element={
            <ProtectedRoute role="Startup">
              <StartupDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Messaging Hub - Founder & Investor */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute roles={["Startup", "Investor"]}>
              <Messages />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;