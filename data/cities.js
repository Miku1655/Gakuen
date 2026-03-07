// ============================================================================
// CITIES & SCHOOLS SYSTEM
// Each city has schools the player can purchase and run.
// Girls are assigned to a specific school (and thus city).
// ============================================================================

const CITIES_DATA = {
    tokyo: {
        id: "tokyo",
        name: "Tokio",
        district: "Shinjuku",
        description: "Serce imperium. Seiran Academy jest tutaj. Najwyższa konkurencja, ale też najlepsze zarobki.",
        unlocked: true,
        unlockCost: 0,
        unlockRequirements: {},
        atmosphere: "cosmopolitan",
        policeLevel: 2,       // 1=low, 3=high
        yakuzaPresence: 2,
        incomeMultiplier: 1.0,
        riskMultiplier: 1.0,
        recruitmentDifficulty: 1.0,  // cost multiplier for new girls
        color: "#e94560",
        emoji: "🗼",
        flavorTexts: [
            "Neony Kabukicho migają przez całą noc.",
            "Shinjuku nigdy nie śpi. Twój biznes też nie.",
            "Policja z Wydziału Moralności kręci się po okolicy.",
            "Yakuza ma tu swoje korzenie. Szanuj to.",
            "Tokio pochłania słabych. Ty nie możesz być słaby."
        ],
        schools: ["seiran_academy"],
        availableJobs: ["none","school_dates","tutor","hostess","photography","delivery","escort_luxury","soapland","vip"],
        cityEvents: ["tokyo_police_sweep","tokyo_neon_festival","tokyo_yakuza_summit"]
    },
    osaka: {
        id: "osaka",
        name: "Osaka",
        district: "Namba",
        description: "Miasto handlu i przyjemności. Mniej formalne niż Tokio, więcej okazji dla sprytu.",
        unlocked: false,
        unlockCost: 2000000,
        unlockRequirements: { minMoney: 5000000, minGirls: 5, minReputation: 40 },
        atmosphere: "commercial",
        policeLevel: 1,
        yakuzaPresence: 3,
        incomeMultiplier: 1.15,    // higher pay
        riskMultiplier: 0.85,      // less police
        recruitmentDifficulty: 0.85,
        color: "#f39c12",
        emoji: "🏯",
        flavorTexts: [
            "W Osace liczy się spryt i głośny śmiech.",
            "Namba nocą to drugi świat — pełen okazji.",
            "Tutaj Yakuza i policja patrzą przez palce na wiele rzeczy.",
            "Tańsze dziewczyny, lepsza klientela. Idealne dla ekspansji.",
            "Handlarze z Dōtonbori znają wszystkich — i wszystko."
        ],
        schools: ["namba_girls_academy"],
        availableJobs: ["none","school_dates","tutor","hostess","delivery","escort_luxury","soapland","vip","cabaret"],
        cityEvents: ["osaka_merchant_deal","osaka_festival_crowd","osaka_clan_rivalry"]
    },
    kyoto: {
        id: "kyoto",
        name: "Kioto",
        district: "Gion",
        description: "Miasto tradycji i dyskrecji. Klientela płaci trzykrotnie więcej — jeśli masz klasę.",
        unlocked: false,
        unlockCost: 8000000,
        unlockRequirements: { minMoney: 15000000, minReputation: 70, earnedAchievements: ["millionaire"] },
        atmosphere: "traditional",
        policeLevel: 3,
        yakuzaPresence: 1,
        incomeMultiplier: 1.5,     // premium market
        riskMultiplier: 1.3,       // high police
        recruitmentDifficulty: 1.4, // harder to recruit
        color: "#9b59b6",
        emoji: "⛩️",
        flavorTexts: [
            "Kioto żyje tradycją. Tu wszystko jest ceremonią.",
            "Policja tu jest poważna. Jeden błąd — i koniec.",
            "Klienci z Gion płacą fortuny za dyskrecję i klasę.",
            "Gejsza to legenda. Twoje dziewczyny mogą ją ucieleśnić.",
            "Elegancja jest tutaj walutą równie ważną jak jen."
        ],
        schools: ["gion_ladies_academy"],
        availableJobs: ["none","tutor","hostess","photography","escort_luxury","geisha_companion","vip"],
        cityEvents: ["kyoto_tea_ceremony_client","kyoto_politician_scandal","kyoto_old_money"]
    }
};

// ============================================================================
// SCHOOL TEMPLATES
// Each city starts with one school; player can eventually purchase more.
// ============================================================================

