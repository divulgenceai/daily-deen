const TIME_ZONE = "Australia/Sydney";
const MS_PER_DAY = 86_400_000;
const EPOCH_DAY = Date.UTC(2026, 0, 1) / MS_PER_DAY;
const SAVED_READINGS_KEY = "daily-deen-saved-readings-v1";
const phoneLayoutQuery = window.matchMedia("(max-width: 700px)");

const sourceIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H7a3 3 0 0 0-3 3z" />
    <path d="M4 5.5V21" />
    <path d="M8 7h8" />
    <path d="M8 11h7" />
  </svg>
`;

const nextIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5v14" />
    <path d="m6 13 6 6 6-6" />
  </svg>
`;

const labels = [
  ["verse", "Qur'an Verse Of The Day"],
  ["dua", "Dua Of The Day"],
  ["dhikr", "Dhikr Of The Day"],
  ["hadith", "Hadith Of The Day"],
  ["quote", "Quote Of The Day"],
  ["story", "Story Of The Day"],
  ["ruling", "Halal / Haram Fact Of The Day"],
];

const readings = {
  verses: [
    {
      title: "Trust With Action",
      arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
      transliteration: "Wa man yatawakkal 'ala Allahi fa huwa hasbuh.",
      meaning: "Whoever relies upon Allah will find Him enough.",
      explain:
        "This verse steadies the heart without inviting passivity: take the halal means, then leave the unseen outcome with Allah.",
      source: "Qur'an 65:3",
      quality: "Revelation",
      url: "https://quran.com/65/3",
      revealed: "Madinan, in Surah At-Talaq.",
      whyRevealed:
        "Revealed in the divorce guidance of Surah At-Talaq, where Allah ties lawful separation to taqwa, provision, and reliance on Him.",
      contextUrl: "https://quran.com/surah/65/info",
    },
    {
      title: "A Burden Measured With Mercy",
      arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      transliteration: "La yukallifullahu nafsan illa wus'aha.",
      meaning: "Allah does not burden a soul beyond what it can bear.",
      explain:
        "The believer is taught to see hardship through Allah's mercy: responsibility is real, but it is never outside His knowledge or justice.",
      source: "Qur'an 2:286",
      quality: "Revelation",
      url: "https://quran.com/2/286",
      revealed: "At the close of Surah Al-Baqarah, the long Madinan surah.",
      whyRevealed:
        "It closes the surah by teaching Allah's mercy in obligation: believers are accountable, but never burdened beyond capacity.",
      contextUrl: "https://quran.com/surah/2/info",
    },
    {
      title: "Ease Inside Hardship",
      arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      transliteration: "Fa-inna ma'al-'usri yusra. Inna ma'al-'usri yusra.",
      meaning: "With hardship comes ease. Truly, with hardship comes ease.",
      explain:
        "The repetition makes hope part of the trial itself. Relief is not only after hardship; Allah can place openings within it.",
      source: "Qur'an 94:5-6",
      quality: "Revelation",
      url: "https://quran.com/94/5-6",
      revealed: "Early Makkan, in Surah Ash-Sharh.",
      whyRevealed:
        "Revealed as consolation to the Prophet, reminding him that Allah's opening and relief come with hardship.",
      contextUrl: "https://quran.com/surah/94/info",
    },
    {
      title: "The Resting Place Of The Heart",
      arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      transliteration: "Ala bidhikri Allahi tatma'innul-qulub.",
      meaning: "Surely, in the remembrance of Allah hearts find rest.",
      explain:
        "Dhikr does not erase responsibility; it returns the heart to its anchor while life remains busy around it.",
      source: "Qur'an 13:28",
      quality: "Revelation",
      url: "https://quran.com/13/28",
      revealed: "In Surah Ar-Ra'd, whose period is recorded with Makkan/Madinan discussion.",
      whyRevealed:
        "It answers the demand for outward signs by pointing to the deeper sign of faith: hearts made steady through Allah's remembrance.",
      contextUrl: "https://quran.com/surah/13/info",
    },
    {
      title: "Never Despair",
      arabic: "لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
      transliteration: "La taqnatu min rahmatillah.",
      meaning: "Do not despair of the mercy of Allah.",
      explain:
        "The door of repentance stays open while life remains. Despair is not humility; returning to Allah is.",
      source: "Qur'an 39:53",
      quality: "Revelation",
      url: "https://quran.com/39/53",
      revealed: "Makkan, around the intense rejection faced in Makkah.",
      whyRevealed:
        "It appears in the repentance passage of Surah Az-Zumar, calling people who wronged themselves back from despair to Allah's mercy.",
      contextUrl: "https://quran.com/surah/39/info",
    },
    {
      title: "Honor Is Taqwa",
      arabic: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ",
      transliteration: "Inna akramakum 'inda Allahi atqakum.",
      meaning: "The most honored of you with Allah are the most mindful of Him.",
      explain:
        "Islam redirects status away from race, wealth, and display toward the hidden quality of taqwa.",
      source: "Qur'an 49:13",
      quality: "Revelation",
      url: "https://quran.com/49/13",
      revealed: "Madinan, in Surah Al-Hujurat.",
      whyRevealed:
        "Revealed in a surah disciplining Muslim community manners, it rejects lineage and tribal pride as measures of honor.",
      contextUrl: "https://quran.com/surah/49/info",
    },
    {
      title: "Justice And Excellence",
      arabic: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ",
      transliteration: "Inna Allaha ya'muru bil-'adli wal-ihsan.",
      meaning: "Allah commands justice and excellence.",
      explain:
        "Justice prevents harm; ihsan beautifies what duty alone cannot complete. Both belong in a believer's daily conduct.",
      source: "Qur'an 16:90",
      quality: "Revelation",
      url: "https://quran.com/16/90",
      revealed: "Makkan, in the later Makkan period of Surah An-Nahl.",
      whyRevealed:
        "It gathers the surah's moral call into one command: justice, ihsan, family duty, and restraint from corruption.",
      contextUrl: "https://quran.com/surah/16/info",
    },
    {
      title: "Increase Me In Knowledge",
      arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
      transliteration: "Wa qul Rabbi zidni 'ilma.",
      meaning: "Say: My Lord, increase me in knowledge.",
      explain:
        "The Qur'an teaches the Prophet ﷺ to ask for more beneficial knowledge, making learning an act of worship.",
      source: "Qur'an 20:114",
      quality: "Revelation",
      url: "https://quran.com/20/114",
      revealed: "Early Makkan, in Surah Taha.",
      whyRevealed:
        "It was revealed while teaching the Prophet not to rush the incoming revelation, and to ask Allah for more knowledge.",
      contextUrl: "https://quran.com/20/114-115",
    },
    {
      title: "Mercy In Leadership",
      arabic: "فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ",
      transliteration: "Fabima rahmatin mina Allahi linta lahum.",
      meaning: "By mercy from Allah, you were gentle with them.",
      explain:
        "Gentleness is not weakness in prophetic leadership; it is a mercy that keeps hearts near the truth.",
      source: "Qur'an 3:159",
      quality: "Revelation",
      url: "https://quran.com/3/159",
      revealed: "Madinan, in the aftermath of Uhud within Surah Ali 'Imran.",
      whyRevealed:
        "It teaches prophetic leadership after a painful test: pardon, seek forgiveness, consult, decide, and rely on Allah.",
      contextUrl: "https://quran.com/3/159",
    },
    {
      title: "Never Alone",
      arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
      transliteration: "Wa Huwa ma'akum ayna ma kuntum.",
      meaning: "He is with you wherever you are.",
      explain:
        "Allah's knowledge, seeing, and care surround every hidden and public moment. That awareness brings both comfort and discipline.",
      source: "Qur'an 57:4",
      quality: "Revelation",
      url: "https://quran.com/57/4",
      revealed: "Madinan, around the fourth to fifth year after Hijrah according to Surah Al-Hadid context.",
      whyRevealed:
        "It opens the surah's call to faith and sacrifice by grounding the believer in Allah's creation, knowledge, and nearness.",
      contextUrl: "https://quran.com/surah/57/info",
    },
  ],
  duas: [
    {
      title: "Good In Both Worlds",
      arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
      transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar.",
      meaning: "Our Lord, grant us good in this world and good in the Hereafter, and protect us from the Fire.",
      effect:
        "This Qur'anic dua gathers worldly good, eternal good, and safety from punishment in one balanced request.",
      source: "Qur'an 2:201",
      quality: "Revelation",
      url: "https://quran.com/2/201",
    },
    {
      title: "Pardon And Mercy",
      arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا",
      transliteration: "Rabbana la tu'akhidhna in nasina aw akhta'na.",
      meaning: "Our Lord, do not take us to task if we forget or make a mistake.",
      effect:
        "The closing dua of Al-Baqarah teaches humility: asking Allah for pardon, mercy, and help after acknowledging human weakness.",
      source: "Qur'an 2:286",
      quality: "Revelation",
      url: "https://quran.com/2/286",
    },
    {
      title: "Beneficial Increase",
      arabic: "رَّبِّ زِدْنِي عِلْمًا",
      transliteration: "Rabbi zidni 'ilma.",
      meaning: "My Lord, increase me in knowledge.",
      effect:
        "This short Qur'anic dua turns study, reflection, and correction into worship by asking Allah for a blessed increase.",
      source: "Qur'an 20:114",
      quality: "Revelation",
      url: "https://quran.com/20/114",
    },
    {
      title: "The Dua Of Yunus",
      arabic: "لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
      transliteration: "La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin.",
      meaning: "There is no god but You. Glory be to You. I was among the wrongdoers.",
      effect:
        "The Qur'an records that Allah rescued Yunus عليه السلام from distress after this call, and made it a sign for believers.",
      source: "Qur'an 21:87-88",
      quality: "Revelation",
      url: "https://quran.com/21/87-88",
    },
    {
      title: "Returning After A Mistake",
      arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
      transliteration: "Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakunanna minal-khasirin.",
      meaning: "Our Lord, we wronged ourselves. If You do not forgive and have mercy on us, we will be among the lost.",
      effect:
        "Adam and Hawwa عليهما السلام model repentance without excuses: admit the wrong, seek forgiveness, and return.",
      source: "Qur'an 7:23",
      quality: "Revelation",
      url: "https://quran.com/7/23",
    },
    {
      title: "Guidance, Taqwa, Restraint",
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
      transliteration: "Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina.",
      meaning: "O Allah, I ask You for guidance, piety, chastity, and contentment.",
      effect:
        "A concise prophetic dua asking for right direction, obedience, protection from haram, and richness of the heart.",
      source: "Sahih Muslim 2721a",
      quality: "Sahih",
      url: "https://sunnah.com/muslim:2721a",
    },
    {
      title: "The Master Seeking Forgiveness",
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ",
      transliteration: "Allahumma Anta Rabbi, la ilaha illa Anta, khalaqtani wa ana 'abduk...",
      meaning: "O Allah, You are my Lord; none has the right to be worshipped but You. You created me, and I am Your servant.",
      effect:
        "Sahih al-Bukhari names this the best form of seeking forgiveness, with a promised reward for saying it with certainty morning or evening.",
      source: "Sahih al-Bukhari 6306",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6306",
    },
    {
      title: "Refuge From Worry And Debt",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ",
      transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal...",
      meaning: "O Allah, I seek refuge in You from worry, grief, incapacity, laziness, miserliness, cowardice, heavy debt, and being overpowered.",
      effect:
        "The Prophet ﷺ used this dua to seek Allah's protection from inward distress and outward pressure.",
      source: "Sahih al-Bukhari 6369",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6369",
    },
    {
      title: "A Family Of Coolness",
      arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ",
      transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yun.",
      meaning: "Our Lord, grant us from our spouses and offspring comfort to our eyes.",
      effect:
        "This dua asks Allah for a home that brings spiritual joy, and for leadership rooted in taqwa.",
      source: "Qur'an 25:74",
      quality: "Revelation",
      url: "https://quran.com/25/74",
    },
    {
      title: "Keep Our Hearts Firm",
      arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا",
      transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana.",
      meaning: "Our Lord, do not let our hearts deviate after You have guided us.",
      effect:
        "A Qur'anic plea for firmness: guidance is a gift, and the believer keeps asking Allah to preserve it.",
      source: "Qur'an 3:8",
      quality: "Revelation",
      url: "https://quran.com/3/8",
    },
  ],
  dhikr: [
    {
      title: "Glory And Praise",
      count: "Recommended count: 100 times",
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      transliteration: "SubhanAllahi wa bihamdih.",
      meaning: "Glory be to Allah and praise belongs to Him.",
      effect:
        "The authentic report mentions forgiveness of sins for saying it one hundred times in a day.",
      source: "Sahih al-Bukhari 6405",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6405",
    },
    {
      title: "Tawhid On The Tongue",
      count: "Recommended count: 100 times",
      arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
      transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in qadir.",
      meaning: "None has the right to be worshipped except Allah alone, without partner. His is the dominion and praise, and He has power over all things.",
      effect:
        "The authentic report mentions immense reward, erased sins, and protection for the day for saying it one hundred times.",
      source: "Sahih al-Bukhari 6403; Sahih Muslim 2691",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6403",
    },
    {
      title: "Light On The Tongue",
      count: "Any time",
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
      transliteration: "SubhanAllahi wa bihamdih, SubhanAllahil-'Azim.",
      meaning: "Glory be to Allah and praise belongs to Him; glory be to Allah the Magnificent.",
      effect:
        "The Prophet ﷺ described these two words as easy on the tongue, heavy on the Scale, and beloved to the Most Merciful.",
      source: "Sahih al-Bukhari 6682; Sahih Muslim 2694",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6682",
    },
    {
      title: "A Treasure Of Paradise",
      count: "Repeat often",
      arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      transliteration: "La hawla wa la quwwata illa billah.",
      meaning: "There is no power nor strength except with Allah.",
      effect:
        "The authentic narration calls it a treasure from the treasures of Paradise, training the heart to rely on Allah's aid.",
      source: "Sahih al-Bukhari 6384; Sahih Muslim 2704",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6384",
    },
    {
      title: "Salawat Upon The Prophet ﷺ",
      count: "Start with 10 times",
      arabic: "اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ",
      transliteration: "Allahumma salli 'ala Muhammad.",
      meaning: "O Allah, send blessings upon Muhammad.",
      effect:
        "Sahih Muslim reports that whoever sends one blessing upon the Prophet ﷺ, Allah sends ten blessings upon them.",
      source: "Sahih Muslim 408",
      quality: "Sahih",
      url: "https://sunnah.com/muslim:408",
    },
    {
      title: "Words That Fill The Scales",
      count: "Any time",
      arabic: "الْحَمْدُ لِلَّهِ، سُبْحَانَ اللَّهِ",
      transliteration: "Alhamdulillah. SubhanAllah.",
      meaning: "All praise belongs to Allah. Glory be to Allah.",
      effect:
        "Sahih Muslim mentions praise filling the Scale and glorification with praise filling what is between the heavens and earth.",
      source: "Sahih Muslim 223",
      quality: "Sahih",
      url: "https://sunnah.com/muslim:223",
    },
    {
      title: "Seeking Forgiveness",
      count: "Repeat throughout the day",
      arabic: "أَسْتَغْفِرُ اللَّهَ",
      transliteration: "Astaghfirullah.",
      meaning: "I seek Allah's forgiveness.",
      effect:
        "The Prophet ﷺ regularly sought forgiveness, teaching that repentance is a daily posture, not a last resort.",
      source: "Sahih al-Bukhari 6307",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6307",
    },
    {
      title: "After Prayer Remembrance",
      count: "33, 33, 34",
      arabic: "سُبْحَانَ اللَّهِ، الْحَمْدُ لِلَّهِ، اللَّهُ أَكْبَرُ",
      transliteration: "SubhanAllah. Alhamdulillah. Allahu Akbar.",
      meaning: "Glory be to Allah. Praise belongs to Allah. Allah is the Greatest.",
      effect:
        "Authentic narrations teach these words after prayer and before sleep, keeping worship present beyond the prayer itself.",
      source: "Sahih al-Bukhari 3705; Sahih Muslim 2727",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:3705",
    },
  ],
  hadiths: [
    {
      title: "Intention Gives Direction",
      text: "Actions are judged by intentions, and each person will have what they intended.",
      narrator: "Narrated from 'Umar ibn al-Khattab رضي الله عنه",
      explain:
        "The same outward deed can rise or fall by the heart behind it. Begin ordinary tasks with a clean intention.",
      source: "Sahih al-Bukhari 1; Sahih Muslim 1907",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:1",
    },
    {
      title: "Guard The Tongue",
      text: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
      narrator: "Narrated from Abu Hurayrah رضي الله عنه",
      explain:
        "Speech is not small in Islam. Silence can be worship when words would harm, show off, or inflame.",
      source: "Sahih al-Bukhari 6018; Sahih Muslim 47",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6018",
    },
    {
      title: "Religion Is Sincere Counsel",
      text: "The religion is sincere advice.",
      narrator: "Narrated from Tamim ad-Dari رضي الله عنه",
      explain:
        "Nasiha means wanting good sincerely: for Allah, His Book, His Messenger ﷺ, Muslim leaders, and ordinary believers.",
      source: "Sahih Muslim 55a",
      quality: "Sahih",
      url: "https://sunnah.com/muslim:55a",
    },
    {
      title: "Real Strength",
      text: "The strong person is the one who controls himself when angry.",
      narrator: "Narrated from Abu Hurayrah رضي الله عنه",
      explain:
        "Prophetic strength is self-command. Anger may arrive quickly, but the believer is trained to stop before it rules.",
      source: "Sahih al-Bukhari 6114; Sahih Muslim 2609",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6114",
    },
    {
      title: "Learn And Teach Qur'an",
      text: "The best among you are those who learn the Qur'an and teach it.",
      narrator: "Narrated from 'Uthman رضي الله عنه",
      explain:
        "The Qur'an is not only recited for private blessing; learning it should make us people who pass light on.",
      source: "Sahih al-Bukhari 5027",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:5027",
    },
    {
      title: "Love For Others",
      text: "None of you truly believes until he loves for his brother what he loves for himself.",
      narrator: "Narrated from Anas ibn Malik رضي الله عنه",
      explain:
        "Faith changes the way we measure fairness. We stop treating dignity, safety, and guidance as things only we deserve.",
      source: "Sahih al-Bukhari 13; Sahih Muslim 45",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:13",
    },
    {
      title: "Allah Loves Gentleness",
      text: "Allah is gentle and loves gentleness.",
      narrator: "Narrated from 'A'ishah رضي الله عنها",
      explain:
        "Gentleness is not softness toward falsehood. It is the prophetic way of carrying truth without crushing people.",
      source: "Sahih Muslim 2593",
      quality: "Sahih",
      url: "https://sunnah.com/muslim:2593",
    },
    {
      title: "Make Things Easy",
      text: "Make things easy and do not make them difficult; give glad tidings and do not repel people.",
      narrator: "Narrated from Anas ibn Malik رضي الله عنه",
      explain:
        "Ease here means guiding people toward obedience with wisdom, clarity, and mercy rather than harshness.",
      source: "Sahih al-Bukhari 69; Sahih Muslim 1734",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:69",
    },
    {
      title: "Charity Does Not Decrease Wealth",
      text: "Charity does not decrease wealth.",
      narrator: "Narrated from Abu Hurayrah رضي الله عنه",
      explain:
        "The hadith trains the heart to see provision beyond arithmetic: giving for Allah carries unseen replacement and purification.",
      source: "Sahih Muslim 2588",
      quality: "Sahih",
      url: "https://sunnah.com/muslim:2588",
    },
    {
      title: "Small, Steady Deeds",
      text: "The most beloved deeds to Allah are those done consistently, even if they are few.",
      narrator: "Narrated from 'A'ishah رضي الله عنها",
      explain:
        "Consistency protects worship from becoming only a mood. Choose a small deed you can keep.",
      source: "Sahih al-Bukhari 6464; Sahih Muslim 783",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6464",
    },
  ],
  quotes: [
    {
      quote: "Richness is not having many possessions; richness is richness of the soul.",
      person: "Prophet Muhammad ﷺ",
      reflection:
        "Contentment is a form of freedom. It lets the heart use wealth without being owned by it.",
      source: "Sahih al-Bukhari 6446; Sahih Muslim 1051",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6446",
    },
    {
      quote: "Do not become angry.",
      person: "Prophet Muhammad ﷺ",
      reflection:
        "The shortness of the advice is part of its force: stop anger before it becomes speech, action, or regret.",
      source: "Sahih al-Bukhari 6116",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6116",
    },
    {
      quote: "A good word is charity.",
      person: "Prophet Muhammad ﷺ",
      reflection:
        "Kind speech is not decorative. It is a real sadaqah that can lift another person's day.",
      source: "Sahih al-Bukhari 2989; Sahih Muslim 1009",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:2989",
    },
    {
      quote: "Modesty is part of faith.",
      person: "Prophet Muhammad ﷺ",
      reflection:
        "Haya protects the private and public self from becoming careless with Allah's limits.",
      source: "Sahih al-Bukhari 24; Sahih Muslim 36",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:24",
    },
    {
      quote: "The believer is not stung from the same hole twice.",
      person: "Prophet Muhammad ﷺ",
      reflection:
        "Mercy does not cancel wisdom. A believer learns from harm and changes the pattern.",
      source: "Sahih al-Bukhari 6133; Sahih Muslim 2998",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6133",
    },
    {
      quote: "Whoever is deprived of gentleness is deprived of good.",
      person: "Prophet Muhammad ﷺ",
      reflection:
        "Gentleness often opens doors that force cannot, especially in family, advice, and da'wah.",
      source: "Sahih Muslim 2592",
      quality: "Sahih",
      url: "https://sunnah.com/muslim:2592",
    },
    {
      quote: "Facilitate things and do not make them hard.",
      person: "Prophet Muhammad ﷺ",
      reflection:
        "The Sunnah gives people a path toward Allah that is firm, clear, and merciful.",
      source: "Sahih al-Bukhari 69",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:69",
    },
    {
      quote: "The best among you are those who learn the Qur'an and teach it.",
      person: "Prophet Muhammad ﷺ",
      reflection:
        "Even one verse learned well and shared sincerely can become a door of lasting good.",
      source: "Sahih al-Bukhari 5027",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:5027",
    },
    {
      quote: "The believer sees his sins as if sitting beneath a mountain.",
      person: "Ibn Mas'ud رضي الله عنه",
      reflection:
        "A living heart does not normalize disobedience. It feels the weight of returning to Allah.",
      source: "Sahih al-Bukhari 6308",
      quality: "Sahih companion report",
      url: "https://sunnah.com/bukhari:6308",
    },
    {
      quote: "Whoever believes in Allah and the Last Day should honor his guest.",
      person: "Prophet Muhammad ﷺ",
      reflection:
        "Faith is visible in hospitality: making another person feel safe, welcomed, and respected.",
      source: "Sahih al-Bukhari 6018; Sahih Muslim 47",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:6018",
    },
  ],
  stories: [
    {
      title: "Yunus In The Darkness",
      body:
        "Prophet Yunus عليه السلام called upon Allah from layered darkness with tawhid, tasbih, and confession. Allah rescued him and said that He saves the believers in this way.",
      moral:
        "When you are trapped by consequences, do not perform despair. Return with truth: Allah is perfect, and I need forgiveness.",
      action: "Make the dua of Yunus slowly once today.",
      source: "Qur'an 21:87-88",
      quality: "Revelation",
      url: "https://quran.com/21/87-88",
    },
    {
      title: "Yusuf Forgives His Brothers",
      body:
        "After years of separation and injustice, Prophet Yusuf عليه السلام held power over the brothers who wronged him. He chose pardon and pointed them back to Allah's mercy.",
      moral:
        "Strength is not always taking revenge when you can. Sometimes it is freeing your heart for the sake of Allah.",
      action: "Release one old resentment into dua.",
      source: "Qur'an 12:89-92",
      quality: "Revelation",
      url: "https://quran.com/12/89-92",
    },
    {
      title: "Musa And Khidr",
      body:
        "Prophet Musa عليه السلام traveled to learn from Khidr, then saw events that looked painful or confusing until Allah's wisdom behind them was revealed.",
      moral:
        "Not every closed door is punishment. Some are protection whose mercy becomes visible later.",
      action: "Say alhamdulillah for one thing you do not yet understand.",
      source: "Qur'an 18:60-82",
      quality: "Revelation",
      url: "https://quran.com/18/60-82",
    },
    {
      title: "The People Of The Cave",
      body:
        "A group of young believers left a corrupt environment to protect their faith. Allah sheltered them and made their story a sign.",
      moral:
        "A young heart can be serious about Allah. Leaving a harmful setting may be the beginning of mercy.",
      action: "Name one environment that strengthens your deen and one that weakens it.",
      source: "Qur'an 18:13-26",
      quality: "Revelation",
      url: "https://quran.com/18/13-26",
    },
    {
      title: "Maryam's Provision",
      body:
        "Whenever Zakariya عليه السلام entered upon Maryam عليها السلام, he found provision with her. She answered that it was from Allah, who gives without measure.",
      moral:
        "Allah's provision is not limited to the doors people can see. Private worship can open private gifts.",
      action: "Protect one sincere deed between you and Allah.",
      source: "Qur'an 3:37",
      quality: "Revelation",
      url: "https://quran.com/3/37",
    },
    {
      title: "A Small Group With Great Certainty",
      body:
        "When Talut's army faced Jalut, many were shaken. A smaller group trusted Allah and said that many small groups have overcome larger ones by Allah's permission.",
      moral:
        "Numbers matter, but they do not rule Allah's decree. Courage grows when reliance is tied to obedience.",
      action: "Ask Allah for firmness before a difficult task.",
      source: "Qur'an 2:249-251",
      quality: "Revelation",
      url: "https://quran.com/2/249-251",
    },
    {
      title: "Ibrahim Seeks Certainty",
      body:
        "Prophet Ibrahim عليه السلام asked Allah to show him how the dead are brought to life. He already believed, but he wanted his heart to be reassured.",
      moral:
        "Seeking reassurance with adab is not the enemy of faith. It can be a path toward deeper certainty.",
      action: "Turn one sincere question into study, not suspicion.",
      source: "Qur'an 2:260",
      quality: "Revelation",
      url: "https://quran.com/2/260",
    },
    {
      title: "The Three Men In The Cave",
      body:
        "Three travelers were trapped by a rock and each called upon Allah by mentioning a sincere deed done only for Him. Allah removed the hardship.",
      moral:
        "Hidden sincerity is a provision for days you cannot predict. Do good quietly; Allah knows where it will help you.",
      action: "Choose one deed today that no one needs to know about.",
      source: "Sahih al-Bukhari 2215; Sahih Muslim 2743",
      quality: "Sahih",
      url: "https://sunnah.com/bukhari:2215",
    },
    {
      title: "Asiyah's Higher Home",
      body:
        "The wife of Fir'awn asked Allah for a home near Him in Paradise and for rescue from tyranny and wrongdoing.",
      moral:
        "A corrupt environment does not own the believer's heart. Loyalty to Allah can survive pressure from every side.",
      action: "Ask Allah for a heart attached to the Hereafter.",
      source: "Qur'an 66:11",
      quality: "Revelation",
      url: "https://quran.com/66/11",
    },
    {
      title: "Luqman's Advice",
      body:
        "Luqman taught his son tawhid, gratitude, prayer, patience, humility, and measured speech. His counsel began with the heart and reached daily manners.",
      moral:
        "Good advice is not only information. It is love shaped into priorities.",
      action: "Give one gentle reminder with mercy, or accept one without pride.",
      source: "Qur'an 31:12-19",
      quality: "Revelation",
      url: "https://quran.com/31/12-19",
    },
  ],
};

