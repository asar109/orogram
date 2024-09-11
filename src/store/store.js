import { applyMiddleware, combineReducers, compose,createStore,} from 'redux';
import PostsReducer from './reducers/PostsReducer';
import thunk from 'redux-thunk';
import { AuthReducer } from './reducers/AuthReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import CoinMarketReducer from './reducers/CoinMarketReducer';
import WatchlistReducer from './reducers/WatchlistReducer';
//import { reducer as reduxFormReducer } from 'redux-form';
const middleware = applyMiddleware(thunk);



const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
    posts: PostsReducer,
    auth: AuthReducer,
    coinMarket:CoinMarketReducer,
    watchlist:WatchlistReducer
	//form: reduxFormReducer,	
	
});

const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, reducers);


//const store = createStore(rootReducers);

export const store = createStore(persistedReducer,  composeEnhancers(middleware));
export const persistor = persistStore(store);

