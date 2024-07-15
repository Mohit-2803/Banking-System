import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Layout from "./Layout.jsx";
import AddAccount from "./pages/AddAccount.jsx";
import ConfirmEmail from "./pages/ConfirmEmail.jsx";
import FrontPage from "./pages/FrontPage.jsx";
import Home from "./pages/Home.jsx";
import FundTransfer from "./pages/FundTransfer.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import Transactions from "./pages/Transactions.jsx";
import ConfirmTransfer from "./pages/ConfirmTransfer.jsx";
import ConfirmTransaction from "./pages/ConfrimTransaction.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Success from "./pages/Success.jsx";
import TicketSuccess from "./pages/TicketSuccess.jsx";
import BeneficiaryList from "./pages/Beneficiary.jsx";
import AddBeneficiary from "./pages/AddBeneficiary.jsx";
import Profile from "./pages/Profile.jsx";
import LoansPage from "./pages/Loan.jsx";
import LoanApply from "./pages/LoanApply.jsx";
import LoanSubmitted from "./pages/LoanSubmitted.jsx";
import Notifications from "./pages/Notifications.jsx";
import SendNotificationForm from "./pages/SendNotifications.jsx";
import NotificationDisplay from "./pages/NotificationDisplay.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<FrontPage />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="verify" element={<ConfirmEmail />} />
      <Route path="addAccount" element={<AddAccount />} />
      <Route path="home" element={<Home />} />
      <Route path="fundTransfer" element={<FundTransfer />} />
      <Route path="transactions" element={<Transactions />} />
      <Route path="confirmTransfer" element={<ConfirmTransfer />} />
      <Route path="confirmTransaction" element={<ConfirmTransaction />} />
      <Route path="successful" element={<Success />} />
      <Route path="contact">
        <Route index element={<ContactUs />} />
        <Route path="ticketSuccess" element={<TicketSuccess />} />
      </Route>
      <Route path="beneficiary">
        <Route index element={<BeneficiaryList />} />
        <Route path="addBeneficiary" element={<AddBeneficiary />} />
      </Route>
      <Route path="profile" element={<Profile />} />
      <Route path="loans">
        <Route index element={<LoansPage />} />
        <Route path="applyLoan" element={<LoanApply />} />
        <Route path="loanSubmitted" element={<LoanSubmitted />} />
      </Route>
      <Route path="notifications">
        <Route index element={<Notifications />} />
        <Route path="sendNotifications" element={<SendNotificationForm />} />
        <Route path=":id" element={<NotificationDisplay />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
);
