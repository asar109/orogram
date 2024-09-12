import React, { useContext, useEffect,lazy, Suspense } from "react";
/// React router dom
import { Outlet, Route, Routes } from "react-router-dom";

/// Css
import "./chart.css";
import "./index.css";
import "./step.css";
import "../vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "../css/style.css";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import {
  getAllCoin,
  getAllTrade,
  getCommissionFee
} from "../Redux/coins";
import {
  getAdminSettings,
  settotalInvestment,
  settotalProfitLoss,
} from "../Redux/user";
import  {ThemeContext} from "../context/ThemeContext";
import Loader from "./components/Loader/Loader";
const Nav = lazy(() => import("./layouts/nav"));
const ScrollToTop = lazy(() => import("./layouts/ScrollToTop"));
const Home = lazy(() => import("./components/Dashboard/Home"));
const  AppProfile = lazy(() => import("./components/AppsMenu/AppProfile/AppProfile"));
const Deposit = lazy(() => import("./components/Pages/Deposit"));
const Withdrawal = lazy(() => import("./components/Pages/Withdrawal"));
const WatchList = lazy(() => import("./components/Pages/WatchList"));
const Portfolio = lazy(() => import("./components/Pages/Portfolio"));
const TradeHistory = lazy(() => import("./components/Pages/TradeHistory"));
const TransactionHistory = lazy(() => import("./components/Pages/TransactionHistory"));
const Trade = lazy(() => import("./components/Pages/Trade"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Error403 = lazy(() => import("./pages/Error403"));


const Markup = () => {
  const allroutes = [
    //myroutes
    { url: "/", component: <Login /> },
    { url: "/trade", component: <Trade /> },
    { url: "/deposit", component: <Deposit /> },
    { url: "/Withdraw", component: <Withdrawal /> },
    { url: "/watchlist", component: <WatchList /> },
    { url: "/portfolio", component: <Portfolio /> },
    { url: "/trade-history", component: <TradeHistory /> },
    { url: "/transaction-history", component: <TransactionHistory /> },
    { url: "/login", component: <Login /> },
    { url: "dashboard", component: <Home /> },
    { url: "app-profile", component: <AppProfile /> },
    { url: "page-forgot-password", component: <ForgotPassword /> },
    { url: "privacy-policy", component: <PrivacyPolicy /> },
  ];

  return (
    <>
      {/* {coinReducer.isLoading && (
        <div className="loader">
          <RotatingLines
            strokeColor="#3eacff"
            strokeWidth="5"
            animationDuration="0.75"
            width="70"
            visible={true}
          />
        </div>
      )} */}

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
        <Route path="*" element={<Error403 />} />
        {/* <Route path="*" element={<Error404 />} /> */}
      </Routes>
      <ScrollToTop />
    </>
  );
};

function MainLayout() {
  const { menuToggle } = useContext(ThemeContext);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const user = jwt_decode(token);
  const id = user.id;
  const dispatch = useDispatch();
  const coinReducer = useSelector((state) => state.coinReducer);
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

    //         const fee = cur.investment * (coinReducer.commissionFee / 100);

    //         // acc.totalProfitLoss -= fee;

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


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadData();
  //   }, 50000);
  //   return () => clearInterval(interval);
  // }, []);
  // useEffect(() => {
  //   if (coinReducer?.tradeClose === false) {
  //     loadData();
  //   }
  // }, [coinReducer?.tradeClose]);

  // useEffect(() => {
  //   loadData();
  //   dispatch(getAdminSettings());
  //   dispatch(getCommissionFee());
  // }, []);
  return (
    <Suspense fallback={<Loader></Loader>}>
    <div
      id="main-wrapper"
      className={`show ${menuToggle ? "menu-toggle" : ""}`}
    >
      
      <Nav />
      <div
        className="content-body"
        style={{
          minHeight: window.screen.height - 45,
          backgroundColor: "whitesmoke",
        }}
      >
        <div
          className="container-fluid"
          style={{ backgroundColor: "whitesmoke" }}
        >
          <Outlet />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
    </Suspense>
  );
}

export default Markup;
