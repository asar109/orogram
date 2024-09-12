import React, { useContext } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";

//images
import { useSelector } from "react-redux";
import logoPrime from "./../../../images/logo/logo-prime.png";

export function NavMenuToggle() {
  setTimeout(() => {
    let mainwrapper = document.querySelector("#main-wrapper");
    if (mainwrapper.classList.contains("menu-toggle")) {
      mainwrapper.classList.remove("menu-toggle");
    } else {
      mainwrapper.classList.add("menu-toggle");
    }
  }, 200);
}

const NavHader = (props) => {
  const { toggle, setToggle } = props;
  const userReducer = useSelector((store) => store.userReducer);
  //const [toggle, setToggle] = useState(false);
  const { navigationHader, openMenuToggle, background } =
    useContext(ThemeContext);
  return (
    <div className="nav-header">
      <Link
        to={
          !userReducer.currentUser.is_admin ? "/dashboard" : "admin-dashboard"
        }
        className="brand-logo"
      >
        {/* <img  loading="lazy" src={logoPrime}  className="logo-abbr" alt=""/> */}
        <img loading="lazy" style={{
          width: "100px",
        }}  src={logoPrime} className="brand-title" alt="" />
        {/* <img  loading="lazy" src={logoPrime} className="logo-color" alt="" /> */}
        {/* <img  loading="lazy" src={logoColorText} className="brand-title color-title" alt="" /> */}
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          setToggle();
          //openMenuToggle();
          NavMenuToggle();
        }}
      >
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="22" y="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="22" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="11" y="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="11" y="22" width="4" height="4" rx="2" fill="#2A353A" />
            <rect width="4" height="4" rx="2" fill="#2A353A" />
            <rect y="11" width="4" height="4" rx="2" fill="#2A353A" />
            <rect x="22" y="22" width="4" height="4" rx="2" fill="#2A353A" />
            <rect y="22" width="4" height="4" rx="2" fill="#2A353A" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
