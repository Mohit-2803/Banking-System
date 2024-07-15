/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const AddAccount = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("Checking");
  const [initialDeposit, setInitialDeposit] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state) {
      // Redirect back to register if email is not provided
      navigate("/signup");
    } else if (location.state.email || location.state.emailNotVerified) {
      toast.info("Kindly complete your account creation process");
    } else {
      toast.success("Email Confirmed Succesfully");
    }
  }, [location, navigate]);

  const { userId } = location.state || {};
  const { email } = location.state || {};

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (value.length > 12) {
      value = value.slice(0, 12); // Limit to 12 digits
    }
    setAccountNumber(value);
  };

  const formatAccountNumber = (value) => {
    return value.replace(/(\d{4})(?=\d)/g, "$1 "); // Add a space after every 4 digits
  };

  const handleDepositChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-digit characters
    setInitialDeposit(value);
  };

  const validateForm = () => {
    let valid = true;
    const unformattedAccountNumber = accountNumber.replace(/\s/g, "");

    if (!unformattedAccountNumber) {
      toast.error("Account Number is required");
      valid = false;
    } else if (!/^\d+$/.test(unformattedAccountNumber)) {
      toast.error("Account Number must be a valid number");
      valid = false;
    } else if (unformattedAccountNumber.length < 12) {
      toast.error("Account Number must be at least 12 digits");
      valid = false;
    }

    if (!initialDeposit || initialDeposit <= 0) {
      toast.error("Initial Deposit must be a positive number");
      valid = false;
    } else if (initialDeposit < 500) {
      toast.error("Initial Deposit must be at least ₹500");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post("http://localhost:5000/api/auth/add-account", {
          userId,
          email,
          accountNumber,
          accountType,
          initialDeposit,
        });
        toast.success("Account added successfully!");
        if (userId) {
          navigate("/login", { state: { userId: userId } });
          window.history.replaceState({}, "");
        } else {
          navigate("/login", { state: { email: email } });
          window.history.replaceState({}, "");
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data.message === "Account Number already exists"
        ) {
          toast.error("Wrong Account Number");
        } else {
          toast.error("Account creation failed, please try again later.");
        }
        console.error(error);
      }

      // Reset form fields after submission
      setAccountNumber("");
      setAccountType("Checking");
      setInitialDeposit("");
    }
  };

  return (
    <div>
      <ToastContainer /> {/* ToastContainer at the root level of AddAccount */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-400 w-full flex items-center justify-center pt-11 pb-11">
        <div className="w-full max-w-md px-5">
          <h2 className="text-3xl font-semibold text-center text-white mb-6">
            Add New Account
          </h2>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="accountNumber"
                >
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  value={formatAccountNumber(accountNumber)}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength="16" // Considering spaces, the max length is 16
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="accountType"
                >
                  Account Type
                </label>
                <select
                  id="accountType"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Checking">Checking</option>
                  <option value="Savings">Savings</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
              <div className="mb-4 relative">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="initialDeposit"
                >
                  Initial Deposit
                </label>
                <div className="flex gap-4 items-center">
                  <span className="absolute px-4 py-2 border rounded-lg border-r-0 bg-gray-200">
                    ₹
                  </span>
                  <input
                    type="text"
                    id="initialDeposit"
                    value={initialDeposit}
                    onChange={handleDepositChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                Add Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccount;
