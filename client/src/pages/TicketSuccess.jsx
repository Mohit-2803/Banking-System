/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faClipboard } from "@fortawesome/free-solid-svg-icons"; // Import clipboard icon
import Sidebar from "../components/Sidebar"; // Assuming Sidebar component path

const TicketSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state || !location.state.ticketId) {
      navigate("/contact");
    } else {
      window.history.replaceState({}, "");
    }
  }, [location, navigate]);

  const { ticketId } = location.state || {};

  // State to manage copy success message
  const [copySuccess, setCopySuccess] = useState(false);

  // Function to copy the Ticket ID to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(ticketId);
    setCopySuccess(true);
  };

  return (
    <div className="flex">
      <Sidebar /> {/* Include your Sidebar component here */}
      <div className="flex-1 h-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-2xl text-center my-10 pb-10 mt-16">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-green-600 text-4xl mb-4"
        />
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          Ticket Successfully Raised!
        </h2>
        <p className="text-gray-700 mb-6">
          Your ticket has been successfully submitted. Our support team will
          review your request and respond shortly.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
          <p className="text-lg font-semibold">
            Ticket ID: <span className="text-blue-700">{ticketId}</span>
          </p>
          <button
            onClick={copyToClipboard}
            className="text-blue-500 hover:text-blue-700 ml-2 focus:outline-none"
          >
            <FontAwesomeIcon icon={faClipboard} className="text-base" />
          </button>
          {copySuccess && <span className="text-green-600 ml-2">Copied!</span>}
        </div>
        <div className="mt-6">
          <Link
            to="/home"
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketSuccess;