const SCHOOL_TEMPLATES = {
    seiran_academy: {
        id: "seiran_academy",
        cityId: "tokyo",
        name: "Seiran Academy",
        fullName: "Akademia Seiran",
        description: "Twoja pierwotna szkoła. Klasy średniej, dobre lokalizacja w Shinjuku.",
        tier: 1,             // 1=basic, 2=refined, 3=elite
        baseReputation: 45,
        maxGirls: 20,
        debtAmount: 5000000,
        monthlyOverhead: 200000,
        startUnlocked: true,
        purchaseCost: 0,
        emoji: "🏫",
        color: "#e94560"
    },
    namba_girls_academy: {
        id: "namba_girls_academy",
        cityId: "osaka",
        name: "Namba Girls Academy",
        fullName: "Akademia Dziewcząt Namba",
        description: "Nowoczesna szkoła w centrum Osaki. Uczniowie z klasy średniej, dobre połączenia biznesowe.",
        tier: 1,
        baseReputation: 35,
        maxGirls: 18,
        debtAmount: 0,
        monthlyOverhead: 180000,
        startUnlocked: false,
        purchaseCost: 2000000,
        emoji: "🏢",
        color: "#f39c12"
    },
    gion_ladies_academy: {
        id: "gion_ladies_academy",
        cityId: "kyoto",
        name: "Gion Ladies Academy",
        fullName: "Akademia Dam w Gion",
        description: "Ekskluzywna szkoła dla córek elity Kioto. Reputacja jest wszystkim — jeden skandal zniszczy cię.",
        tier: 3,
        baseReputation: 60,
        maxGirls: 12,
        debtAmount: 0,
        monthlyOverhead: 500000,
        startUnlocked: false,
        purchaseCost: 8000000,
        emoji: "⛩️",
        color: "#9b59b6"
    }
};

// ============================================================================
// CITY-SPECIFIC JOBS
// Jobs only available in certain cities
// ============================================================================

const CITY_JOBS = {
    cabaret: {
        name: "Klub Kabaretowy",
        baseIncome: 25000,
        risk: 30,
        requiredLewdness: 35,
        requiredSkills: { conversation: 45 },
        description: "Osaka — śpiew i taniec dla biznesmenów. Wymagania: Lewdness 35+, Conversation 45+",
        cityOnly: "osaka"
    },
    geisha_companion: {
        name: "Towarzyszka Gejszy",
        baseIncome: 80000,
        risk: 40,
        requiredLewdness: 55,
        requiredSkills: { conversation: 70, feet: 50 },
        description: "Kioto — ceremonialna rola dla klientów z wyższych sfer. Wymagania: Lewdness 55+, Conversation 70+, Feet 50+",
        cityOnly: "kyoto"
    }
};

// ============================================================================
// SCHOOL-SPECIFIC INVESTMENTS
// Available only for specific schools/cities
// ============================================================================

const SCHOOL_INVESTMENTS_BY_CITY = {
    tokyo: [
        { id: "vip_lounge_tokyo",  name: "Lounge VIP",         cost: 1000000, effects: { reputation: 15, risk: -5 },       description: "Ekskluzywna sala dla klientów premium. +15 rep, -5 ryzyko." },
        { id: "neon_signage",      name: "Neonowy Szyld",      cost: 300000,  effects: { reputation: 12, morale: 5 },       description: "Widoczność w Shinjuku. +12 rep, +5 morale." }
    ],
    osaka: [
        { id: "pachinko_front",    name: "Salon Pachinko (przykrywka)", cost: 500000, effects: { risk: -20, reputation: 8 }, description: "Legalna przykrywka biznesowa. -20 ryzyko, +8 rep." },
        { id: "canal_house",       name: "Dom przy Kanale",    cost: 700000,  effects: { reputation: 10, morale: 20 },      description: "Prestiżowa lokalizacja przy Dōtonbori." }
    ],
    kyoto: [
        { id: "tea_house",         name: "Herbaciarnia Ura",   cost: 1500000, effects: { reputation: 25, risk: -15 },       description: "Idealna przykrywka dla klientów z elit. +25 rep, -15 ryzyko." },
        { id: "kimono_wardrobe",   name: "Garderoba Kimono",   cost: 600000,  effects: { reputation: 10, morale: 15 },      description: "Stroje dla gejsz. +10 rep, +15 morale dziewczyn." }
    ]
};

// ============================================================================
// CITY-SPECIFIC EVENTS
// ============================================================================

