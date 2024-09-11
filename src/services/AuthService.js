import axios from 'axios';
import swal from "sweetalert";
import {
    loginConfirmedAction,
    Logout,
} from '../store/actions/AuthActions';

export function signUp(payload) {
    //axios call
    const postData = {
        ...payload,
        // returnSecureToken: true,
    };
    return axios.post(
        // `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
        //  "https://prime-exchange.cyclic.app/api/user/register",
        "http://localhost:8000/api/user/register",
        postData,
    );
}

export function login(email, password) {
    const postData = {
        email,
        password,
        // returnSecureToken: true,
    };
    return axios.post(
        // `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD3RPAp3nuETDn9OQimqn_YF6zdzqWITII`,
        "http://localhost:8000/api/user/login",
        postData,
    );
}

export function formatError(errorResponse) {
    switch (errorResponse) {
        case 'EMAIL_EXISTS':
            //return 'Email already exists';
            swal("Oops", "Email already exists", "error");
            break;
        case 'EMAIL_NOT_FOUND':
            //return 'Email Not Found';
            swal("Oops", "Email Not Found", "error", { button: "Try Again!", });
            break;
        case 'INVALID_PASSWORD':
            //return 'Invalid Password';
            swal("Oops", "Invalid Password", "error", { button: "Try Again!", });
            break;
        case 'USER_DISABLED':
            return 'User Disabled';

        default:
            swal("Oops", errorResponse, "error", { button: "Try Again!", });
            return '';
    }
}

export function saveTokenInLocalStorage(tokenDetails) {
    tokenDetails.expireDate = new Date(
        // new Date().getTime() + tokenDetails.expiresIn * 1000,
        new Date().getTime() + 3600 * 1000,

    );
    localStorage.setItem('userDetails', JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, navigate) {
    setTimeout(() => {
        //dispatch(Logout(history));
        dispatch(Logout(navigate));
    }, timer);
}

export function checkAutoLogin(dispatch, navigate) {
    const tokenDetailsString = localStorage.getItem('userDetails');
    let tokenDetails = '';
    if (!tokenDetailsString) {
        dispatch(Logout(navigate));
        return;
    }

    tokenDetails = JSON.parse(tokenDetailsString);
    let expireDate = new Date(tokenDetails.expireDate);
    let todaysDate = new Date();

    if (todaysDate > expireDate) {
        dispatch(Logout(navigate));
        return;
    }

    dispatch(loginConfirmedAction(tokenDetails));

    const timer = expireDate.getTime() - todaysDate.getTime();
    runLogoutTimer(dispatch, timer, navigate);
}
