import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BsClipboard } from "react-icons/bs";
import { getWalletUserAddress } from "../../../Redux/user";
import QRCode from "react-qr-code";
import { ToastContainer, toast } from "react-toastify";
import { depositAmount } from "../../../Redux/coins";

const DepositeOrderFormModal = ({ show, handleClose, body, amount }) => {
  const navigate = useNavigate();
  const { getUseWalletAddress: walletAddresses } = useSelector(
    (store) => store.userReducer
  );

  const dispatch = useDispatch();

  // Initial state for selectedWallet and modal visibility
  const [initialState, setInitialState] = useState({
    selectedWallet: null,
    modalVisible: false,
  });

  const { selectedWallet, modalVisible } = initialState;

  const handleConfirm = () => {
    handleClose();
    const updatedBody = {
      ...body,
      walletType: selectedWallet?.value,
    };
    const res = dispatch(depositAmount(updatedBody));
    res.then((res) => {
      if (res.payload.status === 200) {
        setTimeout(() => {
          navigate("/transaction-history");
        }, 1000);
      } else {
        // Handle error
      }
    });
  };

  useEffect(() => {
    if (selectedWallet) {
      dispatch(getWalletUserAddress(selectedWallet.value));
    }
  }, [dispatch, selectedWallet]);

  const handleSelectChange = (selectedOption) => {
    setInitialState({
      selectedWallet: selectedOption,
      modalVisible: true,
    });
  };

  const handleCopy = (text) => {
    toast.success("Wallet Address Copied");
  };

  const handleCloseAndReset = () => {
    setInitialState({
      selectedWallet: null,
      modalVisible: false,
      // ... other data you want to reset
    });
    handleClose();  // Call handleClose prop function to hide the modal
  };
  
  

  const renderModalContent = () => (
    <>
      <Modal.Header closeButton className="theme-dark-bg">
        <Modal.Title style={{ color: "black" }}>Pay with USDT</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: "100px" }} className="theme-dark-bg">
        <Select
          options={[
            { value: "ethereum", label: "ERC-20" },
            { value: "bsc", label: "BEP-20" },
            { value: "tron", label: "TRC-20" },
          ]}
          value={selectedWallet}
          onChange={handleSelectChange}
          placeholder="Select Network"
        />
        {walletAddresses.wallet && modalVisible && (
          <>
            <h2 style={{ color: "black" }} className="text-center mt-3">
              Please Pay {amount} USDT
            </h2>
            {walletAddresses && (
              <div className="mt-5 d-flex justify-content-center align-items-center">
                <QRCode
                  size={156}
                  style={{ height: "auto", maxWidth: "50%", width: "50%" }}
                  value={walletAddresses?.wallet ? walletAddresses?.wallet : 0}
                  viewBox={`0 0 256 256`}
                />
              </div>
            )}
            <div>
              {walletAddresses && (
                <div className="d-flex flex-column justify-content-center mt-4">
                  <p
                    className="mt-3 p-2 text-center"
                    style={{
                      fontWeight: "600",
                      fontSize: "1rem",
                      color: "black",
                      borderRadius: "5px",
                    }}
                  >
                    {walletAddresses?.wallet}
                  </p>
                  <div className="d-flex justify-content-center">
                    <CopyToClipboard
                      text={walletAddresses?.wallet}
                      onCopy={handleCopy}
                    >
                      <Button
                        className="btn text-white btnHover"
                        style={{ backgroundColor: "#3eacff", color: "white" }}
                      >
                        <BsClipboard
                          className="mx-2"
                          style={{ color: "while" }}
                        />
                        Copy Address
                      </Button>
                    </CopyToClipboard>
                  </div>
                  <p className="text-center mt-3">
                    Confirm Network & Deposit USDT to the Wallet Address above.
                    Selecting the Wrong Network could result in the loss of
                    funds
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="danger"
          onClick={handleCloseAndReset}
          className="red-button"
        >
          Cancel
        </Button>
        <Button
          className="btn text-white"
          style={{ backgroundColor: "#3eacff", color: "white" }}
          variant="info"
          onClick={handleConfirm}
        >
          Confirm Payment
        </Button>
      </Modal.Footer>
    </>
  );

  return <Modal show={show} onHide={handleCloseAndReset} size="md" centered>
  {renderModalContent()}
</Modal>;
};

export default DepositeOrderFormModal;