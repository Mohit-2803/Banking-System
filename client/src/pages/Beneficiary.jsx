/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Assuming Sidebar component path
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/scrollbar.css";

const BeneficiaryList = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch beneficiaries from your API
    const fetchBeneficiaries = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get(
          `http://localhost:5000/api/beneficiary/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBeneficiaries(response.data.data);
      } catch (error) {
        console.error("Error fetching beneficiaries:", error);
        // Handle error as needed (show error message, retry logic, etc.)
      }
    };

    fetchBeneficiaries();
  }, [navigate, userId]);

  const handleTransfer = (beneficiary) => {
    function removeSpaces(str) {
      return str.replace(/\s/g, "");
    }
    const accountNum = removeSpaces(beneficiary.accountNumber);
    navigate(`/fundTransfer`, { state: { accountNum: accountNum } });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg my-10 pb-10 mt-16 relative">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
          Beneficiary List
        </h2>
        <div className="h-[400px] pr-4 custom-scrollbar">
          {Array.isArray(beneficiaries) && beneficiaries.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {beneficiaries.map((beneficiary) => (
                <li
                  key={beneficiary.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-gray-800">
                      {beneficiary.name}{" "}
                      <span className="text-gray-500 ml-2">
                        {beneficiary.accountNumber}
                      </span>
                    </p>
                    <p className="text-gray-500">Quick Transfer</p>
                  </div>
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out"
                    onClick={() => handleTransfer(beneficiary)}
                  >
                    Transfer
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center pl-4">
              No beneficiaries found. Kindly add one
            </p>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-white">
          <Link
            to="/beneficiary/addBeneficiary"
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300 ease-in-out inline-block"
          >
            Add Beneficiary
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryList;
