/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faTag,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const ContactUs = () => {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
    userId: "",
  });

  useEffect(() => {
    if (userId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userId: userId,
      }));
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { name, subject, message } = formData;
    if (!name || !subject || !message) {
      toast.error("All fields are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/messages/createContactMessage",
          formData
        );

        const ticketId = response.data.data;

        toast.success("Message sent successfully!");
        setFormData({
          name: "",
          subject: "",
          message: "",
        });

        navigate("/contact/ticketSuccess", { state: { ticketId } });
      } catch (error) {
        toast.error("Failed to send message. Please try again.");
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-2xl mt-6 flex-1 h-full ">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">
          Get in Touch
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              <FontAwesomeIcon icon={faTag} className="mr-2" />
              Subject
            </label>
            <input
              type="text"
              name="subject"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
              Message
            </label>
            <textarea
              name="message"
              className="w-full h-28 resize-none p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={formData.message}
              onChange={handleChange}
              rows="5"
            ></textarea>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              Send Message
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ContactUs;
