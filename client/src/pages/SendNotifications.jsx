/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // Adjust the path as necessary

const SendNotificationForm = () => {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/notifications/sendNotification",
        {
          userId,
          title,
          message,
        }
      );

      alert("Notification sent successfully");
      // Optionally clear form fields or update state
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    }
  };

  return (
    <div className="flex  bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Send Notification
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-2">
                User ID:
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-2">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-semibold mb-2">
                Message:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue- resize-none"
                required
                rows="5"
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Send Notification
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendNotificationForm;
