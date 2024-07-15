import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faMoneyCheckAlt,
  faExchangeAlt, // Changed icon for Transactions
  faUserFriends,
  faUniversity,
  faHeadset,
  faUser,
  faFileAlt, // Example new icon
  faBell,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="h-full w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:bg-gray-600"
        />
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        <Link
          to="/home"
          className={`flex items-center p-2 rounded hover:bg-gray-700 ${
            location.pathname === "/home" ? "bg-gray-700" : ""
          }`}
        >
          <FontAwesomeIcon icon={faHome} className="mr-3" /> Home
        </Link>
        <Link
          to="/accounts"
          className={`flex items-center p-2 rounded hover:bg-gray-700 ${
            location.pathname === "/accounts" ? "bg-gray-700" : ""
          }`}
        >
          <FontAwesomeIcon icon={faMoneyCheckAlt} className="mr-3" /> Accounts
        </Link>
        <Link
          to="/fundTransfer"
          className={`flex items-center p-2 rounded hover:bg-gray-700 ${
            location.pathname === "/fundTransfer" ? "bg-gray-700" : ""
          }`}
        >
          <FontAwesomeIcon icon={faExchangeAlt} className="mr-3" /> Fund
          Transfer
        </Link>
        <Link
          to="/beneficiary"
          className={`flex items-center p-2 rounded hover:bg-gray-700 ${
            location.pathname === "/beneficiary" ||
            location.pathname === "/beneficiary/addBeneficiary"
              ? "bg-gray-700"
              : ""
          }`}
        >
          <FontAwesomeIcon icon={faUserFriends} className="mr-3" />{" "}
          Beneficiaries
        </Link>
        <Link
          to="/transactions"
          className={`flex items-center p-2 rounded hover:bg-gray-700 ${
            location.pathname === "/transactions" ? "bg-gray-700" : ""
          }`}
        >
          <FontAwesomeIcon icon={faExchangeAlt} className="mr-3" /> Transactions
        </Link>
        <Link
          to="/loans"
          className={`flex items-center p-2 rounded hover:bg-gray-700 ${
            location.pathname === "/loans" ||
            location.pathname === "/loans/applyLoan" ||
            location.pathname === "/loans/loanSubmitted"
              ? "bg-gray-700"
              : ""
          }`}
        >
          <FontAwesomeIcon icon={faUniversity} className="mr-3" /> Loans
        </Link>
        <Link
          to="/contact"
          className={`flex items-center p-2 rounded hover:bg-gray-700 ${
            location.pathname === "/contact" ||
            location.pathname === "/contact/ticketSuccess"
              ? "bg-gray-700"
              : ""
          }`}
        >
          <FontAwesomeIcon icon={faHeadset} className="mr-3" /> Customer Service
        </Link>
        <Link
          to="/profile"
          className={`flex items-center p-2 rounded hover:bg-gray-700 ${
            location.pathname === "/profile" ? "bg-gray-700" : ""
          }`}
        >
          <FontAwesomeIcon icon={faUser} className="mr-3" /> My Profile
        </Link>
        {/* Example of new navigation links */}
        <Link
          to="/documents"
          className={`flex items-center p-2 rounded hover:bg-gray-700 ${
            location.pathname === "/documents" ? "bg-gray-700" : ""
          }`}
        >
          <FontAwesomeIcon icon={faFileAlt} className="mr-3" /> Documents
        </Link>
        <Link
          to="/notifications"
          className={`flex items-center p-2 rounded hover:bg-gray-700 ${
            location.pathname === "/notifications" ||
            location.pathname === "/notifications/:id"
              ? "bg-gray-700"
              : ""
          }`}
        >
          <FontAwesomeIcon icon={faBell} className="mr-3" /> Notifications
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
