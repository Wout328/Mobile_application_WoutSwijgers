// Alle logica rond tijd zit hier, zodat components zelf geen logica bevatten.

export function getTimeText(now: Date = new Date()): string {
  return now.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });
}

export function getDateText(now: Date = new Date()): string {
  return now.toLocaleDateString('nl-BE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}