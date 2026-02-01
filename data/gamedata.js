// ============================================================================
// GAME DATA - Easy to Extend!
// ============================================================================

// ============================================================================
// JOBS DATA
// ============================================================================

const JOBS_DATA = {
    none: { 
        name: "Bez pracy", 
        baseIncome: 0, 
        risk: 0, 
        requiredLewdness: 0 
    },
    school_dates: {
        name: "Randki Szkolne", 
        baseIncome: 5000, 
        risk: 10, 
        requiredLewdness: 5,
        requiredSkills: { conversation: 20 },
        description: "Dyskretne randki z uczniami. Wymagania: Lewdness 5+, Conversation 20+"
    },
    hostess: {
        name: "Hostess Bar", 
        baseIncome: 15000, 
        risk: 25, 
        requiredLewdness: 20,
        requiredSkills: { conversation: 40 },
        description: "Praca w barze. Wymagania: Lewdness 20+, Conversation 40+"
    },
    delivery: {
        name: "Delivery Health", 
        baseIncome: 30000, 
        risk: 45, 
        requiredLewdness: 50,
        requiredSkills: { conversation: 30, handjob: 40, blowjob: 30 },
        description: "Usługi z dojazdem. Wymagania: Lewdness 50+, Conversation 30+, Handjob 40+, Blowjob 30+"
    },
    soapland: {
        name: "Soapland", 
        baseIncome: 60000, 
        risk: 60, 
        requiredLewdness: 70,
        requiredSkills: { conversation: 40, handjob: 50, blowjob: 60, vaginal: 50 },
        description: "Salon erotyczny. Wymagania: Lewdness 70+, Conversation 40+, Handjob 50+, Blowjob 60+, Vaginal 50+"
    },
    vip: {
        name: "Usługi VIP", 
        baseIncome: 120000, 
        risk: 80, 
        requiredLewdness: 85,
        requiredSkills: { conversation: 70, handjob: 70, blowjob: 70, vaginal: 70, anal: 70, feet: 70 },
        description: "Elita. Wymagania: Lewdness 85+, wszystkie skille 70+"
    }
};

// ============================================================================
// EVENTS DATA
// ============================================================================

