import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const BACKEND = Constants.expoConfig?.extra?.BACKEND;

export const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    console.error("Invalid date passed to formatDate:", date);
    return "";
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const fetchTransaction = async (state, setState) => {
  try {
    const jwtFetch = await AsyncStorage.getItem("my-key");
    const jwt = JSON.parse(jwtFetch).jwtToken;
    const username = await AsyncStorage.getItem("username");
    console.log("formatted date ",
      formatDate(state.selectDateRange.minDate),
      formatDate(state.selectDateRange.maxDate)
    );
    const res = await fetch(
      `${BACKEND}/transactions/dates/between?username=${username}&dateMin=${formatDate(
        state.selectDateRange.minDate
      )}&dateMax=${formatDate(state.selectDateRange.maxDate)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error("error fetching transaction in range");
    }
    const data = await res.json();

    if (state.transactionType === "ALL") {
      const filteredTransactions = data;
      setState((prev) => ({
        ...prev,
        transactions: filteredTransactions,
      }));
      return;
    } else {
      const filteredTransactions = data.filter(
        (transaction) =>
          transaction.transactionType.toUpperCase() ===
          state.transactionType.toUpperCase()
      );
      setState((prev) => ({
        ...prev,
        transactions: filteredTransactions,
      }));
    }
  } catch (error) {
    console.error(error);
  }
};

export const changeDateOptions = (type, now, setState) => {
  if (type === "Day") {
    setState((prev) => ({
      ...prev,
      selectedDateType: "Day",
      date: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
      selectDateRange: {
        minDate: now,
        maxDate: now,
      },
    }));
  } else if (type === "Month") {
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setState((prev) => ({
      ...prev,
      selectedDateType: "Month",
      date: 1,
      selectDateRange: {
        minDate: firstDayOfMonth,
        maxDate: lastDayOfMonth,
      },
    }));
  } else if (type === "Year") {
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(now.getFullYear(), 11, 31);
    setState((prev) => ({
      ...prev,
      selectedDateType: "Year",
      date: 1,
      month: 0,
      selectDateRange: {
        minDate: firstDayOfYear,
        maxDate: lastDayOfYear,
      },
    }));
  }
};

export const changeDate = (direction, state, setState) => {
  const now = new Date();
  if (state.selectedDateType === "Day") {
    const newDate = new Date(
      state.year,
      state.month,
      state.date + (direction === "prev" ? -1 : 1)
    );
    if (newDate <= now) {
      setState((prev) => ({
        ...prev,
        date: newDate.getDate(),
        month: newDate.getMonth(),
        year: newDate.getFullYear(),
        selectDateRange: {
          minDate: newDate,
          maxDate: newDate,
        },
      }));
    }
  } else if (state.selectedDateType === "Month") {
    const newDate = new Date(
      state.year,
      state.month + (direction === "prev" ? -1 : 1),
      1
    );
    if (newDate <= now) {
      setState((prev) => ({
        ...prev,
        month: newDate.getMonth(),
        year: newDate.getFullYear(),
        selectDateRange: {
          minDate: new Date(newDate.getFullYear(), newDate.getMonth(), 1),
          maxDate: new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0),
        },
      }));
    }
  } else if (state.selectedDateType === "Year") {
    const newYear = state.year + (direction === "prev" ? -1 : 1);
    if (newYear <= now.getFullYear()) {
      setState((prev) => ({
        ...prev,
        year: newYear,
        selectDateRange: {
          minDate: new Date(newYear, 0, 1),
          maxDate: new Date(newYear, 11, 31),
        },
      }));
    }
  }
};
