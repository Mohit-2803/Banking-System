import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyCheckAlt,
  faHome,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";

const LoansPage = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gradient-to-r from-blue-800 to-blue-300 flex items-center justify-center">
        <div className="w-full max-w-5xl px-5">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-center text-2xl font-semibold mb-6">
              Know about our Loans
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Personal Loan Card */}
              <div className="bg-gray-200 rounded-lg p-4 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    <FontAwesomeIcon icon={faMoneyCheckAlt} className="mr-2" />
                    Personal Loan
                  </h3>
                  <p className="text-gray-700 mb-4">
                    A personal loan is an unsecured loan typically used for
                    personal expenses such as home improvements, vacations, or
                    emergencies. It offers fixed monthly payments and
                    competitive interest rates.
                  </p>
                </div>
              </div>

              {/* Home Loan Card */}
              <div className="bg-gray-200 rounded-lg p-4 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    <FontAwesomeIcon icon={faHome} className="mr-2" />
                    Home Loan
                  </h3>
                  <p className="text-gray-700 mb-4">
                    A home loan, or mortgage, is a loan used to finance the
                    purchase or renovation of a home. It typically offers longer
                    repayment terms and lower interest rates compared to other
                    loans.
                  </p>
                </div>
              </div>

              {/* Business Loan Card */}
              <div className="bg-gray-200 rounded-lg p-4 shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                    Business Loan
                  </h3>
                  <p className="text-gray-700 mb-4">
                    A business loan provides funding for business expenses such
                    as expansion, equipment purchases, or working capital. It
                    helps businesses manage cash flow and achieve growth.
                  </p>
                </div>
              </div>
            </div>

            {/* Apply Now Button */}
            <div className="flex justify-center mt-6">
              <Link
                to="/loans/applyLoan"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoansPage;
