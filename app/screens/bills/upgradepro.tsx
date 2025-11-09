


// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//     initPaymentSheet,
//     initStripe,
//     presentPaymentSheet,
// } from "@stripe/stripe-react-native";
// import * as Print from "expo-print";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import * as Sharing from "expo-sharing";
// import React, { useEffect, useState } from "react";
// import {
//     Alert,
//     Modal,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";

// // ⚙️ Stripe Configuration
// const STRIPE_KEY =
//   "pk_test_51SRUXjLZaQ3RKFGpCmwiPYuyUKGSfmqdIxjn9ef4ZLqjHJUm7nvkHmcKzg9dkiMsPuUQFNcK5ACn8psZOW9fuB2j00vQfMLUtY";
// const BACKEND_URL = "https://active-patient.onrender.com";

// export default function UpgradePro() {
//   const router = useRouter();
//   const { source } = useLocalSearchParams(); // ✅ Detect source screen (schedule / scorecard)
//   const [selectedPlan, setSelectedPlan] = useState<"monthly" | "single">(
//     "monthly"
//   );
//   const [loading, setLoading] = useState(false);
//   const [successVisible, setSuccessVisible] = useState(false);
//   const [transactionId, setTransactionId] = useState("");
//   const [showReceiptButton, setShowReceiptButton] = useState(false);

//   const PLANS = {
//     monthly: {
//       title: "Monthly Subscription",
//       price: 19,
//       desc: "Unlimited Bill Reviews, Covers All Family Members",
//     },
//     single: {
//       title: "Single Bill Review",
//       price: 49,
//       desc: "One Detailed Bill Review",
//     },
//   };

//   // ✅ Initialize Stripe once when component loads
//   useEffect(() => {
//     initStripe({
//       publishableKey: STRIPE_KEY,
//       merchantIdentifier: "merchant.com.alderr.billing",
//     });
//   }, []);

//   // 💳 Handle Payment
//   const handlePayment = async () => {
//     try {
//       setLoading(true);
//       let data;

//       // Try to call backend for PaymentIntent
//       try {
//         const response = await fetch(`${BACKEND_URL}/api/create-payment-intent`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             amount: PLANS[selectedPlan].price * 100,
//             currency: "usd",
//           }),
//         });
//         data = await response.json();
//       } catch (error) {
//         console.warn("⚠️ Backend not reachable, using test fallback");
//         // ⚠️ Fallback test data
//         data = {
//           paymentIntent:
//             "pi_test_secret_replace_with_your_stripe_dashboard_secret",
//           ephemeralKey: "ek_test_fallback",
//           customer: "cus_test_fallback",
//         };
//       }

//       if (!data.paymentIntent)
//         throw new Error("Failed to create payment intent");

//       const init = await initPaymentSheet({
//         merchantDisplayName: "Alderr Billing Review",
//         paymentIntentClientSecret: data.paymentIntent,
//         customerId: data.customer,
//         customerEphemeralKeySecret: data.ephemeralKey,
//         allowsDelayedPaymentMethods: false,
//         defaultBillingDetails: {
//           name: "John Doe",
//           email: "alex@example.com",
//         },
//       });

//       if (init.error) {
//         Alert.alert("Error", init.error.message);
//         return;
//       }

//       const present = await presentPaymentSheet();
//       if (present.error) {
//         Alert.alert("Payment Failed", present.error.message);
//       } else {
//         const utr = "UTR" + Math.floor(100000 + Math.random() * 900000);
//         setTransactionId(utr);
//         setSuccessVisible(true);
//         setShowReceiptButton(true);

//         // ✅ Save Pro status
//         await AsyncStorage.setItem("isProUser", "true");

