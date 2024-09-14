import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/AxiosInstance";
import axios from "axios";
import { successMessage, errorMessage } from "../utils/message";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const initialState = {
  currentUser: null,
  getUserRewards: [],
  getAllUserDeposits: [],
  getUseWalletAddress: [],
  getAllUserWithdrawals: [],
  getAllAdminWatchlist: [],
  allUsers: [],
  getUserWallet: 0,
  getAdminDefaultPer: {},
  isloading: false,
  notification: [],
  isloadingNotification: false,
  usermangement: [],
  walletmangement: [],
  walletTransfer: [],
  tradeSummary: [],
  totalInvestment: 0,
  totalProfitLoss: 0,
  adminSettings: [],
  transactionHistory:[]
};

export const getUserTransactionHistory = createAsyncThunk(
  "getUserTransactionHistory",
  async () => {
    try {
      const res = await axiosInstance.get(`/api/deposit/wallets/tansaction/history`);
      if (res.status === 200) {
        return res.data?.transaction;
      }
    } catch (err) {
      console.log(err);
    }
  }
);

// post requests

//get admin settings
export const getAdminSettings = createAsyncThunk(
  "getAdminSettings",
  async () => {
    try {
      const res = await axiosInstance.get(`api/setting`);
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      console.log(err);
    }
  }
);

