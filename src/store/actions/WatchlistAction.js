import swal from "sweetalert";
import { addWatchlist, getWatchlist } from "../../services/WatchlistServices";

import { formatError } from "./FormatError";

export const CONFIRMED_ADD_WATCHLIST_ACTION = '[Confirmed Add Watchlilst action]Confirmed Add Watchlilst action';

export function addWatchlistAction(payload, navigate) {
    console.log('pa',payload)
    return (dispatch, getState) => {
        const formData = {
            coin_name:payload,
            user_id:getState().auth.auth.user.id
        }
        addWatchlist(formData,getState().auth.auth.access)
            .then((response) => {
            swal("Wooha", response.data, "success",{ button: "Close",});
                // dispatch(confrimedAddWatchlistAction(response.data))
                //history.push('/dashboard');
            })
            .catch((error) => {
                formatError(error.response.data);
                console.log("error", error)

            });
    };
}
export function getWatchlistAction(payload, navigate) {
    return (dispatch, getState) => {
    console.log('pa',payload, getState().auth.auth.user)
    const id = getState().auth.auth.user.id
    const token = getState().auth.auth.access
        getWatchlist(id,token)
            .then((response) => {
                console.log("resp", response.data)

                // var data = response.data.map((element) => {
                //     const formatter = new Intl.NumberFormat('en-IN', {
                //         minimumFractionDigits: 2,
                //         maximumFractionDigits: 2
                //     });
                //     const formattedPrice = formatter.format(element.price);
                //     const formattedChange24 = formatter.format(element.percent_change_24h)
                //     element.percent_change_24h = formatter.format(element.percent_change_24h)
                //     element.percent_change_1h = formatter.format(element.percent_change_1h)
                //     element.percent_change_7d = formatter.format(element.percent_change_7d)
                //     return {
                //         ...element,
                //         price: formattedPrice,
                //         change: formattedChange24
                //     };
                // })

                // // })
                // data = data.filter((element)=>element.symbol!="XMR")
                // dispatch(confrimedAddWatchlistAction(data))
                //history.push('/dashboard');
            })
            .catch((error) => {
                console.log("error", error)
                formatError(error.response.data);

            });
    };
}
export function confrimedAddWatchlistAction(data) {
    return {
        type: CONFIRMED_ADD_WATCHLIST_ACTION,
        payload: data,
    };
}