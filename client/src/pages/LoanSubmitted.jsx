import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCheckCircle } from "@fortawesome/free-solid-svg-icons"; // Importing faCheckCircle for success icon
import Sidebar from "../components/Sidebar";

const LoanSubmitted = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gradient-to-r from-blue-800 to-blue-300 flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-5">
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-green-500 text-6xl mb-4"
            />
            <h2 className="text-2xl font-semibold mb-4">
              Loan Application Submitted Successfully
            </h2>
            <p className="text-gray-700 mb-6">
              Thank you for submitting your loan application. We will review
              your application and get back to you soon.
            </p>
            <div className="flex justify-center">
              <Link
                to="/home"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
              >
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Go Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanSubmitted;
