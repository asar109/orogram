import { FaCreditCard, FaEdit } from "react-icons/fa";
export const MenuList = [
  //Dashboard
  {
    title: "Dashboard",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">home</i>,
    to: "dashboard",
    newTab: false,
  },

  {
    title: "Create",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">edit_note</i>,
    to: "#",
    newTab: false,
    children: [
      {
        title: "Open Contract",
        to: "new-trade",
        iconStyle: <i className="material-icons">sync_alt</i>,
        newTab: false,
      },
      {
        title: "Trade Order",
        to: "new-contract",
        iconStyle: <i className="material-icons">sync_alt</i>,
        newTab: false,
      },
      {
        title: "Private Contract",
        to: "new-contract",
        iconStyle: <i className="material-icons">sync_alt</i>,
        newTab: false,
      },
    ],
  },
  {
    title: "Buy/Sell",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">credit_card</i>,
    to: "#",
    newTab: false,
    children: [
      {
        title: "Purchase",
        to: "new-trade",
        iconStyle: <i className="material-icons">sync_alt</i>,
        newTab: false,
      },
      {
        title: "Sall to Orogram",
        to: "new-contract",
        iconStyle: <i className="material-icons">sync_alt</i>,
        newTab: false,
      },
    ],
  },
  {
    title: "Trade Option",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">sync_alt</i>,
    to: "#",
    newTab: false,
    children: [
      {
        title: "Open Trade",
        to: "new-trade",
        iconStyle: <i className="material-icons">sync_alt</i>,
        newTab: false,
      },
      {
        title: "Open Contract",
        to: "new-trade",
        iconStyle: <i className="material-icons">sync_alt</i>,
        newTab: false,
      },
      {
        title: "Private Contract",
        to: "new-contract",
        iconStyle: <i className="material-icons">sync_alt</i>,
        newTab: false,
      },
      {
        title: "Verify Hash All",
        to: "new-contract",
        iconStyle: <i className="material-icons">sync_alt</i>,
        newTab: false,
      },
      {
        title: "Land Transaction",
        to: "new-contract",
        iconStyle: <i className="material-icons">sync_alt</i>,
        newTab: false,
      },
    ],
  },
  {
    title: "Send",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">arrow_upward</i>,
    to: "send",
    newTab: false,
  },
  {
    title: "Wallet",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">wallet</i>,
    to: "trade",
    newTab: false,
  },
  {
    title: "Accounts",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">account_balance</i>,
    to: "trade",
    newTab: false,
  },
  {
    title: "Wallet History",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">credit_card</i>,
    to: "wallet-history",
    newTab: false,
  },
  {
    title: "Transaction History",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">history</i>,
    to: "transaction-history",
    newTab: false,
  },
  {
    title: "Terms & Conditions",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">library_books</i>,
    to: "https://www.primecryptoexchange.com/terms-conditions/",
    newTab: true,
  },
  {
    title: "Privacy Policy",
    classsChange: "mm-collapse",
    iconStyle: <i className="material-icons">lock</i>,
    to: "https://www.primecryptoexchange.com/privacy-policy/",
    newTab: true,
  },

];
