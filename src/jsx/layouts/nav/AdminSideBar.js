/// Menu
import React, {
  useContext,
  useEffect,
  useReducer,
  useState
} from "react";

import PerfectScrollbar from "react-perfect-scrollbar";

import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import { AdminMenueList } from "./AdminMenueList";



const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: "",
  activeSubmenu: "",
};
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

const AdminSideBar = (props) => {
  const { toggle, setToggle } = props;
  const { iconHover, sidebarposition, headerposition, sidebarLayout } =
    useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, initialState);


  const {
    changeBackground,
    changePrimaryColor,
    chnageSidebarColor,
    changeNavigationHader,
    // chnageHaderColor
  } = useContext(ThemeContext);
  useEffect(() => {
    changeBackground({ value: "light", label: "Light" });
    changePrimaryColor("color_5");
    chnageSidebarColor("color_1");
    changeNavigationHader("color_5");
   
  }, []);

  
  const [hideOnScroll, setHideOnScroll] = useState(true);
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );

 
  const handleMenuActive = (status) => {
    setState({ active: status });

    if (state.active === status) {
      setState({ active: "" });
    }
  };
  const handleSubmenuActive = (status) => {
    setState({ activeSubmenu: status });
    if (state.activeSubmenu === status) {
      setState({ activeSubmenu: "" });
    }
  };

  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];
  useEffect(() => {

    setTimeout(() => {
      

      const PathTitle = AdminMenueList?.find((item) => item.to === path);
      let activePath = AdminMenueList?.find(
        (item) => item.title === PathTitle.title
      );
      if (activePath) {
        setState({ active: activePath.title });
        if (toggle) {
          NavMenuToggle();
          setToggle();
        }
      }
    }, 1000); 
  }, [path]);
  

  return (
    <div
      className={`deznav  border-right ${iconHover} ${
        sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
          ? hideOnScroll > 120
            ? "fixed"
            : ""
          : ""
      }`}
    >
      <PerfectScrollbar className="deznav-scroll">
        <ul className="metismenu my-5" id="menu">
          {AdminMenueList?.map((data, index) => {
            let menuClass = data.classsChange;
            if (menuClass === "menu-title") {
              return (
                <li className={menuClass} key={index}>
                  {data.title}
                </li>
              );
            } else {
              return (
                // <li className='mm-active'
                //   key={index}
                // >
                <li
                  className={` ${
                    state.active === data.title ? "mm-active" : ""
                  }`}
                  onClick={() => {
                    handleMenuActive(data.title);
                  }}
                  key={index}
                >
                  <NavLink to={data.to}>
                    {data.iconStyle}
                    <span className="nav-text">{data.title}</span>
                  </NavLink>
            
                </li>
              );
            }
          })}
        </ul>
      </PerfectScrollbar>
    </div>
  );
};

export default AdminSideBar;
