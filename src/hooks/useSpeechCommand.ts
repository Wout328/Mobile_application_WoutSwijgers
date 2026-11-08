import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export type SpeechStatus = 'idle' | 'listening';
export type SpeechError = 'unsupported' | 'not-allowed' | 'no-speech' | 'network' | 'other';

type Options = {
  lang?: string;
  onStart?: () => void;
  onResult: (transcript: string) => void;
  onError: (error: SpeechError) => void;
};

// De spraakherkenning bestaat alleen in browsers, en TypeScript kent haar niet.
function getRecognitionClass(): any {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function useSpeechCommand(options: Options) {
  const { lang = 'nl-BE' } = options;
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const recognition = useRef<any>(null);

  // Altijd de nieuwste callbacks gebruiken, zonder de herkenning opnieuw op te zetten.
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    return () => {
      recognition.current?.abort();
    };
  }, []);

  const toggle = useCallback(() => {
    // Tweede tik tijdens het luisteren = stoppen.
    if (recognition.current) {
      recognition.current.stop();
      return;
    }

    const Recognition = getRecognitionClass();
    if (!Recognition) {
      optionsRef.current.onError('unsupported');
      return;
    }

    const rec = new Recognition();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onstart = () => {
      setStatus('listening');
      optionsRef.current.onStart?.();
    };

    rec.onresult = (event: any) => {
      const transcript: string = event.results?.[0]?.[0]?.transcript ?? '';
      if (transcript.trim()) optionsRef.current.onResult(transcript.trim());
    };

    rec.onerror = (event: any) => {
      const code: string = event.error;
      if (code === 'aborted') return;
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        optionsRef.current.onError('not-allowed');
      } else if (code === 'no-speech') {
        optionsRef.current.onError('no-speech');
      } else if (code === 'network') {
        optionsRef.current.onError('network');
      } else {
        optionsRef.current.onError('other');
      }
    };

    rec.onend = () => {
      recognition.current = null;
      setStatus('idle');
    };

    recognition.current = rec;
    try {
      rec.start();
    } catch {
      recognition.current = null;
      optionsRef.current.onError('other');
    }
  }, [lang]);

  return { status, toggle };
}