//         // ✅ Auto redirect after 4 seconds (even if not downloaded)
//         setTimeout(() => {
//           setSuccessVisible(false);
//           if (source === "scorecard") {
//             router.replace("/screens/bills/scorecard");
//           } else {
//             router.replace("/screens/bills/schedule");
//           }
//         }, 4000);
//       }
//     } catch (err: any) {
//       console.error("Payment error:", err);
//       Alert.alert("Error", err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🧾 Generate Receipt PDF (manual download)
//   const generateReceipt = async () => {
//     try {
//       const date = new Date().toLocaleString();
//       const html = `
//         <html>
//           <body style="font-family: Arial; padding: 20px; color: #333;">
//             <h2 style="color:#16a34a;">✅ Payment Receipt</h2>
//             <p>Thank you for your payment! Below are the details:</p>
//             <table style="width:100%; border-collapse:collapse; margin-top:10px;">
//               <tr><td style="padding:8px;">Transaction ID:</td><td><b>${transactionId}</b></td></tr>
//               <tr><td style="padding:8px;">Plan:</td><td><b>${PLANS[selectedPlan].title}</b></td></tr>
//               <tr><td style="padding:8px;">Amount Paid:</td><td><b>$${PLANS[selectedPlan].price}</b></td></tr>
//               <tr><td style="padding:8px;">Date:</td><td>${date}</td></tr>
//               <tr><td style="padding:8px;">Customer:</td><td>John Doe</td></tr>
//             </table>
//             <p style="margin-top:20px;">If you have any questions, contact <b>support@alderr.com</b></p>
//             <hr style="margin-top:20px;" />
//             <p style="font-size:12px;color:#555;">Alderr Billing Review © 2025</p>
//           </body>
//         </html>
//       `;
//       const { uri } = await Print.printToFileAsync({ html, base64: false });
//       await Sharing.shareAsync(uri);

//       // ✅ Redirect immediately after download
//       setSuccessVisible(false);
//       if (source === "scorecard") {
//         router.replace("/screens/bills/scorecard");
//       } else {
//         router.replace("/screens/bills/schedule");
//       }
//     } catch (err) {
//       console.error("Receipt generation error:", err);
//       Alert.alert("Error", "Failed to generate or share the receipt.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={() => router.back()}>
//         <Text style={styles.back}>← Back</Text>
//       </TouchableOpacity>

//       <Text style={styles.title}>Choose a Plan</Text>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* === Plan 1 === */}
//         <TouchableOpacity
//           style={[
//             styles.planCard,
//             selectedPlan === "monthly" && styles.selectedPlan,
//           ]}
//           onPress={() => setSelectedPlan("monthly")}
//         >
//           <View style={styles.rowBetween}>
//             <Text style={styles.planTitle}>Monthly Subscription</Text>
//             <Text style={styles.recommended}>Recommended</Text>
//           </View>
//           <Text style={styles.price}>
//             ${PLANS.monthly.price} <Text style={styles.per}>/month</Text>
//           </Text>
//           <Text style={styles.planDesc}>
//             Best value for ongoing peace of mind.
//           </Text>
//           <Text style={styles.benefit}>✔ Unlimited Bill Reviews</Text>
//           <Text style={styles.benefit}>✔ Covers All Family Members</Text>
//         </TouchableOpacity>

//         {/* === Plan 2 === */}
//         <TouchableOpacity
//           style={[
//             styles.planCard,
//             selectedPlan === "single" && styles.selectedPlan,
//           ]}
//           onPress={() => setSelectedPlan("single")}
//         >
//           <Text style={styles.planTitle}>Single Bill Review</Text>
//           <Text style={styles.price}>
//             ${PLANS.single.price} <Text style={styles.per}>/one-time</Text>
//           </Text>
//           <Text style={styles.planDesc}>Perfect for a one-off check-up.</Text>
//           <Text style={styles.benefit}>✔ One Detailed Bill Review</Text>
//         </TouchableOpacity>

//         {/* === Payment Section === */}
//         <View style={styles.paymentSection}>
//           <Text style={styles.subTitle}>1. Select Payment Method</Text>

//           <TouchableOpacity style={styles.paymentOption}>
//             <Ionicons name="card-outline" size={20} color="#4338ca" />
//             <Text style={styles.paymentText}>Credit / Debit Card</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.paymentOption}>
//             <Ionicons name="logo-paypal" size={20} color="#0369a1" />
//             <Text style={styles.paymentText}>PayPal (Coming Soon)</Text>
//           </TouchableOpacity>

//           <Text style={[styles.subTitle, { marginTop: 20 }]}>
//             2. Billing Details
//           </Text>
//           <View style={styles.inputBox}>
//             <Text style={styles.inputText}>John Doe</Text>
//           </View>
//           <View style={styles.inputBox}>
//             <Text style={styles.inputText}>**** **** **** 4242</Text>
//           </View>

//           <Text style={[styles.subTitle, { marginTop: 20 }]}>
//             3. Confirmation
//           </Text>
//           <Text style={styles.terms}>
//             ☐ I have read and agree to the Terms and Conditions.
//           </Text>

