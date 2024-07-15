/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoanApply = () => {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const loanType = formData.get("loanType");
    const loanAmount = formData.get("loanAmount");
    const purpose = formData.get("purpose");

    if (!loanType || loanType === "") {
      toast.error("Please select a Loan Type");
      return;
    }
    if (!loanAmount || loanAmount <= 0) {
      toast.error("Please enter a valid Loan Amount");
      return;
    }
    if (loanAmount > 1000000) {
      toast.error("Loan Amount should not be greater than ₹1000000");
      return;
    }
    if (loanAmount < 100000) {
      toast.error("Loan Amount should not be less than ₹100000");
      return;
    }
    if (!purpose) {
      toast.error("Please enter the Purpose of Loan");
      return;
    }
    if (purpose.length < 50) {
      toast.error("Purpose should be atleast 50 characters long");
      return;
    }

    // If all validations pass, submit the form (you can replace this with your actual form submission logic)
    try {
      const response = await axios.post(
        "http://localhost:5000/api/loans/createLoan",
        {
          userId,
          loanAmount,
          loanType,
          purpose,
        }
      );

      navigate("/loans/loanSubmitted");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gradient-to-r from-blue-800 to-blue-300 flex items-center justify-center">
        <div className="w-full max-w-5xl px-5">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-center text-2xl font-semibold mb-6">
              Apply for a Loan
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="loanType"
                  className="block text-md font-medium text-gray-700 mb-2"
                >
                  Loan Type
                </label>
                <select
                  id="loanType"
                  name="loanType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a Loan Type
                  </option>
                  <option value="personal">Personal Loan</option>
                  <option value="home">Home Loan</option>
                  <option value="business">Business Loan</option>
                </select>
              </div>

              <div className="mb-6 relative">
                <label
                  htmlFor="loanAmount"
                  className="block text-md font-medium text-gray-700 mb-2"
                >
                  Loan Amount (INR)
                </label>
                <div className="flex">
                  <span className="absolute left-4 top-10 text-gray-700 text-lg font-medium">
                    ₹
                  </span>
                  <input
                    type="number"
                    id="loanAmount"
                    name="loanAmount"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="purpose"
                  className="block text-md font-medium text-gray-700 mb-2"
                >
                  Purpose of Loan
                </label>
                <textarea
                  id="purpose"
                  name="purpose"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoanApply;
