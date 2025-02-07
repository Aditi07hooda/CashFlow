import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import Analytics from "./Analytics";
import Profile from "./Profile";
import Transactions from "./Transactions";
import Icon from "react-native-vector-icons/FontAwesome";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

const Tabs = createBottomTabNavigator();

const TabIcons = ({ iconName, focused }) => {
  return (
    <View className={`rounded-md`}>
      <Icon
        name={iconName}
        size={focused ? 28 : 20}
        color={focused ? "#f87171" : "#000"}
      />
    </View>
  );
};

const TabsLayout = () => (
  <>
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#f87171",
        tabBarStyle: {
          backgroundColor: "#a5f3fc",
          width: "100%",
          height: "7%",
        },
      }}
    >
      <Tabs.Screen
        name="HomeTab"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcons iconName="home" focused={focused} />
          ),
          headerShown: false,
        }}
        component={Home}
      />
      <Tabs.Screen
        name="Transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ focused }) => (
            <TabIcons iconName="book" focused={focused} />
          ),
          headerShown: false,
        }}
        component={Transactions}
      />
      <Tabs.Screen
        name="Analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ focused }) => (
            <TabIcons iconName="pie-chart" focused={focused} />
          ),
          headerShown: false,
        }}
        component={Analytics}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcons iconName="user-circle-o" focused={focused} />
          ),
          headerShown: false,
        }}
        component={Profile}
      />
    </Tabs.Navigator>
    <StatusBar backgroundColor="#161622" style="light" />
  </>
);

export default TabsLayout;
