---
name: doroboty-landing-ui
description: >-
  Projektuj i buduj ekrany DoRoboty.ai w kierunku „Neon na solidnym” (Miami uporządkowane):
  ciemna noc, solidne panele z linią 1px, jeden akcent z rolą, poświata tylko za nagłówkiem
  ekranu i wokół chipa wyniku. Używaj przy każdym nowym lub zmienianym ekranie tego repo:
  lista ofert, szczegóły oferty, wybór roli, panel pracodawcy lub kandydata, formularze.
---

# DoRoboty.ai – UI „Neon na solidnym”

Wszystkie ekrany mają wyglądać jak jeden produkt: nastrój niesie nagłówek i kilka sygnałów koloru, a **dane, listy i formularze są spokojne, gęste i czytelne**. Odpowiadaj po polsku. Nie dodawaj bibliotek: czysty HTML, CSS i JS.

Status zasad: kierunek wybrany przez użytkownika 16.11.2026 na podstawie [moodboardu](../../../research/moodboard.html). Konkretne wartości poniżej są **propozycją roboczą** do dopracowania w turach poprawek (zob. „Dziennik zmian”). Wartość zatwierdzona przez użytkownika ma pierwszeństwo nad tym plikiem.

## Jak uruchomić ten skill

W nowej rozmowie, w katalogu repo, napisz np.:

> Użyj skilla `doroboty-landing-ui` i zbuduj ekran: lista ofert pracodawcy.

Albo wywołaj go poleceniem `/doroboty-landing-ui` (jeśli nie ma go na liście, zrestartuj sesję w tym katalogu: skille z `.claude/skills/` wczytują się przy starcie). Po każdej uwadze do ekranu poproś: „zaktualizuj skill i DESIGN.md zgodnie z tą zmianą”. W forku kursu skopiuj cały katalog `.claude/skills/doroboty-landing-ui/` do tej samej ścieżki w forku.

## Wzorzec i kontrola

- **Styleguide:** `styleguide.html` (otwórz przez lokalny serwer, np. `python3 -m http.server 8000`) pokazuje wszystkie tokeny i komponenty w stanach. Nowy komponent lub wariant dopisz tam w tym samym kroku, w którym trafia do `components.css`.
- **Skrypt kontrolny:** `python3 scripts/check_style.py` wykrywa surowe kolory, promienie i rozmiary czcionek w px, niezdefiniowane zmienne `var(--x)` i klasy z HTML bez CSS. Stary kod landingu (`styles.css`, `index.html`) ma bazę znanych odstępstw (`scripts/style_baseline.json`); **nowe pliki (`components.css`, `app.css`, nowe ekrany) mają zero tolerancji**. Uruchamiaj go po każdej turze poprawek; `--all` pokazuje wszystko, `--update` zapisuje nową bazę (tylko po świadomej zmianie landingu). Tokeny, które powstają, definiujesz w `tokens.css` (tam wartości są dozwolone).

## Kolejność pracy

1. Przeczytaj `DESIGN.md` (sekcje „Rozszerzenie z 16.11.2026” i „Kolor”) i ten plik. Obejrzyj `index.html`, żeby zobaczyć, jak wyglądają istniejące komponenty.
2. Wybierz kompozycję z tabeli „Kompozycje ekranów”.
3. Używaj **tylko tokenów i klas komponentów** (niżej). Nowy wariant dodaj do `components.css` i opisz tu, zamiast pisać wartość w stylu ekranu.
4. Zbuduj ekran na danych z jednego miejsca (`app/data.js`), bez backendu. Dane fikcyjne; oznacz je (zob. „Treść”).
5. Obejrzyj wynik w przeglądarce w 1440 px i 390 px, z długim polskim tytułem, brakującą pensją i wieloma tagami. Napisz, co sprawdziłeś, a czego nie.
6. Po uwadze użytkownika popraw ekran, zaktualizuj ten plik i `DESIGN.md`, sprawdź pozostałe ekrany i wypisz zmiany w skillu.

## Tokeny

