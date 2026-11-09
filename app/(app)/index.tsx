import { useEffect, useRef, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ColorPickerModal } from '../../src/components/ColorPickerModal';
import { EyeMood, Eyes } from '../../src/components/Eyes';
import { MicButton } from '../../src/components/MicButton';
import { TimeBubble } from '../../src/components/TimeBubble';
import { WeatherBubble } from '../../src/components/WeatherBubble';
import { colors, radius, spacing, TOUCH_TARGET } from '../../src/constants/theme';
import { SpeechError, useSpeechCommand } from '../../src/hooks/useSpeechCommand';
import { detectIntent } from '../../src/services/intentService';
import { getWeather, WeatherInfo } from '../../src/services/weatherService';

// Op web bestaat de native driver niet, dus daar zetten we hem uit.
const NATIVE = Platform.OS !== 'web';

const GREETING = 'Hoi! Wat wil je weten?';
const MOOD_RESET_MS = 3000;
const ANGRY_MS = 1800;

const EYES_SCALE = 0.4; // hoe klein de ogen worden in de hoek
const SCREEN_PADDING_TOP = 48;
const TRAVEL_MS = 700; // duur van de verplaatsing

const SPEECH_ERRORS: Record<SpeechError, string> = {
  unsupported: 'Spraak werkt niet in deze browser. Probeer Chrome, of gebruik de knoppen.',
  'not-allowed': 'Ik mag je microfoon niet gebruiken. Geef toestemming in je browser.',
  'no-speech': 'Ik hoorde niets. Probeer het nog eens.',
  network: 'Spraakherkenning heeft internet nodig.',
  other: 'Er ging iets mis met de microfoon. Probeer het nog eens.',
};

type Panel = 'time' | 'weather';
type Box = { x: number; y: number; w: number; h: number };

