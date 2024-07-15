/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEnvelope,
  faSync,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import Ticker from "./Ticker";
import { useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import LogoImage from "../assets/navbank.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [myToken, setMyToken] = useState(null);
  const [myLastLogin, setMyLastLogin] = useState("");

  useEffect(() => {
    const myfunction = () => {
      const token = localStorage.getItem("token");
      setMyToken(token);
      const lastLogin = localStorage.getItem("lastLogin");
      if (lastLogin) {
        const date = new Date(lastLogin);
        const formattedDate = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
        const formattedTime = date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        setMyLastLogin(`${formattedDate} ${formattedTime}`);
      }
    };

    myfunction();
  }, []);

  const handleLogout = () => {
    if (myToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("lastLogin");
      setMyToken(null);
      setMyLastLogin("");
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="bg-gray-800 text-white py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div>
            <NavLink to="/" className="text-lg font-semibold">
              <img
                src={LogoImage}
                alt="Premium Bank Logo"
                className="h-9 mr-2"
              />
            </NavLink>
          </div>
          <ul className="flex space-x-12 mr-16 items-center">
            {myToken && (
              <>
                <li>
                  <NavLink
                    to="/home"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 transition-colors duration-300 ${
                        isActive ? "text-blue-500" : "hover:text-blue-500"
                      }`
                    }
                  >
                    <FontAwesomeIcon icon={faHome} />
                    <span>Home</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 transition-colors duration-300 ${
                        isActive ? "text-blue-500" : "hover:text-blue-500"
                      }`
                    }
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>Contact Us</span>
                  </NavLink>
                </li>
                <li className="relative group">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `flex items-center space-x-2 transition-colors duration-300 ${
                        isActive ? "text-blue-500" : "hover:text-blue-500"
                      }`
                    }
                  >
                    <FontAwesomeIcon icon={faUser} />
                    <span>Profile</span>
                  </NavLink>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-max bg-gray-800 text-white text-xs px-4 py-2 rounded shadow-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <div className="mb-2">Last login: {myLastLogin}</div>
                    {myToken && (
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-red-500 hover:text-red-700 transition-colors duration-300"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Logout</span>
                      </button>
                    )}
                  </div>
                </li>
              </>
            )}
            <li>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 hover:text-blue-500 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faSync} />
                <span>Refresh</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <Ticker />
    </>
  );
};

export default Navbar;
