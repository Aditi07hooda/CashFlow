import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import CustomButton from "../CustomButton";
import Icon from "react-native-vector-icons/FontAwesome";

const BACKEND = Constants.expoConfig?.extra?.BACKEND;

const AddNote = ({ stateVisibility, setStateVisibility }) => {
  const [state, setState] = useState({
    note: stateVisibility?.note || "",
    success: false,
    loading: false,
  });

  const handleAPIError = (error) => {
    console.error(error);
    Alert.alert("Error", "Something went wrong. Please try again later.");
  };

  const handleSuccess = (message) => {
    Alert.alert("Success", message);
    setState((prev) => ({
      ...prev,
      note: "",
      success: true,
      loading: false,
    }));
    setStateVisibility((prev) => ({
      ...prev,
      showAddNote: false,
    }));
  };

  const updateNote = async (id) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const username = await AsyncStorage.getItem("username");
      const jwt_key = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwt_key).jwtToken;

      const res = await fetch(`${BACKEND}/notes/${id}?username=${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ note: state.note }),
      });

      if (!res.ok) throw new Error("Couldn't update note");

      handleSuccess("Note updated successfully!");
    } catch (error) {
      handleAPIError(error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const createNote = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const username = await AsyncStorage.getItem("username");
      const jwt_key = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwt_key).jwtToken;

      const res = await fetch(`${BACKEND}/notes?username=${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ note: state.note }),
      });

      if (!res.ok) throw new Error("Couldn't create note");

      handleSuccess("Note created successfully!");
    } catch (error) {
      handleAPIError(error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const deleteNote = async (id) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const username = await AsyncStorage.getItem("username");
      const jwt_key = await AsyncStorage.getItem("my-key");
      const jwt = JSON.parse(jwt_key).jwtToken;

      const res = await fetch(`${BACKEND}/notes/${id}?username=${username}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!res.ok) throw new Error("Couldn't delete note");

      handleSuccess("Note deleted successfully!");
    } catch (error) {
      handleAPIError(error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <View className="p-4 h-full bg-gray-50">
      {/* Header */}
      <View className="flex flex-row w-fit gap-16 items-center">
        <TouchableOpacity
          onPress={() =>
            setStateVisibility((prev) => ({ ...prev, showAddNote: false }))
          }
          className="px-1"
        >
          <Icon name="chevron-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold font-mono text-center px-1 w-fit">
          {stateVisibility?.note?.id !== undefined ? "Update Note" : "Add Note"}
        </Text>
      </View>

      {/* Note Input */}
      <View className="mt-6">
        <Text className="text-lg font-semibold">Note</Text>
        <TextInput
          placeholder="Enter note"
          value={state.note?.note}
          onChangeText={(text) => setState((prev) => ({ ...prev, note: text }))}
          className="border border-gray-300 p-3 rounded-md mt-2 text-lg"
          multiline={true}
        />
      </View>

      {/* Action Buttons */}
      <View className="mt-6 flex flex-row justify-between items-center">
        <CustomButton
          title={
            stateVisibility?.note?.id !== undefined ? "Update Note" : "Add Note"
          }
          style="bg-blue-500 mx-0"
          onClick={() => {
            if (stateVisibility?.note?.id !== undefined) {
              updateNote(stateVisibility?.note?.id);
            } else {
              createNote();
            }
          }}
        />
        {stateVisibility?.note?.id && (
          <TouchableOpacity
            onPress={() => deleteNote(stateVisibility?.note?.id)}
            className="bg-red-500 rounded-lg p-3"
          >
            <Icon name="trash-o" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading Indicator */}
      {state.loading && (
        <View className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 flex justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </View>
  );
};

export default AddNote;