const CITY_EVENTS_DATA = [
    // ========================================================================
    // TOKYO EVENTS
    // ========================================================================
    {
        id: "tokyo_police_sweep",
        title: "Policyjna Obława w Shinjuku",
        description: "Policja prowadzi masową kontrolę w całym Shinjuku. Wszyscy biznesmeni nerwowo sprawdzają telefony.\n\n\"Słyszałem, że zamykają kilka klubów dziś w nocy.\"\n\nTwoje ryzyko jest wysokie.",
        conditions: { minRisk: 50, cityId: "tokyo" },
        chance: 12,
        cooldown: 200,
        choices: [
            {
                text: "Zawieś operacje na 48h (-¥150k)",
                effects: { money: -150000, risk: -25 },
                followUpText: "Przeczekujesz burzę. Żadnych strat operacyjnych.",
                showAlert: true
            },
            {
                text: "Przekup sierżanta policji (-¥300k)",
                cost: 300000,
                effects: { risk: -35, reputation: 5 },
                followUpText: "Sierżant kiwa głową. 'Tym razem nic nie widziałem.'",
                showAlert: true
            },
            {
                text: "Kontynuuj — masz protekcję Yakuzy",
                requirements: { needsYakuza: true },
                effects: { risk: 10 },
                followUpText: "Yakuza osłania cię, ale policja i tak notuje twój adres.",
                showAlert: true
            }
        ]
    },
    {
        id: "tokyo_neon_festival",
        title: "Festiwal Neonowy Kabukicho",
        description: "Coroczny festiwal w Kabukicho przyciąga tłumy turystów i bogatych klientów.\n\nTo idealna okazja — ale też więcej oczu.",
        conditions: { cityId: "tokyo", minReputation: 30 },
        chance: 8,
        cooldown: 720,
        choices: [
            {
                text: "Zorganizuj specjalną ofertę (+dochody)",
                effects: { money: 200000, risk: 15, reputation: 10 },
                followUpText: "Tydzień wzmożonej pracy przynosi fortunę — ale i uwagę.",
                showAlert: true
            },
            {
                text: "Rekrutuj nowe dziewczyny w tłumie",
                effects: { addGirl: true, reputation: 5 },
                followUpText: "Festiwal okazał się idealnym miejscem na rekrutację.",
                showAlert: true
            },
            {
                text: "Tylko obserwuj",
                effects: { reputation: 3 },
                followUpText: "Festiwal mija bez twojego udziału.",
                showAlert: true
            }
        ]
    },
    {
        id: "tokyo_yakuza_summit",
        title: "Szczyt Klanów w Tokio",
        description: "Dwa klany Yakuzy negocjują podział Shinjuku. Takeshi zwraca się do ciebie:\n\n'Potrzebujemy neutralnego miejsca spotkania. Twoja szkoła?'\n\nOdmowa może być niebezpieczna.",
        conditions: { cityId: "tokyo", yakuza: true },
        chance: 5,
        cooldown: 500,
        oneTime: false,
        choices: [
            {
                text: "Udostępnij lokal (+rep Takeshi, -risk)",
                effects: { risk: -10, reputation: 8, npcEffect: { id: "takeshi", delta: 20 } },
                followUpText: "'Jesteś wierny.' Takeshi ściska ci rękę.",
                showAlert: true
            },
            {
                text: "Odmów — za ryzykowne",
                effects: { risk: 5, npcEffect: { id: "takeshi", delta: -10 } },
                followUpText: "Takeshi odchodzi bez słowa. Powróci.",
                showAlert: true
            },
            {
                text: "Zorganizuj i nagraj spotkanie (szantaż)",
                effects: { risk: 30, money: 500000, npcEffect: { id: "takeshi", delta: -50 } },
                followUpText: "Nagranie trafia do skrytki. Takeshi nic nie podejrzewa — na razie.",
                showAlert: true
            }
        ]
    },

    // ========================================================================
    // OSAKA EVENTS
    // ========================================================================
    {
        id: "osaka_merchant_deal",
        title: "Oferta od Kupca z Namba",
        description: "Bogaty handlarz tekstyliami oferuje stałą umowę:\n\n'Moje klientki potrzebują... towarzystwa. Stały kontrakt, ¥300k miesięcznie. Wymagam dyskrecji.'\n\nTo duże pieniądze, ale wiązanie się z jednym klientem to ryzyko.",
        conditions: { cityId: "osaka", minReputation: 40 },
        chance: 10,
        cooldown: 300,
        oneTime: true,
        choices: [
            {
                text: "Podpisz kontrakt",
                effects: { money: 300000, risk: 10, reputation: 5 },
                followUpText: "Stały dochód od kupca. Solidna umowa.",
                showAlert: true
            },
            {
                text: "Negocjuj wyższe stawki (¥450k)",
                effects: { money: 450000, risk: 20 },
                followUpText: "Niechętnie zgadza się na wyższe stawki. Zarobisz więcej — ale jest niezadowolony.",
                showAlert: true
            },
            {
                text: "Odmów",
                effects: { reputation: -3 },
                followUpText: "Odchodzi do konkurencji.",
                showAlert: true
            }
        ]
    },
    {
        id: "osaka_festival_crowd",
        title: "Tsuyu — Festiwal Dōtonbori",
        description: "Festiwal letni w Dōtonbori. Tysiące ludzi, muzyka, jedzenie — i dyskretne spotkania.\n\nTwoja szkoła w Osace może skorzystać.",
        conditions: { cityId: "osaka" },
        chance: 6,
        cooldown: 720,
        choices: [
            {
                text: "Stoisko z jedzeniem (przykrywka, -¥20k)",
                cost: 20000,
                effects: { reputation: 12, morale: 15, money: 30000 },
                followUpText: "Stoisko yakisoba okazuje się hitem. Dziewczyny się cieszą.",
                showAlert: true
            },
            {
                text: "VIP-lounge przy Dōtonbori (-¥50k)",
                cost: 50000,
                effects: { money: 120000, reputation: 8, risk: 10 },
                followUpText: "Impreza w VIP-lounge przynosi spory zysk.",
                showAlert: true
            }
        ]
    },
    {
        id: "osaka_clan_rivalry",
        title: "Rywalizacja Klanów w Osace",
        description: "Klan Suzuki i klan Yamaguchi rywalizują o wpływy w Osace.\n\nObaj posłańcy czekają na twoją decyzję. Kogo wesprzesz?",
        conditions: { cityId: "osaka", minGirls: 3 },
        chance: 8,
        cooldown: 400,
        oneTime: true,
        choices: [
            {
                text: "Wesprzeć Yamaguchi (Takeshi)",
                effects: { risk: -15, npcEffect: { id: "takeshi", delta: 25 }, reputation: 10 },
                followUpText: "Takeshi docenia lojalność. Twoja pozycja w Osace jest bezpieczna.",
                showAlert: true
            },
            {
                text: "Wesprzeć Suzuki",
                effects: { risk: -10, money: 200000, npcEffect: { id: "takeshi", delta: -30 } },
                followUpText: "Suzuki płaci hojnie. Ale Takeshi o tym wie.",
                showAlert: true
            },
            {
                text: "Pozostać neutralnym",
                effects: { risk: 10, reputation: -5 },
                followUpText: "Obaj klanowie patrzą na ciebie z nieufnością.",
                showAlert: true
            }
        ]
    },

    // ========================================================================
    // KYOTO EVENTS
    // ========================================================================
    {
        id: "kyoto_tea_ceremony_client",
        title: "Klient z Ceremonii Herbaty",
        description: "Starszy dżentelmen w kimono prosi o prywatną rozmowę.\n\n'Słyszałem o twoich... artystkach. Mam gości z Tokio, którzy szukają towarzystwa w stylu starożytnym. Zapłacę 10x normalną stawkę.'\n\nTo ogromna szansa — i ogromne ryzyko.",
        conditions: { cityId: "kyoto", minReputation: 60 },
        chance: 8,
        cooldown: 300,
        targetRandomGirl: true,
        girlConditions: { minLewdness: 50, minLoyalty: 60 },
        choices: [
            {
                text: "Zgódź się (+¥500k, wymaga Lewdness 50+)",
                effects: { money: 500000, risk: 20, morale: -15, loyalty: -5 },
                followUpText: "{girlName} wraca po całej nocy. Bogatsza — ale milcząca.",
                showAlert: true
            },
            {
                text: "Odmów uprzejmie",
                effects: { reputation: 5, npcEffect: { id: "takeshi", delta: 0 } },
                followUpText: "'Rozumiem dyskrecję. To tylko podnosi moją opinię o tobie.'",
                showAlert: true
            }
        ]
    },
    {
        id: "kyoto_politician_scandal",
        title: "Skandal Polityczny",
        description: "Jeden z twoich klientów okazuje się być lokalnym politykiem.\n\nDziennikarz podchodzi do ciebie: 'Mam zdjęcia. Możemy pomóc sobie nawzajem.'\n\nTo obosieczna broń.",
        conditions: { cityId: "kyoto", minReputation: 50 },
        chance: 5,
        cooldown: 500,
        oneTime: true,
        choices: [
            {
                text: "Sprzedaj informacje dziennikarzowi (+¥1M)",
                effects: { money: 1000000, risk: 30, reputation: -20 },
                followUpText: "Skandal wybucha. Zysk ogromny — ale twoja reputacja w Kioto ledwo się trzyma.",
                showAlert: true
            },
            {
                text: "Użyj jako szantaż na polityka",
                effects: { money: 500000, risk: 15 },
                followUpText: "Polityk płaci. Cicho, dyskretnie, regularnie.",
                showAlert: true
            },
            {
                text: "Zniszcz dowody — zachowaj lojalność klienta",
                effects: { reputation: 20, risk: -10 },
                followUpText: "Polityk jest wdzięczny. Twoja reputacja w elit Kioto wzrasta.",
                showAlert: true
            }
        ]
    },
    {
        id: "kyoto_old_money",
        title: "Stare Pieniądze Kioto",
        description: "Rodzina Matsudaira — jedna z najstarszych w Kioto — zaprasza cię na kolację.\n\n'Słyszeliśmy o tobie. Jeśli spełnisz nasze standardy, otworzę przed tobą drzwi, których nie widziałeś na własne oczy.'\n\nTo może być przepustka do prawdziwej elity.",
        conditions: { cityId: "kyoto", minReputation: 75 },
        chance: 3,
        cooldown: 600,
        oneTime: true,
        choices: [
            {
                text: "Przyjmij zaproszenie (-¥200k na strój)",
                cost: 200000,
                effects: { reputation: 30, money: 800000, risk: -10 },
                followUpText: "Kolacja otwiera przed tobą sieć klientów niemożliwą do zbudowania inaczej. Inwestycja życia.",
                showAlert: true
            },
            {
                text: "Odmów — jesteś zbyt ostrożny",
                effects: { reputation: -5 },
                followUpText: "Matsudaira-san kiwa głową z rozczarowaniem. Okazja przepada.",
                showAlert: true
            }
        ]
    },

    // ========================================================================
    // CITY UNLOCK EVENTS
    // ========================================================================
    {
        id: "unlock_osaka",
        title: "Kontakt z Osaką",
        description: "Dociera do ciebie wiadomość od brokera z Namba:\n\n'Słyszałem o twoim imperium. Osaka jest gotowa. Namba Girls Academy stoi pusty — kupię go za ¥2M. Ty decydujesz.'\n\nRozszerzenie do Osaki oznacza nowe dziewczyny, niższe ryzyko i wyższe dochody.",
        conditions: { minMoney: 5000000, minGirls: 5, minReputation: 40 },
        chance: 25,
        oneTime: true,
        choices: [
            {
                text: "Kup Namba Girls Academy (-¥2M)",
                cost: 2000000,
                effects: {
                    unlockCity: "osaka",
                    customLog: { message: "🏯 Osaka odblokowana! Namba Girls Academy otwarta.", type: "unlock" }
                },
                followUpText: "✅ Osaka odblokowana! Namba Girls Academy jest twoja.",
                showAlert: true
            },
            {
                text: "Poczekaj — jeszcze nie teraz",
                effects: {},
                followUpText: "Broker rozumie. 'Oferta jest otwarta.'",
                showAlert: true
            }
        ]
    },
    {
        id: "unlock_kyoto",
        title: "Zaproszenie do Kioto",
        description: "Tajemniczy list z pieczęcią rodziny Fujiwara:\n\n'Gion Ladies Academy szuka nowego właściciela z wizją. ¥8M za przejęcie. Klientela elitarna, wymagania również.'\n\nKioto to szczyt — ale też największe ryzyko.",
        conditions: { minMoney: 15000000, minReputation: 70 },
        chance: 15,
        oneTime: true,
        choices: [
            {
                text: "Przejmij Gion Ladies Academy (-¥8M)",
                cost: 8000000,
                effects: {
                    unlockCity: "kyoto",
                    customLog: { message: "⛩️ Kioto odblokowane! Gion Ladies Academy otwarta.", type: "unlock" }
                },
                followUpText: "✅ Kioto odblokowane! Gion Ladies Academy jest twoja.",
                showAlert: true
            },
            {
                text: "Odmów",
                effects: {},
                followUpText: "List zostaje w szufladzie. Na razie.",
                showAlert: true
            }
        ]
    }
];
