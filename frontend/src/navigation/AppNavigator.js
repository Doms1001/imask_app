// frontend/src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OnboardingScreen from "../screens/OnboardingScreen";
import FillupScreen from "../screens/FillupScreen";
import WelcomingDept from "../screens/welcomingdept";
import Departments from "../screens/Departments";

/* ================================
   CCS (1–10)
================================ */
import CCSF1 from "../screens/CCS/CCSF1";
import CCSF2 from "../screens/CCS/CCSF2";
import CCSF3 from "../screens/CCS/CCSF3";
import CCSF4 from "../screens/CCS/CCSF4";
import CCSF5 from "../screens/CCS/CCSF5";
import CCSF6 from "../screens/CCS/CCSF6";
import CCSF7 from "../screens/CCS/CCSF7";
import CCSF8 from "../screens/CCS/CCSF8";
import CCSF9 from "../screens/CCS/CCSF9";
import CCSF10 from "../screens/CCS/CCSF10";

/* ================================
   CAS (1–10)
================================ */
import CASF1 from "../screens/CAS/CASF1";
import CASF2 from "../screens/CAS/CASF2";
import CASF3 from "../screens/CAS/CASF3";
import CASF4 from "../screens/CAS/CASF4";
import CASF5 from "../screens/CAS/CASF5";
import CASF6 from "../screens/CAS/CASF6";
import CASF7 from "../screens/CAS/CASF7";
import CASF8 from "../screens/CAS/CASF8";
import CASF9 from "../screens/CAS/CASF9";
import CASF10 from "../screens/CAS/CASF10";

/* ================================
   CBA (1–10)
================================ */
import CBAF1 from "../screens/CBA/CBAF1";
import CBAF2 from "../screens/CBA/CBAF2";
import CBAF3 from "../screens/CBA/CBAF3";
import CBAF4 from "../screens/CBA/CBAF4";
import CBAF5 from "../screens/CBA/CBAF5";
import CBAF6 from "../screens/CBA/CBAF6";
import CBAF7 from "../screens/CBA/CBAF7";
import CBAF8 from "../screens/CBA/CBAF8";
import CBAF9 from "../screens/CBA/CBAF9";
import CBAF10 from "../screens/CBA/CBAF10";

/* ================================
   CCJ (1–10)
================================ */
import CCJF1 from "../screens/CCJ/CCJF1";
import CCJF2 from "../screens/CCJ/CCJF2";
import CCJF3 from "../screens/CCJ/CCJF3";
import CCJF4 from "../screens/CCJ/CCJF4";
import CCJF5 from "../screens/CCJ/CCJF5";
import CCJF6 from "../screens/CCJ/CCJF6";
import CCJF7 from "../screens/CCJ/CCJF7";
import CCJF8 from "../screens/CCJ/CCJF8";
import CCJF9 from "../screens/CCJ/CCJF9";
import CCJF10 from "../screens/CCJ/CCJF10";

/* ================================
   COA (1–10)
================================ */
import COAF1 from "../screens/COA/COAF1";
import COAF2 from "../screens/COA/COAF2";
import COAF3 from "../screens/COA/COAF3";
import COAF4 from "../screens/COA/COAF4";
import COAF5 from "../screens/COA/COAF5";
import COAF6 from "../screens/COA/COAF6";
import COAF7 from "../screens/COA/COAF7";
import COAF8 from "../screens/COA/COAF8";
import COAF9 from "../screens/COA/COAF9";
import COAF10 from "../screens/COA/COAF10";

