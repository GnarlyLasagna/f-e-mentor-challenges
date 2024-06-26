import React, { useContext, useEffect, useReducer, useState } from "react";

const InvoiceContext = React.createContext();

function AppProvider({ children }) {
  const [addInv, setAddInv] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [addItem, setAddItem] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [updateInvoice, setUpdateInvoice] = useState(false);
  const [final, setFinal] = useState([]);
  const [isLight, setIsLight] = useState(false);
  const [date, setDate] = useState(new Date());
  const [filterByStatus, setFilterByStatus] = useState({
    draft: false,
    pending: false,
    paid: false,
  });

  const getLocalStorage = localStorage.getItem("invoices");
  const useLocalStorage = getLocalStorage ? JSON.parse(getLocalStorage) : [];
  const getThemeLocalStorage = localStorage.getItem("light");
  const useThemeLocalStorage = getThemeLocalStorage
    ? JSON.parse(getThemeLocalStorage)
    : "";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [itemsList, setItemsList] = useState([
    {
      itemListID: generateID(),
      itemName: "",
      qty: 0,
      price: 0,
      total: 0.0,
    },
  ]);
  const [invoiceData, setInvoiceData] = useState({
    invoiceID: generateID(),
    streetFrom: "",
    cityFrom: "",
    postCodeFrom: "",
    countryFrom: "",
    clientName: "",
    clientEmail: "",
    streetTo: "",
    cityTo: "",
    postCodeTo: "",
    countryTo: "",
    paymentTerms: 1,
    projectDescription: "",
    status: "pending",
  });

  const resetInvoiceData = {
    ...invoiceData,
    streetFrom: "",
    cityFrom: "",
    postCodeFrom: "",
    countryFrom: "",
    clientName: "",
    clientEmail: "",
    streetTo: "",
    cityTo: "",
    postCodeTo: "",
    countryTo: "",
    paymentTerms: 1,
    projectDescription: "",
  };

  const resetItemList = {
    ...itemsList,
    itemListID: generateID(),
    itemName: "",
    qty: 0,
    price: 0,
    total: 0.0,
  };

  function generateID() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    let id = [];
    for (let i = 0; i <= 2; i++) {
      id.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    for (let i = 0; i <= 3; i++) {
      id.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }
    return id.join("");
  }

  function DateFn(date) {
    const day = new Date(date).getDate();
    const month = months[new Date(date).getMonth()];
    const year = new Date(date).getFullYear();
    const fullDate = `${day} ${month} ${year}`;

    return fullDate;
  }

  const paymentDue = (date, paymentTerms) => {
    const toMilliSec = paymentTerms * 86400000;
    const getMilliSec = new Date(date).getTime() + toMilliSec;
    const paymentDueDate = new Date(getMilliSec);
    const day = new Date(paymentDueDate).getDate();
    const month = months[new Date(paymentDueDate).getMonth()];
    const year = new Date(paymentDueDate).getFullYear();
    const fullDate = `${day} ${month} ${year}`;

    return fullDate;
  };

  const invoicesReducer = (state, action) => {
    if (action.type === "SAVE_PENDING") {
      const { invoiceData, itemsList, date } = action.payload;
      return [
        ...state,
        {
          ...invoiceData,
          invoiceID: generateID(),
          date: date,
          itemList: [...itemsList],
        },
      ];
    }
    else if (action.type === "SAVE_DRAFT") {
      const { invoiceData, itemsList, date } = action.payload;
      return [
        ...state,
        {
          ...invoiceData,
          invoiceID: generateID(),
          date: date,
          status: "draft",
          itemList: [...itemsList],
        },
      ];
    }
    else if (action.type === "DELETE_INVOICE") {
      return state.filter((invoice) => invoice.invoiceID !== action.payload);
    } else if (action.type === "PAID_ITEM") {
      return state.map((invoice) => {
        if (invoice.invoiceID === action.payload) {
          return { ...invoice, status: "paid" };
        } else {
          return invoice;
        }
      });
    }
    else if (action.type === "EDIT_ITEM") {
      const { data, list, date } = action.payload;

      return state.map((invoice) => {
        if (invoice.invoiceID === data.invoiceID) {
          return {
            ...invoice,
            ...data,
            date,
            itemList: [...list],
          };
        } else {
          return invoice;
        }
      });
    }
    else {
      throw new Error("No matching action");
    }
  };

  const [invoices, dispatch] = useReducer(invoicesReducer, useLocalStorage);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    if (useThemeLocalStorage) {
      document.body.classList.add("light");
      setIsLight(true);
    } else {
      document.body.classList.remove("light");
    }
  }, [useThemeLocalStorage]);

  return (
    <InvoiceContext.Provider
      value={{
        date,
        setDate,
        itemsList,
        setItemsList,
        invoiceData,
        setInvoiceData,
        generateID,
        addInv,
        setAddInv,
        isNew,
        setIsNew,
        isEdit,
        setIsEdit,
        isDraft,
        setIsDraft,
        invoices,
        dispatch,
        filterByStatus,
        setFilterByStatus,
        final,
        setFinal,
        addItem,
        setAddItem,
        updateInvoice,
        setUpdateInvoice,
        DateFn,
        paymentDue,
        isAlert,
        setIsAlert,
        resetItemList,
        resetInvoiceData,
        isLight,
        setIsLight,
        useThemeLocalStorage,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export const useGlobalContext = () => useContext(InvoiceContext);

export { AppProvider };
