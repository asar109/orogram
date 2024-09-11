import { getCoinMarket } from "../../services/CoinMarketService";

export const GET_COIN_MARKET = '[Get Coin Market action] Get Coin Market action';

export const CONFIRMED_CHANGE_ACTION = '[Change Coin Market action] Change Coin Market action';


export function getCoinMarketAction(payload, navigate) {
    return (dispatch, getState) => {
        getCoinMarket(getState().auth.auth.access)
            .then((response) => {
                var data = response.data.map((element) => {
                    const formatter = new Intl.NumberFormat('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    const formattedPrice = formatter.format(element.price);
                    const formattedChange24 = formatter.format(element.percent_change_24h)
                    element.percent_change_24h = formatter.format(element.percent_change_24h)
                    element.percent_change_1h = formatter.format(element.percent_change_1h)
                    element.percent_change_7d = formatter.format(element.percent_change_7d)
                    return {
                        ...element,
                        price: formattedPrice,
                        change: formattedChange24
                    };
                })

                // })
                data = data.filter((element)=>element.symbol!="XMR")
                dispatch(confirmedGetCoinMarketAction(data))
                //history.push('/dashboard');
            })
            .catch((error) => {
                console.log("error", error)

            });
    };
}
export function confirmedGetCoinMarketAction(data) {
    return {
        type: GET_COIN_MARKET,
        payload: data,
    };
}
export function change1hAction(payload, navigate) {
    console.log("payload", payload)
    return (dispatch, getState) => {
       var data = getState().coinMarket.coinMarket
       data = data.map((element) => {
        return {
            ...element,
            change: element.percent_change_1h
        };
    })
    console.log("response", data)
    dispatch(confirmChangeAction(data))
    };
}
export function confirmChangeAction(data) {
    return {
        type: CONFIRMED_CHANGE_ACTION,
        payload: data,
    };
}
