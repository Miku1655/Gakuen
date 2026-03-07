// ============================================================================
// EXPANSION DATA
// New jobs, events, investments, achievements, NPCs, training types
// ============================================================================

// ============================================================================
// NEW JOBS (merged into JOBS_DATA at init)
// ============================================================================

const JOBS_DATA_EXPANSION = {
    tutor: {
        name: "Korepetycje",
        baseIncome: 8000,
        risk: 5,
        requiredLewdness: 0,
        requiredSkills: { conversation: 30 },
        description: "Prywatne lekcje dla zamożnych uczniów. Legalna przykrywka. Wymagania: Conversation 30+",
        coverJob: true  // flagged as a "cover" job — lowers suspicion passively
    },
    photography: {
        name: "Sesje Fotograficzne",
        baseIncome: 20000,
        risk: 20,
        requiredLewdness: 30,
        requiredSkills: { conversation: 35 },
        description: "Artystyczne zdjęcia dla klientów premium. Wymagania: Lewdness 30+, Conversation 35+"
    },
    escort_luxury: {
        name: "Eskorta Luksusowa",
        baseIncome: 45000,
        risk: 55,
        requiredLewdness: 60,
        requiredSkills: { conversation: 55, handjob: 45 },
        description: "Towarzyszenie na galach i kolacjach. Wymagania: Lewdness 60+, Conversation 55+, Handjob 45+"
    }
};

// ============================================================================
// NPC DEFINITIONS
// Named recurring characters with relationship tracking
// ============================================================================

const NPC_DATA = {
    takeshi: {
        name: "Takeshi Yamaguchi",
        role: "Szef Klanu Yamaguchi",
        description: "Spokojny, ale śmiertelnie niebezpieczny. Widzi w tobie potencjał — albo cel.",
        initialRelationship: 0,   // -100 to 100
        portrait: "🩸"
    },
    kenji: {
        name: "Det. Kenji Mori",
        role: "Detektyw Wydziału Moralności",
        description: "Doświadczony policjant, który wie więcej niż mówi. Można go przekupić — ale to ryzyko.",
        initialRelationship: -10,
        portrait: "🔍"
    },
    hiroko: {
        name: "Madame Hiroko",
        role: "Właścicielka 'Club Crimson'",
        description: "Twoja główna rywalka. Prowadzi konkurencyjny klub w Roppongi. Elegancka, bezwzględna.",
        initialRelationship: -20,
        portrait: "🌹"
    },
    counselor: {
        name: "Pani Fujimoto",
        role: "Szkolna Pedagog",
        description: "Podejrzewa, że coś jest nie tak. Na razie milczy — ale węszy.",
        initialRelationship: 0,
        portrait: "📋"
    }
};

// ============================================================================
// RELATIONSHIP LEVELS
// ============================================================================

const RELATIONSHIP_LEVELS = [
    { threshold: -100, label: "Wróg",         color: "#e74c3c" },
    { threshold:  -50, label: "Podejrzliwy",  color: "#e67e22" },
    { threshold:  -20, label: "Nieufny",      color: "#f39c12" },
    { threshold:   10, label: "Neutralny",    color: "#95a5a6" },
    { threshold:   30, label: "Znajomy",      color: "#3498db" },
    { threshold:   60, label: "Sprzymierzony",color: "#27ae60" },
    { threshold:  100, label: "Zaufany",      color: "#2ecc71" }
];

// ============================================================================
// GIRL RELATIONSHIP LEVELS
// Per-girl bond with the player
// ============================================================================

const GIRL_BOND_LEVELS = [
    { threshold:   0, label: "Nieznajoma",  icon: "👤" },
    { threshold:  20, label: "Pracownica",  icon: "💼" },
    { threshold:  40, label: "Znajoma",     icon: "🤝" },
    { threshold:  60, label: "Przyjaciółka",icon: "💛" },
    { threshold:  75, label: "Bliska",      icon: "💗" },
    { threshold:  90, label: "Oddana",      icon: "💖" }
];

// ============================================================================
// TARGETED TRAINING OPTIONS
// Player can now choose WHICH skill to train
// ============================================================================

const TRAINING_OPTIONS = [
    {
        id: "train_lewdness",
        name: "Trening Ogólny",
        description: "Zwiększa Lewdness i losowy skill",
        cost: 15000,
        effects: { lewdness: [8, 12], randomSkill: [3, 5], morale: -3 }
    },
    {
        id: "train_conversation",
        name: "Lekcje Konwersacji",
        description: "Zwiększa Conversation i Grades",
        cost: 10000,
        effects: { skills: { conversation: [5, 10] }, grades: [2, 4], morale: -1 }
    },
    {
        id: "train_intimacy",
        name: "Trening Intymny",
        description: "Zwiększa Handjob, Blowjob i Lewdness",
        cost: 20000,
        effects: { lewdness: [5, 8], skills: { handjob: [6, 10], blowjob: [4, 8] }, morale: -5 },
        requiredLewdness: 20
    },
    {
        id: "train_advanced",
        name: "Zaawansowany Trening",
        description: "Zwiększa Vaginal, Anal i Lewdness znacząco",
        cost: 35000,
        effects: { lewdness: [8, 12], skills: { vaginal: [6, 10], anal: [4, 7], feet: [3, 6] }, morale: -8 },
        requiredLewdness: 50
    },
    {
        id: "train_morale",
        name: "Dzień Relaksu",
        description: "Zwiększa Morale i Lojalność. Brak postępu umiejętności.",
        cost: 8000,
        effects: { morale: [15, 25], loyalty: [5, 10] }
    }
];

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

