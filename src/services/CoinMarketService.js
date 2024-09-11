import axios from "axios";

const baseUrl = 'http://localhost:8000/'
export function getCoinMarket(token) {
    //axios call
    const config = {
        headers: { Authorization: `x-auth-token ${token}` }
    };
    return axios.get(
        baseUrl + "coinmarket",
        {},
        config
    );
}
