// Donker thema met blauwe tinten en lichtblauwe ogen.
export const colors = {
  background: '#0A0F1F',
  surface: '#131B33',
  surfaceBorder: '#22305A',
  eye: '#7FE3FF',
  eyeGlow: '#3BB8F0',
  primary: '#2F6BFF',
  primaryPressed: '#1F4FCC',
  text: '#E8F1FF',
  textMuted: '#8FA3C7',
  danger: '#FF8A8A',
} as const;

export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  card: 20,
  button: 16,
} as const;

// Minimale grootte van een aanraakbaar element (touch target).
export const TOUCH_TARGET = 48;