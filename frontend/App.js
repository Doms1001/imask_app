import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { useFonts, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { View, ActivityIndicator } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#FF423D" />
      </View>
    );
  }

  return <AppNavigator />;
}
