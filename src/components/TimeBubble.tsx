import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

type Props = {
  /** Afstand van de linkerrand van de ballon tot het staartje. */
  tailLeft: number;
  /** Alleen als de ballon zichtbaar is loopt de klok mee. */
  active: boolean;
};

const DAYS = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
const MONTHS = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
];

const pad = (n: number) => String(n).padStart(2, '0');

export function TimeBubble({ tailLeft, active }: Props) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (!active) return;
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [active]);

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const day = DAYS[now.getDay()];
  const date = `${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <View>
      {/* Staartje dat naar de ogen wijst */}
      <View style={[styles.tail, { left: tailLeft }]} />

      <View
        style={styles.card}
        accessible
        accessibilityLabel={`${day} ${date}, ${hours}:${minutes}`}
      >
        <Text style={styles.label}>Het is nu</Text>

        <View style={styles.timeRow}>
          <Text style={styles.time}>
            {hours}:{minutes}
          </Text>
          <Text style={styles.seconds}>{seconds}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.day}>{day}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tail: {
    position: 'absolute',
    top: -11,
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.surface,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    gap: 10,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  time: {
    color: colors.text,
    fontSize: 64,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  seconds: {
    color: colors.textMuted,
    fontSize: 28,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: 1,
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  day: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '600',
  },
  date: {
    color: colors.textMuted,
    fontSize: 18,
  },
});