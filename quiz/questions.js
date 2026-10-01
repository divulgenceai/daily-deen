import { QURAN_VERSE_PACK_META, QURAN_VERSE_PASSAGES, SURAH_NAMES } from "./quran-verse-pack.js";

const q = (id, topic, prompt, choices, answer, explanation, source, url) => ({
  id,
  topic,
  prompt,
  choices,
  answer,
  explanation,
  source,
  url,
});

export const TOPICS = [
  "Foundations",
  "Qur'an",
  "Prophets",
  "Prophetic life",
  "Worship",
  "Character",
  "Hereafter",
];

const CORE_QUESTIONS = [
  // Foundations
  q("foundations-01", "Foundations", "How many principles are named in the hadith, ‘Islam is based on…’?", ["Three", "Four", "Five", "Seven"], "Five", "The hadith lists the testimony of faith, prayer, zakat, Hajj, and fasting Ramadan.", "Sahih al-Bukhari 8", "https://sunnah.com/bukhari:8"),
  q("foundations-02", "Foundations", "Which of these is one of the five pillars of Islam?", ["Giving zakat", "Learning Arabic", "Visiting Madinah", "Fasting every Monday"], "Giving zakat", "Paying obligatory zakat is one of the five pillars named by the Prophet ﷺ.", "Sahih al-Bukhari 8", "https://sunnah.com/bukhari:8"),
  q("foundations-03", "Foundations", "Which fast is named as a pillar of Islam?", ["Every Monday", "The month of Ramadan", "The day of ‘Arafah", "The six days of Shawwal"], "The month of Ramadan", "The obligatory fast of Ramadan is one of Islam's five pillars.", "Sahih al-Bukhari 8", "https://sunnah.com/bukhari:8"),
  q("foundations-04", "Foundations", "Which pilgrimage is one of Islam's five pillars?", ["Hajj", "A visit to Jerusalem", "A visit to Madinah", "Any long journey"], "Hajj", "Hajj to the Sacred House is one of the five pillars for those able to undertake it.", "Sahih al-Bukhari 8", "https://sunnah.com/bukhari:8"),
  q("foundations-05", "Foundations", "What does the first pillar testify?", ["That all religions are the same", "That there is no deity worthy of worship except Allah and Muhammad is His Messenger", "That wealth is a sign of faith", "That worship is only private"], "That there is no deity worthy of worship except Allah and Muhammad is His Messenger", "The testimony of faith affirms Allah alone is worthy of worship and Muhammad ﷺ is His Messenger.", "Sahih al-Bukhari 8", "https://sunnah.com/bukhari:8"),
  q("foundations-06", "Foundations", "According to the opening hadith of Sahih al-Bukhari, what do rewards for deeds depend on?", ["Public praise", "Intentions", "Difficulty alone", "The number of witnesses"], "Intentions", "The Prophet ﷺ taught that deeds are judged by intentions and each person has what they intended.", "Sahih al-Bukhari 1", "https://sunnah.com/bukhari:1"),
  q("foundations-07", "Foundations", "What does Sahih Muslim 223 call half of faith?", ["Silence", "Travel", "Purification", "Study"], "Purification", "The hadith begins by teaching that purification is half of faith.", "Sahih Muslim 223", "https://sunnah.com/muslim:223"),
  q("foundations-08", "Foundations", "In Sahih Muslim 223, what is described as a light?", ["Prayer", "Wealth", "Sleep", "Travel"], "Prayer", "The hadith describes prayer as light.", "Sahih Muslim 223", "https://sunnah.com/muslim:223"),
  q("foundations-09", "Foundations", "In Sahih Muslim 223, what is described as proof?", ["Charity", "Ancestry", "Debate", "Fame"], "Charity", "The hadith describes charity as proof of faith.", "Sahih Muslim 223", "https://sunnah.com/muslim:223"),
  q("foundations-10", "Foundations", "In Sahih Muslim 223, what is described as brightness?", ["Patience", "Gold", "Sunrise", "Speech"], "Patience", "The hadith describes patient endurance as brightness.", "Sahih Muslim 223", "https://sunnah.com/muslim:223"),
  q("foundations-11", "Foundations", "What can the Qur'an be for a person according to Sahih Muslim 223?", ["Only a historical record", "Evidence for or against them", "A substitute for prayer", "A private possession only"], "Evidence for or against them", "The hadith says the Qur'an is evidence for you or against you.", "Sahih Muslim 223", "https://sunnah.com/muslim:223"),
  q("foundations-12", "Foundations", "What measure of honour before Allah is named in Qur'an 49:13?", ["Wealth", "Lineage", "Taqwa", "Age"], "Taqwa", "The verse teaches that the most honoured before Allah are the most mindful of Him.", "Qur'an 49:13", "https://quran.com/49/13"),

  // Qur'an
  q("quran-01", "Qur'an", "What command begins Qur'an 96:1?", ["Read", "Travel", "Sleep", "Trade"], "Read", "The verse begins with the command to read in the name of the Lord who created.", "Qur'an 96:1", "https://quran.com/96/1"),
  q("quran-02", "Qur'an", "Which month is named as the month in which the Qur'an was revealed?", ["Muharram", "Rajab", "Ramadan", "Shawwal"], "Ramadan", "Qur'an 2:185 names Ramadan as the month in which the Qur'an was revealed.", "Qur'an 2:185", "https://quran.com/2/185"),
  q("quran-03", "Qur'an", "Laylat al-Qadr is better than how many months?", ["One hundred", "Five hundred", "One thousand", "Ten thousand"], "One thousand", "Surah al-Qadr says the Night of Decree is better than one thousand months.", "Qur'an 97:3", "https://quran.com/97/3"),
  q("quran-04", "Qur'an", "What is the reference for Ayat al-Kursi?", ["2:255", "18:10", "36:1", "112:1"], "2:255", "Ayat al-Kursi is verse 255 of Surah al-Baqarah.", "Qur'an 2:255", "https://quran.com/2/255"),
  q("quran-05", "Qur'an", "Which surah did the Prophet ﷺ describe as equal to one-third of the Qur'an?", ["Al-Fatihah", "Al-Ikhlas", "Al-Falaq", "An-Nas"], "Al-Ikhlas", "The authentic hadith states that Surah al-Ikhlas equals one-third of the Qur'an.", "Sahih al-Bukhari 5013", "https://sunnah.com/bukhari:5013"),
  q("quran-06", "Qur'an", "Who promises to preserve the Reminder in Qur'an 15:9?", ["Scholars alone", "Kings", "Allah", "Every reader individually"], "Allah", "Allah states that He sent down the Reminder and that He will preserve it.", "Qur'an 15:9", "https://quran.com/15/9"),
  q("quran-07", "Qur'an", "Which surah is numbered 2 in the Qur'an?", ["Al-Fatihah", "Al-Baqarah", "Ali ‘Imran", "An-Nisa"], "Al-Baqarah", "Al-Baqarah is the second surah of the Qur'an.", "Surah al-Baqarah", "https://quran.com/2"),
  q("quran-08", "Qur'an", "How many verses are in Surah al-Kawthar?", ["Three", "Four", "Five", "Seven"], "Three", "Surah al-Kawthar consists of three numbered verses.", "Surah al-Kawthar", "https://quran.com/108"),
  q("quran-09", "Qur'an", "Which surah is numbered 19?", ["Maryam", "Yusuf", "Taha", "Al-Kahf"], "Maryam", "Maryam is the nineteenth surah of the Qur'an.", "Surah Maryam", "https://quran.com/19"),
  q("quran-10", "Qur'an", "In which surah is the account of the believing youths of the cave?", ["Al-Kahf", "Al-Mulk", "Al-Fajr", "Al-Qasas"], "Al-Kahf", "Surah al-Kahf recounts the story of the youths who sought refuge in the cave.", "Qur'an 18:13", "https://quran.com/18/13"),
  q("quran-11", "Qur'an", "Which surah contains Luqman's advice to his son?", ["Luqman", "Maryam", "Yunus", "Hud"], "Luqman", "Luqman's counsel to his son appears in the surah bearing his name.", "Qur'an 31:13-19", "https://quran.com/31/13-19"),
  q("quran-12", "Qur'an", "Which surah's name means ‘The Bee’?", ["An-Naml", "An-Nahl", "Al-Ankabut", "Al-Fil"], "An-Nahl", "An-Nahl, the sixteenth surah, means ‘The Bee’.", "Surah an-Nahl", "https://quran.com/16"),

  // Prophets
  q("prophets-01", "Prophets", "Which prophet was commanded to build the Ark?", ["Nuh", "Musa", "Yusuf", "Zakariya"], "Nuh", "Allah commanded Nuh to construct the Ark under divine guidance.", "Qur'an 11:37", "https://quran.com/11/37"),
  q("prophets-02", "Prophets", "For which prophet was the fire made cool and safe?", ["Ibrahim", "Dawud", "Sulayman", "Ismail"], "Ibrahim", "Allah commanded the fire to be coolness and safety for Ibrahim.", "Qur'an 21:69", "https://quran.com/21/69"),
  q("prophets-03", "Prophets", "Which prophet's staff became a visible serpent?", ["Musa", "Harun", "Isa", "Yunus"], "Musa", "When Musa threw his staff, it became a manifest serpent by Allah's permission.", "Qur'an 7:107", "https://quran.com/7/107"),
  q("prophets-04", "Prophets", "Which prophet was swallowed by the great fish?", ["Yunus", "Nuh", "Ayyub", "Hud"], "Yunus", "The Qur'an recounts that the fish swallowed Yunus while he was blameworthy.", "Qur'an 37:142", "https://quran.com/37/142"),
  q("prophets-05", "Prophets", "Which prophet spoke while still in the cradle?", ["Isa", "Yahya", "Yusuf", "Ishaq"], "Isa", "Isa spoke in infancy, declaring himself a servant of Allah and a prophet.", "Qur'an 19:29-30", "https://quran.com/19/29-30"),
  q("prophets-06", "Prophets", "Which prophet dreamed of eleven stars, the sun, and the moon prostrating to him?", ["Yusuf", "Ibrahim", "Sulayman", "Musa"], "Yusuf", "Young Yusuf told his father about this dream at the beginning of his story.", "Qur'an 12:4", "https://quran.com/12/4"),
  q("prophets-07", "Prophets", "Which prophet said he had been taught the speech of birds?", ["Sulayman", "Dawud", "Nuh", "Ilyas"], "Sulayman", "Sulayman acknowledged Allah's favour of teaching him the speech of birds.", "Qur'an 27:16", "https://quran.com/27/16"),
  q("prophets-08", "Prophets", "Which prophet called on Allah after being touched by adversity?", ["Ayyub", "Lut", "Hud", "Salih"], "Ayyub", "Ayyub called upon Allah while affirming that He is the Most Merciful.", "Qur'an 21:83", "https://quran.com/21/83"),
  q("prophets-09", "Prophets", "Which prophet was given the glad news of a son named Yahya?", ["Zakariya", "Ya‘qub", "Ibrahim", "Dawud"], "Zakariya", "Allah answered Zakariya's prayer with the glad news of Yahya.", "Qur'an 19:7", "https://quran.com/19/7"),
  q("prophets-10", "Prophets", "Who raised the foundations of the Ka‘bah together?", ["Ibrahim and Ismail", "Musa and Harun", "Dawud and Sulayman", "Zakariya and Yahya"], "Ibrahim and Ismail", "Ibrahim and Ismail raised the foundations of the House while praying for acceptance.", "Qur'an 2:127", "https://quran.com/2/127"),
  q("prophets-11", "Prophets", "To which prophet was the Zabur given?", ["Dawud", "Musa", "Isa", "Ibrahim"], "Dawud", "The Qur'an explicitly states that Dawud was given the Zabur.", "Qur'an 4:163", "https://quran.com/4/163"),
  q("prophets-12", "Prophets", "Which prophet is described as truthful and raised to a high station?", ["Idris", "Yunus", "Salih", "Lut"], "Idris", "The Qur'an describes Idris as a truthful prophet whom Allah raised to a high station.", "Qur'an 19:56-57", "https://quran.com/19/56-57"),

  // Prophetic life
  q("seerah-01", "Prophetic life", "How does Qur'an 33:40 describe Muhammad ﷺ in relation to the prophets?", ["The seal of the prophets", "The first prophet", "A prophet for one city", "A king before prophethood"], "The seal of the prophets", "The verse names Muhammad ﷺ as Allah's Messenger and the seal of the prophets.", "Qur'an 33:40", "https://quran.com/33/40"),
  q("seerah-02", "Prophetic life", "What mission-wide description is given to the Prophet ﷺ in Qur'an 21:107?", ["A mercy to the worlds", "A merchant to Arabia", "A ruler for one tribe", "A poet for his people"], "A mercy to the worlds", "Allah says He sent the Prophet ﷺ only as a mercy to the worlds.", "Qur'an 21:107", "https://quran.com/21/107"),
  q("seerah-03", "Prophetic life", "Which name for the coming messenger is spoken by Isa in Qur'an 61:6?", ["Ahmad", "Yahya", "Ismail", "Harun"], "Ahmad", "Isa gives glad news of a messenger to come after him whose name is Ahmad.", "Qur'an 61:6", "https://quran.com/61/6"),
  q("seerah-04", "Prophetic life", "On the Night Journey, the Prophet ﷺ was taken from the Sacred Mosque to which mosque?", ["Al-Aqsa Mosque", "Quba Mosque", "The Prophet's Mosque", "The Mosque of the Two Qiblahs"], "Al-Aqsa Mosque", "Qur'an 17:1 describes the journey from al-Masjid al-Haram to al-Masjid al-Aqsa.", "Qur'an 17:1", "https://quran.com/17/1"),
  q("seerah-05", "Prophetic life", "In the cave passage of Qur'an 9:40, how many people are described together?", ["Two", "Three", "Four", "Seven"], "Two", "The verse refers to the Prophet ﷺ as one of two when they were in the cave.", "Qur'an 9:40", "https://quran.com/9/40"),
  q("seerah-06", "Prophetic life", "Which surah opens by announcing Allah's help and victory?", ["An-Nasr", "Al-Falaq", "Al-Ma‘un", "Al-Qari‘ah"], "An-Nasr", "Surah an-Nasr begins with the coming of Allah's help and victory.", "Qur'an 110:1", "https://quran.com/110/1"),
  q("seerah-07", "Prophetic life", "Toward which mosque was the Prophet ﷺ commanded to turn his face in prayer?", ["Al-Masjid al-Haram", "Al-Masjid al-Aqsa", "Quba Mosque", "The Prophet's Mosque"], "Al-Masjid al-Haram", "The verse commands turning toward the Sacred Mosque in Makkah.", "Qur'an 2:144", "https://quran.com/2/144"),
  q("seerah-08", "Prophetic life", "At which battle does Qur'an 3:123 say Allah gave the believers victory while they were outnumbered?", ["Badr", "Uhud", "Hunayn", "The Trench"], "Badr", "The verse explicitly names Badr and reminds believers of Allah's help there.", "Qur'an 3:123", "https://quran.com/3/123"),
  q("seerah-09", "Prophetic life", "What quality of the Prophet's leadership is highlighted in Qur'an 3:159?", ["Gentleness", "Harshness", "Secrecy", "Silence"], "Gentleness", "The verse says it was by Allah's mercy that the Prophet ﷺ was gentle with his companions.", "Qur'an 3:159", "https://quran.com/3/159"),
  q("seerah-10", "Prophetic life", "According to Qur'an 53:3-4, revelation delivered by the Prophet ﷺ is not spoken from what?", ["Personal desire", "Memory", "A written page", "A public gathering"], "Personal desire", "The passage says he does not speak from desire; it is revelation sent down.", "Qur'an 53:3-4", "https://quran.com/53/3-4"),
  q("seerah-11", "Prophetic life", "Which tribe's winter and summer journeys are mentioned in Surah 106?", ["Quraysh", "Thaqif", "Aws", "Khazraj"], "Quraysh", "Surah Quraysh names the tribe and its accustomed winter and summer journeys.", "Qur'an 106:1-2", "https://quran.com/106/1-2"),
  q("seerah-12", "Prophetic life", "Which description of the Prophet ﷺ appears in Qur'an 7:157?", ["The unlettered Prophet", "The sailor Prophet", "The shepherd king", "The angelic Prophet"], "The unlettered Prophet", "The verse tells people to follow the Messenger, the unlettered Prophet, described in earlier scripture.", "Qur'an 7:157", "https://quran.com/7/157"),

  // Worship
  q("worship-01", "Worship", "How many daily prayers remained obligatory after the Night Journey account?", ["Three", "Five", "Ten", "Fifty"], "Five", "The obligation was reduced to five prayers while retaining the reward of fifty.", "Sahih al-Bukhari 349", "https://sunnah.com/bukhari:349"),
  q("worship-02", "Worship", "What should believers leave when the call for Friday prayer is made?", ["Trade", "Family", "Their homes forever", "All food"], "Trade", "Qur'an 62:9 commands believers to hasten to Allah's remembrance and leave trade.", "Qur'an 62:9", "https://quran.com/62/9"),
  q("worship-03", "Worship", "Which body part is explicitly washed up to the elbows in the wudu verse?", ["Arms", "Head", "Neck", "Ears"], "Arms", "Qur'an 5:6 commands washing the face and arms up to the elbows, wiping the head, and washing the feet.", "Qur'an 5:6", "https://quran.com/5/6"),
  q("worship-04", "Worship", "When water is unavailable under the conditions in Qur'an 5:6, what clean material is used for tayammum?", ["Earth", "Oil", "Leaves", "Cloth"], "Earth", "The verse directs believers to seek clean earth and wipe their faces and hands.", "Qur'an 5:6", "https://quran.com/5/6"),
  q("worship-05", "Worship", "Which two hills are named among the symbols of Allah?", ["Safa and Marwah", "Uhud and Hira", "Arafat and Muzdalifah", "Sinai and Judi"], "Safa and Marwah", "Qur'an 2:158 names Safa and Marwah among Allah's symbols.", "Qur'an 2:158", "https://quran.com/2/158"),
  q("worship-06", "Worship", "In which month is obligatory fasting prescribed?", ["Ramadan", "Safar", "Rabi al-Awwal", "Dhul-Qa‘dah"], "Ramadan", "The Qur'an directs those present in Ramadan to fast the month, with stated concessions.", "Qur'an 2:185", "https://quran.com/2/185"),
  q("worship-07", "Worship", "How does Qur'an 2:197 describe the time of Hajj?", ["Well-known months", "One hidden night", "Any random week", "Only the first day of the year"], "Well-known months", "The verse states that Hajj is during well-known months.", "Qur'an 2:197", "https://quran.com/2/197"),
  q("worship-08", "Worship", "Which group is explicitly listed among the recipients of zakat in Qur'an 9:60?", ["The poor", "Only rulers", "Only merchants", "Every traveller regardless of need"], "The poor", "The verse begins its list of zakat recipients with the poor and the needy.", "Qur'an 9:60", "https://quran.com/9/60"),
  q("worship-09", "Worship", "What is the qiblah named in Qur'an 2:144?", ["Al-Masjid al-Haram", "Mount Sinai", "The cave of Hira", "Mount Uhud"], "Al-Masjid al-Haram", "The verse establishes the direction of prayer toward the Sacred Mosque.", "Qur'an 2:144", "https://quran.com/2/144"),
  q("worship-10", "Worship", "In which position is a servant nearest to their Lord according to Sahih Muslim 482?", ["Prostration", "Standing in a marketplace", "Sleeping", "Travelling"], "Prostration", "The Prophet ﷺ taught that a servant is nearest to their Lord while prostrating and should make abundant supplication.", "Sahih Muslim 482", "https://sunnah.com/muslim:482"),
  q("worship-11", "Worship", "What did the Prophet ﷺ say exists between every two calls—the adhan and iqamah?", ["A prayer", "A required meal", "A sermon", "A journey"], "A prayer", "The hadith encourages a voluntary prayer between the adhan and iqamah for whoever wishes.", "Sahih al-Bukhari 624", "https://sunnah.com/bukhari:624"),
  q("worship-12", "Worship", "What protective image does the hadith use for fasting?", ["A shield", "A crown", "A key", "A lamp"], "A shield", "The Prophet ﷺ described fasting as a shield and taught the fasting person to avoid obscene and angry speech.", "Sahih al-Bukhari 1904", "https://sunnah.com/bukhari:1904"),

  // Character
  q("character-01", "Character", "How does Sahih al-Bukhari 10 describe a Muslim?", ["People are safe from their tongue and hand", "They never make mistakes", "They avoid every neighbour", "They own no property"], "People are safe from their tongue and hand", "The hadith defines the Muslim here as one from whose tongue and hand other Muslims are safe.", "Sahih al-Bukhari 10", "https://sunnah.com/bukhari:10"),
  q("character-02", "Character", "What completes faith in the teaching of Sahih al-Bukhari 13?", ["Loving for one's brother what one loves for oneself", "Winning every debate", "Never needing advice", "Keeping all good private"], "Loving for one's brother what one loves for oneself", "The hadith links complete faith with sincerely loving good for one's brother.", "Sahih al-Bukhari 13", "https://sunnah.com/bukhari:13"),
  q("character-03", "Character", "Who is truly strong according to Sahih al-Bukhari 6114?", ["The one who controls themselves when angry", "The one who never listens", "The one with the most possessions", "The one who speaks the loudest"], "The one who controls themselves when angry", "True strength is defined as self-control at the moment of anger, not overpowering others.", "Sahih al-Bukhari 6114", "https://sunnah.com/bukhari:6114"),
  q("character-04", "Character", "What does the Prophet ﷺ call a good word?", ["Charity", "A debt", "A secret", "A contract"], "Charity", "The authentic hadith includes a good word among forms of charity.", "Sahih al-Bukhari 2989", "https://sunnah.com/bukhari:2989"),
  q("character-05", "Character", "Qur'an 4:135 commands believers to stand firmly for justice even against whom?", ["Themselves and close family", "Strangers only", "The poor only", "Those outside their city only"], "Themselves and close family", "The verse demands justice even when testimony is against oneself, parents, or close relatives.", "Qur'an 4:135", "https://quran.com/4/135"),
  q("character-06", "Character", "Which harmful speech is compared to eating the flesh of one's dead brother?", ["Backbiting", "Giving advice privately", "Reciting aloud", "Asking a question"], "Backbiting", "Qur'an 49:12 uses this vivid comparison to condemn backbiting.", "Qur'an 49:12", "https://quran.com/49/12"),
  q("character-07", "Character", "What should a believer ask Allah for their parents in Qur'an 17:24?", ["Mercy", "Wealth only", "Fame", "A longer journey"], "Mercy", "The verse teaches the prayer asking Allah to have mercy on one's parents as they raised the child when small.", "Qur'an 17:24", "https://quran.com/17/24"),
  q("character-08", "Character", "How should evil be repelled according to Qur'an 41:34?", ["With what is better", "With greater evil", "With public humiliation", "By spreading rumours"], "With what is better", "The verse directs believers to respond with what is better, which can transform enmity into close friendship.", "Qur'an 41:34", "https://quran.com/41/34"),
  q("character-09", "Character", "Whom does Allah say He loves in Qur'an 2:195?", ["Those who do good", "Those who boast", "Those who waste", "Those who break promises"], "Those who do good", "The verse commands spending, avoiding self-destruction, and doing good because Allah loves the doers of good.", "Qur'an 2:195", "https://quran.com/2/195"),
  q("character-10", "Character", "What effect does gentleness have according to Sahih Muslim 2594a?", ["It beautifies a matter", "It makes truth unnecessary", "It removes responsibility", "It guarantees wealth"], "It beautifies a matter", "The Prophet ﷺ taught that gentleness beautifies whatever it is in, while its removal disfigures.", "Sahih Muslim 2594a", "https://sunnah.com/muslim:2594a"),
  q("character-11", "Character", "What lesson uses the image of a believer not being stung from the same hole twice?", ["Learn from harm and do not repeat the same mistake blindly", "Never forgive anyone", "Avoid every new experience", "Do not travel"], "Learn from harm and do not repeat the same mistake blindly", "The concise hadith teaches alertness and learning from experience.", "Sahih al-Bukhari 6133", "https://sunnah.com/bukhari:6133"),
  q("character-12", "Character", "Which action is named as a branch of faith in Sahih Muslim 35b?", ["Removing harm from the road", "Owning a large home", "Speaking first in every gathering", "Avoiding all work"], "Removing harm from the road", "The hadith names removing something harmful from the road as a branch of faith.", "Sahih Muslim 35b", "https://sunnah.com/muslim:35b"),

  // Hereafter
  q("hereafter-01", "Hereafter", "What will every soul experience according to Qur'an 3:185?", ["Death", "Kingship", "Wealth", "Travel"], "Death", "The verse states that every soul will taste death and that full rewards are given on the Day of Resurrection.", "Qur'an 3:185", "https://quran.com/3/185"),
  q("hereafter-02", "Hereafter", "What happens to an atom's weight of good according to Qur'an 99:7?", ["It will be seen", "It is always forgotten", "It becomes someone else's deed", "It only counts if public"], "It will be seen", "The verse teaches that whoever does even an atom's weight of good will see it.", "Qur'an 99:7", "https://quran.com/99/7"),
  q("hereafter-03", "Hereafter", "What happens to an atom's weight of evil according to Qur'an 99:8?", ["It will be seen", "It disappears automatically", "It cannot be recorded", "It is transferred to strangers"], "It will be seen", "The following verse teaches that whoever does even an atom's weight of evil will see it.", "Qur'an 99:8", "https://quran.com/99/8"),
  q("hereafter-04", "Hereafter", "What is blown before creation falls unconscious and is then raised again?", ["The Trumpet", "A lamp", "A banner", "A bell"], "The Trumpet", "Qur'an 39:68 describes the Trumpet being blown, then blown again for resurrection.", "Qur'an 39:68", "https://quran.com/39/68"),
  q("hereafter-05", "Hereafter", "On the overwhelming Day, from whom will a person flee according to Qur'an 80:34-36?", ["Brother, mother, father, spouse, and children", "Only strangers", "Only rulers", "Only neighbours"], "Brother, mother, father, spouse, and children", "The passage lists a person's closest family to show the gravity of that Day.", "Qur'an 80:34-36", "https://quran.com/80/34-36"),
  q("hereafter-06", "Hereafter", "In which hand does the joyful person receive their record in Qur'an 69:19?", ["Right hand", "Left hand", "Both hands behind the back", "No hand is mentioned"], "Right hand", "The verse describes the person given their record in the right hand calling others to read it.", "Qur'an 69:19", "https://quran.com/69/19"),
  q("hereafter-07", "Hereafter", "How many categories are mentioned in the hadith of those shaded by Allah when there is no other shade?", ["Seven", "Three", "Five", "Twelve"], "Seven", "The hadith lists seven categories granted Allah's shade on that Day.", "Sahih al-Bukhari 660", "https://sunnah.com/bukhari:660"),
  q("hereafter-08", "Hereafter", "Who are successful when deeds are weighed according to Qur'an 7:8?", ["Those whose scales are heavy", "Those with the most followers", "Those with the longest names", "Those who were most famous"], "Those whose scales are heavy", "The verse says those whose scales are heavy are the successful.", "Qur'an 7:8", "https://quran.com/7/8"),
  q("hereafter-09", "Hereafter", "Who may intercede with Allah according to Ayat al-Kursi?", ["Only one whom He permits", "Anyone without permission", "Only the wealthy", "No one under any circumstance"], "Only one whom He permits", "Ayat al-Kursi states that no one can intercede except by Allah's permission.", "Qur'an 2:255", "https://quran.com/2/255"),
  q("hereafter-10", "Hereafter", "A day whose measure is fifty thousand years is mentioned in which passage?", ["Qur'an 70:4", "Qur'an 1:1", "Qur'an 12:4", "Qur'an 108:1"], "Qur'an 70:4", "The verse states that the angels and the Spirit ascend to Him in a day measuring fifty thousand years.", "Qur'an 70:4", "https://quran.com/70/4"),
  q("hereafter-11", "Hereafter", "How is the promised Garden's breadth described in Qur'an 3:133?", ["As wide as the heavens and earth", "As wide as one city", "As wide as one valley", "No width is mentioned"], "As wide as the heavens and earth", "The verse calls believers toward forgiveness and a Garden prepared for the mindful, as wide as the heavens and earth.", "Qur'an 3:133", "https://quran.com/3/133"),
  q("hereafter-12", "Hereafter", "What does Qur'an 32:17 say no soul knows?", ["The hidden joy kept as a reward", "The number of stars", "Every language", "The exact age of the earth"], "The hidden joy kept as a reward", "The verse says no soul knows what comfort of the eyes has been hidden as reward for what they did.", "Qur'an 32:17", "https://quran.com/32/17"),
];

