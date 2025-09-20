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
  useWindowDimensions,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Eye, EyeOff, Stethoscope } from 'lucide-react-native';
import { AuthContext } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const { login, checkPatientOnboarding, user } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const { width, height } = useWindowDimensions();

  const handleLogin = async () => {
    if (!email || !password || (isSignup && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(email, password, role as 'doctor' | 'patient');

      if (role === 'patient') {
        const onboardingComplete = await checkPatientOnboarding(user?.id || '');
        if (!onboardingComplete) {
          router.replace('/onboarding');
          return;
        }
      }

      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Gradient Bubbles */}
        <View style={styles.bubblesContainer}>
          <LinearGradient
            colors={['#00B3FF', '#5603BD']}
            style={[styles.bubble, {
              width: width * 0.5,
              height: width * 0.5,
              top: -height * 0.12,
              left: -width * 0.2,
            }]}
          />
          <LinearGradient
            colors={['#00B3FF', '#5603BD']}
            style={[styles.bubble, {
              width: width * 0.35,
              height: width * 0.35,
              bottom: -height * 0.15,
              right: -width * 0.2,
            }]}
          />
          <LinearGradient
            colors={['#00B3FF', '#5603BD']}
            style={[styles.smallBubble, {
              top: height * 0.15,
              right: width * 0.1,
            }]}
          />
          <LinearGradient
            colors={['#00B3FF', '#5603BD']}
            style={[styles.smallBubble, {
              bottom: height * 0.25,
              left: width * 0.1,
            }]}
          />
        </View>

        {/* Top Section */}
        <View style={[styles.topSection, { paddingTop: height * 0.05 }]}>
          <View style={styles.illustrationContainer}>
            <Stethoscope size={width * 0.28} color="#666" strokeWidth={1.5} />
          </View>
          <Text style={[styles.title, { fontSize: width * 0.08 }]}>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Text>
        </View>

        {/* Form Section */}
        <View style={[styles.formSection, { paddingHorizontal: width * 0.08 }]}>
          {isSignup && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
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

          {/* Gradient Sign In Button */}
          <TouchableOpacity onPress={handleLogin} style={{ marginBottom: 16 }}>
            <LinearGradient
              colors={['#00B3FF', '#5603BD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.signInButton,
                { width: width * 0.5, paddingVertical: height * 0.018 },
              ]}
            >
              <Text style={[styles.signInButtonText, { fontSize: width * 0.045 }]}>
                {isSignup ? 'Sign Up' : 'Sign In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <LinearGradient colors={['#00B3FF', '#5603BD']} style={styles.dividerLine} />
            <Text style={[styles.dividerText, { fontSize: width * 0.035 }]}>OR</Text>
            <LinearGradient colors={['#00B3FF', '#5603BD']} style={styles.dividerLine} />
          </View>

          {/* Secondary Button */}
          <TouchableOpacity style={styles.secondaryButton}>
            <MaskedView
              maskElement={
                <Text style={[styles.secondaryButtonText, { fontSize: width * 0.04 }]}>
                  {isSignup
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Sign Up"}
                </Text>
              }
            >
              <LinearGradient
                colors={['#00B3FF', '#5603BD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.secondaryGradient}
              />
            </MaskedView>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  flex: { flex: 1 },
  bubblesContainer: { position: 'absolute', width: '100%', height: '100%', zIndex: 0 },
  bubble: {
    position: 'absolute',
    borderRadius: 200,
    shadowColor: '#949ca0ff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  smallBubble: {
    position: 'absolute',
    borderRadius: 100,
    width: 100,
    height: 100,
  },
  topSection: { flex: 0.35, alignItems: 'center', justifyContent: 'center' },
  illustrationContainer: { marginBottom: 20 },
  title: { fontWeight: 'bold', color: '#333', textAlign: 'center' },
  formSection: { flex: 1, justifyContent: 'center' },
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
  signInButton: {
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonText: { fontWeight: '600', color: '#fff', textAlign: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 16, color: '#9CA3AF', fontWeight: '500' },
  secondaryButton: { paddingVertical: 12, alignItems: 'center' },
  secondaryButtonText: { fontWeight: '500', color: '#000' },
  secondaryGradient: { flex: 1, height: '100%' },
});