//           {/* Proceed Button */}
//           <TouchableOpacity
//             style={[styles.payButton, loading && { opacity: 0.6 }]}
//             onPress={handlePayment}
//             disabled={loading}
//           >
//             <Text style={styles.payText}>
//               {loading
//                 ? "Processing..."
//                 : `Proceed to Payment ($${PLANS[selectedPlan].price})`}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* ✅ Success Popup */}
//       <Modal visible={successVisible} transparent animationType="fade">
//         <View style={styles.overlay}>
//           <View style={styles.successCard}>
//             <Ionicons
//               name="checkmark-circle"
//               size={80}
//               color="#16a34a"
//               style={{ marginBottom: 10 }}
//             />
//             <Text style={styles.successTitle}>Payment Successful!</Text>
//             <Text style={styles.successAmount}>
//               {PLANS[selectedPlan].title}
//             </Text>
//             <Text style={styles.successAmount}>
//               Amount: ${PLANS[selectedPlan].price}
//             </Text>
//             <Text style={styles.transactionId}>
//               Transaction ID: {transactionId}
//             </Text>
//             <Text style={styles.thanks}>Thank you for your payment 🎉</Text>

//             {showReceiptButton && (
//               <TouchableOpacity
//                 onPress={generateReceipt}
//                 style={styles.receiptButton}
//               >
//                 <Ionicons name="document-text-outline" size={18} color="#fff" />
//                 <Text style={styles.receiptText}>Download Receipt</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 50 },
//   back: { color: "#4f46e5", fontWeight: "600", marginBottom: 10 },
//   title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 10 },
//   planCard: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 16, marginTop: 12 },
//   selectedPlan: { borderColor: "#4f46e5", shadowColor: "#4f46e5", shadowOpacity: 0.2 },
//   rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   recommended: {
//     backgroundColor: "#ede9fe",
//     color: "#4f46e5",
//     fontWeight: "600",
//     fontSize: 11,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   planTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
//   price: { fontSize: 26, fontWeight: "700", color: "#111", marginTop: 4 },
//   per: { fontSize: 13, fontWeight: "400", color: "#555" },
//   planDesc: { color: "#555", marginVertical: 4 },
//   benefit: { color: "#111", marginLeft: 6, marginTop: 2 },
//   paymentSection: { marginTop: 20, marginBottom: 40 },
//   subTitle: { fontWeight: "700", fontSize: 15, marginBottom: 8, color: "#111" },
//   paymentOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#eef2ff",
//     borderRadius: 10,
//     padding: 12,
//     marginTop: 6,
//   },
//   paymentText: { color: "#111", marginLeft: 8, fontWeight: "600" },
//   inputBox: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, padding: 12, marginTop: 8 },
//   inputText: { color: "#555" },
//   terms: { fontSize: 13, color: "#444", marginTop: 8 },
//   payButton: {
//     backgroundColor: "#4f46e5",
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   payText: { color: "#fff", fontWeight: "700", fontSize: 15 },
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   successCard: {
//     backgroundColor: "#ecfdf5",
//     borderRadius: 16,
//     padding: 25,
//     alignItems: "center",
//     width: "80%",
//   },
//   successTitle: { fontSize: 22, fontWeight: "800", color: "#15803d" },
//   successAmount: { fontSize: 16, color: "#166534", marginTop: 4 },
//   transactionId: { marginTop: 8, fontSize: 14, color: "#065f46", fontWeight: "600" },
//   thanks: { marginTop: 10, color: "#16a34a", fontWeight: "500" },
//   receiptButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 15,
//     backgroundColor: "#16a34a",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   receiptText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
// });



import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    initPaymentSheet,
    initStripe,
    presentPaymentSheet,
} from "@stripe/stripe-react-native";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// ⚙️ Stripe Configuration
const STRIPE_KEY =
  "pk_test_51SRUXjLZaQ3RKFGpCmwiPYuyUKGSfmqdIxjn9ef4ZLqjHJUm7nvkHmcKzg9dkiMsPuUQFNcK5ACn8psZOW9fuB2j00vQfMLUtY";
const BACKEND_URL = "https://active-patient.onrender.com";

