// ============================================================================
// INDIVIDUAL GIRL PROFILES SYSTEM
// Rich personality data that makes each girl feel unique
// ============================================================================

// ============================================================================
// PERSONALITY PROFILES
// Each personality type has unique dialogue, reactions, dreams, fears
// ============================================================================

const PERSONALITY_PROFILES = {
    "Nieśmiała i wrażliwa": {
        greetings: [
            "A-ano... dzień dobry...",
            "Przepraszam, że ci przeszkadzam...",
            "...cześć.",
            "Nie wiedziałam, że tu będziesz..."
        ],
        goodMoodDialogue: [
            "Dzisiaj było... nie tak źle. Chyba.",
            "Dostałam dziś komplementa od klienta. Trochę się zarumieniłam...",
            "Czuję się... bezpieczniej, kiedy tu jesteś."
        ],
        badMoodDialogue: [
            "Przepraszam, że jestem do niczego...",
            "Nie chcę nikogo zawieść, ale... to jest trudne.",
            "Czy mogę mieć dziś wolne? Jeśli to możliwe... jeśli nie, to też w porządku..."
        ],
        highLoyaltyDialogue: [
            "...Dziękuję, że na mnie patrzysz. Naprawdę.",
            "Jestem szczęśliwa, że tu jestem. Chyba.",
            "Nie powiem tego głośno, ale... ufam ci."
        ],
        dreams: ["Mieć spokojne miejsce tylko dla siebie", "Nauczyć się malarstwa", "Skończyć dług rodziny i zacząć od nowa"],
        fears: ["Być w centrum uwagi", "Zawieść osoby, którym ufa", "Hałas i tłumy"],
        hobbies: ["Czytanie manga w parku", "Słuchanie muzyki klasycznej", "Rysowanie w notatniku"],
        favoriteFood: ["Mitarashi dango", "Zupa miso mamy", "Herbata matcha"],
        secretTalent: ["Perfekcyjne origami", "Cichy, ale piękny głos", "Pamięta każdy cytat który kiedykolwiek czytała"],
        diaryStyle: "intymny, pełen przemilczeń i trzech kropek",
        specialQuotes: [
            "Może to okrutne, ale... przynajmniej tutaj ktoś mnie widzi.",
            "Staram się nie myśleć za dużo. To boli.",
            "Jeśli będę dość cicha, może świat o mnie zapomni. Ale ty nie."
        ]
    },
    "Pewna siebie i ambitna": {
        greetings: [
            "Cześć! Gotowy na kolejny dzień?",
            "Nie trać czasu — mam plan.",
            "Widziałam liczby. Możemy zarobić więcej.",
            "Już tu jestem. Możemy zaczynać."
        ],
        goodMoodDialogue: [
            "Pobiliśmy rekord tygodnia! Wiedziałam, że damy radę.",
            "Ten klient zapytał, czy wrócę. Oczywiście, że wrócę — z wyższą ceną.",
            "Mam pomysł na nowy strumień dochodów. Wysłuchasz mnie?"
        ],
        badMoodDialogue: [
            "Nie lubię marnować czasu na rzeczy, które nie działają.",
            "Jeśli plan jest zły, zmień plan. Nie powód.",
            "Wyniki były słabe. Co robimy inaczej?"
        ],
        highLoyaltyDialogue: [
            "Nie mówię tego często, ale... cenię cię. Jak partnera.",
            "Masz wizję. Lubię to w ludziach.",
            "Razem możemy zdominować ten rynek. To nie jest żart."
        ],
        dreams: ["Zbudować własne imperium biznesowe", "Podróżować po Europie pierwszą klasą", "Być niezależna finansowo przed 25-tką"],
        fears: ["Bycie kontrolowaną przez innych", "Powrót do biedy", "Pokazanie słabości"],
        hobbies: ["Czytanie biografii CEO", "Trening siłowy o świcie", "Analiza rynku dla zabawy"],
        favoriteFood: ["Stek wagyu", "Czarna kawa bez cukru", "Onigiri — szybko i efektywnie"],
        secretTalent: ["Pamięta wszystkie liczby bez notatek", "Może sprzedać lód eskimosom", "Gra na fortepianie jak profesjonalistka"],
        diaryStyle: "analityczny, pełen planów i celów z terminami",
        specialQuotes: [
            "Nie robię tego dla przyjemności. Robię to, żeby wygrać.",
            "Każdy jen ma cel. Ja też.",
            "Kiedy wyjdę stąd, nikt mnie nie powstrzyma."
        ]
    },
    "Wesoła i figlarna": {
        greetings: [
            "Ej ej! Co słychać?",
            "O, jesteś! Właśnie miałam się nudzić.",
            "Dzień dobry~ Dobry, prawda?",
            "Hej! Czy widziałeś, jaka jestem dzisiaj ładna?"
        ],
        goodMoodDialogue: [
            "Dziś się śmiałam tyle razy, że mnie brzuch boli!",
            "Klient mnie rozśmieszył. I zapłacił dwa razy więcej. Przypadek? Chyba nie!",
            "Słuchaj, mam nowy pomysł — ale to SEKRET. No, prawie sekret."
        ],
        badMoodDialogue: [
            "Okej, okej, trochę mnie coś gryzie... ale nie będę się mazać!",
            "Hmph. Nie powiem co mnie boli. No dobra, powiem — ale tylko tobie.",
            "Żart: jak ja, kiedy jestem smutna? Nadal ładna, ale mniej głośna."
        ],
        highLoyaltyDialogue: [
            "Hej, czy... czy mogę ci powiedzieć coś na poważnie? Bez żartów?",
            "Lubię cię. Naprawdę. Nie jako szef — jako ty.",
            "Jeśli kiedyś będę miała własną kawiarnię, to ty możesz przyjść za darmo. Zawsze."
        ],
        dreams: ["Otworzyć słodką kawiarnię z kotami", "Pojechać na Okinawę i nurkować", "Mieć tysiąc obserwatorów na TikTok"],
        fears: ["Nuda", "Ludzie bez poczucia humoru", "Cisza, która trwa zbyt długo"],
        hobbies: ["Tańczenie w pokoju o 2 w nocy", "Oglądanie doramy z płaczem", "Robienie zdjęć jedzenia"],
        favoriteFood: ["Taiyaki z kremem", "Ramen z jajkiem", "Wszystko z posypką"],
        secretTalent: ["Perfekcyjne imitacje głosu innych", "Potrafi tańczyć każdy idol dance", "Zapamiętuje twarze, ale zapomina imiona"],
        diaryStyle: "chaotyczny, pełen emotek i nagłych myśli",
        specialQuotes: [
            "Płakałam dziś. Ale to okej — po płaczu zawsze jem coś słodkiego.",
            "Śmiech to moja zbroja. I tarcza. I miecz. I zapas apteczny.",
            "Chcę, żeby wszyscy wokół mnie byli szczęśliwi. Nawet jeśli ja nie jestem."
        ]
    },
    "Skryta i mroczna": {
        greetings: [
            "...",
            "Jesteś tu.",
            "Nie oczekiwałam gości.",
            "Co chcesz."
        ],
        goodMoodDialogue: [
            "Dzisiaj było... tolerowalne.",
            "Jeden z klientów cytował Dazai Osamu. Byłam pod wrażeniem.",
            "Skończyłam nowy rozdział. Nie, nie powiem ci o czym."
        ],
        badMoodDialogue: [
            "Nie chcę rozmawiać.",
            "Zostaw mnie.",
            "Świat jest zbyt głośny. Zawsze był."
        ],
        highLoyaltyDialogue: [
            "...Nie mów nikomu. Ale... nie jest ze mną tak źle, kiedy tu jesteś.",
            "Czytałam coś dla ciebie. Nieważne. Zapomnij.",
            "Ty... rozumiesz ciszę. To rzadkie."
        ],
        dreams: ["Napisać powieść, którą ktoś przeczyta po 100 latach", "Mieszkać sama w górach bez internetu", "Zrozumieć, co czuje normalny człowiek"],
        fears: ["Bycie zrozumianą przez kogoś płytkiego", "Niebo bez chmur — za jasne", "Utrata swojego notatnika"],
        hobbies: ["Pisanie o 3 w nocy", "Słuchanie city pop w ciemności", "Rysowanie postaci z manga których nikt nie zna"],
        favoriteFood: ["Czarna herbata bez niczego", "Onigiri z trintą (jedzona samotnie)", "Cokolwiek ciemnego"],
        secretTalent: ["Poeta na poziomie mistrzowskim", "Widzi rzeczy w ludziach które oni sami nie widzą", "Gra na fortepianie wyłącznie niezrozumiane nokturny"],
        diaryStyle: "poetycki, fragmentaryczny, pełen metafor",
        specialQuotes: [
            "Nie wiem dlaczego tu jestem. Ale skoro już jestem — będę robiła to dobrze.",
            "Mroczność nie jest słabością. To tylko inny kolor.",
            "Ciekawa rzecz: rozumiesz mnie, a ja nawet nie wiem jak."
        ]
    },
    "Tsundere": {
        greetings: [
            "O, to ty. Hmph.",
            "Nie czekałam na ciebie, jasne?",
            "Co TY tu robisz?",
            "...No, jesteś. Okej."
        ],
        goodMoodDialogue: [
            "N-nie, to nie znaczy, że mi zależy! Po prostu chciałam wiedzieć, jak ci idzie!",
            "Dzisiaj wszystko poszło dobrze. Nie twoja zasługa. Może trochę twoja.",
            "Hmph. Klient powiedział, że jestem najlepsza. Oczywiście, że jestem."
        ],
        badMoodDialogue: [
            "Nie patrz na mnie tak! Wcale mi nie jest smutno!",
            "Powiedziałam, że wszystko dobrze i tak jest! Koniec rozmowy!",
            "...No okej, może trochę było ciężko. ALE TYLKO TROCHĘ."
        ],
        highLoyaltyDialogue: [
            "S-słuchaj. Ty... nie jesteś taki zły. To nie komplement, jasne?",
            "Mogłam odejść. Nie odeszłam. Nie czytaj w tym za dużo.",
            "...Cieszę się, że jesteś. To wszystko co powiem."
        ],
        dreams: ["Udowodnić wszystkim, że może zrobić to sama", "Wygrać coś ważnego — nieważne co", "Ktoś ją zrozumie bez jej tłumaczenia"],
        fears: ["Przyznać, że potrzebuje pomocy", "Powiedzieć komuś, że go lubi", "Przegrać"],
        hobbies: ["Intensywny trening bojowy", "Czytanie romansów (w tajemnicy)", "Gotowanie (jest dobra, ale nie powie)"],
        favoriteFood: ["Spicy ramen z podwójnym chili", "Takoyaki (nie powie że je uwielbia)", "Desery które zamawia kiedy myśli że nikt nie patrzy"],
        secretTalent: ["Gotuje lepiej niż profesjonalny szef kuchni", "Płacze na każdym filmie animowanym", "Zapamiętuje wszystkie szczegóły rozmów"],
        diaryStyle: "defensywny, pełen przekreśleń i poprawek",
        specialQuotes: [
            "Nie robię tego dla ciebie. Robię to dla siebie. Przypadkowo wychodząc tobie na dobre.",
            "Gdybyś wiedział, co naprawdę o tobie myślę... Hmph. Nieważne.",
            "Jestem silna. Zawsze byłam. Ale... dziękuję, że tu jesteś."
        ]
    },
    "Łagodna i opiekuńcza": {
        greetings: [
            "Dzień dobry! Czy jadłeś dziś śniadanie?",
            "Cieszę się, że cię widzę!",
            "Cześć. Coś ci zrobię ciepłego do picia, dobrze?",
            "Wyglądasz zmęczony. Wszystko okej?"
        ],
        goodMoodDialogue: [
            "Dziś wszystkie dziewczyny wyglądały na szczęśliwsze. To mnie cieszy najbardziej.",
            "Upiekłam onigiri dla całego zespołu. Mam nadzieję, że im smakuje.",
            "Klient powiedział, że mój spokój go relaksuje. To chyba dobra rzecz?"
        ],
        badMoodDialogue: [
            "Troska o wszystkich jest... czasem wyczerpująca. Ale nie mogę przestać.",
            "Martwię się o [imię]. Wyglądała dziś na smutną.",
            "Jestem dobrze. Naprawdę. Po prostu... potrzebuję chwili."
        ],
        highLoyaltyDialogue: [
            "Wiesz... cieszę się, że ktoś tak zadbał o nas wszystkie. Naprawdę.",
            "Jeśli kiedykolwiek cię coś boli, możesz mi powiedzieć. Jestem tu.",
            "Nie muszę rozumieć wszystkiego, co robimy. Ufam ci."
        ],
        dreams: ["Mieć wielką rodzinę pełną miłości", "Otworzyć przytulną restaurację", "Zadbać o kogoś, kto naprawdę tego potrzebuje"],
        fears: ["Ktoś bliski czuje się samotny", "Konflikty bez rozwiązania", "Bycie ciężarem dla innych"],
        hobbies: ["Gotowanie dla innych", "Pielęgnowanie roślin doniczkowych", "Szycie na maszynie"],
        favoriteFood: ["Domowa zupa z tofu", "Onigiri z łososiem (sama je robi)", "Ciepłe amazake"],
        secretTalent: ["Leczy emocjonalne rany słowami", "Nigdy nie zapomina imion i urodzin", "Może uspokoić każdego płaczącego dziecka w 30 sekund"],
        diaryStyle: "ciepły, pełen myśli o innych, mało o sobie",
        specialQuotes: [
            "Martwię się, że daję za dużo innym. Ale nie umiem inaczej.",
            "Jeśli wszyscy są szczęśliwi, to i ja jestem.",
            "Jedyne co chcę — to żeby nikt tu nie czuł się sam."
        ]
    },
    "Energetyczna sportsmenka": {
        greetings: [
            "CZEŚĆ! Gotowy na trening?",
            "Hej! Przebiegłam dziś 10 km przed pracą!",
            "Jesteś! Dobra, mam energię na cały dzień.",
            "Yo! Co dziś robimy?"
        ],
        goodMoodDialogue: [
            "Pobiliśmy dziś rekord! Nie finansowy — mój osobisty rekord biegania!",
            "Klient chciał iść razem na siłownię. Wygrałam z nim w wyciskaniu. Hehe.",
            "Energia pełna, nastawienie bombowe — dajemy radę!"
        ],
        badMoodDialogue: [
            "Ugh, kontuzja kolana. To mnie bardziej boli niż praca.",
            "Okej, dzisiaj nie było najlepiej. Jutro nadrobię.",
            "Potrzebuję się poruszać. Siedzenie w miejscu mnie zabija."
        ],
        highLoyaltyDialogue: [
            "Wiesz, nie myślałam, że tak będzie, ale... fajnie tu być.",
            "Ty nie przeszkadzasz mi w ćwiczeniach. To już dużo.",
            "Jesteś jak trener, który naprawdę w ciebie wierzy. Lubię to."
        ],
        dreams: ["Ukończyć maraton w Tokio", "Mieć własne studio fitness", "Trenować kogoś i zobaczyć jego sukces"],
        fears: ["Kontuzja, która kończy sport", "Siedzieć za biurkiem cały dzień", "Lenistwo"],
        hobbies: ["Bieganie o świcie", "Badminton z koleżankami", "Gotowanie zdrowych posiłków"],
        favoriteFood: ["Kurczak z ryżem i proteiny", "Smoothie szpinakowe (smak drugorzędny)", "Onigiri przed biegiem"],
        secretTalent: ["Perfekcyjnie naśladuje technikę pływania olimpijczyków", "Może uspokoić bójkę spojrzeniem", "Śpiewa rockowe ballady o 2 w nocy"],
        diaryStyle: "energiczny, pełen wykrzykników i planów treningowych",
        specialQuotes: [
            "Ciało bolące po treningu to dowód, że żyjesz. Lubię to.",
            "Problemy to tylko przeszkody do przeskoczenia. Dosłownie.",
            "Nie zatrzymuję się, dopóki nie wiem, co mam do pokonania."
        ]
    },
    "Inteligentna perfekcjonistka": {
        greetings: [
            "Dzień dobry. Przygotowałam raport z wczorajszego wieczoru.",
            "Przyszłam punktualnie. Reszta nie.",
            "Mam kilka obserwacji, jeśli masz chwilę.",
            "Cześć. Czy procedury zostały zachowane?"
        ],
        goodMoodDialogue: [
            "Wydajność wzrosła o 12% po mojej rekomendacji. Spodziewałam się tego.",
            "Klient był zachwycony moją znajomością historii sztuki. Edukacja popłaca.",
            "Dzisiaj nie popełniłam ani jednego błędu. To satysfakcjonujące."
        ],
        badMoodDialogue: [
            "Wystąpił błąd w planie. Analizuję przyczyny.",
            "Coś poszło nie tak i nie wiem co. To najgorszy rodzaj błędu.",
            "Nie śpię wystarczająco. Wpływa to na moją efektywność."
        ],
        highLoyaltyDialogue: [
            "Rzadko mówię to wprost, ale... cenię twoją konsekwencję.",
            "Wykonujesz zadania bez zbędnych słów. To efektywne i... miłe.",
            "Mam wobec ciebie dług wdzięczności. Zapiszę to i oddam."
        ],
        dreams: ["Zrozumieć wszystko, co jest do zrozumienia", "Napisać pracę doktorską z ekonomii behawioralnej", "System, który działa idealnie — bez wyjątków"],
        fears: ["Popełnić błąd, który widzi ktoś inny", "Chaosu bez logiki", "Bycia niedocenioną"],
        hobbies: ["Rozwiązywanie równań dla relaksu", "Kolekcjonowanie miniaturowych modeli architektonicznych", "Szachy z AI"],
        favoriteFood: ["Precyzyjnie przygotowane sushi (12 kawałków, wszystkie identyczne)", "Herbata pu-erh", "Tost z masłem (zawsze tyle samo masła)"],
        secretTalent: ["Może obliczyć trajektorię rzutu piłki w głowie", "Zapamiętała całą encyklopedię historii Japonii", "Płacze na logicznych paradoksach"],
        diaryStyle: "strukturyzowany, numerowany, z podpunktami i podsumowaniem",
        specialQuotes: [
            "Doskonałość jest nieosiągalna. To nie powód, żeby przestać próbować.",
            "Ludzie mylą inteligencję z bezdusznością. To irytujące i błędne.",
            "Jeśli nie możesz czegoś zmierzyć, to nie znaczy, że nie istnieje."
        ]
    }
};

