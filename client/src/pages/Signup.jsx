/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const { register, handleSubmit } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // Handle form submission
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          userId: data.username,
          email: data.email,
          password: data.password,
        }
      );
      toast.success(
        "Registration successful! Please check your email for the verification code."
      );
      navigate("/verify", {
        state: { email: data.email, userId: data.username },
      });
    } catch (error) {
      if (
        error.response.data.message === "User Email already exists" ||
        error.response.data.message === "User ID already exists"
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server error occured. Please try again later");
      }
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    }
  };

  const validateForm = (data) => {
    let valid = true;
    if (!data.username) {
      toast.error("Username is required");
      valid = false;
    } else if (data.username.length < 5) {
      toast.error("Username must be at least 5 characters");
      valid = false;
    }
    if (!data.email) {
      toast.error("Email is required");
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      toast.error("Invalid email format");
      valid = false;
    }
    if (!data.password) {
      toast.error("Password is required");
      valid = false;
    } else if (data.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      valid = false;
    }
    if (!data.confirmPassword) {
      toast.error("Confirm Password is required");
      valid = false;
    } else if (data.password !== data.confirmPassword) {
      toast.error("Passwords must match");
      valid = false;
    }
    return valid;
  };

  const onSubmitWithValidation = (data) => {
    if (validateForm(data)) {
      onSubmit(data);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-400 w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-5">
        <p
          className="text-4xl text-white text-center mb-10"
          style={{ fontFamily: "Tilt Prism", textShadow: "3px 2px 3px blue" }}
        >
          NetBanking SignUp
        </p>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <form
            onSubmit={handleSubmit(onSubmitWithValidation)}
            className="space-y-4"
          >
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2"
              >
                UserId
              </label>
              <input
                type="text"
                id="username"
                {...register("username")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Signup
            </button>

            <div className="text-center">
              Already have an account?
              <Link
                to="/login"
                className="ml-3 inline-block mt-2"
                style={{
                  color: "#3182ce",
                  fontWeight: "bold",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
              >
                Login here.
              </Link>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
