/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import defaultProfilePic from "../assets/default-profile-pic.png";
import axios from "../services/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userId } = useContext(UserContext);
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    userId: userId,
    email: "",
    lastLoginAt: "",
    profilePic: null,
  });
  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
          const userData = response.data.data;

          // Format the lastLoginAt date to '12 June 2024 9 PM' format
          const dateObject = new Date(userData.user.lastLoginAt);
          const formattedDate = `${dateObject.getDate()} ${
            monthNames[dateObject.getMonth()]
          } ${dateObject.getFullYear()} ${formatAMPM(dateObject)}`;

          setUserDetails({
            userId: userData.user.userId,
            email: userData.user.email,
            lastLoginAt: formattedDate,
            accountType: userData.accountInfo.accountType,
            profilePic: userData.user.profilePic,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Handle error state or navigate to an error page
      }
    };

    // Function to format AM/PM
    const formatAMPM = (date) => {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      const strTime = `${hours}:${minutes} ${ampm}`;
      return strTime;
    };

    // Array of month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    fetchUserData();
  }, [userId, navigate]);

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Upload the file to the server using FormData
        const formData = new FormData();
        formData.append("profilePic", file);

        const response = await axios.post(
          `http://localhost:5000/api/upload/uploadProfilePic/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success("Profile picture updated successfully!");
          // Update userDetails with the new profile picture path
          setUserDetails((prev) => ({
            ...prev,
            profilePic: response.data.data.profilePic,
          }));
        } else {
          toast.error("Failed to update profile picture. Please try again.");
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error("Failed to update profile picture. Please try again.");
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/update",
        {
          userId: userDetails.userId,
          email: data.email,
        }
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setUserDetails((prev) => ({
          ...prev,
          email: data.email,
        }));
        setEditMode(false);
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error(error);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-r from-blue-800 to-blue-300 flex items-center justify-center">
        <div className="w-full max-w-xl px-5">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h5 className="text-center text-2xl font-semibold mb-6">
              Your Profile
            </h5>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-20 h-20 overflow-hidden rounded-full">
                <img
                  className="w-full h-full object-cover"
                  src={userDetails.profilePic || defaultProfilePic}
                  alt="Profile"
                />
                <label
                  htmlFor="profilePic"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full cursor-pointer p-1 hover:bg-blue-600 mr-1"
                >
                  <FontAwesomeIcon icon={faEdit} />
                  <input
                    type="file"
                    id="profilePic"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 text-md font-bold mb-2">
                User ID:{" "}
                <span className="text-gray-900 font-normal">
                  {userDetails.userId}
                </span>
              </p>
            </div>
            <div className="mb-4 flex items-center">
              <div className="mr-2 w-32">
                <p className="text-gray-700 text-md font-bold mb-2">Email:</p>
                <div className="flex items-center">
                  {editMode ? (
                    <>
                      <input
                        {...register("email", {
                          required: "Email is required",
                        })}
                        id="email"
                        type="email"
                        defaultValue={userDetails.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={handleSubmit(onSubmit)}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-900">{userDetails.email}</p>
                      <button
                        onClick={toggleEditMode}
                        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </>
                  )}
                </div>
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 text-md font-bold mb-2">
                Account Type:{" "}
                <span className="text-gray-900 font-normal">
                  {userDetails.accountType}
                </span>
              </p>
            </div>
            <div className="mb-4">
              <p className="text-gray-700 text-md font-bold mb-2">
                Last Login At:{" "}
                <span className="text-gray-900 font-normal">
                  {userDetails.lastLoginAt}
                </span>
              </p>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Profile;