readings.stories = [
  {
    title: "Yunus In The Darkness",
    body:
      "Prophet Yunus left his people after they rejected him, and the next part of his story placed him in a situation no person could engineer their way out of: the belly of the fish, beneath the sea, in layered darkness. The Qur'an does not present his rescue as luck or cleverness. It shows a servant who recognized Allah's perfection and his own need. He called with tawhid, tasbih, and confession: there is no god but You, glory be to You, I was among the wrongdoers. The moment is powerful because Yunus did not dress up his mistake. He did not bargain with Allah or blame everyone around him. He returned to the truth, and Allah answered him from a place where no human help could reach.",
    lesson:
      "Notice the order of his dua: Allah's oneness first, Allah's perfection second, and personal accountability third. That is why the story teaches hope without excuses.",
    moral:
      "When consequences close in, despair is not the believer's only script. Return with truth: Allah is perfect, and I am the one in need of mercy. A dark place can become the beginning of rescue when it becomes the place of sincere repentance.",
    action: "Make the dua of Yunus slowly once today, especially over one mistake you are ready to correct.",
    source: "Qur'an 21:87-88",
    quality: "Revelation",
    url: "https://quran.com/21/87-88",
  },
  {
    title: "Yusuf Forgives His Brothers",
    body:
      "Prophet Yusuf was separated from his father, thrown into the well, sold into another land, tested in private, and imprisoned despite his innocence. Years later, Allah raised him to authority, and the brothers who had once planned against him came before him in need. This was the kind of moment where wounded pride can become cruelty. Yusuf had memory, power, and the legal ability to expose them. Instead, he chose prophetic nobility. He reminded them that Allah had been kind, refused to humiliate them, and said there was no blame upon them that day. His forgiveness did not erase the wrong, but it refused to let the wrong become the ruler of his character.",
    lesson:
      "The story is not saying every harm should be ignored. It is showing that when Allah gives you the upper hand, taqwa must still control how you use it.",
    moral:
      "Strength is not always taking revenge when you can. Sometimes real strength is refusing to let the past make you unjust in the present. Yusuf's forgiveness was not weakness; it was a heart healed enough to choose Allah's pleasure over a dramatic payback.",
    action: "Release one old resentment into dua, and ask Allah to replace bitterness with wisdom.",
    source: "Qur'an 12:89-92",
    quality: "Revelation",
    url: "https://quran.com/12/89-92",
  },
  {
    title: "Musa And Khidr",
    body:
      "Prophet Musa traveled to learn from Khidr and witnessed moments that looked wrong from the outside: a boat was damaged, a painful loss occurred, and a wall was repaired for people who had refused hospitality. Musa objected because he loved justice and could only see the visible layer of events. Later, Khidr explained what Allah had taught him: damaging the boat protected poor owners from a tyrant, the painful matter protected believing parents from a future trial, and repairing the wall preserved the inheritance of two orphans because their father had been righteous. The story slows the heart down. It teaches that Allah's wisdom can be present even when the first reading of a situation feels confusing.",
    lesson:
      "The lesson is not to stop caring about right and wrong. The lesson is to admit that human sight is limited, while Allah's knowledge covers the visible and hidden future.",
    moral:
      "Not every closed door is punishment. Some are protection whose mercy becomes visible only when Allah allows the full picture to appear. Patience is not pretending pain is easy; it is trusting Allah while the meaning is still covered.",
    action: "Say alhamdulillah for one thing you do not yet understand, and ask Allah for patience until its wisdom becomes clear.",
    source: "Qur'an 18:60-82",
    quality: "Revelation",
    url: "https://quran.com/18/60-82",
  },
  {
    title: "The People Of The Cave",
    body:
      "A group of young believers lived among people whose pressure threatened their faith. They did not have the public power to reshape the society around them, but they had enough conviction to protect what mattered most. They withdrew to a cave and asked Allah for mercy and right guidance. Allah protected them in a way no plan could have produced, causing them to sleep for years and making their story a sign for later generations. Their courage was not loud or performative. It was the quiet decision to choose Allah over approval when the cost felt real.",
    lesson:
      "Youth is not an excuse for shallow faith. The Qur'an specifically highlights them as young people whose guidance increased because they believed and acted on that belief.",
    moral:
      "A young heart can be serious about Allah. Leaving a harmful setting may not be weakness; it may be the first step into mercy. Sometimes protecting iman means choosing a smaller circle, a quieter place, and a cleaner influence.",
    action: "Name one environment that strengthens your deen and one that weakens it, then make one practical change.",
    source: "Qur'an 18:13-26",
    quality: "Revelation",
    url: "https://quran.com/18/13-26",
  },
  {
    title: "Maryam's Provision",
    body:
      "Maryam was placed under the care of Zakariya, and he would find provision with her in a way that made him ask where it came from. Her answer was simple and certain: it was from Allah, who provides without measure. That answer did more than explain her provision. It awakened hope in Zakariya's own heart. Seeing Allah provide for Maryam in an unexpected way reminded him to ask for something that looked impossible by ordinary means: a child in old age. Her private honor became a doorway for another prophet's dua.",
    lesson:
      "A blessing in someone else's life does not need to trigger envy. It can trigger remembrance, hope, and a renewed dua from your own heart.",
    moral:
      "Allah's provision is not limited to the doors people can see. Private worship can open private gifts, and another person's blessing can remind you to ask Allah again. The one who gives without measure is not restricted by your timeline.",
    action: "Protect one sincere deed between you and Allah, and make one dua you had almost stopped making.",
    source: "Qur'an 3:37",
    quality: "Revelation",
    url: "https://quran.com/3/37",
  },
  {
    title: "A Small Group With Great Certainty",
    body:
      "When Talut's army faced Jalut, the visible odds looked frightening. Some people read the situation only through numbers, size, and military strength, and their hearts collapsed before the battle even began. A smaller group saw the same scene through faith and said that many small groups have overcome larger ones by Allah's permission. Their certainty did not make them careless. It made them steady enough to obey, move, and ask Allah for patience and firmness. The Qur'an shows that courage is not the absence of fear; it is fear placed under obedience to Allah.",
    lesson:
      "Reliance on Allah is not passive optimism. The believing group made dua, stayed firm, and still stepped into the responsibility in front of them.",
    moral:
      "Numbers matter, but they do not rule Allah's decree. Courage grows when reliance on Allah is joined to obedience and action. A small group with sincerity can be heavier with Allah than a crowd without certainty.",
    action: "Ask Allah for firmness before a difficult task, then take the next responsible step.",
    source: "Qur'an 2:249-251",
    quality: "Revelation",
    url: "https://quran.com/2/249-251",
  },
  {
    title: "Ibrahim Seeks Certainty",
    body:
      "Prophet Ibrahim asked Allah to show him how the dead are brought to life. When Allah asked whether he did not believe, Ibrahim answered that he did believe, but wanted his heart to be reassured. That answer matters. It separates sincere reassurance from arrogant doubt. Allah then taught him through a sign, moving certainty from belief held in the heart to reassurance witnessed by the heart. The story gives believers room to seek understanding with adab, without turning questions into suspicion against Allah.",
    lesson:
      "A question can either become a path to guidance or a doorway to restlessness. Ibrahim shows the first path: belief, humility, and a request for reassurance from Allah.",
    moral:
      "Seeking reassurance with adab is not the enemy of faith. The problem is not having a question; the problem is feeding suspicion instead of seeking guidance. A heart can believe and still ask Allah to make that belief calmer and deeper.",
    action: "Turn one sincere question into study, not suspicion, and ask someone trustworthy if you need help.",
    source: "Qur'an 2:260",
    quality: "Revelation",
    url: "https://quran.com/2/260",
  },
  {
    title: "The Three Men In The Cave",
    body:
      "Three travelers took shelter in a cave, and a rock sealed the entrance until they could not escape. No tool, status, or clever speech could move it. Each man called upon Allah by mentioning a deed he had done sincerely for Him: one had honored his parents with deep patience, one had restrained himself from a major sin at the moment he could have fallen into it, and one had protected another person's wealth until it grew and returned it faithfully. With each sincere plea, the rock moved, until Allah opened the way out. The story teaches that hidden sincerity is not wasted. It may become the very thing Allah makes a means of rescue later.",
    lesson:
      "Each deed was difficult in a different way: family duty, private self-control, and financial trust. Sincerity is proven in the places where the ego has something to gain.",
    moral:
      "Hidden sincerity is a provision for days you cannot predict. Deeds done quietly for Allah are not lost just because people never applauded them. What is private with Allah can become protection when everything public fails.",
    action: "Choose one deed today that no one needs to know about, and guard it from being shown off.",
    source: "Sahih al-Bukhari 2215; Sahih Muslim 2743",
    quality: "Sahih",
    url: "https://sunnah.com/bukhari:2215",
  },
  {
    title: "Asiyah's Higher Home",
    body:
      "Asiyah lived in the house of Fir'awn, surrounded by power, luxury, and oppression. From the outside, the palace looked like success. From the inside, it was a place where truth was fought and believers were harmed. Yet her heart was not owned by the palace. She asked Allah for a home near Him in Paradise and for rescue from Fir'awn, his actions, and wrongdoing people. Her dua is precise: she did not merely ask to escape difficulty; she asked for nearness to Allah first. The order of her dua exposes the real scale of success. A person can be near worldly power and far from peace, or hidden from people and near Allah.",
    lesson:
      "Asiyah's example is especially powerful because environment did not excuse surrender. Faith can stay alive even when the room around it is hostile.",
    moral:
      "A corrupt environment does not own the believer's heart. Loyalty to Allah can survive pressure from every side when the Hereafter is more real than status. The highest home is the one near Allah, not the one admired by people.",
    action: "Ask Allah for a heart attached to the Hereafter, especially when the world looks impressive.",
    source: "Qur'an 66:11",
    quality: "Revelation",
    url: "https://quran.com/66/11",
  },
  {
    title: "Luqman's Advice",
    body:
      "Luqman advised his son with priorities that began deep in the heart and reached ordinary daily behavior. He warned him against shirk, taught gratitude, reminded him that Allah knows even the smallest hidden deed, and connected prayer with patience and moral courage. His advice did not stop at belief as an idea. It shaped manners: do not turn from people in pride, do not walk arrogantly, and keep speech measured. That is what makes the passage complete. It teaches that a believer's creed should become a believer's character, posture, voice, patience, and public behavior.",
    lesson:
      "Luqman teaches in layers: correct worship, grateful heart, awareness of Allah, prayer, patience, humility, and speech. A balanced Islamic life needs all of them.",
    moral:
      "Good advice is not only information. It is love shaped into priorities, and the best reminders teach both belief and character. The best advice does not just win an argument; it grows a person.",
    action: "Give one gentle reminder with mercy, or accept one without pride when someone reminds you.",
    source: "Qur'an 31:12-19",
    quality: "Revelation",
    url: "https://quran.com/31/12-19",
  },
];

