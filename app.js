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
const SNAP_RELEASE_MS = 920;

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
  };
}

function positiveMod(value, size) {
  return ((value % size) + size) % size;
}

function sourceRow(item) {
  return `
    <div class="source-row">
      <a class="source-link" href="${item.url}" target="_blank" rel="noopener noreferrer">
        ${sourceIcon}
        <span>${item.source}</span>
      </a>
      <span class="tag">${item.quality}</span>
    </div>
  `;
}

function shortSectionName(index) {
  const label = labels[index]?.[1] ?? "";
  return label.replace(" Of The Day", "").replace("Qur'an Verse", "Qur'an verse").toLowerCase();
}

function nextActionText(index) {
  const action = isPhoneLayout() ? "Tap for" : "Scroll for";
  return `${action} ${shortSectionName(index + 1)} next`;
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

function setActiveSectionVisuals(id) {
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
        <button class="counter-tap" id="dhikrTapButton" type="button">
          <span class="counter-number" id="dhikrCount">0</span>
          <span class="counter-label">Tap to count this dhikr</span>
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
            <p class="moral"><span class="mini-label">Moral</span>${item.moral}</p>
            <p class="story-action">${item.action}</p>
          </aside>
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
    jumpMenu.hidden = !isOpen;
    menuButton.setAttribute("aria-expanded", String(isOpen));
  }

  function setSavedOpen(isOpen) {
    savedDrawer.hidden = !isOpen;
    savedButton.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) renderSavedReadings();
  }
}

function setupSmoothNavigation() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-next], [data-target]");
    if (!trigger) return;

    const id = trigger.dataset.next || trigger.dataset.target;
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    smoothScrollToSection(id);
  });
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
      if (!event.target.closest?.(".daily-section.is-current")) return;
      mobileTouchStartY = event.touches[0]?.clientY || 0;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (!isPhoneLayout()) return;

      const scroller = event.target.closest?.(".daily-section.is-current");
      if (!scroller) return;

      const y = event.touches[0]?.clientY || 0;
      const dy = y - mobileTouchStartY;
      const atTop = scroller.scrollTop <= 0;
      const atBottom = Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight - 1;

      if ((atTop && dy > 0) || (atBottom && dy < 0)) {
        event.preventDefault();
      }

      mobileTouchStartY = y;
    },
    { passive: false },
  );
}

function navigateSection(direction) {
  const sections = [...document.querySelectorAll("[data-section]")];
  if (!sections.length) return;

  const activeIndex = sections.findIndex((section) => section.id === currentSectionId);
  const currentIndex = activeIndex >= 0 ? activeIndex : getCurrentSectionIndex(sections);
  const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
  if (nextIndex === currentIndex) return;

  smoothScrollToSection(sections[nextIndex].id);
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

function smoothScrollToSection(id) {
  const target = document.getElementById(id);
  if (!target) return;

  isProgrammaticScroll = true;
  setActiveSectionVisuals(id);
  document.querySelectorAll(".snap-focus").forEach((section) => {
    if (section !== target) section.classList.remove("snap-focus");
  });
  target.classList.add("snap-focus");

  if (isPhoneLayout()) {
    target.scrollTop = 0;
    window.scrollTo(0, 0);
    history.replaceState(null, "", `#${id}`);
    setActiveSectionVisuals(id);

    clearTimeout(snapReleaseTimer);
    snapReleaseTimer = setTimeout(() => {
      isProgrammaticScroll = false;
      target.classList.remove("snap-focus");
      setActiveSectionVisuals(id);
    }, 280);
    return;
  }

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
    return;
  }

  const viewport = window.visualViewport;
  const width = Math.round(viewport?.width || window.innerWidth);
  const height = Math.round(viewport?.height || window.innerHeight);
  const widthChanged = !mobileViewportWidth || Math.abs(width - mobileViewportWidth) > 24;

  if (!force && !widthChanged) return;

  mobileViewportWidth = width;
  document.documentElement.style.setProperty("--mobile-vh", `${height}px`);
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
        primary: getSavedPrimaryText(type, item),
        note: item.effect || item.explain || item.reflection || item.moral || "",
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
        <p>Saved readings will show here with their verse, dua, dhikr, hadith, quote, and story.</p>
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
  return `
    <section class="saved-reading">
      <span class="mini-label">${escapeHTML(item.label)}</span>
      <h4>${escapeHTML(item.title)}</h4>
      ${item.arabic ? `<p class="saved-arabic" lang="ar">${escapeHTML(item.arabic)}</p>` : ""}
      <p>${escapeHTML(item.primary)}</p>
      ${item.note ? `<p class="saved-note">${escapeHTML(item.note)}</p>` : ""}
      <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.source)} - ${escapeHTML(item.quality)}</a>
    </section>
  `;
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
  if (!tapButton || !resetButton || !countText) return;

  const key = `daily-deen-dhikr-count-${iso}-${slugify(title)}`;
  let count = Number(localStorage.getItem(key) || 0);

  const renderCount = () => {
    countText.textContent = String(count);
  };

  tapButton.addEventListener("click", () => {
    count += 1;
    localStorage.setItem(key, String(count));
    renderCount();
    tapButton.classList.remove("pulse");
    void tapButton.offsetWidth;
    tapButton.classList.add("pulse");
  });

  resetButton.addEventListener("click", () => {
    count = 0;
    localStorage.setItem(key, "0");
    renderCount();
    if (feedback) {
      feedback.textContent = "Counter reset";
      feedback.classList.add("visible");
      clearTimeout(feedback.hideTimer);
      feedback.hideTimer = setTimeout(() => {
        feedback.classList.remove("visible");
        feedback.textContent = "";
      }, 1600);
    }
  });

  renderCount();
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
