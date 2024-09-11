import React, { useState } from "react";
import "./ImagePopup.css";

function ImagePopup({ imageUrl }) {
  const [popupVisible, setPopupVisible] = useState(true);
  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div className="image-container">
      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-icon" onClick={closePopup}>
              &#10006;
            </span>
            <img loading="lazy" src={imageUrl} alt="popup" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImagePopup;
