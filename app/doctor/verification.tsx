// doctor/verification.tsx
import { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Stethoscope } from "lucide-react-native";

export default function VerificationPage() {
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [year, setYear] = useState("");
  const [council, setCouncil] = useState("");
  const [msg, setMsg] = useState("");

  const VERIFIED_DOCTORS = [
    { registration_no: "12345", year_of_registration: "2016", council_name: "Bombay Medical Council" },
    { registration_no: "67890", year_of_registration: "2018", council_name: "Delhi Medical Council" },
  ];

  const handleVerify = () => {
    setMsg("Verifying...");
    const match = VERIFIED_DOCTORS.find(
      (doc) =>
        doc.registration_no === regNo.trim() &&
        doc.year_of_registration === year.trim() &&
        doc.council_name.trim().toLowerCase() === council.trim().toLowerCase()
    );
    if (match) {
      setMsg("Doctor verified ✅");
      router.replace("/(doctor)/appointments");
    } else {
      setMsg("Verification failed ❌ (Details not found in registry)");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Background Bubbles */}
        <View style={styles.bubblesContainer}>
          <LinearGradient colors={["#00B3FF", "#5603BD"]} style={[styles.bubble, styles.bubbleTopLeft]} />
          <LinearGradient colors={["#00B3FF", "#5603BD"]} style={[styles.bubble, styles.bubbleBottomRight]} />
          <LinearGradient colors={["#00B3FF", "#5603BD"]} style={[styles.smallBubble, styles.smallBubbleTop]} />
          <LinearGradient colors={["#00B3FF", "#5603BD"]} style={[styles.smallBubble, styles.smallBubbleBottom]} />
        </View>

        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.illustrationContainer}>
            <Stethoscope size={120} color="#666" strokeWidth={1.5} />
            <View style={styles.decorativeElements}>
              <View style={[styles.dot, { top: 20, left: 30 }]} />
              <View style={[styles.dot, { top: 60, right: 40 }]} />
              <View style={[styles.dot, { bottom: 40, left: 20 }]} />
              <View style={[styles.smallDot, { top: 80, left: 60 }]} />
              <View style={[styles.smallDot, { bottom: 20, right: 30 }]} />
            </View>
          </View>
          <Text style={styles.title}>Doctor Verification</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Registration No"
              value={regNo}
              onChangeText={setRegNo}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Year of Registration"
              value={year}
              onChangeText={setYear}
              keyboardType="number-pad"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Council Name"
              value={council}
              onChangeText={setCouncil}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Gradient Verify Button */}
          <TouchableOpacity onPress={handleVerify} style={{ marginVertical: 16 }}>
            <LinearGradient
              colors={["#00B3FF", "#5603BD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.verifyButton}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Message */}
          {msg ? <Text style={styles.msgText}>{msg}</Text> : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  bubblesContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  bubble: { position: "absolute", borderRadius: 200 },
  bubbleTopLeft: { width: 350, height: 350, top: -90, left: -90 },
  bubbleBottomRight: { width: 250, height: 250, bottom: -110, right: -110 },
  smallBubble: { position: "absolute", borderRadius: 100, width: 100, height: 100 },
  smallBubbleTop: { top: 120, right: 30 },
  smallBubbleBottom: { bottom: 180, left: 40 },

  topSection: { flex: 0.4, alignItems: "center", justifyContent: "center", paddingTop: 40, zIndex: 1 },
  illustrationContainer: { position: "relative", alignItems: "center", justifyContent: "center", marginBottom: 30 },
  decorativeElements: { position: "absolute", width: 200, height: 200 },
  dot: { position: "absolute", width: 8, height: 8, borderRadius: 4, backgroundColor: "#ddd" },
  smallDot: { position: "absolute", width: 4, height: 4, borderRadius: 2, backgroundColor: "#ddd" },
  title: { fontSize: 28, fontWeight: "bold", color: "#333", textAlign: "center" },

  formSection: { flex: 1, paddingHorizontal: 32, justifyContent: "center", transform: [{ translateY: -40 }], zIndex: 1 },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: { flex: 1, fontSize: 16, color: "#333", outlineWidth: 0 },

  verifyButton: { borderRadius: 25, paddingVertical: 16, alignItems: "center" },
  verifyButtonText: { fontSize: 18, fontWeight: "600", color: "#fff" },

  msgText: { textAlign: "center", fontSize: 16, color: "#333", marginTop: 8 },
});