Status wdrożenia: tokeny są w `tokens.css` (ładowany przed `styles.css`) i **używaj ich nazw zmiennych** (`--surface`, `--line`, `--r`, `--r-sm`, `--s-*`, `--sky-*`…). Tabele niżej opisują ich role. Komponenty wspólne są w `components.css` (ładowany po `tokens.css`, przed `styles.css`): `.btn` + `.btn-primary/-secondary/-ghost` + `.btn-sm/-lg`, `.tag`, `.salary`, `.score` (+ `-sm`, `-lg`), `.field` (+ `.field-hint`, `.field-error`), `.toast` (komunikat). `styles.css` zawiera tylko to, co specyficzne dla landingu; `app.css` to baza ekranów aplikacji (reset, `.wrap`, `.screen-head` z poświatą nagłówka) i styleguide. Klasy wspólne: typografia `.h1/.h2/.h3/.lead/.small/.eyebrow`, karty `.card/.card-strong/.card-accent`. Nie dopisuj komponentu do stylu ekranu, jeśli może być wspólny.

### Kolor

| Token | Wartość | Rola |
|---|---|---|
| `--night` | #140A2E | tło ekranu; tekst na jasnych powierzchniach (`--ink`) |
| `--night-2` | #1C0F3D | naprzemienne tło sekcji |
| `--surface` | #221048 | **solidny** panel/karta (zamiast `rgba` z przezroczystością) |
| `--surface-strong` | #2B1560 | karta nad sceną lub tłem z poświatą; aktywny wiersz; menu |
| `--line` | rgba(160,120,255,.28) | domyślna linia 1px: karty, dzielniki, pola |
| `--line-strong` | rgba(160,120,255,.6) | linia przycisku drugorzędnego i przycisku-ikony (słabsza `--line` nie wystarcza, żeby przycisk wyglądał jak przycisk) |
| `--line-accent` | rgba(255,62,165,.7) | aktywna lub wyróżniona karta, focus-within |
| `--line-fact` | rgba(255,209,102,.6) | pigułki faktów (pensja, tagi „Przykład”) |
| `--text` / `--text-2` | #F6F0FF / #C9B8EC | tekst główny / pomocniczy |
| `--pink` | #FF3EA5 | **akcja główna i stan aktywny** |
| `--cyan` | #2DE2E6 | **wynik i dane** (Match Score, liczby, paski) |
| `--sun` | #FFD166 | **metadane**: nadtytuły, nagłówki tabel, pensja w pigułce |
| `--orange` | #FF8C42 | tylko scena i koniec gradientu (landing) |
| `--danger` | #FF6B6B | błąd (zawsze z ikoną i tekstem), *propozycja do zatwierdzenia* |

**Zasada jednego akcentu z rolą:** róż = „zrób to / to jest wybrane”, turkus = „to jest liczba/wynik”, żółty = „to jest opis”. Nie używaj koloru do innego celu. Na ekranie roboczym najlepszy wynik lub jedna główna akcja dostaje róż; reszta jest neutralna.

Kontrasty (policzone, WCAG): `--text` na `--surface` 15,2:1; `--text-2` na `--surface` 9,3:1; `--pink` na `--surface` 5,3:1; `--cyan` na `--surface` 10,6:1; `--sun` na `--surface` 11,8:1; `--ink` na `--pink` 5,8:1; `--ink` na `--cyan` 11,8:1; `--danger` na `--surface` 6,1:1. Tekstu mniejszego niż 13 px w kolorze innym niż `--text`/`--text-2` nie używaj.

### Typografia

| Rola | Krój | Rozmiar / waga |
|---|---|---|
| Tytuł ekranu (H1), np. „Oferty pracy z AI”, „Twoje ogłoszenia” | Anton, wersaliki | `--fs-h1`, kolor `--text` (bez gradientu) |
| Tytuł oferty na ekranie szczegółów (też H1) | IBM Plex Sans 600, normalna wielkość liter | `--fs-title` (28–40 px); nigdy Anton, bo tytuły bywają długie |
| Duże liczby (wynik, statystyki) | Anton | 34 / 56 / 96 px |
| **Tytuł oferty i karty (H2/H3)** | **IBM Plex Sans 600**, normalna wielkość liter | 22 px (karta), 28 px (nagłówek sekcji) |
| Tekst | IBM Plex Sans 400 | 17 px / 1,6 |
| Pomocniczy | IBM Plex Sans 400 | 15 px; podpis 13 px |
| Nadtytuł / etykieta | IBM Plex Sans 600, wersaliki | 13 px, `letter-spacing .12em`, kolor `--sun` |

Anton tylko dla H1 i liczb. Gradientowe nagłówki i poświata nagłówka zostają **na landingu**; na ekranach roboczych nagłówki są jednolite. Długi polski tytuł łamie się i zwiększa wysokość karty; nie zmniejszaj czcionki pojedynczej karty.

### Geometria i odstępy

