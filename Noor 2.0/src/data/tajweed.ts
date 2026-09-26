/* Tajweed Academy curriculum — every Qur'anic example is drawn
   from the validated dataset in src/data/quran.ts */

export interface TajweedExample {
  ref: string; // e.g. "97:1"
  arabic: string;
  mark: string; // substring to highlight
  note: string;
}

export interface TajweedLesson {
  id: string;
  title: string;
  arabic: string;
  color: string; // tailwind bg token
  tagline: string;
  summary: string;
  letters?: string;
  steps: string[];
  examples: TajweedExample[];
  quiz: { q: string; options: string[]; answer: number; explain: string };
}

export const LESSONS: TajweedLesson[] = [
  {
    id: "izhar",
    title: "Izhar",
    arabic: "الإظهار",
    color: "bg-sun",
    tagline: "The clear noon",
    summary:
      "When a noon sakinah (نْ) or tanween is followed by one of the six throat letters, the noon is pronounced clearly — with no humming or hiding.",
    letters: "ء  هـ  ع  ح  غ  خ",
    steps: [
      "Spot the noon sakinah or tanween.",
      "Check the next letter — is it a throat letter?",
      "Say the noon crisply and briefly. No ghunnah.",
    ],
    examples: [
      { ref: "106:4", arabic: "مِّنْ خَوْفٍ", mark: "نْ خَ", note: "Noon sakinah before خ — pronounced clearly." },
      { ref: "95:6", arabic: "أَجْرٌ غَيْرُ", mark: "رٌ غَ", note: "Tanween before غ — a clear izhar." },
    ],
    quiz: {
      q: "In “مِّنْ خَوْفٍ” (106:4), the noon sakinah is followed by خ. What rule applies?",
      options: ["Ikhfa", "Izhar", "Idgham", "Iqlab"],
      answer: 1,
      explain: "خ is one of the six throat letters, so the noon is said clearly — izhar.",
    },
  },
  {
    id: "ikhfa",
    title: "Ikhfa",
    arabic: "الإخفاء",
    color: "bg-lav",
    tagline: "The hidden noon",
    summary:
      "Before the fifteen ikhfa letters, the noon sakinah or tanween is concealed — somewhere between izhar and idgham — with a two-count nasal hum.",
    letters: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
    steps: [
      "Find the noon sakinah or tanween.",
      "If the next letter is one of the fifteen, hide the noon.",
      "Let the sound flow through the nose for two counts.",
    ],
    examples: [
      { ref: "114:4", arabic: "مِن شَرِّ الْوَسْوَاسِ", mark: "ن شَ", note: "Noon sakinah before ش — concealed with ghunnah." },
      { ref: "106:4", arabic: "مِّن جُوعٍ", mark: "ن جُ", note: "Noon sakinah before ج — soft ikhfa." },
    ],
    quiz: {
      q: "Which rule applies to the noon in “مِن شَرِّ” (114:4)?",
      options: ["Izhar", "Iqlab", "Ikhfa", "Idgham"],
      answer: 2,
      explain: "ش is an ikhfa letter, so the noon is hidden with a nasal hum.",
    },
  },
  {
    id: "idgham",
    title: "Idgham",
    arabic: "الإدغام",
    color: "bg-blush",
    tagline: "The merged noon",
    summary:
      "When a noon sakinah or tanween meets one of the letters ي ر م ل و ن (يرملون), it merges into the following letter — with ghunnah for four of them, without for ل and ر.",
    letters: "ي  ر  م  ل  و  ن",
    steps: [
      "Find the noon sakinah or tanween.",
      "Check for one of the يرملون letters.",
      "Merge the noon into the next letter; hum for ي ن م و.",
    ],
    examples: [
      { ref: "99:7", arabic: "فَمَن يَعْمَلْ", mark: "ن يَ", note: "Noon merges into ي — idgham with ghunnah." },
      { ref: "99:6", arabic: "أَشْتَاتًا لِّيُرَوْا", mark: "ً لِّ", note: "Tanween merges into ل — idgham without ghunnah." },
    ],
    quiz: {
      q: "The letters of idgham are collected in which word?",
      options: ["يرملون", "قطب جد", "خص ضغط قظ", "أهع ح غ خ"],
      answer: 0,
      explain: "يرملون gathers ي ر م ل و ن — the six idgham letters.",
    },
  },
  {
    id: "iqlab",
    title: "Iqlab",
    arabic: "الإقلاب",
    color: "bg-sun",
    tagline: "The turned noon",
    summary:
      "When a noon sakinah or tanween is followed by ب, the noon turns into a hidden meem (م) with a two-count ghunnah before the ب.",
    letters: "ب",
    steps: [
      "Find the noon sakinah or tanween before ب.",
      "Replace its sound with a light meem.",
      "Hum for two counts, then pronounce the ب.",
    ],
    examples: [
      { ref: "30:3", arabic: "مِّن بَعْدِ", mark: "ن بَ", note: "The noon of مِّن becomes a meem before ب." },
      { ref: "30:4", arabic: "وَمِن بَعْدُ", mark: "ن بَ", note: "Same turn: noon → hidden meem before ب." },
    ],
    quiz: {
      q: "In iqlab, the noon sakinah changes into the sound of…",
      options: ["و", "م", "ل", "ر"],
      answer: 1,
      explain: "Before ب, the noon is flipped into a concealed meem with ghunnah.",
    },
  },
  {
    id: "ghunnah",
    title: "Ghunnah",
    arabic: "الغنة",
    color: "bg-lav",
    tagline: "The nasal hum",
    summary:
      "Ghunnah is the natural nasal resonance carried by noon and meem. Its strongest form is the shaddah: نَّ and مَّ, held for two counts.",
    steps: [
      "Look for نَّ or مَّ (with shaddah).",
      "Let the sound resonate in the nose.",
      "Hold it for two counts — not more, not less.",
    ],
    examples: [
      { ref: "99:5", arabic: "بِأَنَّ رَبَّكَ", mark: "أَنَّ", note: "Shaddah noon — full two-count ghunnah." },
      { ref: "114:5", arabic: "النَّاسِ", mark: "النَّ", note: "The shaddah noon hums before the alif." },
    ],
    quiz: {
      q: "How long is the complete ghunnah of a shaddah noon held?",
      options: ["One count", "Two counts", "Four counts", "Six counts"],
      answer: 1,
      explain: "The standard complete ghunnah is two counts (harakatayn).",
    },
  },
  {
    id: "qalqalah",
    title: "Qalqalah",
    arabic: "القلقلة",
    color: "bg-blush",
    tagline: "The echoing bounce",
    summary:
      "The letters ق ط ب ج د, when sakin, echo with a light bouncing release. In the middle of a word it is lighter; at a stop it is stronger.",
    letters: "ق  ط  ب  ج  د",
    steps: [
      "Find a sakin ق ط ب ج د — in a word or at a stop.",
      "Release the letter with a soft audible echo.",
      "Keep it light — a bounce, not a new vowel.",
    ],
    examples: [
      { ref: "97:1", arabic: "لَيْلَةِ الْقَدْرِ", mark: "قَ", note: "Sakin ق mid-word — light qalqalah. (Word: الْقَدْرِ)" },
      { ref: "112:4", arabic: "كُفُوًا أَحَدٌ", mark: "أَحَدٌ", note: "Stopping here makes the final د bounce." },
    ],
    quiz: {
      q: "Which letters carry qalqalah when sakin?",
      options: ["قطب جد", "يرملون", "خص ضغط قظ", "ت ث ج د ذ"],
      answer: 0,
      explain: "قطب جد gathers the five qalqalah letters ق ط ب ج د.",
    },
  },
  {
    id: "madd",
    title: "Madd",
    arabic: "المد",
    color: "bg-sun",
    tagline: "The elongation",
    summary:
      "Madd stretches the three elongation letters — alif after fatha, waw after dammah, ya after kasrah. The natural madd (madd tabee'ee) is two counts.",
    letters: "ا   و   ي",
    steps: [
      "Spot ا after fatha, و after dammah, or ي after kasrah.",
      "Stretch the vowel for two counts.",
      "If a hamzah or sakin letter follows, the madd lengthens further.",
    ],
    examples: [
      { ref: "97:1", arabic: "فِي لَيْلَةِ", mark: "فِي", note: "Ya sakinah after kasrah — natural two-count madd." },
      { ref: "102:1", arabic: "أَلْهَاكُمُ", mark: "لْهَا", note: "Alif madd — stretch for two counts." },
    ],
    quiz: {
      q: "The natural madd (madd tabee'ee) is stretched for…",
      options: ["One count", "Two counts", "Four counts", "Six counts"],
      answer: 1,
      explain: "The baseline elongation of alif, waw and ya is two counts.",
    },
  },
  {
    id: "noon-sakinah",
    title: "Noon Sakinah",
    arabic: "النون الساكنة",
    color: "bg-lav",
    tagline: "The four fates of noon",
    summary:
      "A noon sakinah (نْ) has four possible outcomes depending on the letter after it: izhar (clear), ikhfa (hidden), idgham (merged) or iqlab (turned).",
    steps: [
      "Identify the noon sakinah in the word or between words.",
      "Look at the following letter.",
      "Apply izhar, ikhfa, idgham or iqlab accordingly.",
    ],
    examples: [
      { ref: "106:4", arabic: "مِّنْ خَوْفٍ", mark: "نْ خَ", note: "Izhar — throat letter خ." },
      { ref: "114:4", arabic: "مِن شَرِّ", mark: "ن شَ", note: "Ikhfa — the letter ش." },
      { ref: "99:7", arabic: "فَمَن يَعْمَلْ", mark: "ن يَ", note: "Idgham — the letter ي." },
      { ref: "30:3", arabic: "مِّن بَعْدِ", mark: "ن بَ", note: "Iqlab — the letter ب." },
    ],
    quiz: {
      q: "How many rulings can apply to a noon sakinah?",
      options: ["Two", "Three", "Four", "Six"],
      answer: 2,
      explain: "Izhar, ikhfa, idgham and iqlab — four rulings.",
    },
  },
  {
    id: "tanween",
    title: "Tanween",
    arabic: "التنوين",
    color: "bg-blush",
    tagline: "The doubled vowel",
    summary:
      "Tanween (ـً ـٍ ـٌ) behaves exactly like a noon sakinah: the same four rulings — izhar, ikhfa, idgham, iqlab — apply to the letter that follows.",
    steps: [
      "Find the tanween at the end of a word.",
      "Treat it as a hidden noon sakinah.",
      "Apply the ruling of the following letter.",
    ],
    examples: [
      { ref: "95:6", arabic: "أَجْرٌ غَيْرُ", mark: "رٌ غَ", note: "Tanween before غ — izhar." },
      { ref: "99:7", arabic: "ذَرَّةٍ خَيْرًا", mark: "ٍ خَ", note: "Tanween before خ — clear izhar." },
    ],
    quiz: {
      q: "Tanween is treated in tajweed as…",
      options: ["A hidden meem", "A noon sakinah", "A madd letter", "A qalqalah letter"],
      answer: 1,
      explain: "Tanween carries the same rulings as noon sakinah.",
    },
  },
  {
    id: "meem-sakinah",
    title: "Meem Sakinah",
    arabic: "الميم الساكنة",
    color: "bg-sun",
    tagline: "The three fates of meem",
    summary:
      "A sakin meem (مْ) has three rulings: ikhfa shafawi before ب, idgham shafawi before another م, and izhar shafawi before every other letter.",
    steps: [
      "Find the sakin meem.",
      "Before ب → hide it with ghunnah (ikhfa shafawi).",
      "Before م → merge; otherwise → pronounce clearly.",
    ],
    examples: [
      { ref: "105:1", arabic: "أَلَمْ تَرَ", mark: "مْ تَ", note: "Izhar shafawi — meem is clear before ت." },
      { ref: "30:2", arabic: "وَهُم مِّن", mark: "مْ مِّ", note: "Idgham shafawi — meem merges into meem." },
    ],
    quiz: {
      q: "Before which letter does a sakin meem become ikhfa shafawi?",
      options: ["ت", "م", "ب", "ن"],
      answer: 2,
      explain: "Only before ب — the lips conceal the meem with a hum.",
    },
  },
];
