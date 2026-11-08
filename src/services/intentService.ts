export type Intent = 'time' | 'weather' | 'back' | 'unknown';

// Kleine letters, zonder accenten of leestekens, zodat "Hoe laat is 't?" ook werkt.
const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ');

const PATTERNS: { intent: Exclude<Intent, 'unknown'>; regex: RegExp }[] = [
  { intent: 'back', regex: /\b(terug|sluit|stop|klaar)\b/ },
  {
    intent: 'weather',
    regex: /\b(weer|temperatuur|regen|regent|zon|zonnig|graden|warm|koud|buiten)\b/,
  },
  {
    intent: 'time',
    regex: /\b(hoe laat|tijd|uur|datum|welke dag|wat voor dag|dag is het)\b/,
  },
];

export function detectIntent(transcript: string): Intent {
  const text = normalize(transcript);
  for (const { intent, regex } of PATTERNS) {
    if (regex.test(text)) return intent;
  }
  return 'unknown';
}