readings.rulings = [
  {
    title: "A Little Alcohol Is Still Not Halal",
    verdict: "Haram",
    tone: "haram",
    myth: "Some people treat a small drink, a party sip, or a drink that feels socially normal as harmless.",
    ruling:
      "Intoxicants are haram, and the rule is not based on whether the person personally feels they can control it.",
    why:
      "Allah commands believers to avoid intoxicants, and the hadith states that whatever intoxicates in large amounts is unlawful even in small amounts.",
    consequence:
      "The specific warning for drinking and becoming drunk is severe: the hadith says that prayer is not accepted for forty days, while also mentioning that repentance is accepted when the person repents.",
    source: "Qur'an 5:90",
    quality: "Revelation",
    url: "https://quran.com/5/90",
    extraSources: [
      { source: "Jami` at-Tirmidhi 1865", quality: "Hasan", url: "https://sunnah.com/tirmidhi:1865" },
      { source: "Sunan Ibn Majah 3377", quality: "Hadith warning", url: "https://sunnah.com/ibnmajah:3377" },
    ],
  },
  {
    title: "Horoscopes Are Not Harmless Fun",
    verdict: "Haram",
    tone: "haram",
    myth: "People sometimes read horoscopes, tarot-style posts, or fortune-teller content as entertainment.",
    ruling:
      "Seeking hidden knowledge from fortune-tellers, diviners, or prediction systems is haram and contradicts reliance on Allah.",
    why:
      "The unseen belongs to Allah. Sahih Muslim records a direct warning about visiting a diviner and asking about anything.",
    consequence:
      "The hadith gives a specific consequence: the person's prayers for forty nights will not be accepted. That wording is specific to this sin, so the app does not apply it to every haram matter.",
    source: "Sahih Muslim 2230",
    quality: "Sahih",
    url: "https://sunnah.com/muslim:2230",
  },
  {
    title: "Interest Is Not Made Halal By Calling It Normal",
    verdict: "Haram",
    tone: "haram",
    myth: "Because modern interest is everywhere, people may assume riba becomes acceptable when banks make it routine.",
    ruling:
      "Riba remains haram. A common financial system does not override revelation.",
    why:
      "The Qur'an commands believers to give up what remains of riba and warns those who refuse. Sahih Muslim also records a curse on the one who consumes riba, pays it, records it, and witnesses it.",
    consequence:
      "The Qur'an gives one of the strongest warnings in the deen: if people do not give it up, they are warned of war from Allah and His Messenger.",
    source: "Qur'an 2:278-279",
    quality: "Revelation",
    url: "https://quran.com/2/278-279",
    extraSources: [
      { source: "Sahih Muslim 1598", quality: "Sahih", url: "https://sunnah.com/muslim:1598" },
    ],
  },
  {
    title: "Backbiting Is Haram Even When It Is True",
    verdict: "Haram",
    tone: "haram",
    myth: "A common excuse is, 'But what I said about them is true.'",
    ruling:
      "Backbiting is mentioning a person in a way they would dislike, even if the fault is real. If the claim is false, it becomes slander.",
    why:
      "The Qur'an directly forbids backbiting, and Sahih Muslim defines it through the Prophet's explanation.",
    consequence:
      "The Qur'an makes the warning emotionally heavy by comparing backbiting to eating the flesh of one's dead brother. That is the warning given here, not a made-up prayer penalty.",
    source: "Qur'an 49:12",
    quality: "Revelation",
    url: "https://quran.com/49/12",
    extraSources: [
      { source: "Sahih Muslim 2589", quality: "Sahih", url: "https://sunnah.com/muslim:2589" },
    ],
  },
  {
    title: "Seafood Is Halal",
    verdict: "Halal",
    tone: "halal",
    myth: "Some people become suspicious of seafood generally and treat it like it must be avoided unless proven otherwise.",
    ruling:
      "Seafood is lawful in the Qur'anic text, with the verse making sea game and its food permissible as provision.",
    why:
      "The default here is not suspicion. Allah explicitly permits the food of the sea while giving separate rules for hunting on land during pilgrimage.",
    consequence:
      "There is no sin in eating what Allah made lawful. The caution is the opposite: do not declare halal things haram without knowledge.",
    source: "Qur'an 5:96",
    quality: "Revelation",
    url: "https://quran.com/5/96",
  },
  {
    title: "Looking Good Is Halal, Pride Is Not",
    verdict: "Halal With Limits",
    tone: "halal",
    myth: "Some people think clean clothes, nice shoes, and caring about appearance must be pride.",
    ruling:
      "Looking presentable is halal when it stays within Islamic limits and does not become arrogance, extravagance, or showing off.",
    why:
      "In Sahih Muslim, the Prophet clarified that Allah is beautiful and loves beauty, then defined pride as rejecting truth and looking down on people.",
    consequence:
      "The severe warning in the same hadith is against pride: a heart with even a tiny weight of pride is threatened with not entering Paradise.",
    source: "Sahih Muslim 91a",
    quality: "Sahih",
    url: "https://sunnah.com/muslim:91a",
  },
  {
    title: "Gold And Silk Are Not Men's Fashion In Islam",
    verdict: "Haram For Men",
    tone: "haram",
    myth: "Gold jewellery or pure silk can be treated as just another luxury style for Muslim men.",
    ruling:
      "Gold and silk are prohibited for the males of this ummah while being treated differently for women in the hadith tradition.",
    why:
      "Sunan Abi Dawud records the Prophet holding silk and gold and saying both are prohibited for the males of his community.",
    consequence:
      "The consequence stated in this entry is the prohibition itself. The source does not say prayers are rejected for this, so the app does not invent that detail.",
    source: "Sunan Abi Dawud 4057",
    quality: "Sahih",
    url: "https://sunnah.com/abudawud:4057",
  },
  {
    title: "Prize Games Are Not All The Same",
    verdict: "Check The Stake",
    tone: "haram",
    myth: "People often mix up a free prize, a sponsor-funded competition, and a participant-funded prize pool as if they are all the same.",
    ruling:
      "If you risk money or value for a chance to win from others, that is gambling and is haram. A genuinely free or externally funded prize can be a different case and may need scholar review.",
    why:
      "The Qur'an forbids maysir because it creates enmity, hatred, and heedlessness. Scholars also discuss prize competitions separately, especially where no participant-funded stake is being lost.",
    consequence:
      "The warning is not only about money. The Qur'an says gambling plants hostility and blocks people from the remembrance of Allah and prayer, so doubtful prize schemes should not be treated casually.",
    source: "Qur'an 5:90-91",
    quality: "Revelation",
    url: "https://quran.com/5/90-91",
    extraSources: [
      { source: "Sunan an-Nasa'i 3588", quality: "Sahih", url: "https://sunnah.com/nasai:3588" },
      {
        source: "IslamWeb Fatwa 142039",
        quality: "Scholar note",
        url: "https://www.islamweb.net/en/fatwa/142039/paying-entry-fees-to-participate-in-a-sports-tournament",
      },
      {
        source: "Jordan Dar al-Iftaa 4011",
        quality: "Scholar note",
        url: "https://aliftaa.jo/research-fatwa-english/4011/Ruling--of-Islamic-Law-on-Winning-Prizes-from-Competitions-and-Games",
      },
    ],
  },
];

