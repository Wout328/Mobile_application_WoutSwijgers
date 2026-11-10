# 🤖 [Naam van je app] — de assistent met ogen

Een vriendelijke, interactieve assistent met een gezicht. Je vraagt hem de tijd of het weer, met knoppen of met je stem, en hij antwoordt op het scherm met een tekstballon, terwijl zijn ogen reageren op wat er gebeurt: blij, boos of een beetje verveeld.

**🌐 Live (PWA): [https://JOUW-LINK.vercel.app](https://mobile-application-wout-swijgers.vercel.app/)**

> Opdracht Mobile Applications (UCLL) · PWA-opdracht

## Over het project

Digitale assistenten zoals Siri voelen vaak kil en zakelijk aan. Dit project is een speelsere variant: een assistent met een karakter. De ogen knipperen, kijken rond, worden blij als hij je kan helpen en boos als je hem plaagt. De bedoeling is dat het gebruiken van de app zelf al een klein moment van plezier is.

## Schermen

| Scherm | Wat je er ziet |
|---|---|
| **Hoofdscherm** | De ogen van de assistent, knoppen voor de tijd en het weer, een microfoonknop, en rechtsboven een kleurkiezer en de Info-knop. |
| **Info** | Waar de app voor dient, wat hij nu al kan, wat er nog komt. |

Daarnaast zijn er twee tekstballonnen die op het hoofdscherm verschijnen als je iets vraagt: één voor de tijd (met dag en datum) en één voor het weer. Bij een vraag verkleinen de ogen en schuiven ze naar linksboven, zodat de ballon er als gesproken tekst bij hangt.

## Functies

- 🕒 **Tijd, dag en datum** in een tekstballon, met een klok die live meeloopt
- ⛅ **Weer** in een tekstballon (voorlopig met voorbeeldgegevens, zie [beperkingen](#beperkingen))
- 🎙️ **Spraakbesturing**: tik op de microfoon en zeg bijvoorbeeld "hoe laat is het?" of "wat is het weer?"
- 😀 **Levendige ogen**: ze knipperen, kijken rond en wisselen vanzelf tussen neutraal, blij en verveeld
- 😠 **Reactie op een tik**: tik op de ogen en de assistent kijkt boos naar je
- 🎨 **Eigen oogkleur**: kies in een popup de kleur van de ogen, je ziet het resultaat meteen
- 📱 **Installeerbaar als PWA** en bedienbaar met één hand (de knoppen staan onderaan)

## Gebouwd met

- [Expo](https://expo.dev/) en [React Native](https://reactnative.dev/) (met React Native Web voor de PWA)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/) voor de navigatie
- De `Animated`-API van React Native voor alle animaties
- De Web Speech API van de browser voor spraakherkenning
- [Vercel](https://vercel.com/) voor de hosting

## Aan de slag

### Vereisten

- [Node.js](https://nodejs.org/) (een recente LTS-versie)
- npm

### Installatie

```sh
git clone https://github.com/[JOUW-GEBRUIKERSNAAM]/[REPO-NAAM].git
cd [REPO-NAAM]
npm install
```

### Lokaal draaien

```sh
npx expo start --web
```

### De PWA bouwen

```sh
npx expo export -p web
```

De statische bestanden komen in de map `dist/`. Die map wordt gehost op Vercel (build command `npx expo export -p web`, output directory `dist`).

## Gebruik

1. Open de [live link](https://JOUW-LINK.vercel.app), bij voorkeur in **Chrome** of **Edge**.
2. Tik op **Hoe laat is het?** of **Wat is het weer?**, of gebruik de microfoon.
3. Tik op **Terug** (of zeg "terug") om de ogen weer naar het midden te halen.
4. Tik op de **gekleurde stip** rechtsboven om de oogkleur te veranderen.
5. Tik op de **ogen** zelf en kijk wat er gebeurt.
6. Tik op **Info** voor uitleg over de app.

**Installeren als app:** open de link op je telefoon en kies in het browsermenu "Toevoegen aan beginscherm".

**Voorbeeldzinnen voor de spraak:** "hoe laat is het", "welke dag is het vandaag", "wat is het weer", "terug".

## Login en database

Deze app heeft **geen login** en **geen database**. Er zijn dus geen inloggegevens nodig om de app te bekijken, en er is niets dat op een server moet draaien buiten de gehoste webapp zelf. Er worden ook geen API-aanroepen gedaan: de tijd komt van het toestel en het weer is voorbeelddata.

## Het idee achter de app

### Wie is de doelgroep?

- **Jongeren en studenten** die graag iets speels en persoonlijks gebruiken in plaats van een kale tool.
- **Mensen die snel iets willen weten** (de tijd, het weer) zonder door menu's te zoeken, en het liefst met één hand of met hun stem.
- Op termijn ook **gezinnen en kinderen**, omdat een assistent met een gezicht laagdrempelig en vriendelijk aanvoelt.

### Wat ga ik bouwen? (roadmap)

**Versie 1: de basis (deze PWA)**

- [x] Levendige ogen met meerdere emoties (neutraal, blij, boos, verveeld)
- [x] Tijd, dag en datum in een tekstballon
- [x] Weer in een tekstballon (voorbeeldgegevens)
- [x] Spraakbesturing in de browser
- [x] Oogkleur kiezen
- [x] Installeerbaar als PWA en gehost

**Volgende stappen**

- [ ] Het echte weer van de locatie van de gebruiker (via een gratis weer-API)
- [ ] Meer emoties en reacties, zodat de assistent nog levendiger wordt
- [ ] Antwoorden hardop uitspreken (tekst-naar-spraak) en meer vragen begrijpen
- [ ] De gekozen oogkleur onthouden
- [ ] Handige extra's zoals een timer of een herinnering
- [ ] Uitbreiden naar een volwaardige mobiele app (Android en iOS) met Expo

### Wie zijn de concurrenten?

| Concurrent | Wat doen ze goed | Waarin wijkt mijn idee af |
|---|---|---|
| **Siri** (Apple) | Diep geïntegreerd in het toestel, veel functies | Persoonlijkheid ontbreekt, en alleen op Apple-toestellen |
| **Google Assistant / Gemini** | Heel veel kennis en functies | Zakelijk en breed, het voelt niet als een eigen karakter |
| **Alexa** (Amazon) | Slimme thuis- en spraakbediening | Vooral voor een speaker in huis, minder als speelse mobiele app |
| **EMO** (LIVING.AI) en andere kleine bureaurobots | Een sterk karakter met expressieve ogen | Het is een apart apparaat dat je moet kopen, mijn assistent is gratis en draait in de browser |

**Mijn onderscheid:** een lichte assistent met een eigen persoonlijkheid, zonder account of aankoop, die meteen werkt via een link en op elk toestel kan worden geïnstalleerd.

## Beperkingen

- **Het weer is voorbeelddata** (de stad is vast). Dit is een eerste versie zonder API-aanroepen, zoals de opdracht toelaat.
- **Spraak werkt alleen in Chrome en Edge**, en alleen via `https` (dus op de live link, niet via een gewoon lokaal IP-adres). Chrome stuurt de audio naar de servers van Google voor de herkenning. In Safari en Firefox gebruik je de knoppen.
- **De gekozen oogkleur wordt niet bewaard** na het sluiten van de app.

## Contact en bedankt

Gemaakt door **[Jouw naam]** voor het vak Mobile Applications aan UCLL.

- E-mail: [jouw e-mailadres]
- Repository: https://github.com/[JOUW-GEBRUIKERSNAAM]/[REPO-NAAM]

Bedankt om de app uit te proberen! 💙
