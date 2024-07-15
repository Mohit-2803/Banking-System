/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
// pages/EnterPasscode.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state || !location.state.email) {
      // Redirect back to register if email is not provided
      navigate("/signup");
    } else if (location.state.notVerified) {
      toast.info("Please verify your email, check your email for passcode");
    } else {
      toast.success("Passcode sent successfully. Please check your email.");
    }
  }, [location, navigate]);

  const { email } = location.state || {};
  const { userId } = location.state || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!data.passcode) {
      toast.error("Please enter the passcode");
    }

    const { passcode } = data;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify",
        {
          email,
          passcode,
        }
      );
      toast.success("Verification successful!");

      if (response.data.error === "Account is not created") {
        if (userId) {
          navigate("/addAccount", { state: { userId: userId } });
          window.history.replaceState({}, "");
        } else {
          navigate("/addAccount", { state: { email: email } });
          window.history.replaceState({}, "");
        }
      } else {
        navigate("/login", { state: { isVerified: true } });
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid verification code. Please try again.");
    }
  };

  const handleResendPasscode = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/resend-passcode", {
        email,
      });
      toast.success("Passcode resent!");
    } catch (error) {
      console.error(error);
      toast.error("Error resending passcode. Please try again.");
    }
  };

  if (!email) {
    return null; // Render nothing if email is not available
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 mb-10">
      <h2 className="text-3xl font-semibold text-center mb-8 text-blue-600">
        Enter Passcode
      </h2>
      <p className="text-gray-700 text-center mb-6">
        We have sent a passcode to your email. Please enter it below to verify
        your email address.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-field">
          <label htmlFor="passcode" className="block text-gray-700 mb-2">
            Passcode
          </label>
          <input
            type="text"
            id="passcode"
            {...register("passcode", { required: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.passcode && (
            <span className="text-red-500 text-sm">Passcode is required</span>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
        >
          Verify
        </button>
      </form>
      <div className="text-center mt-6">
        <p className="text-gray-700">
          Didn't receive the passcode?{" "}
          <button
            onClick={handleResendPasscode}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            Resend it
          </button>
          .
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ConfirmEmail;
