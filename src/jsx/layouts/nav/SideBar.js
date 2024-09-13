/// Menu
import React, {
  useContext,
  useEffect,
  useReducer,
  useState
} from "react";
//import Metismenu from "metismenujs";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";

/// Link
import { NavLink } from "react-router-dom";

import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import { MenuList } from "./Menu";

//import medal from "../../../images/medal.png";

// class MM extends Component {
// 	componentDidMount() {
// 		this.$el = this.el;
// 		this.mm = new Metismenu(this.$el);
// 	}
//   componentWillUnmount() {
//   }
//   render() {
//     return (
//       <div className="mm-wrapper">
//         <ul className="metismenu " ref={(el) => (this.el = el)}>
//           {this.props.children}
//         </ul>
//       </div>
//     );
//   }
// }

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
const SideBar = (props) => {
  const { toggle, setToggle } = props;
  const { iconHover, sidebarposition, headerposition, sidebarLayout } =
    useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, initialState);

  // let handleheartBlast = document.querySelector('.heart');
  // function heartBlast(){
  //   return handleheartBlast.classList.toggle("heart-blast");
  // }

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
    // chnageHaderColor("color_5");
  }, []);

  // useEffect(() => {

  // }, []);
  //For scroll
  const [hideOnScroll, setHideOnScroll] = useState(true);
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll]
  );

  // Menu dropdown list
  //const [active , setActive] = useState('');
  //const [activeSubmenu , setActiveSubmenu] = useState('');

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
  // Menu dropdown list End

  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];
  useEffect(() => {
    const PathTitle = MenuList.find((item) => item.to === path);
    let activePath = MenuList.find((item) => item?.title === PathTitle?.title);
    if (activePath) {
      setState({ active: activePath?.title });
      if (toggle) {
        NavMenuToggle();
        setToggle();
      }
    }
  }, [path]);
  /// Active menu
  // let deshBoard = [
  //     "",
  //     "dashboard-dark",
  //     "food-order",
  //     "favorite-menu",
  //     "message",
  //     "order-history",
  //     "notification",
  //     "bill",
  //     "setting",
  //     "task",
  //   ],
  // restro=[
  // 	"restaurant",
  // 	"menu",
  // 	"orders",
  // 	"customer-reviews",
  // 	"restro-setting",
  // ],
  // drivers=[
  // 	"deliver-main",
  // 	"deliver-order",
  // 	"feedback",
  // ],
  //   app = [
  //     "app-profile",
  //     "post-details",
  //     "app-calender",
  //     "email-compose",
  //     "email-inbox",
  //     "email-read",
  //     "ecom-product-grid",
  //     "ecom-product-list",
  //     "ecom-product-order",
  //     "ecom-checkout",
  //     "ecom-invoice",
  //     "ecom-customers",
  //     "post-details",
  //     "ecom-product-detail",
  //   ],
  //   email = ["email-compose", "email-inbox", "email-read"],
  //   shop = [
  //     "ecom-product-grid",
  //     "ecom-product-list",
  //     "ecom-product-list",
  //     "ecom-product-order",
  //     "ecom-checkout",
  //     "ecom-invoice",
  //     "ecom-customers",
  //     "ecom-product-detail",
  //   ],
  //   charts = [
  //     "chart-rechart",
  //     "chart-flot",
  //     "chart-chartjs",
  //     //"chart-chartist",
  //     "chart-sparkline",
  //     "chart-apexchart",
  //   ],
  //   bootstrap = [
  //     "ui-accordion",
  //     "ui-badge",
  //     "ui-alert",
  //     "ui-button",
  //     "ui-modal",
  //     "ui-button-group",
  //     "ui-list-group",
  //     "ui-card",
  //     "ui-carousel",
  //     "ui-dropdown",
  //     "ui-popover",
  //     "ui-progressbar",
  //     "ui-tab",
  //     "ui-typography",
  //     "ui-pagination",
  //     "ui-grid",
  //   ],
  //   plugins = [
  //     "uc-select2",
  //     "uc-nestable",
  //     "uc-sweetalert",
  //     "uc-toastr",
  //     "uc-noui-slider",
  //     "map-jqvmap",
  //     "uc-lightgallery",
  //   ],
  // redux = [
  //      "redux-form",
  //    "redux-wizard",
  //      "todo",
  //   ],
  //   widget = ["widget-basic"],
  //   forms = [
  //     "form-element",
  //     "form-wizard",
  //     "form-ckeditor",
  //     "form-pickers",
  //     "form-validation-jquery",
  //   ],
  //   table = ["table-bootstrap-basic", "table-datatable-basic"],
  //   pages = [
  //     "page-register",
  //     "page-login",
  //     "page-lock-screen",
  //     "page-error-400",
  //     "page-error-403",
  //     "page-error-404",
  //     "page-error-500",
  //     "page-error-503",
  //   ],
  //   error = [
  //     "page-error-400",
  //     "page-error-403",
  //     "page-error-404",
  //     "page-error-500",
  //     "page-error-503",
  //   ];

  return (
    <div
      className={`deznav  border-right ${iconHover} ${sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
        ? hideOnScroll > 120
          ? "fixed"
          : ""
        : ""
        }`}
    >
      <PerfectScrollbar className="deznav-scroll">
        <ul className="metismenu" id="menu">
          {MenuList.map((data, index) => {
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
                  {data.newTab ? (
                    <NavLink to={data.to} target="_blank">
                      {data.iconStyle}
                      <span className="nav-text">{data.title}</span>
                    </NavLink>
                  ) : (
                    <NavLink to={data.to}>
                      {data.iconStyle}
                      <span className="nav-text">{data.title}</span>
                    </NavLink>
                  )}

                  {data.children && state.active === data.title && (
                    <ul className="mm-submenu">
                      {data.children.map((child, childIndex) => (
                        <li
                          className={`${
                            state.activeSubmenu === child.title
                              ? "mm-active"
                              : ""
                          }`}
                          key={childIndex}
                          onClick={() => handleSubmenuActive(child.title)}
                        >
                          <NavLink to={child.to}>
                            {child.iconStyle}
                            <span className="" style={{
                              color: "#333",
                              backgroundColor: "#fff",
                              paddingLeft : '4px'
                            }} >{child.title}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* {data.content && data.content.length > 0 ?
                            <Link to={"#"} 
                              className="has-arrow"
                              onClick={() => {handleMenuActive(data.title)}}
                            >								
								                {data.iconStyle}
                                <span className="nav-text">{data.title}</span>
                            </Link>
                        :
                          <NavLink  to={data.to} >
                              {data.iconStyle}
                              <span className="nav-text">{data.title}</span>
                          </NavLink>
                        } */}
                  {/* <Collapse in={state.active === data.title ? true :false}>
                          <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                            {data.content && data.content.map((data,index) => {									
                              return(	
                                  <li key={index}
                                    className={`${ state.activeSubmenu === data.title ? "mm-active" : ""}`}                                    
                                  >
                                    {data.content && data.content.length > 0 ?
                                        <>
                                          <NavLink to={data.to} className={data.hasMenu ? 'has-arrow' : ''}
                                            onClick={() => { handleSubmenuActive(data.title)}}
                                          >
                                            {data.title}
                                          </NavLink>
                                          <Collapse in={state.activeSubmenu === data.title ? true :false}>
                                              <ul className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}>
                                                {data.content && data.content.map((data,index) => {
                                                  return(	
                                                    <>
                                                      <li key={index}>
                                                        <Link className={`${path === data.to ? "mm-active" : ""}`} to={data.to}>{data.title}</Link>
                                                      </li>
                                                    </>
                                                  )
                                                })}
                                              </ul>
                                          </Collapse>
                                        </>
                                      :
                                      <Link to={data.to}>
                                        {data.title}
                                      </Link>
                                    }
                                    
                                  </li>
                                
                              )
                            })}
                          </ul>
                        </Collapse> */}
                </li>
              );
            }
          })}
        </ul>
      </PerfectScrollbar>
    </div>
  );
};

export default SideBar;
