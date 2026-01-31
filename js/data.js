// Data structures for easy extension
const names = ['Sakura', 'Yuki', 'Mei', 'Aiko', 'Hana', 'Rin', 'Sora', 'Nami', 'Yui', 'Mio']; // Add more names here
const personalities = ['Shy', 'Ambitious', 'Outgoing', 'Loyal', 'Rebellious']; // Add more
const traits = ['Virgin', 'Ambitious', 'Athletic', 'Intelligent', 'Seductive']; // Add more
const jobs = [
    { name: 'School Dates', reqLewd: 5, baseIncome: 1000, risk: 5 },
    { name: 'Hostess', reqLewd: 30, baseIncome: 5000, risk: 20 },
    { name: 'VIP Services', reqLewd: 85, baseIncome: 20000, risk: 50 }
]; // Add new jobs here
const cities = ['Tokyo', 'Osaka', 'Kyoto']; // Add more cities
const schools = [{ name: 'Seiran', cost: 0 }]; // Starting school, add more
const businesses = [{ name: 'Club Velvet', cost: 5000000, unlocks: 'Hostess' }]; // Add more
const eventsData = [
    { id: 'dateReturn', chance: 0.1, text: 'A girl returns from a date.', choices: [{ text: 'Comfort', effect: 'morale+10' }, { text: 'Ignore', effect: 'loyalty-5' }] }
    // Add more events here, with chains via ids
];
const statTypes = ['loyalty', 'lewdness', 'grades', 'morale']; // Add new stat types
const skills = ['conversation', 'handjob', 'blowjob', 'vaginal', 'anal']; // Add new skills
