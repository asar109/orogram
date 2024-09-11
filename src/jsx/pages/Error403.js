import React from "react";
import { Link } from "react-router-dom";

const Error403 = () => {
   return (
      <div className="authincation bgcolorr">
         <div className="container">
            <div className="row justify-content-center h-100 align-items-center ">
               <div className="col-md-7">
                  <div className="form-input-content text-center error-page">
                     <h1 className="error-text fw-bold">404</h1>
                     <h4>
                        <i className="fa fa-exclamation-triangle text-warning" />{" "}
                        The page you were looking for is not found!
                     </h4>
                     <p>
                        You may have mistyped the address or the page may have
                        moved.
                     </p>
                     <div>
                        <Link className="btn btn-primary" to="/dashboard" style={{ backgroundColor: "#3eacff", color: "white", borderColor: "#3eacff" }}>
                           Back to Dashboard
                        </Link>

                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Error403;
