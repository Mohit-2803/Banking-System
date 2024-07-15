/* eslint-disable react/no-unescaped-entities */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar"; // Assuming Sidebar component path
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Success = () => {
  useEffect(() => {
    toast.success("Transaction successful!"); // Display a success toast
  }, []); // Run this effect only once when component mounts

  return (
    <div className="flex">
      <Sidebar /> {/* Include your Sidebar component here */}
      <div className="flex-1 h-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-2xl text-center my-10 pb-10 mt-28">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-green-600 text-4xl mb-4"
        />
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Transaction Successful!
        </h2>
        <p className="text-gray-700 mb-4">
          Your payment has been successfully processed and the amount has been
          transferred to the recipient's account. You will receive an email
          confirmation shortly with the transaction details.
        </p>
        <div className="mt-4">
          <Link
            to="/home"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Return to Home
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Success;