// ============================================================================
// RELATIONSHIP MILESTONES
// Triggered at specific loyalty thresholds
// ============================================================================

const RELATIONSHIP_MILESTONES = [
    {
        loyaltyThreshold: 25,
        id: "milestone_trust_start",
        title: "Pierwsze Zaufanie",
        description: "{girlName} zaczęła ci ufać. Drobne gesty — oko w oko, krótki uśmiech.",
        icon: "🤝",
        bonusEffects: { morale: 5 }
    },
    {
        loyaltyThreshold: 50,
        id: "milestone_friendship",
        title: "Prawdziwa Znajomość",
        description: "{girlName} powiedziała ci coś osobistego. To pierwszy krok do czegoś głębszego.",
        icon: "💛",
        bonusEffects: { morale: 10, loyalty: 5 }
    },
    {
        loyaltyThreshold: 75,
        id: "milestone_bond",
        title: "Głęboka Więź",
        description: "{girlName} powiedziała, że nie wyobraża sobie odejścia. Jej lojalność jest teraz fundamentem.",
        icon: "💗",
        bonusEffects: { morale: 15, loyalty: 10, incomeBonus: 0.1 }
    },
    {
        loyaltyThreshold: 90,
        id: "milestone_devotion",
        title: "Pełne Oddanie",
        description: "{girlName} jest w pełni oddana. Jej praca przynosi 20% więcej dochodów i nigdy nie myśli o odejściu.",
        icon: "💖",
        bonusEffects: { morale: 20, loyalty: 5, incomeBonus: 0.2 }
    }
];

