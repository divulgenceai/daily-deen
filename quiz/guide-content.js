const quran = (verse) => ({ label: `Qur'an ${verse.replace("/", ":")}`, href: `https://quran.com/${verse}` });
const bukhari = (number) => ({ label: `Bukhari ${number}`, href: `https://sunnah.com/bukhari:${number}` });
const muslim = (number) => ({ label: `Muslim ${number}`, href: `https://sunnah.com/muslim:${number}` });
const ibnMajah = (number) => ({ label: `Ibn Majah ${number}`, href: `https://sunnah.com/ibnmajah:${number}` });
const abuDawud = (number) => ({ label: `Abi Dawud ${number}`, href: `https://sunnah.com/abudawud:${number}` });

export const pathNotes = {
  men: {
    label: "Men's guide",
    clothing: {
      title: "Clothing for prayer",
      body: "Wear clean, modest clothing that covers the body appropriately for prayer. The report about a lower garment hanging below the ankles is a serious warning; it does not itself say that the prayer must be repeated.",
      sources: [quran("7/31"), bukhari(5787)],
    },
    additional: {
      title: "Lower garment warning",
      body: "Bukhari warns about a man's lower garment below the ankles. Do not turn this warning into an automatic prayer-invalidity ruling; the cited report does not state one.",
      sources: [bukhari(5787)],
    },
  },
  women: {
    label: "Women's guide",
    clothing: {
      title: "Clothing for prayer",
      body: "Wear clean, modest prayer clothing and cover the head with a khimar. Scholars discuss finer coverage details differently; ask a qualified teacher about a specific case.",
      sources: [quran("7/31"), abuDawud(641)],
    },
    additional: {
      title: "Menstruation",
      body: "Prayer is paused during menstruation. When it ends, bathe and resume prayer. Missed prayers from the menstrual period were not ordered to be made up in Aisha's report.",
      sources: [bukhari(331), bukhari(321)],
    },
  },
};

export const coreSteps = [
  {
    title: "Stand and begin",
    body: "Face the Qibla, stand for the prayer, and begin with the opening takbir: Allahu akbar.",
    sources: [quran("2/144"), bukhari(793)],
  },
  {
    title: "Recite while standing",
    body: "Recite al-Fatiha, then another Qur'an passage in the first rak'ah. A short passage such as al-Ikhlas is one example. Follow your imam where applicable; schools differ on recitation behind an imam.",
    sources: [quran("1"), quran("112"), bukhari(756), bukhari(759)],
  },
  {
    title: "Bow, then stand upright",
    body: "Say takbir and bow calmly. Rise until fully upright. The Prophet's reported words on rising include Sami' Allahu liman hamidah and, while standing, Rabbana laka al-hamd.",
    sources: [bukhari(793), bukhari(789)],
  },
  {
    title: "Two prostrations",
    body: "Say takbir and prostrate calmly. Sit calmly between the two prostrations, then prostrate calmly again. Do not rush the upright or seated positions.",
    sources: [bukhari(793), bukhari(789), ibnMajah(897)],
  },
  {
    title: "Second rak'ah",
    body: "Stand for the second rak'ah and repeat the standing recitation, bowing, upright standing, and two prostrations with a calm sitting between them.",
    sources: [bukhari(793), bukhari(759)],
  },
  {
    title: "Final sitting and ending",
    body: "After the second rak'ah, sit for the tashahhud. In a two-rak'ah prayer this is the final sitting: recite the tashahhud, send blessings on the Prophet, then end with taslim to the right and left.",
    sources: [bukhari(831), bukhari(3370), ibnMajah(914)],
  },
];

export const obligatoryPrayers = [
  { name: "Fajr", count: 2, sources: [bukhari(663)] },
  { name: "Dhuhr", count: 4, sources: [muslim("687a"), bukhari(759)] },
  { name: "Asr", count: 4, sources: [muslim("687a"), bukhari(759)] },
  { name: "Maghrib", count: 3, sources: [bukhari(1091)] },
  { name: "Isha", count: 4, sources: [muslim("687a"), bukhari(1091)] },
];

