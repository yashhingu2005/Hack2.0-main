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
import { 
  Calendar, 
  FileText, 
  Download, 
  Eye, 
  User,
  Clock,
  ChevronRight
} from 'lucide-react-native';

import { useRouter } from 'expo-router';
const router = useRouter();
const handleCalendarpress = () => {
  router.push('/(doctor)/calendar');
};

interface Report {
  id: string;
  patientName: string;
  reportType: string;
  uploadDate: string;
  status: 'pending' | 'reviewed' | 'urgent';
  fileSize: string;
  thumbnail: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    patientName: 'Priya Sharma',
    reportType: 'Blood Test Results',
    uploadDate: '2024-03-15',
    status: 'pending',
    fileSize: '2.3 MB',
    thumbnail: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg'
  },
  {
    id: '2',
    patientName: 'Rajesh Kumar',
    reportType: 'Chest X-Ray',
    uploadDate: '2024-03-14',
    status: 'urgent',
    fileSize: '4.1 MB',
    thumbnail: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg'
  },
  {
    id: '3',
    patientName: 'Anita Singh',
    reportType: 'ECG Report',
    uploadDate: '2024-03-13',
    status: 'reviewed',
    fileSize: '1.8 MB',
    thumbnail: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg'
  },
  {
    id: '4',
    patientName: 'Vikram Patel',
    reportType: 'MRI Scan',
    uploadDate: '2024-03-10',
    status: 'pending',
    fileSize: '8.7 MB',
    thumbnail: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg'
  },
];

export default function ReportsScreen() {
  const { user } = useContext(AuthContext);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return '#EF4444';
      case 'pending': return '#F59E0B';
      case 'reviewed': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'urgent': return '#FEF2F2';
      case 'pending': return '#FFFBEB';
      case 'reviewed': return '#F0FDF4';
      default: return '#F9FAFB';
    }
  };

  const handleReportPress = (reportId: string) => {
    console.log('Opening report:', reportId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Patient Reports</Text>
          <Text style={styles.headerSubtitle}>{mockReports.length} reports to review</Text>
        </View>
        <TouchableOpacity style={styles.calendarButton} onPress={handleCalendarpress}>
          <Calendar color="#2563EB" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Tabs */}
        <View style={styles.filterSection}>
          <TouchableOpacity style={[styles.filterTab, styles.activeTab]}>
            <Text style={[styles.filterText, styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterText}>Urgent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterText}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterText}>Reviewed</Text>
          </TouchableOpacity>
        </View>

        {/* Reports List */}
        {mockReports.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={styles.reportCard}
            onPress={() => handleReportPress(report.id)}>
            
            <View style={styles.reportHeader}>
              <Image source={{ uri: report.thumbnail }} style={styles.reportThumbnail} />
              
              <View style={styles.reportInfo}>
                <Text style={styles.patientName}>{report.patientName}</Text>
                <Text style={styles.reportType}>{report.reportType}</Text>
                
                <View style={styles.reportMeta}>
                  <View style={styles.dateContainer}>
                    <Clock color="#6B7280" size={14} />
                    <Text style={styles.uploadDate}>
                      {new Date(report.uploadDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.fileSize}>{report.fileSize}</Text>
                </View>
              </View>

              <View style={styles.reportStatus}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusBgColor(report.status) }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(report.status) }
                  ]}>
                    {report.status.toUpperCase()}
                  </Text>
                </View>
                <ChevronRight color="#9CA3AF" size={20} />
              </View>
            </View>

            <View style={styles.reportActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Eye color="#2563EB" size={18} />
                <Text style={styles.actionText}>View</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Download color="#059669" size={18} />
                <Text style={styles.actionText}>Download</Text>
              </TouchableOpacity>
              
              {report.status === 'pending' && (
                <TouchableOpacity style={styles.actionButton}>
                  <FileText color="#F59E0B" size={18} />
                  <Text style={styles.actionText}>Review</Text>
                </TouchableOpacity>
              )}
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
  },
  filterSection: {
    flexDirection: 'row',
    paddingVertical: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  activeTab: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  reportInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  reportType: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 8,
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  fileSize: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  reportStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 6,
    fontWeight: '500',
  },
});