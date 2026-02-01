const FIRST_NAMES = ['Hana','Aiko','Yui','Rin','Nao','Saki','Mei','Sakura','Yuki','Akari','Haruka','Miyu','Noa','Hina','Sara','Aya','Emi','Riko','Yuna','Kana','Taiga','Asuka'];
const LAST_NAMES = ['Tanaka','Nakamura','Kobayashi','Sato','Ito','Kato','Suzuki','Yamamoto','Watanabe','Takahashi','Yamada','Sasaki','Yamaguchi','Matsumoto','Inoue','Aisaka'];

const PERSONALITIES = [
    {name: "Nieśmiała i wrażliwa",    conversation: [15,35], lewdness: [5,15], grades: [80,98], morale: [45,70], traits: ["shy","kind"]},
    {name: "Pewna siebie i ambitna",  conversation: [45,70], lewdness: [15,35], grades: [70,90], morale: [60,85], traits: ["confident","ambitious","athletic"]},
    {name: "Wesoła i figlarna",       conversation: [35,60], lewdness: [20,40], grades: [60,85], morale: [70,95], traits: ["cheerful","playful","cute"]},
    {name: "Skryta i mroczna",        conversation: [10,30], lewdness: [25,50], grades: [75,95], morale: [30,55], traits: ["otaku","genius","quiet"]},
    {name: "Tsundere",                conversation: [30,55], lewdness: [15,45], grades: [65,90], morale: [50,75], traits: ["tsundere","proud","competitive"]},
    {name: "Łagodna i opiekuńcza",    conversation: [40,65], lewdness: [10,25], grades: [70,92], morale: [65,90], traits: ["kind","caring","reliable"]},
    {name: "Energetyczna sportsmenka",conversation: [25,50], lewdness: [20,40], grades: [55,80], morale: [75,95], traits: ["athletic","energetic","tomboy"]},
    {name: "Inteligentna perfekcjonistka", conversation: [50,75], lewdness: [10,30], grades: [90,100], morale: [40,70], traits: ["perfectionist","bookworm"]}
];

const BACKSTORIES = {
    "Nieśmiała i wrażliwa": [
        "Pochodzi z biednej rodziny, ojciec stracił pracę. Bardzo niepewna siebie.",
        "Straciła matkę w młodości, mieszka tylko z ojcem alkoholikiem.",
        "Nowa uczennica, przeniosła się z prowincji, nie ma przyjaciół."
    ],
    "Pewna siebie i ambitna": [
        "Popularna w szkole, ale rodzina ukrywa problemy finansowe.",
        "Córka byłego biznesmena, który zbankrutował.",
        "Chce zostać influencerką lub modelką, potrzebuje szybkich pieniędzy."
    ],
};