const ACHIEVEMENTS_DATA = [
    // --- Money ---
    { id: "first_100k",   title: "Pierwsze ¥100k",        desc: "Zgromadź ¥100,000",         icon: "💴", condition: (s) => s.money >= 100000 },
    { id: "millionaire",  title: "Milioner",               desc: "Zgromadź ¥1,000,000",       icon: "💰", condition: (s) => s.money >= 1000000 },
    { id: "debt_free",    title: "Wolny od Długów",        desc: "Spłać cały dług",            icon: "🎉", condition: (s) => s.debt <= 0 },
    { id: "ten_million",  title: "Mag Finansów",           desc: "Zgromadź ¥10,000,000",      icon: "👑", condition: (s) => s.money >= 10000000 },

    // --- Girls ---
    { id: "five_girls",   title: "Mały Harem",             desc: "Zatrudnij 5 dziewczyn",      icon: "👯", condition: (s) => s.girls.length >= 5 },
    { id: "ten_girls",    title: "Cesarska Świta",         desc: "Zatrudnij 10 dziewczyn",     icon: "🌸", condition: (s) => s.girls.length >= 10 },
    { id: "devoted_girl", title: "Wierne Serce",           desc: "Dziewczyna osiąga Lojalność 100", icon: "💖", condition: (s) => s.girls.some(g => g.loyalty >= 100) },
    { id: "master_girl",  title: "Pełna Lewdness",         desc: "Dziewczyna osiąga Lewdness 100", icon: "🔥", condition: (s) => s.girls.some(g => g.lewdness >= 100) },

    // --- Business ---
    { id: "first_job",    title: "Pierwsze Zlecenie",      desc: "Przypisz dziewczynę do pracy", icon: "📋", condition: (s) => s.girls.some(g => g.currentJob !== 'none') },
    { id: "yakuza_ally",  title: "Sojusznik Podziemia",    desc: "Zdobądź ochronę Yakuzy",    icon: "🩸", condition: (s) => s.yakuzaProtection },
    { id: "all_jobs",     title: "Pełna Oferta",           desc: "Odblokuj wszystkie rodzaje pracy", icon: "🏆", condition: (s) => ['hostess','delivery','soapland','vip'].every(j => s.unlockedJobs.includes(j)) },
    { id: "vip_club",     title: "Szczyt Kariery",         desc: "Otwórz Usługi VIP",          icon: "💎", condition: (s) => s.unlockedJobs.includes('vip') },

    // --- Reputation & Risk ---
    { id: "famous",       title: "Sławny Dyrektor",        desc: "Osiągnij Reputację 70",      icon: "⭐", condition: (s) => s.reputation >= 70 },
    { id: "legendary",    title: "Legenda Tokio",          desc: "Osiągnij Reputację 100",     icon: "🌟", condition: (s) => s.reputation >= 100 },
    { id: "untouchable",  title: "Nietykalny",             desc: "Zmniejsz Ryzyko do 0",       icon: "🛡️", condition: (s) => s.risk <= 0 },

    // --- Time ---
    { id: "one_year",     title: "Jeden Rok",              desc: "Przetrwaj rok szkolny",      icon: "📅", condition: (s) => s.time.year > 2025 || (s.time.year === 2025 && s.time.month >= 12) },
    { id: "investor",     title: "Inwestor Szkolny",       desc: "Kup wszystkie inwestycje",   icon: "🏫", condition: (s) => SCHOOL_INVESTMENTS.every(i => s.purchasedInvestments.includes(i.id)) },
];

// ============================================================================
// NEW SCHOOL INVESTMENTS (merged at init)
// ============================================================================

const SCHOOL_INVESTMENTS_EXPANSION = [
    {
        id: "photo_studio",
        name: "Atelier Fotograficzne",
        cost: 400000,
        effects: { reputation: 12, unlocksJob: "photography" },
        description: "Profesjonalne studio. Odblokowuje Sesje Fotograficzne. +12 reputacji."
    },
    {
        id: "private_lounge",
        name: "Prywatny Salon VIP",
        cost: 800000,
        effects: { reputation: 15, risk: -8 },
        description: "Ekskluzywny salon dla klientów premium. +15 reputacji, -8 ryzyko."
    },
    {
        id: "underground_exit",
        name: "Tajne Wyjście",
        cost: 600000,
        effects: { risk: -20 },
        description: "Na wypadek nalotu. -20 ryzyko."
    },
    {
        id: "wellness_center",
        name: "Centrum Wellness",
        cost: 350000,
        effects: { morale: 20, loyalty: 10 },
        description: "Sauna i gabinety relaksu dla dziewczyn. +20 morale, +10 lojalność wszystkim."
    },
    {
        id: "fake_curriculum",
        name: "Fałszywy Program Nauczania",
        cost: 200000,
        effects: { reputation: 6, risk: -12 },
        description: "Oficjalna dokumentacja szkolna dla inspektorów. -12 ryzyko, +6 reputacji."
    }
];

// ============================================================================
// EXPANDED BACKSTORIES (merged with existing BACKSTORIES)
// ============================================================================

const BACKSTORIES_EXPANSION = {
    "Wesoła i figlarna": [
        "Na zewnątrz zawsze uśmiechnięta, w środku ukrywa strach przed przyszłością.",
        "Jej rodzice się rozwodzą. Praca daje jej poczucie kontroli nad własnym życiem.",
        "Marzenie o karierze idolki rozbite przez agencję. Szuka nowego startu."
    ],
    "Skryta i mroczna": [
        "Hikikomori przez dwa lata. Wyszła z domu tylko dla pieniędzy na figury.",
        "Córka byłego yakuzy. Zna ten świat lepiej, niż pokazuje.",
        "Pisze dark fiction online. Traktuje tę pracę jak materiał do pisania."
    ],
    "Tsundere": [
        "Zawsze musiała być najlepsza. Dług rodzinny zmusił ją do kompromisu z dumą.",
        "Były chłopak zdradzał ją wielokrotnie. Nie ufa już mężczyznom — ale potrzebuje kasy.",
        "Córka policjanta. Ironia nie jest jej obca."
    ],
    "Łagodna i opiekuńcza": [
        "Wychowywała młodsze rodzeństwo od 12. roku życia. Matka jest chora.",
        "Chce zostać pielęgniarką, ale studia kosztują. To jedyna droga.",
        "Już raz komuś pomogła i sama wpadła w tarapaty. Teraz stara się wyjść."
    ],
    "Energetyczna sportsmenka": [
        "Kontuzja zniszczyła jej karierę lekkoatletyczną. Musi płacić za rehabilitację.",
        "Stypendium sportowe cofnięte po skandalu z trenerem. Szuka zemsty przez niezależność.",
        "Reprezentacja szkoły w kendo. Nikt nie wie o tej stronie jej życia."
    ],
    "Inteligentna perfekcjonistka": [
        "Dostała się na Todai, ale czesne jest zbyt wysokie. To tymczasowe — tak sobie wmawia.",
        "Oblała jeden egzamin i straciła stypendium. Teraz jest 'tymczasowo tu'.",
        "Planuje to wszystko w arkuszu kalkulacyjnym. Cel: ¥3M w 18 miesięcy."
    ]
};