/*
ADDING NEW EVENTS - COMPLETE GUIDE:

Event structure:
{
    id: "unique_id",                    // REQUIRED: Unique identifier
    title: "Event Title",               // REQUIRED: Shown at top of event
    description: "Event text",          // REQUIRED: Main event text
    
    // OPTIONAL - Event Availability
    conditions: {
        minMoney: 10000,               // Minimum money needed
        maxMoney: 500000,              // Maximum money allowed
        minReputation: 20,             // Min reputation
        maxReputation: 80,             // Max reputation
        minGirls: 3,                   // Min number of girls
        maxGirls: 10,                  // Max number of girls
        minMorale: 50,                 // Min total morale
        maxMorale: 70,                 // Max total morale
        minRisk: 30,                   // Min risk level
        maxRisk: 60,                   // Max risk level
        yakuza: true,                  // Needs yakuza protection (or false)
        hasJob: "hostess",             // Need this job unlocked
        notHasJob: "vip",              // Must NOT have this job
        completedEvent: "event_id",    // Needs this event completed
        notCompletedEvent: "other_id", // Must NOT have completed this
        dayOfWeek: [0,6],              // Array: 0=Sun, 1=Mon... 6=Sat
        timeOfDay: [18,23]             // Hour range [from, to]
    },
    
    chance: 15,                        // % chance when triggered (default 100)
    oneTime: true,                     // Can only happen once
    cooldown: 48,                      // Hours before can trigger again
    
    // GIRL TARGETING (choose ONE approach)
    targetJob: "school_dates",         // Targets random girl with this job
    targetRandomGirl: true,            // Targets any random available girl
    
    // When using targetJob or targetRandomGirl:
    templateDescription: "{girlName} returns from work...", // Use placeholders
    girlConditions: {                  // Additional filters for target girl
        minLoyalty: 40,
        maxLoyalty: 80,
        minLewdness: 20,
        maxLewdness: 60,
        minMorale: 30,
        maxMorale: 70,
        hasTrait: "virgin",            // Girl must have this trait
        notHasTrait: "experienced"     // Girl must NOT have this trait
    },
    
    choices: [                         // REQUIRED: At least one choice
        {
            text: "Choice text",       // REQUIRED: Button text
            cost: 50000,               // Money cost (optional)
            requirements: {            // Additional requirements for this choice
                minReputation: 40,
                minGirls: 5
            },
            effects: {                 // What happens when chosen
                // Money
                money: 10000,          // Add/remove money (can be negative)
                
                // Global stats (affect all girls)
                reputation: 5,         // Change reputation
                risk: -10,             // Change risk
                morale: 15,            // Change all girls' morale
                loyalty: 10,           // Change all girls' loyalty
                lewdness: 5,           // Change all girls' lewdness
                
                // Girl-specific (only for targeted events)
                // These automatically apply to the targeted girl
                // loyalty, morale, lewdness, grades also work here
                
                addTrait: "experienced",        // Add trait to girl
                removeTrait: "virgin",          // Remove trait from girl
                skillBoost: {                   // Boost girl's skills
                    conversation: 10,
                    handjob: 15
                },
                
                // Special effects
                unlockJob: "hostess",           // Unlock a job
                addGirl: true,                  // Add 1 random girl
                addGirls: 3,                    // Add multiple girls
                removeGirl: true,               // Remove random girl
                yakuzaProtection: true,         // Set yakuza status
                profitTax: 15,                  // Set profit tax %
                
                customLog: {                    // Custom log entry
                    message: "Something happened!",
                    type: "event"
                }
            },
            followUpText: "Follow-up message", // Optional message after
            showAlert: true                     // Show alert with followUpText
        }
    ]
}

PLACEHOLDERS (for templateDescription and followUpText):
{girlName} - Girl's full name
{girlAge} - Girl's age
{girlPersonality} - Girl's personality type
{girlJob} - Girl's current job name

*/

