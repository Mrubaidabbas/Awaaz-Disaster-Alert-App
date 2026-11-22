import React, { useMemo, useState } from 'react';
import {
  Alert, Modal, Pressable, SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, View,
} from 'react-native';

const hazards = [
  { name: 'Flood', icon: '🌊', color: '#1677d2' },
  { name: 'Cloudburst', icon: '⛈️', color: '#7357c8' },
  { name: 'Earthquake', icon: '〰️', color: '#c27818' },
  { name: 'Wildfire', icon: '🔥', color: '#d94b31' },
  { name: 'House fire', icon: '🏠', color: '#d94b31' },
];
const areas = ['North Sector', 'River Side', 'Central Town', 'Hill View'];
const stationByArea = {
  'North Sector': 'North Response Station',
  'River Side': 'Riverside Rescue Station',
  'Central Town': 'Central Emergency Station',
  'Hill View': 'Hill District Station',
};
const initialIncidents = [
  { id: 'A-104', hazard: 'Flood', area: 'River Side', station: stationByArea['River Side'], time: '10:42 AM', status: 'Sent' },
  { id: 'A-103', hazard: 'Wildfire', area: 'Hill View', station: stationByArea['Hill View'], time: '09:18 AM', status: 'Received' },
];

export default function App() {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [showNew, setShowNew] = useState(false);
  const [hazard, setHazard] = useState('Flood');
  const [area, setArea] = useState('North Sector');
  const active = useMemo(() => incidents.filter((item) => item.status === 'Sent').length, [incidents]);

  function createAlert() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIncidents((list) => [{
      id: `A-${Math.floor(100 + Math.random() * 900)}`,
      hazard, area, station: stationByArea[area], time, status: 'Sent',
    }, ...list]);
    setShowNew(false);
  }

  function acknowledge(id) {
    setIncidents((list) => list.map((item) => item.id === id ? { ...item, status: 'Received' } : item));
  }

  function resetDemo() {
    Alert.alert('Reset demo?', 'This restores the two sample alerts.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => setIncidents(initialIncidents) },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f7fb" />
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.topline}>
          <View style={styles.brandIcon}><Text style={styles.brandIconText}>A</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.brand}>Awaaz</Text>
            <Text style={styles.subtitle}>Disaster Early Warning</Text>
          </View>
          <View style={styles.demoPill}><View style={styles.dot} /><Text style={styles.demoText}>DEMO</Text></View>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>ⓘ</Text>
          <Text style={styles.bannerCopy}>Simulation only · No real alerts or alarms are sent</Text>
        </View>

        <View style={styles.greetingRow}>
          <View><Text style={styles.eyebrow}>RESPONSE OVERVIEW</Text><Text style={styles.heading}>Good morning</Text></View>
          <View style={styles.online}><View style={styles.onlineDot} /><Text style={styles.onlineText}>System online</Text></View>
        </View>

        <View style={styles.metrics}>
          <View style={styles.metric}><Text style={styles.metricValue}>{incidents.length}</Text><Text style={styles.metricLabel}>DEMO ALERTS</Text></View>
          <View style={[styles.metric, styles.metricMiddle]}><Text style={styles.metricValue}>{active}</Text><Text style={styles.metricLabel}>AWAITING RECEIPT</Text></View>
          <View style={styles.metric}><Text style={styles.metricValue}>4</Text><Text style={styles.metricLabel}>SAMPLE STATIONS</Text></View>
        </View>

        <View style={styles.sectionRow}>
          <View><Text style={styles.sectionTitle}>Recent alerts</Text><Text style={styles.sectionHint}>Simulated events and station status</Text></View>
          <Pressable onPress={resetDemo} hitSlop={8}><Text style={styles.reset}>Reset</Text></Pressable>
        </View>

        {incidents.map((item) => {
          const meta = hazards.find((entry) => entry.name === item.hazard) || hazards[0];
          return <View style={styles.alertCard} key={item.id}>
            <View style={[styles.hazardIcon, { backgroundColor: `${meta.color}16` }]}><Text style={styles.hazardEmoji}>{meta.icon}</Text></View>
            <View style={styles.alertMain}>
              <View style={styles.alertTitleRow}><Text style={styles.alertTitle}>{item.hazard}</Text><Text style={[styles.status, item.status === 'Received' ? styles.received : styles.sent]}>{item.status === 'Received' ? 'RECEIVED' : 'SENT'}</Text></View>
              <Text style={styles.alertPlace}>{item.area} · {item.time}</Text>
              <Text style={styles.station}>↗ {item.station}</Text>
              {item.status === 'Sent' && <Pressable style={styles.ackButton} onPress={() => acknowledge(item.id)}><Text style={styles.ackText}>Mark received</Text></Pressable>}
            </View>
          </View>;
        })}

        <View style={styles.stationSection}>
          <Text style={styles.sectionTitle}>Nearby response stations</Text>
          {Object.entries(stationByArea).map(([place, name]) => <View style={styles.stationRow} key={place}>
            <View style={styles.stationPin}><Text>⌖</Text></View><View style={{ flex: 1 }}><Text style={styles.stationName}>{name}</Text><Text style={styles.stationArea}>{place}</Text></View><View style={styles.available}><View style={styles.onlineDot} /><Text style={styles.availableText}>Ready</Text></View>
          </View>)}
        </View>

        <Text style={styles.footer}>Awaaz prototype · Sample data only</Text>
      </ScrollView>
      <Pressable style={styles.fab} onPress={() => setShowNew(true)}><Text style={styles.fabPlus}>＋</Text><Text style={styles.fabText}>Create test alert</Text></Pressable>

      <Modal visible={showNew} transparent animationType="slide" onRequestClose={() => setShowNew(false)}>
        <View style={styles.modalShade}><View style={styles.modalCard}>
          <View style={styles.modalHandle} /><View style={styles.modalHeadingRow}><View><Text style={styles.modalTitle}>Create test alert</Text><Text style={styles.modalSubtitle}>This only changes the demo on this phone.</Text></View><Pressable onPress={() => setShowNew(false)}><Text style={styles.close}>✕</Text></Pressable></View>
          <Text style={styles.fieldTitle}>HAZARD TYPE</Text>
          <View style={styles.choiceWrap}>{hazards.map((item) => <Pressable key={item.name} onPress={() => setHazard(item.name)} style={[styles.choice, hazard === item.name && styles.choiceSelected]}><Text>{item.icon} </Text><Text style={[styles.choiceText, hazard === item.name && styles.choiceTextSelected]}>{item.name}</Text></Pressable>)}</View>
          <Text style={styles.fieldTitle}>AFFECTED AREA</Text>
          <View style={styles.choiceWrap}>{areas.map((item) => <Pressable key={item} onPress={() => setArea(item)} style={[styles.choice, area === item && styles.choiceSelected]}><Text style={[styles.choiceText, area === item && styles.choiceTextSelected]}>{item}</Text></Pressable>)}</View>
          <View style={styles.routeBox}><Text style={styles.routeLabel}>ROUTED TO SAMPLE STATION</Text><Text style={styles.routeName}>{stationByArea[area]}</Text></View>
          <Pressable style={styles.createButton} onPress={createAlert}><Text style={styles.createText}>Create simulated alert</Text></Pressable>
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f7fb' }, page: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 118 },
  topline: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 }, brandIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: '#116c67', alignItems: 'center', justifyContent: 'center', marginRight: 11 }, brandIconText: { color: '#fff', fontWeight: '900', fontSize: 24 }, brand: { fontSize: 20, fontWeight: '800', color: '#142d3b', letterSpacing: -0.4 }, subtitle: { color: '#71808a', fontSize: 12, marginTop: 1 }, demoPill: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: '#e5f3ef' }, dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#198b67', marginRight: 6 }, demoText: { color: '#18715c', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  banner: { borderRadius: 10, padding: 11, backgroundColor: '#fff4df', flexDirection: 'row', alignItems: 'center', marginBottom: 24 }, bannerIcon: { fontSize: 17, color: '#a96308', marginRight: 8, fontWeight: '700' }, bannerCopy: { fontSize: 11, color: '#815519', flexShrink: 1, fontWeight: '600' },
  greetingRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }, eyebrow: { color: '#82909a', fontSize: 9, fontWeight: '800', letterSpacing: 1.3, marginBottom: 5 }, heading: { fontWeight: '800', fontSize: 22, color: '#172f3d', letterSpacing: -0.6 }, online: { flexDirection: 'row', alignItems: 'center', paddingBottom: 4 }, onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#36a87d', marginRight: 6 }, onlineText: { color: '#52806f', fontSize: 10, fontWeight: '600' },
  metrics: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, borderWidth: 1, borderColor: '#e9eef2', paddingVertical: 16, marginBottom: 26 }, metric: { flex: 1, alignItems: 'center' }, metricMiddle: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#edf0f3' }, metricValue: { color: '#17394a', fontSize: 23, fontWeight: '800' }, metricLabel: { marginTop: 4, color: '#8a969e', fontWeight: '700', fontSize: 8, letterSpacing: 0.35, textAlign: 'center' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, sectionTitle: { color: '#1b3441', fontWeight: '800', fontSize: 17, letterSpacing: -0.3 }, sectionHint: { marginTop: 4, color: '#83909a', fontSize: 11 }, reset: { color: '#60747f', fontSize: 12, fontWeight: '700', padding: 6 },
  alertCard: { borderRadius: 14, borderWidth: 1, borderColor: '#e8edf0', backgroundColor: '#fff', padding: 13, flexDirection: 'row', marginBottom: 10 }, hazardIcon: { width: 39, height: 39, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 11 }, hazardEmoji: { fontSize: 19 }, alertMain: { flex: 1 }, alertTitleRow: { flexDirection: 'row', alignItems: 'center' }, alertTitle: { fontSize: 14, fontWeight: '800', color: '#1c3441', flex: 1 }, status: { fontSize: 8, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20, overflow: 'hidden', letterSpacing: 0.4 }, sent: { color: '#a35b08', backgroundColor: '#fff2dc' }, received: { color: '#18785f', backgroundColor: '#e3f4ed' }, alertPlace: { marginTop: 5, color: '#73818b', fontSize: 11 }, station: { marginTop: 7, color: '#55727e', fontSize: 10 }, ackButton: { alignSelf: 'flex-start', marginTop: 10, backgroundColor: '#e9f4f2', paddingHorizontal: 11, paddingVertical: 7, borderRadius: 8 }, ackText: { fontSize: 10, fontWeight: '800', color: '#176e68' },
  stationSection: { marginTop: 17 }, stationRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 11, marginTop: 8, borderWidth: 1, borderColor: '#e9eef2' }, stationPin: { width: 33, height: 33, borderRadius: 11, backgroundColor: '#eef5f5', alignItems: 'center', justifyContent: 'center', marginRight: 10 }, stationName: { fontWeight: '700', color: '#29414c', fontSize: 11 }, stationArea: { color: '#8a969e', fontSize: 10, marginTop: 3 }, available: { flexDirection: 'row', alignItems: 'center' }, availableText: { color: '#54816e', fontSize: 9, fontWeight: '700' }, footer: { textAlign: 'center', color: '#a1abb0', fontSize: 9, marginTop: 22 },
  fab: { position: 'absolute', bottom: 18, left: 20, right: 20, height: 52, borderRadius: 14, backgroundColor: '#126d68', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#0e504c', shadowOpacity: 0.22, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }, fabPlus: { color: '#fff', fontSize: 21, marginRight: 8, lineHeight: 24 }, fabText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  modalShade: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(16,35,46,0.42)' }, modalCard: { backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 28, paddingTop: 10, borderTopLeftRadius: 23, borderTopRightRadius: 23 }, modalHandle: { alignSelf: 'center', width: 39, height: 4, borderRadius: 2, backgroundColor: '#d8e0e4', marginBottom: 17 }, modalHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }, modalTitle: { color: '#17313e', fontWeight: '800', fontSize: 20 }, modalSubtitle: { color: '#7e8c95', fontSize: 11, marginTop: 5 }, close: { color: '#798992', fontSize: 17, padding: 4 }, fieldTitle: { color: '#84929a', fontSize: 9, fontWeight: '800', letterSpacing: 1, marginBottom: 9, marginTop: 3 }, choiceWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 17, gap: 7 }, choice: { borderWidth: 1, borderColor: '#e2e9ec', borderRadius: 9, paddingHorizontal: 10, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' }, choiceSelected: { borderColor: '#168079', backgroundColor: '#eef8f6' }, choiceText: { color: '#596b74', fontSize: 10, fontWeight: '600' }, choiceTextSelected: { color: '#126d68', fontWeight: '800' }, routeBox: { backgroundColor: '#f2f7f7', borderRadius: 10, padding: 12, marginBottom: 15 }, routeLabel: { color: '#82918f', fontSize: 8, fontWeight: '800', letterSpacing: 0.8 }, routeName: { color: '#315b59', fontWeight: '700', fontSize: 12, marginTop: 5 }, createButton: { height: 49, borderRadius: 12, backgroundColor: '#126d68', alignItems: 'center', justifyContent: 'center' }, createText: { color: '#fff', fontWeight: '800', fontSize: 13 },
});
