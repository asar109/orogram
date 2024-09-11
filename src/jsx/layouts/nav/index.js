import React, { Fragment, useState, lazy, Suspense} from "react";
import { useSelector } from "react-redux";

const Header = lazy(() =>  import("./Header"));
const NavHader = lazy(() =>  import("./NavHader"));
const SideBar= lazy(() =>  import("./SideBar")); 
const  AdminSideBar= lazy(() =>  import("../nav/AdminSideBar"));
const Loader = lazy(() =>  import("../../components/Loader/Loader"));

const JobieNav = ({ title, onClick: ClickToAddEvent, onClick2, onClick3 }) => {
  const userReducer = useSelector((store) => store?.userReducer);

  const [toggle, setToggle] = useState("");
  const [toggle2, setToggle2] = useState(false);

  const changeToggle = () => {
    setToggle2(!toggle2);
  };
  const onClick = (name) => setToggle(toggle === name ? "" : name);
  const renderLoader = () => <Loader />;
  return (
    <Suspense fallback={renderLoader()}>
    <Fragment>
      <NavHader toggle={toggle2} setToggle={changeToggle} />
      {/* <ChatBox onClick={() => onClick("chatbox")} toggle={toggle} /> */}
      <Header
        onNote={() => onClick("chatbox")}
        onNotification={() => onClick("notification")}
        onProfile={() => onClick("profile")}
        toggle={toggle}
        title={title}
        onBox={() => onClick("box")}
        onClick={() => ClickToAddEvent()}
      />
      {userReducer?.currentUser?.is_admin ? <AdminSideBar toggle={toggle2} setToggle={changeToggle} /> : <SideBar toggle={toggle2} setToggle={changeToggle} />}
      {/* {true ? <AdminSideBar /> : <SideBar />} */}
    </Fragment>
    </Suspense>
  );
};

export default JobieNav;
