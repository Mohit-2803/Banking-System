/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const TransactionVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.state) {
      // Redirect back to register if email is not provided
      navigate("/fundTransfer");
    }

    const forToast = () => {
      toast.success("OTP sent to your email successfully");
    };
    forToast();
  }, [location, navigate]);

  const { userId, recipientAccountNumber, amount, description } =
    location.state || {};

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (otp === "") {
        toast.error("Please enter the OTP");
      }

      // Verify OTP for the first step
      const response = await axios.post(
        "http://localhost:5000/api/transactions/OTPverifyTransaction",
        {
          userId,
          passcode: otp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success for the first step
      toast.info("Please wait for a moment");

      // Proceed with the second step of transaction verification
      const secondResponse = await axios.post(
        "http://localhost:5000/api/transactions/createTransaction",
        {
          userId,
          recipientAccountNumber,
          amount,
          description,
          type: "transfer",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle success for the second step
      toast.success("Transaction verified successfully");
      window.history.replaceState({}, "");
      // Navigate to another page or perform additional actions if needed
      navigate("/successful");
    } catch (error) {
      // Handle errors for both steps
      console.error("Error verifying OTP or transaction:", error);
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gradient-to-r from-blue-100 to-purple-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-hidden flex justify-center items-center">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg w-full">
          <h1 className="text-3xl font-semibold mb-6 text-center text-blue-700">
            Transaction Verification
          </h1>
          <div className="space-y-4 mb-8 text-center">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">
                <strong>Sender ID:</strong> {userId}
              </span>
            </div>
            <div className="flex flex-col space-y-4 items-center">
              <label className="text-gray-700 text-lg font-bold">
                Enter the OTP here
              </label>
              <input
                type="text"
                className="p-2 border w-60 border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className="w-60 bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 mt-4"
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Verifying...</span>
                  </span>
                ) : (
                  <span>Verify OTP</span>
                )}
              </button>
            </div>
          </div>
          <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
            <div className="text-sm text-gray-500">
              For your security, please do not share the OTP with anyone. The
              OTP is valid for a limited time only. If you did not request this
              OTP, please contact our customer service immediately.
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default TransactionVerification;
