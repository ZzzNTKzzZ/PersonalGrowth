import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const theme = Colors.light;

export default function HabitsScreen() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Habit Tracker</Text>
        
        {/* Overall Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Overall Score</Text>
          <View style={styles.gaugeOuter}>
            <View style={styles.gaugeInner}>
              <Text style={styles.scoreNumber}>85</Text>
              <Text style={styles.scoreUnit}>%</Text>
            </View>
          </View>
          <Text style={styles.scoreSubtext}>Great job! You're highly consistent this week.</Text>
        </View>

        {/* Habit List */}
        <Text style={styles.sectionTitle}>Your Habits</Text>
        
        {/* Habit 1 */}
        <View style={styles.habitCard}>
          <View style={styles.habitHeader}>
            <Text style={styles.habitTitle}>Read a book</Text>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={14} color="#ff9800" />
              <Text style={styles.streakText}>12 day streak</Text>
            </View>
          </View>
          
          <View style={styles.gridRow}>
            {days.map((day, i) => (
              <View key={i} style={styles.dayCol}>
                <Text style={styles.dayText}>{day}</Text>
                <View style={[styles.dayCircle, i < 5 ? styles.dayCircleDone : styles.dayCircleMissed]} />
              </View>
            ))}
            <View style={styles.divider} />
            <TouchableOpacity style={styles.checkButton}>
              <Ionicons name="checkmark" size={20} color={theme.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Habit 2 */}
        <View style={styles.habitCard}>
          <View style={styles.habitHeader}>
            <Text style={styles.habitTitle}>Meditate</Text>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={14} color="#ff9800" />
              <Text style={styles.streakText}>3 day streak</Text>
            </View>
          </View>
          
          <View style={styles.gridRow}>
            {days.map((day, i) => (
              <View key={i} style={styles.dayCol}>
                <Text style={styles.dayText}>{day}</Text>
                <View style={[styles.dayCircle, (i === 1 || i === 2 || i === 4) ? styles.dayCircleDone : styles.dayCircleMissed]} />
              </View>
            ))}
            <View style={styles.divider} />
            <TouchableOpacity style={[styles.checkButton, { backgroundColor: theme.surfaceVariant }]}>
              <Ionicons name="play" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.background },
  container: { padding: 24, paddingBottom: 60 },
  headerTitle: { fontSize: 28, fontWeight: '600', color: theme.primary, marginBottom: 24, marginTop: 12 },
  
  scoreContainer: {
    backgroundColor: theme.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.surfaceVariant,
  },
  scoreLabel: { fontSize: 16, color: theme.textMuted, marginBottom: 20, fontWeight: '500' },
  gaugeOuter: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: theme.secondaryContainer,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 8, borderColor: theme.secondary,
  },
  gaugeInner: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: theme.surface,
    justifyContent: 'center', alignItems: 'center',
    flexDirection: 'row',
  },
  scoreNumber: { fontSize: 40, fontWeight: '700', color: theme.primary },
  scoreUnit: { fontSize: 18, color: theme.textMuted, marginTop: 12, marginLeft: 2 },
  scoreSubtext: { fontSize: 14, color: theme.text, marginTop: 24, textAlign: 'center', paddingHorizontal: 20, lineHeight: 22 },
  
  sectionTitle: { fontSize: 20, fontWeight: '600', color: theme.text, marginBottom: 16 },
  
  habitCard: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
    borderWidth: 1,
    borderColor: theme.surfaceVariant,
  },
  habitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  habitTitle: { fontSize: 18, fontWeight: '600', color: theme.primary },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff3e0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  streakText: { fontSize: 12, fontWeight: '600', color: '#ff9800', marginLeft: 4 },
  
  gridRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center' },
  dayText: { fontSize: 12, color: theme.textMuted, marginBottom: 6 },
  dayCircle: { width: 24, height: 24, borderRadius: 12 },
  dayCircleDone: { backgroundColor: theme.secondary },
  dayCircleMissed: { backgroundColor: theme.surfaceVariant },
  
  divider: { width: 1, height: 30, backgroundColor: theme.surfaceVariant, marginHorizontal: 4 },
  
  checkButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: theme.primary,
    justifyContent: 'center', alignItems: 'center',
  },
});
