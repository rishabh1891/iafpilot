import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import Svg, { Circle, CircleProps, G } from 'react-native-svg';
import CommunicationPage from './communication';
import LeavesPage from './leaves';
import MissionsPage from './missions';
import PayrollsPage from './payrolls';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedNumber = ({ value, style, prefix = '', suffix = '' }: { value: number, style?: any, prefix?: string, suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1500;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // Ease out quart
      
      setDisplayValue(Math.floor(ease * value));
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  }, [value]);

  return <Text style={style}>{prefix}{displayValue.toLocaleString()}{suffix}</Text>;
};

const StatRing = ({ percent, label, color }: { percent: number; label: string; color: string }) => {
  const radius = 35;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(500, withTiming(1, { duration: 1500 }));
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference - (percent / 100) * circumference * progress.value,
    } as Partial<CircleProps>;
  });

  return (
    <View style={styles.chartItem}>
      <View style={styles.chartCircleWrapper}>
        <Svg width={80} height={80} viewBox="0 0 80 80">
          <G rotation="-90" origin="40, 40">
            <Circle cx="40" cy="40" r={radius} stroke="#334155" strokeWidth={strokeWidth} fill="transparent" />
            <AnimatedCircle
              cx="40"
              cy="40"
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
        <View style={styles.chartPercentageContainer}>
           <AnimatedNumber value={percent} style={[styles.chartPercentage, { color }]} suffix="%" />
        </View>
      </View>
      <Text style={styles.chartLabelText}>{label}</Text>
    </View>
  );
};

