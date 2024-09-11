import { lazy, Suspense, useEffect } from "react";
import Index from "./jsx";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import axiosInstance from "./services/AxiosInstance";
import { setCurrentUser } from "./Redux/user";
import 'react-toastify/dist/ReactToastify.css';
const AdminIndex=lazy(() => import("../src/jsx/AdminIndex"));
const SignUp = lazy(() => import("./jsx/pages/Registration"));
const PrivacyPolicy = lazy(() => import("./jsx/pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./jsx/pages/TermsAndConditions"));
const ForgotPassword = lazy(() => import("./jsx/pages/ForgotPassword"));
const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./jsx/pages/Login")), 500);
  });
});

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

const cookies = new Cookies();

function App(props) {
  const dispatch = useDispatch();
  const userReducer = useSelector((store) => store.userReducer);
  const coinReducer = useSelector((store) => store.coinReducer);
  const navigate = useNavigate();
  useEffect(() => {
    const handleContextmenu = e => {
        e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextmenu)
    return function cleanup() {
        document.removeEventListener('contextmenu', handleContextmenu)
    }
}, [ ])
  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      const user = jwt_decode(token);
      if (user.exp < Date.now() / 1000) {
        console.log("Token has expired");
        navigate("/login");
        cookies.remove("token");
      }
      axiosInstance
        .get(`/api/user/${user?.id}`)
        .then((res) => {
          console.log(res?.data, "res?.data");
          dispatch(setCurrentUser(res?.data));
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      if (window.location.pathname.includes("/page-register")) {
        navigate("/page-register");
      } else {
        navigate("/login");
      }
    }
  }, []);
  if (userReducer?.currentUser && userReducer?.currentUser !== null) {
    return (
      <>
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
              </div>
            </div>
          }
        >
          {userReducer?.currentUser?.is_admin ? <AdminIndex /> : <Index />}
        </Suspense>
      </>
    );
  } else {
    return (
      <div className="bgcolorr">
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/page-register" element={<SignUp />} />
            <Route path="/page-forgot-password" element={<ForgotPassword />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-condition" element={<TermsAndConditions />} />
            <Route component={Login} />
          </Routes>
        </Suspense>
      </div>
    );
  }
}

export default withRouter(App);
