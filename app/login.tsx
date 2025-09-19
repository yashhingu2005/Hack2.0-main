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
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { AuthContext } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const { login, checkPatientOnboarding, user } = useContext(AuthContext);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
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

  const isDoctorLogin = role === 'doctor';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaskedView maskElement={<ArrowLeft size={24} color="black" />}>
              <LinearGradient
                colors={['#00B3FF', '#5603BD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ width: 24, height: 24 }}
              />
            </MaskedView>
          </TouchableOpacity>

          <MaskedView maskElement={<Text style={styles.headerTitle}>Login</Text>}>
            <LinearGradient
              colors={['#00B3FF', '#5603BD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.headerTitle, { opacity: 0 }]}>Login</Text>
            </LinearGradient>
          </MaskedView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.subtitle}>
              {isDoctorLogin
                ? 'Access your professional dashboard'
                : 'Manage your health journey'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
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

            {/* Password Input */}
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


            {/* Primary Button */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <LinearGradient colors={['#00B3FF', '#5603BD']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>{isSignup ? 'Sign Up' : 'Sign In'}</Text>
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
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.secondaryButtonText, { opacity: 0 }]}>Dummy</Text>
                </LinearGradient>
              </MaskedView>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
    // Gradient can be applied via LinearGradient in the component
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    // Gradient text via MaskedView + LinearGradient in the component
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  form: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36, // increased size for "Welcome Back"
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: '#6B7280',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // light gray background
    borderWidth: 0, // remove black outline
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    borderWidth: 0,
    outlineWidth: 0,
    flex: 1,
    fontSize: 24,
    color: '#111827',
  },
  eyeIcon: {
    padding: 4,
  },

  primaryButton: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

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
});
