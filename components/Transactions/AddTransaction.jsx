import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useFocusEffect } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import { categoryFunc } from "../../assets/category";
import CustomButton from "../CustomButton";
import Icon from "react-native-vector-icons/FontAwesome";
import { formatDate } from "@/scripts/analytics";

const BACKEND = Constants.expoConfig?.extra?.BACKEND;

const AddTransaction = ({ stateVisibility, setStateVisibility }) => {
  const [state, setState] = useState({
    amount: stateVisibility.trans?.amount?.toString() || "",
    transactionDate: stateVisibility.trans?.transactionDate || "",
    category: stateVisibility.trans?.category || null,
    note: stateVisibility.trans?.note || "",
    showDatePicker: false,
    showCategoryPicker: false,
    showAccountTypePicker: false,
    showTransactionTypePicker: false,
    categoryArray: [],
    transactionTypeArrayItems: [
      { label: "Expense", value: "EXPENSE" },
      { label: "Income", value: "INCOME" },
    ],
    accountTypeArrayItems: [
      { label: "Cash", value: "CASH" },
      { label: "UPI", value: "UPI" },
      { label: "Card", value: "CARD" },
    ],
    accountTypeValue: stateVisibility.trans?.accountType || "",
    transactionTypeValue: stateVisibility.trans?.transactionType || "EXPENSE",
    success: false,
  });

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format("DD/MM/YYYY");
    setSelectedDate(date);
    setState((prev) => ({
      ...prev,
      transactionDate: formattedDate,
      showDatePicker: false,
    }));
  };

  const fetchCategory = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      const jwt_key = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwt_key).jwtToken;
      const res = await fetch(`${BACKEND}/category?username=${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!res.ok) {
        throw new Error("Couldn't fetch category");
      }
      const data = await res.json();
      setState((prev) => ({
        ...prev,
        categoryArray: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const createTransaction = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      const jwt_key = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwt_key).jwtToken;
      const res = await fetch(`${BACKEND}/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          username,
          category: state.category.categoryName,
          amount: Number(state.amount),
          transactionDate: state.transactionDate,
          transactionType: state.transactionTypeValue,
          note: state.note,
          accountType: state.accountTypeValue,
        }),
      });
      if (!res.ok) {
        throw new Error("Couldn't create transaction");
      }
      const data = await res.json();
      if (data) {
        setState((prev) => ({
          ...prev,
          amount: 0,
          transactionDate: "",
          transactionTypeValue: "EXPENSE",
          note: "",
          category: null,
          success: true,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateTransaction = async (id) => {
    try {
      const username = await AsyncStorage.getItem("username");
      const jwt_key = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwt_key).jwtToken;
      const date = formatDate(new Date(state.transactionDate))
      const res = await fetch(`${BACKEND}/transaction/${id}?username=${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          username,
          category: state.category.categoryName,
          amount: Number(state.amount),
          transactionDate: date,
          transactionType: state.transactionTypeValue,
          note: state.note,
          accountType: state.accountTypeValue,
        }),
      });
      if (!res.ok) {
        throw new Error("Couldn't create transaction");
      }
      const data = await res.json();
      if (data) {
        setState((prev) => ({
          ...prev,
          amount: 0,
          transactionDate: "",
          transactionTypeValue: "EXPENSE",
          note: "",
          category: null,
          success: true,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const username = await AsyncStorage.getItem("username");
      const jwt_key = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwt_key).jwtToken;
      const res = await fetch(
        `${BACKEND}/transaction/${id}?username=${username}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Couldn't delete transaction");
      }
      setState((prev) => ({
        ...prev,
        amount: 0,
        transactionDate: "",
        transactionTypeValue: "EXPENSE",
        note: "",
        category: null,
        success: true,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategory();
    }, [])
  );

  return (
    <View className="p-4 h-full bg-gray-50">
      <View className="flex flex-row w-fit gap-16">
        <TouchableOpacity
          onPress={() =>
            setStateVisibility((prev) => ({
              ...prev,
              showAddTransaction: false,
            }))
          }
          className="px-1"
        >
          <Icon name="chevron-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold font-mono text-center px-1 w-fit">
          {stateVisibility.trans !== null ? "Transaction" : "Add Transaction"}
        </Text>
      </View>

      {/* Amount Input */}
      <View className="mt-8">
        <Text className="text-lg font-semibold">Amount (Rs.)</Text>
        <TextInput
          placeholder="Enter the Amount"
          keyboardType="number-pad"
          value={state.amount}
          onChangeText={(text) =>
            setState((prev) => ({ ...prev, amount: text }))
          }
          className="border border-gray-300 p-3 rounded-md mt-2 text-lg"
        />
      </View>

      {/* Transaction Date */}
      <View className="mt-6">
        <Text className="text-lg font-semibold">Transaction Date</Text>
        <TouchableOpacity
          onPress={() =>
            setState((prev) => ({ ...prev, showDatePicker: true }))
          }
          className="border border-gray-300 p-3 rounded-md mt-2"
        >
          <Text className="text-lg">
            {state.transactionDate || "Select a date"}
          </Text>
        </TouchableOpacity>

        {state.showDatePicker && (
          <Modal transparent={true} animationType="slide">
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white p-5 rounded-lg shadow-lg">
                <DateTimePicker
                  mode="single"
                  date={selectedDate || new Date()}
                  onChange={({ date }) => handleDateChange(date)}
                  todayContainerStyle="rounded-full"
                  todayTextStyle="text-black font-bold"
                  selectedItemColor="#f87171"
                  selectedTextStyle="text-white font-bold"
                  maxDate={new Date()}
                />
                <TouchableOpacity
                  onPress={() =>
                    setState((prev) => ({ ...prev, showDatePicker: false }))
                  }
                  className="mt-4 bg-red-500 py-3 rounded-md"
                >
                  <Text className="text-white text-center text-lg">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>

      {/* Transaction Type Picker */}
      <View className="mt-6">
        <Text className="text-lg font-semibold">Transaction Type</Text>
        <DropDownPicker
          open={state.showTransactionTypePicker}
          value={state.transactionTypeValue}
          items={state.transactionTypeArrayItems}
          setOpen={(open) =>
            setState((prev) => ({ ...prev, showTransactionTypePicker: open }))
          }
          setValue={(callback) =>
            setState((prev) => ({
              ...prev,
              transactionTypeValue: callback(prev.transactionTypeValue),
            }))
          }
          className="mt-2 border-gray-300"
          dropDownContainerClassName="border border-gray-300 rounded-md bg-white"
        />
      </View>

      {/* Category Picker */}
      <View className="mt-6">
        <Text className="text-lg font-semibold">Category</Text>
        <TouchableOpacity
          onPress={() =>
            setState((prev) => ({ ...prev, showCategoryPicker: true }))
          }
          className="border border-gray-300 p-3 rounded-md mt-2"
        >
          <Text className="text-lg">
            {state.category?.categoryName || "Select a category"}
          </Text>
        </TouchableOpacity>

        {state.showCategoryPicker && (
          <Modal transparent={true} animationType="slide">
            <View className="flex-1 justify-end bg-black/50">
              <View className="h-3/4 bg-white p-5 rounded-t-lg shadow-lg">
                <Text className="text-lg text-center font-medium mb-4">
                  Categories
                </Text>
                <FlatList
                  data={state.categoryArray || []}
                  keyExtractor={(item) => item?.categoryId?.toString()}
                  numColumns={3}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() =>
                        setState((prev) => ({
                          ...prev,
                          category: item,
                          showCategoryPicker: false,
                        }))
                      }
                      className="m-2 p-3 bg-gray-200 rounded-md flex items-center"
                    >
                      <Image
                        resizeMode="contain"
                        className="h-8 w-8 mb-2"
                        source={categoryFunc(item.categoryName) || ""}
                      />
                      <Text className="text-sm text-center">
                        {item.categoryName || "Unnamed Category"}
                      </Text>
                    </TouchableOpacity>
                  )}
                />

                <TouchableOpacity
                  onPress={() =>
                    setState((prev) => ({
                      ...prev,
                      showCategoryPicker: false,
                    }))
                  }
                  className="mt-4 bg-red-500 py-3 rounded-md"
                >
                  <Text className="text-white text-center text-lg">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>

      {/* Account Type Picker */}
      <View className="mt-6">
        <Text className="text-lg font-semibold">Account</Text>
        <DropDownPicker
          open={state.showAccountTypePicker}
          value={state.accountTypeValue}
          items={state.accountTypeArrayItems}
          setOpen={(open) =>
            setState((prev) => ({ ...prev, showAccountTypePicker: open }))
          }
          setValue={(callback) =>
            setState((prev) => ({
              ...prev,
              accountTypeValue: callback(prev.accountTypeValue),
            }))
          }
          className="mt-2 border-gray-300"
          dropDownContainerClassName="border border-gray-300 rounded-md bg-white"
        />
      </View>

      {/* note */}
      <View className="mt-5">
        <Text className="text-lg font-semibold">Additional Note</Text>
        <TextInput
          placeholder="Enter the note"
          value={state.note}
          onChangeText={(text) => setState((prev) => ({ ...prev, note: text }))}
          className="border border-gray-300 p-3 rounded-md mt-2 text-lg"
        />
      </View>

      <View className="mt-2">
        {stateVisibility.trans !== null ? (
          <View>
            {state.success && (
              <View className="rounded-lg mb-3">
                <Text className="text-red-500 text-center">
                  Transaction deleted successfully!!
                </Text>
              </View>
            )}
            <View className="flex flex-row justify-between mt-6">
              <CustomButton
                title="Update"
                onClick={() => updateTransaction(stateVisibility.trans.id)}
                style="bg-green-500"
              />
              <TouchableOpacity
                onPress={() => deleteTransaction(stateVisibility.trans.id)}
              >
                <Icon
                  name="trash-o"
                  size={20}
                  color={"white"}
                  className="bg-red-500 rounded-lg p-3 font-bold"
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            {state.success && (
              <View className="mt-2">
                <Text className="text-center text-green-500">
                  Transaction successfully added!!
                </Text>
              </View>
            )}
            <CustomButton
              title="Add"
              onClick={createTransaction}
              style="mt-6"
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default AddTransaction;