readings.verses.push(
  {
    title: "Remember And Be Remembered",
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    transliteration: "Fadhkuruni adhkurkum washkuru li wa la takfurun.",
    meaning: "Remember Me; I will remember you. Be grateful to Me and do not be ungrateful.",
    explain:
      "Allah makes remembrance personal: the servant remembers Allah with worship and gratitude, and Allah remembers the servant with mercy, reward, and care.",
    source: "Qur'an 2:152",
    quality: "Revelation",
    url: "https://quran.com/2/152",
    revealed: "Madinan, in Surah Al-Baqarah.",
    whyRevealed:
      "It appears after guidance around the qiblah and gratitude, teaching the community that remembrance and thankfulness are daily foundations.",
    contextUrl: "https://quran.com/2/152",
  },
  {
    title: "Help Through Patience And Prayer",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
    transliteration: "Ya ayyuhalladhina amanu ista'inu bis-sabri was-salah.",
    meaning: "O believers, seek help through patience and prayer.",
    explain:
      "The verse gives a practical way through pressure: hold steady, pray, and remember that Allah is with those who are patient.",
    source: "Qur'an 2:153",
    quality: "Revelation",
    url: "https://quran.com/2/153",
    revealed: "Madinan, in Surah Al-Baqarah.",
    whyRevealed:
      "It trains the early Muslim community to meet tests with sabr and salah, not panic or resentment.",
    contextUrl: "https://quran.com/2/153",
  },
  {
    title: "Paths Opened By Striving",
    arabic: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا",
    transliteration: "Walladhina jahadu fina lanahdiyannahum subulana.",
    meaning: "Those who strive for Us, We will surely guide them to Our ways.",
    explain:
      "Guidance grows with sincere effort. The believer does not wait to become perfect before moving toward Allah.",
    source: "Qur'an 29:69",
    quality: "Revelation",
    url: "https://quran.com/29/69",
    revealed: "Makkan, at the close of Surah Al-'Ankabut.",
    whyRevealed:
      "It closes a surah about trials by promising guidance to people who keep striving for Allah despite pressure.",
    contextUrl: "https://quran.com/surah/29/info",
  },
  {
    title: "The Heart Under Allah's Permission",
    arabic: "وَمَن يُؤْمِن بِاللَّهِ يَهْدِ قَلْبَهُ",
    transliteration: "Wa man yu'min billahi yahdi qalbah.",
    meaning: "Whoever believes in Allah, He guides their heart.",
    explain:
      "Faith does not always remove the test, but it gives the heart a direction inside the test.",
    source: "Qur'an 64:11",
    quality: "Revelation",
    url: "https://quran.com/64/11",
    revealed: "Madinan, in Surah At-Taghabun.",
    whyRevealed:
      "It teaches that calamities occur by Allah's permission and that faith guides the heart through what it cannot control.",
    contextUrl: "https://quran.com/64/11",
  },
  {
    title: "Mercy At Home",
    arabic: "وَقُل رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    transliteration: "Wa qul Rabbi irhamhuma kama rabbayani saghira.",
    meaning: "Say: My Lord, have mercy on them as they raised me when I was small.",
    explain:
      "The Qur'an makes gratitude to parents a lived ethic: lowered speech, humility, and dua.",
    source: "Qur'an 17:23-24",
    quality: "Revelation",
    url: "https://quran.com/17/23-24",
    revealed: "Makkan, in Surah Al-Isra.",
    whyRevealed:
      "The passage joins worship of Allah alone with excellent treatment of parents, especially when they become vulnerable.",
    contextUrl: "https://quran.com/17/23-24",
  },
  {
    title: "A Life That Is Not Loss",
    arabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
    transliteration: "Illalladhina amanu wa 'amilus-salihat wa tawasaw bil-haqqi wa tawasaw bis-sabr.",
    meaning: "Except those who believe, do righteous deeds, and urge one another to truth and patience.",
    explain:
      "Surah Al-'Asr compresses the believer's rescue plan: faith, action, truth, and patient community.",
    source: "Qur'an 103:1-3",
    quality: "Revelation",
    url: "https://quran.com/103",
    revealed: "Makkan, in Surah Al-'Asr.",
    whyRevealed:
      "A short Makkan surah that defines what saves a person from loss in time, priorities, and the Hereafter.",
    contextUrl: "https://quran.com/surah/103/info",
  },
);

readings.duas.push(
  {
    title: "Mercy And Right Guidance",
    arabic: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    transliteration: "Rabbana atina min ladunka rahmatan wa hayyi' lana min amrina rashada.",
    meaning: "Our Lord, grant us mercy from Yourself and arrange right guidance for us in our affair.",
    effect:
      "The young believers of the cave asked for mercy and sound direction before Allah opened a way no one could predict.",
    source: "Qur'an 18:10",
    quality: "Revelation",
    url: "https://quran.com/18/10",
  },
  {
    title: "Make Me Establish Prayer",
    arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي",
    transliteration: "Rabbij'alni muqimas-salati wa min dhurriyyati.",
    meaning: "My Lord, make me one who establishes prayer, and also from my descendants.",
    effect:
      "Ibrahim's dua asks not only to pray, but to become a person whose life is built around prayer.",
    source: "Qur'an 14:40",
    quality: "Revelation",
    url: "https://quran.com/14/40",
  },
  {
    title: "In Need Of Your Good",
    arabic: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    transliteration: "Rabbi inni lima anzalta ilayya min khayrin faqir.",
    meaning: "My Lord, I am truly in need of whatever good You send down to me.",
    effect:
      "Musa said this after helping others while he himself was in need, teaching humble dependence without self-pity.",
    source: "Qur'an 28:24",
    quality: "Revelation",
    url: "https://quran.com/28/24",
  },
  {
    title: "Ayyub's Patient Call",
    arabic: "أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ",
    transliteration: "Anni massaniyad-durru wa Anta arhamur-rahimin.",
    meaning: "Harm has touched me, and You are the Most Merciful of the merciful.",
    effect:
      "Ayyub's dua combines honesty about pain with perfect adab toward Allah's mercy.",
    source: "Qur'an 21:83",
    quality: "Revelation",
    url: "https://quran.com/21/83",
  },
  {
    title: "Wisdom And The Righteous",
    arabic: "رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ",
    transliteration: "Rabbi hab li hukman wa alhiqni bis-salihin.",
    meaning: "My Lord, grant me wisdom and join me with the righteous.",
    effect:
      "Ibrahim asked for wisdom, righteous company, truthful mention, and Paradise, showing how broad a believer's ambition should be.",
    source: "Qur'an 26:83-85",
    quality: "Revelation",
    url: "https://quran.com/26/83-85",
  },
  {
    title: "Help Me Remember You",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik.",
    meaning: "O Allah, help me remember You, thank You, and worship You well.",
    effect:
      "The Prophet taught Mu'adh not to leave this supplication after the prescribed prayer.",
    source: "Sunan Abi Dawud 1522",
    quality: "Sahih",
    url: "https://sunnah.com/abudawud:1522",
  },
);

readings.dhikr.push(
  {
    title: "Morning And Evening Protection",
    count: "Morning and evening: 3 times",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'a ismihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",
    meaning: "In the Name of Allah, with whose Name nothing on earth or in heaven can harm, and He is the All-Hearing, All-Knowing.",
    effect:
      "The narration mentions protection for the one who says it three times in the morning and evening.",
    source: "Jami` at-Tirmidhi 3388",
    quality: "Hasan",
    url: "https://sunnah.com/tirmidhi:3388",
  },
  {
    title: "Words Heavier Than A Long Sitting",
    count: "Morning remembrance",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",
    transliteration: "SubhanAllahi wa bihamdihi 'adada khalqihi wa rida nafsihi wa zinata 'arshihi wa midada kalimatih.",
    meaning: "Glory and praise be to Allah, as many as His creation, as pleases Him, as heavy as His Throne, and as much as the ink of His words.",
    effect:
      "The Prophet taught these words to Juwairiyah after a long morning remembrance, showing how weighty concise dhikr can be.",
    source: "Sahih Muslim 2726a",
    quality: "Sahih",
    url: "https://sunnah.com/muslim:2726a",
  },
  {
    title: "After Wudu Testimony",
    count: "After completing wudu",
    arabic: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا عَبْدُ اللَّهِ وَرَسُولُهُ",
    transliteration: "Ashhadu an la ilaha illallah wa anna Muhammadan 'abdu Allahi wa rasuluh.",
    meaning: "I testify that there is no god but Allah and that Muhammad is the servant of Allah and His Messenger.",
    effect:
      "Sahih Muslim reports that the eight gates of Paradise are opened for the one who completes wudu well and says this.",
    source: "Sahih Muslim 234a",
    quality: "Sahih",
    url: "https://sunnah.com/muslim:234a",
  },
  {
    title: "Content With Allah",
    count: "When hearing the adhan",
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا وَبِمُحَمَّدٍ رَسُولًا وَبِالْإِسْلَامِ دِينًا",
    transliteration: "Raditu billahi rabban wa bi Muhammadin rasulan wa bil-Islami dina.",
    meaning: "I am pleased with Allah as Lord, with Muhammad as Messenger, and with Islam as religion.",
    effect:
      "Sahih Muslim reports forgiveness for the one who says this when hearing the caller to prayer.",
    source: "Sahih Muslim 386",
    quality: "Sahih",
    url: "https://sunnah.com/muslim:386",
  },
  {
    title: "After Prayer Tawhid",
    count: "After the obligatory prayer",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa 'ala kulli shay'in qadir.",
    meaning: "None has the right to be worshipped except Allah alone, without partner. His is the dominion and praise, and He has power over all things.",
    effect:
      "This is among the authentic remembrances taught after the prescribed prayers.",
    source: "Sahih Muslim 594a",
    quality: "Sahih",
    url: "https://sunnah.com/muslim:594a",
  },
);

readings.hadiths.push(
  {
    title: "Safety From The Tongue And Hand",
    text: "A Muslim is the one who avoids harming Muslims with his tongue and hands.",
    narrator: "Narrated from 'Abdullah ibn 'Amr",
    explain:
      "Islamic character is measured by how safe people are from your speech, typing, temper, and physical actions.",
    source: "Sahih al-Bukhari 10",
    quality: "Sahih",
    url: "https://sunnah.com/bukhari:10",
  },
  {
    title: "Allah Looks At Hearts And Deeds",
    text: "Allah does not look to your faces and your wealth, but He looks to your hearts and your deeds.",
    narrator: "Narrated from Abu Hurayrah",
    explain:
      "Appearance and status are not the scale. The heart and the deeds that flow from it are what need daily attention.",
    source: "Sahih Muslim 2564c",
    quality: "Sahih",
    url: "https://sunnah.com/muslim:2564c",
  },
  {
    title: "Two Blessings People Lose",
    text: "There are two blessings that many people are deceived into losing: health and free time.",
    narrator: "Narrated from Ibn 'Abbas",
    explain:
      "The hadith turns ordinary time and health into amanah. Use them before they become things you wish you still had.",
    source: "Sahih al-Bukhari 6412",
    quality: "Sahih",
    url: "https://sunnah.com/bukhari:6412",
  },
  {
    title: "Leave The Doubtful",
    text: "Both lawful and unlawful things are clear, and between them are doubtful matters.",
    narrator: "Narrated from An-Nu'man ibn Bashir",
    explain:
      "When a matter is genuinely doubtful, caution protects both religion and honor.",
    source: "Sahih al-Bukhari 52; Sahih Muslim 1599a",
    quality: "Sahih",
    url: "https://sunnah.com/bukhari:52",
  },
  {
    title: "Hardship Can Cleanse",
    text: "No fatigue, illness, sorrow, sadness, hurt, or distress befalls a Muslim, even a thorn prick, except that Allah expiates some of his sins for it.",
    narrator: "Narrated from Abu Sa'id Al-Khudri and Abu Hurayrah",
    explain:
      "Pain is not meaningless when met with faith and patience. Allah can make even small suffering a cause of purification.",
    source: "Sahih al-Bukhari 5641",
    quality: "Sahih",
    url: "https://sunnah.com/bukhari:5641",
  },
  {
    title: "Relieve Someone Else",
    text: "Whoever relieves a believer from a hardship of this world, Allah will relieve him from a hardship of the Day of Resurrection.",
    narrator: "Narrated from Abu Hurayrah",
    explain:
      "Service is not small. Allah helps the servant while the servant is helping another person.",
    source: "Sahih Muslim 2699a",
    quality: "Sahih",
    url: "https://sunnah.com/muslim:2699a",
  },
);

