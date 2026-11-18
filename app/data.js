/* DoRoboty.ai – dane demonstracyjne. Wszystkie firmy, osoby, widełki i wyniki są fikcyjne.
   Ekrany czytają dane wyłącznie przez funkcje z window.DR (getOffers, getOffer…),
   żeby późniejsza zmiana źródła danych nie wymagała zmian w ekranach.
   W opisach *gwiazdki* oznaczają najważniejszą frazę (ekran ją pogrubia). */
(() => {
  const benefits = [
    "*Jasny zakres odpowiedzialności* i czas na naukę narzędzi AI.",
    "*Budżet na narzędzia i szkolenia* ustalany z zespołem.",
    "*Rozmowa o warunkach przed decyzją*, bez zadań rekrutacyjnych na kilka dni.",
  ];
  const offers = [
    { id: 1, title: "Inżynier/ka LLM", company: "Pegaz Płatności", initials: "PP", category: "Build",
      city: "Warszawa", mode: "Hybrydowo", level: "Senior", tags: ["Python", "RAG", "Ewaluacja modeli"],
      salary: { min: 22, max: 28, basis: "netto (B2B)" }, added: 0, daysLeft: 30, score: 79,
      ai: "Buduje *asystenta do obsługi zwrotów*, testuje i poprawia *odpowiedzi modelu*.",
      tasks: ["Projektowanie i utrzymanie *asystenta obsługującego zwroty płatności*.", "Budowa *zestawów testowych* i ocena jakości odpowiedzi modelu.", "Współpraca z zespołem obsługi przy opisie *przypadków brzegowych*."],
      reqs: ["Doświadczenie w budowie *rozwiązań opartych na modelach językowych*.", "*Python* i praca z danymi tekstowymi.", "Umiejętność opisania, *kiedy model się myli* i dlaczego."] },
    { id: 2, title: "Integrator/ka automatyzacji", company: "Dedal Fabryka Mebli", initials: "DF", category: "Build",
      city: "Poznań", mode: "Stacjonarnie", level: "Mid", tags: ["n8n", "API", "SQL"],
      salary: { min: 16, max: 21, basis: "brutto (UoP)" }, added: 2, daysLeft: 28, score: 71,
      ai: "Łączy *model z systemem zamówień*, pilnuje *kosztów i logów*.",
      tasks: ["Łączenie modelu językowego z *systemem zamówień*.", "Monitorowanie *kosztów i logów* automatyzacji.", "*Dokumentowanie przepływów* dla zespołu produkcji."],
      reqs: ["Praktyka w *integracjach przez API*.", "Podstawy *SQL*.", "*Dokładność* w pracy z danymi zamówień."] },
    { id: 3, title: "Marketer/ka performance", company: "Ikar Media", initials: "IM", category: "Apply",
      city: "Cała Polska", mode: "Zdalnie", level: "Mid", tags: ["Kampanie", "Generatywne AI", "Analityka"],
      salary: { min: 11, max: 14, basis: "brutto (UoP)" }, added: 3, daysLeft: 27, score: 86,
      ai: "Tworzy *warianty kampanii z modelem* i sprawdza, *które naprawdę działają*.",
      tasks: ["Przygotowanie *wariantów kreacji* z pomocą modelu.", "*Testowanie wariantów* i raportowanie wyników.", "Uzgadnianie *tonu komunikacji* z klientem."],
      reqs: ["Doświadczenie w *kampaniach płatnych*.", "Codzienna praca z *narzędziami generatywnymi*.", "*Czytanie wyników testów* bez nadinterpretacji."] },
    { id: 4, title: "Analityk/czka operacyjny/a", company: "Olimp Logistyka", initials: "OL", category: "Apply",
      city: "Gdańsk", mode: "Hybrydowo", level: "Mid", tags: ["Raporty", "SQL", "Weryfikacja danych"],
      salary: { min: 13, max: 17, basis: "brutto (UoP)" }, added: 5, daysLeft: 25, score: 74,
      ai: "Automatyzuje *raporty dzienne* i *weryfikuje wnioski modelu* na danych.",
      tasks: ["*Automatyzacja raportów* dziennych.", "*Sprawdzanie wniosków modelu* na danych źródłowych.", "*Zgłaszanie rozbieżności* zespołowi operacji."],
      reqs: ["*SQL* i arkusze kalkulacyjne.", "Doświadczenie w *raportowaniu operacyjnym*.", "Nawyk *sprawdzania wyniku u źródła*."] },
    { id: 5, title: "Head of AI", company: "Minerwa Ubezpieczenia", initials: "MU", category: "Lead",
      city: "Warszawa", mode: "Hybrydowo", level: "Lead", tags: ["Strategia", "Budżet", "Zarządzanie"],
      salary: { min: 30, max: 38, basis: "netto (B2B)" }, added: 8, daysLeft: 22, score: 68,
      ai: "Ustala, *które procesy automatyzować najpierw*, prowadzi *budżet* i łączy IT z biznesem.",
      tasks: ["Ustalanie *kolejności procesów* do automatyzacji.", "Prowadzenie *budżetu inicjatyw AI*.", "Łączenie zespołów *IT, prawnego i biznesu*."],
      reqs: ["Prowadzenie *wdrożeń technologicznych* w dużej organizacji.", "*Doświadczenie budżetowe*.", "Rozumienie *ograniczeń modeli językowych*."] },
    { id: 6, title: "Product Manager/ka AI", company: "Kronos Retail", initials: "KR", category: "Lead",
      city: "Kraków", mode: "Zdalnie", level: "Senior", tags: ["Product discovery", "Obsługa klienta", "Metryki"],
      salary: { min: 20, max: 26, basis: "brutto (UoP)" }, added: 12, daysLeft: 18, score: 81,
      ai: "Decyduje, *co oddać modelowi* w obsłudze klienta, i *mierzy efekt*.",
      tasks: ["Wybór *spraw klientów*, które może obsłużyć model.", "Definiowanie *metryk* i pomiar efektu.", "Praca z zespołem obsługi nad *jakością odpowiedzi*."],
      reqs: ["*Doświadczenie produktowe* w e-commerce lub obsłudze klienta.", "Praca z *danymi i eksperymentami*.", "Umiejętność powiedzenia *„tego modelowi nie oddajemy”*."] },
    { id: 7, title: "Senior Product Designer / AI Experience Lead — narzędzia dla zespołów operacyjnych", company: "Hefajstos Narzędzia", initials: "HN", category: "Apply",
      city: "Wrocław", mode: "Zdalnie", level: "Senior", tags: ["UX", "Prototypowanie z AI", "Research", "Design system", "Figma", "Dostępność"],
      salary: null, added: 1, daysLeft: 29, score: 77,
      ai: "Projektuje *narzędzia, w których zespoły operacyjne pracują z modelem*, i *prototypuje je z pomocą AI*.",
      tasks: ["Projektowanie ekranów, na których *człowiek zatwierdza pracę modelu*.", "*Szybkie prototypy* z pomocą narzędzi AI i testy z użytkownikami.", "Rozwój *design systemu* narzędzi wewnętrznych."],
      reqs: ["Doświadczenie w projektowaniu *narzędzi B2B*.", "*Prototypowanie* w kodzie lub z pomocą AI.", "Prowadzenie *badań z użytkownikami*."] },
    { id: 8, title: "Specjalista/ka ds. wdrożeń asystentów AI", company: "Pegaz Płatności", initials: "PP", category: "Apply",
      city: "Warszawa", mode: "Hybrydowo", level: "Mid", tags: ["Wdrożenia", "Szkolenia", "Obsługa klienta"],
      salary: { min: 14, max: 18, basis: "brutto (UoP)" }, added: 6, daysLeft: 24, score: 83,
      ai: "*Wdraża asystenta* w zespołach obsługi, *szkoli ludzi* i zbiera przypadki, w których model zawodzi.",
      tasks: ["*Wdrażanie asystenta* w kolejnych zespołach obsługi.", "*Szkolenia i materiały* dla pracowników.", "Zbieranie i opisywanie *błędów modelu*."],
      reqs: ["Doświadczenie we *wdrożeniach narzędzi* w zespołach.", "*Jasne tłumaczenie technologii* nietechnicznym osobom.", "Codzienna praca z *asystentami AI*."] },
  ];

  const employer = {
    company: "Pegaz Płatności",
    postings: [
      { offerId: 1, title: "Inżynier/ka LLM", category: "Build", status: "aktywne", applications: 9, newApplications: 3, daysLeft: 30, topScore: 88 },
      { offerId: 8, title: "Specjalista/ka ds. wdrożeń asystentów AI", category: "Apply", status: "aktywne", applications: 14, newApplications: 2, daysLeft: 24, topScore: 91 },
      { offerId: null, title: "Analityk/czka jakości odpowiedzi modelu", category: "Build", status: "szkic", applications: 0, newApplications: 0, daysLeft: null, topScore: null },
      { offerId: null, title: "Inżynier/ka danych", category: "Build", status: "zakończone", applications: 21, newApplications: 0, daysLeft: 0, topScore: 84 },
    ],
    applications: [
      { candidate: "Anna K.", offer: "Specjalista/ka ds. wdrożeń asystentów AI", when: "Dzisiaj", score: 91, status: "Nowa" },
      { candidate: "Marek N.", offer: "Inżynier/ka LLM", when: "Dzisiaj", score: 88, status: "Nowa" },
      { candidate: "Julia W.", offer: "Specjalista/ka ds. wdrożeń asystentów AI", when: "Wczoraj", score: 83, status: "Kontynuujemy" },
      { candidate: "Piotr Z.", offer: "Inżynier/ka LLM", when: "2 dni temu", score: 79, status: "Nowa" },
      { candidate: "Ewa M.", offer: "Inżynier/ka LLM", when: "3 dni temu", score: 64, status: "Odrzucona" },
    ],
  };

  // wagi Match Score są prawdziwe (DR-CTX); rozbicie na obszary jest ilustracyjne
  const WEIGHTS = [["Umiejętności", 35, 4], ["Opisane zadania", 30, 2], ["Poziom doświadczenia", 20, -12], ["Warunki pracy", 15, 3]];

  window.DR = {
    getOffers: () => offers.map((o) => ({ ...o, benefits })),
    getOffer: (id) => { const o = offers.find((x) => x.id === Number(id)); return o ? { ...o, benefits } : null; },
    getEmployer: () => employer,
    getBreakdown: (score) => WEIGHTS.map(([label, weight, d]) => ({ label, weight, value: Math.max(0, Math.min(100, score + d)) })),
  };
})();
