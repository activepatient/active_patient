// import { useRouter } from "expo-router";
// import React from "react";
// import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { Circle, Path, Polyline, Svg } from "react-native-svg";

// export default function Footer() {
//   const router = useRouter();

//   return (
//     <View style={styles.footer}>
//       {/* Home */}
//       <TouchableOpacity
//         style={styles.iconButton}
//         onPress={() => router.push("../../screens/dashboardscreen")}
//       >
//         <Svg width={24} height={24} strokeWidth={2} fill="none" stroke="black" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24">
//           <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//           <Polyline points="9 22 9 12 15 12 15 22" />
//         </Svg>
//         <Text style={styles.label}>Home</Text>
//       </TouchableOpacity>
//       {/* My Family */}
//       <TouchableOpacity
//         style={styles.iconButton}
//         onPress={() => router.push("/screens/family/FamilyHub")}
//       >
//         <Svg width={24} height={24} strokeWidth={2} fill="none" stroke="black" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24">
//           <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//           <Circle cx="9" cy="7" r="4" />
//           <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
//           <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
//         </Svg>
//         <Text style={styles.label}>My family</Text>
//       </TouchableOpacity>
//       {/* My Bills */}
//       <TouchableOpacity
//         style={styles.iconButton}
//         // onPress={() => router.push("/bills")}
//       >
//         <Svg width={24} height={24} strokeWidth={2} fill="none" stroke="black" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24">
//           <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//           <Polyline points="14 2 14 8 20 8" />
//         </Svg>
//         <Text style={styles.label}>My Bills</Text>
//       </TouchableOpacity>
//       {/* Timeline */}
//       <TouchableOpacity
//         style={styles.iconButton}
//         // onPress={() => router.push("/timeline")}
//       >
//         <Svg width={24} height={24} strokeWidth={2} fill="none" stroke="black" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24">
//           <Circle cx="12" cy="12" r="10" />
//           <Polyline points="12 6 12 12 16 14" />
//         </Svg>
//         <Text style={styles.label}>Timeline</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   footer: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "#fff",
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     paddingVertical: 6,
//     shadowColor: "#000",
//     shadowOpacity: 0.07,
//     shadowRadius: 8,
//     elevation: 12,
//     zIndex: 50,
//   },
//   iconButton: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 0,
//   },
//   label: {
//     textAlign: "center",
//     fontSize: 11,
//     fontWeight: "500",
//     color: "#222",
//     marginTop: 2,
//   },
// });





import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Circle, Path, Polyline, Svg } from "react-native-svg";

export default function Footer() {
  const router = useRouter();
  const insets = useSafeAreaInsets(); // 👈 handles Android/iPhone bottom safe area

  return (
    <View style={[styles.footer, { paddingBottom: insets.bottom || 8 }]}>
      {/* Home */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("../../screens/dashboardscreen")}
      >
        <Svg width={24} height={24} strokeWidth={2} fill="none" stroke="black" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24">
          <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <Polyline points="9 22 9 12 15 12 15 22" />
        </Svg>
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      {/* My Family */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/screens/family/FamilyHub")}
      >
        <Svg width={24} height={24} strokeWidth={2} fill="none" stroke="black" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24">
          <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <Circle cx="9" cy="7" r="4" />
          <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </Svg>
        <Text style={styles.label}>My Family</Text>
      </TouchableOpacity>

      {/* My Bills */}
      {/* <TouchableOpacity style={styles.iconButton}>
      
        <Svg width={24} height={24} strokeWidth={2} fill="none" stroke="black" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24">
          <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <Polyline points="14 2 14 8 20 8" />
        </Svg>
        <Text style={styles.label}>My Bills</Text>
      </TouchableOpacity> */}

        {/* My Bills */}
<TouchableOpacity
  style={styles.iconButton}
  onPress={() => router.push("/screens/bills/bills")}>
  <Svg width={24} height={24} strokeWidth={2} fill="none" stroke="black" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
  </Svg>
  <Text style={styles.label}>My Bills</Text>
</TouchableOpacity>


      {/* Timeline */}
      <TouchableOpacity style={styles.iconButton}>
        <Svg width={24} height={24} strokeWidth={2} fill="none" stroke="black" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24">
          <Circle cx="12" cy="12" r="10" />
          <Polyline points="12 6 12 12 16 14" />
        </Svg>
        <Text style={styles.label}>Timeline</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 12,
    borderTopWidth: Platform.OS === "android" ? 0.5 : 0,
    borderTopColor: "#ddd",
  },
  iconButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "500",
    color: "#222",
    marginTop: 2,
  },
});