readings.quotes.push(
  {
    quote: "There are two blessings that many people are deceived into losing: health and free time.",
    person: "Prophet Muhammad",
    reflection:
      "A calm day is still a test. Health and spare time become worship when they are spent with intention.",
    source: "Sahih al-Bukhari 6412",
    quality: "Sahih",
    url: "https://sunnah.com/bukhari:6412",
  },
  {
    quote: "The upper hand is better than the lower hand.",
    person: "Prophet Muhammad",
    reflection:
      "The giving hand is trained in dignity, gratitude, and trust that Allah replaces what is given for His sake.",
    source: "Sahih al-Bukhari 1429; Sahih Muslim 1033",
    quality: "Sahih",
    url: "https://sunnah.com/bukhari:1429",
  },
  {
    quote: "Allah looks to your hearts and to your deeds.",
    person: "Prophet Muhammad",
    reflection:
      "Private sincerity and real action matter more than looking religious, successful, or impressive.",
    source: "Sahih Muslim 2564c",
    quality: "Sahih",
    url: "https://sunnah.com/muslim:2564c",
  },
  {
    quote: "Beware of suspicion, for suspicion is the worst of false tales.",
    person: "Prophet Muhammad",
    reflection:
      "A suspicious mind can invent stories and then punish people for them. Islam teaches restraint before certainty.",
    source: "Sahih al-Bukhari 6064",
    quality: "Sahih",
    url: "https://sunnah.com/bukhari:6064",
  },
  {
    quote: "Allah helps the servant as long as the servant helps his brother.",
    person: "Prophet Muhammad",
    reflection:
      "Helping someone else is not a distraction from your own life. It may be exactly where Allah places help for you.",
    source: "Sahih Muslim 2699a",
    quality: "Sahih",
    url: "https://sunnah.com/muslim:2699a",
  },
);

readings.stories.push(
  {
    title: "Musa's Mother Lets Go",
    body:
      "The mother of Musa was inspired to place her baby in the river when Pharaoh's threat reached its peak. From the outside, it looked like loss: a mother releasing her child into water because danger had surrounded every normal option. But Allah promised to return him and make him among the messengers. The river did not carry Musa away from Allah's plan; it carried him through the middle of that plan, even into Pharaoh's own house. Allah then returned him to his mother so her heart could be comforted.",
    lesson:
      "Sometimes tawakkul is not holding tighter. Sometimes it is obeying Allah while your heart is trembling, trusting that His promise is stronger than what you can see.",
    moral:
      "Allah can place protection inside the path that looks most frightening. The believer takes the halal means, then trusts the Owner of every outcome.",
    action: "Name one fear you are carrying, then ask Allah for a heart guided by His promise.",
    source: "Qur'an 28:7-13",
    quality: "Revelation",
    url: "https://quran.com/28/7-13",
  },
  {
    title: "Nuh Builds Before The Rain",
    body:
      "Prophet Nuh called his people for a long time, but most rejected him. Allah commanded him to build the ark under His watch. Building a ship before the flood came must have made him a target for mockery, yet Nuh kept obeying. When the command of Allah came, the thing people mocked became the means of rescue. The story teaches that obedience can look strange before its wisdom becomes public.",
    lesson:
      "Nuh's ark was not built in panic after the water rose. It was built through obedience before the sign arrived.",
    moral:
      "Do not measure truth by how many people laugh at it. If Allah commands a path, dignity is in obeying before the crowd understands.",
    action: "Do one correct thing today even if it feels unpopular or unseen.",
    source: "Qur'an 11:36-48",
    quality: "Revelation",
    url: "https://quran.com/11/36-48",
  },
  {
    title: "The Queen Who Chose Truth",
    body:
      "The Queen of Saba' received a letter from Sulayman calling her to submit to Allah. She did not react with ego. She consulted her people, observed carefully, and recognized that Sulayman's kingdom was not ordinary political power. When truth became clear, she did not cling to status. She entered Islam and acknowledged that she had wronged herself.",
    lesson:
      "Her story shows intelligence with humility: she investigates, reflects, and then submits when truth is clear.",
    moral:
      "Real leadership is not stubbornness. The strongest people can still say, 'I was wrong,' when guidance becomes clear.",
    action: "Ask Allah to make truth more beloved to you than winning an argument.",
    source: "Qur'an 27:20-44",
    quality: "Revelation",
    url: "https://quran.com/27/20-44",
  },
  {
    title: "Ka'b Tells The Truth",
    body:
      "Ka'b ibn Malik stayed behind from Tabuk without a valid excuse. When people offered false excuses, he chose truth even though it brought painful consequences. For fifty nights he lived with the weight of social separation and regret, but he did not repair one mistake with another lie. Then Allah accepted his repentance and revealed verses about the three who were left behind.",
    lesson:
      "Truth can hurt at first and still be the road to rescue. A lie may feel like shelter, but it blocks the clean ending Allah can give.",
    moral:
      "Repentance is not only regret. It is truthfulness when hiding would be easier.",
    action: "Fix one small dishonest pattern before it becomes a larger one.",
    source: "Sahih Muslim 2769a; Qur'an 9:118",
    quality: "Sahih",
    url: "https://sunnah.com/muslim:2769a",
  },
  {
    title: "The Cave During Hijrah",
    body:
      "During the Hijrah, the Prophet and Abu Bakr were in the cave while danger came close. Abu Bakr feared for the Messenger of Allah, but the Prophet reminded him that Allah was with them. The Qur'an records that Allah sent down tranquility and supported His Messenger. The cave was physically small, but Allah's protection made it wider than the plans of the enemy.",
    lesson:
      "The words 'Allah is with us' are not decorative. They are a worldview when every visible route seems blocked.",
    moral:
      "Safety is not only distance from danger. Real safety is being under Allah's care while taking the means He allows.",
    action: "Say 'Allah is with me' before one difficult responsibility, then take the next right step.",
    source: "Qur'an 9:40",
    quality: "Revelation",
    url: "https://quran.com/9/40",
  },
);

readings.rulings.push(
  {
    title: "Doubtful Things Are Not A Playground",
    verdict: "Avoid Doubtful",
    tone: "halal",
    myth: "People sometimes say, 'If it is not clearly haram to me, I can play around with it.'",
    ruling:
      "When something is genuinely doubtful and a person cannot verify it, caution is part of protecting faith and honor.",
    why:
      "The hadith states that halal and haram are clear, with doubtful matters between them that many people do not know.",
    consequence:
      "The warning is that grazing near the boundary can lead a person into what is unlawful. The app does not label every doubtful matter haram; it teaches caution until knowledge is clear.",
    source: "Sahih al-Bukhari 52",
    quality: "Sahih",
    url: "https://sunnah.com/bukhari:52",
    extraSources: [
      { source: "Sahih Muslim 1599a", quality: "Sahih", url: "https://sunnah.com/muslim:1599a" },
    ],
  },
  {
    title: "Disrespecting Parents Is Not A Small Attitude",
    verdict: "Haram",
    tone: "haram",
    myth: "Some people treat harsh words to parents as normal because everyone gets annoyed at home.",
    ruling:
      "Disrespect, contempt, and harshness toward parents are forbidden, while obedience remains within Allah's limits.",
    why:
      "The Qur'an commands excellence to parents and even forbids saying a word of irritation to them.",
    consequence:
      "The warning is spiritual and moral: a person can damage one of the greatest rights Allah placed after His worship.",
    source: "Qur'an 17:23-24",
    quality: "Revelation",
    url: "https://quran.com/17/23-24",
  },
  {
    title: "Orphan Wealth Is Not Borrowable Money",
    verdict: "Haram",
    tone: "haram",
    myth: "Someone may think they can temporarily use an orphan's money if they plan to return it later.",
    ruling:
      "Consuming or misusing orphan wealth unjustly is haram and one of the clearest financial warnings in the Qur'an.",
    why:
      "Allah directly warns against devouring the property of orphans unjustly.",
    consequence:
      "The Qur'an says those who consume orphan wealth unjustly are only consuming fire into their bellies and will burn in a blaze.",
    source: "Qur'an 4:10",
    quality: "Revelation",
    url: "https://quran.com/4/10",
  },
  {
    title: "Spying And Suspicion Are Not Investigation",
    verdict: "Haram",
    tone: "haram",
    myth: "People can justify checking phones, stalking accounts, and digging for faults by calling it 'just making sure.'",
    ruling:
      "Sinful suspicion, spying, and hunting for people's faults are forbidden.",
    why:
      "The Qur'an forbids much suspicion, spying, and backbiting, and Sahih al-Bukhari warns that suspicion is among the worst false tales.",
    consequence:
      "The damage is that trust, brotherhood, and honor are eaten away before any clear proof even exists.",
    source: "Qur'an 49:12",
    quality: "Revelation",
    url: "https://quran.com/49/12",
    extraSources: [
      { source: "Sahih al-Bukhari 6064", quality: "Sahih", url: "https://sunnah.com/bukhari:6064" },
    ],
  },
);

setNativeShellClasses();
loadCapacitorBridge();

let activeSectionCleanup = null;
let snapScrollCleanup = null;
let currentSectionId = labels[0][0];
let isProgrammaticScroll = false;
let snapReleaseTimer = 0;
let currentDailyReadings = null;
let currentSydneyParts = null;
let mobileViewportWidth = 0;
let mobileViewportTimer = 0;
let mobileTouchStartY = 0;
let mobileTouchStartX = 0;
let mobileTouchStartAt = 0;
let mobileTouchLastY = 0;
let mobileTouchLocked = false;
let mobileTouchSection = null;
let sectionFitFrame = 0;
let sectionFitSignature = "";
let phoneTransitionTimer = 0;
let phoneTransitionFrame = 0;
let phoneNavigationLockedUntil = 0;
const nextCuePressTimers = new WeakMap();
const SNAP_RELEASE_MS = 680;
const PHONE_SECTION_TRANSITION_MS = 210;
const NEXT_CUE_PRESS_MS = 180;
const NEXT_CUE_NAV_DELAY_MS = 20;

function getSydneyParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  }).formatToParts(date);

  const get = (type) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: get("weekday"),
    iso: `${get("year")}-${get("month")}-${get("day")}`,
    display: new Intl.DateTimeFormat("en-AU", {
      timeZone: TIME_ZONE,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date),
  };
}

function getDayNumber(parts) {
  return Date.UTC(parts.year, parts.month - 1, parts.day) / MS_PER_DAY - EPOCH_DAY;
}

function pickDailyReadings(dayNumber) {
  return {
    verse: readings.verses[positiveMod(dayNumber, readings.verses.length)],
    dua: readings.duas[positiveMod(dayNumber * 3 + 1, readings.duas.length)],
    dhikr: readings.dhikr[positiveMod(dayNumber * 5 + 2, readings.dhikr.length)],
    hadith: readings.hadiths[positiveMod(dayNumber * 7 + 3, readings.hadiths.length)],
    quote: readings.quotes[positiveMod(dayNumber * 11 + 4, readings.quotes.length)],
    story: readings.stories[positiveMod(dayNumber * 13 + 5, readings.stories.length)],
    ruling: readings.rulings[positiveMod(dayNumber * 17 + 6, readings.rulings.length)],
  };
}

function positiveMod(value, size) {
  return ((value % size) + size) % size;
}

function sourceRow(item) {
  const extraSources = Array.isArray(item.extraSources)
    ? item.extraSources
        .map(
          (source) => `
            <a class="source-link secondary-source" href="${source.url}" target="_blank" rel="noopener noreferrer">
              ${sourceIcon}
              <span>${source.source}</span>
            </a>
          `,
        )
        .join("")
    : "";

  return `
    <div class="source-row">
      <a class="source-link" href="${item.url}" target="_blank" rel="noopener noreferrer">
        ${sourceIcon}
        <span>${item.source}</span>
      </a>
      <span class="tag">${item.quality}</span>
      ${extraSources}
    </div>
  `;
}

function shortSectionName(index) {
  const label = labels[index]?.[1] ?? "";
  return label.replace(" Of The Day", "").replace("Qur'an Verse", "Qur'an verse").toLowerCase();
}

function nextActionText(index) {
  if (isPhoneLayout()) return `${shortSectionName(index + 1)} next`;
  return `Scroll for ${shortSectionName(index + 1)} next`;
}

function nextCue(index) {
  const next = labels[index + 1];
  if (!next) return "";

  return `
    <button class="next-cue" type="button" data-next="${next[0]}" aria-label="Go to ${next[1]}">
      <span>${nextActionText(index)}</span>
      ${nextIcon}
    </button>
  `;
}

function updateRailHint(id) {
  const railHint = document.querySelector("#railHint");
  const index = labels.findIndex(([sectionId]) => sectionId === id);
  const message =
    index >= 0 && index < labels.length - 1
      ? nextActionText(index)
      : "Today's scroll complete";

  if (!railHint || railHint.textContent === message) return;
  railHint.textContent = message;
  railHint.classList.remove("is-changing");
  void railHint.offsetWidth;
  railHint.classList.add("is-changing");
}

function updateNextCueCopy() {
  document.querySelectorAll(".next-cue[data-next]").forEach((button) => {
    const nextIndex = labels.findIndex(([sectionId]) => sectionId === button.dataset.next);
    const copy = button.querySelector("span");
    if (nextIndex <= 0 || !copy) return;
    copy.textContent = nextActionText(nextIndex - 1);
  });
}