- Promienie: `--r-sm 10px` (pola, małe elementy), `--r 16px` (karty), `--r-lg 20px` (karta wyróżniona), `--r-pill 99px` (tagi i pigułki), przyciski 12 px.
- Odstępy: skala 4 / 8 / 12 / 16 / 24 / 32 / 48 / 72 px. Padding karty 20 lub 24 px; karta wyróżniona 32 px (48 na desktopie). Odstęp między sekcjami `clamp(72px, 10vw, 140px)` na landingu, 48 px w panelu.
- Maks. szerokość 1280 px; marginesy 16 / 32 / 48 px.
- Powierzchnie: tylko `--surface` i `--surface-strong`, z linią 1px; **bez przezroczystości, bez `backdrop-filter`** (wyjątek: przyklejony nagłówek strony).
- Cienie i poświata: tylko (1) radialna poświata różowo-fioletowa za nagłówkiem ekranu, (2) poświata chipa wyniku (`--glow-cyan`). Karty, przyciski i pola bez poświaty.
- **Neon z landingu na ekranach roboczych:** słońce w paski (`--grad-sun` + maska pasów) wolno pokazać tylko w nagłówku ekranu `.screen-head` (po prawej, przycięte do dolnej krawędzi, ukryte na telefonie). Ekrany bez `.screen-head` (szczegóły oferty, panel) nie dostają dekoracji sceny; palmy i panorama zostają na landingu.

## Komponenty

**Przyciski** (jedna rodzina, radius 12 px, Plex 700):

| Wariant | Wygląd | Użycie |
|---|---|---|
| `.btn-primary` | tło `--grad-btn`, tekst `--ink` | jedna główna akcja na widok |
| `.btn-secondary` | tło przezroczyste, linia 1px `--line-strong`, tekst `--text` | akcja drugorzędna (np. „Zapisz”) |
| `.btn-ghost` | bez linii, tekst `--text`, strzałka | akcja w wierszu (np. „Zobacz ofertę”) |

Rozmiary: sm 40 px, domyślny 48 px, lg 56 px wysokości. Na telefonie cel dotyku min. 44 px.

**Chip wyniku `.score`:** tło `--cyan`, tekst `--ink`, Anton; rozmiary sm 22 / 34 / lg 96 px; ten sam promień `--r-sm`. Wynik zawsze z etykietą „Match Score” lub `aria-label`.

**Tag i pigułka:** `.tag` (13 px, wersaliki, linia `--line-fact`, kolor `--sun`) dla metadanych; zwykłe tagi umiejętności bez wersalików, linia `--line`, nieklikalne. Pensja: pigułka `.salary` (linia `--line-fact`, kolor `--text`, kwota, waluta, forma i okres razem).

**Karta oferty (wiersz):** poziomy układ z **kolumną faktów** po prawej, oddzieloną pionową linią `--line`.

- Lewa część, każda rzecz w swojej linii: **pełna nazwa firmy** (`.job-company`: Plex 600, 17 px, `--sun`) · **tytuł** · linia meta zaczynająca się od etykiety kategorii (`.tag.tag-muted` Build/Apply/Lead), potem miasto · tryb · poziom · tagi (maks. 4 + „+N”).
- **Bez inicjałów i skrótów nazw firm** (żadnych kwadratów „PP”, „DF”). Nazwa firmy jest zawsze pełna i nigdy nie dzieli linii z etykietą kategorii.
- Prawa kolumna (264 px, `.job-facts`): termin dodania · pensja: kwota w pigułce `.salary` (jedna linia), a forma i okres tuż pod nią w `.salary-note` (razem w `.salary-wrap`) · chip Match Score z podpisem · `.btn-ghost` „Zobacz ofertę”. Brak pensji: pigułka „Nie podano wynagrodzenia”.
- Na telefonie kolumna faktów schodzi pod tytuł; fakty zostają blisko tytułu.

**Panel faktów (szczegóły oferty, `.facts` + `.facts-list`):** po prawej, przyklejony na `top: 88px` (64 px nagłówka + 24 px), `--surface-strong`: widełki, tabela faktów z liniami (forma, tryb, lokalizacja, doświadczenie), `.btn-primary` „Aplikuj”, `.btn-secondary` „Zapisz”, pasek „X dni do końca ogłoszenia” (z 30). Na telefonie panel idzie przed opis.

**Opis oferty (szczegóły): najważniejsze na wierzchu.**

