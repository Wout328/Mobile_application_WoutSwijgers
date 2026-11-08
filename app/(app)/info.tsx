import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, TOUCH_TARGET } from '../../src/constants/theme';
import { getDateText, getTimeText } from '../../src/services/timeService';

const CLOCK_REFRESH_MS = 30000;

export default function InfoScreen() {
  const router = useRouter();
  const [now, setNow] = useState<Date>(new Date());

  // De klok ververst zichzelf.
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), CLOCK_REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.screen}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Terug naar de assistent"
        style={({ pressed }) => [styles.backButton, pressed && styles.backPressed]}
      >
        <Text style={styles.backText}>Terug</Text>
      </Pressable>

      <View style={styles.timeBlock}>
        <Text style={styles.time}>{getTimeText(now)}</Text>
        <Text style={styles.date}>{getDateText(now)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.about}>
          Deze assistent vertelt je de tijd. Binnenkort kan je hem ook het weer
          vragen en er tegen praten.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 48,
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  backButton: {
    minHeight: TOUCH_TARGET,
    minWidth: TOUCH_TARGET,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: radius.button,
  },
  backPressed: {
    backgroundColor: colors.surface,
  },
  backText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  timeBlock: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  time: {
    color: colors.text,
    fontSize: 64,
    fontWeight: '300',
  },
  date: {
    color: colors.textMuted,
    fontSize: 18,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  about: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});