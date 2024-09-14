import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import Dropdown from "react-dropdown";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BsClipboard } from "react-icons/bs";
import { getWalletUserAddress, walletTranfer } from "../../../Redux/user";
import QRCode from "react-qr-code";
import { ToastContainer, toast } from "react-toastify";

const AdminTransferModal = ({ show, handleClose, id }) => {
  const { getUseWalletAddress: walletAddresses } = useSelector(
    (store) => store.userReducer
  );
  console.log(walletAddresses, "addresses");
  const dispatch = useDispatch();
  const [selectedWallet, setSelectedWallet] = useState(null);

  const options = [
    { value: "ethereum", label: "ERC-20" },
    { value: "bsc", label: "BEP-20" },
    { value: "tron", label: "TRC-20" },
  ];

  const [passcode, setPasscode] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const handleSelectChange = (selectedOption) => {
    setSelectedWallet(selectedOption);
  };

  // Handle passcode input change
  const handlePasscodeChange = (e) => {
    setPasscode(e.target.value);
  };

  // Handle amount input change
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  // Handle recipient address input change
  const handleRecipientAddressChange = (e) => {
    setRecipientAddress(e.target.value);
  };
  const handleSelectValueChange = (selectedOption) => {
    setSelectedWallet(selectedOption);
  };
  const handleConfirm = () => {
    dispatch(
      walletTranfer({ walletType: selectedWallet?.value, user_id: id, passcode, amount, recipientAddress })
    )
    toast.success("Check Transfer Logs")
    setPasscode('');
    setAmount('');
    setRecipientAddress('');
    handleClose();
  };
  // console.log(passcode, amount, recipientAddress,selectedWallet?.value);
  const [copiedText, setCopiedText] = useState("");

  const handleCopy = (text) => {
    setCopiedText(text);
    toast.success("Text copied!");
  };
  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header closeButton className="theme-dark-bg">
        <Modal.Title className="text-dark">Transfer</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: "100px" }} className="theme-dark-bg">
        {/* placeholder={searchPlaceholder} onChange={handleChange} */}
        <Select
          options={options}
          value={selectedWallet}
          onChange={handleSelectChange}
        />

        <input
          type="password"
          className="form-control mt-3"
          placeholder="Insert Your Passcode"
          value={passcode}
          onChange={handlePasscodeChange}
        />

        <input
          type="text"
          className="form-control mt-3"
          placeholder="Amount To Transfer"
          value={amount}
          onChange={handleAmountChange}
        />

        <input
          type="text"
          className="form-control mt-3"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={handleRecipientAddressChange}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={handleClose} className="red-button">
          Cancel
        </Button>
        <Button onClick={handleConfirm}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default AdminTransferModal;
