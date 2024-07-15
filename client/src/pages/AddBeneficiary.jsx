/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Sidebar from "../components/Sidebar"; // Assuming Sidebar component path
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faInfoCircle,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons"; // Added faArrowLeft icon
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom"; // Imported Link and useNavigate
import axios from "axios";

const AddBeneficiary = () => {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    userId: "",
  });

  useEffect(() => {
    if (userId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userId: userId,
      }));
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate and format account number to allow only numbers and add spaces
    if (name === "accountNumber") {
      // Restrict to maximum 12 digits and allow only numbers
      const formattedValue = value.replace(/\D/g, "").slice(0, 12);
      const formattedWithSpaces = formattedValue.replace(
        /(\d{4})(?=\d)/g,
        "$1 "
      );

      setFormData({
        ...formData,
        [name]: formattedWithSpaces,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name === "") {
      toast.error("Please enter a name");
      return;
    } else if (formData.accountNumber.length !== 14) {
      toast.error("Please enter a valid account number.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/beneficiary/addBeneficiary",
        formData
      );

      toast.success("Beneficiary added successfully!"); // Example success message
      // Optionally reset form after submission
      setFormData({
        name: "",
        accountNumber: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar /> {/* Include your Sidebar component here */}
      <div className="flex-1 h-full max-w-lg mx-auto p-4 bg-white rounded-lg shadow-lg text-center my-10 pb-6 mt-16 relative">
        <Link
          to="/beneficiary"
          className="absolute top-4 left-4 text-blue-600 text-2xl"
        >
          {" "}
          {/* Adjust the path as needed */}
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <FontAwesomeIcon
          icon={faUserPlus}
          className="text-blue-600 text-3xl mb-2"
        />
        <h2 className="text-2xl font-bold text-blue-600 mb-2">
          Add Beneficiary
        </h2>
        <form onSubmit={handleSubmit} className="mt-8 text-left">
          <div className="mb-3">
            <label
              htmlFor="name"
              className="block text-gray-700 text-base font-semibold mb-1"
            >
              Beneficiary Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter beneficiary's name"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="accountNumber"
              className="block text-gray-700 text-base font-semibold mb-1"
            >
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              placeholder="Enter beneficiary's account number"
              maxLength={16} // Adjusted for extra spaces added by formatting
            />
          </div>
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out"
            >
              Add Beneficiary
            </button>
          </div>
          <div className="mt-9 text-left">
            <p className="text-gray-600 text-sm flex items-center gap-2 font-semibold">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="text-blue-600 text-base mb-4"
              />
              Please ensure that the account number is correct before adding the
              beneficiary.
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddBeneficiary;
