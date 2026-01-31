// ============================================================================
// GAME DATA
// ============================================================================


const JOBS_DATA = {
    none: { name: "Bez pracy", baseIncome: 0, risk: 0, requiredLewdness: 0 },
    school_dates: {
        name: "Randki Szkolne", baseIncome: 5000, risk: 10, requiredLewdness: 5,
        requiredSkills: { conversation: 20 },
        description: "Dyskretne randki z uczniami. Wymagania: Lewdness 5+, Conversation 20+"
    },
    hostess: {
        name: "Hostess Bar", baseIncome: 15000, risk: 25, requiredLewdness: 20,
        requiredSkills: { conversation: 40 },
        description: "Praca w barze. Wymagania: Lewdness 20+, Conversation 40+"
    },
    delivery: {
        name: "Delivery Health", baseIncome: 30000, risk: 45, requiredLewdness: 50,
        requiredSkills: { conversation: 30, handjob: 40, blowjob: 30 },
        description: "Usługi z dojazdem. Wymagania: Lewdness 50+, Conversation 30+, Handjob 40+, Blowjob 30+"
    },
    soapland: {
        name: "Soapland", baseIncome: 60000, risk: 60, requiredLewdness: 70,
        requiredSkills: { conversation: 40, handjob: 50, blowjob: 60, vaginal: 50 },
        description: "Salon erotyczny. Wymagania: Lewdness 70+, Conversation 40+, Handjob 50+, Blowjob 60+, Vaginal 50+"
    },
    vip: {
        name: "Usługi VIP", baseIncome: 120000, risk: 80, requiredLewdness: 85,
        requiredSkills: { conversation: 70, handjob: 70, blowjob: 70, vaginal: 70, anal: 70, feet: 70 },
        description: "Elita. Wymagania: Lewdness 85+, wszystkie skille 70+"
    }
};

const EVENTS_DATA = [
    {
    id: "date_return_1",
    title: "Powrót z randki",
    description: "",   // ← zostawiamy puste – wypełniamy dynamicznie
    templateDescription: "{girlName} wraca z randki zmęczona. Trzyma kopertę z pieniędzmi.\n\n\"Udało się... Chłopak był miły, ale nachalny.\"\n\nJej oczy błyszczą wilgocią.",
    conditions: { minGirls: 1 },
    chance: 4,
    cooldown: 72,
    targetJob: "school_dates",   // ← ważne – tylko dziewczyny z tą pracą
    choices: [
        {
            text: "Przytul ją i pochwal",
            effects: { loyalty: 10, morale: 15, money: 5000 },
            followUpText: "Przytula się i płacze. \"Dziękuję...\""
        },
        {
            text: "Weź pieniądze bez słowa",
            effects: { loyalty: -5, morale: -10, money: 10000 },
            followUpText: "Wygląda na zranioną."
        }
    ]
},
    {
        id: "yakuza_offer", title: "Propozycja Yakuzy",
        description: "Mężczyzna w czarnym garniturze wchodzi do biura. Tatuaże na rękach.\n\n\"Prowadzisz interesujący biznes. Jestem Takeshi z klanu Yamaguchi. Ochrona za 15% zysków?\"",
        conditions: { minMoney: 100000, minGirls: 4 }, chance: 15, oneTime: true,
        choices: [
            { text: "Przyjmij (15% podatek, -20 risk, +10 rep)", cost: 0, effects: { yakuzaProtection: true, profitTax: 15, reputation: 10, risk: -20 }, followUpText: "\"Mądra decyzja. Jesteś pod opieką.\"" },
            { text: "Odmów grzecznie", cost: 0, effects: { risk: 10 }, followUpText: "\"Rozumiem. Jeśli zmienisz zdanie...\"" }
        ]
    },
    {
        id: "unlock_hostess", title: "Oferta Hostess Bar",
        description: "Prawnik dzwoni: 'Lokal w Shibuya. Hostess bar. Start: ¥1M gotówki, koszt ¥100k.'",
        conditions: { minMoney: 1000000, minReputation: 20 }, chance: 40, oneTime: true,
        choices: [
            { text: "Otwórz Bar (-¥100k)", cost: 100000, effects: { unlockJob: "hostess" }, followUpText: "✅ Hostess Bar otwarty!" },
            { text: "Odmów", cost: 0, effects: {}, followUpText: "Szansa przepadła." }
        ]
    },
    {
        id: "unlock_delivery", title: "Agencja Delivery",
        description: "Kobieta dzwoni: 'Widziałam dziewczyny. Delivery health? Potrzeba 3+ dziewczyn i ochrony Yakuzy.'",
        conditions: { minGirls: 3, yakuza: true }, chance: 35, oneTime: true,
        choices: [
            { text: "Podpisz umowę", cost: 0, effects: { unlockJob: "delivery" }, followUpText: "✅ Delivery Health dostępne!" },
            { text: "Odmów", cost: 0, effects: {}, followUpText: "Może później..." }
        ]
    },
    {
        id: "unlock_soapland", title: "Propozycja Soapland",
        description: "Yakuza: 'Masz kasę i dziewczyny. Soapland? Koszt ¥2M.'",
        conditions: { minMoney: 5000000 }, chance: 25, oneTime: true,
        choices: [
            { text: "Inwestuj (-¥2M)", cost: 2000000, effects: { unlockJob: "soapland" }, followUpText: "✅ Soapland otwarty!" },
            { text: "Odmów", cost: 0, effects: {}, followUpText: "Za drogo..." }
        ]
    },
 {
    id: "recruit_student",
    title: "Nowa Uczennica",
    description: "Transferka w klasie 1-A wygląda na zagubioną i zestresowaną. Wygląda na to, że ma problemy finansowe. Porozmawiać z nią?",
    conditions: { minReputation: 30, minMoney: 50000 },
    chance: 2,
    cooldown: 100,
    choices: [
        {
            text: "Zaproponuj pomoc i pracę (-¥50k)",
            cost: 50000,
            effects: { addGirl: true, reputation: 5 },
            followUpText: "Dziewczyna kiwa głową z wdzięcznością. „Dziękuję… naprawdę potrzebowałam tej szansy.”"
        },
        {
            text: "Zignoruj ją",
            cost: 0,
            effects: {},
            followUpText: "Odchodzisz. Dziewczyna zostaje sama w korytarzu."
        }
    ]
}
    {
        id: "low_morale", title: "Kryzys Morale",
        description: "Dziewczyny są wyczerpane. Grożą odejściem. Premia ¥50k?",
        conditions: { minMorale: 0, maxMorale: 35, minMoney: 50000 }, chance: 50, cooldown: 24,
        choices: [
            { text: "Daj premię (-¥50k)", cost: 50000, effects: { morale: 20, loyalty: 10 }, followUpText: "Atmosfera się poprawia." },
            { text: "Ignoruj", cost: 0, effects: { morale: -10, loyalty: -15, risk: 20 }, followUpText: "Sytuacja pogarsza się..." }
        ]
    }
];

const SCHOOL_INVESTMENTS = [
    {
        id: "renovation", name: "Renowacja klas", cost: 100000,
        effects: { reputation: 5, grades: 10 },
        description: "Odśwież sale. +5 reputacji, +10 średnia ocen."
    },
    {
        id: "sports", name: "Obiekt sportowy", cost: 250000,
        effects: { reputation: 10, morale: 15 },
        description: "Boisko i siłownia. +10 reputacji, +15 morale wszystkim."
    },
    {
        id: "secret_rooms", name: "Tajne pokoje", cost: 500000,
        effects: { risk: -10 },
        description: "Ukryte pomieszczenia. -10 ryzyko."
    }
];
