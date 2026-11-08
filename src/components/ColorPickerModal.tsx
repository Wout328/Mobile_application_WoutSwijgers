import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

export const EYE_COLOR_OPTIONS = [
  { name: 'Standaard', value: colors.eye },
  { name: 'Groen', value: '#4ADE80' },
  { name: 'Paars', value: '#A78BFA' },
  { name: 'Roze', value: '#F472B6' },
  { name: 'Oranje', value: '#FB923C' },
  { name: 'Geel', value: '#FACC15' },
  { name: 'Rood', value: '#F87171' },
  { name: 'Wit', value: '#F1F5F9' },
];

type Props = {
  visible: boolean;
  selected: string;
  onSelect: (color: string) => void;
  onClose: () => void;
  /** Optioneel: toont een link naar de infopagina onderaan. */
  onOpenInfo?: () => void;
};

export function ColorPickerModal({ visible, selected, onSelect, onClose, onOpenInfo }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityLabel="Sluit de kleurkeuze"
      >
        {/* Lege onPress zodat een tik op het paneel zelf het paneel niet sluit. */}
        <Pressable style={styles.sheet} onPress={() => {}} accessibilityViewIsModal>
          <Text style={styles.title}>Kies de kleur van mijn ogen</Text>

          <View style={styles.grid}>
            {EYE_COLOR_OPTIONS.map((option) => {
              const isSelected = option.value === selected;
              return (
                <Pressable
                  key={option.name}
                  onPress={() => onSelect(option.value)}
                  accessibilityRole="button"
                  accessibilityLabel={option.name}
                  accessibilityState={{ selected: isSelected }}
                  style={styles.swatchItem}
                >
                  <View style={[styles.swatchRing, isSelected && styles.swatchRingSelected]}>
                    <View style={[styles.swatch, { backgroundColor: option.value }]} />
                  </View>
                  <Text style={[styles.swatchName, isSelected && styles.swatchNameSelected]}>
                    {option.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            style={({ pressed }) => [styles.doneButton, pressed && styles.donePressed]}
          >
            <Text style={styles.doneText}>Klaar</Text>
          </Pressable>

          {onOpenInfo !== undefined && (
            <Pressable onPress={onOpenInfo} accessibilityRole="link" style={styles.infoLink}>
              <Text style={styles.infoLinkText}>Over deze app</Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.lg,
  },
  swatchItem: {
    width: '25%',
    alignItems: 'center',
    gap: 6,
  },
  swatchRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchRingSelected: {
    borderColor: colors.text,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  swatchName: {
    color: colors.textMuted,
    fontSize: 12,
  },
  swatchNameSelected: {
    color: colors.text,
    fontWeight: '600',
  },
  doneButton: {
    minHeight: 52,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donePressed: {
    backgroundColor: colors.primaryPressed,
  },
  doneText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  infoLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  infoLinkText: {
    color: colors.textMuted,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});