export default function HomeScreen() {
  const router = useRouter();
  const [answer, setAnswer] = useState<string>(GREETING);
  const [mood, setMood] = useState<EyeMood>('idle');
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  // Kleur van de ogen en of de kleurkiezer open staat.
  const [eyeColor, setEyeColor] = useState<string>(colors.eye);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);

  // panel = wat nu open is (null = niets). shownPanel = welke inhoud de ballon toont;
  // die blijft staan tijdens het wegfaden, zodat de ballon niet ineens leeg wordt.
  const [panel, setPanel] = useState<Panel | null>(null);
  const [shownPanel, setShownPanel] = useState<Panel>('time');

  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const progress = useRef(new Animated.Value(0)).current; // 0 = midden, 1 = linksboven

  // Posities voor de verplaatsing van de ogen.
  const [centerPos, setCenterPos] = useState({ x: 0, y: 0 });
  const [eyesBox, setEyesBox] = useState<Box>({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    return () => {
      if (resetTimer.current !== undefined) clearTimeout(resetTimer.current);
    };
  }, []);

  const showMood = (nextMood: EyeMood, durationMs: number = MOOD_RESET_MS) => {
    setMood(nextMood);
    if (resetTimer.current !== undefined) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setMood('idle'), durationMs);
  };

  const travel = (to: 0 | 1) => {
    Animated.timing(progress, {
      toValue: to,
      duration: TRAVEL_MS,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: NATIVE,
    }).start();
  };

  const openPanel = (kind: Panel) => {
    if (kind === 'weather') {
      const info = getWeather();
      setWeather(info);
      showMood(info.mood);
    } else {
      showMood('happy');
    }
    setShownPanel(kind);
    setPanel(kind);
    travel(1);
  };

  const closePanel = () => {
    setPanel(null);
    setAnswer(GREETING);
    travel(0);
  };

  // Spraakbesturing: de microfoonknop luistert, en de herkende zin bepaalt wat er opent.
  const { status: micStatus, toggle: toggleMic } = useSpeechCommand({
    onStart: () => setAnswer('Ik luister…'),
    onResult: (transcript) => {
      const intent = detectIntent(transcript);
      if (intent === 'time') {
        openPanel('time');
      } else if (intent === 'weather') {
        openPanel('weather');
      } else if (intent === 'back') {
        closePanel();
      } else {
        if (panel !== null) closePanel();
        setAnswer(`Ik hoorde: “${transcript}”. Vraag me maar naar de tijd of het weer.`);
      }
    },
    onError: (error) => setAnswer(SPEECH_ERRORS[error]),
  });

  const pokeEyes = () => showMood('angry', ANGRY_MS);

  const onCenterLayout = (e: LayoutChangeEvent) => {
    const { x, y } = e.nativeEvent.layout;
    setCenterPos({ x, y });
  };

  const onEyesLayout = (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    setEyesBox({ x, y, w: width, h: height });
  };

  // Waar de ogen nu staan (midden van de ogen, in schermcoördinaten)
  // en waar ze naartoe moeten (linksboven, op de hoogte van de bovenbalk).
  const eyesCx = centerPos.x + eyesBox.x + eyesBox.w / 2;
  const eyesCy = centerPos.y + eyesBox.y + eyesBox.h / 2;
  const targetCx = spacing.lg + (eyesBox.w * EYES_SCALE) / 2;
  const targetCy = SCREEN_PADDING_TOP + TOUCH_TARGET / 2;

  const eyesTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, targetCx - eyesCx],
  });
  const eyesTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, targetCy - eyesCy],
  });
  const eyesScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, EYES_SCALE],
  });

  // De gewone tekst verdwijnt terwijl de ogen weggaan.
  const answerOpacity = progress.interpolate({
    inputRange: [0, 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // De ballon verschijnt pas als de ogen bijna op hun plek zijn.
  const bubbleOpacity = progress.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
  });
  const bubbleSlide = progress.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [-8, -8, 0],
  });
  const bubbleScale = progress.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [0.94, 0.94, 1],
  });

  const bubbleTop = targetCy + (eyesBox.h * EYES_SCALE) / 2 + spacing.md + 8;
  const tailLeft = (eyesBox.w * EYES_SCALE) / 2 - 11;

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Rechtsboven: Info en de kleurkiezer. */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.push('/info')}
          accessibilityRole="button"
          accessibilityLabel="Open de infopagina over de app"
          style={({ pressed }) => [styles.infoButton, pressed && styles.infoPressed]}
        >
          <Ionicons name="information-circle-outline" size={22} color={colors.text} />
          <Text style={styles.infoText}>Info</Text>
        </Pressable>

        <Pressable
          onPress={() => setPickerOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Kies de kleur van de ogen"
          style={({ pressed }) => [styles.colorButton, pressed && styles.colorPressed]}
        >
          <View style={[styles.colorDot, { backgroundColor: eyeColor }]} />
        </Pressable>
      </View>

      <View style={styles.center} onLayout={onCenterLayout}>
        <Animated.View
          onLayout={onEyesLayout}
          style={{
            transform: [
              { translateX: eyesTranslateX },
              { translateY: eyesTranslateY },
              { scale: eyesScale },
            ],
          }}
        >
          <Pressable
            onPress={pokeEyes}
            accessibilityRole="button"
            accessibilityLabel="De ogen van de assistent, tik om een reactie te zien"
          >
            <Eyes mood={mood} color={eyeColor} />
          </Pressable>
        </Animated.View>

        <Animated.Text
          style={[styles.answer, { opacity: answerOpacity }]}
          accessibilityLiveRegion="polite"
        >
          {answer}
        </Animated.Text>
      </View>

      {/* Tekstballon met de tijd of het weer, hangt onder de ogen in de hoek. */}
      <Animated.View
        pointerEvents={panel !== null ? 'auto' : 'none'}
        style={[
          styles.bubbleWrap,
          {
            top: bubbleTop,
            opacity: bubbleOpacity,
            transform: [{ translateY: bubbleSlide }, { scale: bubbleScale }],
          },
        ]}
      >
        {shownPanel === 'time' ? (
          <TimeBubble tailLeft={tailLeft} active={panel === 'time'} />
        ) : (
          weather !== null && <WeatherBubble weather={weather} tailLeft={tailLeft} />
        )}
      </Animated.View>

      {/* Knoppen onderaan: binnen bereik van de duim. */}
      <View style={styles.actions}>
        {panel !== null ? (
          <Pressable
            onPress={closePanel}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.button,
              styles.buttonSecondary,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Terug</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              onPress={() => openPanel('time')}
              accessibilityRole="button"
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              <Text style={styles.buttonText}>Hoe laat is het?</Text>
            </Pressable>
            <Pressable
              onPress={() => openPanel('weather')}
              accessibilityRole="button"
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              <Text style={styles.buttonText}>Wat is het weer?</Text>
            </Pressable>
          </>
        )}

        <View style={styles.micRow}>
          <MicButton listening={micStatus === 'listening'} onPress={toggleMic} />
        </View>
      </View>

      {/* Popup om de kleur van de ogen te kiezen. */}
      <ColorPickerModal
        visible={pickerOpen}
        selected={eyeColor}
        onSelect={setEyeColor}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: SCREEN_PADDING_TOP,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoButton: {
    minHeight: TOUCH_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.button,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  infoPressed: {
    opacity: 0.7,
  },
  infoText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  colorButton: {
    minHeight: TOUCH_TARGET,
    minWidth: TOUCH_TARGET,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.button,
  },
  colorPressed: {
    backgroundColor: colors.surface,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  answer: {
    color: colors.text,
    fontSize: 22,
    textAlign: 'center',
    minHeight: 60,
  },
  bubbleWrap: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
  },
  actions: {
    gap: spacing.md,
  },
  button: {
    minHeight: 56,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: colors.surface,
  },
  buttonPressed: {
    backgroundColor: colors.primaryPressed,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  micRow: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
});