function setActiveSectionVisuals(id, options = {}) {
  const activeIndex = labels.findIndex(([sectionId]) => sectionId === id);
  if (activeIndex < 0) return;

  currentSectionId = id;
  document.documentElement.dataset.activeSection = id;
  document.documentElement.style.setProperty(
    "--rail-progress",
    `${Math.max(0, activeIndex) / Math.max(1, labels.length - 1) * 100}%`,
  );

  document.querySelectorAll(".rail-button").forEach((link) => {
    const isActive = link.dataset.target === id;
    link.classList.toggle("active", isActive);
    link.setAttribute("aria-current", isActive ? "step" : "false");
    if (isActive) centerRailLink(link);
  });

  document.querySelectorAll("[data-section]").forEach((section) => {
    const sectionIndex = labels.findIndex(([sectionId]) => sectionId === section.id);
    const isActive = section.id === id;
    section.classList.toggle("is-current", isActive);
    section.classList.toggle("is-past", sectionIndex >= 0 && sectionIndex < activeIndex);
    if (isActive) section.classList.add("is-visible");
  });

  updateRailHint(id);
  if (options.fit !== false) scheduleSectionFit();
}

function centerRailLink(link) {
  const scroller = link.closest(".rail-items");
  if (!scroller || scroller.scrollWidth <= scroller.clientWidth + 1) return;

  const left = link.offsetLeft - (scroller.clientWidth - link.offsetWidth) / 2;
  scroller.scrollTo({
    left: Math.max(0, left),
    behavior: shouldReduceMotion() ? "auto" : "smooth",
  });
}

function dhikrCounterMarkup() {
  return `
    <div class="dhikr-counter" aria-label="Dhikr counter">
      <div class="counter-main">
        <button class="counter-tap" id="dhikrTapButton" type="button" aria-label="Dhikr count 0. Tap to add one.">
          <span class="counter-number" id="dhikrCount">0</span>
          <span class="counter-label">Tap to count this dhikr</span>
          <span class="counter-burst" id="dhikrBurst" aria-hidden="true">+1</span>
        </button>
        <button class="counter-reset" id="dhikrResetButton" type="button">Reset</button>
      </div>
      <p class="counter-feedback" id="dhikrCounterFeedback" aria-live="polite"></p>
    </div>
  `;
}

function revelationContextMarkup(item) {
  if (!item.revealed || !item.whyRevealed) return "";

  return `
    <div class="revelation-card">
      <div>
        <span class="mini-label">When Revealed</span>
        <p>${item.revealed}</p>
      </div>
      <div>
        <span class="mini-label">Why / Context</span>
        <p>${item.whyRevealed}</p>
      </div>
      <a class="context-link" href="${item.contextUrl || item.url}" target="_blank" rel="noopener noreferrer">
        ${sourceIcon}
        <span>Context source</span>
      </a>
    </div>
  `;
}

function rulingToneClass(item) {
  if (item.tone === "halal") return " verdict-halal";
  if (item.tone === "haram") return " verdict-haram";
  return " verdict-limited";
}

function renderTextSection(type, index, item) {
  const band = index % 2 === 1 ? " band" : "";
  const title = item.title ? `<div class="title-row"><h2 class="section-title">${item.title}</h2><span class="tag">${item.quality}</span></div>` : "";

  if (type === "hadith") {
    return `
      <article id="${type}" class="daily-section${band} reveal" data-section="${type}">
        <div class="section-kicker">${String(index + 1).padStart(2, "0")} ${labels[index][1]}</div>
        <div class="content-block">
          ${title}
          <p class="meaning">“${item.text}”</p>
          <p class="quote-person">${item.narrator}</p>
          <p class="explain"><span class="mini-label">Explanation</span>${item.explain}</p>
          ${sourceRow(item)}
          ${nextCue(index)}
        </div>
      </article>
    `;
  }

  if (type === "quote") {
    return `
      <article id="${type}" class="daily-section${band} reveal" data-section="${type}">
        <div class="section-kicker">${String(index + 1).padStart(2, "0")} ${labels[index][1]}</div>
        <div class="content-block">
          <p class="quote-text">“${item.quote}”</p>
          <p class="quote-person">${item.person}</p>
          <p class="explain"><span class="mini-label">Reflection</span>${item.reflection}</p>
          ${sourceRow(item)}
          ${nextCue(index)}
        </div>
      </article>
    `;
  }

  if (type === "story") {
    return `
      <article id="${type}" class="daily-section${band} reveal" data-section="${type}">
        <div class="section-kicker">${String(index + 1).padStart(2, "0")} ${labels[index][1]}</div>
        <div class="story-grid">
          <div class="content-block">
            ${title}
            <p class="body-text">${item.body}</p>
            ${sourceRow(item)}
            ${nextCue(index)}
          </div>
          <aside class="story-note">
            ${item.lesson ? `<p class="story-lesson"><span class="mini-label">What To Notice</span>${item.lesson}</p>` : ""}
            <p class="moral"><span class="mini-label">Moral</span>${item.moral}</p>
            <p class="story-action">${item.action}</p>
          </aside>
        </div>
      </article>
    `;
  }

  if (type === "ruling") {
    return `
      <article id="${type}" class="daily-section${band} reveal" data-section="${type}">
        <div class="section-kicker">${String(index + 1).padStart(2, "0")} ${labels[index][1]}</div>
        <div class="content-block ruling-block">
          <div class="title-row">
            <h2 class="section-title">${item.title}</h2>
            <span class="tag ruling-verdict${rulingToneClass(item)}">${item.verdict}</span>
          </div>
          <div class="ruling-grid">
            <section class="ruling-card">
              <span class="mini-label">Common Mix-Up</span>
              <p>${item.myth}</p>
            </section>
            <section class="ruling-card ruling-answer">
              <span class="mini-label">Ruling</span>
              <p>${item.ruling}</p>
            </section>
            <section class="ruling-card">
              <span class="mini-label">Why</span>
              <p>${item.why}</p>
            </section>
            <section class="ruling-card ruling-warning">
              <span class="mini-label">Consequence / Warning</span>
              <p>${item.consequence}</p>
            </section>
          </div>
          <p class="ruling-note">Personal cases can need a qualified scholar, especially around money, medicine, contracts, and necessity.</p>
          ${sourceRow(item)}
          ${nextCue(index)}
        </div>
      </article>
    `;
  }

  const extra = type === "dhikr" ? `<span class="count-chip">${item.count}</span>` : "";
  const counter = type === "dhikr" ? dhikrCounterMarkup() : "";
  const revelationContext = type === "verse" ? revelationContextMarkup(item) : "";
  const explanationLabel = type === "dua" ? "Effect From Source" : "Explanation";
  const explanationText = type === "dua" || type === "dhikr" ? item.effect : item.explain;

  return `
    <article id="${type}" class="daily-section${band} reveal" data-section="${type}">
      <div class="section-kicker">${String(index + 1).padStart(2, "0")} ${labels[index][1]}</div>
      <div class="content-block">
        ${title}
        ${extra}
        <p class="arabic" lang="ar">${item.arabic}</p>
        <p class="translit">${item.transliteration}</p>
        <p class="meaning">${item.meaning}</p>
        ${counter}
        <p class="effect"><span class="mini-label">${explanationLabel}</span>${explanationText}</p>
        ${revelationContext}
        ${sourceRow(item)}
        ${nextCue(index)}
      </div>
    </article>
  `;
}

function renderRail() {
  const rail = document.querySelector("#railItems");
  const jumps = document.querySelector("#jumpLinks");

  rail.innerHTML = labels
    .map(
      ([id], index) => `
        <a class="rail-button" href="#${id}" data-target="${id}" aria-label="${navLabelName(id)}">
          <span class="rail-index">${String(index + 1).padStart(2, "0")}</span>
          <span class="rail-label">${navLabelName(id)}</span>
        </a>
      `,
    )
    .join("");

  jumps.innerHTML = labels
    .map(
      ([id, label], index) => `
        <a href="#${id}" data-target="${id}">
          <span>${label}</span>
          <span>${String(index + 1).padStart(2, "0")}</span>
        </a>
      `,
    )
    .join("");
}

function navLabelName(id) {
  const names = {
    verse: "Verse",
    dua: "Dua",
    dhikr: "Dhikr",
    hadith: "Hadith",
    quote: "Quote",
    story: "Story",
    ruling: "Ruling",
  };

  return names[id] || id;
}

function renderApp() {
  const parts = getSydneyParts();
  const dayNumber = getDayNumber(parts);
  const daily = pickDailyReadings(dayNumber);
  currentSydneyParts = parts;
  currentDailyReadings = daily;

  document.querySelector("#displayDate").textContent = parts.display;
  document.querySelector("#lockline").textContent = `Locked for ${parts.display}. Resets at 12:00 AM Sydney.`;
  document.documentElement.dataset.sydneyDate = parts.iso;

  document.querySelector("#sections").innerHTML = labels
    .map(([type], index) => renderTextSection(type, index, daily[type]))
    .join("");
  currentSectionId = labels[0][0];

  updateSavedState(parts.iso);
  renderSavedReadings();
  setupDhikrCounter(parts.iso, daily.dhikr.title);
  setupRevealObserver();
  setupActiveSectionObserver();
  syncHashSection();
}

function setupRevealObserver() {
  const revealItems = document.querySelectorAll(".reveal");
  if (isNativePerformanceShell() && isPhoneLayout()) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealVisibleItems = () => {
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        item.classList.add("is-visible");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.16 },
  );

  revealItems.forEach((item) => observer.observe(item));
  requestAnimationFrame(revealVisibleItems);
  setTimeout(revealVisibleItems, 120);
}

function setupActiveSectionObserver() {
  if (activeSectionCleanup) activeSectionCleanup();

  const sections = [...document.querySelectorAll("[data-section]")];
  if (isPhoneLayout()) {
    setActiveSectionVisuals(currentSectionId || sections[0]?.id || labels[0][0]);
    activeSectionCleanup = () => {};
    return;
  }

  let activeId = "";
  let frame = 0;

  const setActive = () => {
    frame = 0;
    if (isProgrammaticScroll) return;

    const lockLine = Math.min(window.innerHeight * 0.42, window.innerHeight - 180);
    let current = sections[0];
    let nearest = sections[0];
    let nearestDistance = Number.POSITIVE_INFINITY;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= lockLine && rect.bottom >= lockLine) current = section;

      const distance = Math.abs(rect.top - lockLine);
      if (distance < nearestDistance) {
        nearest = section;
        nearestDistance = distance;
      }
    });

    const nextActive = current?.id || nearest?.id;
    if (!nextActive || nextActive === activeId) return;

    activeId = nextActive;
    setActiveSectionVisuals(activeId);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(setActive);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  setActive();

  activeSectionCleanup = () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (frame) cancelAnimationFrame(frame);
  };
}

function setupControls() {
  const saveButton = document.querySelector("#saveButton");
  const savedButton = document.querySelector("#savedButton");
  const closeSavedButton = document.querySelector("#closeSavedButton");
  const shareButton = document.querySelector("#shareButton");
  const menuButton = document.querySelector("#menuButton");
  const closeMenuButton = document.querySelector("#closeMenuButton");
  const jumpMenu = document.querySelector("#jumpMenu");
  const savedDrawer = document.querySelector("#savedDrawer");

  saveButton.addEventListener("click", () => {
    const iso = currentSydneyParts?.iso || document.documentElement.dataset.sydneyDate;
    const wasSaved = isDateSaved(iso);
    if (wasSaved) {
      removeSavedReading(iso);
      showToast("Removed from saved readings.");
    } else {
      saveCurrentReading();
      showToast("Saved. Open the saved list to read it later.");
    }
    updateSavedState(iso);
    renderSavedReadings();
  });

  savedButton.addEventListener("click", () => setSavedOpen(savedDrawer.hidden));
  closeSavedButton.addEventListener("click", () => setSavedOpen(false));
  savedDrawer.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-saved]");
    const openButton = event.target.closest("[data-open-saved]");

    if (event.target === savedDrawer) {
      setSavedOpen(false);
      return;
    }

    if (removeButton) {
      removeSavedReading(removeButton.dataset.removeSaved);
      updateSavedState(currentSydneyParts?.iso || document.documentElement.dataset.sydneyDate);
      renderSavedReadings();
      showToast("Saved reading removed.");
      return;
    }

    if (openButton) {
      openSavedReading(openButton.dataset.openSaved);
    }
  });

  shareButton.addEventListener("click", async () => {
    const text = `Daily Deen for ${document.querySelector("#displayDate").textContent}: ${window.location.href}`;
    try {
      await navigator.clipboard.writeText(text);
      showToast("Link copied.");
    } catch {
      showToast("Copy blocked by the browser. You can copy the address bar instead.");
    }
  });

  menuButton.addEventListener("click", () => setMenuOpen(jumpMenu.hidden));
  closeMenuButton.addEventListener("click", () => setMenuOpen(false));
  jumpMenu.addEventListener("click", (event) => {
    if (event.target === jumpMenu || event.target.closest("a")) setMenuOpen(false);
  });

  function setMenuOpen(isOpen) {
    setOverlayOpen(jumpMenu, menuButton, isOpen);
  }

  function setSavedOpen(isOpen) {
    if (isOpen) renderSavedReadings();
    setOverlayOpen(savedDrawer, savedButton, isOpen);
  }
}

function setOverlayOpen(overlay, trigger, isOpen) {
  clearTimeout(overlay.hideTimer);

  if (isOpen) {
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("is-open"));
  } else {
    overlay.classList.remove("is-open");
    overlay.hideTimer = setTimeout(() => {
      if (!overlay.classList.contains("is-open")) overlay.hidden = true;
    }, prefersReducedMotion() ? 0 : isNativeApp() ? 150 : 210);
  }

  trigger.setAttribute("aria-expanded", String(isOpen));
}

function setupSmoothNavigation() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-next], [data-target]");
    if (!trigger) return;

    const id = trigger.dataset.next || trigger.dataset.target;
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    if (isSectionNavigationLocked()) return;

    const shouldDelayForPress = playNextCuePress(trigger);
    if (shouldDelayForPress) {
      window.setTimeout(() => smoothScrollToSection(id), NEXT_CUE_NAV_DELAY_MS);
      return;
    }

    smoothScrollToSection(id);
  });
}

function playNextCuePress(trigger) {
  if (!trigger.classList.contains("next-cue") || prefersReducedMotion()) return false;

  const previousTimer = nextCuePressTimers.get(trigger);
  if (previousTimer) clearTimeout(previousTimer);

  const isNativePhone = isPhoneLayout() && document.documentElement.classList.contains("native-shell");
  if (!isNativePhone) {
    trigger.classList.remove("is-pressing");
    void trigger.offsetWidth;
  }
  trigger.classList.add("is-pressing");
  nextCuePressTimers.set(
    trigger,
    window.setTimeout(() => {
      trigger.classList.remove("is-pressing");
      nextCuePressTimers.delete(trigger);
    }, NEXT_CUE_PRESS_MS),
  );

  return isNativePhone;
}

