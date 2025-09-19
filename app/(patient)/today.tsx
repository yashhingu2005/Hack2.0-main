import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '@/contexts/AuthContext';
import { Calendar, Clock, FileText, AlertTriangle, Plus, X, Pill, User, MapPin } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

const router = useRouter();
const handleSOSPress = () => {
  router.push('/(patient)/sos');
};

interface AppointmentRequest {
  id: string;
  patient_name: string;
  doctor_name: string;
  doctor_specialty: string;
  requested_time: string;
  appointment_type: 'video' | 'in-person';
  priority: 'high' | 'medium' | 'low';
  symptoms: string;
  status: 'pending' | 'confirmed' | 'rejected';
  consultation_fee: number;
  notes: string;
  created_at: string;
}

interface ConfirmedAppointment {
  id: string;
  patient_name: string;
  doctor_name: string;
  doctor_specialty: string;
  appointment_date: string;
  appointment_type: 'video' | 'in-person';
  priority: 'high' | 'medium' | 'low';
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  symptoms: string;
  notes: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  rating: number;
}

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  disease: string;
}

// Dummy prescriptions data (keeping your existing data)
const dummyPrescriptions = [
  {
    id: '1',
    doctorName: 'Dr. Priya Sharma',
    doctorSpecialty: 'Cardiologist',
    date: '2025-08-15',
    medicines: ['Telma 40mg - Take once daily on empty stomach', 'Glycomet 500mg - Take twice daily with meals'],
    instructions: 'Take medications with food. Monitor blood pressure daily. Follow up in 2 weeks.',
    status: 'active'
  },
  {
    id: '2',
    doctorName: 'Dr. Rajesh Gupta',
    doctorSpecialty: 'Cardiologist',
    date: '2025-07-20',
    medicines: ['Losar 50mg - Take once daily', 'Ecosprin 75mg - Take after dinner'],
    instructions: 'Continue current medication. Reduce salt intake. Avoid oily and spicy foods.',
    status: 'completed'
  },
  {
    id: '3',
    doctorName: 'Dr. Sunita Patel',
    doctorSpecialty: 'Cardiologist',
    date: '2025-06-10',
    medicines: ['Atorva 20mg - Take at bedtime'],
    instructions: 'Can be taken with or without food. Get cholesterol test done monthly.',
    status: 'active'
  },
  {
    id: '4',
    doctorName: 'Dr. Amit Singh',
    doctorSpecialty: 'Oncologist',
    date: '2025-08-25',
    medicines: ['Nolvadex 20mg - Take daily at same time', 'Ondansetron 8mg - Take when nauseous'],
    instructions: 'Take Nolvadx at the same time daily. Use Ondansetron only when experiencing nausea.',
    status: 'active'
  },
  {
    id: '5',
    doctorName: 'Dr. Kavita Joshi',
    doctorSpecialty: 'Oncologist',
    date: '2025-07-30',
    medicines: ['Perinorm 10mg - Take before meals'],
    instructions: 'Take 30 minutes before meals. Contact immediately if severe side effects occur.',
    status: 'completed'
  },
  {
    id: '6',
    doctorName: 'Dr. Manoj Kumar',
    doctorSpecialty: 'Neurologist',
    date: '2025-08-20',
    medicines: ['Gabapin 300mg - Take three times daily', 'Neurobion Forte - Take once daily'],
    instructions: 'Gradually increase dosage as tolerated. Take with food to avoid stomach upset.',
    status: 'active'
  },
  {
    id: '7',
    doctorName: 'Dr. Deepika Agarwal',
    doctorSpecialty: 'Dermatologist',
    date: '2025-08-10',
    medicines: ['Tretinoin 0.025% - Apply at night', 'Sunscreen SPF 30 - Apply daily'],
    instructions: 'Apply Tretinoin sparingly. Always use sunscreen during the day.',
    status: 'active'
  }
];

