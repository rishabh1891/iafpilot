import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, CircleProps, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const LeaveChart = ({ available, total, color, label }: { available: number, total: number, color: string, label: string }) => {
  const radius = 35;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(available / total, { duration: 1500 });
  }, [available, total]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - progress.value * circumference,
  } as Partial<CircleProps>));

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartWrapper}>
        <Svg width={90} height={90} viewBox="0 0 90 90">
          <G rotation="-90" origin="45, 45">
            <Circle
              cx="45"
              cy="45"
              r={radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <AnimatedCircle
              cx="45"
              cy="45"
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View style={styles.chartTextContainer}>
          <Text style={[styles.chartValue, { color }]}>{available}</Text>
        </View>
      </View>
      <Text style={styles.chartLabel}>{label}</Text>
    </View>
  );
};

export default function LeavesPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const isFormValid = leaveType.trim() !== '' && startDate.trim() !== '' && endDate.trim() !== '' && reason.trim() !== '';

  const handleRequest = () => {
    if (!isFormValid) return;
    
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      // Reset form
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
    }, 2000);
  };

  const consumedLeaves = [
    { date: '15 Mar 2026', type: 'Sick', days: 2, status: 'Approved' },
    { date: '02 Feb 2026', type: 'Casual', days: 1, status: 'Approved' },
    { date: '20 Jan 2026', type: 'Earned', days: 5, status: 'Approved' },
    { date: '10 Dec 2025', type: 'Sick', days: 1, status: 'Approved' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Leave Balances Section */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Leave Balance</Text>
          <View style={styles.chartsRow}>
            <LeaveChart available={7} total={15} color="#FF4D4D" label="Sick Leave" />
            <LeaveChart available={8} total={15} color="#FFD700" label="Casual Leave" />
            <LeaveChart available={10} total={30} color="#00D084" label="Earned Leave" />
          </View>
        </Animated.View>

        {/* Leave Request Form */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Request Leave</Text>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Leave Type</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Casual, Sick"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={leaveType}
                onChangeText={setLeaveType}
              />
            </View>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Start Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>End Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Reason</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter reason for leave..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                multiline
                numberOfLines={3}
                value={reason}
                onChangeText={setReason}
              />
            </View>
            <TouchableOpacity 
              style={[styles.button, !isFormValid && styles.buttonDisabled]} 
              onPress={handleRequest}
              disabled={!isFormValid}
            >
              <Text style={styles.buttonText}>Request</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Previous Leaves Record */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Previous Leaves Taken</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeadText, { flex: 2 }]}>Date</Text>
              <Text style={[styles.tableHeadText, { flex: 2 }]}>Type</Text>
              <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'center' }]}>Days</Text>
              <Text style={[styles.tableHeadText, { flex: 2, textAlign: 'right' }]}>Status</Text>
            </View>
            {consumedLeaves.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.date}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.type}</Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{item.days}</Text>
                <Text style={[styles.statusCell, { flex: 2, textAlign: 'right' }]}>{item.status}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

      </ScrollView>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons name="check-circle" size={50} color="#00D084" />
            <Text style={styles.modalText}>Request Sent</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f1a' },
  scrollContainer: { padding: 20, paddingBottom: 100 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFD700', marginBottom: 15, textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  
  // Charts
  chartsRow: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  chartContainer: { alignItems: 'center' },
  chartWrapper: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  chartTextContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  chartValue: { fontSize: 18, fontWeight: 'bold' },
  chartLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.7)' },

  // Form
  formCard: { backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)' },
  row: { flexDirection: 'row' },
  inputGroup: { marginBottom: 15 },
  label: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, marginBottom: 6, marginLeft: 4 },
  input: { backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 12, padding: 12, color: '#ffffff', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  textArea: { height: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#FFD700', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: { color: '#0a0f1a', fontWeight: 'bold', fontSize: 16 },

  // Table
  table: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  tableHeader: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 15 },
  tableHeadText: { color: '#FFD700', fontWeight: 'bold', fontSize: 13 },
  tableRow: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
  tableCell: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 13 },
  statusCell: { color: '#00D084', fontSize: 13, fontWeight: '600' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1a202c', padding: 30, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#00D084', width: 200 },
  modalText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginTop: 15 },
});