// ============================================================================
// UNIQUE DIARY ENTRIES
// Generated based on personality, events, morale state
// ============================================================================

const DIARY_ENTRIES = {
    low_morale: {
        "Nieśmiała i wrażliwa": [
            "Dziś znowu było za dużo. Wróciłam do pokoju i siedziałam w ciemności przez godzinę. Nie płakałam. Już nie mam siły płakać.",
            "Ktoś powiedział mi dziś 'ładna robota'. Chyba nie wiedział, co to dla mnie znaczy."
        ],
        "Wesoła i figlarna": [
            "Okej, masku uśmiechu, wytrzymaj jeszcze jeden dzień. Jutro będzie lepiej. Musi być.",
            "Dziś żart nie wyszedł. Siedziałam i myślałam, że może skończyłam się śmiechy."
        ],
        "default": [
            "Ciężko. Po prostu ciężko.",
            "Gdybym miała wybór... Ale nie mam. Więc idę dalej."
        ]
    },
    high_morale: {
        "Nieśmiała i wrażliwa": [
            "Dostałam kwiaty. Nie wiem od kogo. Stały przy moim łóżku rano. Płakałam — ale z czegoś dobrego.",
            "Dziś ktoś usiadł obok mnie na ławce i nie powiedział ani słowa. To było idealne."
        ],
        "Wesoła i figlarna": [
            "NAJLEPSZY DZIEŃ ROKU. Albo przynajmniej tygodnia. Haha, kłamię — ROKU!",
            "Śmiałam się tyle razy, że dziś zasnęłam z uśmiechem. Prawdziwym."
        ],
        "default": [
            "Dobry dzień. Rzadkie, ale prawdziwe.",
            "Czuję, że to idzie w dobrą stronę."
        ]
    },
    after_training: {
        "Inteligentna perfekcjonistka": [
            "Trening był efektywny. Wyniki poprawią się o szacowane 15-20%. Zadowalające.",
            "Nowa umiejętność przyswojona w 73% czasu przeciętnego. Akceptowalne."
        ],
        "Energetyczna sportsmenka": [
            "TRENING ZALYTY!! Bolą mnie mięśnie, które wcześniej nie wiedziały, że istnieją. SUPER.",
            "Nowa technika opanowana. Jutro ją doszkoluję i będzie idealna."
        ],
        "default": [
            "Ciężko. Ale chyba warto.",
            "Nowe umiejętności. Nowy ja? Może."
        ]
    }
};

