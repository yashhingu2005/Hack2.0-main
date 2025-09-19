import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { Calendar, FileText, Clock, ChevronRight } from 'lucide-react-native';

import { useRouter } from 'expo-router';
const router = useRouter();
const handleCalendarpress = () => {
  router.push('/(doctor)/calendar');
};


interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  lastVisit: string;
  nextAppointment?: string;
  avatar: string;
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 65,
    condition: 'Diabetes Type 2',
    lastVisit: '2024-03-10',
    nextAppointment: '2024-03-20',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    age: 58,
    condition: 'Hypertension',
    lastVisit: '2024-03-12',
    nextAppointment: '2024-03-25',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
  },
  {
    id: '3',
    name: 'Anita Singh',
    age: 72,
    condition: 'Arthritis',
    lastVisit: '2024-03-08',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
  },
  {
    id: '4',
    name: 'Vikram Patel',
    age: 45,
    condition: 'Cardiac Care',
    lastVisit: '2024-03-14',
    nextAppointment: '2024-03-18',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
  },
];

export default function PatientsScreen() {
  const { user } = useContext(AuthContext);

  const handlePatientPress = (patientId: string) => {
    // Navigate to patient details
    console.log('Opening patient details for:', patientId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Patients</Text>
          <Text style={styles.headerSubtitle}>{mockPatients.length} active patients</Text>
        </View>
        <TouchableOpacity style={styles.calendarButton} onPress={handleCalendarpress}>
          <Calendar color="#2563EB" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mockPatients.map((patient) => (
          <TouchableOpacity
            key={patient.id}
            style={styles.patientCard}
            onPress={() => handlePatientPress(patient.id)}>
            
            <View style={styles.patientHeader}>
              <Image source={{ uri: patient.avatar }} style={styles.patientAvatar} />
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientAge}>Age: {patient.age} years</Text>
                <Text style={styles.patientCondition}>{patient.condition}</Text>
              </View>
              <ChevronRight color="#9CA3AF" size={20} />
            </View>

            <View style={styles.patientDetails}>
              <View style={styles.detailItem}>
                <Clock color="#6B7280" size={16} />
                <Text style={styles.detailText}>
                  Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                </Text>
              </View>
              
              {patient.nextAppointment && (
                <View style={styles.detailItem}>
                  <Calendar color="#10B981" size={16} />
                  <Text style={styles.detailText}>
                    Next: {new Date(patient.nextAppointment).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.patientActions}>
              <TouchableOpacity style={styles.actionButton}>
                <FileText color="#2563EB" size={18} />
                <Text style={styles.actionText}>History</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <FileText color="#059669" size={18} />
                <Text style={styles.actionText}>Prescriptions</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Calendar color="#7C2D12" size={18} />
                <Text style={styles.actionText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  calendarButton: {
    padding: 12,
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  patientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  patientAge: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  patientCondition: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  patientDetails: {
    marginBottom: 16,
    paddingLeft: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  patientActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 4,
    fontWeight: '500',
  },
});