import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Eye, EyeOff, UserPlus } from 'lucide-react-native';
import { AuthContext } from '@/contexts/AuthContext';

export default function SignupScreen() {
  const { signup, checkPatientOnboardingComplete, user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'doctor' | 'patient' | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name || !role) {
      Alert.alert('Error', 'Please fill in all fields and select a role');
      return;
    }

    try {
      await signup(email, password, name, role);
      if (role === 'patient') {
        const onboardingComplete = await checkPatientOnboardingComplete(user?.id || '');
        if (!onboardingComplete) {
          router.replace('/(patient)/onboarding');
          return;
        }
      }
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Signup failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Gradient Bubbles */}
        <View style={styles.bubblesContainer}>
          <LinearGradient
            colors={['#00B3FF', '#5603BD']}
            style={[styles.bubble, styles.bubbleTopLeft]}
          />
          <LinearGradient
            colors={['#00B3FF', '#5603BD']}
            style={[styles.bubble, styles.bubbleBottomRight]}
          />
          <LinearGradient
            colors={['#00B3FF', '#5603BD']}
            style={[styles.smallBubble, styles.smallBubbleTop]}
          />
          <LinearGradient
            colors={['#00B3FF', '#5603BD']}
            style={[styles.smallBubble, styles.smallBubbleBottom]}
          />
        </View>


        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.illustrationContainer}>
            <UserPlus size={120} color="#666" strokeWidth={1.5} />
            <View style={styles.decorativeElements}>
              <View style={[styles.dot, { top: 20, left: 30 }]} />
              <View style={[styles.dot, { top: 60, right: 40 }]} />
              <View style={[styles.dot, { bottom: 40, left: 20 }]} />
              <View style={[styles.smallDot, { top: 80, left: 60 }]} />
              <View style={[styles.smallDot, { bottom: 20, right: 30 }]} />
            </View>
          </View>
          <Text style={styles.title}>Create Account</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff color="#9CA3AF" size={20} />
              ) : (
                <Eye color="#9CA3AF" size={20} />
              )}
            </TouchableOpacity>
          </View>

          {/* Role Selection */}
          <View style={styles.roleSelection}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'doctor' && styles.roleButtonSelected,
              ]}
              onPress={() => setRole('doctor')}
            >
              {role === 'doctor' ? (
                <LinearGradient
                  colors={['#00B3FF', '#5603BD']}
                  style={styles.roleButtonGradient}
                >
                  <Text style={styles.roleButtonTextSelected}>Doctor</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.roleButtonText}>Doctor</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'patient' && styles.roleButtonSelected,
              ]}
              onPress={() => setRole('patient')}
            >
              {role === 'patient' ? (
                <LinearGradient
                  colors={['#00B3FF', '#5603BD']}
                  style={styles.roleButtonGradient}
                >
                  <Text style={styles.roleButtonTextSelected}>Patient</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.roleButtonText}>Patient</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Gradient Sign Up Button */}
          <TouchableOpacity onPress={handleSignup} style={{ marginBottom: 16 }}>
            <LinearGradient
              colors={['#00B3FF', '#5603BD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signUpButton}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <LinearGradient colors={['#00B3FF', '#5603BD']} style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <LinearGradient colors={['#00B3FF', '#5603BD']} style={styles.dividerLine} />
          </View>

          {/* Secondary Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/login')}
          >
            <MaskedView
              maskElement={
                <Text style={styles.secondaryButtonText}>
                  Already have an account? Sign In
                </Text>
              }
            >
              <LinearGradient
                colors={['#00B3FF', '#5603BD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1 }}
              />
            </MaskedView>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  bubblesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 200,
    shadowColor: '#89989eff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bubbleTopLeft: {
    width: 350,
    height: 350,
    top: -90,
    left: -90,
  },
  bubbleBottomRight: {
    width: 250,
    height: 250,
    bottom: -110,
    right: -110,
  },
  smallBubble: {
    position: 'absolute',
    borderRadius: 100,
    width: 100,
    height: 100,
  },
  smallBubbleTop: { top: 120, right: 30 },
  smallBubbleBottom: { bottom: 180, left: 40 },

  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    zIndex: 1,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  topSection: {
    flex: 0.35,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    zIndex: 1,
  },
  illustrationContainer: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  decorativeElements: { position: 'absolute', width: 200, height: 200 },
  dot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd' },
  smallDot: { position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: '#ddd' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', textAlign: 'center' },

  formSection: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    transform: [{ translateY: -40 }],
    zIndex: 1
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: { flex: 1, fontSize: 16, color: '#333', outlineWidth: 0 },
  eyeIcon: { padding: 4, marginLeft: 10 },

  roleSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  roleButtonSelected: {
    // Selected state handled by gradient
  },
  roleButtonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  roleButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignSelf: 'center',
    minWidth: '50%',
  },
  signUpButtonText: { fontSize: 18, fontWeight: '600', color: '#fff', textAlign: 'center' },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },

  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});