// import { useColorScheme } from "@/hooks/use-color-scheme";
// import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import "react-native-reanimated";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { AuthProvider } from "../components/authContext";

// export const unstable_settings = {
//   anchor: "screens",
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <SafeAreaProvider>
//       <AuthProvider>
//         <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//           <Stack screenOptions={{ headerShown: false }}>
//             {/* ✅ Define your real screens here */}
//             <Stack.Screen name="screens/login" />
//             <Stack.Screen name="screens/register" />
//             <Stack.Screen name="screens/forgotpassword" />
//             <Stack.Screen name="screens/verifyEmail" />
//             <Stack.Screen name="screens/dashboardscreen" />
//             <Stack.Screen name="screens/ChangePassword" />
//           </Stack>
//           <StatusBar style="auto" />
//         </ThemeProvider>
//       </AuthProvider>
//     </SafeAreaProvider>
//   );
// }


// import { useColorScheme } from "@/hooks/use-color-scheme";
// import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import "react-native-reanimated";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { AuthProvider } from "../components/authContext";

// export const unstable_settings = {
//   anchor: "screens",
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   return (
//     <SafeAreaProvider>
//       <AuthProvider>
//         <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//           <Stack screenOptions={{ headerShown: false }}>
//             {/* ✅ Your registered screens */}
//             <Stack.Screen name="screens/login" />
//             <Stack.Screen name="screens/register" />
//             <Stack.Screen name="screens/forgotpassword" />
//             <Stack.Screen name="screens/verifyEmail" />
//             <Stack.Screen name="screens/dashboardscreen" />
//             <Stack.Screen name="screens/ChangePassword" />
//           </Stack>

//           {/* ✅ Auto theme-aware StatusBar */}
//           <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
//         </ThemeProvider>
//       </AuthProvider>
//     </SafeAreaProvider>
//   );
// }




// import { useColorScheme } from "@/hooks/use-color-scheme";
// import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import "react-native-reanimated";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { AuthProvider } from "../components/authContext";

// // 🟩 Remove 'unstable_settings' anchor — it causes invalid route errors
// // export const unstable_settings = { anchor: "screens" };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <SafeAreaProvider>
//       <AuthProvider>
//         <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//           <Stack screenOptions={{ headerShown: false }}>
//             {/* ✅ Registered screens */}
//             <Stack.Screen name="screens/login" />
//             <Stack.Screen name="screens/register" />
//             <Stack.Screen name="screens/forgotpassword" />
//             <Stack.Screen name="screens/verifyEmail" />
//             <Stack.Screen name="screens/dashboardscreen" />
//             <Stack.Screen name="screens/ChangePassword" />
//           </Stack>

//           {/* ✅ Theme-aware status bar */}
//           <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
//         </ThemeProvider>
//       </AuthProvider>
//     </SafeAreaProvider>
//   );
// }




import { useColorScheme } from "@/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../components/authContext";
import { StripeProvider } from "@stripe/stripe-react-native"; // ✅ Stripe import

// ✅ Stripe test publishable key (replace with your live key later)
const STRIPE_KEY =
  "pk_test_51SRUXjLZaQ3RKFGpCmwiPYuyUKGSfmqdIxjn9ef4ZLqjHJUm7nvkHmcKzg9dkiMsPuUQFNcK5ACn8psZOW9fuB2j00vQfMLUtY";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey={STRIPE_KEY}>
        <AuthProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              {/* ✅ Registered screens */}
              <Stack.Screen name="screens/login" />
              <Stack.Screen name="screens/register" />
              <Stack.Screen name="screens/forgotpassword" />
              <Stack.Screen name="screens/verifyEmail" />
              <Stack.Screen name="screens/dashboardscreen" />
              <Stack.Screen name="screens/ChangePassword" />
            </Stack>

            {/* ✅ Theme-aware StatusBar */}
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          </ThemeProvider>
        </AuthProvider>
      </StripeProvider>
    </SafeAreaProvider>
  );
}