export default function TodayScreen() {
  const { user } = useContext(AuthContext);
  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState<ConfirmedAppointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [todaysMedicines, setTodaysMedicines] = useState<Medicine[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  
  // Modal states
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  
  // Form states for appointment request
  const [appointmentForm, setAppointmentForm] = useState({
    doctor_id: '',
    requested_time: '',
    appointment_type: 'in-person',
    priority: 'medium',
    symptoms: '',
    notes: '',
  });
  
  // Form states for medicine
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    disease: '',
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
      case 'confirmed':
        return '#059669'; // Green
      case 'pending':
        return '#F59E0B'; // Orange
      case 'completed':
        return '#6B7280'; // Gray
      case 'cancelled':
      case 'rejected':
        return '#DC2626'; // Red
      default:
        return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#DC2626'; // Red
      case 'medium':
        return '#F59E0B'; // Orange
      case 'low':
        return '#059669'; // Green
      default:
        return '#6B7280';
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          doctors (
            specialty,
            hospital,
            rating
          )
        `)
        .eq('role', 'doctor');

      if (error) {
        console.error('Error fetching doctors:', error);
        return;
      }

      if (data) {
        const mappedDoctors: Doctor[] = data.map((doctor: any) => ({
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.doctors?.specialty || 'General Medicine',
          hospital: doctor.doctors?.hospital || 'Not specified',
          rating: doctor.doctors?.rating || 0,
        }));
        setDoctors(mappedDoctors);
      }
    } catch (error) {
      console.error('Unexpected error fetching doctors:', error);
    }
  };

  const fetchAppointmentRequests = async () => {
    if (!user) {
      setLoadingAppointments(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appointment_requests')
        .select(`
          *,
          doctor:doctor_id (
            name,
            doctors (
              specialty
            )
          )
        `)
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching appointment requests:', error);
      } else if (data) {
        const mappedRequests: AppointmentRequest[] = data.map((req: any) => ({
          id: req.id,
          patient_name: req.patient_name,
          doctor_name: req.doctor?.name || 'Unknown Doctor',
          doctor_specialty: req.doctor?.doctors?.specialty || 'General Medicine',
          requested_time: req.requested_time,
          appointment_type: req.appointment_type,
          priority: req.priority,
          symptoms: req.symptoms || '',
          status: req.status,
          consultation_fee: req.consultation_fee || 0,
          notes: req.notes || '',
          created_at: req.created_at,
        }));
        setAppointmentRequests(mappedRequests);
      }
    } catch (error) {
      console.error('Unexpected error fetching appointment requests:', error);
    }
  };

  const fetchConfirmedAppointments = async () => {
    if (!user) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor:doctor_id (
            name,
            doctors (
              specialty
            )
          ),
          patient:patient_id (
            name
          )
        `)
        .eq('patient_id', user.id)
        .in('status', ['scheduled', 'confirmed'])
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Error fetching confirmed appointments:', error);
      } else if (data) {
        const mappedAppointments: ConfirmedAppointment[] = data.map((apt: any) => ({
          id: apt.id,
          patient_name: apt.patient?.name || 'Unknown Patient',
          doctor_name: apt.doctor?.name || 'Unknown Doctor',
          doctor_specialty: apt.doctor?.doctors?.specialty || 'General Medicine',
          appointment_date: apt.appointment_date,
          appointment_type: apt.appointment_type,
          priority: apt.priority,
          type: apt.type,
          status: apt.status,
          symptoms: apt.symptoms || '',
          notes: apt.notes || '',
        }));
        setConfirmedAppointments(mappedAppointments);
      }
    } catch (error) {
      console.error('Unexpected error fetching confirmed appointments:', error);
    }
  };

  const loadTodaysMedicines = () => {
    // Extract medicines from active prescriptions
    const activeMedicines: Medicine[] = [];
    
    dummyPrescriptions
      .filter(prescription => prescription.status === 'active')
      .forEach(prescription => {
        prescription.medicines.forEach((medicine, index) => {
          const [name, instruction] = medicine.split(' - ');
          activeMedicines.push({
            id:` ${prescription.id}-${index}`,
            name: name.trim(),
            dosage: name.split(' ')[1] || '',
            frequency: instruction || '',
            disease: prescription.doctorSpecialty || 'General',
          });
        });
      });
    
    setTodaysMedicines(activeMedicines);
  };

  const handleAddAppointmentRequest = async () => {
    if (!user || !appointmentForm.doctor_id || !appointmentForm.requested_time) {
      Alert.alert('Error', 'Please fill in all required fields (Doctor and Requested Time)');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appointment_requests')
        .insert([
          {
            patient_id: user.id,
            doctor_id: appointmentForm.doctor_id,
            patient_name: user.name || 'Unknown Patient',
            requested_time: appointmentForm.requested_time,
            appointment_type: appointmentForm.appointment_type,
            priority: appointmentForm.priority,
            symptoms: appointmentForm.symptoms,
            notes: appointmentForm.notes,
            status: 'pending',
            consultation_fee: 0,
          }
        ])
        .select();

      if (error) {
        console.error('Error creating appointment request:', error);
        Alert.alert('Error', 'Failed to create appointment request. Please try again.');
        return;
      }

      if (data) {
        Alert.alert('Success', 'Appointment request submitted successfully!');
        setAppointmentForm({
          doctor_id: '',
          requested_time: '',
          appointment_type: 'in-person',
          priority: 'medium',
          symptoms: '',
          notes: '',
        });
        setShowAppointmentModal(false);
        fetchAppointmentRequests(); // Refresh the list
      }
    } catch (error) {
      console.error('Unexpected error creating appointment request:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleAddMedicine = () => {
    if (!medicineForm.name || !medicineForm.dosage || !medicineForm.frequency || !medicineForm.disease) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: medicineForm.name,
      dosage: medicineForm.dosage,
      frequency: medicineForm.frequency,
      disease: medicineForm.disease,
    };

    setTodaysMedicines(prev => [...prev, newMedicine]);
    setMedicineForm({ name: '', dosage: '', frequency: '', disease: '' });
    setShowMedicineModal(false);
    Alert.alert('Success', 'Medicine added successfully!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoadingAppointments(true);
      await Promise.all([
        fetchDoctors(),
        fetchAppointmentRequests(),
        fetchConfirmedAppointments(),
      ]);
      loadTodaysMedicines();
      setLoadingAppointments(false);
    };

    loadData();
  }, [user]);

  if (loadingAppointments) {
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
        {/* Confirmed Appointments Section */}
        {confirmedAppointments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Confirmed Appointments</Text>
            {confirmedAppointments.map((appointment) => (
              <View key={appointment.id} style={[styles.card, styles.confirmedCard]}>
                <View style={styles.cardHeader}>
                  <Calendar color="#059669" size={20} />
                  <Text style={styles.cardTitle}>{appointment.doctor_name}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(appointment.priority) }]}>
                    <Text style={styles.priorityText}>{appointment.priority.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.cardRow}>
                  <User color="#6B7280" size={16} />
                  <Text style={styles.cardText}>{appointment.doctor_specialty}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Clock color="#6B7280" size={16} />
                  <Text style={styles.cardText}>{formatDate(appointment.appointment_date)}</Text>
                </View>
                <View style={styles.cardRow}>
                  <MapPin color="#6B7280" size={16} />
                  <Text style={styles.cardText}>{appointment.appointment_type === 'video' ? 'Video Call' : 'In-Person'}</Text>
                </View>
                {appointment.symptoms && (
                  <Text style={styles.symptomsText}>Symptoms: {appointment.symptoms}</Text>
                )}
                <View style={styles.statusContainer}>
                  <Text style={styles.cardText}>Status: </Text>
                  <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
                    {appointment.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Appointment Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Appointment Requests</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAppointmentModal(true)}
            >
              <Plus color="#059669" size={20} />
            </TouchableOpacity>
          </View>
          {appointmentRequests.length > 0 ? (
            appointmentRequests.map((request) => (
              <View key={request.id} style={[styles.card, styles.requestCard]}>
                <View style={styles.cardHeader}>
                  <Calendar color="#F59E0B" size={20} />
                  <Text style={styles.cardTitle}>{request.doctor_name}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(request.priority) }]}>
                    <Text style={styles.priorityText}>{request.priority.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.cardRow}>
                  <User color="#6B7280" size={16} />
                  <Text style={styles.cardText}>{request.doctor_specialty}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Clock color="#6B7280" size={16} />
                  <Text style={styles.cardText}>Requested: {request.requested_time}</Text>
                </View>
                <View style={styles.cardRow}>
                  <MapPin color="#6B7280" size={16} />
                  <Text style={styles.cardText}>{request.appointment_type === 'video' ? 'Video Call' : 'In-Person'}</Text>
                </View>
                {request.symptoms && (
                  <Text style={styles.symptomsText}>Symptoms: {request.symptoms}</Text>
                )}
                {request.consultation_fee > 0 && (
                  <Text style={styles.feeText}>Fee: ₹{request.consultation_fee}</Text>
                )}
                <View style={styles.statusContainer}>
                  <Text style={styles.cardText}>Status: </Text>
                  <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                    {request.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No appointment requests found.</Text>
          )}
        </View>

        {/* Today's Medicine Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Medicine</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowMedicineModal(true)}
            >
              <Plus color="#059669" size={20} />
            </TouchableOpacity>
          </View>
          {todaysMedicines.length > 0 ? (
            todaysMedicines.map((medicine) => (
              <View key={medicine.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Pill color="#8B5CF6" size={20} />
                  <Text style={styles.cardTitle}>{medicine.name}</Text>
                </View>
                <Text style={styles.cardText}>Dosage: {medicine.dosage}</Text>
                <Text style={styles.cardText}>Frequency: {medicine.frequency}</Text>
                <Text style={styles.cardText}>For: {medicine.disease}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No medicines scheduled for today.</Text>
          )}
        </View>
      </ScrollView>

      {/* Appointment Request Modal */}
      <Modal
        visible={showAppointmentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAppointmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.modalHeader}>
                <View style={styles.headerLeft}>
                  <Calendar color="#F59E0B" size={20} />
                  <Text style={styles.modalTitle}>Request Appointment</Text>
                </View>
                <TouchableOpacity onPress={() => setShowAppointmentModal(false)}>
                  <X color="#6B7280" size={24} />
                </TouchableOpacity>
              </View>

              <Text style={styles.fieldLabel}>Select Doctor *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={appointmentForm.doctor_id}
                  onValueChange={(value) => setAppointmentForm(prev => ({...prev, doctor_id: value}))}
                  style={styles.picker}
                >
                  <Picker.Item label="Choose a doctor..." value="" />
                  {doctors.map((doctor) => (
                    <Picker.Item
                      key={doctor.id}
                      label={`${doctor.name} - ${doctor.specialty}`}
                      value={doctor.id}
                    />
                  ))}
                </Picker>
              </View>

              <Text style={styles.fieldLabel}>Requested Time *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Tomorrow 2:00 PM or Oct 25, 2024 3:00 PM"
                value={appointmentForm.requested_time}
                onChangeText={(text) => setAppointmentForm(prev => ({...prev, requested_time: text}))}
              />

              <Text style={styles.fieldLabel}>Appointment Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={appointmentForm.appointment_type}
                  onValueChange={(value) => setAppointmentForm(prev => ({...prev, appointment_type: value}))}
                  style={styles.picker}
                >
                  <Picker.Item label="In-Person" value="in-person" />
                  <Picker.Item label="Video Call" value="video" />
                </Picker>
              </View>

              <Text style={styles.fieldLabel}>Priority</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={appointmentForm.priority}
                  onValueChange={(value) => setAppointmentForm(prev => ({...prev, priority: value}))}
                  style={styles.picker}
                >
                  <Picker.Item label="Low" value="low" />
                  <Picker.Item label="Medium" value="medium" />
                  <Picker.Item label="High" value="high" />
                </Picker>
              </View>

              <Text style={styles.fieldLabel}>Symptoms</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your symptoms..."
                value={appointmentForm.symptoms}
                onChangeText={(text) => setAppointmentForm(prev => ({...prev, symptoms: text}))}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.fieldLabel}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any additional information..."
                value={appointmentForm.notes}
                onChangeText={(text) => setAppointmentForm(prev => ({...prev, notes: text}))}
                multiline
                numberOfLines={2}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAppointmentModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleAddAppointmentRequest}
                >
                  <Text style={styles.submitButtonText}>Submit Request</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Medicine Modal */}
      <Modal
        visible={showMedicineModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMedicineModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Medicine</Text>
              <TouchableOpacity onPress={() => setShowMedicineModal(false)}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            </ScrollView>
            
            <TextInput
              style={styles.input}
              placeholder="Medicine Name"
              value={medicineForm.name}
              onChangeText={(text) => setMedicineForm(prev => ({...prev, name: text}))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Dosage (e.g., 40mg)"
              value={medicineForm.dosage}
              onChangeText={(text) => setMedicineForm(prev => ({...prev, dosage: text}))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Frequency (e.g., Once daily)"
              value={medicineForm.frequency}
              onChangeText={(text) => setMedicineForm(prev => ({...prev, frequency: text}))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Disease/Condition"
              value={medicineForm.disease}
              onChangeText={(text) => setMedicineForm(prev => ({...prev, disease: text}))}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowMedicineModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleAddMedicine}
              >
                <Text style={styles.submitButtonText}>Add Medicine</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  sosButton: {
    backgroundColor: '#DC2626',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#059669',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  confirmedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  requestCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
    flex: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  symptomsText: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
    fontStyle: 'italic',
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 6,
  },
  feeText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
  flex: 1,
  padding: 20,
},
  modalContainer: {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  width: '90%',
  maxWidth: 400,
  maxHeight: '80%',
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 5,
},
  scrollContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
  },
  cancelButtonText: {
    textAlign: 'center',
    color: '#64748B',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#059669',
    marginLeft: 8,
  },
  submitButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '600',
  },
});