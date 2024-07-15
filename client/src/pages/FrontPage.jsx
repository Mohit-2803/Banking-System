import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Image1 from "../assets/image1.jpg";
import Image2 from "../assets/image2.jpg";
import Image3 from "../assets/image3.jpg";

const FrontPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      {/* Header */}
      <div className="bg-gray-800 w-full">
        <header className="text-center mb-8 mt-10">
          <h1 className="text-4xl font-bold text-gray-300 mb-2">
            Welcome to Premium Banking
          </h1>
          <p className="text-lg text-gray-500">
            Your digital financial journey starts here.
          </p>
        </header>

        {/* Image Carousel */}
        <div className="w-full mb-8">
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner flex gap-8 justify-center items-center">
              <div className="carousel-item active border-8 border-blue-400 rounded-xl">
                <img
                  src={Image1}
                  className="d-block w-100 max-h-64 rounded-md"
                  alt="Image 1"
                />
              </div>
              <div className="carousel-item border-8 border-blue-400 rounded-xl">
                <img
                  src={Image2}
                  className="d-block w-100 max-h-64 rounded-md"
                  alt="Image 2"
                />
              </div>
              <div className="carousel-item border-8 border-blue-400 rounded-xl">
                <img
                  src={Image3}
                  className="d-block w-100 max-h-64 rounded-md"
                  alt="Image 3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Login and Signup Options */}
        <div className="flex justify-center space-x-4 mb-8">
          <Link
            to="/login"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Advertisements */}
      <h2 className="text-2xl font-semibold text-center mb-6 mt-12">
        Additional Features
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Save Money with Us</h2>
          <p className="text-gray-600">
            Open an account and start saving today.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Secure Transactions</h2>
          <p className="text-gray-600">
            Your transactions are always safe and secure.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">24/7 Customer Support</h2>
          <p className="text-gray-600">
            Our support team is available round the clock.
          </p>
        </div>
      </div>

      {/* Additional Features Section */}
      <section className="mt-10 max-w-screen-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Mobile Banking</h3>
            <p className="text-gray-600">
              Manage your finances on the go with our mobile app.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">
              Investment Opportunities
            </h3>
            <p className="text-gray-600">
              Explore various investment options to grow your wealth.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Financial Planning</h3>
            <p className="text-gray-600">
              Get personalized financial planning advice from experts.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Credit Card Services</h3>
            <p className="text-gray-600">
              Access exclusive credit card services with attractive rewards.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center text-gray-600 mb-8">
        &copy; 2024 Premium Banking. All rights reserved.
      </footer>
    </div>
  );
};

export default FrontPage;
