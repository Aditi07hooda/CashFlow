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

const BACKEND = Constants.expoConfig?.extra?.BACKEND;

const AddBudget = ({ stateVisibility, setStateVisibility }) => {
  const [state, setState] = useState({
    budget: stateVisibility.budget?.budget?.toString() || "",
    startDate: stateVisibility.budget?.startDate || "",
    endDate: stateVisibility.budget?.endDate || "",
    category: stateVisibility.budget?.category || null,
    description: stateVisibility.budget?.description || "",
    periodTypeValue: stateVisibility.budget?.period || "CUSTOM",
    showDatePicker: false,
    showCategoryPicker: false,
    categoryArray: [],
    selectedCategories: [],
    showPeriodTypePicker: false,
    periodTypeArrayItems: [
      { label: "Weekly", value: "WEEKLY" },
      { label: "Monthly", value: "MONTHLY" },
      { label: "Yearly", value: "YEARLY" },
      { label: "Custom", value: "CUSTOM" },
    ],
    success: false,
  });

  const handleDateChange = (date, type) => {
    const formattedDate = dayjs(date).format("DD/MM/YYYY");
    setState((prev) => ({
      ...prev,
      [type]: formattedDate,
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
        categoryArray: [{ categoryId: "all", categoryName: "All" }, ...data],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBudget = async (id) => {
    try {
      const username = await AsyncStorage.getItem("username");
      const jwt_key = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwt_key).jwtToken;
      const res = await fetch(`${BACKEND}/budget/${id}?username=${username}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (!res.ok) {
        throw new Error("Couldn't delete budget");
      }
      setState((prev) => ({
        ...prev,
        budget: 0,
        startDate: "",
        endDate: "",
        description: "",
        budgetPeriod: "",
        selectedCategories: [],
        success: true,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const updateBudget = async (id) => {
    const username = await AsyncStorage.getItem("username");
    const jwt_key = await AsyncStorage.getItem("my-key");
    const jwt = JSON.parse(jwt_key).jwtToken;
    const res = await fetch(`${BACKEND}/budget/${id}?username=${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        amount: Number(state.budget),
        username: username,
        startDate: state.startDate,
        endDate: state.endDate,
        budgetPeriod: state.periodTypeValue,
        description: state.description,
        categoryNames: state.selectedCategories.map((cat) => cat.categoryName),
      }),
    });
    if (!res.ok) {
      throw new Error("Couldn't create transaction");
    }
    const data = await res.json();
    if (data) {
      setState((prev) => ({
        ...prev,
        budget: 0,
        startDate: "",
        endDate: "",
        description: "",
        budgetPeriod: "",
        selectedCategories: [],
        success: true,
      }));
    }
    try {
    } catch (error) {
      console.error(error);
    }
  };

  const createBudget = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      const jwt_key = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwt_key).jwtToken;
      const res = await fetch(`${BACKEND}/budget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          amount: Number(state.budget),
          username: username,
          startDate: state.startDate,
          endDate: state.endDate,
          budgetPeriod: state.periodTypeValue,
          description: state.description,
          categoryNames: state.selectedCategories.map((cat) => cat.categoryName),
        }),
      });
      if (!res.ok) {
        throw new Error("Couldn't create transaction");
      }
      const data = await res.json();
      if (data) {
        setState((prev) => ({
          ...prev,
          budget: 0,
          startDate: "",
          endDate: "",
          description: "",
          budgetPeriod: "",
          selectedCategories: [],
          success: true,
        }));
      }
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
              showAddBudget: false,
            }))
          }
          className="px-1"
        >
          <Icon name="chevron-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold font-mono text-center px-1 w-fit">
          {stateVisibility.budget.id !== undefined
            ? "Update Budget"
            : "Add Budget"}
        </Text>
      </View>

      {/* Budget Input */}
      <View className="mt-8">
        <Text className="text-lg font-semibold">Budget (Rs.)</Text>
        <TextInput
          placeholder="Enter the Budget"
          keyboardType="number-pad"
          value={state.budget}
          onChangeText={(text) =>
            setState((prev) => ({ ...prev, budget: text }))
          }
          className="border border-gray-300 p-3 rounded-md mt-2 text-lg"
        />
      </View>

      {/* Start Date */}
      <View className="mt-6">
        <Text className="text-lg font-semibold">Start Date</Text>
        <TouchableOpacity
          onPress={() =>
            setState((prev) => ({ ...prev, showDatePicker: "startDate" }))
          }
          className="border border-gray-300 p-3 rounded-md mt-2"
        >
          <Text className="text-lg">
            {state.startDate || "Select Start Date"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* End Date */}
      <View className="mt-6">
        <Text className="text-lg font-semibold">End Date</Text>
        <TouchableOpacity
          onPress={() =>
            setState((prev) => ({ ...prev, showDatePicker: "endDate" }))
          }
          className="border border-gray-300 p-3 rounded-md mt-2"
        >
          <Text className="text-lg">{state.endDate || "Select End Date"}</Text>
        </TouchableOpacity>
      </View>

      {state.showDatePicker && (
        <Modal transparent={true} animationType="slide">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-5 rounded-lg shadow-lg">
              <DateTimePicker
                mode="single"
                date={new Date()}
                onChange={({ date }) =>
                  handleDateChange(date, state.showDatePicker)
                }
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

      {/* Period Picker */}
      <View className="mt-6">
        <Text className="text-lg font-semibold">Period</Text>
        <DropDownPicker
          open={state.showPeriodTypePicker}
          value={state.periodTypeValue}
          items={state.periodTypeArrayItems}
          setOpen={(open) =>
            setState((prev) => ({ ...prev, showPeriodTypePicker: open }))
          }
          setValue={(callback) =>
            setState((prev) => ({
              ...prev,
              periodTypeValue: callback(prev.periodTypeValue),
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
            {state.selectedCategories?.length > 0
              ? state.selectedCategories
                  .map((cat) => cat.categoryName)
                  .join(", ")
              : "Select Categories"}
          </Text>
        </TouchableOpacity>
      </View>

      {state.showCategoryPicker && (
        <Modal transparent={true} animationType="slide">
          <View className="flex-1 justify-end bg-black/50">
            <View className="h-3/4 bg-white p-5 rounded-t-lg shadow-lg">
              <FlatList
                data={state.categoryArray || []}
                keyExtractor={(item) => item?.categoryId?.toString()}
                numColumns={3}
                renderItem={({ item }) => {
                  const isSelected = state.selectedCategories?.some(
                    (cat) => cat.categoryId === item.categoryId
                  );

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setState((prev) => {
                          const selectedCategories = isSelected
                            ? prev.selectedCategories.filter(
                                (cat) => cat.categoryId !== item.categoryId
                              )
                            : [...prev.selectedCategories, item]; // Add the entire item object
                          return {
                            ...prev,
                            selectedCategories,
                          };
                        });
                      }}
                      className={`m-2 p-3 rounded-md flex items-center ${
                        isSelected ? "bg-blue-200" : "bg-gray-200"
                      }`}
                    >
                      <Image
                        resizeMode="contain"
                        className="h-8 w-8 mb-2"
                        source={categoryFunc(item.categoryName) || ""}
                      />
                      <Text>{item.categoryName}</Text>
                    </TouchableOpacity>
                  );
                }}
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

      {/* Description */}
      <View className="mt-6">
        <Text className="text-lg font-semibold">Description</Text>
        <TextInput
          placeholder="Enter description"
          value={state.description}
          onChangeText={(text) =>
            setState((prev) => ({ ...prev, description: text }))
          }
          className="border border-gray-300 p-3 rounded-md mt-2 text-lg"
          multiline={true}
        />
      </View>

      {/* Save Button */}
      <View className="mt-6 flex flex-row justify-between">
        <CustomButton
          title={
            stateVisibility.budget.id !== undefined
              ? "Update Budget"
              : "Add Budget"
          }
          style="bg-blue-500 mx-0"
          onClick={() => {
            if (stateVisibility.budget.id !== undefined) {
              updateBudget(stateVisibility.budget.id);
            } else {
              createBudget();
            }
          }}
        />
        {stateVisibility.budget.id && (
          <TouchableOpacity
            onPress={() => deleteBudget(stateVisibility.budget.id)}
          >
            <Icon
              name="trash-o"
              size={20}
              color={"white"}
              className="bg-red-500 rounded-lg p-3 font-bold"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default AddBudget;
