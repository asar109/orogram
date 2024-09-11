import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
axios.defaults.headers["x-auth-token"] = cookies.get("token");
function logout() {
  cookies.remove("token");
  cookies.remove("previoustoken");
  window.location.href = "/login";
}
const env =process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_MODE : process.env.REACT_APP_PRO_MODE;
console.log(process.env.REACT_APP_DEV_MODE,"env")
const axiosInstance = axios.create({
   baseURL: env,
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept",
  crossorigin: true,
});
axiosInstance.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    console.log(error);
    if (error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    if (error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
