import axios from "axios";

const baseUrl = 'http://localhost:8000/'
export function postWithdrawal(payload, token) {
    //axios call
    const config = {
        headers: { 'x-auth-token': token }
    };
    return axios.post(
        baseUrl + "api/withdraw/",
        payload,
        config
    );
}
// if token expired, redirect to login page

