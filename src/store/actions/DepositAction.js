import { postDeposit } from "../../services/DepositService";

export const CONFIRMED_DEPOSIT_ACTION =
  "[Confirmed Deposit action] Confirmed Deposit action";

export function postDepositAction(payload, navigate) {
  return (dispatch, getState) => {
    const formData = {
      amount: payload,
      user_id: getState().auth.auth.user.id,
    };
    
    postDeposit(formData, getState().auth.auth.access)
      .then((response) => {
        console.log("deposited", response.data);
        //history.push('/dashboard');
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
}
