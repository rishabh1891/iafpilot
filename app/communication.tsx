import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const EMAILS = [
  {
    id: '1',
    from: 'Command Centre',
    email: 'command.centre@airforce.gov.in',
    subject: 'Urgent: Deployment Orders - Sector 7',
    time: '10:30 AM',
    read: false,
    body: 'Briefing at 1400 hrs regarding immediate deployment protocols for Sector 7. All unit heads to attend via secure line channel 4. Preparedness status report required by 1200 hrs.',
  },
  {
    id: '2',
    from: 'HR Department',
    email: 'hr.dept@airforce.gov.in',
    subject: 'Annual Leave Policy Update 2024',
    time: 'Yesterday',
    read: true,
    body: 'Please review the attached document regarding changes to the annual leave accumulation and encashment policies effective April 1st. Key changes include extension of carry-forward limits for deployed personnel.',
  },
  {
    id: '3',
    from: 'Maintenance Wing',
    email: 'maintenance@airforce.gov.in',
    subject: 'Aircraft Maintenance Schedule: B737',
    time: '2 days ago',
    read: true,
    body: 'Routine maintenance for tail number AF-202 is scheduled for next Tuesday. Flight operations for this aircraft are suspended for 48 hours. Please ensure all logbooks are updated.',
  },
  {
    id: '4',
    from: 'Training Division',
    email: 'training@airforce.gov.in',
    subject: 'Upcoming Simulation Training: High Altitude',
    time: '3 days ago',
    read: true,
    body: 'You have been nominated for the High Altitude Warfare Simulation training module. Report to the Training Wing by Monday, 0800 hrs. Pre-read material is attached.',
  },
  {
    id: '5',
    from: 'Logistics',
    email: 'logistics@airforce.gov.in',
    subject: 'Supply Chain Disruption Alert',
    time: '1 week ago',
    read: true,
    body: 'Minor disruptions expected in fuel supply chain for the eastern sector due to inclement weather. Ensure reserve tanks are maintained at operational capacity.',
  },
];

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<typeof EMAILS[0] | null>(null);

  // Compose State
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sentModalVisible, setSentModalVisible] = useState(false);

  const handleSend = () => {
    setSentModalVisible(true);
    setTimeout(() => {
        setSentModalVisible(false);
        setTo('');
        setSubject('');
        setBody('');
        setActiveTab('inbox');
    }, 2000);
  }

  const renderEmailItem = ({ item, index }: { item: typeof EMAILS[0], index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
    <TouchableOpacity 
      style={[styles.emailItem, !item.read && styles.unreadEmail]} 
      onPress={() => {
        setSelectedEmail(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.from.charAt(0)}</Text>
      </View>
      <View style={styles.emailContent}>
        <View style={styles.emailHeader}>
          <Text style={[styles.sender, !item.read && styles.unreadText]}>{item.from}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={[styles.subject, !item.read && styles.unreadText]} numberOfLines={1}>{item.subject}</Text>
        <Text style={styles.snippet} numberOfLines={2}>{item.body}</Text>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Communication Header */}
      <View style={styles.header}>
        <View>
            <Text style={styles.headerTitle}>Secure Comms</Text>
            <Text style={styles.userEmail}>rishabhtripathi@airforce.gov.in</Text>
        </View>
        <TouchableOpacity style={styles.composeButton} onPress={() => setActiveTab('compose')}>
            <MaterialCommunityIcons name="pencil" size={20} color="#F1F5F9" />
            <Text style={styles.composeButtonText}>Compose</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'inbox' && styles.activeTab]} 
            onPress={() => setActiveTab('inbox')}
        >
            <Text style={[styles.tabText, activeTab === 'inbox' && styles.activeTabText]}>Inbox</Text>
            {activeTab === 'inbox' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.tab, activeTab === 'compose' && styles.activeTab]} 
            onPress={() => setActiveTab('compose')}
        >
            <Text style={[styles.tabText, activeTab === 'compose' && styles.activeTabText]}>Drafts / Sent</Text>
             {activeTab === 'compose' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {activeTab === 'inbox' ? (
        <FlatList
          data={EMAILS}
          renderItem={renderEmailItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView style={styles.composeContainer}>
            <View style={styles.composeForm}>
                <Text style={styles.composeLabel}>To:</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Recipient (e.g. commanding.officer@iaf.in)"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={to}
                    onChangeText={setTo}
                />
                
                <Text style={styles.composeLabel}>Subject:</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Mission Report / Request"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={subject}
                    onChangeText={setSubject}
                />

                <Text style={styles.composeLabel}>Message:</Text>
                <TextInput 
                    style={[styles.input, styles.textArea]} 
                    placeholder="Enter classified message..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    multiline
                    textAlignVertical="top"
                    value={body}
                    onChangeText={setBody}
                />

                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.attachButton}>
                        <MaterialCommunityIcons name="paperclip" size={20} color="#38BDF8" />
                        <Text style={styles.attachText}>Attach File</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Text style={styles.sendButtonText}>Send Encrypted</Text>
                        <MaterialCommunityIcons name="send" size={16} color="#F1F5F9" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
      )}

      {/* Email Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <MaterialCommunityIcons name="close" size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <View style={styles.modalActions}>
                        <TouchableOpacity style={styles.modalActionBtn}>
                            <MaterialCommunityIcons name="reply" size={20} color="#38BDF8" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalActionBtn}>
                            <MaterialCommunityIcons name="trash-can-outline" size={20} color="#FF4D4D" />
                        </TouchableOpacity>
                    </View>
                </View>
                {selectedEmail && (
                    <ScrollView>
                        <Text style={styles.detailSubject}>{selectedEmail.subject}</Text>
                        <View style={styles.detailMeta}>
                            <View style={styles.avatarSmall}>
                                <Text style={styles.avatarTextSmall}>{selectedEmail.from.charAt(0)}</Text>
                            </View>
                            <View>
                                <Text style={styles.detailSender}>{selectedEmail.from}</Text>
                                <Text style={styles.detailEmail}>{selectedEmail.email}</Text>
                            </View>
                            <Text style={styles.detailTime}>{selectedEmail.time}</Text>
                        </View>
                        <View style={styles.divider} />
                        <Text style={styles.detailBody}>{selectedEmail.body}</Text>
                        <View style={styles.securityFooter}>
                            <MaterialCommunityIcons name="shield-lock" size={16} color="#00D084" />
                            <Text style={styles.securityText}>End-to-End Encrypted via IAF-NET</Text>
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
      </Modal>

      {/* Sent Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={sentModalVisible}
        onRequestClose={() => setSentModalVisible(false)}
      >
        <View style={styles.alertOverlay}>
            <View style={styles.alertContent}>
                <MaterialCommunityIcons name="check-decagram" size={48} color="#00D084" />
                <Text style={styles.alertTitle}>Message Sent</Text>
                <Text style={styles.alertDesc}>Encrypted & Delivered</Text>
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  userEmail: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  composeButton: {
    flexDirection: 'row',
    backgroundColor: '#0EA5E9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    gap: 5,
  },
  composeButtonText: {
    color: '#F1F5F9',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  tabText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#38BDF8',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '40%',
    backgroundColor: '#38BDF8',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  listContent: {
    padding: 10,
    paddingBottom: 100,
  },
  emailItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unreadEmail: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38BDF8',
  },
  emailContent: {
    flex: 1,
  },
  emailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sender: {
    fontSize: 14,
    color: '#F1F5F9',
    fontWeight: '500',
  },
  time: {
    fontSize: 11,
    color: '#64748B',
  },
  subject: {
    fontSize: 14,
    color: '#CBD5E1',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: 'bold',
    color: '#F1F5F9',
  },
  snippet: {
    fontSize: 12,
    color: '#94A3B8',
  },
  composeContainer: {
    padding: 20,
  },
  composeForm: {
    gap: 15,
  },
  composeLabel: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    color: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    height: 200,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 10,
  },
  attachText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  sendButton: {
    flexDirection: 'row',
    backgroundColor: '#0EA5E9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
  },
  sendButtonText: {
    color: '#F1F5F9',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    height: '90%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 15,
  },
  modalActionBtn: {
    padding: 5,
  },
  detailSubject: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 15,
  },
  detailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarTextSmall: {
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  detailSender: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
  },
  detailEmail: {
    color: '#94A3B8',
    fontSize: 12,
  },
  detailTime: {
    marginLeft: 'auto',
    color: '#64748B',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginBottom: 20,
  },
  detailBody: {
    color: '#CBD5E1',
    fontSize: 15,
    lineHeight: 24,
  },
  securityFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    padding: 10,
    backgroundColor: 'rgba(0, 208, 132, 0.1)',
    borderRadius: 8,
    gap: 8,
  },
  securityText: {
    color: '#00D084',
    fontSize: 12,
    fontWeight: '600',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    backgroundColor: '#1E293B',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00D084',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginTop: 15,
  },
  alertDesc: {
    color: '#94A3B8',
    marginTop: 5,
  },
});