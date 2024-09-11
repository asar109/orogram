import axios from "axios";

const baseUrl = 'http://localhost:8000/'
export function addWatchlist(payload,token) {
    //axios call
    const config = {
        headers: {'x-auth-token': token }
    };
    return axios.post(
        baseUrl+"api/userwatchlist/",
        payload,
        config
    );
}
export function getWatchlist(payload,token) {
    //axios call
    const config = {
        headers: {'x-auth-token': token }
    };
    
    
    console.log('token',payload,token, baseUrl+`api/userwatchlist/${payload}`)
    return axios.get(
        
            baseUrl+`api/userwatchlist/${payload}`,
            {},
            config
    );
}