function setupNativeExternalLinks() {
  document.addEventListener("click", (event) => {
    if (!isNativeApp()) return;

    const link = event.target.closest("a[href]");
    if (!link) return;

    const url = new URL(link.href, window.location.href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    if (url.origin === window.location.origin) return;

    event.preventDefault();
    openExternalUrl(url.href);
  });
}

async function openExternalUrl(url) {
  try {
    const browser = window.Capacitor?.Plugins?.Browser;
    if (browser?.open) {
      await browser.open({ url });
      return;
    }
  } catch {
    // Fall through to the regular browser path.
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

function setupSnapScrolling() {
  if (snapScrollCleanup) snapScrollCleanup();

  let lastSnapAt = 0;
  let wheelIntent = 0;
  let touchStart = null;

  const onWheel = (event) => {
    if (isPhoneLayout()) return;

    if (isInteractiveScrollTarget(event.target) || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      return;
    }

    event.preventDefault();
    if (isProgrammaticScroll) return;

    wheelIntent += event.deltaY;
    const threshold = matchMedia("(max-width: 820px)").matches ? 48 : 12;
    const now = Date.now();

    if (Math.abs(wheelIntent) < threshold || now - lastSnapAt < SNAP_RELEASE_MS) return;

    lastSnapAt = now;
    const direction = wheelIntent > 0 ? 1 : -1;
    wheelIntent = 0;
    navigateSection(direction);
  };

  const onTouchStart = (event) => {
    if (isPhoneLayout()) return;

    if (isInteractiveScrollTarget(event.target)) {
      touchStart = null;
      return;
    }

    const touch = event.touches[0];
    touchStart = {
      x: touch.clientX,
      y: touch.clientY,
      at: Date.now(),
      locked: false,
    };
  };

  const onTouchMove = (event) => {
    if (isPhoneLayout()) return;
    if (!touchStart || isProgrammaticScroll) return;

    const touch = event.touches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    if (Math.abs(dy) > 18 && Math.abs(dy) > Math.abs(dx) * 1.35) {
      touchStart.locked = true;
    }
  };

  const onTouchEnd = (event) => {
    if (isPhoneLayout()) return;
    if (!touchStart || isProgrammaticScroll) return;

    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touchStart.y - touch.clientY;
    const elapsed = Date.now() - touchStart.at;
    const wasLocked = touchStart.locked;
    const strongTug = Math.abs(dy) >= 72 && Math.abs(dy) > Math.abs(dx) * 1.25;
    const quickFlick = Math.abs(dy) >= 54 && elapsed < 360 && Math.abs(dy) > Math.abs(dx) * 1.2;
    touchStart = null;

    if (!strongTug && !quickFlick) {
      if (wasLocked) event.preventDefault();
      return;
    }

    event.preventDefault();
    navigateSection(dy > 0 ? 1 : -1);
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: false });

  snapScrollCleanup = () => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
  };
}

function setupMobileScrollGuard() {
  window.addEventListener(
    "touchstart",
    (event) => {
      if (!isPhoneLayout()) return;
      if (isInteractiveScrollTarget(event.target)) {
        mobileTouchSection = null;
        return;
      }

      const section = event.target.closest?.(".daily-section.is-current");
      if (!section) return;

      const touch = event.touches[0];
      mobileTouchStartX = touch?.clientX || 0;
      mobileTouchStartY = touch?.clientY || 0;
      mobileTouchLastY = mobileTouchStartY;
      mobileTouchStartAt = Date.now();
      mobileTouchLocked = false;
      mobileTouchSection = section;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (!isPhoneLayout()) return;

      const scroller = event.target.closest?.(".daily-section.is-current");
      if (!scroller) return;

      const x = event.touches[0]?.clientX || 0;
      const y = event.touches[0]?.clientY || 0;
      const totalDx = x - mobileTouchStartX;
      const totalDy = y - mobileTouchStartY;
      const stepDy = y - mobileTouchLastY;
      const verticalIntent = Math.abs(totalDy) > 10 && Math.abs(totalDy) > Math.abs(totalDx) * 1.18;
      const nativeShell = document.documentElement.classList.contains("native-shell");
      const nativeVerticalIntent = Math.abs(totalDy) > 4 && Math.abs(totalDy) > Math.abs(totalDx) * 1.05;
      const allowsInternalScroll = scroller.classList.contains("fit-scroll") && !nativeShell;

      if (nativeShell && nativeVerticalIntent) {
        mobileTouchLocked = true;
        event.preventDefault();
        mobileTouchLastY = y;
        return;
      }

      if (!allowsInternalScroll) {
        if (verticalIntent) event.preventDefault();
        mobileTouchLastY = y;
        return;
      }

      const atTop = scroller.scrollTop <= 0;
      const atBottom = Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight - 1;

      if ((atTop && stepDy > 0) || (atBottom && stepDy < 0)) {
        event.preventDefault();
      }

      mobileTouchLastY = y;
    },
    { passive: false },
  );

  window.addEventListener(
    "touchend",
    (event) => {
      if (!isPhoneLayout() || !mobileTouchSection || isProgrammaticScroll) return;

      const touch = event.changedTouches[0];
      const dx = (touch?.clientX || 0) - mobileTouchStartX;
      const dy = mobileTouchStartY - (touch?.clientY || 0);
      const elapsed = Date.now() - mobileTouchStartAt;
      const nativeShell = document.documentElement.classList.contains("native-shell");
      const activeMobileSection = mobileTouchSection;
      mobileTouchSection = null;
      mobileTouchLastY = 0;

      const strongThreshold = nativeShell ? 68 : 82;
      const quickThreshold = nativeShell ? 52 : 62;
      const strongTug = Math.abs(dy) >= strongThreshold && Math.abs(dy) > Math.abs(dx) * 1.28;
      const quickFlick = Math.abs(dy) >= quickThreshold && elapsed < 340 && Math.abs(dy) > Math.abs(dx) * 1.35;
      const allowsInternalScroll = activeMobileSection.classList.contains("fit-scroll") && !nativeShell;

      if (allowsInternalScroll && activeMobileSection.scrollHeight > activeMobileSection.clientHeight + 2) {
        const atTop = activeMobileSection.scrollTop <= 1;
        const atBottom =
          Math.ceil(activeMobileSection.scrollTop + activeMobileSection.clientHeight) >=
          activeMobileSection.scrollHeight - 1;
        const isTryingNext = dy > 0;
        const isTryingPrevious = dy < 0;

        if ((isTryingNext && !atBottom) || (isTryingPrevious && !atTop)) {
          mobileTouchLocked = false;
          return;
        }
      }

      if (!strongTug && !quickFlick) {
        if (mobileTouchLocked) event.preventDefault();
        mobileTouchLocked = false;
        return;
      }

      event.preventDefault();
      mobileTouchLocked = false;
      navigateSection(dy > 0 ? 1 : -1);
    },
    { passive: false },
  );
}

function navigateSection(direction) {
  if (isSectionNavigationLocked()) return;

  const sections = [...document.querySelectorAll("[data-section]")];
  if (!sections.length) return;

  const activeIndex = sections.findIndex((section) => section.id === currentSectionId);
  const currentIndex = activeIndex >= 0 ? activeIndex : getCurrentSectionIndex(sections);
  const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
  if (nextIndex === currentIndex) return;

  smoothScrollToSection(sections[nextIndex].id);
}

function isSectionNavigationLocked() {
  return isPhoneLayout() && Date.now() < phoneNavigationLockedUntil;
}

function getCurrentSectionIndex(sections = [...document.querySelectorAll("[data-section]")]) {
  const activeIndex = sections.findIndex((section) => section.id === currentSectionId);
  const referenceLine = getStickyOffset() + (window.innerHeight - getStickyOffset()) * 0.38;
  let nearestIndex = activeIndex >= 0 ? activeIndex : 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= referenceLine && rect.bottom >= referenceLine) {
      nearestIndex = index;
      nearestDistance = 0;
      return;
    }

    const distance = Math.abs(rect.top - referenceLine);
    if (distance < nearestDistance) {
      nearestIndex = index;
      nearestDistance = distance;
    }
  });

  return nearestIndex;
}

function preparePhoneSectionTransition(id) {
  if (!isPhoneLayout() || !document.documentElement.classList.contains("native-shell") || prefersReducedMotion()) {
    cleanupPhoneSectionTransition();
    return 0;
  }

  const to = document.getElementById(id);
  if (!to || to.classList.contains("is-current")) {
    cleanupPhoneSectionTransition();
    return 0;
  }

  cleanupPhoneSectionTransition();

  const fromIndex = labels.findIndex(([sectionId]) => sectionId === currentSectionId);
  const toIndex = labels.findIndex(([sectionId]) => sectionId === id);
  const directionClass = toIndex >= fromIndex ? "section-forward" : "section-back";

  document.documentElement.classList.add("section-switching", directionClass);
  to.classList.add("section-entering");

  phoneTransitionTimer = window.setTimeout(cleanupPhoneSectionTransition, PHONE_SECTION_TRANSITION_MS);
  return PHONE_SECTION_TRANSITION_MS;
}

function startPhoneSectionTransitionMotion() {
  if (!document.documentElement.classList.contains("section-switching")) return;
  if (phoneTransitionFrame) cancelAnimationFrame(phoneTransitionFrame);
  phoneTransitionFrame = requestAnimationFrame(() => {
    phoneTransitionFrame = 0;
    document.documentElement.classList.add("section-motion");
  });
}

function cleanupPhoneSectionTransition() {
  if (phoneTransitionFrame) cancelAnimationFrame(phoneTransitionFrame);
  phoneTransitionFrame = 0;
  clearTimeout(phoneTransitionTimer);
  phoneTransitionTimer = 0;
  document.documentElement.classList.remove("section-switching", "section-motion", "section-forward", "section-back");
  document.querySelectorAll(".section-entering, .section-exiting").forEach((section) => {
    section.classList.remove("section-entering", "section-exiting");
  });
}

function smoothScrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;
  if (isSectionNavigationLocked() && target.id !== currentSectionId) return;
  if (isPhoneLayout() && isProgrammaticScroll && target.id === currentSectionId) return;

  isProgrammaticScroll = true;
  document.querySelectorAll(".snap-focus").forEach((section) => {
    if (section !== target) section.classList.remove("snap-focus");
  });
  target.classList.add("snap-focus");

  if (isPhoneLayout()) {
    phoneNavigationLockedUntil = Date.now() + PHONE_SECTION_TRANSITION_MS + 80;
    const transitionMs = preparePhoneSectionTransition(id);
    setActiveSectionVisuals(id, { fit: false });
    target.scrollTop = 0;
    window.scrollTo(0, 0);
    history.replaceState(null, "", `#${id}`);
    if (transitionMs) {
      fitActivePhoneSection();
      startPhoneSectionTransitionMotion();
    } else {
      scheduleSectionFit();
    }

    clearTimeout(snapReleaseTimer);
    snapReleaseTimer = setTimeout(() => {
      isProgrammaticScroll = false;
      target.classList.remove("snap-focus");
      cleanupPhoneSectionTransition();
    }, transitionMs || 180);
    return;
  }

  setActiveSectionVisuals(id);
  target.scrollIntoView({
    behavior: shouldReduceMotion() ? "auto" : "smooth",
    block: "start",
  });
  history.replaceState(null, "", `#${id}`);
  setActiveSectionVisuals(id);

  clearTimeout(snapReleaseTimer);
  snapReleaseTimer = setTimeout(() => {
    isProgrammaticScroll = false;
    target.classList.remove("snap-focus");
    setActiveSectionVisuals(id);
  }, SNAP_RELEASE_MS);
}

function syncHashSection() {
  const id = decodeURIComponent(window.location.hash.replace("#", ""));
  const target = document.getElementById(id);
  if (!id || !target) {
    setActiveSectionVisuals(labels[0][0]);
    return;
  }

  if (isPhoneLayout()) {
    phoneNavigationLockedUntil = 0;
    cleanupPhoneSectionTransition();
    setActiveSectionVisuals(id);
    target.scrollTop = 0;
    window.scrollTo(0, 0);
    history.replaceState(null, "", `#${id}`);
    return;
  }

  setActiveSectionVisuals(id);
  window.setTimeout(() => {
    const baseUrl = `${window.location.pathname}${window.location.search}`;
    history.replaceState(null, "", baseUrl);
    window.location.hash = id;
    target.classList.add("snap-focus");
    window.setTimeout(() => target.classList.remove("snap-focus"), SNAP_RELEASE_MS);
  }, 0);
}

function getStickyOffset() {
  const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
  const railHeight = matchMedia("(max-width: 820px)").matches
    ? document.querySelector(".reading-rail")?.getBoundingClientRect().height || 0
    : 0;
  return Math.round(headerHeight + railHeight + 14);
}

function isPhoneLayout() {
  return phoneLayoutQuery.matches;
}

function loadCapacitorBridge() {
  if (window.Capacitor || !isLikelyNativeShell()) return;

  const script = document.createElement("script");
  script.src = "capacitor.js";
  script.addEventListener("load", setNativeShellClasses, { once: true });
  document.head.append(script);
}

function setNativeShellClasses() {
  const root = document.documentElement;
  const nativeQaPlatform = new URLSearchParams(location.search).get("native");
  const isShell = isLikelyNativeShell() || nativeQaPlatform === "android" || nativeQaPlatform === "ios";
  root.classList.toggle("native-shell", isShell);

  const platform = typeof window.Capacitor?.getPlatform === "function" ? window.Capacitor.getPlatform() : "";
  root.classList.toggle("android-shell", platform === "android" || nativeQaPlatform === "android");
  root.classList.toggle("ios-shell", platform === "ios" || nativeQaPlatform === "ios");
}

function isLikelyNativeShell() {
  return (
    location.protocol === "capacitor:" ||
    location.origin === "https://localhost"
  );
}

function isNativeApp() {
  const capacitor = window.Capacitor;
  if (!capacitor) return false;

  if (typeof capacitor.isNativePlatform === "function") return capacitor.isNativePlatform();

  const platform = typeof capacitor.getPlatform === "function" ? capacitor.getPlatform() : "";
  return platform === "ios" || platform === "android";
}

