import { CONFIRMED_ADD_WATCHLIST_ACTION } from "../actions/WatchlistAction";

const initialState = {
    watchlist: [],
};

export default function WatchlistReducer(state = initialState, actions) {
    if (actions.type === CONFIRMED_ADD_WATCHLIST_ACTION) {
        
        return {
            ...state,
            watchlist:actions.payload,
        };
    }
    

    return state;
}
