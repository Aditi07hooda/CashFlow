import CustomButton from "@/components/CustomButton";
import InputFormField from "@/components/InputFormField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { getCookie } from "@/scripts/cookie";

const BACKEND = Constants.expoConfig?.extra?.BACKEND;

export default function Signup() {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
  });

  const inputValidation = () => {
    const { email, password, username, confirmPassword } = state;

    if (username.trim() === "") {
      setState((prev) => ({ ...prev, error: "Username is required" }));
      return false;
    }

    if (username.length <= 3) {
      setState({
        ...state,
        error: "Username must be at least 4 characters long",
      });
      return false;
    }

    if (email.trim() === "" && password.trim() === "") {
      setState((prev) => ({
        ...prev,
        error: "Email and Password are required",
      }));
      return false;
    }

    if (email.trim() === "") {
      setState((prev) => ({ ...prev, error: "Email is required" }));
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setState((prev) => ({ ...prev, error: "Invalid email format" }));
      return false;
    }

    if (password.trim() === "") {
      setState((prev) => ({ ...prev, error: "Password is required" }));
      return false;
    }

    if (password.length < 8) {
      setState((prev) => ({
        ...prev,
        error: "Password must be at least 8 characters",
      }));
      return false;
    }

    if (confirmPassword.trim() === "") {
      setState((prev) => ({ ...prev, error: "Confirm Password is required" }));
      return false;
    }

    if (confirmPassword !== password) {
      setState((prev) => ({ ...prev, error: "Passwords do not match" }));
      return false;
    }

    setState((prev) => ({ ...prev, error: "" }));
    return true;
  };

  const handleRegister = async () => {
    if (!inputValidation()) return;

    console.log("Register");

    try {
      const res = await fetch(`${BACKEND}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: state.username,
          password: state.password,
          email: state.email,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        setState((prev) => ({
          ...prev,
          error: "Error logging in. Please try again.",
        }));
        throw new Error("Failed to log in");
      }

      const data = await res.json();
      const cookie = getCookie(res.headers.map);

      console.log("Login successful:", data);

      console.log("JWT Token: ", cookie.jwtToken);
      console.log("Expiry Date: ", cookie.expiryDate);

      await AsyncStorage.setItem("my-key", JSON.stringify(cookie));
      await AsyncStorage.setItem("email", data.email);
      await AsyncStorage.setItem("username", data.username);

      router.replace("/(tabs)/Home");
    } catch (error) {
      console.error("Login error:", error);
      setState((prev) => ({
        ...prev,
        error: "Invalid email or password",
      }));
    }
  };

  return (
    <LinearGradient
      colors={["#ffffff", "#a5f3fc"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="h-full m-5">
        <View className="h-[96%] flex justify-center align-middle">
          <View>
            <Text className="text-3xl font-extrabold font-mono text-left tracking-wide leading-snug">
              Welcome!
            </Text>
            <Text className="text-3xl font-extrabold font-mono text-left tracking-wide leading-snug">
              Let's Manage Your Finances
            </Text>
          </View>

          <View className="flex gap-4 flex-col mt-5">
            <InputFormField
              title="User Name"
              placeholder="Enter your username"
              keyboardType="text"
              onChange={(e) => setState((prev) => ({ ...prev, username: e }))}
            />
            <InputFormField
              title="Email ID"
              placeholder="Enter your Email ID"
              keyboardType="email-address"
              onChange={(e) => setState((prev) => ({ ...prev, email: e }))}
            />
            <InputFormField
              title="Password"
              placeholder="Enter your Password"
              secureTextEntry={true}
              onChange={(e) => setState((prev) => ({ ...prev, password: e }))}
            />
            <InputFormField
              title="Confirm Password"
              placeholder="Enter your Password again"
              secureTextEntry={true}
              onChange={(e) =>
                setState((prev) => ({ ...prev, confirmPassword: e }))
              }
            />
          </View>

          {state.error && (
            <View className="mt-5">
              <Text className="text-red-600 text-center">{state.error}</Text>
            </View>
          )}

          <View className="mt-10 w-fit">
            <CustomButton
              title="Sign In"
              onClick={() => {
                handleRegister();
              }}
            />
          </View>
          <View className="mt-3 w-fit flex flex-row gap-2 justify-center items-center">
            <Text className="text-sm text-gray-600">Do have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/Signin")}>
              <Text className="text-base font-normal text-[#f87171]">
                SignIn!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
