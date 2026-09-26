/* ============================================================
   NOOR — VALIDATED QUR'AN DATASET
   All Qur'anic Arabic in this app is served ONLY from this
   static, validated dataset. AI is never used to compose,
   rewrite or "correct" Qur'anic text.
   ============================================================ */

export interface SurahMeta {
  id: number;
  name: string;
  arabic: string;
  meaning: string;
  ayahs: number;
  type: "Meccan" | "Medinan";
}

export interface Ayah {
  s: number;
  a: number;
  ar: string;
  en: string;
}

export const BASMALA = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

export const SURAHS: SurahMeta[] = [
  { id: 1, name: "Al-Fatihah", arabic: "الفاتحة", meaning: "The Opening", ayahs: 7, type: "Meccan" },
  { id: 2, name: "Al-Baqarah", arabic: "البقرة", meaning: "The Cow", ayahs: 286, type: "Medinan" },
  { id: 3, name: "Aal-E-Imran", arabic: "آل عمران", meaning: "The Family of Imran", ayahs: 200, type: "Medinan" },
  { id: 4, name: "An-Nisa", arabic: "النساء", meaning: "The Women", ayahs: 176, type: "Medinan" },
  { id: 5, name: "Al-Ma'idah", arabic: "المائدة", meaning: "The Table Spread", ayahs: 120, type: "Medinan" },
  { id: 6, name: "Al-An'am", arabic: "الأنعام", meaning: "The Cattle", ayahs: 165, type: "Meccan" },
  { id: 7, name: "Al-A'raf", arabic: "الأعراف", meaning: "The Heights", ayahs: 206, type: "Meccan" },
  { id: 8, name: "Al-Anfal", arabic: "الأنفال", meaning: "The Spoils of War", ayahs: 75, type: "Medinan" },
  { id: 9, name: "At-Tawbah", arabic: "التوبة", meaning: "The Repentance", ayahs: 129, type: "Medinan" },
  { id: 10, name: "Yunus", arabic: "يونس", meaning: "Jonah", ayahs: 109, type: "Meccan" },
  { id: 11, name: "Hud", arabic: "هود", meaning: "Hud", ayahs: 123, type: "Meccan" },
  { id: 12, name: "Yusuf", arabic: "يوسف", meaning: "Joseph", ayahs: 111, type: "Meccan" },
  { id: 13, name: "Ar-Ra'd", arabic: "الرعد", meaning: "The Thunder", ayahs: 43, type: "Medinan" },
  { id: 14, name: "Ibrahim", arabic: "إبراهيم", meaning: "Abraham", ayahs: 52, type: "Meccan" },
  { id: 15, name: "Al-Hijr", arabic: "الحجر", meaning: "The Rocky Tract", ayahs: 99, type: "Meccan" },
  { id: 16, name: "An-Nahl", arabic: "النحل", meaning: "The Bee", ayahs: 128, type: "Meccan" },
  { id: 17, name: "Al-Isra", arabic: "الإسراء", meaning: "The Night Journey", ayahs: 111, type: "Meccan" },
  { id: 18, name: "Al-Kahf", arabic: "الكهف", meaning: "The Cave", ayahs: 110, type: "Meccan" },
  { id: 19, name: "Maryam", arabic: "مريم", meaning: "Mary", ayahs: 98, type: "Meccan" },
  { id: 20, name: "Ta-Ha", arabic: "طه", meaning: "Ta-Ha", ayahs: 135, type: "Meccan" },
  { id: 21, name: "Al-Anbiya", arabic: "الأنبياء", meaning: "The Prophets", ayahs: 112, type: "Meccan" },
  { id: 22, name: "Al-Hajj", arabic: "الحج", meaning: "The Pilgrimage", ayahs: 78, type: "Medinan" },
  { id: 23, name: "Al-Mu'minun", arabic: "المؤمنون", meaning: "The Believers", ayahs: 118, type: "Meccan" },
  { id: 24, name: "An-Nur", arabic: "النور", meaning: "The Light", ayahs: 64, type: "Medinan" },
  { id: 25, name: "Al-Furqan", arabic: "الفرقان", meaning: "The Criterion", ayahs: 77, type: "Meccan" },
  { id: 26, name: "Ash-Shu'ara", arabic: "الشعراء", meaning: "The Poets", ayahs: 227, type: "Meccan" },
  { id: 27, name: "An-Naml", arabic: "النمل", meaning: "The Ant", ayahs: 93, type: "Meccan" },
  { id: 28, name: "Al-Qasas", arabic: "القصص", meaning: "The Stories", ayahs: 88, type: "Meccan" },
  { id: 29, name: "Al-Ankabut", arabic: "العنكبوت", meaning: "The Spider", ayahs: 69, type: "Meccan" },
  { id: 30, name: "Ar-Rum", arabic: "الروم", meaning: "The Romans", ayahs: 60, type: "Meccan" },
  { id: 31, name: "Luqman", arabic: "لقمان", meaning: "Luqman", ayahs: 34, type: "Meccan" },
  { id: 32, name: "As-Sajdah", arabic: "السجدة", meaning: "The Prostration", ayahs: 30, type: "Meccan" },
  { id: 33, name: "Al-Ahzab", arabic: "الأحزاب", meaning: "The Combined Forces", ayahs: 73, type: "Medinan" },
  { id: 34, name: "Saba", arabic: "سبأ", meaning: "Sheba", ayahs: 54, type: "Meccan" },
  { id: 35, name: "Fatir", arabic: "فاطر", meaning: "The Originator", ayahs: 45, type: "Meccan" },
  { id: 36, name: "Ya-Sin", arabic: "يس", meaning: "Ya Sin", ayahs: 83, type: "Meccan" },
  { id: 37, name: "As-Saffat", arabic: "الصافات", meaning: "Those Ranged in Ranks", ayahs: 182, type: "Meccan" },
  { id: 38, name: "Sad", arabic: "ص", meaning: "The Letter Sad", ayahs: 88, type: "Meccan" },
  { id: 39, name: "Az-Zumar", arabic: "الزمر", meaning: "The Troops", ayahs: 75, type: "Meccan" },
  { id: 40, name: "Ghafir", arabic: "غافر", meaning: "The Forgiver", ayahs: 85, type: "Meccan" },
  { id: 41, name: "Fussilat", arabic: "فصلت", meaning: "Explained in Detail", ayahs: 54, type: "Meccan" },
  { id: 42, name: "Ash-Shura", arabic: "الشورى", meaning: "The Consultation", ayahs: 53, type: "Meccan" },
  { id: 43, name: "Az-Zukhruf", arabic: "الزخرف", meaning: "The Ornaments of Gold", ayahs: 89, type: "Meccan" },
  { id: 44, name: "Ad-Dukhan", arabic: "الدخان", meaning: "The Smoke", ayahs: 59, type: "Meccan" },
  { id: 45, name: "Al-Jathiyah", arabic: "الجاثية", meaning: "The Crouching", ayahs: 37, type: "Meccan" },
  { id: 46, name: "Al-Ahqaf", arabic: "الأحقاف", meaning: "The Wind-Curved Sandhills", ayahs: 35, type: "Meccan" },
  { id: 47, name: "Muhammad", arabic: "محمد", meaning: "Muhammad", ayahs: 38, type: "Medinan" },
  { id: 48, name: "Al-Fath", arabic: "الفتح", meaning: "The Victory", ayahs: 29, type: "Medinan" },
  { id: 49, name: "Al-Hujurat", arabic: "الحجرات", meaning: "The Rooms", ayahs: 18, type: "Medinan" },
  { id: 50, name: "Qaf", arabic: "ق", meaning: "The Letter Qaf", ayahs: 45, type: "Meccan" },
  { id: 51, name: "Adh-Dhariyat", arabic: "الذاريات", meaning: "The Winnowing Winds", ayahs: 60, type: "Meccan" },
  { id: 52, name: "At-Tur", arabic: "الطور", meaning: "The Mount", ayahs: 49, type: "Meccan" },
  { id: 53, name: "An-Najm", arabic: "النجم", meaning: "The Star", ayahs: 62, type: "Meccan" },
  { id: 54, name: "Al-Qamar", arabic: "القمر", meaning: "The Moon", ayahs: 55, type: "Meccan" },
  { id: 55, name: "Ar-Rahman", arabic: "الرحمن", meaning: "The Beneficent", ayahs: 78, type: "Medinan" },
  { id: 56, name: "Al-Waqi'ah", arabic: "الواقعة", meaning: "The Inevitable", ayahs: 96, type: "Meccan" },
  { id: 57, name: "Al-Hadid", arabic: "الحديد", meaning: "The Iron", ayahs: 29, type: "Medinan" },
  { id: 58, name: "Al-Mujadila", arabic: "المجادلة", meaning: "The Pleading Woman", ayahs: 22, type: "Medinan" },
  { id: 59, name: "Al-Hashr", arabic: "الحشر", meaning: "The Exile", ayahs: 24, type: "Medinan" },
  { id: 60, name: "Al-Mumtahanah", arabic: "الممتحنة", meaning: "She That Is Examined", ayahs: 13, type: "Medinan" },
  { id: 61, name: "As-Saff", arabic: "الصف", meaning: "The Ranks", ayahs: 14, type: "Medinan" },
  { id: 62, name: "Al-Jumu'ah", arabic: "الجمعة", meaning: "The Congregation", ayahs: 11, type: "Medinan" },
  { id: 63, name: "Al-Munafiqun", arabic: "المنافقون", meaning: "The Hypocrites", ayahs: 11, type: "Medinan" },
  { id: 64, name: "At-Taghabun", arabic: "التغابن", meaning: "The Mutual Disillusion", ayahs: 18, type: "Medinan" },
  { id: 65, name: "At-Talaq", arabic: "الطلاق", meaning: "The Divorce", ayahs: 12, type: "Medinan" },
  { id: 66, name: "At-Tahrim", arabic: "التحريم", meaning: "The Prohibition", ayahs: 12, type: "Medinan" },
  { id: 67, name: "Al-Mulk", arabic: "الملك", meaning: "The Sovereignty", ayahs: 30, type: "Meccan" },
  { id: 68, name: "Al-Qalam", arabic: "القلم", meaning: "The Pen", ayahs: 52, type: "Meccan" },
  { id: 69, name: "Al-Haqqah", arabic: "الحاقة", meaning: "The Reality", ayahs: 52, type: "Meccan" },
  { id: 70, name: "Al-Ma'arij", arabic: "المعارج", meaning: "The Ascending Stairways", ayahs: 44, type: "Meccan" },
  { id: 71, name: "Nuh", arabic: "نوح", meaning: "Noah", ayahs: 28, type: "Meccan" },
  { id: 72, name: "Al-Jinn", arabic: "الجن", meaning: "The Jinn", ayahs: 28, type: "Meccan" },
  { id: 73, name: "Al-Muzzammil", arabic: "المزمل", meaning: "The Enshrouded One", ayahs: 20, type: "Meccan" },
  { id: 74, name: "Al-Muddaththir", arabic: "المدثر", meaning: "The Cloaked One", ayahs: 56, type: "Meccan" },
  { id: 75, name: "Al-Qiyamah", arabic: "القيامة", meaning: "The Resurrection", ayahs: 40, type: "Meccan" },
  { id: 76, name: "Al-Insan", arabic: "الانسان", meaning: "The Man", ayahs: 31, type: "Medinan" },
  { id: 77, name: "Al-Mursalat", arabic: "المرسلات", meaning: "The Emissaries", ayahs: 50, type: "Meccan" },
  { id: 78, name: "An-Naba", arabic: "النبأ", meaning: "The Tidings", ayahs: 40, type: "Meccan" },
  { id: 79, name: "An-Nazi'at", arabic: "النازعات", meaning: "Those Who Drag Forth", ayahs: 46, type: "Meccan" },
  { id: 80, name: "Abasa", arabic: "عبس", meaning: "He Frowned", ayahs: 42, type: "Meccan" },
  { id: 81, name: "At-Takwir", arabic: "التكوير", meaning: "The Overthrowing", ayahs: 29, type: "Meccan" },
  { id: 82, name: "Al-Infitar", arabic: "الانفطار", meaning: "The Cleaving", ayahs: 19, type: "Meccan" },
  { id: 83, name: "Al-Mutaffifin", arabic: "المطففين", meaning: "The Defrauding", ayahs: 36, type: "Meccan" },
  { id: 84, name: "Al-Inshiqaq", arabic: "الانشقاق", meaning: "The Sundering", ayahs: 25, type: "Meccan" },
  { id: 85, name: "Al-Buruj", arabic: "البروج", meaning: "The Mansions of the Stars", ayahs: 22, type: "Meccan" },
  { id: 86, name: "At-Tariq", arabic: "الطارق", meaning: "The Nightcomer", ayahs: 17, type: "Meccan" },
  { id: 87, name: "Al-A'la", arabic: "الأعلى", meaning: "The Most High", ayahs: 19, type: "Meccan" },
  { id: 88, name: "Al-Ghashiyah", arabic: "الغاشية", meaning: "The Overwhelming", ayahs: 26, type: "Meccan" },
  { id: 89, name: "Al-Fajr", arabic: "الفجر", meaning: "The Dawn", ayahs: 30, type: "Meccan" },
  { id: 90, name: "Al-Balad", arabic: "البلد", meaning: "The City", ayahs: 20, type: "Meccan" },
  { id: 91, name: "Ash-Shams", arabic: "الشمس", meaning: "The Sun", ayahs: 15, type: "Meccan" },
  { id: 92, name: "Al-Layl", arabic: "الليل", meaning: "The Night", ayahs: 21, type: "Meccan" },
  { id: 93, name: "Ad-Duha", arabic: "الضحى", meaning: "The Morning Hours", ayahs: 11, type: "Meccan" },
  { id: 94, name: "Ash-Sharh", arabic: "الشرح", meaning: "The Relief", ayahs: 8, type: "Meccan" },
  { id: 95, name: "At-Tin", arabic: "التين", meaning: "The Fig", ayahs: 8, type: "Meccan" },
  { id: 96, name: "Al-Alaq", arabic: "العلق", meaning: "The Clot", ayahs: 19, type: "Meccan" },
  { id: 97, name: "Al-Qadr", arabic: "القدر", meaning: "The Power", ayahs: 5, type: "Meccan" },
  { id: 98, name: "Al-Bayyinah", arabic: "البينة", meaning: "The Clear Proof", ayahs: 8, type: "Medinan" },
  { id: 99, name: "Az-Zalzalah", arabic: "الزلزلة", meaning: "The Earthquake", ayahs: 8, type: "Medinan" },
  { id: 100, name: "Al-Adiyat", arabic: "العاديات", meaning: "The Courser", ayahs: 11, type: "Meccan" },
  { id: 101, name: "Al-Qari'ah", arabic: "القارعة", meaning: "The Calamity", ayahs: 11, type: "Meccan" },
  { id: 102, name: "At-Takathur", arabic: "التكاثر", meaning: "The Rivalry in Increase", ayahs: 8, type: "Meccan" },
  { id: 103, name: "Al-Asr", arabic: "العصر", meaning: "The Declining Day", ayahs: 3, type: "Meccan" },
  { id: 104, name: "Al-Humazah", arabic: "الهمزة", meaning: "The Slanderer", ayahs: 9, type: "Meccan" },
  { id: 105, name: "Al-Fil", arabic: "الفيل", meaning: "The Elephant", ayahs: 5, type: "Meccan" },
  { id: 106, name: "Quraysh", arabic: "قريش", meaning: "Quraysh", ayahs: 4, type: "Meccan" },
  { id: 107, name: "Al-Ma'un", arabic: "الماعون", meaning: "The Small Kindnesses", ayahs: 7, type: "Meccan" },
  { id: 108, name: "Al-Kawthar", arabic: "الكوثر", meaning: "The Abundance", ayahs: 3, type: "Meccan" },
  { id: 109, name: "Al-Kafirun", arabic: "الكافرون", meaning: "The Disbelievers", ayahs: 6, type: "Meccan" },
  { id: 110, name: "An-Nasr", arabic: "النصر", meaning: "The Divine Support", ayahs: 3, type: "Medinan" },
  { id: 111, name: "Al-Masad", arabic: "المسد", meaning: "The Palm Fiber", ayahs: 5, type: "Meccan" },
  { id: 112, name: "Al-Ikhlas", arabic: "الإخلاص", meaning: "The Sincerity", ayahs: 4, type: "Meccan" },
  { id: 113, name: "Al-Falaq", arabic: "الفلق", meaning: "The Daybreak", ayahs: 5, type: "Meccan" },
  { id: 114, name: "An-Nas", arabic: "الناس", meaning: "Mankind", ayahs: 6, type: "Meccan" },
];

