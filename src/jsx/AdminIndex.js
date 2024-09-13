import React, { useContext, useEffect,lazy, Suspense } from "react";

/// React router dom
import { Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

/// Css


import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { getAllCoin, getAllTrade, getCommissionFee } from "../Redux/coins";

import {
  getAdminSettings,
  settotalInvestment,
  settotalProfitLoss,
} from "../Redux/user";
import {ThemeContext} from "../context/ThemeContext";
import Loader from "./components/Loader/Loader";

const Nav = lazy(() => import("./layouts/nav"));
const Error404 = lazy(() => import("./pages/Error404"));
const Login = lazy(() => import("./pages/Login"));
const ScrollToTop = lazy(() => import("./layouts/ScrollToTop"));
const Exchange = lazy(() => import("./components/Crypto/Exchange"));
const CommissionHistory = lazy(() => import("./components/Pages/CommissionHistory"));
const DepositRequests = lazy(() => import("./components/Pages/DepositRequests"));
const ManageCoins = lazy(() => import("./components/Pages/ManageCoins"));
const NotificationHistory = lazy(() => import("./components/Pages/NotificationHistory"));
const SendNotify = lazy(() => import("./components/Pages/SendNotify"));
const Setting = lazy(() => import("./components/Pages/Setting"));
const Summary = lazy(() => import("./components/Pages/Summary"));
const TransferHistory = lazy(() => import("./components/Pages/TransferHistory"));
const UserManagment = lazy(() => import("./components/Pages/UserManagment"));
const WalletManagement = lazy(() => import("./components/Pages/WalletManagement"));
const WithdrawalRequest = lazy(() => import("./components/Pages/WithdrawalRequest"));
const AdminIndex = () => {
  const allroutes = [
    
    { url: "/", component: <Login /> },
    { url: "admin-dashboard", component: <Exchange /> },
    { url: "manage-coins", component: <ManageCoins /> },
    { url: "wallet-management", component: <WalletManagement /> },
    { url: "deposit-requests", component: <DepositRequests /> },
    { url: "withdrawal", component: <WithdrawalRequest /> },
    { url: "commission-history", component: <CommissionHistory /> },
    {url:"Transfer-history", component: <TransferHistory /> },
    { url: "notify", component: <SendNotify /> },
    { url: "user-management", component: <UserManagment /> },
    { url: "notification-history", component: <NotificationHistory /> },
    { url: "summary", component: <Summary /> },
    { url: "settings", component: <Setting /> },
    { url: "/login", component: <Login /> },
   
  ];
  
  return (
    <Suspense fallback={<Loader></Loader>}>
     

      <Routes>
        <Route element={<MainLayout />}>
          {allroutes.map((data, i) => (
            <Route
              key={i}
              exact
              path={`${data.url}`}
              element={data.component}
            />
          ))}
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
      <ScrollToTop />
    </Suspense>
  );
};

function MainLayout() {
  const { menuToggle } = useContext(ThemeContext);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const user = jwt_decode(token);
  const id = user.id;
  const dispatch = useDispatch();
  // const coinReducer = useSelector((state) => state.coinReducer);
  const loadData = () => {
    let body = {
      user_id: id,
    };
    // dispatch(getAllCoin());
    // Promise.all([dispatch(getAllCoin()), dispatch(getAllTrade(body))]).then(
    //   ([coinDataAction, tradeDataAction]) => {
    //     const coinData = coinDataAction.payload;

    //     const tradeData = tradeDataAction.payload.filter(
    //       (trade) => trade.user_id === id
    //     );

    //     const result = tradeData.reduce(
    //       (acc, cur) => {
    //         let previousPrice = coinData.find(
    //           (item) => item.symbol === cur.crypto_symbol
    //         );
    //         console.log(previousPrice, "previousPrice from reducer");

    //         if (!acc.totalInvestment) {
    //           acc.totalInvestment = cur.trade; // set initial investment
    //         } else {
    //           acc.totalInvestment += cur.trade; // add to existing investment
    //         }

    //         acc.totalProfitLoss +=
    //           (previousPrice?.price - cur.crypto_purchase_price) *
    //           cur.purchase_units;

    //         return acc;
    //       },
    //       { totalInvestment: 0, totalProfitLoss: 0 }
    //     );

    //     dispatch(settotalInvestment(result.totalInvestment));
    //     dispatch(settotalProfitLoss(result.totalProfitLoss));
    //     console.log(result, "total investment and profit/loss for user");
    //   }
    // );
  };
  // const updatePofit = () => {
  //   let body = {
  //     user_id: id,
  //   };
  //   // dispatch(getAllCoin());
  //   dispatch(getAllTrade(body)).then((tradeDataAction) => {
  //     const coinData = coinReducer.coinData;

  //     const tradeData = tradeDataAction.payload.filter(
  //       (trade) => trade.user_id === id
  //     );

  //     const result = tradeData.reduce(
  //       (acc, cur) => {
  //         let previousPrice = coinData.find(
  //           (item) => item.symbol === cur.crypto_symbol
  //         );
  //         if (!acc.totalInvestment) {
  //           //
  //           acc.totalInvestment = cur.trade; // set initial investment
  //         } else {
  //           acc.totalInvestment += cur.trade; // add to existing investment
  //         }

  //         acc.totalProfitLoss +=
  //           (previousPrice?.price - cur.crypto_purchase_price) *
  //           cur.purchase_units;

  //         return acc;
  //       },
  //       { totalInvestment: 0, totalProfitLoss: 0 }
  //     );

  //     dispatch(settotalInvestment(result.totalInvestment));
  //     dispatch(settotalProfitLoss(result.totalProfitLoss));
  //     console.log(result, "total investment and profit/loss for user");
  //   });
  // };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadData();
  //   }, 50000);
  //   return () => clearInterval(interval);
  // }, []);
  // useEffect(() => {
  //   if (coinReducer?.tradeClose === false) {
  //     updatePofit();
  //   }
  // }, [coinReducer?.tradeClose]);
  // useEffect(() => {
  //   loadData();
  //   dispatch(getAdminSettings());
  //   dispatch(getCommissionFee());
  // }, []);

  return (
    <div
      id="main-wrapper"
      className={`show ${menuToggle ? "menu-toggle" : ""}`}
    >
      <Nav />
      <div
        className="content-body"
        style={{ minHeight: window.screen.height - 45 }}
      >
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
      {/* <Footer /> */}
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default AdminIndex;
