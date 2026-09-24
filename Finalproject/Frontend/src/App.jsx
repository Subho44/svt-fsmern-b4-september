import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Register from "./components/Register";
import Addcourse from "./components/Addcourse";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Viewcourse from "./components/Viewcourse";
import Verifyotp from "./components/Verifyotp";
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/Chatbot";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<Verifyotp />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About message="welcome this edulearn platform" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Viewcourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view"
          element={
            <ProtectedRoute>
              <Viewcourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute adminOnly={true}>
              <Addcourse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