- Zdanie „Praca z AI w tej roli” to osobny wyróżnik `.callout` nad opisem: karta `--surface-strong` z różową linią po lewej, tekst 20 px.
- Zadania: `ol.num-list` (numery 01, 02… w Antonie, turkus). Wymagania: `ul.check-list` (turkusowe ✓). Co oferujemy: `ul.perks` (trzy małe karty w rzędzie, na telefonie jedna kolumna).
- **W każdym punkcie jedna najważniejsza fraza jest w `strong`** (pełny kolor `--text`, 600), a reszta zdania w `--text-2`. W danych frazę oznaczają `*gwiazdki*`. Jedna fraza na punkt (w wyróżniku najwyżej dwie); nie pogrubiaj całych zdań.

**Okno modalne `.modal`:** natywny `dialog` otwierany `showModal()`, zawsze wyśrodkowany, szerokość do 620 px, linia `--line-accent`, tło pod spodem `--backdrop`. Nagłówek z nadtytułem, tytułem i przyciskiem `.icon-btn` „Zamknij”; zamyka się też klawiszem Esc i kliknięciem w tło. **Wybór roli jest zawsze modalem** (otwiera go przycisk roli w nagłówku na każdym ekranie), a nie osobną stroną z formularzem; `logowanie.html` tylko otwiera to okno.

**Liczby, które mają prowadzić wzrok:** najważniejsza liczba ekranu dostaje kartę `.card-strong.card-accent` i `.stat-num-lg` (56 px), szerszą niż pozostałe statystyki. W panelu pracodawcy to **liczba aktywnych aplikacji** z dopiskiem, ile nowych czeka na decyzję. W wierszu ogłoszenia liczba aplikacji stoi w kolumnie faktów jako `.job-apps` (liczba w Antonie + podpis), a miernik 30 dni po lewej pod tytułem, żeby wiersz nie miał pustego miejsca.

**Pola formularza `.field`:** tło `--night`, linia `--line`, radius `--r-sm`, etykieta nad polem 15 px, błąd pod polem (`--danger` + ikona + tekst). Focus: patrz „Stany”.

**Tabela:** nagłówki 13 px wersaliki `--sun`, wiersze rozdzielone linią `--line`, brak zebry. Liczby wyrównane do prawej lub z paskiem.

**Zakładki i filtry:** segment (pigułka z linią), wybrany: tło `--surface-strong` + linia `--line-accent`; kategorie to przyciski, nie zakładki ARIA.

**Nagłówek aplikacji:** baner `.demo-banner` nad nagłówkiem na każdym ekranie demo; `.app-header` solidny (`--night`), logo gradientowe (jedyny gradient tekstu poza landingiem), nawigacja `.app-nav` z `aria-current`, po prawej `.btn-secondary.btn-sm` z rolą. Na telefonie: logo i rola w pierwszym wierszu, nawigacja pod nimi.

**Pozostałe (wszystkie w styleguide, sekcja „Komponenty aplikacji”):** `.segment` (z etykietą `.field-label` nad nim), `.meter` (turkus, `--v` 0–100), `.breakdown-list`, `.status` (+ `-new` róż = wymaga działania, `-active` turkus), `.table` w `.table-wrap`, `.stat-num`, `.empty`, `.check`, `.choice`, `.back-link`. Grupy pól wyboru zawsze jako `fieldset.filters-group` z `legend.eyebrow`; pole wyboru bez marginesu, w jednej linii pionowej z nagłówkiem grupy.

**Komunikat:** pasek na dole z linią `--line-accent` i ikoną, bez gradientu przycisku (nie może wyglądać jak CTA).

## Kompozycje ekranów

| Zadanie | Układ |
|---|---|
| Lista ofert / aplikacji | nagłówek z poświatą → **jeden pasek narzędzi**: Szukaj · Kategoria (segment) · Sortowanie, każde z etykietą nad kontrolką i równą dolną krawędzią → nagłówek „Oferty N” na całą szerokość → filtry po lewej + wiersze po prawej, **górne krawędzie karty filtrów i pierwszego wiersza w jednej linii** (nic nie stoi nad samą listą); telefon: filtry zwinięte, jedna kolumna |
| Szczegóły oferty | nagłówek (firma, tytuł, fakty) → kolumna czytania + panel faktów po prawej; telefon: nagłówek, panel, opis, firma |
| Wybór roli / logowanie (demo) | wyśrodkowane okno modalne `.modal` nad bieżącym ekranem; dwa wybory `.choice` (kandydat/pracodawca), jedna akcja główna, informacja „atrapa logowania, bez haseł” |
| Panel pracodawcy | menu boczne 240 px + treść; rząd statystyk z wyróżnioną liczbą aktywnych aplikacji (2fr 1fr 1fr); segment „Aktywne / Szkice / Zakończone”; wiersze ogłoszeń (tytuł, kategoria, status, miernik 30 dni po lewej; liczba aplikacji, nowe, najwyższy wynik i akcja w kolumnie faktów); tabela ostatnich aplikacji |
| Formularz | zwarta karta, pola w grupach, jedna główna akcja, błędy przy polach |

