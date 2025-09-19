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
          router.replace('/(patient)/onboarding');
          return;
        }
      }

      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
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
            <Stethoscope size={120} color="#666" strokeWidth={1.5} />
            <View style={styles.decorativeElements}>
              <View style={[styles.dot, { top: 20, left: 30 }]} />
              <View style={[styles.dot, { top: 60, right: 40 }]} />
              <View style={[styles.dot, { bottom: 40, left: 20 }]} />
              <View style={[styles.smallDot, { top: 80, left: 60 }]} />
              <View style={[styles.smallDot, { bottom: 20, right: 30 }]} />
            </View>
          </View>
          <Text style={styles.title}>Sign In</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
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
              style={styles.signInButton}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
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
            onPress={() => router.push('/signup')}
          >
            <MaskedView
              maskElement={
                <Text style={styles.secondaryButtonText}>
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
    // Add to your existing bubble styles
    shadowColor: '#949ca0ff',
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

  topSection: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
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
    transform: [{ translateY: -60 }],
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

  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 25,
    width: '20%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignSelf: 'center',
  },
  signInButtonText: { fontSize: 18, fontWeight: '600', color: '#fff', textAlign: 'center' },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    // Apply LinearGradient in component for gradient effect
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF', // replace with gradient via MaskedView if needed
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
    color: '#000', // replace with gradient if needed
  },
  signUpText: { fontSize: 14, color: '#000', textAlign: 'center' },
});