export default function UpgradePro() {
  const router = useRouter();
  const { source } = useLocalSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "single">("monthly");
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [showReceiptButton, setShowReceiptButton] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const PLANS = {
    monthly: {
      title: "Monthly Subscription",
      price: 19,
      desc: "Unlimited Bill Reviews, Covers All Family Members",
    },
    single: {
      title: "Single Bill Review",
      price: 49,
      desc: "One Detailed Bill Review",
    },
  };

  // ✅ Initialize Stripe once
  useEffect(() => {
    initStripe({
      publishableKey: STRIPE_KEY,
      merchantIdentifier: "merchant.com.alderr.billing",
    });
  }, []);

  // 💳 Handle Payment
  const handlePayment = async () => {
    if (!agreeTerms) {
      Alert.alert("Agreement Required", "Please agree to the Terms and Conditions before proceeding.");
      return;
    }

    try {
      setLoading(true);
      let data;

      // Backend payment intent
      try {
        const response = await fetch(`${BACKEND_URL}/api/create-payment-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: PLANS[selectedPlan].price * 100,
            currency: "usd",
          }),
        });
        data = await response.json();
      } catch (error) {
        console.warn("⚠️ Backend not reachable, using test fallback");
        data = {
          paymentIntent: "pi_test_secret_replace_with_your_stripe_dashboard_secret",
          ephemeralKey: "ek_test_fallback",
          customer: "cus_test_fallback",
        };
      }

      if (!data.paymentIntent) throw new Error("Failed to create payment intent");

      const init = await initPaymentSheet({
        merchantDisplayName: "Alderr Billing Review",
        paymentIntentClientSecret: data.paymentIntent,
        customerId: data.customer,
        customerEphemeralKeySecret: data.ephemeralKey,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: "John Doe",
          email: "alex@example.com",
        },
      });

      if (init.error) {
        Alert.alert("Error", init.error.message);
        return;
      }

      const present = await presentPaymentSheet();
      if (present.error) {
        Alert.alert("Payment Failed", present.error.message);
      } else {
        const utr = "UTR" + Math.floor(100000 + Math.random() * 900000);
        setTransactionId(utr);
        setSuccessVisible(true);
        setShowReceiptButton(true);
        await AsyncStorage.setItem("isProUser", "true");

        setTimeout(() => {
          setSuccessVisible(false);
          if (source === "scorecard") router.replace("/screens/bills/scorecard");
          else router.replace("/screens/bills/schedule");
        }, 4000);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Generate Receipt PDF
  const generateReceipt = async () => {
    try {
      const date = new Date().toLocaleString();
      const html = `
        <html>
          <body style="font-family: Arial; padding: 20px; color: #333;">
            <h2 style="color:#16a34a;">✅ Payment Receipt</h2>
            <p>Thank you for your payment! Below are the details:</p>
            <table style="width:100%; border-collapse:collapse; margin-top:10px;">
              <tr><td style="padding:8px;">Transaction ID:</td><td><b>${transactionId}</b></td></tr>
              <tr><td style="padding:8px;">Plan:</td><td><b>${PLANS[selectedPlan].title}</b></td></tr>
              <tr><td style="padding:8px;">Amount Paid:</td><td><b>$${PLANS[selectedPlan].price}</b></td></tr>
              <tr><td style="padding:8px;">Date:</td><td>${date}</td></tr>
              <tr><td style="padding:8px;">Customer:</td><td>John Doe</td></tr>
            </table>
            <p style="margin-top:20px;">If you have any questions, contact <b>support@alderr.com</b></p>
            <hr style="margin-top:20px;" />
            <p style="font-size:12px;color:#555;">Alderr Billing Review © 2025</p>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await Sharing.shareAsync(uri);

      setSuccessVisible(false);
      if (source === "scorecard") router.replace("/screens/bills/scorecard");
      else router.replace("/screens/bills/schedule");
    } catch (err) {
      console.error("Receipt generation error:", err);
      Alert.alert("Error", "Failed to generate or share the receipt.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Choose a Plan</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* === Plan 1 === */}
        <TouchableOpacity
          style={[
            styles.planCard,
            selectedPlan === "monthly" && styles.selectedPlan,
          ]}
          onPress={() => setSelectedPlan("monthly")}
        >
          <View style={styles.rowBetween}>
            <Text style={styles.planTitle}>Monthly Subscription</Text>
            <Text style={styles.recommended}>Recommended</Text>
          </View>
          <Text style={styles.price}>
            ${PLANS.monthly.price} <Text style={styles.per}>/month</Text>
          </Text>
          <Text style={styles.planDesc}>
            Best value for ongoing peace of mind.
          </Text>
          <Text style={styles.benefit}>✔ Unlimited Bill Reviews</Text>
          <Text style={styles.benefit}>✔ Covers All Family Members</Text>
        </TouchableOpacity>

        {/* === Plan 2 === */}
        <TouchableOpacity
          style={[
            styles.planCard,
            selectedPlan === "single" && styles.selectedPlan,
          ]}
          onPress={() => setSelectedPlan("single")}
        >
          <Text style={styles.planTitle}>Single Bill Review</Text>
          <Text style={styles.price}>
            ${PLANS.single.price} <Text style={styles.per}>/one-time</Text>
          </Text>
          <Text style={styles.planDesc}>Perfect for a one-off check-up.</Text>
          <Text style={styles.benefit}>✔ One Detailed Bill Review</Text>
        </TouchableOpacity>

        {/* === Payment Section === */}
        <View style={styles.paymentSection}>
          <Text style={styles.subTitle}>1. Select Payment Method</Text>

          <TouchableOpacity style={styles.paymentOption}>
            <Ionicons name="card-outline" size={20} color="#4338ca" />
            <Text style={styles.paymentText}>Credit / Debit Card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentOption}>
            <Ionicons name="logo-paypal" size={20} color="#0369a1" />
            <Text style={styles.paymentText}>PayPal (Coming Soon)</Text>
          </TouchableOpacity>

          {/* 🧹 Removed hardcoded Billing Details block */}

          <Text style={[styles.subTitle, { marginTop: 20 }]}>
            2. Confirmation
          </Text>

          {/* ✅ Real interactive checkbox */}
          <TouchableOpacity
            onPress={() => setAgreeTerms(!agreeTerms)}
            style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
          >
            <Ionicons
              name={agreeTerms ? "checkbox" : "square-outline"}
              size={20}
              color={agreeTerms ? "#4f46e5" : "#444"}
            />
            <Text style={styles.terms}>
              I have read and agree to the Terms and Conditions.
            </Text>
          </TouchableOpacity>

          {/* Proceed Button */}
          <TouchableOpacity
            style={[styles.payButton, loading && { opacity: 0.6 }]}
            onPress={handlePayment}
            disabled={loading}
          >
            <Text style={styles.payText}>
              {loading
                ? "Processing..."
                : `Proceed to Payment ($${PLANS[selectedPlan].price})`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ Success Popup */}
      <Modal visible={successVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.successCard}>
            <Ionicons
              name="checkmark-circle"
              size={80}
              color="#16a34a"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successAmount}>{PLANS[selectedPlan].title}</Text>
            <Text style={styles.successAmount}>
              Amount: ${PLANS[selectedPlan].price}
            </Text>
            <Text style={styles.transactionId}>
              Transaction ID: {transactionId}
            </Text>
            <Text style={styles.thanks}>Thank you for your payment 🎉</Text>

            {showReceiptButton && (
              <TouchableOpacity
                onPress={generateReceipt}
                style={styles.receiptButton}
              >
                <Ionicons name="document-text-outline" size={18} color="#fff" />
                <Text style={styles.receiptText}>Download Receipt</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 50 },
  back: { color: "#4f46e5", fontWeight: "600", marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  planCard: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, padding: 16, marginTop: 12 },
  selectedPlan: { borderColor: "#4f46e5", shadowColor: "#4f46e5", shadowOpacity: 0.2 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  recommended: {
    backgroundColor: "#ede9fe",
    color: "#4f46e5",
    fontWeight: "600",
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  planTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  price: { fontSize: 26, fontWeight: "700", color: "#111", marginTop: 4 },
  per: { fontSize: 13, fontWeight: "400", color: "#555" },
  planDesc: { color: "#555", marginVertical: 4 },
  benefit: { color: "#111", marginLeft: 6, marginTop: 2 },
  paymentSection: { marginTop: 20, marginBottom: 40 },
  subTitle: { fontWeight: "700", fontSize: 15, marginBottom: 8, color: "#111" },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef2ff",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },
  paymentText: { color: "#111", marginLeft: 8, fontWeight: "600" },
  terms: { fontSize: 13, color: "#444", marginLeft: 8 },
  payButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  payText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successCard: {
    backgroundColor: "#ecfdf5",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    width: "80%",
  },
  successTitle: { fontSize: 22, fontWeight: "800", color: "#15803d" },
  successAmount: { fontSize: 16, color: "#166534", marginTop: 4 },
  transactionId: { marginTop: 8, fontSize: 14, color: "#065f46", fontWeight: "600" },
  thanks: { marginTop: 10, color: "#16a34a", fontWeight: "500" },
  receiptButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    backgroundColor: "#16a34a",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  receiptText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
});
