import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/AxiosInstance";
import { successMessage, errorMessage } from "../utils/message";
import Cookies from "universal-cookie";
import cryptoicons from "../../src/images/cryptoIcons/cryptoImg";
import cryptoSymbols from "../../src/images/cryptoIcons/symbolsSequence";
import { ProfitLossAmount } from "../services/DataService";

const cookies = new Cookies();
const initialState = {
  isloading: false,
  data: [],
  withdrawRequest: [],
  userWatchlist: [],
  coinData: [],
  coinDataOld: [],
  tradeData: [],
  tradeHistory: [],
  adminWatchList: [],
  watchlist: [],
  allActiveTradeAdmin: [],
  allTradeHistory: [],
  tradeClose: false,
  commissionFee: 0,
};

export const getAdminWatchList = createAsyncThunk(
  "getAdminWatchList",
  async () => {
    try {
      const res = await axiosInstance.get(`/api/adminwatchlist/`);
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);

export const getAllCoin = createAsyncThunk("getAllCoin", async () => {
  try {
    const res = await axiosInstance.get(`/coinmarket/all`);
    if (res.status === 200) {
      //successMessage("Successfully get All Coin !");
      console.log(res.data, "coin data");
      // const filterData = res.data.filter((item) => cryptoicons[item.symbol]);
      // return filterData;
      // const filteredCoins = cryptoSymbols.map((symbol) => {
      //   const coinData = res.data.find((c) => c.symbol === symbol);
      //   if (coinData) {
      //     return coinData;
      //   }
      // });

      return res.data;
    }
  } catch (err) {
    errorMessage(err.response.data || err.message);
    console.log(err);
  }
});

// get all trade
export const getAllActiveTradeAdmin = createAsyncThunk(
  "getAllActiveTradeAdmin",
  async (postData) => {
    try {
      const res = await axiosInstance.get(`/api/activetrade/getall`);
      if (res.status === 200) {
        console.log(res.data, "trade data");
        // successMessage("Successfully get All Trade !");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);
export const getAllTrade = createAsyncThunk("getAllTrade", async (postData) => {
  try {
    const res = await axiosInstance.get(
      `/api/activetrade/${postData.user_id}}`
    );
    if (res.status === 200) {
      console.log(res.data, "trade data");
      // successMessage("Successfully get All Trade !");
      return res.data;
    }
  } catch (err) {
    errorMessage(err.response.data || err.message);
    console.log(err);
  }
});

// trade close
export const tradeClose = createAsyncThunk("tradeClose", async (postData) => {
  let reqBody = {
    crypto_sale_price: postData.crypto_sale_price,
    crypto_Original_price: postData.crypto_Original_price,
  };
  console.log(reqBody, "reqBody from trade close");
  try {
    const res = await axiosInstance
      .delete(`/api/activetrade/${postData.id}`, { data: reqBody })
      .catch((err) => {
        console.log(err.response.data, "err.response.data");
      });
    if (res.status === 200) {
      console.log(res.data, "trade data close");
      successMessage("Trade Closed Successfully");
      return res.data;
    }
  } catch (err) {
    errorMessage(err.response.data || err.message);
    console.log(err);
  }
});

// partial trade close
export const partialTradeClose = createAsyncThunk(
  "partialTradeClose",
  async (postData) => {
    try {
      const res = await axiosInstance
        .post(`/api/activetrade/partial`, postData)
        .catch((err) => {
          console.log(err.response.data, "err.response.data");
        });
      if (res.status === 200) {
        console.log(res.data, "trade data close");
        successMessage("Part Trade Closed Successfully");
        return res;
      }
    } catch (err) {
      errorMessage("Invalid Partial Trade Price !");
      return err;
    }
  }
);

// get trade history
export const getTradeHistory = createAsyncThunk(
  "getTradeHistory",
  async (postData) => {
    try {
      const res = await axiosInstance.get(
        `/api/tradehistory/${postData.user_id}`
      );
      if (res.status === 200) {
        // successMessage("Successfully get All Trade History !");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);
export const getAllTradeHistory = createAsyncThunk(
  "getAllTradeHistory",
  async () => {
    try {
      const res = await axiosInstance.get(`/api/tradehistory/getall`);
      if (res.status === 200) {
        // successMessage("Successfully get All Trade History !");
        return res.data;
      }
    } catch (err) {
      // errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);

// update trade

export const updateTradeProfitLoss = createAsyncThunk(
  "updateTradeProfitLoss",

  async (postData) => {
    let reqBody = {
      take_profit: postData.take_profit,
      stop_loss: postData.stop_loss,
    };
    try {
      const res = await axiosInstance.put(
        `/api/activetrade/${postData.id}`,
        reqBody
      );
      if (res.status === 200) {
        console.log(res.data);
        successMessage("Trade Updated Successfully");
        return res;
      }
    } catch (err) {
      console.log(err);
      errorMessage(err.response.data || err.message);
    }
  }
);

// get requests
export const getAllDepositRequest = createAsyncThunk(
  "getAllDepositRequest",
  async () => {
    try {
      const res = await axiosInstance.get(`/api/deposit/`);
      if (res.status === 200) {
        // successMessage("Successfully get All Deposit Request !");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);
export const getAllTransferRequest = createAsyncThunk(
  "getAllDepositRequest",
  async () => {
    try {
      const res = await axiosInstance.get(`/api/deposit/wallet/transfer`);
      if (res.status === 200) {
        // successMessage("Successfully get All Deposit Request !");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);

export const getAllWithDrawRequest = createAsyncThunk(
  "getAllWithdrawRequest",
  async () => {
    try {
      const res = await axiosInstance.get(`/api/withdraw/`);
      if (res.status === 200) {
        // successMessage("Successfully get All Withdraw Request !");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);
// updste coin status
export const updateDepositStatus = createAsyncThunk(
  "updateDepositStatus",

  async (postData) => {
    let reqBody = {
      status: postData.status,
      status_description: postData.status_description,
    };
    try {
      const res = await axiosInstance.put(
        `/api/deposit/${postData.id}`,
        reqBody
      );
      if (res.status === 200) {
        console.log(res.data);
        successMessage("Deposit Status Updated Successfully");
        return res.data;
      }
    } catch (err) {
      console.log(err);
      errorMessage(err.response.data || err.message);
    }
  }
);
export const updateWithdrawStatus = createAsyncThunk(
  "updateWithdrawStatus",

  async (postData) => {
    let reqBody = {
      status: postData.status,
      status_description: postData.status_description,
    };
    try {
      const res = await axiosInstance.put(
        `/api/withdraw/${postData.id}`,
        reqBody
      );
      if (res.status === 200) {
        console.log(res.data);
        successMessage("Withdrawal Status Updated Successfully");
        return res.data;
      }
    } catch (err) {
      console.log(err);
      errorMessage(err.response.data || err.message);
    }
  }
);

// @desc    Deposit Amount
// @route   POST /api/deposit/
export const depositAmount = createAsyncThunk(
  "depositAmount",
  async (postData) => {
    try {
      const res = await axiosInstance.post(`/api/deposit/`, postData);
      console.log(res,"needed resposne");
      if (res.status === 200) {
        successMessage("Deposit Pending Confirmation");
      } else {
        errorMessage(res.data.message);
      }

      return res;
    } catch (err) {
      errorMessage(err.response.data || err.message);
      //reject with asyncthunk
      return Promise.reject(err.response.data || err.message);
    }
  }
);
export const withdrawAmount = createAsyncThunk(
  "withdrawAmount",
  async (postData) => {
    try {
      const res = await axiosInstance.post(`/api/withdraw/`, postData);
      console.log(res);
      if (res.data) {
        successMessage("Withdrawal Request Sent Successfully");
      }
      return res.data;
    } catch (err) {
      errorMessage(err.response.data || err.message);
      //reject with asyncthunk
      return Promise.reject(err.response.data || err.message);
    }
  }
);
// add to watchlist
export const addToWatchList = createAsyncThunk(
  "addToWatchList",
  async (postData) => {
    try {
      const res = await axiosInstance.post(`/api/userwatchlist/`, postData);
      console.log(res);
      if (res.data) {
        successMessage("Successfully Added to Watchlist");
      }
      return res.data;
    } catch (err) {
      errorMessage(err.response.data || err.message);
    }
  }
);
// get watchlist
export const getWatchList = createAsyncThunk(
  "getWatchList",
  async (postData) => {
    try {
      const res = await axiosInstance.get(
        `/api/userwatchlist/${postData.user_id}`
      );
      if (res.status === 200) {
        // successMessage("Successfully get All Watchlist !");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);
// remove from watchlist
export const removeFromWatchList = createAsyncThunk(
  "removeFromWatchList",
  async (postData) => {
    let body = { coin_name: postData.coin_name };
    try {
      const res = await axiosInstance.delete(
        `/api/userwatchlist/${postData.user_id}`,
        { data: body }
      );
      if (res.status === 200) {
        successMessage("Successfully Removed from Watchlist");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);
// create trade
export const createTrade = createAsyncThunk("createTrade", async (postData) => {
  try {
    if (isNaN(postData.stop_loss)) {
      postData.stop_loss = 0;
    }

    if (isNaN(postData.take_profit)) {
      postData.take_profit = 0;
    }

    const res = await axiosInstance.post(`/api/activetrade/`, postData);
    console.log(res);
    if (res.data) {
      successMessage("Trade Successful");
    }
    return res.data;
  } catch (err) {
    errorMessage(err.response.data || err.message);
  }
});
// set commission fee
export const setCommissionFee = createAsyncThunk(
  "setCommissionFee",
  async (postData) => {
    try {
      const res = await axiosInstance.post(`api/setting`, postData);
      console.log(res);
      if (res.data) {

      }
      return res.data;
    } catch (err) {
      errorMessage(err.response.data || err.message);
    }
  }
);
// get commission fee
export const getCommissionFee = createAsyncThunk(
  "getCommissionFee",
  async (postData) => {
    try {
      const res = await axiosInstance.get(`api/setting`);
      console.log(res);
      if (res.data) {
        // successMessage("Successfully get Commission Fee !");
      }
      return res.data;
    } catch (err) {
      errorMessage(err.response.data || err.message);
    }
  }
);

export const coinReducer = createSlice({
  name: "coinReducer",
  initialState: initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    setWatchList(state, action) {
      state.watchlist = action.payload;
    },
    getwatchlist(state, action) {
      return state.watchlist;
    },
    setCommissionFeeRedux(state, action) {
      // state.commissionFee = action.payload;
    },
  },
  extraReducers: {
    [depositAmount.fulfilled]: (state, action) => {
      state.isloading = false;
    },
    [depositAmount.pending]: (state, action) => {
      state.isloading = true;
    },

    [depositAmount.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [withdrawAmount.fulfilled]: (state, action) => {
      state.isloading = false;
    },
    [withdrawAmount.pending]: (state, action) => {
      state.isloading = true;
    },
    [withdrawAmount.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [getAllDepositRequest.fulfilled]: (state, action) => {
      state.isloading = false;
      state.data = action.payload;
      console.log("action.payload", action.payload);
    },
    [getAllDepositRequest.pending]: (state, action) => {
      state.isloading = true;
    },
    [getAllDepositRequest.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [getAllTransferRequest.fulfilled]: (state, action) => {
      state.isloading = false;
      state.data = action.payload;
      console.log("action.payload", action.payload);
    },
    [getAllTransferRequest.pending]: (state, action) => {
      state.isloading = true;
    },
    [getAllTransferRequest.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },

    [getAllWithDrawRequest.fulfilled]: (state, action) => {
      state.isloading = false;
      state.withdrawRequest = action.payload;
      console.log("action.payload", action.payload);
    },
    [getAllWithDrawRequest.pending]: (state, action) => {
      state.isloading = true;
    },
    [getAllWithDrawRequest.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },

    [updateDepositStatus.fulfilled]: (state, action) => {
      state.isloading = false;
      // state.data = action.payload;
      console.log("action.payload", action.payload);
    },
    [updateDepositStatus.pending]: (state, action) => {
      state.isloading = true;
    },
    [updateDepositStatus.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [updateWithdrawStatus.fulfilled]: (state, action) => {
      state.isloading = false;
      // state.data = action.payload;
      console.log("action.payload", action.payload);
    },
    [updateWithdrawStatus.pending]: (state, action) => {
      state.isloading = true;
    },
    [updateWithdrawStatus.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },

    [getAllCoin.fulfilled]: (state, action) => {
      state.isloading = false;
      let bool = false;

      if (state.coinDataOld.length === 0) {
        state.coinDataOld = action.payload;
        localStorage.setItem("coinDataOld", JSON.stringify(action.payload));
        state.coinData = action.payload;
      } else {
        let newTemp = action.payload;
        state.coinDataOld.forEach((elementOld) => {
          newTemp.forEach((elementNew) => {
            if (elementOld.name === elementNew.name) {
              if (elementOld.price.toFixed(2) !== elementNew.price.toFixed(2)) {
                bool = true;
              }
            }
          });
        });
        if (bool === true) {
          state.coinDataOld = state.coinData;
          state.coinData = action.payload;
          localStorage.setItem("coinDataOld", JSON.stringify(state.coinData));
        }
      }
    },
    [getAllCoin.pending]: (state, action) => {
      state.isloading = true;
    },
    [getAllCoin.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },

    [createTrade.fulfilled]: (state, action) => {
      state.isloading = false;
      state.tradeClose = false;

      //state.data = action.payload;
      console.log("action.payload", action.payload);
    },
    [createTrade.pending]: (state, action) => {
      state.isloading = true;
      state.tradeClose = true;
    },
    [createTrade.rejected]: (state, action) => {
      state.isloading = false;
      state.tradeClose = false;
      console.log("rejected", action);
    },

    [getAllTrade.fulfilled]: (state, action) => {
      state.isloading = false;
      state.tradeClose = false;
      // action.payload.forEach((element) => {

      //   element.purchase_units = ((element.investment - element.partialy_closed) / element.crypto_purchase_price);
      //   element.trade = element.trade - element.partialy_closed;
      //   element.investment = element.investment - element.partialy_closed;

      // });

      state.tradeData = action.payload;
      console.log("action.payload for portfolio", action.payload);
    },
    [getAllTrade.pending]: (state, action) => {
      state.isloading = true;
    },
    [getAllTrade.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [tradeClose.fulfilled]: (state, action) => {
      state.isloading = false;
      //state.data = action.payload;
      console.log("action.payload", action.payload);
    },
    [tradeClose.pending]: (state, action) => {
      state.isloading = true;
      state.tradeClose = true;
    },
    [tradeClose.rejected]: (state, action) => {
      state.isloading = false;
      state.tradeClose = false;
      console.log("rejected trade", action);
    },

    [partialTradeClose.fulfilled]: (state, action) => {
      state.isloading = false;
      state.isloading = false;
      //state.data = action.payload;
      console.log("action.payload partial close", action.payload);
    },
    [partialTradeClose.pending]: (state, action) => {
      state.isloading = true;
      state.tradeClose = true;
    },
    [partialTradeClose.rejected]: (state, action) => {
      state.isloading = false;
      state.tradeClose = false;
      console.log("rejected partial trade close", action);
    },

    [getTradeHistory.fulfilled]: (state, action) => {
      state.isloading = false;
      state.tradeHistory = action.payload;
    },
    [getTradeHistory.pending]: (state, action) => {
      state.isloading = true;
    },
    [getTradeHistory.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [updateTradeProfitLoss.fulfilled]: (state, action) => {
      state.isloading = false;
    },
    [updateTradeProfitLoss.pending]: (state, action) => {
      state.isloading = true;
    },
    [updateTradeProfitLoss.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [addToWatchList.fulfilled]: (state, action) => {
      console.log("action.payload", action.payload);
      state.isloading = false;
    },
    [addToWatchList.pending]: (state, action) => {
      state.isloading = true;
    },
    [addToWatchList.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [getWatchList.fulfilled]: (state, action) => {
      state.isloading = false;
      state.userWatchlist = action.payload;
      // state.watchlist = action.payload;
      console.log("action.payload from watch  list", action.payload);
    },
    [getWatchList.pending]: (state, action) => { },
    [getWatchList.rejected]: (state, action) => {
      console.log("rejected", action);
    },
    [removeFromWatchList.fulfilled]: (state, action) => {
      // state.watchlist = action.payload;
      console.log("action.payload", action.payload);
    },
    [removeFromWatchList.pending]: (state, action) => {
      state.isloading = true;
    },
    [removeFromWatchList.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [getAdminWatchList.fulfilled]: (state, action) => {
      state.adminWatchList = action.payload;
    },
    [getAllActiveTradeAdmin.fulfilled]: (state, action) => {
      state.allActiveTradeAdmin = action.payload;
    },
    [getAllTradeHistory.fulfilled]: (state, action) => {
      var activeTrade = action.payload.activeTrade;
      var tradeHistory = action.payload.tradeHis;
      activeTrade.forEach((element) => {
        // calculate profit loss
        element.open_admin_profit = element.admin_profit;
        element.close_admin_profit = 0;
        element.open_at = element.invested_date;
        let profitLoss = ProfitLossAmount(
          element.purchase_units,
          element.crypto_purchase_price,
          element.crypto_symbol,
          element.trade,
          state
        );
        if (profitLoss > 0) {
          element.actual_profit = profitLoss;
          element.actual_loss = 0;
        } else {
          element.actual_loss = profitLoss;
          element.actual_profit = 0;
        }
      });

      let allTradeHistory = [...activeTrade, ...tradeHistory];
      console.log("allTradeHistory", allTradeHistory);

      state.allTradeHistory = allTradeHistory;
    },
    [setCommissionFee.fulfilled]: (state, action) => {
      state.isloading = false;
      //state.commissionFee = action.payload;
    },
    [setCommissionFee.pending]: (state, action) => {
      state.isloading = true;
    },
    [setCommissionFee.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected from commission", action);
    },
    [getCommissionFee.fulfilled]: (state, action) => {
      state.isloading = false;

      // state.commissionFee = action.payload.commission;
      // console.log("action.payload from commission", action.payload);
    },
    [getCommissionFee.pending]: (state, action) => {
      state.isloading = true;
    },
    [getCommissionFee.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected from commission", action);
    },

    // [getUserWallet.fulfilled]: (state, action) => {
    //   state.amount = action.payload;
    // },
  },
});
// Action creators are generated for each case reducer function
export const {
  setCurrentUser,
  setWatchList,
  getwatchlis,
  setCommissionFeeRedux,
} = coinReducer.actions;
export default coinReducer.reducer;
