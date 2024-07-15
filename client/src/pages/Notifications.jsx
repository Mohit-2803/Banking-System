/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faBell } from "@fortawesome/free-solid-svg-icons";

const Notifications = () => {
  const { userId } = useContext(UserContext); // Get user from UserContext
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/notifications/getNotifications/${userId}`
        );
        // Assuming the API returns an array of notifications
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
  }, [navigate, userId]);

  const handleNotificationClick = async (notification) => {
    const response = await axios.post(
      `http://localhost:5000/api/notifications/updateNotificationRead/${notification._id}`
    );
    navigate(`/notifications/${notification._id}`, { state: { notification } });
  };

  const handleSendNotification = () => {
    navigate("/notifications/sendNotifications");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}

      <div className="flex-1 p-10 overflow-y-auto h-[576px] bg-gradient-to-r from-blue-700 to-blue-200 ">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-5 gap-3">
            <FontAwesomeIcon icon={faBell} className="text-white text-2xl" />
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
          </div>
          {userId === "admin" && (
            <button
              onClick={handleSendNotification}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mb-4"
            >
              Send Notification
            </button>
          )}
          <ToastContainer autoClose={3000} />
          <div className="notification-list">
            {notifications.length === 0 ? (
              <p className="text-gray-300 pl-2">No notifications found.</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id} // Assuming MongoDB ObjectId
                  className="bg-white rounded-lg shadow-xl mb-4 p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content">
                    <h3 className="text-lg font-semibold mb-2">
                      {notification.title}
                    </h3>
                    <span className="text-gray-500 text-sm block mt-2">
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    {notification.read ? (
                      <FontAwesomeIcon
                        icon={faCircle}
                        className="text-green-500 ml-2"
                        title="Read"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faCircle}
                        className="text-red-500 ml-2"
                        title="Unread"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