export default function Index() {
  const [modalVisible, setModalVisible] = useState(true);
  const [profileImageVisible, setProfileImageVisible] = useState(false);
  const [airId, setAirId] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const handleSubmit = () => {
    if (airId === '24657463') {
      setModalVisible(false);
      setShowProfile(true);
    } else {
      Alert.alert('Invalid Air ID', 'Please enter a valid Air ID');
    }
  };

  const renderContent = () => {
    if (activeTab === 'missions') {
      return <MissionsPage />;
    }
    if (activeTab === 'leaves') {
      return <LeavesPage />;
    }
    if (activeTab === 'payrolls') {
      return <PayrollsPage />;
    }
    if (activeTab === 'communication') {
      return <CommunicationPage />;
    }

    // Default Home Content (rendered for 'home' and other tabs for now)
    return (
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Profile Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.profileCard}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={() => setProfileImageVisible(true)}>
                <View style={styles.avatar}>
                  <Image
                    source={{ uri: 'https://i.ibb.co/4ZmttBFL/IMG-0135.jpg' }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.nameSection}>
              <Text style={styles.rank}>First Officer</Text>
              <View style={styles.nameRow}>
                <Text style={styles.name}>Rishabh Tripathi</Text>
                <View style={styles.pilotBadge}>
                  <MaterialCommunityIcons name="shield-star-outline" size={12} color="#F59E0B" />
                  <Text style={styles.pilotBadgeText}>PILOT</Text>
                </View>
              </View>
              <Text style={styles.airId}>Air Force ID: {airId}</Text>
            </View>
          </View>

          {/* Profile Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Squadron</Text>
                <Text style={styles.detailValue}>TTW</Text>
                <Text style={styles.detailSubValue}>&ldquo;No. 2 TTW&rdquo;</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Aircraft</Text>
                <Text style={styles.detailValue}>B737 AN-32</Text>
                <Text style={styles.detailSubValue}>National Cargo</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Base Station</Text>
                <Text style={styles.detailValue}>Yelahanka AFS</Text>
                <Text style={styles.detailSubValue}>Bengaluru</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Service</Text>
                <Text style={styles.detailValue}>3.2 Years</Text>
                <Text style={styles.detailSubValue}>Commissioned 2023</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Specialization</Text>
                <Text style={styles.detailValue}>Cargo Transfer</Text>
                <Text style={styles.detailSubValue}>Aircraft Operations</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>Active Duty</Text>
                <Text style={styles.detailSubValue}>On-Training</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Mentors Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.mentorsSection}>
          <Text style={styles.mentorsTitle}>Mentors</Text>
          <View style={styles.mentorsContainer}>
            {/* First Mentor */}
            <View style={styles.mentorCard}>
             <View style={styles.mentorInfo}>
                 <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Air_Marshal_Chandrashekharan_Hari_Kumar_Indian_Air_Force.jpg' }}
                style={styles.mentorImage}
                resizeMode="cover"
              />
                <Text style={styles.mentorName}>Nagrajan Mutthuswami</Text>
                <Text style={styles.mentorRank}>Air Marshal</Text>
                <Text style={styles.mentorAwards}>PVSM, AVSM, VSM</Text>
              </View>
              <View style={styles.mentorInfo}>
                 <Image
                source={{ uri: 'https://www.bharat-rakshak.com/indianairforce/images/officers/22920.jpg' }}
                style={styles.mentorImage}
                resizeMode="cover"
              />
                <Text style={styles.mentorName}>Mukesh Kumar Yadav</Text>
                <Text style={styles.mentorRank}>Air Commodore</Text>
                <Text style={styles.mentorAwards}>AVSM, VSM, MGP</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Pilot Statistics Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.statisticsSection}>
          <Text style={styles.statisticsTitle}>Pilot Statistics</Text>
          
          {/* Dynamic Charts */}
          <View style={styles.chartsRow}>
            <StatRing percent={83} label="Success Rate" color="#38BDF8" />
            <StatRing percent={94} label="Readiness" color="#00D084" />
            <StatRing percent={78} label="Simulations" color="#F59E0B" />
          </View>

          {/* First Row of Statistics */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="airplane" size={28} color="#FFD700" />
              <AnimatedNumber value={1368} style={styles.statValue} />
              <Text style={styles.statLabel}>Flying Hours</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="clock-outline" size={28} color="#FFD700" />
              <AnimatedNumber value={673} style={styles.statValue} />
              <Text style={styles.statLabel}>Air Time (hrs)</Text>
            </View>
          </View>

          {/* Second Row of Statistics */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="rocket" size={28} color="#FFD700" />
              <AnimatedNumber value={489} style={styles.statValue} />
              <Text style={styles.statLabel}>Take Offs</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="target" size={28} color="#FFD700" />
              <AnimatedNumber value={513} style={styles.statValue} />
              <Text style={styles.statLabel}>Landings</Text>
            </View>
          </View>

          {/* Third Row of Statistics */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="cloud" size={28} color="#FFD700" />
              <AnimatedNumber value={40501} style={styles.statValue} />
              <Text style={styles.statLabel}>Max Altitude (ft)</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="medal" size={28} color="#FFD700" />
              <AnimatedNumber value={72} style={styles.statValue} />
              <Text style={styles.statLabel}>Missions</Text>
            </View>
          </View>

          {/* Fourth Row - Special Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="lightning-bolt" size={28} color="#FFD700" />
              <AnimatedNumber value={83} style={styles.statValue} suffix="%" />
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="shield-check" size={28} color="#FFD700" />
              <AnimatedNumber value={0} style={styles.statValue} />
              <Text style={styles.statLabel}>Incidents</Text>
            </View>
          </View>
        </Animated.View>

        {/* Awards & Decorations Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.awardSection}>
          <Text style={styles.awardTitle}>Awards & Decorations</Text>
          <View style={styles.awardContainer}>
            <View style={styles.awardItem}>
              <MaterialCommunityIcons name="medal" size={32} color="#FFD700" />
              <Text style={styles.awardName}>SIC</Text>
              <Text style={styles.awardDesc}>Second In Command</Text>
            </View>
            <View style={styles.awardItem}>
              <MaterialCommunityIcons name="star" size={32} color="#FFD700" />
              <Text style={styles.awardName}>Ace Flyer</Text>
              <Text style={styles.awardDesc}>No fear for weather</Text>
            </View>
            <View style={styles.awardItem}>
              <MaterialCommunityIcons name="shield-star" size={32} color="#FFD700" />
              <Text style={styles.awardName}>Scout</Text>
              <Text style={styles.awardDesc}>Flight Planner</Text>
            </View>
            <View style={styles.awardItem}>
              <MaterialCommunityIcons name="certificate" size={32} color="#FFD700" />
              <Text style={styles.awardName}>Navigator</Text>
              <Text style={styles.awardDesc}>Plane Stirrer</Text>
            </View>
          </View>
        </Animated.View>

        {/* Certifications Section */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.certSection}>
          <Text style={styles.certTitle}>Certifications & Qualifications</Text>
          <View style={styles.certList}>
            <View style={styles.certItem}>
              <MaterialCommunityIcons name="checkbox-marked-circle" size={24} color="#FFD700" />
              <View style={styles.certContent}>
                <Text style={styles.certName}>B737 Type Certification</Text>
                <Text style={styles.certDate}>Certified: April 2023</Text>
              </View>
            </View>
            <View style={styles.certItem}>
              <MaterialCommunityIcons name="checkbox-marked-circle" size={24} color="#FFD700" />
              <View style={styles.certContent}>
                <Text style={styles.certName}>An-32 Advanced Training</Text>
                <Text style={styles.certDate}>Completed: August 2024</Text>
              </View>
            </View>
            <View style={styles.certItem}>
              <MaterialCommunityIcons name="checkbox-marked-circle" size={24} color="#FFD700" />
              <View style={styles.certContent}>
                <Text style={styles.certName}>Leadership & Command Course</Text>
                <Text style={styles.certDate}>Completed: January 2024</Text>
              </View>
            </View>
            <View style={styles.certItem}>
              <MaterialCommunityIcons name="checkbox-marked-circle" size={24} color="#FFD700" />
              <View style={styles.certContent}>
                <Text style={styles.certName}>Advanced Navigation Systems</Text>
                <Text style={styles.certDate}>Certified: August 2025</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Recent Missions Section */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.missionsSection}>
          <Text style={styles.missionsTitle}>Top Missions</Text>
          <View style={styles.missionsList}>
            <View style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <MaterialCommunityIcons name="airplane-takeoff" size={24} color="#FFD700" />
                <View style={styles.missionInfo}>
                  <Text style={styles.missionType}>Cargo Transport</Text>
                  <Text style={styles.missionDate}>16 Aug 2024 • 6.5 hrs</Text>
                </View>
              </View>
              <Text style={styles.missionLocation}>VIZ → ZUR</Text>
              <View style={styles.missionBadge}>
                <Text style={styles.missionStatus}>Completed</Text>
              </View>
            </View>
            <View style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <MaterialCommunityIcons name="airplane-landing" size={24} color="#FFD700" />
                <View style={styles.missionInfo}>
                  <Text style={styles.missionType}>Red Zone Landing</Text>
                  <Text style={styles.missionDate}>19 Jan 2025 • 2.3 hrs</Text>
                </View>
              </View>
              <Text style={styles.missionLocation}>Vishakhapattnam Naval Station</Text>
              <View style={styles.missionBadge}>
                <Text style={styles.missionStatus}>Completed</Text>
              </View>
            </View>
            <View style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <MaterialCommunityIcons name="truck-cargo-container" size={24} color="#FFD700" />
                <View style={styles.missionInfo}>
                  <Text style={styles.missionType}>Emergency Take-Off</Text>
                  <Text style={styles.missionDate}>18 May 2024 • 3.8 hrs</Text>
                </View>
              </View>
              <Text style={styles.missionLocation}>Vishakhapattnam → Guwahati</Text>
              <View style={styles.missionBadge}>
                <Text style={styles.missionStatus}>Completed</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Aircraft Experience Section */}
        <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.aircraftSection}>
          <Text style={styles.aircraftTitle}>Aircraft Experience</Text>
          <View style={styles.aircraftGrid}>
            <View style={styles.aircraftCard}>
              <MaterialCommunityIcons name="airplane" size={36} color="#FFD700" />
              <Text style={styles.aircraftName}>B737</Text>
              <Text style={styles.aircraftHours}>850 hrs</Text>
              <Text style={styles.aircraftFlights}>124 flights</Text>
            </View>
            <View style={styles.aircraftCard}>
              <MaterialCommunityIcons name="airplane" size={36} color="#FFD700" />
              <Text style={styles.aircraftName}>An-32</Text>
              <Text style={styles.aircraftHours}>510 hrs</Text>
              <Text style={styles.aircraftFlights}>87 flights</Text>
            </View>
          </View>
        </Animated.View>

        {/* Performance Ratings Section */}
        <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.performanceSection}>
          <Text style={styles.performanceTitle}>Performance Ratings (2024)</Text>
          <View style={styles.ratingsList}>
            <View style={styles.ratingItem}>
              <View style={styles.ratingHeader}>
                <Text style={styles.ratingLabel}>Flight Safety</Text>
                <Text style={styles.ratingValue}>9.2/10</Text>
              </View>
              <View style={styles.ratingBar}>
                <View style={[styles.ratingFill, { width: '92%' }]} />
              </View>
            </View>
            <View style={styles.ratingItem}>
              <View style={styles.ratingHeader}>
                <Text style={styles.ratingLabel}>Technical Skills</Text>
                <Text style={styles.ratingValue}>8.8/10</Text>
              </View>
              <View style={styles.ratingBar}>
                <View style={[styles.ratingFill, { width: '88%' }]} />
              </View>
            </View>
            <View style={styles.ratingItem}>
              <View style={styles.ratingHeader}>
                <Text style={styles.ratingLabel}>Leadership</Text>
                <Text style={styles.ratingValue}>8.5/10</Text>
              </View>
              <View style={styles.ratingBar}>
                <View style={[styles.ratingFill, { width: '85%' }]} />
              </View>
            </View>
            <View style={styles.ratingItem}>
              <View style={styles.ratingHeader}>
                <Text style={styles.ratingLabel}>Radio Communication</Text>
                <Text style={styles.ratingValue}>9.0/10</Text>
              </View>
              <View style={styles.ratingBar}>
                <View style={[styles.ratingFill, { width: '90%' }]} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Fitness & Medical Status */}
        <Animated.View entering={FadeInDown.delay(900).duration(600)} style={styles.medicalSection}>
          <Text style={styles.medicalTitle}>Fitness & Medical Status</Text>
          <View style={styles.medicalContent}>
            <View style={styles.medicalItem}>
              <MaterialCommunityIcons name="check-circle" size={28} color="#00D084" />
              <View style={styles.medicalInfo}>
                <Text style={styles.medicalLabel}>Medical Clearance</Text>
                <Text style={styles.medicalStatus}>Approved - Valid till April 2027</Text>
              </View>
            </View>
            <View style={styles.medicalItem}>
              <MaterialCommunityIcons name="check-circle" size={28} color="#00D084" />
              <View style={styles.medicalInfo}>
                <Text style={styles.medicalLabel}>Fitness Rating</Text>
                <Text style={styles.medicalStatus}>Excellent - Last checked 15 Mar 2025</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {}} 
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Image
                source={{ uri: 'https://i.ibb.co/r25fHMWK/roundiaflogo.png' }}
                style={styles.modalLogo}
                resizeMode="contain"
              />
              <Text style={styles.modalTitle}>Enter Air Force ID No.</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter Air ID"
              value={airId}
              onChangeText={setAirId}
              keyboardType="numeric"
              maxLength={8}
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Authenticate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Image Popup Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={profileImageVisible}
        onRequestClose={() => setProfileImageVisible(false)}
      >
        <TouchableOpacity 
          style={styles.imageModalOverlay} 
          activeOpacity={1} 
          onPress={() => setProfileImageVisible(false)}
        >
          <Image
            source={{ uri: 'https://i.ibb.co/4ZmttBFL/IMG-0135.jpg' }}
            style={styles.expandedImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>

      {showProfile && (
        <>
          {/* Common Header */}
          <View style={[styles.header, { marginTop: 0, marginHorizontal: 0, borderRadius: 0, paddingTop: 5 }]}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://i.ibb.co/gM3vnqG7/mainlogo.png' }}
                style={styles.mainLogo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>INDIAN AIR FORCE</Text>
              <Text style={styles.headerSubtitle}>भारतीय वायु सेना</Text>
            </View>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://i.ibb.co/r25fHMWK/roundiaflogo.png' }}
                style={styles.roundLogo}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.contentContainer}>
            {renderContent()}
          </View>

          {/* Bottom Tab Bar */}
          <View style={styles.tabBar}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'home' && styles.activeTab]}
              onPress={() => setActiveTab('home')}
            >
              <MaterialCommunityIcons 
                name="home" 
                size={24} 
              color={activeTab === 'home' ? '#38BDF8' : '#94A3B8'} 
              />
              <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tab, activeTab === 'missions' && styles.activeTab]}
              onPress={() => setActiveTab('missions')}
            >
              <MaterialCommunityIcons 
                name="rocket-launch" 
                size={24} 
              color={activeTab === 'missions' ? '#38BDF8' : '#94A3B8'} 
              />
              <Text style={[styles.tabLabel, activeTab === 'missions' && styles.activeTabLabel]}>Missions</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tab, activeTab === 'leaves' && styles.activeTab]}
              onPress={() => setActiveTab('leaves')}
            >
              <MaterialCommunityIcons 
                name="calendar-check" 
                size={24} 
              color={activeTab === 'leaves' ? '#38BDF8' : '#94A3B8'} 
              />
              <Text style={[styles.tabLabel, activeTab === 'leaves' && styles.activeTabLabel]}>Leaves</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tab, activeTab === 'payrolls' && styles.activeTab]}
              onPress={() => setActiveTab('payrolls')}
            >
              <MaterialCommunityIcons 
                name="credit-card" 
                size={24} 
              color={activeTab === 'payrolls' ? '#38BDF8' : '#94A3B8'} 
              />
              <Text style={[styles.tabLabel, activeTab === 'payrolls' && styles.activeTabLabel]}>Payrolls</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tab, activeTab === 'communication' && styles.activeTab]}
              onPress={() => setActiveTab('communication')}
            >
              <MaterialCommunityIcons 
                name="message-text" 
                size={24} 
              color={activeTab === 'communication' ? '#38BDF8' : '#94A3B8'} 
              />
              <Text style={[styles.tabLabel, activeTab === 'communication' && styles.activeTabLabel]}>Communication</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Deep Slate Navy
  },
  contentContainer: {
    flex: 1,
  },
  mainScroll: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  mainLogo: {
    width: 70,
    height: 70,
    opacity: 0.9,
  },
  roundLogo: {
    width: 50,
    height: 50,
    opacity: 0.9,
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38BDF8',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 25,
    marginHorizontal: 10,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  nameSection: {
    flex: 1,
  },
  rank: {
    fontSize: 14,
    color: '#38BDF8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F1F5F9',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pilotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  pilotBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F59E0B',
    letterSpacing: 1,
  },
  airId: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#F1F5F9',
    fontWeight: 'bold',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  detailSubValue: {
    fontSize: 12,
    color: '#94A3B8',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statisticsSection: {
    marginTop: 40,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  statisticsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 4,
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 18,
    color: '#F1F5F9',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  mentorsSection: {
    marginTop: 40,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  mentorsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  mentorsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 20,
  },
  mentorCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mentorImage: {
    width: 100,
    height: 120,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  mentorInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mentorRank: {
    fontSize: 14,
    color: '#F59E0B', // Gold for rank
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 5,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mentorAwards: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 25,
    padding: 30,
    width: '85%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38BDF8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 25,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  modalLogo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    opacity: 0.9,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F1F5F9',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    marginBottom: 25,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#0F172A',
    color: '#F1F5F9',
    fontWeight: '600',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#7DD3FC',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Awards & Decorations Styles
  awardSection: {
    marginTop: 40,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  awardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  awardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 15,
  },
  awardItem: {
    width: '45%',
    backgroundColor: '#1E293B',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  awardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginTop: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  awardDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Certifications Styles
  certSection: {
    marginTop: 40,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  certTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  certList: {
    gap: 15,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  certContent: {
    marginLeft: 15,
    flex: 1,
  },
  certName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  certDate: {
    fontSize: 12,
    color: '#94A3B8',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Missions Styles
  missionsSection: {
    marginTop: 40,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  missionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  missionsList: {
    gap: 15,
  },
  missionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  missionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  missionType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F1F5F9',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  missionDate: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  missionLocation: {
    fontSize: 13,
    color: '#38BDF8',
    marginLeft: 40,
    marginBottom: 10,
    fontWeight: '600',
  },
  missionBadge: {
    backgroundColor: 'rgba(0, 208, 132, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#00D084',
  },
  missionStatus: {
    fontSize: 12,
    color: '#00D084',
    fontWeight: '600',
  },

  // Aircraft Experience Styles
  aircraftSection: {
    marginTop: 40,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  aircraftTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  aircraftGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 15,
  },
  aircraftCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  aircraftName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginTop: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  aircraftHours: {
    fontSize: 13,
    color: '#38BDF8',
    fontWeight: '600',
    marginTop: 5,
  },
  aircraftFlights: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },

  // Performance Ratings Styles
  performanceSection: {
    marginTop: 40,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  performanceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  ratingsList: {
    gap: 15,
  },
  ratingItem: {
    backgroundColor: '#1E293B',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F1F5F9',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#38BDF8',
  },
  ratingBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },

  // Medical & Fitness Styles
  medicalSection: {
    marginTop: 40,
    marginHorizontal: 10,
    marginBottom: 30,
  },
  medicalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  medicalContent: {
    gap: 12,
  },
  medicalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  medicalInfo: {
    marginLeft: 15,
    flex: 1,
  },
  medicalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F1F5F9',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  medicalStatus: {
    fontSize: 12,
    color: '#94A3B8',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  // Bottom Tab Bar Styles
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingBottom: 10,
    paddingTop: 8,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 3,
  },
  activeTab: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  tabLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  activeTabLabel: {
    color: '#38BDF8',
    fontWeight: 'bold',
  },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 25,
  },
  chartItem: {
    alignItems: 'center',
  },
  chartCircleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  chartPercentageContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartLabelText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedImage: {
    width: 300,
    height: 300,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
});
