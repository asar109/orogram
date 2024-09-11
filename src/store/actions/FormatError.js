import swal from "sweetalert";

export function formatError(errorResponse) {
    switch (errorResponse) {
        default:
            swal("Oops", errorResponse, "error",{ button: "Try Again!",});
            return '';
    }
}