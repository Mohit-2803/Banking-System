/* eslint-disable no-unused-vars */
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBell } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component

const NotificationDisplay = () => {
  const location = useLocation();
  const { notification } = location.state;

  return (
    <div className="flex">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 p-10 bg-gray-100 pb-1 bg-gradient-to-r from-blue-400 to-blue-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Back to notifications */}
            <Link
              to="/notifications"
              className="flex items-center text-blue-500 hover:text-blue-600 mb-4"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Notifications
            </Link>
            {/* Notification details */}
            <h2 className="text-2xl font-bold mb-4">{notification.title}</h2>
            <p className="text-gray-700 mb-4 overflow-y-auto max-h-80">
              {notification.message}
            </p>
            <div className="flex items-center">
              {/* Notification read status */}
              <div className="flex items-center text-gray-500 text-sm">
                <FontAwesomeIcon
                  icon={faBell}
                  className={`mr-2 ${
                    notification.read ? "text-green-500" : "text-red-500"
                  }`}
                />
                {notification.read ? "Read" : "Unread"}
              </div>
              {/* Notification timestamp */}
              <div className="ml-auto text-gray-500 text-sm">
                {new Date(notification.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDisplay;
