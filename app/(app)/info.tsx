import { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, TOUCH_TARGET } from '../../src/constants/theme';

type Item = { icon: string; text: string };

// Wat de assistent nu al kan.
const NOW_ITEMS: Item[] = [
  { icon: '🕒', text: 'De tijd, de dag en de datum vertellen.' },
  { icon: '⛅', text: 'Het weer tonen (voorlopig met voorbeeldgegevens).' },
  { icon: '🎙️', text: 'Luisteren naar je stem, bijvoorbeeld "hoe laat is het?" (in Chrome).' },
  { icon: '🎨', text: 'De kleur van zijn ogen aanpassen aan jouw smaak.' },
  { icon: '😠', text: 'Reageren als je op zijn ogen tikt. Probeer het maar eens!' },
];

// Wat er nog gepland staat.
const FUTURE_ITEMS: Item[] = [
  { icon: '🌍', text: 'Het echte weer van waar jij bent.' },
  { icon: '😊', text: 'Meer emoties en reacties, zodat hij nog levendiger wordt.' },
  { icon: '🗣️', text: 'Antwoorden hardop uitspreken en meer vragen begrijpen.' },
  { icon: '💾', text: 'Jouw gekozen oogkleur onthouden.' },
  { icon: '⏰', text: 'Handige extra\'s zoals een timer of een herinnering.' },
];

export default function InfoScreen() {
  const router = useRouter();

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

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🤖</Text>
          <Text style={styles.title} accessibilityRole="header">
            Over deze app
          </Text>
        </View>

        <Section title="Waar is dit voor?">
          <Text style={styles.body}>
            Dit is een vriendelijke, interactieve assistent met een gezicht. Je hoeft
            niet door menu's te zoeken: je vraagt gewoon iets, en hij antwoordt je op
            het scherm, met een knipoog in zijn ogen. Zie hem als een gezellige
            gesprekspartner voor kleine vragen tussendoor.
          </Text>
        </Section>

        <Section title="Dit kan hij nu al">
          <ItemList items={NOW_ITEMS} />
        </Section>

        <Section title="Dit komt er nog bij">
          <ItemList items={FUTURE_ITEMS} />
        </Section>

      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

function ItemList({ items }: { items: Item[] }) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item.text} style={styles.row}>
          <Text style={styles.rowIcon}>{item.icon}</Text>
          <Text style={styles.rowText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 48,
    paddingHorizontal: spacing.lg,
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
  content: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerEmoji: {
    fontSize: 48,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  list: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  rowIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  rowText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
});