/* ================================
   COE (1–10)
================================ */
import COEF1 from "../screens/COE/COEF1";
import COEF2 from "../screens/COE/COEF2";
import COEF3 from "../screens/COE/COEF3";
import COEF4 from "../screens/COE/COEF4";
import COEF5 from "../screens/COE/COEF5";
import COEF6 from "../screens/COE/COEF6";
import COEF7 from "../screens/COE/COEF7";
import COEF8 from "../screens/COE/COEF8";
import COEF9 from "../screens/COE/COEF9";
import COEF10 from "../screens/COE/COEF10";

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
        {/* Core flows */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Fillup" component={FillupScreen} />

        {/* Register WelcomingDept under both casings */}
        <Stack.Screen name="WelcomingDept" component={WelcomingDept} />
        <Stack.Screen name="welcomingdept" component={WelcomingDept} />

        <Stack.Screen name="Departments" component={Departments} />

        {/* CCS */}
        <Stack.Screen name="CCSF1" component={CCSF1} />
        <Stack.Screen name="CCSF2" component={CCSF2} />
        <Stack.Screen name="CCSF3" component={CCSF3} />
        <Stack.Screen name="CCSF4" component={CCSF4} />
        <Stack.Screen name="CCSF5" component={CCSF5} />
        <Stack.Screen name="CCSF6" component={CCSF6} />
        <Stack.Screen name="CCSF7" component={CCSF7} />
        <Stack.Screen name="CCSF8" component={CCSF8} />
        <Stack.Screen name="CCSF9" component={CCSF9} />
        <Stack.Screen name="CCSF10" component={CCSF10} />

        {/* CAS */}
        <Stack.Screen name="CASF1" component={CASF1} />
        <Stack.Screen name="CASF2" component={CASF2} />
        <Stack.Screen name="CASF3" component={CASF3} />
        <Stack.Screen name="CASF4" component={CASF4} />
        <Stack.Screen name="CASF5" component={CASF5} />
        <Stack.Screen name="CASF6" component={CASF6} />
        <Stack.Screen name="CASF7" component={CASF7} />
        <Stack.Screen name="CASF8" component={CASF8} />
        <Stack.Screen name="CASF9" component={CASF9} />
        <Stack.Screen name="CASF10" component={CASF10} />

        {/* CBA */}
        <Stack.Screen name="CBAF1" component={CBAF1} />
        <Stack.Screen name="CBAF2" component={CBAF2} />
        <Stack.Screen name="CBAF3" component={CBAF3} />
        <Stack.Screen name="CBAF4" component={CBAF4} />
        <Stack.Screen name="CBAF5" component={CBAF5} />
        <Stack.Screen name="CBAF6" component={CBAF6} />
        <Stack.Screen name="CBAF7" component={CBAF7} />
        <Stack.Screen name="CBAF8" component={CBAF8} />
        <Stack.Screen name="CBAF9" component={CBAF9} />
        <Stack.Screen name="CBAF10" component={CBAF10} />

        {/* CCJ */}
        <Stack.Screen name="CCJF1" component={CCJF1} />
        <Stack.Screen name="CCJF2" component={CCJF2} />
        <Stack.Screen name="CCJF3" component={CCJF3} />
        <Stack.Screen name="CCJF4" component={CCJF4} />
        <Stack.Screen name="CCJF5" component={CCJF5} />
        <Stack.Screen name="CCJF6" component={CCJF6} />
        <Stack.Screen name="CCJF7" component={CCJF7} />
        <Stack.Screen name="CCJF8" component={CCJF8} />
        <Stack.Screen name="CCJF9" component={CCJF9} />
        <Stack.Screen name="CCJF10" component={CCJF10} />

        {/* COA */}
        <Stack.Screen name="COAF1" component={COAF1} />
        <Stack.Screen name="COAF2" component={COAF2} />
        <Stack.Screen name="COAF3" component={COAF3} />
        <Stack.Screen name="COAF4" component={COAF4} />
        <Stack.Screen name="COAF5" component={COAF5} />
        <Stack.Screen name="COAF6" component={COAF6} />
        <Stack.Screen name="COAF7" component={COAF7} />
        <Stack.Screen name="COAF8" component={COAF8} />
        <Stack.Screen name="COAF9" component={COAF9} />
        <Stack.Screen name="COAF10" component={COAF10} />

        {/* COE */}
        <Stack.Screen name="COEF1" component={COEF1} />
        <Stack.Screen name="COEF2" component={COEF2} />
        <Stack.Screen name="COEF3" component={COEF3} />
        <Stack.Screen name="COEF4" component={COEF4} />
        <Stack.Screen name="COEF5" component={COEF5} />
        <Stack.Screen name="COEF6" component={COEF6} />
        <Stack.Screen name="COEF7" component={COEF7} />
        <Stack.Screen name="COEF8" component={COEF8} />
        <Stack.Screen name="COEF9" component={COEF9} />
        <Stack.Screen name="COEF10" component={COEF10} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
