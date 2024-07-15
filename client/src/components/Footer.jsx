const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">
              Premium Bank strives to provide secure, innovative banking
              solutions with advanced technology, ensuring personalized customer
              service for sustainable financial success and trust.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-blue-500">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-500">
                  Accounts
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-500">
                  Payments
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-500">
                  Transfers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-sm">123 Bank Street, New York, NY 10001</p>
            <p className="text-sm">Email: mohitsharma2882003@gmail.com</p>
            <p className="text-sm">Phone: 1-800-123-4567</p>
          </div>
        </div>
        <hr className="my-6 border-gray-600" />
        <div className="flex justify-between items-center">
          <p className="text-sm">
            &copy; 2024 PREMIUM BANK. All rights reserved.
          </p>
          <ul className="flex space-x-4">
            <li>
              <a href="#" className="text-sm hover:text-blue-500">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-blue-500">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-sm hover:text-blue-500">
                FAQ
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
