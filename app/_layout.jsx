import React from "react";
import "../global.css";
import IndexScreen from "./Index";
import AuthScreens from "./(auth)/_layout";
import TabScreens from "./(tabs)/_layout";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Layout() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Index"
        options={{ headerShown: false }}
        component={IndexScreen}
      />
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false }}
        component={AuthScreens}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
        component={TabScreens}
      />
    </Stack.Navigator>
  );
}
