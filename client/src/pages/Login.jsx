/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
// pages/Login.jsx
import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "../services/axios";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserId, setLastLogin } = useContext(UserContext);

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (location.state?.loggedIn) {
      navigate("/", { replace: true });
    }
    if (location.state?.userId || location.state?.email) {
      toast.success("Account created successfully");

      const timeoutId = setTimeout(() => {
        toast.info("Please login to Internet Banking");
      }, 3000);

      window.history.replaceState({}, "");
      return () => clearTimeout(timeoutId);
    } else if (location.state?.isVerified) {
      toast.success("Email verified successfully");

      const timeoutId = setTimeout(() => {
        toast.info("Please login again to Internet Banking");
      }, 3000);

      window.history.replaceState({}, "");
      return () => clearTimeout(timeoutId);
    }
  }, [location.state, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPin, setShowPin] = useState(false);

  const toggleShowPin = () => {
    setShowPin(!showPin);
  };

  const onSubmit = async (data) => {
    // Handle form submission

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          userId: data.userId,
          password: data.password,
        }
      );
      toast.success("Login successful!");

      if (response.data.error === "Account is not verified") {
        navigate("/verify", {
          state: { email: response.data.email, notVerified: true },
        });
      } else if (response.data.error === "Account is not created") {
        navigate("/addAccount", {
          state: { email: response.data.email, emailNotVerified: true },
        });
      } else if (
        response.status === 200 &&
        response.data.token &&
        response.data.user
      ) {
        const { token, lastLoginAt } = response.data;
        localStorage.setItem("token", token);
        toast.success("Login successful!");
        setUserId(data.userId);
        localStorage.setItem("userId", data.userId); // Store userId in localStorage
        setLastLogin(lastLoginAt);
        localStorage.setItem("lastLogin", lastLoginAt);
        window.history.replaceState({}, "");
        navigate(`/home`, { state: { loggedIn: true }, replace: true });
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || "Login failed";
        toast.error(errorMessage);
      } else {
        toast.error("Network error, please try again later");
      }
      console.error(error);
    }
  };

  const validateForm = (data) => {
    let valid = true;
    if (!data.userId) {
      toast.error("User ID is required");
      valid = false;
    }
    if (!data.password) {
      toast.error("User PIN is required");
      valid = false;
    }
    return valid;
  };

  const onSubmitWithValidation = (data) => {
    if (validateForm(data)) {
      onSubmit(data);
    }
  };

  // Event handler to allow only numeric input
  const handleNumericInput = (e) => {
    const charCode = e.charCode ? e.charCode : e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-400 w-full flex items-center justify-center pt-10 pb-16">
      <div className="w-full max-w-md px-5">
        <p
          className="text-4xl text-white text-center mb-10"
          style={{ fontFamily: "Tilt Prism", textShadow: "3px 2px 3px blue" }}
        >
          Welcome to Premium Bank
        </p>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h5 className="text-center text-2xl font-semibold mb-6">Sign In</h5>
          <form onSubmit={handleSubmit(onSubmitWithValidation)}>
            <div className="mb-4">
              <label
                htmlFor="userId"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                User ID
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="userId"
                placeholder="Enter your User ID"
                {...register("userId", { required: true })}
              />
              {errors.userId && (
                <span className="text-red-500 text-sm">
                  User ID is required
                </span>
              )}
            </div>
            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                User PIN
              </label>

              <div className="flex justify-between items-center relative">
                <input
                  type={showPin ? "text" : "password"}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                  id="password"
                  placeholder="Enter your User PIN"
                  autoComplete="true"
                  onKeyPress={handleNumericInput}
                  {...register("password", { required: true })}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 bottom-2 flex items-center text-sm leading-5 cursor-pointer"
                  onClick={toggleShowPin}
                >
                  <FontAwesomeIcon icon={showPin ? faEyeSlash : faEye} />
                </div>
              </div>

              {errors.password && (
                <span className="text-red-500 text-sm">
                  User PIN is required and must be numeric
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-sm">
                <input
                  className="mr-2 leading-tight"
                  type="checkbox"
                  id="rememberPasswordCheck"
                />
                <span className="text-gray-700">Remember password</span>
              </label>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign in
              </button>
            </div>
            <div className="text-center">
              Don't have an account?
              <Link
                to="/signup"
                className="ml-3 inline-block mt-2"
                style={{
                  color: "#3182ce",
                  fontWeight: "bold",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
