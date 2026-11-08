import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable } from 'react-native';
import { EyeMood, Eyes } from './Eyes';

const NATIVE = Platform.OS !== 'web';

// Welke reacties er om beurten komen. Later gewoon uitbreiden, bv. ['angry', 'happy'].
const REACTIONS: EyeMood[] = ['angry'];
const REACTION_DURATION = 1800; // hoe lang de reactie blijft staan (ms)

type Props = {
  size?: number;
};

export function ReactiveEyes({ size }: Props) {
  const [mood, setMood] = useState<EyeMood>('idle');
  const shake = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const next = useRef(0);
  const reduceMotion = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      reduceMotion.current = v;
    });
    return () => {
      if (timer.current) clearTimeout(timer.current);
      shake.stopAnimation();
    };
  }, [shake]);

  const trembleStep = (to: number) =>
    Animated.timing(shake, {
      toValue: to,
      duration: 45,
      easing: Easing.linear,
      useNativeDriver: NATIVE,
    });

  const playShake = () => {
    shake.stopAnimation();
    shake.setValue(0);
    Animated.sequence([
      Animated.delay(180), // eerst de ogen laten fronsen, dan pas trillen
      trembleStep(5),
      trembleStep(-5),
      trembleStep(4),
      trembleStep(-4),
      trembleStep(2),
      trembleStep(0),
    ]).start();
  };

  const onPress = () => {
    if (timer.current) clearTimeout(timer.current); // klik tijdens een reactie: timer herstarten

    const reaction = REACTIONS[next.current % REACTIONS.length];
    next.current += 1;

    setMood(reaction);
    if (reaction === 'angry' && !reduceMotion.current) playShake();

    timer.current = setTimeout(() => setMood('idle'), REACTION_DURATION);
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="De ogen van de assistent, tik om een reactie te zien"
    >
      <Animated.View style={{ transform: [{ translateX: shake }] }}>
        <Eyes mood={mood} size={size} />
      </Animated.View>
    </Pressable>
  );
}