// Short, everyday questions checked against the linked Sahih al-Bukhari reports.
const BUKHARI_QUESTIONS = [
  q("bukhari-01", "Character", "What should you do if you have nothing good to say?", ["Keep quiet", "Insult someone", "Spread a rumour", "Shout louder"], "Keep quiet", "The Prophet ﷺ said to speak good or remain silent.", "Sahih al-Bukhari 6018", "https://sunnah.com/bukhari:6018"),
  q("bukhari-02", "Character", "How should you treat a guest?", ["Honour them", "Ignore them", "Mock them", "Turn them away without reason"], "Honour them", "The Prophet ﷺ linked faith in Allah and the Last Day with honouring a guest.", "Sahih al-Bukhari 6018", "https://sunnah.com/bukhari:6018"),
  q("bukhari-03", "Character", "Who should you avoid harming?", ["Your neighbour", "Only strangers", "Only travellers", "Only merchants"], "Your neighbour", "The same hadith warns against harming one's neighbour.", "Sahih al-Bukhari 6018", "https://sunnah.com/bukhari:6018"),
  q("bukhari-04", "Worship", "Which deeds are most loved by Allah?", ["Regular deeds, even if small", "Deeds done only once", "Deeds done for praise", "Only difficult deeds"], "Regular deeds, even if small", "The Prophet ﷺ taught that the most beloved deeds are those done regularly, even when they are few.", "Sahih al-Bukhari 6465", "https://sunnah.com/bukhari:6465"),
  q("bukhari-05", "Worship", "Should you take on more worship than you can keep up?", ["No, do what you can manage", "Yes, always", "Only if others see", "Never worship"], "No, do what you can manage", "The hadith advises taking on deeds within one's ability and keeping them consistent.", "Sahih al-Bukhari 6465", "https://sunnah.com/bukhari:6465"),
  q("bukhari-06", "Qur'an", "What does the Prophet ﷺ praise people for doing with the Qur'an?", ["Learning and teaching it", "Hiding it", "Selling it", "Ignoring it"], "Learning and teaching it", "He said the best among you are those who learn the Qur'an and teach it.", "Sahih al-Bukhari 5027", "https://sunnah.com/bukhari:5027"),
  q("bukhari-07", "Foundations", "How does the Prophet ﷺ describe the religion?", ["Easy", "Impossible", "Secret", "Only for scholars"], "Easy", "The hadith says the religion is easy and warns against making it too hard on oneself.", "Sahih al-Bukhari 39", "https://sunnah.com/bukhari:39"),
  q("bukhari-08", "Foundations", "What is better than going to extremes in worship?", ["A balanced approach", "Giving up", "Showing off", "Judging others"], "A balanced approach", "The Prophet ﷺ encouraged moderation and doing what one can sustain.", "Sahih al-Bukhari 39", "https://sunnah.com/bukhari:39"),
  q("bukhari-09", "Worship", "Which deed is named first among those most loved by Allah?", ["Prayer on time", "A long journey", "Owning wealth", "Winning arguments"], "Prayer on time", "When asked about the most beloved deed, the Prophet ﷺ first named prayer at its proper time.", "Sahih al-Bukhari 527", "https://sunnah.com/bukhari:527"),
  q("bukhari-10", "Character", "Which duty is named after prayer on time?", ["Being good to parents", "Buying gifts", "Travelling", "Public speaking"], "Being good to parents", "After prayer on time, the Prophet ﷺ named good treatment of parents.", "Sahih al-Bukhari 527", "https://sunnah.com/bukhari:527"),
  q("bukhari-11", "Character", "Who was named first when a man asked who most deserves his good company?", ["His mother", "His friend", "His neighbour", "His employer"], "His mother", "The Prophet ﷺ answered 'your mother' first.", "Sahih al-Bukhari 5971", "https://sunnah.com/bukhari:5971"),
  q("bukhari-12", "Character", "After mentioning the mother three times, whom did the Prophet ﷺ mention?", ["The father", "A ruler", "A cousin", "A teacher"], "The father", "He emphasised the mother three times, then mentioned the father.", "Sahih al-Bukhari 5971", "https://sunnah.com/bukhari:5971"),
  q("bukhari-13", "Hereafter", "Who will be close to the Prophet ﷺ in Paradise, according to the hadith?", ["A person who cares for an orphan", "The richest person", "Only a traveller", "A famous speaker"], "A person who cares for an orphan", "The Prophet ﷺ showed with two fingers how close the person caring for an orphan would be to him in Paradise.", "Sahih al-Bukhari 6005", "https://sunnah.com/bukhari:6005"),
  q("bukhari-14", "Character", "Is helping someone onto their ride a kind of charity?", ["Yes", "No", "Only for payment", "Only on Friday"], "Yes", "The hadith includes helping a person onto their mount among acts of charity.", "Sahih al-Bukhari 2989", "https://sunnah.com/bukhari:2989"),
  q("bukhari-15", "Character", "Is removing something harmful from a road a kind of charity?", ["Yes", "No", "Only at night", "Only if rewarded"], "Yes", "The Prophet ﷺ listed removing a harmful thing from the road as charity.", "Sahih al-Bukhari 2989", "https://sunnah.com/bukhari:2989"),
  q("bukhari-16", "Character", "What does the hadith call being fair between two people?", ["Charity", "A waste of time", "A private matter only", "A debt"], "Charity", "The Prophet ﷺ described acting justly between two people as charity.", "Sahih al-Bukhari 2989", "https://sunnah.com/bukhari:2989"),
  q("bukhari-17", "Worship", "What can each step to prayer count as?", ["Charity", "A mistake", "A debt", "A fast"], "Charity", "The hadith includes each step taken to prayer among acts of charity.", "Sahih al-Bukhari 2989", "https://sunnah.com/bukhari:2989"),
];