function setMobileViewportVars(force = false) {
  if (!isPhoneLayout()) {
    mobileViewportWidth = 0;
    document.documentElement.style.removeProperty("--mobile-vh");
    scheduleSectionFit();
    return;
  }

  const viewport = window.visualViewport;
  const width = Math.round(viewport?.width || window.innerWidth);
  const height = Math.round(viewport?.height || window.innerHeight);
  const widthChanged = !mobileViewportWidth || Math.abs(width - mobileViewportWidth) > 24;

  if (!force && !widthChanged) return;

  mobileViewportWidth = width;
  document.documentElement.style.setProperty("--mobile-vh", `${height}px`);
  scheduleSectionFit();
}

function scheduleMobileViewportVars(force = false) {
  clearTimeout(mobileViewportTimer);
  mobileViewportTimer = setTimeout(() => setMobileViewportVars(force), force ? 80 : 180);
}

function setupMobileViewportStability() {
  setMobileViewportVars(true);

  window.addEventListener("resize", () => scheduleMobileViewportVars(false), { passive: true });
  window.addEventListener("orientationchange", () => {
    mobileViewportWidth = 0;
    scheduleMobileViewportVars(true);
  });
  window.visualViewport?.addEventListener("resize", () => scheduleMobileViewportVars(false), { passive: true });

  const syncViewportMode = () => scheduleMobileViewportVars(true);
  if (phoneLayoutQuery.addEventListener) {
    phoneLayoutQuery.addEventListener("change", syncViewportMode);
  } else {
    phoneLayoutQuery.addListener(syncViewportMode);
  }
}

function scheduleSectionFit() {
  if (sectionFitFrame) cancelAnimationFrame(sectionFitFrame);

  sectionFitFrame = requestAnimationFrame(() => {
    sectionFitFrame = 0;
    fitActivePhoneSection();
  });
}

function fitActivePhoneSection() {
  if (sectionFitFrame) {
    cancelAnimationFrame(sectionFitFrame);
    sectionFitFrame = 0;
  }

  const sections = [...document.querySelectorAll(".daily-section")];
  if (!isPhoneLayout() || !document.documentElement.classList.contains("native-shell")) {
    sectionFitSignature = "";
    sections.forEach((section) => {
      section.classList.remove("fit-roomy", "fit-tight", "fit-ultra", "fit-scroll");
      section.removeAttribute("data-fit-signature");
    });
    return;
  }

  const section = document.querySelector(".daily-section.is-current");
  if (!section) return;

  const nextSignature = `${section.id}:${section.clientWidth}x${section.clientHeight}`;
  const hasFitClass = ["fit-roomy", "fit-tight", "fit-ultra", "fit-scroll"].some((className) =>
    section.classList.contains(className),
  );
  if (hasFitClass && section.dataset.fitSignature === nextSignature) {
    sectionFitSignature = nextSignature;
    return;
  }

  sectionFitSignature = nextSignature;
  section.dataset.fitSignature = nextSignature;
  section.classList.remove("fit-roomy", "fit-tight", "fit-ultra", "fit-scroll");

  const setFitMode = (...classNames) => {
    section.classList.remove("fit-roomy", "fit-tight", "fit-ultra", "fit-scroll");
    if (classNames.length) section.classList.add(...classNames);
  };
  const fits = () => getSectionOverflow(section) <= 2;
  if (getSectionOverflow(section) <= -150) {
    setFitMode("fit-roomy");
    if (!fits()) setFitMode();
  }

  if (fits()) return;

  setFitMode("fit-tight");
  if (fits()) return;

  setFitMode("fit-ultra");
  if (fits()) return;

  setFitMode("fit-ultra", "fit-scroll");
}

function getSectionOverflow(section) {
  const sectionRect = section.getBoundingClientRect();
  const isNativePhoneSection = isPhoneLayout() && document.documentElement.classList.contains("native-shell");
  const selector = isNativePhoneSection
    ? ".section-kicker, .content-block > :not(.next-cue), .story-note"
    : ".section-kicker, .title-row, .content-block, .count-chip, .arabic, .translit, .meaning, .quote-text, .quote-person, .body-text, .explain, .effect, .moral, .story-lesson, .story-action, .story-note, .revelation-card, .ruling-grid, .ruling-card, .ruling-note, .source-row, .dhikr-counter";
  const candidates = [...section.querySelectorAll(selector)];
  const contentItems = isNativePhoneSection
    ? candidates
    : candidates.filter((item) => {
      const style = getComputedStyle(item);
      return style.display !== "none" && style.visibility !== "hidden";
    });

  const contentBottom = contentItems.reduce((bottom, item) => {
    const rect = item.getBoundingClientRect();
    return Math.max(bottom, rect.bottom);
  }, sectionRect.top);

  if (isNativePhoneSection) {
    const nextButton = section.querySelector(".next-cue");
    const nextButtonTop = nextButton?.getBoundingClientRect().top ?? sectionRect.bottom;
    const readableBottom = Math.min(sectionRect.bottom, nextButtonTop - 10);
    return contentBottom - readableBottom;
  }

  return Math.max(section.scrollHeight - section.clientHeight, contentBottom - sectionRect.bottom);
}

function prefersReducedMotion() {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function shouldReduceMotion() {
  return prefersReducedMotion() || isNativePerformanceShell();
}

function isNativePerformanceShell() {
  return document.documentElement.classList.contains("native-shell");
}

function isInteractiveScrollTarget(target) {
  if (!target || typeof target.closest !== "function") return false;

  return !!target.closest(
    "input, textarea, select, summary, [role='dialog'], .jump-menu, .rail-items, .dhikr-counter",
  );
}

function saveCurrentReading() {
  if (!currentSydneyParts || !currentDailyReadings) return;

  const saved = getSavedReadings().filter((entry) => entry.iso !== currentSydneyParts.iso);
  saved.unshift(buildSavedEntry(currentSydneyParts, currentDailyReadings));
  setSavedReadings(saved);
}

function buildSavedEntry(parts, daily) {
  return {
    iso: parts.iso,
    display: parts.display,
    savedAt: new Date().toISOString(),
    items: labels.map(([type, label]) => {
      const item = daily[type];
      return {
        type,
        label,
        title: item.title || item.person || item.narrator || label,
        arabic: item.arabic || "",
        transliteration: item.transliteration || "",
        primary: getSavedPrimaryText(type, item),
        note: item.effect || item.explain || item.reflection || item.lesson || item.moral || item.consequence || "",
        source: item.source,
        quality: item.quality,
        url: item.url,
      };
    }),
  };
}

function getSavedPrimaryText(type, item) {
  if (type === "hadith") return item.text;
  if (type === "quote") return item.quote;
  if (type === "story") return item.body;
  if (type === "ruling") return `${item.verdict}: ${item.ruling}`;
  return item.meaning;
}

function getSavedReadings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_READINGS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((entry) => entry && entry.iso && Array.isArray(entry.items)) : [];
  } catch {
    return [];
  }
}

function setSavedReadings(entries) {
  localStorage.setItem(SAVED_READINGS_KEY, JSON.stringify(entries.slice(0, 90)));
}

function isDateSaved(iso) {
  return getSavedReadings().some((entry) => entry.iso === iso);
}

function removeSavedReading(iso) {
  setSavedReadings(getSavedReadings().filter((entry) => entry.iso !== iso));
}

function renderSavedReadings() {
  const list = document.querySelector("#savedList");
  const summary = document.querySelector("#savedSummary");
  if (!list || !summary) return;

  const saved = getSavedReadings();
  summary.textContent = saved.length
    ? `${saved.length} saved ${saved.length === 1 ? "reading" : "readings"} on this device.`
    : "Nothing saved yet. Save today's reading to keep it here.";

  if (!saved.length) {
    list.innerHTML = `
      <div class="saved-empty">
        <span class="mini-label">Empty</span>
        <p>Saved readings will show here with their verse, dua, dhikr, hadith, quote, story, and halal/haram fact.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = saved.map(renderSavedCard).join("");
}

function renderSavedCard(entry, index) {
  const first = entry.items[0] || {};
  const savedAt = formatSavedAt(entry.savedAt);

  return `
    <article class="saved-card" data-saved-card="${escapeHTML(entry.iso)}">
      <div class="saved-card-head">
        <div>
          <span class="saved-date">${escapeHTML(entry.display)}</span>
          <h3>${escapeHTML(first.title || "Saved reading")}</h3>
          <p>Saved ${escapeHTML(savedAt)}</p>
        </div>
        <button class="saved-remove" type="button" data-remove-saved="${escapeHTML(entry.iso)}">Remove</button>
      </div>
      <details ${index === 0 ? "open" : ""}>
        <summary>View the saved set</summary>
        <div class="saved-reading-grid">
          ${entry.items.map(renderSavedItem).join("")}
        </div>
      </details>
    </article>
  `;
}

function renderSavedItem(item) {
  const transliteration = getSavedTransliteration(item);
  return `
    <section class="saved-reading">
      <span class="mini-label">${escapeHTML(item.label)}</span>
      <h4>${escapeHTML(item.title)}</h4>
      ${item.arabic ? `<p class="saved-arabic" lang="ar">${escapeHTML(item.arabic)}</p>` : ""}
      ${transliteration ? `<p class="saved-translit">${escapeHTML(transliteration)}</p>` : ""}
      <p>${escapeHTML(item.primary)}</p>
      ${item.note ? `<p class="saved-note">${escapeHTML(item.note)}</p>` : ""}
      <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.source)} - ${escapeHTML(item.quality)}</a>
    </section>
  `;
}

function getSavedTransliteration(item) {
  if (item.transliteration) return item.transliteration;

  const collections = {
    verse: readings.verses,
    dua: readings.duas,
    dhikr: readings.dhikr,
  };
  const candidates = collections[item.type] || [];
  const match = candidates.find((candidate) => {
    const sameSource = candidate.source && candidate.source === item.source;
    const sameTitle = candidate.title && candidate.title === item.title;
    const samePrimary = candidate.meaning && candidate.meaning === item.primary;
    return candidate.transliteration && ((sameSource && sameTitle) || (sameSource && samePrimary));
  });

  return match?.transliteration || "";
}

function openSavedReading(iso) {
  const card = [...document.querySelectorAll("[data-saved-card]")].find((item) => item.dataset.savedCard === iso);
  const details = card?.querySelector("details");
  if (!card || !details) return;

  details.open = true;
  card.scrollIntoView({ behavior: shouldReduceMotion() ? "auto" : "smooth", block: "nearest" });
}

function formatSavedAt(value) {
  if (!value) return "just now";

  try {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: TIME_ZONE,
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "just now";
  }
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function setupDhikrCounter(iso, title) {
  const tapButton = document.querySelector("#dhikrTapButton");
  const resetButton = document.querySelector("#dhikrResetButton");
  const countText = document.querySelector("#dhikrCount");
  const feedback = document.querySelector("#dhikrCounterFeedback");
  const burst = document.querySelector("#dhikrBurst");
  if (!tapButton || !resetButton || !countText) return;

  const key = `daily-deen-dhikr-count-${iso}-${slugify(title)}`;
  let count = getStoredDhikrCount(key);
  let feedbackTimer = 0;

  const saveCount = () => {
    try {
      localStorage.setItem(key, String(count));
    } catch {
      // The counter still works for the session if storage is blocked.
    }
  };

  const renderCount = (animate = false) => {
    const formatted = new Intl.NumberFormat("en-AU").format(count);
    countText.textContent = formatted;
    tapButton.setAttribute("aria-label", `Dhikr count ${formatted}. Tap to add one.`);

    if (!animate || prefersReducedMotion()) return;

    countText.classList.remove("is-bumping");
    burst?.classList.remove("visible");
    void countText.offsetWidth;
    countText.classList.add("is-bumping");
    burst?.classList.add("visible");
  };

  const showCounterFeedback = (message) => {
    if (!feedback) return;

    feedback.textContent = message;
    feedback.classList.add("visible");
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
      feedback.classList.remove("visible");
      feedback.textContent = "";
    }, 1300);
  };

  const increment = () => {
    count += 1;
    saveCount();
    renderCount(true);
  };

  tapButton.addEventListener("pointerdown", () => {
    tapButton.classList.add("is-pressing-counter");
  });

  ["pointerup", "pointercancel", "pointerleave", "blur"].forEach((eventName) => {
    tapButton.addEventListener(eventName, () => {
      tapButton.classList.remove("is-pressing-counter");
    });
  });

  tapButton.addEventListener("click", (event) => {
    event.preventDefault();
    increment();
  });

  resetButton.addEventListener("click", (event) => {
    event.preventDefault();
    count = 0;
    saveCount();
    renderCount(true);
    showCounterFeedback("Counter reset");
  });

  renderCount();
}

function getStoredDhikrCount(key) {
  try {
    const stored = Number.parseInt(localStorage.getItem(key) || "0", 10);
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
  } catch {
    return 0;
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function updateSavedState(iso) {
  const isSaved = isDateSaved(iso);
  const saveButton = document.querySelector("#saveButton");
  saveButton.classList.toggle("active", isSaved);
  saveButton.setAttribute("aria-label", isSaved ? "Unsave today's reading" : "Save today's reading");
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("visible"), 2600);
}

function setupSydneyMidnightCheck() {
  setInterval(() => {
    const latest = getSydneyParts().iso;
    if (latest !== document.documentElement.dataset.sydneyDate) {
      renderApp();
      showToast("A new Sydney day has begun. Today's reading has refreshed.");
    }
  }, 60_000);
}

function setupResponsiveModeSync() {
  const syncMode = () => {
    setMobileViewportVars(true);
    updateNextCueCopy();
    updateRailHint(currentSectionId || labels[0][0]);
    setupActiveSectionObserver();
    setupSnapScrolling();

    if (isPhoneLayout()) {
      window.scrollTo(0, 0);
      document.getElementById(currentSectionId)?.scrollTo({ top: 0, behavior: "auto" });
    }

    scheduleSectionFit();
  };

  if (phoneLayoutQuery.addEventListener) {
    phoneLayoutQuery.addEventListener("change", syncMode);
  } else {
    phoneLayoutQuery.addListener(syncMode);
  }
}

setupMobileViewportStability();
renderRail();
renderApp();
setupControls();
setupSmoothNavigation();
setupNativeExternalLinks();
setupSnapScrolling();
setupMobileScrollGuard();
setupResponsiveModeSync();
setupSydneyMidnightCheck();
