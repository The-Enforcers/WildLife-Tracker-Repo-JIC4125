import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userParam = params.get("user");
    if (userParam) {
      const user = JSON.parse(decodeURIComponent(userParam));
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement your email/password login logic here
  };

  const handleGoogleLogin = () => {
    window.open("https://localhost:5001/auth/google", "_self");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit}>{/* Form fields */}</form>

        <button
          className="w-full bg-red-500 text-white rounded-md py-2 px-4 mt-4 hover:bg-red-600"
          onClick={handleGoogleLogin}
        >
          Login with Google
        </button>

        <button
          className="mt-4 text-sm text-blue-500 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Need an account? Sign up"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
