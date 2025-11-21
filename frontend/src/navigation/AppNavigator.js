// frontend/src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingScreen from "../screens/OnboardingScreen";
import FillupScreen from "../screens/FillupScreen";
import WelcomingDept from "../screens/welcomingdept";
import Departments from "../screens/Departments";

import CCSF1 from "../screens/CCS/CCSF1";
import CCSF2 from "../screens/CCS/CCSF2";
import CCSF3 from "../screens/CCS/CCSF3";
import CCSF4 from "../screens/CCS/CCSF4";

// Newly added target screens for the CCSF3 cards
import CCSF5 from "../screens/CCS/CCSF5";
import CCSF6 from "../screens/CCS/CCSF6";
import CCSF7 from "../screens/CCS/CCSF7";

// Screens for the three middle cards in CCSF4
import CCSF8 from "../screens/CCS/CCSF8";
import CCSF9 from "../screens/CCS/CCSF9";
import CCSF10 from "../screens/CCS/CCSF10";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          animationDuration: 350,
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Fillup" component={FillupScreen} />
        <Stack.Screen name="welcomingdept" component={WelcomingDept} />
        <Stack.Screen name="Departments" component={Departments} />

        {/* CCS screens */}
        <Stack.Screen name="CCSF1" component={CCSF1} />
        <Stack.Screen name="CCSF2" component={CCSF2} />
        <Stack.Screen name="CCSF3" component={CCSF3} />
        <Stack.Screen name="CCSF4" component={CCSF4} />

        {/* New screens opened from CCSF3 cards */}
        <Stack.Screen name="CCSF5" component={CCSF5} />
        <Stack.Screen name="CCSF6" component={CCSF6} />
        <Stack.Screen name="CCSF7" component={CCSF7} />

        {/* Screens opened from CCSF4 middle cards */}
        <Stack.Screen name="CCSF8" component={CCSF8} />
        <Stack.Screen name="CCSF9" component={CCSF9} />
        <Stack.Screen name="CCSF10" component={CCSF10} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
