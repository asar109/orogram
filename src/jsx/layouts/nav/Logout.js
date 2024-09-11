import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { resetCurrentUser } from '../../../Redux/user';
import Cookies from "universal-cookie";


import { Logout } from '../../../store/actions/AuthActions';
import { isAuthenticated } from '../../../store/selectors/AuthSelectors';


function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}

function LogoutPage(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();
  function onLogout() {
    //console.log('------------khelesh-------');
    cookies.remove("token");
    cookies.remove("previoustoken");
    dispatch(resetCurrentUser());
    dispatch(Logout(navigate));

  }
  return (
    <>
      <button className="dropdown-item ai-icon ms-1" onClick={onLogout}>
        <svg xmlns="http://www.w3.org/2000/svg" className="text-primary" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        <span className="ms-2">Logout</span>
      </button>
    </>
  )
}




export default withRouter(LogoutPage);