// ============================================================================
// EXPANSION EVENTS
// ============================================================================

const EVENTS_DATA_EXPANSION = [

    // ========================================================================
    // NPC ARC: TAKESHI (Yakuza lore deepening)
    // ========================================================================
    {
        id: "takeshi_visit_1",
        title: "Wizyta Takeshiego",
        description: "Takeshi Yamaguchi wchodzi bez pukania i siada naprzeciwko ciebie.\n\n\"Moje interesy w Roppongi mają... problem. Potrzebuję twoich dziewczyn na jeden wieczór. Dyskretnie.\"\n\nTo nie jest prośba.",
        conditions: { yakuza: true, minMoney: 200000, minGirls: 3 },
        chance: 8,
        oneTime: true,
        choices: [
            {
                text: "Zgódź się (relacja z Takeshim +20, risk -10)",
                effects: { money: 80000, risk: -10, customLog: { message: "Takeshi jest zadowolony. Przysługa odwzajemniona.", type: "event" } },
                npcEffect: { npc: "takeshi", value: 20 },
                followUpText: "\"Wiedziałem, że można na tobie polegać.\" Zostawia kopertę.",
                showAlert: true
            },
            {
                text: "Odmów – zbyt ryzykowne",
                effects: { risk: 5 },
                npcEffect: { npc: "takeshi", value: -15 },
                followUpText: "Takeshi wstaje powoli. \"Rozumiem. Ale pamiętaj — przysługi mają datę ważności.\"",
                showAlert: true
            }
        ]
    },
    {
        id: "takeshi_favor",
        title: "Przysługa Takeshiego",
        description: "Telefon od Takeshiego.\n\n\"Pamiętasz tamten wieczór? Jeden z moich ludzi ma kłopoty z detektywem Morim. Potrzebuję, żebyś dostarczył mu... rozrywkę. Jeden wieczór. Mori lubi towarzystwo.\"\n\nTo może zneutralizować policyjne śledztwo.",
        conditions: { yakuza: true, minRisk: 40 },
        chance: 12,
        oneTime: true,
        completedEvent: "takeshi_visit_1",
        choices: [
            {
                text: "Zorganizuj spotkanie z Morim (-¥20k, risk -25, kenji +rel)",
                cost: 20000,
                effects: { risk: -25 },
                npcEffect: { npc: "kenji", value: 30 },
                followUpText: "Detektyw Mori jest 'zadowolony'. Śledztwo zostaje wstrzymane.",
                showAlert: true
            },
            {
                text: "Odmów – to za daleko",
                effects: { risk: 10 },
                npcEffect: { npc: "takeshi", value: -10 },
                followUpText: "Takeshi kiwa głową. \"Szkoda. Zapłacisz inaczej.\"",
                showAlert: true
            }
        ]
    },
    {
        id: "takeshi_war",
        title: "Wojna Klanów",
        description: "Takeshi dzwoni o 3 w nocy.\n\n\"Mamy wojnę z klanem Suzuki. Potrzebuję twojego lokalu jako punktu spotkań przez tydzień. W zamian — podatek spada do 5%.\"\n\nW tle słyszysz krzyki.",
        conditions: { yakuza: true, minGirls: 4 },
        chance: 6,
        oneTime: true,
        choices: [
            {
                text: "Zgódź się (podatek 5%, relacja +25, risk +30 na tydzień)",
                effects: { profitTax: 5, risk: 30 },
                npcEffect: { npc: "takeshi", value: 25 },
                followUpText: "Tydzień napięcia. Ale Takeshi słowa dotrzymuje. Podatek spada.",
                showAlert: true
            },
            {
                text: "Odmów i zaoferuj pieniądze (-¥300k)",
                cost: 300000,
                effects: { risk: 10 },
                npcEffect: { npc: "takeshi", value: -5 },
                followUpText: "Takeshi bierze pieniądze. \"Tym razem.\"",
                showAlert: true
            },
            {
                text: "Zgłoś się do rywala – klanu Suzuki",
                effects: { yakuzaProtection: false, profitTax: 0, risk: 40, reputation: -15 },
                npcEffect: { npc: "takeshi", value: -80 },
                followUpText: "⚠️ Zerwacie z Yamaguchi. Klanu Suzuki oferta ochrony jest tańsza, ale Takeshi się nie zapomina...",
                showAlert: true
            }
        ]
    },

    // ========================================================================
    // NPC ARC: DETECTIVE MORI
    // ========================================================================
    {
        id: "detective_visit",
        title: "Wizyta Detektywa",
        description: "Det. Kenji Mori wchodzi do twojego biura w godzinach szkolnych.\n\nJest spokojny. Za spokojny.\n\n\"Dyrektor? Dostaliśmy kilka... interesujących zgłoszeń dotyczących uczennic tej szkoły. Rutynowa wizyta.\"\n\nSzkoli wzrokiem biurko.",
        conditions: { minRisk: 45, minGirls: 2 },
        chance: 10,
        cooldown: 240,
        choices: [
            {
                text: "Zaproś na herbatę. Bądź spokojny i uprzejmy.",
                effects: { risk: -10, reputation: -5 },
                npcEffect: { npc: "kenji", value: 5 },
                followUpText: "Odchodzi z niczym. \"Sympatyczne miejsce.\" Ale na pewno wróci.",
                showAlert: true
            },
            {
                text: "Przekup go (-¥150k, risk -20)",
                cost: 150000,
                effects: { risk: -20 },
                npcEffect: { npc: "kenji", value: 20 },
                followUpText: "Mori patrzy na kopertę. Chwila ciszy. Wkłada do kieszeni. \"Miły dzień.\"",
                showAlert: true
            },
            {
                text: "Zadzwoń do Takeshiego – niech go 'wystraszy'",
                conditions: { yakuza: true },
                effects: { risk: -15 },
                npcEffect: { npc: "kenji", value: -30 },
                followUpText: "Mori wychodzi szybciej niż wszedł. Ale teraz cię nienawidzi.",
                showAlert: true
            }
        ]
    },
    {
        id: "police_raid_actual",
        title: "NALOT POLICJI",
        description: "🚨 Alarm!\n\nCztery radiowozy przed szkołą. Detektyw Mori wchodzi z nakazem.\n\n\"W imieniu wydziału moralności — mamy nakaz przeszukania.\"\n\nMasz może 3 minuty zanim wejdą na górę.",
        conditions: { minRisk: 80 },
        chance: 25,
        cooldown: 500,
        choices: [
            {
                text: "Aktywuj protokół awaryjny (wymaga: Tajne Wyjście)",
                requirements: { investment: "underground_exit" },
                effects: { risk: -40, money: -100000 },
                npcEffect: { npc: "kenji", value: -20 },
                followUpText: "Dziewczyny wychodzą przez tylne wyjście. Mori nic nie znajduje. Jest wściekły.",
                showAlert: true
            },
            {
                text: "Przekup inspekcję (-¥500k, -risk)",
                cost: 500000,
                effects: { risk: -35, reputation: -10 },
                npcEffect: { npc: "kenji", value: 15 },
                followUpText: "Mori patrzy na kwotę. \"Coraz drożej, Dyrektorze.\" Wychodzi.",
                showAlert: true
            },
            {
                text: "Nic nie rób — masz dobrą legendę (wymaga rep 60+)",
                requirements: { minReputation: 60 },
                effects: { risk: -15 },
                followUpText: "Szkoła wygląda wzorowo. Mori nie może nic udowodnić. Odchodzi z niczym.",
                showAlert: true
            },
            {
                text: "Nie jesteś gotowy... (kary)",
                effects: { risk: 5, reputation: -20, money: -200000, morale: -20 },
                followUpText: "⚠️ Kilka dziewczyn zatrzymanych na przesłuchanie. Kary administracyjne. Skandal w mediach lokalnych.",
                showAlert: true
            }
        ]
    },

    // ========================================================================
    // NPC ARC: MADAME HIROKO (rival)
    // ========================================================================
    {
        id: "rival_introduction",
        title: "Madame Hiroko",
        description: "Na twoje biurko trafia elegancka wizytówka z różowym atramentem:\n\n'Club Crimson — Roppongi\nMadame Hiroko'\n\nNa odwrocie odręcznie: 'Słyszałam o Seiran Academy. Może czas porozmawiać?'",
        conditions: { minReputation: 35, minGirls: 3 },
        chance: 15,
        oneTime: true,
        choices: [
            {
                text: "Zadzwoń i umów spotkanie",
                effects: { reputation: 5 },
                npcEffect: { npc: "hiroko", value: 10 },
                followUpText: "Hiroko jest miła i bezpośrednia. 'Tokio jest duże. Nie musimy być wrogami.'",
                showAlert: true
            },
            {
                text: "Wyrzuć wizytówkę",
                effects: {},
                npcEffect: { npc: "hiroko", value: -10 },
                followUpText: "Miesiąc później Hiroko podbiera ci klienta. Tak się zaczyna.",
                showAlert: true
            }
        ]
    },
    {
        id: "rival_sabotage",
        title: "Sabotaż od Hiroko",
        description: "Jedna z twoich dziewczyn przychodzi przestraszona.\n\n\"Ktoś rozmawiał z moją mamą. Pokazał jej... zdjęcia. Powiedział, że dostanie więcej, jeśli mama pójdzie na policję.\"\n\nTo robota Hiroko. Klasyczna zagrywka.",
        conditions: { minGirls: 2 },
        chance: 8,
        cooldown: 300,
        targetRandomGirl: true,
        choices: [
            {
                text: "Zaopiekuj się rodziną dziewczyny (-¥100k, +loyalty)",
                cost: 100000,
                effects: { loyalty: 25, morale: 20 },
                npcEffect: { npc: "hiroko", value: -5 },
                followUpText: "Rodzina uspokojona. Dziewczyna jest ci wdzięczna. Hiroko próbuje dalej.",
                showAlert: true
            },
            {
                text: "Odpowiedz tym samym – zeprzyj szantaż na Hiroko",
                effects: { risk: 15 },
                npcEffect: { npc: "hiroko", value: -25 },
                followUpText: "Madame Hiroko dostaje smak własnej medycyny. Ale walka się eskaluje.",
                showAlert: true
            },
            {
                text: "Zaproponuj Hiroko rozejm (-¥200k, koniec wrogości)",
                cost: 200000,
                effects: { risk: -10, reputation: 5 },
                npcEffect: { npc: "hiroko", value: 30 },
                followUpText: "Hiroko przyjmuje. Przez chwilę. Ale przynajmniej macie spokój.",
                showAlert: true
            }
        ]
    },
    {
        id: "rival_alliance",
        title: "Sojusz z Club Crimson",
        description: "Hiroko dzwoni z nieoczekiwaną propozycją.\n\n\"Klien VIP szuka doświadczeń z obu naszych placówek. Wspólna impreza — Seiran i Club Crimson. Pół na pół.\"\n\nTo ogromna okazja. Albo pułapka.",
        conditions: { minReputation: 55, minGirls: 4 },
        chance: 10,
        oneTime: true,
        choices: [
            {
                text: "Przyjmij propozycję (+dużo ¥, +rep)",
                effects: { money: 300000, reputation: 15, risk: 10 },
                npcEffect: { npc: "hiroko", value: 25 },
                followUpText: "Impreza to sukces. Hiroko jest... prawie serdeczna. ¥300k na stole.",
                showAlert: true
            },
            {
                text: "Odmów — nie ufasz jej",
                effects: { reputation: -5 },
                npcEffect: { npc: "hiroko", value: -15 },
                followUpText: "Hiroko wzrusza ramionami. 'Szkoda. Następnym razem może nie będę tak uprzejma.'",
                showAlert: true
            }
        ]
    },

    // ========================================================================
    // GIRL PERSONAL ARCS
    // ========================================================================
    {
        id: "girl_confession",
        title: "Wyznanie",
        templateDescription: "{girlName} czeka na ciebie wieczorem w pustym korytarzu.\n\nJest blada. Trochę drży.\n\n\"Muszę ci powiedzieć... Chyba... Chyba cię lubię. Naprawdę. Przepraszam, wiem, że to nieprofesjonalne.\"\n\nPatrzy w podłogę.",
        chance: 3,
        cooldown: 500,
        targetRandomGirl: true,
        girlConditions: { minLoyalty: 75, minMorale: 65 },
        choices: [
            {
                text: "Odpowiedz łagodnie, ale zachowaj dystans",
                effects: { loyalty: 10, morale: 5 },
                followUpText: "Kiwa głową ze łzami. 'Rozumiem... Dziękuję za szczerość.' Zostaje.",
                showAlert: true
            },
            {
                text: "Zignoruj i wróć do biznesu",
                effects: { loyalty: -15, morale: -20 },
                followUpText: "Coś w niej gaśnie. Nadal pracuje, ale jest daleko.",
                showAlert: true
            },
            {
                text: "Odwzajemnij — obiecaj wyjątkowe traktowanie",
                effects: { loyalty: 20, morale: 15, lewdness: 5 },
                followUpText: "Uśmiecha się przez łzy. To zacieśnia więź — ale też komplikuje sprawy.",
                showAlert: true
            }
        ]
    },
    {
        id: "girl_family_crisis",
        title: "Kryzys Rodzinny",
        templateDescription: "{girlName} dostaje telefon w trakcie pracy.\n\nBiałoniebieski, drżący głos:\n\"Tata miał wypadek. Szpital.\"\n\nPatrzy na ciebie z prośbą w oczach.",
        chance: 4,
        cooldown: 300,
        targetRandomGirl: true,
        choices: [
            {
                text: "Opłać szpital i daj tydzień wolnego (-¥80k)",
                cost: 80000,
                effects: { loyalty: 30, morale: 25 },
                followUpText: "Dziewczyna wraca po tygodniu. Patrzy na ciebie inaczej niż wcześniej.",
                showAlert: true
            },
            {
                text: "Daj dzień wolny – bez zapłaty",
                effects: { loyalty: 10, morale: 10 },
                followUpText: "Dziękuje i wybiega. Wróci, ale rachunki jej rodziny nie znikną.",
                showAlert: true
            },
            {
                text: "Każ jej zostać — to nie twój problem",
                effects: { loyalty: -25, morale: -30, risk: 5 },
                followUpText: "Idzie. Może nie wróci.",
                showAlert: true
            }
        ]
    },
    {
        id: "girl_graduation_threat",
        title: "Groźba Wykreślenia",
        templateDescription: "Wychowawca informuje: {girlName} ma zbyt wiele nieobecności.\n\nJeśli nic się nie zmieni, zostanie wykreślona z listy uczniów.\n\nUczennica przychodzi do ciebie przerażona:\n\"Jeśli mnie wyrzucą ze szkoły... rodzice się dowiedzą wszystkiego.\"",
        chance: 5,
        cooldown: 200,
        targetRandomGirl: true,
        girlConditions: { minLewdness: 30 },
        choices: [
            {
                text: "Przekup wychowawcę (-¥50k, problem znika)",
                cost: 50000,
                effects: { risk: 8, loyalty: 15 },
                followUpText: "Wychowawca 'traci' dokumenty. Problem rozwiązany do przyszłego semestru.",
                showAlert: true
            },
            {
                text: "Daj jej czas na nadrobienie zaległości",
                effects: { loyalty: 5, morale: 10, money: -20000 },
                followUpText: "Tydzień przerwy od pracy. Oceny idą w górę. Dziewczyna jest wdzięczna.",
                showAlert: true
            },
            {
                text: "Zignoruj — uczennica poradzi sobie sama",
                effects: { loyalty: -10, morale: -15, risk: 12 },
                followUpText: "Dostaje ostrzeżenie oficjalne. Rodzice są niedaleko...",
                showAlert: true
            }
        ]
    },
    {
        id: "girl_burnout",
        title: "Wypalenie",
        templateDescription: "{girlName} siedzi nieruchomo w gabinecie.\n\nNie płacze. Nie mówi. Tylko patrzy w okno.\n\nKiedy do niej mówisz, mija długa chwila zanim odpowie:\n\n\"Nie czuję już nic. To chyba dobrze, nie?\"\n\nJest wypalona.",
        chance: 4,
        cooldown: 200,
        targetRandomGirl: true,
        girlConditions: { maxMorale: 20, minLewdness: 40 },
        choices: [
            {
                text: "Wyślij na tygodniowy urlop (-¥40k)",
                cost: 40000,
                effects: { morale: 40, loyalty: 15 },
                followUpText: "Wraca z kolorem w oczach. 'Dziękuję. Potrzebowałam tego.'",
                showAlert: true
            },
            {
                text: "Zmniejsz jej obciążenie pracą",
                effects: { morale: 20, loyalty: 10, money: -15000 },
                followUpText: "Powoli wraca do siebie. Mniej zarabia, ale wciąż jest tu.",
                showAlert: true
            },
            {
                text: "Powiedz, że to przejdzie — push forward",
                effects: { morale: -15, loyalty: -20, risk: 8 },
                followUpText: "Patrzy na ciebie przez chwilę. Wstaje. I wychodzi z budynku.",
                showAlert: true
            }
        ]
    },

    // ========================================================================
    // SEASONAL EVENTS
    // ========================================================================
    {
        id: "cherry_blossom",
        title: "Hanami – Festiwal Wiśni",
        description: "Wiosna. Parki Tokio pokryte różowymi płatkami.\n\nDziewczyny proszą o wspólne hanami — piknik pod wiśniami.\n\n\"Raz w roku, Dyrektorze. Proszę.\"",
        conditions: { minGirls: 2 },
        chance: 60,
        cooldown: 700,
        choices: [
            {
                text: "Zorganizuj wielki piknik (-¥30k)",
                cost: 30000,
                effects: { morale: 25, loyalty: 15, reputation: 5 },
                followUpText: "Jeden z lepszych dni tego roku. Wszyscy zapominają na chwilę.",
                showAlert: true
            },
            {
                text: "Wyjdź na godzinę, potem wróćcie do pracy",
                effects: { morale: 10, loyalty: 5 },
                followUpText: "Krótkie, ale miłe. Dziewczyny doceniają gest.",
                showAlert: true
            },
            {
                text: "Nie ma czasu na sentymenty",
                effects: { morale: -5, loyalty: -5 },
                followUpText: "Rozumieją. Ale coś drobnego ginie.",
                showAlert: true
            }
        ]
    },
    {
        id: "summer_festival",
        title: "Matsuri – Letni Festiwal",
        description: "Wielki festiwal Obon w dzielnicy.\n\nTłumy, fajerwerki, yukata.\n\nTo też okazja biznesowa: klienci w nastroju wydawania pieniędzy.",
        conditions: { minGirls: 2 },
        chance: 30,
        cooldown: 700,
        choices: [
            {
                text: "Wyślij dziewczyny w yukata — pokaz dyskretny (-¥50k, +dużo ¥)",
                cost: 50000,
                effects: { money: 120000, reputation: 10, morale: 10, risk: 8 },
                followUpText: "Wieczór przynosi nieoczekiwane zyski. Klienci są zafascynowani.",
                showAlert: true
            },
            {
                text: "Idźcie razem — czas wolny dla wszystkich",
                effects: { morale: 20, loyalty: 10 },
                followUpText: "Fajerwerki, smaży się takoyaki, śmiech. Dobry wieczór.",
                showAlert: true
            },
            {
                text: "Zostańcie w szkole, pracujcie",
                effects: { morale: -10, loyalty: -8, money: 30000 },
                followUpText: "Nieliczne klientki odwiedziły was wieczorem. Dziewczyny jednak zazdroszczą tym na festiwalu.",
                showAlert: true
            }
        ]
    },
    {
        id: "new_year",
        title: "Shinnen – Nowy Rok",
        description: "Sylwester w Tokio.\n\nDzwony świątynne, otoshidama, shogatsu.\n\nDziewczyny czekają na twoje słowo. Rok się skończył. Dobry czy zły — był twój.",
        conditions: { minGirls: 1 },
        chance: 80,
        cooldown: 720,
        choices: [
            {
                text: "Premie noworoczne dla wszystkich (-¥100k)",
                cost: 100000,
                effects: { morale: 30, loyalty: 20, reputation: 8 },
                followUpText: "Każda dostaje kopertę z otoshidama. Nowy rok zaczyna się dobrze.",
                showAlert: true
            },
            {
                text: "Złóż życzenia i zaplanuj kolejny rok",
                effects: { morale: 10, loyalty: 5 },
                followUpText: "Proste słowa. Wystarczające.",
                showAlert: true
            },
            {
                text: "To tylko kolejna noc — pracujcie",
                effects: { morale: -15, loyalty: -10, money: 50000 },
                followUpText: "Klienci się trafili. Dziewczyny nie zapomnią.",
                showAlert: true
            }
        ]
    },

    // ========================================================================
    // BUSINESS EVENTS (deeper strategy)
    // ========================================================================
    {
        id: "journalist_sniffing",
        title: "Dziennikarz na Tropie",
        description: "Studentka z lokalnej gazety pojawia się przed szkołą z notatnikiem.\n\n\"Piszę reportaż o prywatnych akademiach w Tokio. Mogę wejść?\"\n\nJej oczy są zbyt uważne na zwykłą dziennikarkę.",
        conditions: { minRisk: 35, minGirls: 2 },
        chance: 12,
        cooldown: 300,
        choices: [
            {
                text: "Pokaż szkołę — bądź otwarty i spokojny",
                effects: { risk: -5, reputation: 5 },
                npcEffect: { npc: "kenji", value: -5 },
                followUpText: "Artykuł opisuje szkołę jako 'wzorcową inicjatywę edukacyjną'. Nieźle.",
                showAlert: true
            },
            {
                text: "Odmów – powołaj się na prywatność",
                effects: { risk: 5, reputation: -8 },
                followUpText: "Pisze o 'tajemniczej akademii, która odmawia rozmów'. Gorzej.",
                showAlert: true
            },
            {
                text: "Zaproponuj wywiad z dyrektorem przy herbacie (-¥10k)",
                cost: 10000,
                effects: { risk: -10, reputation: 12 },
                followUpText: "Artykuł jest entuzjastyczny. Nowe zapytania od rodziców uczennic.",
                showAlert: true
            }
        ]
    },
    {
        id: "loan_shark",
        title: "Lichwiar",
        description: "Mężczyzna w zbyt drogim garniturze zostawia wizytówkę.\n\n'Pożyczki dla ambitnych — Suzuki Finance. 0% przez 30 dni.'\n\nPodejrzane, ale ¥3M natychmiast brzmi kusząco.",
        conditions: { minDebt: 1000000 },
        chance: 5,
        cooldown: 400,
        choices: [
            {
                text: "Pożycz ¥3M (bardzo wysoki procent)",
                effects: { money: 3000000, debt: 2000000, risk: 15 },
                followUpText: "Pieniądze na koncie. Ale lichwiar wróci — z odsetkami 80% rocznie.",
                showAlert: true
            },
            {
                text: "Odrzuć – to pułapka",
                effects: {},
                followUpText: "Mądrze. Klanu Suzuki nie chcesz znać.",
                showAlert: true
            }
        ]
    },
    {
        id: "mysterious_client",
        title: "Tajemniczy Klient",
        description: "Mężczyzna w masce noh przychodzi osobiście.\n\n\"Słyszałem o was od ludzi, którym ufam. Mam specjalne życzenia i... nieograniczony budżet.\"\n\nZostawia zaliczkę ¥500k na biurku.\n\nKto to jest?",
        conditions: { minReputation: 60, minGirls: 4 },
        chance: 3,
        oneTime: true,
        choices: [
            {
                text: "Przyjmij zlecenie (ogromne ¥, nieznane ryzyko)",
                effects: { money: 500000, risk: 20 },
                followUpText: "Wieczór mija bez incydentów. Klient płaci drugie ¥500k przy wyjściu. Nie mówi ani słowa.",
                showAlert: true
            },
            {
                text: "Odmów – zbyt podejrzane",
                effects: { reputation: 5 },
                followUpText: "Mężczyzna kiwa głową z szacunkiem. 'Roztropność. Dobra cecha.' Wychodzi.",
                showAlert: true
            },
            {
                text: "Zapytaj Takeshiego, kto to jest",
                conditions: { yakuza: true },
                effects: {},
                npcEffect: { npc: "takeshi", value: 5 },
                followUpText: "Takeshi milczy przez chwilę. 'Człowiek z północy. Lepiej go obsłużyć dobrze.' Kropka.",
                showAlert: true
            }
        ]
    },
    {
        id: "school_inspector",
        title: "Inspekcja Kuratorium",
        description: "Oficjalny list z Ministerstwa Edukacji:\n\n'Rutynowa inspekcja Seiran Academy — za trzy dni.'\n\nPrzy niskich ocenach lub złej reputacji szkoła może zostać zamknięta.",
        conditions: { minGirls: 2 },
        chance: 8,
        cooldown: 350,
        choices: [
            {
                text: "Przygotuj dokumentację i przeprowadź próbne lekcje (-¥30k)",
                cost: 30000,
                effects: { reputation: 10, risk: -5, grades: 5 },
                followUpText: "Inspekcja: 'Wzorowa placówka.' Certyfikat jakości na ścianie.",
                showAlert: true
            },
            {
                text: "Przekup inspektora (-¥100k)",
                cost: 100000,
                effects: { risk: -10 },
                npcEffect: { npc: "kenji", value: -10 },
                followUpText: "Inspektor jest zadowolony w milczeniu. Odchodzi z walizką.",
                showAlert: true
            },
            {
                text: "Nic nie rób — ryzykuj",
                effects: { risk: 15, reputation: -10 },
                followUpText: "Inspektor kreśli uwagi. Kolejna inspekcja za miesiąc. Gorzej.",
                showAlert: true
            }
        ]
    },

    // ========================================================================
    // TUTOR / COVER JOB EVENTS
    // ========================================================================
    {
        id: "tutor_client_rich",
        title: "Zamożny Uczeń",
        templateDescription: "{girlName} wraca z korepetycji z dziwną miną.\n\n\"Ten chłopak... On wie. Domyślił się, czym naprawdę się zajmuję.\"\n\nOna jest spokojna. Ale niepokojna jednocześnie.\n\n\"Zaproponował mi 'dodatkowe lekcje'. Za dużo pieniędzy.\"",
        conditions: { minGirls: 1 },
        chance: 6,
        cooldown: 150,
        targetJob: "tutor",
        choices: [
            {
                text: "Zgódź się — to okazja (+lewdness, +dużo ¥)",
                effects: { money: 40000, lewdness: 8, loyalty: -5, risk: 10 },
                followUpText: "Wraca z pieniędzmi. I z milczeniem, które coś mówi.",
                showAlert: true
            },
            {
                text: "Odmów — niech trzyma przykrywkę",
                effects: { loyalty: 10, morale: 5 },
                followUpText: "Kiwa głową z ulgą. Korepetycje trwają dalej — czysto.",
                showAlert: true
            }
        ]
    },

    // ========================================================================
    // PHOTOGRAPHY JOB EVENTS
    // ========================================================================
    {
        id: "photography_leaked",
        title: "Wyciek Zdjęć",
        templateDescription: "Zdjęcia {girlName} z sesji pojawiają się online bez zgody.\n\nKtoś ze studia je sprzedał — albo sam klient.\n\nDziewczyna jest w panice. Reputacja szkoły jest zagrożona.",
        conditions: { minGirls: 1 },
        chance: 8,
        cooldown: 200,
        targetJob: "photography",
        choices: [
            {
                text: "Wynajmij prawnika i usuń zdjęcia (-¥200k)",
                cost: 200000,
                effects: { risk: -15, loyalty: 20, morale: 10 },
                npcEffect: { npc: "kenji", value: 5 },
                followUpText: "Zdjęcia znikają w 48h. Dziewczyna jest ci wdzięczna.",
                showAlert: true
            },
            {
                text: "Zignoruj — Internet zapomina szybko",
                effects: { risk: 20, reputation: -10, morale: -15, loyalty: -10 },
                followUpText: "Nie zapomina. Przynajmniej nie w tym tygodniu.",
                showAlert: true
            },
            {
                text: "Znajdź i 'porozmawiaj' z winowajcą (wymaga Yakuzy)",
                conditions: { yakuza: true },
                effects: { risk: -5, loyalty: 15 },
                npcEffect: { npc: "takeshi", value: 5 },
                followUpText: "Takeshi wysyła kogoś. Problem znika. Pytania też.",
                showAlert: true
            }
        ]
    },

    // ========================================================================
    // MISC / FLAVOR EVENTS
    // ========================================================================
    {
        id: "rumor_mill",
        title: "Plotki w Szkole",
        description: "Uczennice z innych klas szepczą na korytarzu.\n\n'Słyszałaś o tych dziewczynach? Podobno Dyrektor...' Urwane zdanie.\n\nPlotki docierają do nauczycieli.",
        conditions: { minGirls: 3, minRisk: 20 },
        chance: 10,
        cooldown: 150,
        choices: [
            {
                text: "Zorganizuj oficjalne spotkanie uczniów — PR (-¥15k)",
                cost: 15000,
                effects: { reputation: 8, risk: -8 },
                npcEffect: { npc: "counselor", value: 5 },
                followUpText: "Pani Fujimoto jest neutralna. Plotki cichną.",
                showAlert: true
            },
            {
                text: "Zidentyfikuj źródło i 'poproś' o dyskrecję",
                effects: { risk: -5, reputation: -5 },
                followUpText: "Uczennica milknie. Ale coś widziała. Coś wie.",
                showAlert: true
            },
            {
                text: "Zignoruj — plotki to tylko plotki",
                effects: { risk: 8 },
                followUpText: "Plotki rosną. Pani Fujimoto zaczyna zadawać pytania.",
                showAlert: true
            }
        ]
    },
    {
        id: "star_performer",
        title: "Najlepsza Pracownica",
        templateDescription: "{girlName} bije rekordy zarobków przez cały miesiąc.\n\nKlienci proszą o nią z imienia. Jeden nawet zostawił list.\n\nJest zmęczona, ale dumna.",
        chance: 4,
        cooldown: 200,
        targetRandomGirl: true,
        girlConditions: { minLoyalty: 60, minLewdness: 50, minMorale: 55 },
        choices: [
            {
                text: "Daj jej premię i tytuł (-¥50k, +loyalty, +rep)",
                cost: 50000,
                effects: { loyalty: 20, morale: 15, reputation: 5 },
                followUpText: "Uśmiecha się szeroko. Inne dziewczyny patrzą z zazdrością i szacunkiem.",
                showAlert: true
            },
            {
                text: "Podkreśl jej wyniki publicznie (+morale wszystkich)",
                effects: { loyalty: 10, morale: 10 },
                customLog: { message: "Wyróżnienie podniosło morale całego zespołu!", type: "event" },
                followUpText: "Krótka pochwała przed innymi. Efekt motywacyjny.",
                showAlert: true
            }
        ]
    },
    {
        id: "anonymous_tip",
        title: "Anonimowy List",
        description: "Na biurku leży nieoznaczona koperta.\n\n'Wiem, kim jesteś. Wiem, co robisz.\nMogę milczeć — za cenę.\nMasz tydzień.\n— Przyjaciel'",
        conditions: { minRisk: 30, minMoney: 100000 },
        chance: 6,
        cooldown: 300,
        choices: [
            {
                text: "Zapłać ¥200k — kupujesz milczenie",
                cost: 200000,
                effects: { risk: -10 },
                followUpText: "Tygodniowa cisza. Ale szantażysta wraca. To natura szantażu.",
                showAlert: true
            },
            {
                text: "Poproś Takeshiego o identyfikację",
                conditions: { yakuza: true },
                effects: { risk: -15 },
                npcEffect: { npc: "takeshi", value: 5 },
                followUpText: "Takeshi oddzwania. 'To pani Fujimoto. Pedagog szkolny.' Cisza po drugiej stronie.",
                showAlert: true
            },
            {
                text: "Zignoruj — blef",
                effects: { risk: 15 },
                followUpText: "Kolejny list. Tym razem ze zdjęciami. Nie był to blef.",
                showAlert: true
            }
        ]
    },
    {
        id: "counselor_suspicion",
        title: "Pani Fujimoto Pyta",
        description: "Szkolna pedagog puka do twojego gabinetu.\n\n\"Dyrektorze... Kilka dziewcząt wydaje się... inaczej. Są zmęczone. Spóźniają się. Jedna miała siniaki.\"\n\nPatrzy ci w oczy.\n\n\"Czy wszystko w porządku z naszymi uczennicami?\"",
        conditions: { minGirls: 3, minRisk: 25 },
        chance: 7,
        cooldown: 250,
        choices: [
            {
                text: "Bądź otwarty — to przemęczenie egzaminacyjne",
                effects: { risk: -8, reputation: 5 },
                npcEffect: { npc: "counselor", value: 10 },
                followUpText: "Fujimoto kiwa głową. 'Dobrze. Powiem im, żeby bardziej uważały na siebie.' Odchodzi uspokojona.",
                showAlert: true
            },
            {
                text: "Zmień temat — zaproś na kawę i porozmawiaj o budżecie",
                effects: { risk: -3 },
                npcEffect: { npc: "counselor", value: 3 },
                followUpText: "Daje się odwrócić. Na razie.",
                showAlert: true
            },
            {
                text: "Powiedz jej wprost, że to nie jej sprawa",
                effects: { risk: 15, reputation: -8 },
                npcEffect: { npc: "counselor", value: -25 },
                followUpText: "Fujimoto wychodzi z zaciśniętymi ustami. Wróci z sojusznikami.",
                showAlert: true
            }
        ]
    }
];

// Condition helper: check if investment was purchased
// (used in police_raid_actual choice requirement)
function hasInvestment(id) {
    return gameState.purchasedInvestments.includes(id);
}
