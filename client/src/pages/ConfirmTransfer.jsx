import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ConfirmTransfer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { userId, recipientAccountNumber, amount, description, accountNumber } =
    location.state;

  const handleConfirmTransfer = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      } else {
        const resposne = await axios.post(
          "http://localhost:5000/api/transactions/verifyTransaction",
          { userId, amount }
        );

        if (resposne.data.message === "Verification code sent") {
          toast.success("Verification code sent");
          navigate("/confirmTransaction", {
            state: {
              userId,
              recipientAccountNumber,
              amount,
              description,
              accountNumber,
            },
          });
        }
      }
    } catch (error) {
      console.error("Failed to confirm transfer:", error);
      toast.error("Server error occurred, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTransfer = () => {
    navigate("/fundTransfer"); // Redirect back to fund transfer page if user cancels
  };

  // Format current date and time for display
  const currentDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6 overflow-hidden pt-16">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Confirm Transfer Details
          </h1>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">
                <strong>Transaction Type:</strong> Quick Transfer
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">
                <strong>Sender ID:</strong> {userId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">
                <strong>Account Number:</strong> {accountNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">
                <strong>Frequency Type:</strong> One Time
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">
                <strong>Date:</strong> {currentDate}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">
                <strong>Time:</strong> {currentTime}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">
                <strong>Beneficiary Account Number:</strong>{" "}
                {recipientAccountNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">
                <strong>Amount:</strong> Rs {amount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-lg">
                <strong>Description:</strong> {description}
              </span>
            </div>
          </div>
          <div className="flex justify-between gap-10">
            <button
              className="w-1/3 bg-gray-300 text-gray-700 py-2 rounded-lg shadow-md hover:bg-gray-400 transition duration-300 flex items-center justify-center space-x-2"
              onClick={handleCancelTransfer}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Cancel</span>
            </button>
            <button
              className="w-2/3 bg-green-500 text-white py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-300 flex items-center justify-center space-x-2"
              onClick={handleConfirmTransfer}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Processing...</span>
                </span>
              ) : (
                <>
                  <FontAwesomeIcon icon={faArrowRight} />
                  <span>Confirm Transfer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ConfirmTransfer;
