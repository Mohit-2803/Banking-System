import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faDollarSign,
  faKey,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../context/UserContext";

function Home() {
  const navigate = useNavigate();
  const { userId } = useContext(UserContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
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
          setUserData(response.data.data); // Assuming response.data.data contains user details
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Handle error state or navigate to an error page
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  // Check if userData is null before rendering
  if (!userData) {
    return null; // Or render a loading indicator
  }

  // Format the createdAt and updatedAt dates
  const formattedCreatedAt = new Date(
    userData.user.passwordCreatedAt
  ).toLocaleString();
  const formattedUpdatedAt = new Date(
    userData.user.passwordUpdatedAt
  ).toLocaleString();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col md:flex-row ">
        {/* Left Section */}
        <div className="flex-1 p-6 bg-blue-50">
          <div className="bg-white shadow-md p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-3 text-blue-500" />
              {userId}
            </h2>
            <div className="mt-4">
              <p>Account Number: {userData.accountInfo.accountNumber}</p>
              <p>Account Type: {userData.accountInfo.accountType}</p>
            </div>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Account Details</h3>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2 text-left">Account Number</th>
                  <th className="border px-4 py-2 text-left">Account Type</th>
                  <th className="border px-4 py-2 text-left">
                    Effective Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">
                    {userData.accountInfo.accountNumber}
                  </td>
                  <td className="border px-4 py-2">
                    {userData.accountInfo.accountType}
                  </td>
                  <td className="border px-4 py-2">
                    Rs {userData.accountInfo.balance}
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
        {/* Right Section */}
        <div className="flex-1 p-6 bg-blue-50">
          <div className="bg-white shadow-md p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <FontAwesomeIcon
                icon={faDollarSign}
                className="mr-3 text-green-500"
              />
              Balance: Rs {userData.accountInfo.balance}
            </h2>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg mb-3">
            <h3 className="text-lg font-semibold flex items-center">
              <FontAwesomeIcon icon={faKey} className="mr-3 text-yellow-500" />
              Password Details
            </h3>
            <p>Created At: {formattedCreatedAt}</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <FontAwesomeIcon icon={faKey} className="mr-3 text-yellow-500" />
              Updated Password At
            </h3>
            <p>Updated Password At: {formattedUpdatedAt}</p>
          </div>
          <div className="bg-white shadow-md p-2 rounded-lg mt-4 flex items-center pl-5">
            <FontAwesomeIcon icon={faInfo} className="mr-3 text-green-500" />
            <p className="text-blue-600">
              Change your password frequently and safeguard your digital
              transactions to prevent cyber crimes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
