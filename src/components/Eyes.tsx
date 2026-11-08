import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../constants/theme';

export type EyeMood = 'idle' | 'happy' | 'angry' | 'bored';

type EyesProps = {
  mood?: EyeMood;
  /** Breedte van één oog in pixels. */
  size?: number;
  /** Kleur van de ogen en hun gloed. */
  color?: string;
};

// Op web bestaat de native driver niet, dus daar zetten we hem uit.
const NATIVE = Platform.OS !== 'web';

// Emoties die de ogen in vaste volgorde uit zichzelf tonen terwijl ze 'idle' zijn.
// Tussen twee emoties door staan ze altijd even neutraal:
// idle -> happy -> idle -> bored -> idle -> happy -> ...
const AMBIENT_MOODS: EyeMood[] = ['happy', 'bored'];
const AMBIENT_MIN_WAIT = 4000; // minimale pauze tussen twee momentjes (ms)
const AMBIENT_EXTRA_WAIT = 3000; // + willekeurig tot dit erbij
const AMBIENT_MIN_HOLD = 2200; // hoe lang zo'n moment duurt (ms)
const AMBIENT_EXTRA_HOLD = 1000;

// Duur van de overgangen.
const HAPPY_IN_MS = 650;
const HAPPY_OUT_MS = 800;
const BORED_IN_MS = 750;
const BORED_OUT_MS = 900;

// Vaste hoek van de schuine ooglidjes. Boos: bovenste ooglid, blij: onderste ooglid.
const ANGRY_ANGLE = 22;
const HAPPY_ANGLE = 30;

type EyeProps = {
  width: number;
  height: number;
  /** 1 = linker oog, -1 = rechter oog (spiegelt de hoeken). */
  direction: 1 | -1;
  color: string;
  blink: Animated.Value;
  glow: Animated.AnimatedInterpolation<number>;
  lidShift: Animated.AnimatedInterpolation<number>;
  cheekShift: Animated.AnimatedInterpolation<number>;
  boredShift: Animated.AnimatedInterpolation<number>;
};