## Stany

- **Focus:** `outline: 3px solid var(--cyan); outline-offset: 3px` na każdym elemencie interaktywnym.
- **Hover:** przycisk `brightness(1.08)` i `translateY(-1px)`; wiersz/karta: linia na `--line-accent`. Bez dodatkowej poświaty.
- **Aktywny/wybrany:** linia `--line-accent` + tło `--surface-strong`; `aria-pressed` lub `aria-current`.
- **Wyłączony:** `opacity .45`, kursor `not-allowed`, bez cienia.
- **Ładowanie:** szkielet w `--surface-strong` bez animacji przy `prefers-reduced-motion`.
- **Pusty:** krótki komunikat, jedna akcja odzyskania (np. „Wyczyść filtry”).
- **Błąd:** `--danger`, ikona i tekst (nigdy sam kolor).
- **Sukces:** ikona ✓ i komunikat; kolor `--cyan`.

## Treść

- Po polsku, forma bezosobowa lub „Ty”. Bez wykrzykników, bez „rewolucyjny”, „innowacyjny”.
- Dane fikcyjne oznacz jednym znacznikiem „Przykład · firma fikcyjna” na sekcję lub ekran, a nie na każdej karcie.
- Nie wymyślaj ocen, liczby kandydatów, „pilne”, „ostatnie miejsca”, weryfikowanych znaczków ani sukcesu wysłania. Aplikowanie i logowanie są symulacją i mają to jasno powiedzieć.
- Pensja: kwota, waluta, forma (netto/brutto, B2B/UoP) i okres razem. Match Score ma opis, czym nie jest (nie prawdopodobieństwo zatrudnienia).

## Czego nie wolno

- Surowych `#hex`, `rgba(...)`, promieni i rozmiarów czcionek w stylach ekranu; tylko tokeny.
- Przezroczystych kart z `backdrop-filter`, poświaty na kartach, gradientowych nagłówków na ekranach roboczych.
- Drugiego koloru akcji ani drugiej rodziny przycisków; trzech rozmiarów kart z różnym paddingiem.
- Anton w tytułach ofert, w tekście i w przyciskach.
- Nowych zależności, frameworków CSS i skryptów zewnętrznych; obrazów zewnętrznych stron jako grafiki.
- Komunikatu w gradiencie przycisku głównego.
- Kolumny tagów, która przewyższa tytuł; skracania tytułu zamiast łamania.
- Zmian wyglądu `index.html` bez prośby użytkownika.

## Sprawdzenie przed oddaniem

Desktop 1440 px i telefon 390 px; brak poziomego przewijania (też 320 px); długi tytuł z polskimi znakami; brak pensji i logo; wiele tagów; focus klawiaturą; kontrast tokenów z tabeli; `prefers-reduced-motion`. Napisz, co sprawdzono i czego nie.

## Dziennik zmian

