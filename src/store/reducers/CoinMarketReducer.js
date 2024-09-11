import { CONFIRMED_CHANGE_ACTION, GET_COIN_MARKET } from "../actions/CoinMarketActions";

const initialState = {
    coinMarket: [],
};

export default function CoinMarketReducer(state = initialState, actions) {
    if (actions.type === GET_COIN_MARKET) {
        
        return {
            ...state,
            coinMarket:actions.payload,
        };
    }
    if (actions.type === CONFIRMED_CHANGE_ACTION) {
        
        return {
            ...state,
            coinMarket:actions.payload,
        };
    }

    return state;
}