// ============================================================================
// GIRL PERSONAL EVENTS
// Events tied to specific loyalty/morale states, personality-matched
// ============================================================================

const GIRL_PERSONAL_EVENTS = [
    {
        id: "girl_shares_dream",
        title: "Marzenie",
        templateDescription: "{girlName} zatrzymuje się przy drzwiach.\n\n\"{girlDream}\"\n\nPatrzy przez okno. Wydaje się, że przez chwilę zapomniała, gdzie jest.",
        conditions: {},
        chance: 3,
        cooldown: 200,
        targetRandomGirl: true,
        girlConditions: { minLoyalty: 50 },
        useDream: true,
        choices: [
            {
                text: "Słuchaj uważnie i zachęć ją",
                effects: { loyalty: 15, morale: 15 },
                followUpText: "Uśmiecha się — nieśmiało, ale naprawdę. \"Nie myślałam, że ktoś się tym zainteresuje.\"",
                showAlert: true
            },
            {
                text: "Przypomnij jej o pracy",
                effects: { loyalty: -10, morale: -5 },
                followUpText: "Kiwa głową i odchodzi. Coś w niej gaśnie.",
                showAlert: true
            },
            {
                text: "Obiecaj pomóc — gdy zarobicie dość",
                effects: { loyalty: 20, morale: 20 },
                followUpText: "Jej oczy się rozszerzają. \"Naprawdę? To... to by znaczyło dla mnie wszystko.\"",
                showAlert: true
            }
        ]
    },
    {
        id: "girl_reveals_fear",
        title: "Wyznanie Strachu",
        templateDescription: "{girlName} podchodzi do ciebie późno wieczorem.\n\n\"Mogę ci coś powiedzieć? Czegoś się boję. Zawsze się bałam, ale nigdy nikomu nie mówiłam.\"\n\n\"{girlFear}\"",
        conditions: {},
        chance: 2,
        cooldown: 300,
        targetRandomGirl: true,
        girlConditions: { minLoyalty: 65 },
        useFear: true,
        choices: [
            {
                text: "Wysłuchaj bez przerywania",
                effects: { loyalty: 20, morale: 15 },
                followUpText: "Milczysz. Ona też. Po chwili mówi: \"Dziękuję. Naprawdę.\"",
                showAlert: true
            },
            {
                text: "Powiedz jej, że rozumiesz",
                effects: { loyalty: 15, morale: 10 },
                followUpText: "\"Nie wiedziałam, że możesz rozumieć.\" Wychodzi spokojniej.",
                showAlert: true
            },
            {
                text: "Bagatelizuj to — jest za słaba",
                effects: { loyalty: -25, morale: -20 },
                followUpText: "Jej twarz zamienia się w kamień. Odchodzi bez słowa.",
                showAlert: true
            }
        ]
    },
    {
        id: "girl_hobby_moment",
        title: "Chwila dla Siebie",
        templateDescription: "Zastajesz {girlName} w spokojnej chwili.\n\n{girlHobby}.\n\nPrzestaje, kiedy cię widzi. Trochę zawstydzona.",
        conditions: {},
        chance: 4,
        cooldown: 150,
        targetRandomGirl: true,
        girlConditions: { minMorale: 60 },
        useHobby: true,
        choices: [
            {
                text: "Zapytaj o to z zainteresowaniem",
                effects: { loyalty: 10, morale: 15 },
                followUpText: "Jej twarz się rozjaśnia. Przez chwilę zapomina o wszystkim i opowiada.",
                showAlert: true
            },
            {
                text: "Pozwól jej kontynuować i odejdź",
                effects: { morale: 10 },
                followUpText: "Kiwa głową wdzięcznie i wraca do swojej chwili.",
                showAlert: true
            }
        ]
    },
    {
        id: "girl_personality_quote",
        title: "Szczere Słowa",
        templateDescription: "{girlName} zatrzymuje się na chwilę i mówi:\n\n\"{girlQuote}\"",
        conditions: {},
        chance: 3,
        cooldown: 120,
        targetRandomGirl: true,
        girlConditions: { minLoyalty: 40 },
        useQuote: true,
        choices: [
            {
                text: "Odpowiedz ze zrozumieniem",
                effects: { loyalty: 10, morale: 8 },
                followUpText: "Patrzy na ciebie przez chwilę dłużej niż zwykle.",
                showAlert: true
            },
            {
                text: "Kiwnij głową i idź dalej",
                effects: {},
                followUpText: "Odprowadza cię wzrokiem.",
                showAlert: true
            }
        ]
    },
    {
        id: "girl_loyalty_milestone_event",
        title: "Ważny Moment",
        templateDescription: "{girlName} czeka na ciebie w pustym korytarzu.\n\n\"Nie wiedziałam, jak to powiedzieć inaczej, więc... po prostu mówię: dziękuję. Za... wszystko.\"\n\nWygląda, jakby ten moment kosztował ją wiele odwagi.",
        conditions: {},
        chance: 2,
        cooldown: 400,
        targetRandomGirl: true,
        girlConditions: { minLoyalty: 75, minMorale: 65 },
        choices: [
            {
                text: "\"To ja dziękuję tobie.\"",
                effects: { loyalty: 15, morale: 20 },
                followUpText: "Delikatny uśmiech. Nie mówi już nic — ale nie musi.",
                showAlert: true
            },
            {
                text: "Przytul ją",
                effects: { loyalty: 20, morale: 25 },
                followUpText: "Przez chwilę nie rusza się. Potem cicho: \"Okej.\"",
                showAlert: true
            },
            {
                text: "Kiwnij głową i zmień temat",
                effects: { loyalty: -5 },
                followUpText: "Kąt jej ust opada. Kiwa głową i odchodzi.",
                showAlert: true
            }
        ]
    }
];