export const switchAccount = createAsyncThunk(
  "switchAccount",
  async (data, { getState }) => {
    const token = getState().userReducer.currentUser.is_admin
      ? cookies.get("token")
      : cookies.get("previoustoken");
    try {
      const env = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_MODE : process.env.REACT_APP_PRO_MODE;

      const res = await axios.post(
        env+"api/user/accesstoadmin",
        {
          email: data.email,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      return res.data;
    } catch (err) {
      errorMessage(err.response.data || err.message);
    }
  }
);

export const verifyEmail = createAsyncThunk("verifyEmail", async (formData) => {
  try {
    const res = await axiosInstance.post(`/api/user/email-verify`, formData);
    if (res.status === 200) {
      // successMessage("Email verified successfully");
      return res.data.user;
    }
  } catch (err) {
    errorMessage(err.response.data || err.message);
  }
});

export const forgotPassword = createAsyncThunk(
  "forgotPassword",
  async (formData) => {
    try {
      const res = await axiosInstance.post(`/api/user/email-verify`, formData);
      if (res.status === 200) {
        successMessage("Instructions Sent to Registered Email");
        return res;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      return err;
    }
  }
);

export const getAllUsers = createAsyncThunk("getAllUsers", async () => {
  try {
    const res = await axiosInstance.get(`api/user/getall`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
});
export const getBankDetails = createAsyncThunk(
  "getBankDetails",
  async (userId) => {
    try {
      const res = await axiosInstance.get(`api/bankdetail/${userId}`);

      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {}
  }
);

// export const getCurrentuser = createAsyncThunk(
//   "getCurrentuser",
//   async (userId) => {
//     try {
//       const { data } = await axiosInstance.get(`/ api/user/${ userId }`);
//       return data;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// );

//post requests

export const userSignUp = createAsyncThunk("userSignUp", async (formData) => {
  try {
    const res = await axiosInstance.post(`/auth/register`, formData);

    if (res.status === 200) {
      successMessage("User Registered Successfully");
      return res;
    }
    return res;
  } catch (err) {
    console.log(err);
    errorMessage(err.response.data || err.message);
  }
});

export const userLogin = createAsyncThunk("userLogin", async (formData) => {
  console.log("formDataLogin", formData);
  try {
    const res = await axiosInstance.post(`/auth/login`, formData);

    if (res.status === 200) {
      successMessage("User Logged in Successfully");
      return res.data;
    } else {
      errorMessage("Something Went Wrong");
    }
  } catch (err) {
    console.log(err.response.data);
    errorMessage(err.response.data);
    return err.response.data;
  }
});
// get wallet
export const getUserWallet = createAsyncThunk(
  "getUserWallet",
  async (userId) => {
    // try {
    //   const res = await axiosInstance.get(`/api/wallet/${userId}`);
    //   if (res.status === 200) {
    //     // console.log(res.data, "wallet data");
    //     return res.data;
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  }
);

// get all user deposits
export const getAllDepositsByUserId = createAsyncThunk(
  "getAllDepositsByUserId",
  async (userId) => {
    try {
      const res = await axiosInstance.get(`/api/deposit/${userId}`);
      if (res.status === 200) {
        // successMessage("successfully get all deposits by user id");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);
// get all user wallets
export const getWalletUserAddress = createAsyncThunk(
  "getWalletUserAddress",
  async (walletType) => {
    try {
      const res = await axiosInstance.get(`/api/deposit/wallets/${walletType}`);
      if (res.status === 200) {
        // successMessage("successfully get all deposits by user id");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);

//

// get all user withdrawals
export const getAllWithdrawalsByUserId = createAsyncThunk(
  "getAllWithdrawalsByUserId",
  async (userId) => {
    try {
      const res = await axiosInstance.get(`/api/withdraw/${userId}`);
      if (res.status === 200) {
        // successMessage("successfully get all withdrawals by user id");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);

// get all admin watchlist
export const getAllAdminWatchlist = createAsyncThunk(
  "getAllAdminWatchlist",
  async () => {
    try {
      const res = await axiosInstance.get(`/api/adminwatchlist/`);
      if (res.status === 200) {
        // successMessage("successfully get all admin watchlist");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);

// add to admin watchlist

export const addToAdminWatchlist = createAsyncThunk(
  "addToAdminWatchlist",
  async (formData) => {
    try {
      const res = await axiosInstance.post(`/api/adminwatchlist/`, formData);
      if (res.status === 200) {
        successMessage("Successfully added to admin watchlist");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);
//  remove from admin watchlist
export const removeFromAdminWatchlist = createAsyncThunk(
  "removeFromAdminWatchlist",
  async (formData) => {
    try {
      const res = await axiosInstance.delete(
        `/api/adminwatchlist/${formData?.watchlist_item_id}`
      );
      if (res.status === 200) {
        successMessage("Successfully Removed from Admin Watchlist");
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  }
);

export const getNotifcation = createAsyncThunk("getNotifcation", async (isAdmin) => {
  try {
    let url = isAdmin ? `/api/admin/notification/admin` : `/api/admin/notification/`;
    const res = await axiosInstance.get(url);
    if (res.status === 200) {
      //successMessage("successfully get all notifications by user id");
      return res.data;
    }
  } catch (err) {
    errorMessage(err.response.data || err.message);
    console.log(err);
  }
});

// get api cal in user managemnet page
export const usermanagment = createAsyncThunk("usermanagment", async () => {
  try {
    const res = await axiosInstance.get(`/api/user/getall`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (err) {
    errorMessage(err.response.data || err.message);
    console.log(err);
  }
});

export const walletmanagment = createAsyncThunk("walletmanagment", async () => {
  try {
    const res = await axiosInstance.get(`/api/deposit/wallet/Info`);
    console.log(res.data, "walletmanagment");
    if (res.status === 200) {
      return res?.data?.balances;
    }
  } catch (err) {
    errorMessage(err.response.data || err.message);
    console.log(err);
  }
});
export const walletTranfer = createAsyncThunk(
  "walletTransfer",
  async ({ walletType, user_id, passcode, amount, recipientAddress }) => {
    try {
      const res = await axiosInstance.post(
        `/api/deposit/wallet/transfer/${walletType}`,
        { user_id, passcode, amount, accountFrom:recipientAddress }
      );
      console.log(res.data);
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      errorMessage(err.response.data || err.message);
      console.log(err);
      throw err; // Rethrow the error to be handled by the reject handler
    }
  }
);

export const updateUser = createAsyncThunk(
  "updateUser",

  async (user) => {
    try {
      const res = await axiosInstance.put(`/api/profile/${user.id}`, {
        is_active_user: !user.value,
      });
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      console.log(err);
      errorMessage(err.response.data || err.message);
    }
  }
);

export const seenAllNotifications = createAsyncThunk(
  "seenAllNotifications",
  async (id) => {
    try {
      const res = await axiosInstance.put(`/api/admin/notification/${id}`);
      // if (res.status === 200) {
      //   successMessage("successfully updated User");
      return res;
      // }
    } catch (err) {
      console.log(err);
      errorMessage(err.response.data || err.message);
    }
  }
);

export const seenSpecificNotification = createAsyncThunk(
  "seenSpecificNotification",

  async ({ id, user_id }) => {
    try {
      const res = await axiosInstance.put(
        `/api/admin/notification/single/${id}`,
        {
          user_id,
        }
      );
      // if (res.status === 200) {
      //   successMessage("successfully updated User");
      return res;
      // }
    } catch (err) {
      console.log(err);
      errorMessage(err.response.data || err.message);
    }
  }
);
export const hideSpecificNotification = createAsyncThunk(
  "hideSpecificNotification",
  async ({ id, user_id }) => {
    try {
      const res = await axiosInstance.put(
        `/api/admin/notification/hide/${id}`,
        {
          user_id,
        }
      );
      // if (res.status === 200) {
      //   successMessage("successfully updated User");
      return res;
      // }
    } catch (err) {
      console.log(err);
      errorMessage(err.response.data || err.message);
    }
  }
);

// get trade summary
export const getTradeSummary = createAsyncThunk("getTradeSummary", async () => {
  try {
    const res = await axiosInstance.get(`/api/activetrade/assets`);
    if (res.status === 200) {
      // successMessage("successfully get all withdrawals by user id");
      return res.data;
    }
  } catch (err) {
    errorMessage(err.response.data || err.message);
    console.log(err);
  }
});

//update Requests
// export const updateUserLevel = createAsyncThunk(
//   "updateUserLevel",
//   async (formData, { getState }) => {
//     try {
//       const res = await axiosInstance.put(`/ api/profile/level`, formData);
//       if (res.status === 200) {
//         let array = [...getState().userReducer.allUsers];
//         let index = array.findIndex((d) => d.id === formData?.user_id);
//         array[index] = { ...array[index], level: formData?.level };
//         // successMessage("User Level Changed");
//         return array;
//       }
//     } catch (err) {
//       console.log(err);
//       errorMessage(err.response.data || err.message);
//     }
//   }
// );

export const userReducer = createSlice({
  name: "userReducer",
  initialState: initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    resetCurrentUser(state, action) {
      state.currentUser = null;
    },
    settotalProfitLoss(state, action) {
      state.totalProfitLoss = action.payload;
    },
    settotalInvestment(state, action) {
      state.totalInvestment = action.payload;
    },
  },
  extraReducers: {
    [userSignUp.fulfilled]: (state, action) => {
      state.isloading = false;
    },
    [userSignUp.pending]: (state, action) => {
      state.isloading = true;
    },

    [userLogin.fulfilled]: (state, action) => {
      state.isloading = false;
      console.log(action.payload);
    },
    [userLogin.pending]: (state, action) => {
      state.isloading = true;
    },
    [userLogin.rejected]: (state, action) => {
      state.isloading = false;
    },

    [getUserWallet.fulfilled]: (state, action) => {
      state.isloading = false;
      // state.getUserWallet = action.payload?.balance || 0;
      // console.log("balance", action.payload.balance);
    },
    [getUserWallet.pending]: (state, action) => {
      state.isloading = true;
    },
    [getUserWallet.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },

    [getAllDepositsByUserId.fulfilled]: (state, action) => {
      state.isloading = false;
      state.getAllUserDeposits = action.payload;
    },
    [getAllDepositsByUserId.pending]: (state, action) => {
      state.isloading = true;
    },
    [getAllDepositsByUserId.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [getUserTransactionHistory.fulfilled]: (state, action) => {
      state.isloading = false;
      state.transactionHistory = action.payload;
    },
    [getUserTransactionHistory.pending]: (state, action) => {
      state.isloading = true;
    },
    [getUserTransactionHistory.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    // transactionHistory
    [getWalletUserAddress.fulfilled]: (state, action) => {
      state.isloading = false;
      state.getUseWalletAddress = action.payload;
    },
    [getWalletUserAddress.pending]: (state, action) => {
      state.isloading = true;
    },
    [getWalletUserAddress.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [getAllWithdrawalsByUserId.fulfilled]: (state, action) => {
      state.isloading = false;
      state.getAllUserWithdrawals = action.payload;
    },
    [getAllWithdrawalsByUserId.pending]: (state, action) => {
      state.isloading = true;
    },

    [getAllWithdrawalsByUserId.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [getAllAdminWatchlist.fulfilled]: (state, action) => {
      state.isloading = false;
      state.getAllAdminWatchlist = action.payload;
    },

    // walletTranfer
    [getAllAdminWatchlist.pending]: (state, action) => {
      state.isloading = true;
    },
    [getAllAdminWatchlist.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [walletTranfer.fulfilled]: (state, action) => {
      state.isloading = false;
      state.walletTransfer = action.payload;
    },

    // walletTranfer
    [walletTranfer.pending]: (state, action) => {
      state.isloading = true;
    },
    [walletTranfer.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [addToAdminWatchlist.fulfilled]: (state, action) => {
      state.isloading = false;
      //state.getAllAdminWatchlist = action.payload;
    },
    [addToAdminWatchlist.pending]: (state, action) => {
      state.isloading = true;
    },
    [addToAdminWatchlist.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [removeFromAdminWatchlist.fulfilled]: (state, action) => {
      state.isloading = false;
      //state.getAllAdminWatchlist = action.payload;
    },
    [removeFromAdminWatchlist.pending]: (state, action) => {
      state.isloading = true;
    },
    [removeFromAdminWatchlist.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [getNotifcation.fulfilled]: (state, action) => {
      if (action.payload?.message) {
        state.notification = [];
      } else {
        state.notification = action.payload;
      }
    },
    [getNotifcation.rejected]: (state, action) => {
      console.log("rejected", action);
    },
    [getAllUsers.fulfilled]: (state, action) => {
      state.allUsers = action.payload;
    },

    [usermanagment.fulfilled]: (state, action) => {
      state.isloading = false;
      state.usermangement = action.payload;
    },
    [usermanagment.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [usermanagment.pending]: (state, action) => {
      state.isloading = true;
    },
    [walletmanagment.fulfilled]: (state, action) => {
      state.isloading = false;
      state.walletmangement = action.payload;
    },
    [walletmanagment.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [walletmanagment.pending]: (state, action) => {
      state.isloading = true;
    },
    // walletmanagment
    // update user
    [updateUser.fulfilled]: (state, action) => {
      state.isloading = false;
    },
    [updateUser.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [updateUser.pending]: (state, action) => {
      state.isloading = true;
    },
    [getTradeSummary.fulfilled]: (state, action) => {
      state.isloading = false;
      state.tradeSummary = action.payload;
    },
    [getTradeSummary.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
    [getTradeSummary.pending]: (state, action) => {
      state.isloading = true;
    },
    [getAdminSettings.pending]: (state, action) => {
      state.isloading = true;
    },
    [getAdminSettings.fulfilled]: (state, action) => {
      state.isloading = false;
      state.adminSettings = action.payload;
    },
    [getAdminSettings.rejected]: (state, action) => {
      state.isloading = false;
      console.log("rejected", action);
    },
  },
});
// Action creators are generated for each case reducer function
export const {
  setCurrentUser,
  resetCurrentUser,
  settotalProfitLoss,
  settotalInvestment,
} = userReducer.actions;
export default userReducer.reducer;
