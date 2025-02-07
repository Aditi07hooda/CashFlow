import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DoubleUpButton from "../components/DoubleUpArrow";
import { LinearGradient } from "expo-linear-gradient";
import icons from "../assets/icons";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";

const Index = () => {

  const navigateUp = (e) => {
    const { translationY } = e.nativeEvent;
    if (translationY < 100) {
      router.replace("/(auth)/Signin")
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#ffffff", "#a5f3fc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          <PanGestureHandler onGestureEvent={navigateUp}>
            <View className="flex flex-col m-5 mt-32 flex-1">
              <Text className="text-4xl font-extrabold font-mono text-left tracking-wide leading-snug">
                Manage Your Finance Right Now
              </Text>
              <Text className="font-medium font-mono mt-1 w-4/5 leading-6 tracking-wide text-gray-400">
                Take charge of your finances—track, save, and grow smarter with Money Manager!
              </Text>
              <ImageBackground
                source={icons.LandingScreenImage}
                resizeMode="contain"
                className="flex-1 items-center justify-end w-full h-72 rounded-lg overflow-hidden"
              >
                <View className="bg-gray-600 bg-opacity-40 p-2 rounded-lg absolute bottom-5 left-1/4 right-1/4">
                  <Text className="text-white font-semibold text-center">
                    Finance Simplified
                  </Text>
                </View>
              </ImageBackground>
              <View className="mt-24 mx-7 items-center">
                <TouchableOpacity
                  onPress={() => router.replace("/(auth)/Signin")}
                >
                  <DoubleUpButton />
                </TouchableOpacity>
              </View>
            </View>
          </PanGestureHandler>
        </SafeAreaView>
        <StatusBar backgroundColor="#161622" style="light" />
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default Index;