- 16.11.2026 (tura poprawek 2, uwagi użytkownika): (1) opisy oferty: wyróżnik `.callout`, listy `.num-list`/`.check-list`/`.perks` i zasada jednej pogrubionej frazy na punkt; (2) wybór roli jako wyśrodkowany modal na każdym ekranie zamiast formularza na stronie; (3) panel pracodawcy: wyróżniona liczba aktywnych aplikacji (`.stat-num-lg`), liczba aplikacji w kolumnie faktów wiersza, miernik po lewej; (4) `.btn-secondary` z mocniejszą linią `--line-strong`; (5) słońce w paski w `.screen-head`. Nowe tokeny: `--line-strong`, `--backdrop`, `--fs-stat-lg`. Nowe klasy: `.callout`, `.callout-text`, `.num-list`, `.check-list`, `.perks`, `.modal`, `.modal-head`, `.modal-body`, `.icon-btn`, `.actions`, `.stat-num-lg`, `.job-apps`, `.job-days`.
- 16.11.2026 (tura poprawek 1, uwagi użytkownika do listy ofert): (1) grupy filtrów ujednolicone: obie jako `fieldset` + `legend.eyebrow`, pola wyboru wyrównane do lewej krawędzi nagłówków; (2) wyszukiwarka, kategoria i sortowanie w jednym pasku, lista zaczyna się na wysokości karty filtrów; (3) nazwa firmy wyeksponowana w osobnej linii (`.job-company`), etykieta kategorii przeniesiona do linii meta; (4) usunięty komponent `.logo-mark` i wszystkie inicjały firm, także na szczegółach oferty i w panelu pracodawcy; usunięte `.job-kicker`, `.results-head`, `.detail-company`.
- 16.11.2026 (krok 3, pierwsze ekrany): `app/oferty.html`, `app/oferta.html`, `app/logowanie.html`, `app/pracodawca.html` + `app/data.js` (dane przez `DR.getOffers/getOffer/getEmployer/getBreakdown`) + `app/app.js`. Nowe komponenty w `components.css` i styleguide (lista wyżej), układy w `app.css`. Ustalenia z budowy: (1) pensja w kolumnie faktów nie mieści się w jednej pigułce, więc kwota jest w pigułce, a forma i okres pod nią; (2) tytuł oferty na szczegółach to Plex 600 `--fs-title`, nie Anton; (3) `main.wrap` nie może dostać skrótu `padding`, bo kasuje marginesy boczne `.wrap` (używaj `padding-top/-bottom`); (4) w ekranach nie używaj atrybutu `style` poza zmienną `--v` miernika; (5) skrypt kontrolny obejmuje też `app/`.
- 16.11.2026 (styleguide i kontrola): `styleguide.html` + `app.css` (baza aplikacji) + `scripts/check_style.py` z bazą `scripts/style_baseline.json`. Nowe tokeny: `--glow-pink` (poświata nagłówka ekranu), `--btn-highlight`, `--glow-cyan`, `--shadow-pop`, `--fs-lead/-h1/-score*`. Klasy wspólne: `.h1/.h2/.h3/.lead/.small/.eyebrow` i `.card/.card-strong/.card-accent` (przeniesione/dodane do `components.css`). Uwaga do dopracowania: `.btn-secondary` ma bardzo słabą linię (`--line`, ~28% krycia); jeśli to za mało widoczne, użyj mocniejszej linii.
- 16.11.2026 (naprawa A3–A5): `components.css` (przyciski w 3 wariantach i wysokościach 40/48/56 px, `.salary`, `.field`, `.tag`, `.score`, komunikat). Przycisk główny bez zewnętrznej poświaty; CTA hero ma 48 px (było 53). Komunikat `.toast` to ciemna karta z linią `--line-accent` i ikoną `--sun`, nie gradient CTA. Tag 13 px (`letter-spacing .08em`; na telefonie w ofertach `.02em`, bo musi zmieścić się w kartach karuzeli ~254 px). Typografia: eyebrow 13 px `.12em`, nagłówki kart 22 px, tekst pomocniczy 15 px, najmniejszy tekst 13 px. Numeracja „Co dostajesz” w turkusie jak w „Jak to działa”. Czarny tekst `rgb(0,0,0)` to były tylko puste przyciski paginacji; dostały `color: var(--text)`. Wyjątek landingu: kategorie `.offer-cat`/`.cat-name` w Antonie (na ekranach roboczych używaj `.tag`).
- 16.11.2026 (naprawa A1–A2): tokeny wyciągnięte do `tokens.css`; w `styles.css` zniknęły surowe `#hex` i `rgba` powierzchni, linii i promieni. Karty: 2 powierzchnie zamiast 6; `.match`, `.offer`, `.cat`, `.stats`, `.app-card`, `.cf-nav` = `--surface-strong`; pain/steps/get/faq/fake-ad/nav = `--surface`. Usunięte `backdrop-filter` z kart i poświata kart (`.match`, `.offer:hover`, `.cf-card.is-active`). Otwarte FAQ i aktywna oferta mają `--line-accent` (róż) zamiast cyan. Promienie ujednolicone, przycisk sm ma 12 px. Padding kart: `.app-card` 20, `.pain-list li` 24.
- 16.11.2026: pierwsza wersja. Kierunek „Neon na solidnym” + kolumna faktów w wierszu oferty (wybór użytkownika po moodboardzie). Tokeny i wartości z audytu DESIGN.md i moodboardu; do zatwierdzenia w turach poprawek.