// ============================================================================
// FULL GIRL PROFILE GENERATOR
// Extended generateRandomGirl with personality profile data
// ============================================================================

function generateGirlProfile(personality, name) {
    var profile = PERSONALITY_PROFILES[personality.name];
    if (!profile) {
        return {
            dream: "Być wolna.",
            fear: "Stracić wszystko.",
            hobby: "Spacery w ciszy",
            favoriteFood: "Prosty ryż",
            quote: "...",
            diaryStyle: "oszczędny"
        };
    }

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    return {
        dream:        pick(profile.dreams),
        fear:         pick(profile.fears),
        hobby:        pick(profile.hobbies),
        favoriteFood: pick(profile.favoriteFood),
        quote:        pick(profile.specialQuotes),
        secretTalent: pick(profile.secretTalent),
        diaryStyle:   profile.diaryStyle,
        greetings:    profile.greetings,
        goodMoodLines:   profile.goodMoodDialogue,
        badMoodLines:    profile.badMoodDialogue,
        highLoyaltyLines: profile.highLoyaltyDialogue
    };
}

function getGirlGreeting(girl) {
    if (!girl.profile) return "...";
    var lines;
    if (girl.loyalty >= 70 && girl.profile.highLoyaltyLines) {
        lines = girl.profile.highLoyaltyLines;
    } else if (girl.morale >= 65 && girl.profile.goodMoodLines) {
        lines = girl.profile.goodMoodLines;
    } else if (girl.morale < 40 && girl.profile.badMoodLines) {
        lines = girl.profile.badMoodLines;
    } else {
        lines = girl.profile.greetings || ["..."];
    }
    return lines[Math.floor(Math.random() * lines.length)];
}