// Eén oog. De gloed zit op een eigen laag, het oog zelf is een afgeknipte vorm.
// De ooglidjes zijn heel grote rechthoeken die om het midden van hun snijlijn
// draaien, zodat de lijn altijd tot de rand van het oog doorloopt.
function Eye({
  width,
  height,
  direction,
  color,
  blink,
  glow,
  lidShift,
  cheekShift,
  boredShift,
}: EyeProps) {
  const cornerRadius = width * 0.45;
  const lidW = width * 3;
  const lidH = height * 1.5;

  return (
    <Animated.View style={{ width, height, transform: [{ scaleY: blink }] }}>
      {/* Gloed: vervaagt bij een emotie, zodat er geen omtrek zichtbaar blijft. */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          styles.eyeGlow,
          {
            borderRadius: cornerRadius,
            opacity: glow,
            backgroundColor: color,
            shadowColor: color,
          },
        ]}
      />

      {/* Het oog zelf, afgeknipt op de afgeronde vorm. */}
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.eyeBody,
          { borderRadius: cornerRadius, backgroundColor: color },
        ]}
      >
        {/* Bovenste ooglid (boos): schuin, plaat hangt omhoog. */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: width / 2,
            top: 0,
            width: 0,
            height: 0,
            transform: [
              { translateY: lidShift },
              { rotate: `${direction * ANGRY_ANGLE}deg` },
            ],
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: -lidW / 2,
              top: -lidH,
              width: lidW,
              height: lidH,
              backgroundColor: colors.background,
            }}
          />
        </Animated.View>

        {/* Onderste ooglid (blij): schuin, plaat hangt omlaag. */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: width / 2,
            top: height,
            width: 0,
            height: 0,
            transform: [
              { translateY: cheekShift },
              { rotate: `${direction * HAPPY_ANGLE}deg` },
            ],
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: -lidW / 2,
              top: 0,
              width: lidW,
              height: lidH,
              backgroundColor: colors.background,
            }}
          />
        </Animated.View>

        {/* Bovenste ooglid (verveeld): vlak, zonder hoek. */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: width / 2,
            top: 0,
            width: 0,
            height: 0,
            transform: [{ translateY: boredShift }],
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: -lidW / 2,
              top: -lidH,
              width: lidW,
              height: lidH,
              backgroundColor: colors.background,
            }}
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export function Eyes({ mood = 'idle', size = 96, color = colors.eye }: EyesProps) {
  const height = size * 1.25;

  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [ambient, setAmbient] = useState<EyeMood>('idle');
  const ambientIndex = useRef(0);

  const blink = useRef(new Animated.Value(1)).current;
  const lookX = useRef(new Animated.Value(0)).current;
  const lookY = useRef(new Animated.Value(0)).current;
  const angry = useRef(new Animated.Value(0)).current;
  const happy = useRef(new Animated.Value(0)).current;
  const bored = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  // De mood die de ogen echt tonen: een door het scherm opgelegde mood wint altijd,
  // anders mag de ambient-emotie zichtbaar zijn.
  const activeMood = mood === 'idle' ? ambient : mood;

  // Respecteer de systeeminstelling "beweging verminderen".
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  // Knipperen op willekeurige momenten.
  useEffect(() => {
    if (reduceMotion) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const scheduleBlink = () => {
      if (stopped) return;
      timer = setTimeout(() => {
        Animated.sequence([
          Animated.timing(blink, { toValue: 0.08, duration: 90, useNativeDriver: NATIVE }),
          Animated.timing(blink, { toValue: 1, duration: 120, useNativeDriver: NATIVE }),
        ]).start(scheduleBlink);
      }, 2000 + Math.random() * 3000);
    };

    scheduleBlink();
    return () => {
      stopped = true;
      if (timer !== undefined) clearTimeout(timer);
      blink.stopAnimation();
    };
  }, [blink, reduceMotion]);

  // Af en toe rondkijken.
  useEffect(() => {
    if (reduceMotion) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const rangeX = size * 0.25;
    const rangeY = size * 0.15;

    const scheduleLook = () => {
      if (stopped) return;
      timer = setTimeout(() => {
        const x = (Math.random() * 2 - 1) * rangeX;
        const y = (Math.random() * 2 - 1) * rangeY;
        Animated.parallel([
          Animated.timing(lookX, {
            toValue: x,
            duration: 350,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: NATIVE,
          }),
          Animated.timing(lookY, {
            toValue: y,
            duration: 350,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: NATIVE,
          }),
        ]).start(scheduleLook);
      }, 1500 + Math.random() * 2500);
    };

    scheduleLook();
    return () => {
      stopped = true;
      if (timer !== undefined) clearTimeout(timer);
      lookX.stopAnimation();
      lookY.stopAnimation();
    };
  }, [lookX, lookY, size, reduceMotion]);

  // Emoties in vaste volgorde tonen: idle -> happy -> idle -> bored -> idle -> ...
  useEffect(() => {
    if (reduceMotion || mood !== 'idle') {
      setAmbient('idle');
      return;
    }

    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const schedule = () => {
      timer = setTimeout(() => {
        if (stopped) return;
        const pick = AMBIENT_MOODS[ambientIndex.current % AMBIENT_MOODS.length];
        ambientIndex.current += 1;
        setAmbient(pick);

        timer = setTimeout(() => {
          if (stopped) return;
          setAmbient('idle');
          schedule();
        }, AMBIENT_MIN_HOLD + Math.random() * AMBIENT_EXTRA_HOLD);
      }, AMBIENT_MIN_WAIT + Math.random() * AMBIENT_EXTRA_WAIT);
    };

    schedule();
    return () => {
      stopped = true;
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [mood, reduceMotion]);

  // Overgang tussen moods: boos met een veer, blij en verveeld met een rustige timing.
  useEffect(() => {
    const happyOn = activeMood === 'happy';
    const boredOn = activeMood === 'bored';
    Animated.parallel([
      Animated.spring(angry, {
        toValue: activeMood === 'angry' ? 1 : 0,
        friction: 7,
        useNativeDriver: NATIVE,
      }),
      Animated.timing(happy, {
        toValue: happyOn ? 1 : 0,
        duration: happyOn ? HAPPY_IN_MS : HAPPY_OUT_MS,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: NATIVE,
      }),
      Animated.timing(bored, {
        toValue: boredOn ? 1 : 0,
        duration: boredOn ? BORED_IN_MS : BORED_OUT_MS,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: NATIVE,
      }),
    ]).start();
  }, [activeMood, angry, happy, bored]);

  // Trillen van woede zodra de mood 'angry' wordt (alleen bij een echte boze reactie).
  useEffect(() => {
    shake.stopAnimation();
    shake.setValue(0);
    if (mood !== 'angry' || reduceMotion) return;

    const step = (to: number) =>
      Animated.timing(shake, {
        toValue: to,
        duration: 45,
        easing: Easing.linear,
        useNativeDriver: NATIVE,
      });

    Animated.sequence([
      Animated.delay(180), // eerst laten fronsen, dan pas trillen
      step(5),
      step(-5),
      step(4),
      step(-4),
      step(2),
      step(0),
    ]).start();

    return () => shake.stopAnimation();
  }, [mood, reduceMotion, shake]);

  // Gloed vervaagt zodra boos, blij of verveeld actief wordt.
  const glow = Animated.add(Animated.add(angry, happy), bored).interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Hoeveel de snijlijn aan de rand omhoog/omlaag loopt door de hoek,
  // zodat de schuine ooglidjes in rust helemaal buiten het oog staan.
  const angryRise = (size / 2) * Math.tan((ANGRY_ANGLE * Math.PI) / 180);
  const happyRise = (size / 2) * Math.tan((HAPPY_ANGLE * Math.PI) / 180);

  // Bovenste ooglid (boos): van boven het oog naar de boze eindstand.
  const lidShift = angry.interpolate({
    inputRange: [0, 1],
    outputRange: [-(angryRise + 6), height * 0.32],
  });

  // Onderste ooglid (blij): van onder het oog naar de blije eindstand.
  const cheekShift = happy.interpolate({
    inputRange: [0, 1],
    outputRange: [happyRise + 6, -height * 0.25],
  });

  // Vlak ooglid (verveeld): zakt tot ongeveer het midden van het oog.
  const boredShift = bored.interpolate({
    inputRange: [0, 1],
    outputRange: [-2, height * 0.5],
  });

  // Bij verveeld zakken de ogen zelf een beetje mee omlaag.
  const boredDrop = bored.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size * 0.08],
  });

  return (
    <Animated.View
      accessible
      accessibilityRole="image"
      accessibilityLabel="De ogen van de assistent"
      style={[
        styles.row,
        {
          gap: size * 0.45,
          transform: [
            { translateX: shake },
            { translateX: lookX },
            { translateY: lookY },
            { translateY: boredDrop },
          ],
        },
      ]}
    >
      <Eye
        width={size}
        height={height}
        direction={1}
        color={color}
        blink={blink}
        glow={glow}
        lidShift={lidShift}
        cheekShift={cheekShift}
        boredShift={boredShift}
      />
      <Eye
        width={size}
        height={height}
        direction={-1}
        color={color}
        blink={blink}
        glow={glow}
        lidShift={lidShift}
        cheekShift={cheekShift}
        boredShift={boredShift}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeGlow: {
    shadowOpacity: 0.9,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
  },
  eyeBody: {
    overflow: 'hidden',
  },
});