const EVENTS_DATA = [
    // ========================================================================
    // GIRL-TARGETED EVENTS (targetJob)
    // ========================================================================
    {
        id: "date_return_success",
        title: "Udana Randka",
        templateDescription: "{girlName} wraca z randki z promiennym uśmiechem.\n\n\"To było... nieoczekiwanie miłe. Chłopak był naprawdę uprzejmy!\"\n\nTrzyma kopertę z pieniędzmi i bukiet kwiatów.",
        conditions: { minGirls: 1 },
        chance: 3,
        cooldown: 48,
        targetJob: "school_dates",
        girlConditions: { minMorale: 50 }, // Only happy girls get good dates
        choices: [
            {
                text: "Pochwal ją i pozwól zatrzymać kwiaty",
                effects: { 
                    loyalty: 15, 
                    morale: 20, 
                    money: 5000 
                },
                followUpText: "Przytula się do ciebie. \"Dziękuję... to dla mnie wiele znaczy.\""
            },
            {
                text: "Weź wszystko i wyślij na kolejną",
                effects: { 
                    loyalty: -5, 
                    morale: -5, 
                    money: 8000 
                },
                followUpText: "Smutno kiwa głową i wraca do pracy."
            }
        ]
    },
    {
        id: "date_return_difficult",
        title: "Trudna Randka",
        templateDescription: "{girlName} wraca z randki zmęczona. Trzyma kopertę z pieniędzmi.\n\n\"Udało się... Chłopak był miły, ale nachalny.\"\n\nJej oczy błyszczą wilgocią.",
        conditions: { minGirls: 1 },
        chance: 4,
        cooldown: 72,
        targetJob: "school_dates",
        choices: [
            {
                text: "Przytul ją i pochwal",
                effects: { 
                    loyalty: 10, 
                    morale: 15, 
                    money: 5000 
                },
                followUpText: "Przytula się i płacze. \"Dziękuję...\""
            },
            {
                text: "Weź pieniądze bez słowa",
                effects: { 
                    loyalty: -5, 
                    morale: -10, 
                    money: 10000 
                },
                followUpText: "Wygląda na zranioną."
            },
            {
                text: "Daj jej premię i wolny dzień (-¥5k)",
                cost: 5000,
                effects: {
                    loyalty: 20,
                    morale: 25,
                    money: 3000
                },
                followUpText: "Uśmiecha się przez łzy. \"Jesteś... dobry. Dziękuję.\""
            }
        ]
    },
    {
        id: "hostess_vip_client",
        title: "Klient VIP",
        templateDescription: "{girlName} zostaje zatrzymana przez bogatego biznesmena.\n\n\"Zapłacę 5x więcej, jeśli zostanie ze mną na całą noc.\"\n\nDziewczyna patrzy na ciebie niepewnie.",
        conditions: { minGirls: 1 },
        chance: 5,
        cooldown: 96,
        targetJob: "hostess",
        girlConditions: { minLewdness: 30 },
        choices: [
            {
                text: "Zgódź się (+dużo ¥, -morale, +lewdness)",
                effects: {
                    money: 50000,
                    morale: -15,
                    lewdness: 10,
                    loyalty: -5
                },
                followUpText: "{girlName} kiwa głową i idzie z mężczyzną..."
            },
            {
                text: "Odmów i zabierz ją do domu",
                effects: {
                    loyalty: 15,
                    morale: 10,
                    money: -5000
                },
                followUpText: "Dziewczyna wygląda na wdzięczną. \"Dziękuję, że mnie ochroniłeś.\""
            }
        ]
    },

    // ========================================================================
    // RANDOM GIRL EVENTS (targetRandomGirl)
    // ========================================================================
    {
        id: "girl_sick",
        title: "Dziewczyna Zachorowała",
        templateDescription: "{girlName} źle się czuje i nie może dziś pracować.\n\n\"Przepraszam... Chyba się przeziębiłam...\"\n\nJest blada i drży.",
        chance: 3,
        cooldown: 120,
        targetRandomGirl: true,
        choices: [
            {
                text: "Kup lekarstwa i pozwól odpocząć (-¥3k)",
                cost: 3000,
                effects: {
                    loyalty: 15,
                    morale: 20
                },
                followUpText: "Uśmiecha się słabo. \"Dziękuję... To miłe z twojej strony.\""
            },
            {
                text: "Każ jej pracować mimo wszystko",
                effects: {
                    loyalty: -20,
                    morale: -25,
                    money: 5000
                },
                followUpText: "Wyraźnie cierpi, ale idzie do pracy..."
            },
            {
                text: "Daj dzień wolny bez wynagrodzenia",
                effects: {
                    loyalty: 5,
                    morale: 5
                },
                followUpText: "Kiwa głową i wraca do łóżka."
            }
        ]
    },
    {
        id: "girl_birthday",
        title: "Urodziny",
        templateDescription: "Dziś są urodziny {girlName}!\n\n\"Nie myślałam, że ktoś pamięta...\"\n\nWygląda na zaskoczoną i wzruszoną.",
        chance: 1,
        cooldown: 720, // 30 days
        targetRandomGirl: true,
        choices: [
            {
                text: "Zorganizuj małe przyjęcie (-¥10k)",
                cost: 10000,
                effects: {
                    loyalty: 25,
                    morale: 30,
                    // Boost morale for all girls
                    customLog: {
                        message: "Przyjęcie urodzinowe podniosło morale wszystkich!",
                        type: "event"
                    }
                },
                followUpText: "Wszystkie dziewczyny bawią się świetnie! {girlName} płacze ze szczęścia."
            },
            {
                text: "Daj jej prezent (-¥5k)",
                cost: 5000,
                effects: {
                    loyalty: 15,
                    morale: 20
                },
                followUpText: "Uśmiecha się szeroko. \"To najlepszy prezent!\""
            },
            {
                text: "Złóż życzenia i kontynuuj pracę",
                effects: {
                    loyalty: -5,
                    morale: -10
                },
                followUpText: "Uśmiech znika z jej twarzy..."
            }
        ]
    },

    // ========================================================================
    // UNLOCK EVENTS (one-time progression)
    // ========================================================================
    {
        id: "unlock_hostess",
        title: "Oferta Hostess Bar",
        description: "Prawnik dzwoni: 'Mam lokal w Shibuya. Hostess bar. Potrzeba ¥1M gotówki na start, koszt przejęcia to ¥100k.'\n\nTo duża szansa na rozwój biznesu.",
        conditions: { 
            minMoney: 1000000, 
            minReputation: 20 
        },
        chance: 40,
        oneTime: true,
        choices: [
            {
                text: "Otwórz Bar (-¥100k)",
                cost: 100000,
                effects: { unlockJob: "hostess" },
                followUpText: "✅ Hostess Bar otwarty w Shibuya!",
                showAlert: true
            },
            {
                text: "Odmów",
                effects: {},
                followUpText: "Szansa przepadła."
            }
        ]
    },
    {
        id: "unlock_delivery",
        title: "Agencja Delivery",
        description: "Kobieta dzwoni: 'Widziałam twoje dziewczyny. Delivery health to przyszłość. Potrzebujesz minimum 3 dziewczyn i ochrony Yakuzy.'\n\nTo ryzykowny, ale dochodowy biznes.",
        conditions: { 
            minGirls: 3, 
            yakuza: true 
        },
        chance: 35,
        oneTime: true,
        choices: [
            {
                text: "Podpisz umowę",
                effects: { unlockJob: "delivery" },
                followUpText: "✅ Delivery Health dostępne!",
                showAlert: true
            },
            {
                text: "Odmów",
                effects: {},
                followUpText: "Może później..."
            }
        ]
    },
    {
        id: "unlock_soapland",
        title: "Propozycja Soapland",
        description: "Przedstawiciel Yakuzy: 'Masz kasę i dziewczyny. Czas na prawdziwy biznes - Soapland. Koszt: ¥2M.'\n\nTo otworzy drzwi do świata luksusu.",
        conditions: { 
            minMoney: 5000000,
            yakuza: true 
        },
        chance: 25,
        oneTime: true,
        choices: [
            {
                text: "Inwestuj (-¥2M)",
                cost: 2000000,
                effects: { unlockJob: "soapland" },
                followUpText: "✅ Soapland otwarty! Elita miasta teraz u ciebie.",
                showAlert: true
            },
            {
                text: "Odmów",
                effects: {},
                followUpText: "Za drogo..."
            }
        ]
    },
    {
        id: "unlock_vip",
        title: "Klub VIP",
        description: "Tajemniczy telefon: 'Słyszałem o tobie. Moi klienci potrzebują najlepszych. Usługi VIP - tylko dla elit. Potrzebuję minimum 5 dziewczyn gotowych na wszystko.'\n\nTo szczyt branży.",
        conditions: {
            minMoney: 10000000,
            minGirls: 5,
            minReputation: 70
        },
        chance: 15,
        oneTime: true,
        choices: [
            {
                text: "Otwórz Klub VIP (-¥5M)",
                cost: 5000000,
                effects: { 
                    unlockJob: "vip",
                    reputation: 20
                },
                followUpText: "✅ Usługi VIP dostępne! Jesteś na szczycie.",
                showAlert: true
            },
            {
                text: "Odmów",
                effects: {},
                followUpText: "Jeszcze nie jestem gotowy..."
            }
        ]
    },

    // ========================================================================
    // YAKUZA EVENTS
    // ========================================================================
    {
        id: "yakuza_offer",
        title: "Propozycja Yakuzy",
        description: "Mężczyzna w czarnym garniturze wchodzi do biura. Tatuaże na rękach.\n\n\"Prowadzisz interesujący biznes. Jestem Takeshi z klanu Yamaguchi. Ochrona za 15% zysków?\"\n\nPatrzy ci prosto w oczy.",
        conditions: { 
            minMoney: 100000, 
            minGirls: 4 
        },
        chance: 15,
        oneTime: true,
        choices: [
            {
                text: "Przyjmij (15% podatek, -20 risk, +10 rep)",
                effects: { 
                    yakuzaProtection: true, 
                    profitTax: 15, 
                    reputation: 10, 
                    risk: -20 
                },
                followUpText: "\"Mądra decyzja. Jesteś pod opieką.\" Uścisk dłoni przypieczętowuje układ.",
                showAlert: true
            },
            {
                text: "Odmów grzecznie",
                effects: { risk: 10 },
                followUpText: "\"Rozumiem. Jeśli zmienisz zdanie...\" Wychodzi spokojnie."
            }
        ]
    },
    {
        id: "yakuza_debt_collection",
        title: "Yakuza Pobiera Należność",
        description: "Takeshi pojawia się z dwoma gorylami.\n\n\"Czas na miesięczną opłatę. ¥50k.\"\n\nNie wygląda na kogoś, kto negocjuje.",
        conditions: { 
            yakuza: true,
            minMoney: 50000 
        },
        chance: 20,
        cooldown: 168, // ~week
        choices: [
            {
                text: "Zapłać ¥50k",
                cost: 50000,
                effects: { 
                    risk: -5 
                },
                followUpText: "\"Przyjemność robić z tobą interesy.\" Odchodzą."
            },
            {
                text: "Negocjuj (-reputation, -loyalty)",
                effects: {
                    reputation: -10,
                    loyalty: -10,
                    risk: 15
                },
                followUpText: "\"Nie lubię tego...\" Bierze pieniądze siłą i niszczy wyposażenie."
            }
        ]
    },

    // ========================================================================
    // RECRUITMENT EVENTS
    // ========================================================================
    {
        id: "recruit_student",
        title: "Nowa Uczennica",
        description: "Jedna z uczennic wygląda na zagubioną i zestresowaną. Słyszysz, że ma problemy finansowe.\n\nPorozmawiać z nią?",
        conditions: { 
            minReputation: 30, 
            minMoney: 50000 
        },
        chance: 2,
        cooldown: 100,
        choices: [
            {
                text: "Zaproponuj pomoc i pracę (-¥50k)",
                cost: 50000,
                effects: { 
                    addGirl: true, 
                    reputation: 5 
                },
                followUpText: "Dziewczyna kiwa głową z wdzięcznością. „Dziękuję… naprawdę potrzebowałam tej szansy.",
                showAlert: true
            },
            {
                text: "Zignoruj ją",
                effects: {},
                followUpText: "Odchodzisz. Dziewczyna zostaje sama w korytarzu."
            }
        ]
    },
    {
        id: "recruit_sisters",
        title: "Dwie Siostry",
        description: "Dwie dziewczyny, wyraźnie siostry, czekają przed twoim biurem.\n\n\"Słyszałyśmy, że pomagasz dziewczynom w trudnej sytuacji. Nasza matka jest chora... Potrzebujemy pieniędzy na leczenie.\"\n\nObydwie wyglądają na zdeterminowane.",
        conditions: {
            minReputation: 50,
            minMoney: 100000,
            minGirls: 3
        },
        chance: 1,
        cooldown: 200,
        choices: [
            {
                text: "Zatrudnij obie (-¥100k)",
                cost: 100000,
                effects: {
                    addGirls: 2,
                    reputation: 10,
                    customLog: {
                        message: "Dwie siostry dołączyły razem - ich więź jest silna!",
                        type: "recruit"
                    }
                },
                followUpText: "Siostry uśmiechają się przez łzy. \"Dziękujemy... Nie zawiodzie cię!\"",
                showAlert: true
            },
            {
                text: "Zatrudnij tylko starszą (-¥50k)",
                cost: 50000,
                effects: {
                    addGirl: true,
                    reputation: -5
                },
                followUpText: "Starsza siostra przyjmuje ofertę. Młodsza płacze."
            },
            {
                text: "Odmów",
                effects: {
                    reputation: -5
                },
                followUpText: "Odchodzą zrozpaczone..."
            }
        ]
    },

    // ========================================================================
    // CRISIS EVENTS
    // ========================================================================
    {
        id: "low_morale",
        title: "Kryzys Morale",
        description: "Dziewczyny są wyczerpane. Podczas zebrania kilka z nich grozi odejściem.\n\n\"To za dużo... Potrzebujemy przerwy albo czegoś więcej.\"\n\nSytuacja jest napięta.",
        conditions: { 
            minMorale: 0, 
            maxMorale: 35, 
            minMoney: 50000 
        },
        chance: 50,
        cooldown: 24,
        choices: [
            {
                text: "Daj premię wszystkim (-¥50k)",
                cost: 50000,
                effects: { 
                    morale: 20, 
                    loyalty: 10 
                },
                followUpText: "Atmosfera się poprawia. Dziewczyny dziękują."
            },
            {
                text: "Zorganizuj wyjazd spa (-¥100k)",
                cost: 100000,
                effects: {
                    morale: 35,
                    loyalty: 20,
                    reputation: 5
                },
                followUpText: "Weekend w spa! Wszystkie wracają zrelaksowane i wdzięczne."
            },
            {
                text: "Ignoruj",
                effects: { 
                    morale: -10, 
                    loyalty: -15, 
                    risk: 20 
                },
                followUpText: "Sytuacja pogarsza się... Dwie dziewczyny mówią o odejściu."
            }
        ]
    },
    {
        id: "police_raid_threat",
        title: "Pogłoski o Policji",
        description: "Dostajesz anonimowy telefon:\n\n\"Policja planuje nalot w przyszłym tygodniu. Mają cynk.\"\n\nTo może być poważne.",
        conditions: {
            minRisk: 60,
            minGirls: 3
        },
        chance: 15,
        cooldown: 200,
        choices: [
            {
                text: "Zapłać za informacje (-¥200k, -risk)",
                cost: 200000,
                effects: {
                    risk: -30
                },
                followUpText: "Dowiadujesz się szczegółów i unikasz nalotu."
            },
            {
                text: "Zawieś operacje na tydzień (-income)",
                effects: {
                    risk: -20,
                    money: -100000
                },
                followUpText: "Tydzień bez dochodów, ale bezpiecznie."
            },
            {
                text: "Zignoruj pogłoski",
                effects: {
                    risk: 20
                },
                followUpText: "Może to tylko straszenie..."
            }
        ]
    },
    {
        id: "girl_wants_to_leave",
        title: "Dziewczyna Chce Odejść",
        templateDescription: "{girlName} przychodzi do twojego biura z poważną miną.\n\n\"Myślę o odejściu. To nie jest życie, o którym marzyłam...\"\n\nWygląda na zdeterminowaną.",
        chance: 5,
        cooldown: 150,
        targetRandomGirl: true,
        girlConditions: {
            maxLoyalty: 40,
            maxMorale: 50
        },
        choices: [
            {
                text: "Podnieś jej wypłatę (-¥30k/month)",
                cost: 30000,
                effects: {
                    loyalty: 20,
                    morale: 15
                },
                followUpText: "Zastanawia się... \"Okej, dam temu jeszcze szansę.\""
            },
            {
                text: "Porozmawiaj i przekonaj ją",
                effects: {
                    loyalty: 10,
                    morale: 5
                },
                followUpText: "Twoje słowa działają. Zostaje, ale niepewnie."
            },
            {
                text: "Zagroź konsekwencjami",
                effects: {
                    loyalty: -30,
                    morale: -20,
                    risk: 15
                },
                followUpText: "Zostaje, ale wyraźnie cię nienawidzi."
            },
            {
                text: "Pozwól jej odejść",
                effects: {
                    removeGirl: true,
                    reputation: -5
                },
                followUpText: "{girlName} pakuje rzeczy i wychodzi..."
            }
        ]
    },

    // ========================================================================
    // RANDOM EVENTS
    // ========================================================================
    {
        id: "generous_customer",
        title: "Hojny Klient",
        description: "Bogaty biznesmen zostawia ogromny napiwek.\n\n\"Doskonała obsługa. To dla dziewczyn.\"\n\n+¥50,000!",
        conditions: {
            minReputation: 40
        },
        chance: 5,
        cooldown: 120,
        choices: [
            {
                text: "Oddaj dziewczynom",
                effects: {
                    money: 30000,
                    morale: 20,
                    loyalty: 15
                },
                followUpText: "Dziewczyny są zachwycone twoją uczciwością!"
            },
            {
                text: "Zatrzymaj dla siebie",
                effects: {
                    money: 50000,
                    morale: -10,
                    loyalty: -10
                },
                followUpText: "Dziewczyny dowiadują się i tracą do ciebie zaufanie..."
            },
            {
                text: "Połowa na pół",
                effects: {
                    money: 25000,
                    morale: 5,
                    loyalty: 5
                },
                followUpText: "Sprawiedliwy podział. Wszyscy zadowoleni."
            }
        ]
    },
    {
        id: "school_festival",
        title: "Festiwal Szkolny",
        description: "Seiran Academy organizuje coroczny festiwal kulturalny.\n\nTo szansa na rekrutację nowych dziewczyn lub poprawienie reputacji.",
        conditions: {
            minReputation: 20
        },
        chance: 3,
        cooldown: 720, // Once per month
        choices: [
            {
                text: "Wystaw stoisko z jedzeniem (-¥20k)",
                cost: 20000,
                effects: {
                    reputation: 15,
                    morale: 10
                },
                followUpText: "Festiwal to sukces! Reputacja szkoły rośnie."
            },
            {
                text: "Szukaj nowych dziewczyn",
                effects: {
                    addGirl: true,
                    reputation: 5
                },
                followUpText: "Spotykasz zdolną uczennicę zainteresowaną pracą."
            },
            {
                text: "Pomiń festiwal",
                effects: {},
                followUpText: "Festiwal odbywa się bez twojego udziału."
            }
        ]
    }
];

// ============================================================================
// SCHOOL INVESTMENTS
// ============================================================================

const SCHOOL_INVESTMENTS = [
    {
        id: "renovation",
        name: "Renowacja klas",
        cost: 100000,
        effects: { reputation: 5, grades: 10 },
        description: "Odśwież sale. +5 reputacji, +10 średnia ocen."
    },
    {
        id: "sports",
        name: "Obiekt sportowy",
        cost: 250000,
        effects: { reputation: 10, morale: 15 },
        description: "Boisko i siłownia. +10 reputacji, +15 morale wszystkim."
    },
    {
        id: "secret_rooms",
        name: "Tajne pokoje",
        cost: 500000,
        effects: { risk: -10 },
        description: "Ukryte pomieszczenia. -10 ryzyko."
    },
    {
        id: "library",
        name: "Nowoczesna biblioteka",
        cost: 150000,
        effects: { reputation: 8, grades: 15 },
        description: "Wykształcone dziewczyny = wyższa jakość. +8 reputacji, +15 ocen."
    },
    {
        id: "security_system",
        name: "System bezpieczeństwa",
        cost: 300000,
        effects: { risk: -15 },
        description: "Kamery i alarmy. -15 ryzyko."
    }
];