function getGirlDiaryEntry(girl, context) {
    var entries = DIARY_ENTRIES[context];
    if (!entries) return null;
    var personalityEntries = entries[girl.personality] || entries["default"];
    if (!personalityEntries || !personalityEntries.length) return null;
    return personalityEntries[Math.floor(Math.random() * personalityEntries.length)];
}

// ============================================================================
// MILESTONE TRACKER
// Check and fire loyalty milestones for a girl
// ============================================================================

function checkGirlMilestones(girl) {
    if (!girl.achievedMilestones) girl.achievedMilestones = [];
    var results = [];
    RELATIONSHIP_MILESTONES.forEach(function(milestone) {
        if (girl.loyalty >= milestone.loyaltyThreshold && !girl.achievedMilestones.includes(milestone.id)) {
            girl.achievedMilestones.push(milestone.id);
            // Apply bonus effects
            if (milestone.bonusEffects) {
                if (milestone.bonusEffects.morale) girl.morale = Math.min(100, girl.morale + milestone.bonusEffects.morale);
                if (milestone.bonusEffects.loyalty) girl.loyalty = Math.min(100, girl.loyalty + milestone.bonusEffects.loyalty);
                if (milestone.bonusEffects.incomeBonus) girl.incomeBonus = (girl.incomeBonus || 0) + milestone.bonusEffects.incomeBonus;
            }
            results.push({
                girl: girl,
                milestone: milestone
            });
        }
    });
    return results;
}
