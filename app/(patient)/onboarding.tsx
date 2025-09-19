import React, { useState, useContext, useEffect } from 'react';
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
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ChevronRight, SkipForward } from 'lucide-react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface PatientData {
  dob?: string;
  gender?: string;
  blood_grp?: string;
  height_cm?: number;
  weight_kg?: number;
  allergies?: string[];
  chronic_conditions?: string[];
  primary_physician?: string;
  emergency_contacts?: any[];
}

export default function OnboardingScreen() {
  const { user } = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [patientData, setPatientData] = useState<PatientData>({});
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { title: 'Basic Information', fields: ['dob', 'gender', 'blood_grp'] },
    { title: 'Physical Details', fields: ['height_cm', 'weight_kg'] },
    { title: 'Medical History', fields: ['allergies', 'chronic_conditions', 'primary_physician'] },
    { title: 'Emergency Contacts', fields: ['emergency_contacts'] },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handleSkip = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('patients')
        .update({
          ...patientData,
          profile_completed: true,
          medical_history_completed: true,
        })
        .eq('id', user?.id);

      if (error) throw error;

      router.replace('/(patient)/today');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    const step = steps[currentStep];

    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <TextInput
              style={styles.input}
              placeholder="Date of Birth (YYYY-MM-DD)"
              value={patientData.dob || ''}
              onChangeText={(value) => updateField('dob', value)}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Gender (male/female/other/prefer_not_to_say)"
              value={patientData.gender || ''}
              onChangeText={(value) => updateField('gender', value)}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Blood Group (A+/A-/B+/B-/AB+/AB-/O+/O-)"
              value={patientData.blood_grp || ''}
              onChangeText={(value) => updateField('blood_grp', value)}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <TextInput
              style={styles.input}
              placeholder="Height (cm)"
              value={patientData.height_cm?.toString() || ''}
              onChangeText={(value) => updateField('height_cm', parseFloat(value))}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Weight (kg)"
              value={patientData.weight_kg?.toString() || ''}
              onChangeText={(value) => updateField('weight_kg', parseFloat(value))}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <TextInput
              style={styles.input}
              placeholder="Allergies (comma separated)"
              value={patientData.allergies?.join(', ') || ''}
              onChangeText={(value) => updateField('allergies', value.split(',').map(s => s.trim()))}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Chronic Conditions (comma separated)"
              value={patientData.chronic_conditions?.join(', ') || ''}
              onChangeText={(value) => updateField('chronic_conditions', value.split(',').map(s => s.trim()))}
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Primary Physician"
              value={patientData.primary_physician || ''}
              onChangeText={(value) => updateField('primary_physician', value)}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.note}>Emergency contacts will be added later in your profile settings.</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color="#374151" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complete Your Profile</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.progressContainer}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressStep,
                  index <= currentStep && styles.progressStepActive,
                ]}
              />
            ))}
          </View>

          {renderStep()}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <SkipForward color="#6B7280" size={20} />
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={isLoading}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                </Text>
                <ChevronRight color="#FFFFFF" size={20} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressStep: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#10B981',
  },
  stepContainer: {
    marginBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#374151',
    marginBottom: 16,
  },
  note: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
