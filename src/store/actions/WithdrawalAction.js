import { postWithdrawal } from "../../services/WithdrawalService";
import { formatError } from "./FormatError";



export function postWithdrawalAction(payload, navigate) {
    return (dispatch, getState) => {
        const formData = {
            amount:payload,
            user_id:getState().auth.auth.user.id
        }
        postWithdrawal(formData,getState().auth.auth.access)
            .then((response) => {
                console.log("deposited",response.data)
                //history.push('/dashboard');
            })
            .catch((error) => {
                formatError(error.response.data);
                console.log("error", error)

            });
    };
}