export const recitations = [
  {
    title: "Opening and movement takbir",
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu akbar",
    meaning: "Allah is greater.",
    sources: [bukhari(789), bukhari(793)],
  },
  {
    title: "Al-Fatiha",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    transliteration: "Bismillahi r-Rahmani r-Rahim. Al-hamdu lillahi Rabbi l-'alamin. Ar-Rahmani r-Rahim. Maliki yawmi d-din. Iyyaka na'budu wa iyyaka nasta'in. Ihdina s-sirata l-mustaqim. Sirata lladhina an'amta 'alayhim, ghayri l-maghdubi 'alayhim wa la d-dallin.",
    meaning: "Praise Allah, the Lord of all worlds; worship Him alone and ask Him to guide us to the straight path.",
    sources: [quran("1"), bukhari(756)],
  },
  {
    title: "Example additional passage: al-Ikhlas",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    transliteration: "Qul huwa Allahu ahad. Allahu s-samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",
    meaning: "Allah is One, self-sufficient, without offspring or parent, and without equal.",
    sources: [quran("112"), bukhari(759)],
  },
  {
    title: "A reported remembrance in bowing and prostration",
    arabic: "سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي",
    transliteration: "Subhanaka Allahumma Rabbana wa bi-hamdika, Allahumma ghfir li.",
    meaning: "Glory and praise be to You, our Lord; forgive me.",
    sources: [bukhari(794)],
  },
  {
    title: "On rising from bowing",
    arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا لَكَ الْحَمْدُ",
    transliteration: "Sami'a Allahu liman hamidah. Rabbana laka l-hamd.",
    meaning: "Allah hears the one who praises Him. Our Lord, all praise is Yours.",
    sources: [bukhari(789)],
  },
  {
    title: "Between the two prostrations",
    arabic: "رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي",
    transliteration: "Rabbi ghfir li, Rabbi ghfir li.",
    meaning: "My Lord, forgive me; my Lord, forgive me.",
    sources: [ibnMajah(897)],
  },
  {
    title: "Tashahhud",
    arabic: "التَّحِيَّاتُ لِلَّهِ، وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration: "At-tahiyyatu lillahi wa s-salawatu wa t-tayyibat. As-salamu 'alayka ayyuha n-nabiyyu wa rahmatullahi wa barakatuh. As-salamu 'alayna wa 'ala 'ibadillahi s-salihin. Ashhadu an la ilaha illa Allah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh.",
    meaning: "Greetings and good prayers belong to Allah; peace upon the Prophet and the righteous; testimony to Allah alone and Muhammad as His servant and messenger.",
    sources: [bukhari(831)],
  },
  {
    title: "Blessings on the Prophet",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahima, innaka Hamidun Majid. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammadin, kama barakta 'ala Ibrahima wa 'ala ali Ibrahima, innaka Hamidun Majid.",
    meaning: "Ask Allah to bless Muhammad and his family as He blessed Ibrahim and his family.",
    sources: [bukhari(3370)],
  },
  {
    title: "Taslim",
    arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
    transliteration: "As-salamu 'alaykum wa rahmatullah.",
    meaning: "Peace and Allah's mercy be upon you.",
    sources: [ibnMajah(914)],
  },
];