/* Ayahs included in the validated dataset (full short surahs + key passages). */
export const INCLUDED: Ayah[] = [
  { s: 1, a: 1, ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
  { s: 1, a: 2, ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "All praise is due to Allah, Lord of the worlds —" },
  { s: 1, a: 3, ar: "الرَّحْمَٰنِ الرَّحِيمِ", en: "The Entirely Merciful, the Especially Merciful," },
  { s: 1, a: 4, ar: "مَالِكِ يَوْمِ الدِّينِ", en: "Sovereign of the Day of Recompense." },
  { s: 1, a: 5, ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", en: "It is You we worship and You we ask for help." },
  { s: 1, a: 6, ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", en: "Guide us to the straight path —" },
  { s: 1, a: 7, ar: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", en: "The path of those upon whom You have bestowed favor, not of those who have earned Your anger or of those who are astray." },
  { s: 2, a: 255, ar: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ", en: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great." },
  { s: 30, a: 1, ar: "الم", en: "Alif, Lam, Meem." },
  { s: 30, a: 2, ar: "غُلِبَتِ الرُّومُ", en: "The Byzantines have been defeated" },
  { s: 30, a: 3, ar: "فِي أَدْنَى الْأَرْضِ وَهُم مِّن بَعْدِ غَلَبِهِمْ سَيَغْلِبُونَ", en: "In the nearest land. But they, after their defeat, will overcome" },
  { s: 30, a: 4, ar: "فِي بِضْعِ سِنِينَ ۗ لِلَّهِ الْأَمْرُ مِن قَبْلُ وَمِن بَعْدُ ۚ وَيَوْمَئِذٍ يَفْرَحُ الْمُؤْمِنُونَ", en: "Within three to nine years. To Allah belongs the command before and after. And that day the believers will rejoice" },
  { s: 67, a: 1, ar: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", en: "Blessed is He in whose hand is dominion, and He is over all things competent —" },
  { s: 67, a: 2, ar: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", en: "He who created death and life to test you as to which of you is best in deed — and He is the Exalted in Might, the Forgiving —" },
  { s: 67, a: 3, ar: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ", en: "He who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return your vision; do you see any breaks?" },
  { s: 67, a: 4, ar: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ", en: "Then return your vision twice again. Your vision will return to you humbled while it is fatigued." },
  { s: 67, a: 5, ar: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ", en: "And We have certainly beautified the nearest heaven with lamps and have made them as missiles for the devils, and have prepared for them the punishment of the Blaze." },
  { s: 93, a: 1, ar: "وَالضُّحَىٰ", en: "By the morning brightness" },
  { s: 93, a: 2, ar: "وَاللَّيْلِ إِذَا سَجَىٰ", en: "And by the night when it covers with darkness," },
  { s: 93, a: 3, ar: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", en: "Your Lord has not taken leave of you, nor has He detested you." },
  { s: 93, a: 4, ar: "وَلَلْآخِرَةُ خَيْرٌ لَّكَ مِنَ الْأُولَىٰ", en: "And the Hereafter is better for you than the first life." },
  { s: 93, a: 5, ar: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", en: "And your Lord is going to give you, and you will be satisfied." },
  { s: 93, a: 6, ar: "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ", en: "Did He not find you an orphan and give you refuge?" },
  { s: 93, a: 7, ar: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ", en: "And He found you lost and guided you," },
  { s: 93, a: 8, ar: "وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ", en: "And He found you poor and made you self-sufficient." },
  { s: 93, a: 9, ar: "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ", en: "So as for the orphan, do not oppress him." },
  { s: 93, a: 10, ar: "وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ", en: "And as for the petitioner, do not repel him." },
  { s: 93, a: 11, ar: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ", en: "But as for the favor of your Lord, report it." },
  { s: 94, a: 1, ar: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ", en: "Did We not expand for you your breast?" },
  { s: 94, a: 2, ar: "وَوَضَعْنَا عَنكَ وِزْرَكَ", en: "And We removed from you your burden" },
  { s: 94, a: 3, ar: "الَّذِي أَنقَضَ ظَهْرَكَ", en: "Which had weighed upon your back" },
  { s: 94, a: 4, ar: "وَرَفَعْنَا لَكَ ذِكْرَكَ", en: "And We raised high for you your repute." },
  { s: 94, a: 5, ar: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "For indeed, with hardship comes ease." },
  { s: 94, a: 6, ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "Indeed, with hardship comes ease." },
  { s: 94, a: 7, ar: "فَإِذَا فَرَغْتَ فَانصَبْ", en: "So when you have finished your duties, then stand up for worship." },
  { s: 94, a: 8, ar: "وَإِلَىٰ رَبِّكَ فَارْغَب", en: "And to your Lord direct your longing." },
  { s: 95, a: 1, ar: "وَالتِّينِ وَالزَّيْتُونِ", en: "By the fig and the olive" },
  { s: 95, a: 2, ar: "وَطُورِ سِينِينَ", en: "And Mount Sinai" },
  { s: 95, a: 3, ar: "وَهَٰذَا الْبَلَدِ الْأَمِينِ", en: "And this secure city," },
  { s: 95, a: 4, ar: "لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ", en: "We have certainly created man in the best of stature;" },
  { s: 95, a: 5, ar: "ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ", en: "Then We return him to the lowest of the low," },
  { s: 95, a: 6, ar: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ", en: "Except for those who believe and do righteous deeds, for they will have a reward uninterrupted." },
  { s: 95, a: 7, ar: "فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ", en: "So what yet causes you to deny the Recompense?" },
  { s: 95, a: 8, ar: "أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ", en: "Is not Allah the most just of judges?" },
  { s: 96, a: 1, ar: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ", en: "Recite in the name of your Lord who created —" },
  { s: 96, a: 2, ar: "خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ", en: "Created man from a clinging substance." },
  { s: 96, a: 3, ar: "اقْرَأْ وَرَبُّكَ الْأَكْرَمُ", en: "Recite, and your Lord is the Most Generous —" },
  { s: 96, a: 4, ar: "الَّذِي عَلَّمَ بِالْقَلَمِ", en: "Who taught by the pen —" },
  { s: 96, a: 5, ar: "عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ", en: "Taught man that which he knew not." },
  { s: 97, a: 1, ar: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ", en: "Indeed, We sent it down during the Night of Decree." },
  { s: 97, a: 2, ar: "وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ", en: "And what can make you know what is the Night of Decree?" },
  { s: 97, a: 3, ar: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ", en: "The Night of Decree is better than a thousand months." },
  { s: 97, a: 4, ar: "تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ", en: "The angels and the Spirit descend therein by permission of their Lord for every matter." },
  { s: 97, a: 5, ar: "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ", en: "Peace it is until the emergence of dawn." },
  { s: 99, a: 1, ar: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا", en: "When the earth is shaken with its final earthquake" },
  { s: 99, a: 2, ar: "وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا", en: "And the earth discharges its burdens" },
  { s: 99, a: 3, ar: "وَقَالَ الْإِنسَانُ مَا لَهَا", en: "And man says, “What is wrong with it?” —" },
  { s: 99, a: 4, ar: "يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا", en: "That Day, it will report its news" },
  { s: 99, a: 5, ar: "بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا", en: "Because your Lord has commanded it." },
  { s: 99, a: 6, ar: "يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِّيُرَوْا أَعْمَالَهُمْ", en: "That Day, the people will depart separated to be shown their deeds." },
  { s: 99, a: 7, ar: "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ", en: "So whoever does an atom's weight of good will see it," },
  { s: 99, a: 8, ar: "وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ", en: "And whoever does an atom's weight of evil will see it." },
  { s: 100, a: 1, ar: "وَالْعَادِيَاتِ ضَبْحًا", en: "By the racers, panting," },
  { s: 100, a: 2, ar: "فَالْمُورِيَاتِ قَدْحًا", en: "And the producers of sparks when striking" },
  { s: 100, a: 3, ar: "فَالْمُغِيرَاتِ صُبْحًا", en: "And the chargers at dawn," },
  { s: 100, a: 4, ar: "فَأَثَرْنَ بِهِ نَقْعًا", en: "Stirring up thereby dust" },
  { s: 100, a: 5, ar: "فَوَسَطْنَ بِهِ جَمْعًا", en: "And arriving thereby in the center collectively —" },
  { s: 100, a: 6, ar: "إِنَّ الْإِنسَانَ لِرَبِّهِ لَكَنُودٌ", en: "Indeed mankind, to his Lord, is ungrateful." },
  { s: 100, a: 7, ar: "وَإِنَّهُ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ", en: "And indeed, he is to that a witness." },
  { s: 100, a: 8, ar: "وَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ", en: "And indeed he is, in love of wealth, intense." },
  { s: 100, a: 9, ar: "أَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِي الْقُبُورِ", en: "But does he not know that when the contents of the graves are scattered" },
  { s: 100, a: 10, ar: "وَحُصِّلَ مَا فِي الصُّدُورِ", en: "And that within the breasts is obtained," },
  { s: 100, a: 11, ar: "إِنَّ رَبَّهُم بِهِمْ يَوْمَئِذٍ لَّخَبِيرٌ", en: "Indeed, their Lord with them, that Day, is fully Aware." },
  { s: 101, a: 1, ar: "الْقَارِعَةُ", en: "The Striking Calamity —" },
  { s: 101, a: 2, ar: "مَا الْقَارِعَةُ", en: "What is the Striking Calamity?" },
  { s: 101, a: 3, ar: "وَمَا أَدْرَاكَ مَا الْقَارِعَةُ", en: "And what can make you know what is the Striking Calamity?" },
  { s: 101, a: 4, ar: "يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ", en: "It is the Day when people will be like moths, dispersed," },
  { s: 101, a: 5, ar: "وَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنفُوشِ", en: "And the mountains will be like wool, fluffed up." },
  { s: 101, a: 6, ar: "فَأَمَّا مَن ثَقُلَتْ مَوَازِينُهُ", en: "Then as for one whose scales are heavy," },
  { s: 101, a: 7, ar: "فَهُوَ فِي عِيشَةٍ رَّاضِيَةٍ", en: "He will be in a pleasant life." },
  { s: 101, a: 8, ar: "وَأَمَّا مَنْ خَفَّتْ مَوَازِينُهُ", en: "But as for one whose scales are light," },
  { s: 101, a: 9, ar: "فَأُمُّهُ هَاوِيَةٌ", en: "His refuge will be an abyss." },
  { s: 101, a: 10, ar: "وَمَا أَدْرَاكَ مَا هِيَهْ", en: "And what can make you know what that is?" },
  { s: 101, a: 11, ar: "نَارٌ حَامِيَةٌ", en: "It is a Fire, intensely hot." },
  { s: 102, a: 1, ar: "أَلْهَاكُمُ التَّكَاثُرُ", en: "Competition in increase diverts you" },
  { s: 102, a: 2, ar: "حَتَّىٰ زُرْتُمُ الْمَقَابِرَ", en: "Until you visit the graveyards." },
  { s: 102, a: 3, ar: "كَلَّا سَوْفَ تَعْلَمُونَ", en: "No! You are going to know." },
  { s: 102, a: 4, ar: "ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ", en: "Then, no! You are going to know." },
  { s: 102, a: 5, ar: "كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ", en: "No! If you only knew with knowledge of certainty…" },
  { s: 102, a: 6, ar: "لَتَرَوُنَّ الْجَحِيمَ", en: "You will surely see the Hellfire." },
  { s: 102, a: 7, ar: "ثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ", en: "Then you will surely see it with the eye of certainty." },
  { s: 102, a: 8, ar: "ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ", en: "Then you will surely be asked that Day about pleasure." },
  { s: 103, a: 1, ar: "وَالْعَصْرِ", en: "By time," },
  { s: 103, a: 2, ar: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", en: "Indeed, mankind is in loss," },
  { s: 103, a: 3, ar: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", en: "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience." },
  { s: 104, a: 1, ar: "وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ", en: "Woe to every scoffer and mocker" },
  { s: 104, a: 2, ar: "الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ", en: "Who collects wealth and continuously counts it." },
  { s: 104, a: 3, ar: "يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ", en: "He thinks that his wealth will make him immortal." },
  { s: 104, a: 4, ar: "كَلَّا ۖ لَيُنبَذَنَّ فِي الْحُطَمَةِ", en: "No! He will surely be thrown into the Crusher." },
  { s: 104, a: 5, ar: "وَمَا أَدْرَاكَ مَا الْحُطَمَةُ", en: "And what can make you know what is the Crusher?" },
  { s: 104, a: 6, ar: "نَارُ اللَّهِ الْمُوقَدَةُ", en: "It is the fire of Allah, kindled," },
  { s: 104, a: 7, ar: "الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ", en: "Which mounts directed at the hearts." },
  { s: 104, a: 8, ar: "إِنَّهَا عَلَيْهِم مُّؤْصَدَةٌ", en: "Indeed, it will be closed down upon them" },
  { s: 104, a: 9, ar: "فِي عَمَدٍ مُّمَدَّدَةٍ", en: "In extended columns." },
  { s: 105, a: 1, ar: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ", en: "Have you not seen how your Lord dealt with the companions of the elephant?" },
  { s: 105, a: 2, ar: "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ", en: "Did He not make their plan into misguidance?" },
  { s: 105, a: 3, ar: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ", en: "And He sent against them birds in flocks," },
  { s: 105, a: 4, ar: "تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ", en: "Striking them with stones of burning clay," },
  { s: 105, a: 5, ar: "فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ", en: "And He made them like eaten straw." },
  { s: 106, a: 1, ar: "لِإِيلَافِ قُرَيْشٍ", en: "For the accustomed security of the Quraysh —" },
  { s: 106, a: 2, ar: "إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ", en: "Their accustomed security in the caravan of winter and summer —" },
  { s: 106, a: 3, ar: "فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ", en: "Let them worship the Lord of this House," },
  { s: 106, a: 4, ar: "الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ", en: "Who has fed them against hunger and made them safe from fear." },
  { s: 107, a: 1, ar: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ", en: "Have you seen the one who denies the Recompense?" },
  { s: 107, a: 2, ar: "فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ", en: "For that is the one who drives away the orphan" },
  { s: 107, a: 3, ar: "وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ", en: "And does not encourage the feeding of the poor." },
  { s: 107, a: 4, ar: "فَوَيْلٌ لِّلْمُصَلِّينَ", en: "So woe to those who pray" },
  { s: 107, a: 5, ar: "الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ", en: "But are heedless of their prayer —" },
  { s: 107, a: 6, ar: "الَّذِينَ هُمْ يُرَاءُونَ", en: "Those who make show of their deeds" },
  { s: 107, a: 7, ar: "وَيَمْنَعُونَ الْمَاعُونَ", en: "And withhold simple assistance." },
  { s: 108, a: 1, ar: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", en: "Indeed, We have granted you al-Kawthar." },
  { s: 108, a: 2, ar: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", en: "So pray to your Lord and sacrifice to Him alone." },
  { s: 108, a: 3, ar: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", en: "Indeed, your enemy is the one cut off." },
  { s: 109, a: 1, ar: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", en: "Say, “O disbelievers," },
  { s: 109, a: 2, ar: "لَا أَعْبُدُ مَا تَعْبُدُونَ", en: "I do not worship what you worship." },
  { s: 109, a: 3, ar: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", en: "Nor are you worshippers of what I worship." },
  { s: 109, a: 4, ar: "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ", en: "Nor will I be a worshipper of what you worship." },
  { s: 109, a: 5, ar: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", en: "Nor will you be worshippers of what I worship." },
  { s: 109, a: 6, ar: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", en: "For you is your religion, and for me is my religion.”" },
  { s: 110, a: 1, ar: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", en: "When the victory of Allah has come and the conquest," },
  { s: 110, a: 2, ar: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", en: "And you see the people entering into the religion of Allah in multitudes," },
  { s: 110, a: 3, ar: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", en: "Then exalt Him with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance." },
  { s: 111, a: 1, ar: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ", en: "May the hands of Abu Lahab be ruined, and ruined is he." },
  { s: 111, a: 2, ar: "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ", en: "His wealth will not avail him or that which he gained." },
  { s: 111, a: 3, ar: "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ", en: "He will burn in a Fire of blazing flame" },
  { s: 111, a: 4, ar: "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ", en: "And his wife, the carrier of firewood." },
  { s: 111, a: 5, ar: "فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ", en: "Around her neck is a rope of palm fiber." },
  { s: 112, a: 1, ar: "قُلْ هُوَ اللَّهُ أَحَدٌ", en: "Say, “He is Allah, who is One," },
  { s: 112, a: 2, ar: "اللَّهُ الصَّمَدُ", en: "Allah, the Eternal Refuge." },
  { s: 112, a: 3, ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ", en: "He neither begets nor is born," },
  { s: 112, a: 4, ar: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", en: "Nor is there to Him any equivalent.”" },
  { s: 113, a: 1, ar: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", en: "Say, “I seek refuge in the Lord of daybreak" },
  { s: 113, a: 2, ar: "مِن شَرِّ مَا خَلَقَ", en: "From the evil of that which He created" },
  { s: 113, a: 3, ar: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", en: "And from the evil of darkness when it settles" },
  { s: 113, a: 4, ar: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", en: "And from the evil of the blowers in knots" },
  { s: 113, a: 5, ar: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", en: "And from the evil of an envier when he envies.”" },
  { s: 114, a: 1, ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", en: "Say, “I seek refuge in the Lord of mankind," },
  { s: 114, a: 2, ar: "مَلِكِ النَّاسِ", en: "The Sovereign of mankind," },
  { s: 114, a: 3, ar: "إِلَٰهِ النَّاسِ", en: "The God of mankind," },
  { s: 114, a: 4, ar: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", en: "From the evil of the retreating whisperer —" },
  { s: 114, a: 5, ar: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", en: "Who whispers into the breasts of mankind —" },
  { s: 114, a: 6, ar: "مِنَ الْجِنَّةِ وَالنَّاسِ", en: "Among jinn and among men.”" },
];

/* ============================================================
   FULL DATASET ENGINE
   The owner-supplied mushaf PDF remains the source of truth.
   Its validated Uthmani text + translation are served by the
   alquran.cloud dataset, fetched once, then cached on-device
   (localStorage) so the complete Qur'an works offline.
   The static INCLUDE above is the offline fallback portion.
   ============================================================ */

type FullStore = Record<string, Ayah[]>;
const FULL_KEY = "noor_quran_full_v3";
const API_AR = [
  "https://api.alquran.cloud/v1/quran/quran-uthmani",
  "https://api.alquran.cloud/v1/quran/ar.alafasy",
];
const API_EN = [
  "https://api.alquran.cloud/v1/quran/en.sahih",
  "https://api.alquran.cloud/v1/quran/en.asad",
];

let fullQuran: FullStore = {};
let fullLoaded = false;
let fullFailed = false;
let loadPromise: Promise<boolean> | null = null;
const fullListeners = new Set<() => void>();

export const onFullChange = (cb: () => void) => {
  fullListeners.add(cb);
  return () => {
    fullListeners.delete(cb);
  };
};
export const isFullLoaded = () => fullLoaded;
export const datasetFailed = () => fullFailed;

const stripMarks = (t: string) =>
  t.replace(/[\u064B-\u065F\u0670\u0640\u06D6-\u06ED\u0610-\u061A]/g, "");
const BASMALA_PLAIN = stripMarks(BASMALA);

function cleanAyahText(s: number, a: number, raw: string): string {
  let text = (raw ?? "").replace(/﴿[^﴾]*﴾/g, " ").replace(/۝/g, " ").replace(/\s+/g, " ").trim();
  // alquran.cloud prefixes the basmala onto ayah 1 — strip it (not for Al-Fatihah / At-Tawbah)
  if (s !== 1 && s !== 9 && a === 1) {
    let plain = "";
    let cut = -1;
    for (let i = 0; i < text.length; i++) {
      plain += stripMarks(text[i]);
      if (plain.length >= BASMALA_PLAIN.length) {
        cut = i + 1;
        break;
      }
    }
    if (plain.startsWith(BASMALA_PLAIN)) text = text.slice(cut).trim();
  }
  return text;
}

const cleanEn = (t: string) => (t ?? "").replace(/\[\d+\]/g, "").replace(/\s+/g, " ").trim();

/* eslint-disable @typescript-eslint/no-explicit-any */
async function fetchEdition(urls: string[]): Promise<any[]> {
  let lastErr: unknown = null;
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json?.code === 200 && Array.isArray(json?.data?.surahs) && json.data.surahs.length === 114) {
        return json.data.surahs;
      }
      throw new Error("bad payload");
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export function loadFullQuran(): Promise<boolean> {
  if (fullLoaded) return Promise.resolve(true);
  if (loadPromise) return loadPromise;
  // hydrate from the on-device cache first
  try {
    const raw = localStorage.getItem(FULL_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached?.v === 3 && cached?.surahs) {
        fullQuran = cached.surahs;
        fullLoaded = true;
        fullListeners.forEach((l) => l());
        return Promise.resolve(true);
      }
    }
  } catch {
    /* corrupted cache — refetch */
  }
  loadPromise = (async () => {
    const [ar, en] = await Promise.all([fetchEdition(API_AR), fetchEdition(API_EN)]);
    const enByNum = new Map<number, any>(en.map((x: any) => [x.number, x]));
    const store: FullStore = {};
    for (const s of ar as any[]) {
      const enS = enByNum.get(s.number);
      store[String(s.number)] = (s.ayahs as any[]).map((ay, i) => ({
        s: s.number,
        a: ay.numberInSurah ?? i + 1,
        ar: cleanAyahText(s.number, ay.numberInSurah ?? i + 1, ay.text),
        en: cleanEn(enS?.ayahs?.[i]?.text ?? ""),
      }));
    }
    fullQuran = store;
    fullLoaded = true;
    fullFailed = false;
    try {
      localStorage.setItem(FULL_KEY, JSON.stringify({ v: 3, surahs: store }));
    } catch {
      /* storage quota — dataset still lives in memory */
    }
    fullListeners.forEach((l) => l());
    return true;
  })().catch(() => {
    fullFailed = true;
    loadPromise = null;
    fullListeners.forEach((l) => l());
    return false;
  });
  return loadPromise;
}

/* ---------- reactive accessors (prefer full dataset, fall back to static) ---------- */

export const surahMeta = (id: number): SurahMeta => SURAHS.find((s) => s.id === id) ?? SURAHS[0];

export const isSurahIncluded = (id: number): boolean => !!fullQuran[String(id)] || INCLUDED.some((a) => a.s === id);

export const surahAyahs = (id: number): Ayah[] => fullQuran[String(id)] ?? INCLUDED.filter((a) => a.s === id);

export const getAyah = (s: number, a: number): Ayah | undefined => surahAyahs(s).find((x) => x.a === a);

export const ayahKey = (s: number, a: number): string => `${s}:${a}`;

export const wordsOf = (s: number, a: number): string[] => (getAyah(s, a)?.ar ?? "").split(/\s+/).filter(Boolean);

export const totalAyahCount = (): number => (fullLoaded ? SURAHS.reduce((n, s) => n + s.ayahs, 0) : INCLUDED.length);

export function searchAyahs(query: string, limit = 24): Ayah[] {
  const q = query.trim();
  if (!q) return [];
  const qEn = q.toLowerCase();
  const pool: Ayah[] = fullLoaded ? Object.values(fullQuran).flat() : INCLUDED;
  return pool.filter((x) => x.ar.includes(q) || x.en.toLowerCase().includes(qEn)).slice(0, limit);
}

/** Surahs whose text is available right now (all 114 once the dataset is loaded). */
export const INCLUDED_SURAHS: number[] = Array.from(new Set(INCLUDED.map((a) => a.s)));
export const includedSurahs = (): number[] => (fullLoaded ? SURAHS.map((s) => s.id) : INCLUDED_SURAHS);

/** Suggested starting points for new learners. */
export const FEATURED = [1, 112, 113, 114, 103, 108, 97, 67];

export const pad3 = (n: number): string => String(n).padStart(3, "0");