function surahChoices(surahNumber, ayahNumber) {
  const answer = SURAH_NAMES[surahNumber - 1];
  const choices = [answer];
  let cursor = (surahNumber * 37 + ayahNumber * 19) % SURAH_NAMES.length;

  while (choices.length < 4) {
    const candidate = SURAH_NAMES[cursor];
    if (!choices.includes(candidate)) choices.push(candidate);
    cursor = (cursor + 29 + choices.length * 11) % SURAH_NAMES.length;
  }

  return choices;
}

const QURAN_PASSAGE_QUESTIONS = QURAN_VERSE_PASSAGES.map(([surahNumber, ayahNumber, start, length, active]) => {
  const surahName = SURAH_NAMES[surahNumber - 1];
  return {
    ...q(
    `quran-passage-${surahNumber}-${ayahNumber}`,
    "Qur'an",
    "Which surah is this verse from?",
    surahChoices(surahNumber, ayahNumber),
    surahName,
    `This is Qur'an ${surahNumber}:${ayahNumber}, in Surah ${surahName}. The English translation is M.A.S. Abdel Haleem on Quran.com. Open the source to read the whole verse in context.`,
    `Qur'an ${surahNumber}:${ayahNumber}`,
    `https://quran.com/${surahNumber}/${ayahNumber}`,
    ),
    verse: { surah: surahNumber, ayah: ayahNumber, start, length },
    active: Boolean(active),
  };
});

export const QUESTIONS = [...CORE_QUESTIONS, ...BUKHARI_QUESTIONS, ...QURAN_PASSAGE_QUESTIONS];
export const ACTIVE_QUESTIONS = QUESTIONS.filter((question) => question.active !== false);

export const QUESTION_LIBRARY_META = {
  reviewedQuestions: ACTIVE_QUESTIONS.length,
  coreQuestions: CORE_QUESTIONS.length + BUKHARI_QUESTIONS.length,
  generatedVerseQuestions: QURAN_VERSE_PACK_META.generatedQuestions,
  dailyQuestions: 7,
  lockoutDays: 731,
  productionTarget: 5642,
  reviewPolicy: "Every answer links to Quran.com or a Sahih al-Bukhari/al-Muslim report on Sunnah.com. M.A.S. Abdel Haleem verse text is fetched from Quran.com when displayed, not bundled into the app.",
};
