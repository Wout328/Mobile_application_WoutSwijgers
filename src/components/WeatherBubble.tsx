import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';
import { WeatherInfo } from '../services/weatherService';

type Props = {
  weather: WeatherInfo;
  /** Afstand van de linkerrand van de ballon tot het staartje. */
  tailLeft: number;
};

export function WeatherBubble({ weather, tailLeft }: Props) {
  return (
    <View>
      {/* Staartje dat naar de ogen wijst */}
      <View style={[styles.tail, { left: tailLeft }]} />

      <View style={styles.card} accessibilityLiveRegion="polite">
        <Text style={styles.city}>{weather.city}</Text>

        <View style={styles.mainRow}>
          <Text style={styles.icon}>{weather.icon}</Text>
          <Text style={styles.temperature}>{weather.temperature}°</Text>
          <View style={styles.mainText}>
            <Text style={styles.condition}>{weather.condition}</Text>
            <Text style={styles.muted}>Voelt aan als {weather.feelsLike}°</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <Stat label="Wind" value={`${weather.windKmh} km/u`} />
          <Stat label="Vocht" value={`${weather.humidity}%`} />
          <Stat label="Regen" value={`${weather.rainChance}%`} />
        </View>

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          {weather.forecast.map((item) => (
            <View key={item.label} style={styles.forecastItem}>
              <Text style={styles.muted}>{item.label}</Text>
              <Text style={styles.forecastIcon}>{item.icon}</Text>
              <Text style={styles.statValue}>{item.temperature}°</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.muted}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
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
    gap: 14,
  },
  city: {
    color: colors.textMuted,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 40,
  },
  temperature: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '700',
  },
  mainText: {
    flex: 1,
  },
  condition: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  muted: {
    color: colors.textMuted,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  statValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  forecastItem: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  forecastIcon: {
    fontSize: 24,
  },
});