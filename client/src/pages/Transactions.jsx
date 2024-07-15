import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../context/UserContext";
import "../styles/scrollbar.css";

const Transactions = () => {
  const navigate = useNavigate();
  const { userId } = useContext(UserContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        if (userId) {
          const response = await axios.get(
            `http://localhost:5000/api/transactions/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const receivedTransactions = response.data.data.receivedTransactions;
          const sentTransactions = response.data.data.sentTransactions;

          // Combine and sort transactions by date (latest first)
          const allTransactions = [
            ...receivedTransactions,
            ...sentTransactions,
          ].sort((a, b) => new Date(b.date) - new Date(a.date));

          // Add referenceNumber to each transaction (assuming it's in the API response)
          const transactionsWithReference = allTransactions.map(
            (transaction) => ({
              ...transaction,
              referenceNumber: transaction.referenceNumber, // replace with actual field name from API
            })
          );

          setTransactions(transactionsWithReference);
          setLoading(false); // Set loading to false once transactions are fetched
        }
      } catch (error) {
        console.error("Failed to fetch account transactions:", error);
        setLoading(false); // Set loading to false on error
      }
    };

    fetchTransactions();
  }, [navigate, userId]);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const getRowClassName = (type) => {
    return type === "receive" ? "text-green-600" : "text-red-600";
  };

  const getStatusColor = (status) => {
    if (status === "pending") {
      return "text-red-600";
    } else if (status === "successful") {
      return "text-green-600";
    }
    return "";
  };

  return (
    <div className="flex">
      <Sidebar className="sidebar" />
      <div className="flex-1 p-4 md:p-6 bg-blue-50 overflow-hidden bg-gradient-to-r from-blue-400 to-blue-800 ">
        <div className="bg-white shadow-md p-4 md:p-6 rounded-lg h-full overflow-hidden">
          <div className="flex items-center mb-4">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-gray-700 cursor-pointer mr-2"
              onClick={() => navigate("/home")}
            />
            <h2 className="text-xl font-semibold text-blue-700">
              Transactions
            </h2>
          </div>
          {loading ? (
            <p className="text-center text-gray-600">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-600">No transactions found.</p>
          ) : (
            <div className="overflow-x-auto transactions-table">
              <table className="w-full table-auto border-collapse text-gray-700">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-3 md:px-4 py-2 text-left">Date</th>
                    <th className="border px-3 md:px-4 py-2 text-left">Time</th>
                    <th className="border px-3 md:px-4 py-2 text-left">
                      Description
                    </th>
                    <th className="border px-3 md:px-4 py-2 text-left">
                      Amount
                    </th>
                    <th className="border px-3 md:px-4 py-2 text-left">Type</th>
                    <th className="border px-3 md:px-4 py-2 text-left">
                      Account Number
                    </th>
                    <th className="border px-3 md:px-4 py-2 text-left">
                      Reference Number
                    </th>
                    <th className="border px-3 md:px-4 py-2 text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      } hover:bg-gray-200`}
                    >
                      <td className="border px-3 md:px-4 py-2 text-blue-700">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="border px-3 md:px-4 py-2 text-blue-700">
                        {new Date(transaction.date).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="border px-3 md:px-4 py-2">
                        <span
                          title={transaction.description}
                          className="cursor-pointer truncate text-gray-800"
                        >
                          {truncateText(transaction.description, 40)}
                        </span>
                      </td>
                      <td
                        className={`border px-3 md:px-4 py-2 text-blue-700 font-semibold`}
                      >
                        Rs {transaction.amount}
                      </td>
                      <td
                        className={`border px-3 md:px-4 py-2 ${getRowClassName(
                          transaction.type
                        )}`}
                      >
                        {transaction.type}
                      </td>
                      <td className="border px-3 md:px-4 py-2 text-gray-800">
                        {transaction.type === "receive"
                          ? transaction.senderAccountNumber
                          : transaction.recipientAccountNumber}
                      </td>
                      <td className={`border px-3 md:px-4 py-2 text-gray-800`}>
                        {transaction.referenceNumber}{" "}
                        {/* Render referenceNumber */}
                      </td>
                      <td
                        className={`border px-3 md:px-4 py-2 ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
