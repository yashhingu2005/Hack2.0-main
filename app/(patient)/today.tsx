import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { Calendar, Clock, FileText, AlertTriangle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

const router = useRouter();
const handleSOSPress = () => {
  router.push('/(patient)/sos');
};

interface Appointment {
  id: string;
  doctorName: string;
  appointmentDate: string;
  time: string;
  status: string;
}

interface Prescription {
  id: string;
  doctorName: string;
  date: string;
  medicines: string[];
  instructions: string;
  status: string;
}

export default function TodayScreen() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          users!appointments_patient_id_fkey(name)
        `)
        .eq('patient_id', user.id)
        .order('appointment_date', { ascending: false })
        .limit(10)
        .eq('status', 'scheduled');


      if (error) {
        console.error('Error fetching appointments:', error);
      } else if (data) {
        const mappedAppointments: Appointment[] = data.map((apt: any) => ({
          id: apt.id,
          doctorName: apt.users?.name || 'Unknown Doctor',
          appointmentDate: apt.appointment_date,
          time: new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: apt.status,
        }));
        setAppointments(mappedAppointments);
      }
    } catch (error) {
      console.error('Unexpected error fetching appointments:', error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const fetchPrescriptions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          doctor:users!doctor_id(name)
        `)
        .eq('patient_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prescriptions:', error);
      } else if (data) {
        const mappedPrescriptions: Prescription[] = data.map((pres: any) => ({
          id: pres.id,
          doctorName: pres.doctor?.name || 'Unknown Doctor',
          date: pres.created_at,
          medicines: Array.isArray(pres.medicines) ? pres.medicines : [],
          instructions: pres.instructions || '',
          status: pres.status,
        }));
        setPrescriptions(mappedPrescriptions);
      }
    } catch (error) {
      console.error('Unexpected error fetching prescriptions:', error);
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchPrescriptions();
  }, [user]);

  if (loadingAppointments || loadingPrescriptions) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#059669" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Today</Text>
          <Text style={styles.headerSubtitle}>{new Date().toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
          <AlertTriangle color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appointments Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointments</Text>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <View key={appointment.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Calendar color="#2563EB" size={20} />
                  <Text style={styles.cardTitle}>{appointment.doctorName}</Text>
                </View>
                <Text style={styles.cardText}>Time: {appointment.time}</Text>
                <Text style={styles.cardText}>Status: {appointment.status}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No appointments scheduled for today.</Text>
          )}
        </View>

        {/* Prescriptions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescriptions</Text>
          {prescriptions.length > 0 ? (
            prescriptions.map((prescription) => (
              <View key={prescription.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <FileText color="#059669" size={20} />
                  <Text style={styles.cardTitle}>{prescription.doctorName}</Text>
                </View>
                <Text style={styles.cardText}>Medicines: {prescription.medicines.join(', ')}</Text>
                <Text style={styles.cardText}>Instructions: {prescription.instructions}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No active prescriptions.</Text>
          )}
        </View>
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
  sosButton: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
});
