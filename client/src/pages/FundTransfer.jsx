/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSheetPlastic,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";

const FundTransfer = () => {
  const location = useLocation();
  const [balance, setBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const navigate = useNavigate();
  const { userId } = useContext(UserContext);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
        } else {
          if (location.state && location.state.accountNum) {
            setAccountNumber(location.state.accountNum);
            reset({
              recipientAccount: location.state.accountNum,
              confirmRecipientAccount: location.state.accountNum,
              amount: "",
              description: "",
            });
          } else {
            reset({
              recipientAccount: "",
              confirmRecipientAccount: "",
              amount: "",
              description: "",
            });
          }

          if (userId) {
            const response = await axios.get(
              `http://localhost:5000/api/users/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const { user, accountInfo } = response.data.data;
            setBalance(accountInfo.balance);
            setAccountNumber(accountInfo.accountNumber);
          }
        }
      } catch (error) {
        console.error("Failed to fetch account data:", error);
      }
    };

    fetchAccountData();
  }, [location.state, navigate, reset, userId]);

  const handleTransfer = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      } else {
        if (validateForm(formData)) {
          navigate("/confirmTransfer", {
            state: {
              userId,
              recipientAccountNumber: formData.recipientAccount,
              amount: formData.amount,
              description: formData.description,
              accountNumber,
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to transfer funds:", error);
      toast.error(error.response.data.error);
    }
  };

  const currentDate = format(new Date(), "yyyy-MM-dd'T'HH:mm", {
    timeZone: "Asia/Kolkata",
  });

  const validateForm = (formData) => {
    let valid = true;

    // Validate recipient account number
    if (!formData.recipientAccount) {
      toast.error("Please enter a recipient account number.");
      valid = false;
      return valid;
    } else if (formData.recipientAccount.length !== 12) {
      toast.error("Invalid account number");
      valid = false;
      return valid;
    } else if (formData.confirmRecipientAccount === accountNumber) {
      toast.error("You cannot transfer to your own account");
      valid = false;
      return valid;
    } else if (formData.confirmRecipientAccount === "") {
      toast.error("Please confirm the beneficiary account number");
      valid = false;
      return valid;
    } else if (formData.recipientAccount !== formData.confirmRecipientAccount) {
      toast.error("Beneficiary account numbers do not match");
      valid = false;
      return valid;
    }

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      toast.error("Invalid Amount");
      valid = false;
      return valid;
    } else if (amount > 1000000) {
      toast.error("Amount must not exceed Rs 1,000,000");
      valid = false;
      return valid;
    } else if (amount > balance) {
      toast.error("Insufficient balance");
      valid = false;
      return valid;
    }

    // Validate remark
    if (!formData.description) {
      toast.error("Please enter a description for the transfer.");
      valid = false;
      return valid;
    }

    return valid;
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6 overflow-hidden bg-gradient-to-r from-blue-800 to-blue-300 ">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-2xl overflow-y-auto pb-0">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Quick Transfer
          </h1>
          <div className="flex justify-between mb-6">
            <div className="bg-blue-500 text-white p-3 rounded-lg shadow-md flex items-center space-x-4">
              <FontAwesomeIcon icon={faSheetPlastic} className="text-xl" />
              <div className="flex items-center space-x-4">
                <p className="text-base font-semibold">₹ {balance}</p>
                <p className="text-sm">Balance</p>
              </div>
            </div>
          </div>

          {/* Transfer Details and Amount */}
          <div className="mb-6">
            <form onSubmit={handleSubmit(handleTransfer)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Transaction Date */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="transactionDate"
                  >
                    Transaction Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    id="transactionDate"
                    value={currentDate}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-200"
                  />
                </div>
                {/* Debit Account */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="accountNumber"
                  >
                    Debit Account
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    value={`${userId} (INR) - ${accountNumber}`}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-200"
                  />
                </div>
                {/* Beneficiary Account Number */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="recipientAccount"
                  >
                    Beneficiary Account Number
                  </label>
                  <Controller
                    name="recipientAccount"
                    control={control}
                    defaultValue={
                      location.state && location.state.accountNum
                        ? location.state.accountNum
                        : ""
                    }
                    maxLength="12"
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter account number"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    )}
                  />
                </div>
                {/* Confirm Beneficiary Account Number */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="confirmRecipientAccount"
                  >
                    Confirm Beneficiary Account Number
                  </label>
                  <Controller
                    name="confirmRecipientAccount"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter account number"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    )}
                  />
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="amount"
                  >
                    Amount
                  </label>
                  <div className="relative">
                    <Controller
                      name="amount"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                          placeholder="Enter amount"
                        />
                      )}
                    />
                    <span className="absolute left-3 top-2 text-gray-700 text-lg font-medium">
                      ₹
                    </span>
                  </div>
                </div>
                {/* Description */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="description"
                  >
                    Remark
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <textarea
                        {...field}
                        placeholder="Enter description"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 h-11 resize-none"
                        rows="3"
                      />
                    )}
                  />
                </div>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-60 bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300 flex items-center justify-center space-x-2 align-middle"
              >
                <FontAwesomeIcon icon={faArrowRight} />
                <span>Continue</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FundTransfer;
