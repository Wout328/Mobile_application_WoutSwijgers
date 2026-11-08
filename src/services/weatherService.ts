import type { EyeMood } from '../components/Eyes';

export type ForecastItem = {
  label: string;
  icon: string;
  temperature: number;
};

export type WeatherInfo = {
  city: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: string;
  windKmh: number;
  humidity: number;
  rainChance: number;
  forecast: ForecastItem[];
  /** Welke blik de ogen krijgen bij dit weer. */
  mood: EyeMood;
};

// Voorbeelddata. Later vervang je de inhoud van deze functie door een echte
// weer-API; de rest van de app hoeft dan niet te veranderen.
export function getWeather(): WeatherInfo {
  return {
    city: 'Leuven',
    temperature: 14,
    feelsLike: 12,
    condition: 'Half bewolkt',
    icon: '⛅',
    windKmh: 18,
    humidity: 72,
    rainChance: 20,
    forecast: [
      { label: 'Vanmiddag', icon: '🌤️', temperature: 15 },
      { label: 'Vanavond', icon: '☁️', temperature: 11 },
      { label: 'Morgen', icon: '🌧️', temperature: 10 },
    ],
    mood: 'happy',
  };
}