export function guideSections(path) {
  return [
    {
      title: "Prepare",
      lead: "Set the time, intention, cleanliness, clothing, and direction before beginning.",
      items: [
        { title: "Prayer time and intention", body: "Pray within the appointed time and form your intention for the prayer.", sources: [quran("4/103"), bukhari(1)] },
        { title: "Purification", body: "Make wudu when required. If in a state requiring major purification, perform ghusl before prayer. Intercourse requires ghusl for both men and women.", sources: [quran("5/6"), quran("4/43"), bukhari(291)] },
        { title: "Place and direction", body: "Choose a clean place, wear appropriate clothing, and face the Sacred Mosque in Makkah.", sources: [bukhari(220), quran("7/31"), quran("2/144")] },
        pathNotes[path].clothing,
        ...(path === "women" ? [pathNotes.women.additional] : []),
      ],
    },
    { title: "Two rak'ahs", lead: "Follow this sequence calmly from opening takbir to taslim.", items: coreSteps },
    {
      title: "Three or four",
      lead: "The first two rak'ahs stay in the same order. Continue before the final taslim.",
      patterns: obligatoryPrayers,
      items: [
        { title: "After rak'ah two", body: "Sit for the first tashahhud, then rise for the third rak'ah. Do not end with taslim yet.", sources: [bukhari(789), bukhari(1224), bukhari(831)] },
        { title: "Three rak'ahs", body: "For Maghrib, complete the third rak'ah, then make the final sitting, tashahhud, blessings, and taslim.", sources: [bukhari(1091), bukhari(831), bukhari(3370), ibnMajah(914)] },
        { title: "Four rak'ahs", body: "For Dhuhr, Asr, and Isha while resident, complete the third and fourth rak'ahs; make the final sitting and taslim after the fourth.", sources: [muslim("687a"), bukhari(789), bukhari(831), ibnMajah(914)] },
        { title: "Later standing recitation", body: "A report describes al-Fatiha with an additional surah in the first two rak'ahs of Dhuhr and Asr, and al-Fatiha in the later rak'ahs of Dhuhr. Details behind an imam vary by school.", sources: [bukhari(759), bukhari(776), bukhari(756)] },
      ],
    },
    { title: "Recitations", lead: "Arabic recitations with pronunciation help and short meanings.", recitations },
    {
      title: "Prophetic practices",
      lead: "Examples from sound reports; schools may classify individual details differently.",
      items: [
        { title: "Calm movement", body: "Pause in bowing, upright standing, sitting, and prostration rather than rushing between them.", sources: [bukhari(793)] },
        { title: "Takbir between positions", body: "The Prophet is reported to have said takbir when moving into bowing and prostration and when rising from prostration.", sources: [bukhari(789)] },
        { title: "Additional recitation", body: "In the first two rak'ahs of Dhuhr and Asr, an additional surah after al-Fatiha is reported. Recitation behind an imam has differing school details.", sources: [bukhari(759), bukhari(756)] },
      ],
    },
    {
      title: "What affects prayer",
      lead: "Separate preparation requirements, clear restart cases, and questions needing individual guidance.",
      groups: [
        { title: "Before starting", items: [
          { title: "Time, purification, and Qibla", body: "Check the prayer time, wudu or ghusl as needed, and face the Qibla.", sources: [quran("4/103"), quran("5/6"), quran("2/144")] },
          pathNotes[path].clothing,
        ] },
        { title: "Normally restart", items: [
          { title: "Loss of wudu", body: "If hadath occurs, renew wudu before praying again.", sources: [bukhari(6954)] },
          { title: "Omitting calm core movements", body: "The Prophet told a person who rushed through prayer to repeat it and described calm bowing, standing, sitting, and prostration.", sources: [bukhari(793)] },
          { title: "Deliberate conversation", body: "Ordinary speech to others during prayer is prohibited in the cited report. Unintentional speech needs individual guidance.", sources: [bukhari(1200)] },
        ] },
        { title: "Warnings and differences", items: [
          pathNotes[path].additional,
          { title: "Finer details", body: "Hand positions, recitation behind an imam, clothing coverage questions, and accidental omissions can differ by school or circumstances. Do not infer a universal invalidity ruling from this overview.", sources: [bukhari(631), bukhari(756), bukhari(1224)] },
        ] },
      ],
    },
  ];
}
