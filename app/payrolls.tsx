import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function PayrollsPage() {
  const date = new Date();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Page Header */}
        <View style={styles.header}>
           <MaterialCommunityIcons name="file-document-outline" size={32} color="#38BDF8" />
           <View style={styles.headerTextContainer}>
             <Text style={styles.headerTitle}>Salary Slip</Text>
             <Text style={styles.headerSubtitle}>{`${monthName} ${year}`}</Text>
           </View>
        </View>

        {/* Earnings Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.card}>
            <Text style={styles.cardTitle}>Earnings Breakdown</Text>
            
            <View style={styles.row}>
                <Text style={styles.label}>Basic Pay (Level 10)</Text>
                <Text style={styles.value}>₹ 56,100</Text>
            </View>
            
            <View style={styles.row}>
                <Text style={styles.label}>Military Service Pay (MSP)</Text>
                <Text style={styles.value}>₹ 15,500</Text>
            </View>
            
            <View style={styles.row}>
                <Text style={styles.label}>Flying Allowance</Text>
                <Text style={styles.value}>₹ 17,300</Text>
            </View>
            
            <View style={styles.row}>
                <Text style={styles.label}>Dearness Allowance (DA)</Text>
                <Text style={styles.value}>₹ 6,100</Text>
            </View>
            
            <View style={[styles.row, styles.dividerRow]}>
                <Text style={styles.totalLabel}>Total Gross Salary</Text>
                <Text style={styles.totalValue}>₹ 95,000</Text>
            </View>
        </Animated.View>

        {/* Summary & Deductions Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.card}>
            <Text style={styles.cardTitle}>Net Salary Calculation</Text>
            
            <View style={styles.tableHeader}>
                <Text style={[styles.tableHead, { flex: 2 }]}>Item</Text>
                <Text style={[styles.tableHead, { flex: 1.5, textAlign: 'right' }]}>Amount</Text>
            </View>
            
            <View style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                    <Text style={styles.tableLabel}>Gross Monthly Salary</Text>
                    <Text style={styles.tableNote}>Basic + MSP + Flying + DA</Text>
                </View>
                <Text style={styles.tableValue}>₹ 95,000</Text>
            </View>

            <View style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                    <Text style={styles.tableLabel}>AFPPF Contribution</Text>
                    <Text style={styles.tableNote}>Mandatory min. 6% of Basic Pay</Text>
                </View>
                <Text style={[styles.tableValue, { color: '#FF4D4D' }]}>- ₹ 5,700</Text>
            </View>

            <View style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                    <Text style={styles.tableLabel}>Monthly Income Tax</Text>
                    <Text style={styles.tableNote}>Approx. based on standard regime</Text>
                </View>
                <Text style={[styles.tableValue, { color: '#FF4D4D' }]}>- ₹ 6,800</Text>
            </View>

            <View style={[styles.tableRow, styles.netRow]}>
                 <View style={{ flex: 2 }}>
                    <Text style={styles.netLabel}>Net In-Hand Salary</Text>
                    <Text style={styles.tableNote}>Total after deductions</Text>
                </View>
                <Text style={styles.netValue}>₹ 82,500</Text>
            </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  headerTextContainer: {
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38BDF8',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#94A3B8',
  },
  value: {
    fontSize: 15,
    color: '#F1F5F9',
    fontWeight: '600',
  },
  dividerRow: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 15,
    marginTop: 5,
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#38BDF8' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#38BDF8' },
  
  // Table Styles
  tableHeader: { flexDirection: 'row', marginBottom: 15, paddingHorizontal: 5 },
  tableHead: { color: '#94A3B8', fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 5 },
  tableLabel: { fontSize: 14, color: '#F1F5F9', fontWeight: '600' },
  tableNote: { fontSize: 11, color: '#64748B', marginTop: 2 },
  tableValue: { fontSize: 15, color: '#F1F5F9', fontWeight: '600', textAlign: 'right' },
  netRow: { backgroundColor: 'rgba(0, 208, 132, 0.1)', padding: 10, borderRadius: 10, marginTop: 5 },
  netLabel: { fontSize: 15, fontWeight: 'bold', color: '#00D084' },
  netValue: { fontSize: 20, fontWeight: 'bold', color: '#00D084', textAlign: 'right' },
});