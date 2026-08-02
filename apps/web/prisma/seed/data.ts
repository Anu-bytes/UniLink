// Catalogue seed data: real Egyptian universities with their faculties and
// programs. Figures (tuition, minimum scores) are representative published
// values and are meant to be replaced from the admin dashboard.
//
// Every record is keyed by a stable slug so the seed can be re-run safely.

import type {
  ContentSection,
  EnglishTest,
  HighSchoolSystem,
  ProgramTag,
  StudyLevel,
  UniversityType,
} from "@prisma/client";

export type ProgramSeed = {
  /** Value from src/lib/fields.ts FIELDS_OF_STUDY. */
  field: string;
  name: string;
  nameAr: string;
  level?: StudyLevel;
  /** Nominal length in years; converted to durationMonths. */
  years?: number;
  durationLabel?: string;
  durationLabelAr?: string;
  /** Tuition in EGP for one academic year. */
  tuition: number;
  /** Minimum secondary-certificate percentage. */
  minGrade?: number;
  tags?: ProgramTag[];
  coop?: boolean;
  /** Application fee in EGP; omit for a waived fee. */
  applicationFee?: number;
  english?: Partial<Record<EnglishTest, number>>;
};

export type FacultySeed = {
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  programs: ProgramSeed[];
};

export type ContentBlockSeed = {
  section: ContentSection;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
};

export type FeatureSeed = {
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
};

export type UniversitySeed = {
  slug: string;
  name: string;
  nameAr: string;
  type: UniversityType;
  city: string;
  cityAr: string;
  establishedYear: number;
  addressLine: string;
  addressLineAr: string;
  phone: string;
  email: string;
  websiteUrl: string;
  description: string;
  descriptionAr: string;
  aboutRich: string;
  aboutRichAr: string;
  latitude: number;
  longitude: number;
  isFeatured?: boolean;
  isRecommended?: boolean;
  isTrending?: boolean;
  viewCount: number;
  images: string[];
  features?: FeatureSeed[];
  contentBlocks?: ContentBlockSeed[];
  /** Certificate cut-offs, university-wide. Percentages unless noted. */
  minimumScores: Partial<Record<HighSchoolSystem, number>>;
  faculties: FacultySeed[];
};

// ---------------------------------------------------------------------------
// Shared imagery. Direct Unsplash file URLs (campus, lecture halls, labs) so
// the gallery has real photographs before any are uploaded from the dashboard.
// ---------------------------------------------------------------------------

const PHOTO = {
  campusLawn:
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=70",
  lectureHall:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=70",
  library:
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=70",
  lab: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=70",
  studioClass:
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=70",
  graduation:
    "https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=1200&q=70",
  modernBuilding:
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=70",
  computerLab:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=70",
} as const;

const GALLERY_A = [
  PHOTO.campusLawn,
  PHOTO.lectureHall,
  PHOTO.library,
  PHOTO.graduation,
  PHOTO.lab,
];
const GALLERY_B = [
  PHOTO.modernBuilding,
  PHOTO.computerLab,
  PHOTO.studioClass,
  PHOTO.lectureHall,
  PHOTO.library,
];

// ---------------------------------------------------------------------------
// Reusable content blocks. Admission rules differ mainly by sector, so public
// and private universities each get a template that individual entries can
// override by supplying their own `contentBlocks`.
// ---------------------------------------------------------------------------

export function publicSectorBlocks(name: string, nameAr: string): ContentBlockSeed[] {
  return [
    {
      section: "ADMISSION_REQUIREMENTS",
      title: "Documents required for enrolment",
      titleAr: "المستندات المطلوبة للالتحاق",
      body: [
        "Original secondary school certificate (Thanaweya Amma) or an accredited equivalent.",
        "Birth certificate (computerised copy) and a copy of the national ID card.",
        "Six recent passport photographs.",
        "Military service form (form 2 gond) for male applicants.",
        "Medical fitness certificate issued by the university clinic.",
        "The coordination office (Tansik) placement slip for the current academic year.",
      ].join("\n"),
      bodyAr: [
        "شهادة الثانوية العامة الأصلية أو ما يعادلها من الشهادات المعتمدة.",
        "شهادة الميلاد (نسخة مميكنة) وصورة من بطاقة الرقم القومي.",
        "ست صور شخصية حديثة.",
        "نموذج التجنيد (٢ جند) للطلاب الذكور.",
        "شهادة اللياقة الطبية الصادرة من العيادة الطبية بالجامعة.",
        "إشعار الترشيح من مكتب التنسيق للعام الدراسي الحالي.",
      ].join("\n"),
    },
    {
      section: "ADMISSION_CRITERIA",
      title: `How ${name} admits students`,
      titleAr: `كيف تقبل ${nameAr} الطلاب`,
      body: [
        "Admission runs through the national coordination office (Tansik), which places students by total secondary score.",
        "Each faculty publishes its own cut-off after every coordination round; the score below is the most recent published minimum.",
        "Holders of equivalent certificates (IGCSE, American Diploma, IB) apply through the equivalence committee and are ranked on their converted percentage.",
        "A limited number of seats are reserved for students transferring from other Egyptian universities, subject to credit equivalency.",
      ].join("\n"),
      bodyAr: [
        "يتم القبول من خلال مكتب التنسيق الإلكتروني الذي يوزع الطلاب وفقاً للمجموع الكلي للثانوية العامة.",
        "تعلن كل كلية الحد الأدنى الخاص بها بعد كل مرحلة من مراحل التنسيق، والدرجات الموضحة أدناه هي آخر حد أدنى معلن.",
        "يتقدم حاملو الشهادات المعادلة (IGCSE والدبلومة الأمريكية والبكالوريا الدولية) عن طريق لجنة المعادلات ويتم ترتيبهم وفق النسبة المحولة.",
        "يخصص عدد محدود من المقاعد للطلاب المحولين من الجامعات المصرية الأخرى بشرط معادلة المقررات.",
      ].join("\n"),
    },
    {
      section: "TUITION_NOTES",
      title: "About these fees",
      titleAr: "ملاحظات حول المصروفات",
      body: "Fees shown are the annual figure for Egyptian students on the regular programme. Credit-hour and international programmes are charged separately, and a one-off registration fee applies in the first year.",
      bodyAr:
        "المصروفات الموضحة هي القيمة السنوية للطلاب المصريين بالبرنامج العادي. تُحسب برامج الساعات المعتمدة والبرامج الدولية بشكل منفصل، وتُضاف رسوم قيد تُدفع مرة واحدة في العام الأول.",
    },
  ];
}

export function privateSectorBlocks(name: string, nameAr: string): ContentBlockSeed[] {
  return [
    {
      section: "ADMISSION_REQUIREMENTS",
      title: "Documents required for enrolment",
      titleAr: "المستندات المطلوبة للالتحاق",
      body: [
        "Original secondary certificate, or an accredited equivalent certified by the Ministry of Education.",
        "Certificate equivalence letter for non-Egyptian certificates.",
        "Birth certificate (computerised copy) and a copy of the national ID or passport.",
        "Six recent passport photographs.",
        "Military service form (form 2 gond) for male applicants.",
        "Proof of English proficiency, or a pass in the university placement test.",
      ].join("\n"),
      bodyAr: [
        "شهادة الثانوية الأصلية أو ما يعادلها معتمدة من وزارة التربية والتعليم.",
        "خطاب معادلة الشهادة لغير الشهادات المصرية.",
        "شهادة الميلاد (نسخة مميكنة) وصورة من بطاقة الرقم القومي أو جواز السفر.",
        "ست صور شخصية حديثة.",
        "نموذج التجنيد (٢ جند) للطلاب الذكور.",
        "ما يثبت إجادة اللغة الإنجليزية أو اجتياز اختبار تحديد المستوى بالجامعة.",
      ].join("\n"),
    },
    {
      section: "ADMISSION_CRITERIA",
      title: `How ${name} admits students`,
      titleAr: `كيف تقبل ${nameAr} الطلاب`,
      body: [
        "Applications are made directly to the university admissions office; there is no coordination office placement.",
        "Each programme sets a minimum secondary percentage, listed on the Minimum Scores tab.",
        "Shortlisted applicants sit an English placement test, and design and engineering programmes add an aptitude interview or portfolio review.",
        "Seats are confirmed once the first tuition instalment is paid; applications outside the published window are reviewed case by case.",
      ].join("\n"),
      bodyAr: [
        "يتم التقديم مباشرة إلى إدارة القبول بالجامعة دون المرور بمكتب التنسيق.",
        "يحدد كل برنامج حداً أدنى للنسبة المئوية بالثانوية، وهو موضح في تبويب الحد الأدنى للدرجات.",
        "يؤدي المرشحون اختبار تحديد مستوى في اللغة الإنجليزية، وتضيف برامج التصميم والهندسة مقابلة قدرات أو مراجعة ملف أعمال.",
        "يتم تأكيد المقعد بعد سداد القسط الأول من المصروفات، وتُدرس الطلبات خارج فترة التقديم المعلنة كل حالة على حدة.",
      ].join("\n"),
    },
    {
      section: "TUITION_NOTES",
      title: "About these fees",
      titleAr: "ملاحظات حول المصروفات",
      body: "Fees shown are per academic year for Egyptian students and are usually payable in two instalments. Books, transport and lab charges are billed separately, and international students pay a different scale.",
      bodyAr:
        "المصروفات الموضحة سنوية للطلاب المصريين وتُسدد عادة على قسطين. تُحسب الكتب والانتقالات ورسوم المعامل بشكل منفصل، ويطبق على الطلاب الوافدين جدول مصروفات مختلف.",
    },
  ];
}

function commonFeatures(kind: "public" | "private" | "specialized"): FeatureSeed[] {
  const shared: FeatureSeed[] = [
    {
      title: "Accredited programmes",
      titleAr: "برامج معتمدة",
      body: "All undergraduate programmes are accredited by the Supreme Council of Universities, so degrees are recognised for postgraduate study and public-sector employment.",
      bodyAr:
        "جميع برامج البكالوريوس معتمدة من المجلس الأعلى للجامعات، وبالتالي فإن الشهادات معترف بها للدراسات العليا والتوظيف في القطاع الحكومي.",
    },
    {
      title: "Student support services",
      titleAr: "خدمات دعم الطلاب",
      body: "Academic advising, career counselling and a dedicated alumni network help students plan their studies and their first job.",
      bodyAr:
        "الإرشاد الأكاديمي والتوجيه المهني وشبكة خريجين متخصصة تساعد الطلاب على تخطيط دراستهم وأول وظيفة لهم.",
    },
  ];

  if (kind === "public") {
    return [
      {
        title: "Long-established reputation",
        titleAr: "سمعة عريقة",
        body: "Decades of graduates across medicine, engineering, law and the humanities give the university one of the widest professional networks in Egypt.",
        bodyAr:
          "عقود من الخريجين في الطب والهندسة والحقوق والعلوم الإنسانية تمنح الجامعة واحدة من أوسع الشبكات المهنية في مصر.",
      },
      {
        title: "Affordable tuition",
        titleAr: "مصروفات في المتناول",
        body: "Regular programmes are state-subsidised, with credit-hour tracks available for students who want an English-taught option.",
        bodyAr:
          "البرامج العادية مدعومة من الدولة، مع توافر برامج الساعات المعتمدة لمن يرغب في الدراسة باللغة الإنجليزية.",
      },
      ...shared,
    ];
  }

  if (kind === "specialized") {
    return [
      {
        title: "Focused on applied technology",
        titleAr: "التركيز على التكنولوجيا التطبيقية",
        body: "A narrow portfolio of programmes built around computing, engineering and applied sciences, with industry partners involved in curriculum design.",
        bodyAr:
          "مجموعة محددة من البرامج تدور حول الحوسبة والهندسة والعلوم التطبيقية، بمشاركة شركاء من الصناعة في تصميم المناهج.",
      },
      {
        title: "Research-led teaching",
        titleAr: "تعليم قائم على البحث",
        body: "Undergraduates join funded research groups from the third year, and final-year projects are frequently sponsored by industry.",
        bodyAr:
          "ينضم طلاب البكالوريوس إلى مجموعات بحثية ممولة اعتباراً من السنة الثالثة، وغالباً ما تكون مشروعات التخرج برعاية شركات.",
      },
      ...shared,
    ];
  }

  return [
    {
      title: "Modern infrastructure",
      titleAr: "بنية تحتية حديثة",
      body: "Purpose-built campus with equipped laboratories, design studios, simulation suites and a digital library.",
      bodyAr:
        "حرم جامعي مصمم خصيصاً يضم معامل مجهزة واستوديوهات تصميم وقاعات محاكاة ومكتبة رقمية.",
    },
    {
      title: "International partnerships",
      titleAr: "شراكات دولية",
      body: "Credit-transfer and dual-degree agreements with European and North American universities open exchange terms abroad.",
      bodyAr:
        "اتفاقيات تحويل ساعات ودرجات مزدوجة مع جامعات أوروبية وأمريكية تتيح فصولاً دراسية بالخارج.",
    },
    ...shared,
  ];
}

// ---------------------------------------------------------------------------
// Program shorthands, so each faculty entry stays readable.
// ---------------------------------------------------------------------------

const HIGH_DEMAND: ProgramTag[] = ["HIGH_JOB_DEMAND"];
const HIGH_DEMAND_SCHOLARSHIP: ProgramTag[] = [
  "HIGH_JOB_DEMAND",
  "SCHOLARSHIPS_AVAILABLE",
];
const CREDIT_HOURS_FAST: ProgramTag[] = ["CREDIT_HOURS", "FAST_ACCEPTANCE"];

const IELTS_55 = { IELTS: 5.5, TOEFL: 61, PTE: 44, DUOLINGO: 90 } as const;
const IELTS_60 = { IELTS: 6, TOEFL: 79, PTE: 50, DUOLINGO: 100 } as const;

// ---------------------------------------------------------------------------
// The universities.
// ---------------------------------------------------------------------------

export const UNIVERSITIES: UniversitySeed[] = [
  {
    slug: "cairo-university",
    name: "Cairo University",
    nameAr: "جامعة القاهرة",
    type: "PUBLIC",
    city: "Giza",
    cityAr: "الجيزة",
    establishedYear: 1908,
    addressLine: "Gamaa Street, Giza",
    addressLineAr: "شارع الجامعة، الجيزة",
    phone: "0235676105",
    email: "info@cu.edu.eg",
    websiteUrl: "https://cu.edu.eg",
    description:
      "Egypt's flagship public university, teaching across twenty-six faculties from medicine and engineering to law, economics and the arts.",
    descriptionAr:
      "الجامعة الحكومية الأعرق في مصر، وتضم ست وعشرين كلية تغطي الطب والهندسة والحقوق والاقتصاد والآداب.",
    aboutRich:
      "Founded in 1908 as the Egyptian University, Cairo University is the country's oldest secular institution of higher education and remains its largest by enrolment. Its Giza campus houses twenty-six faculties and institutes, teaching more than two hundred thousand students, and its graduates include heads of state, Nobel laureates and much of Egypt's professional class.\n\nThe university combines a traditional Arabic-taught regular track with a growing set of English-taught credit-hour programmes in medicine, engineering, computing and business, giving applicants a choice between the subsidised route and an international-style curriculum.",
    aboutRichAr:
      "تأسست جامعة القاهرة عام ١٩٠٨ باسم الجامعة المصرية، وهي أقدم مؤسسة تعليم عالٍ مدنية في البلاد وأكبرها من حيث عدد الطلاب. يضم حرمها بالجيزة ست وعشرين كلية ومعهداً يدرس بها أكثر من مائتي ألف طالب، ومن خريجيها رؤساء دول وحاصلون على جائزة نوبل وقطاع كبير من المهنيين في مصر.\n\nتجمع الجامعة بين البرنامج العادي الذي يُدرَّس بالعربية ومجموعة متنامية من برامج الساعات المعتمدة التي تُدرَّس بالإنجليزية في الطب والهندسة والحوسبة وإدارة الأعمال، مما يمنح المتقدمين الاختيار بين المسار المدعوم ومنهج على النمط الدولي.",
    latitude: 30.0264,
    longitude: 31.2093,
    isFeatured: true,
    isRecommended: true,
    isTrending: true,
    viewCount: 48200,
    images: GALLERY_A,
    minimumScores: {
      THANAWEYA_AMMA: 92,
      IGCSE: 88,
      AMERICAN_DIPLOMA: 85,
      STEM: 90,
      AL_AZHAR: 90,
      ARAB_CERTIFICATE: 88,
    },
    faculties: [
      {
        slug: "medicine",
        name: "Faculty of Medicine (Kasr Al Ainy)",
        nameAr: "كلية الطب (قصر العيني)",
        description:
          "Egypt's oldest medical school, teaching in the Kasr Al Ainy teaching hospitals.",
        descriptionAr:
          "أقدم كلية طب في مصر، وتتخذ من مستشفيات قصر العيني التعليمية مقراً للتدريب.",
        programs: [
          {
            field: "medicine",
            name: "Bachelor of Medicine and Surgery (MBBCh)",
            nameAr: "بكالوريوس الطب والجراحة",
            years: 6,
            durationLabel: "5 years of study followed by a 2-year clinical internship",
            durationLabelAr: "٥ سنوات دراسة يليها عامان امتياز إكلينيكي",
            tuition: 12000,
            minGrade: 97,
            tags: HIGH_DEMAND,
          },
          {
            field: "medicine",
            name: "Bachelor of Medicine and Surgery (Credit Hours)",
            nameAr: "بكالوريوس الطب والجراحة (ساعات معتمدة)",
            years: 6,
            tuition: 145000,
            minGrade: 95,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
          },
        ],
      },
      {
        slug: "engineering",
        name: "Faculty of Engineering",
        nameAr: "كلية الهندسة",
        description:
          "Nine engineering departments with dedicated laboratories and a credit-hour English track.",
        descriptionAr:
          "تسعة أقسام هندسية بمعامل متخصصة إلى جانب برنامج ساعات معتمدة يُدرَّس بالإنجليزية.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Civil Engineering",
            nameAr: "بكالوريوس الهندسة المدنية",
            years: 5,
            tuition: 9500,
            minGrade: 94,
            tags: HIGH_DEMAND,
          },
          {
            field: "engineering",
            name: "Bachelor of Electrical Power Engineering",
            nameAr: "بكالوريوس هندسة القوى الكهربية",
            years: 5,
            tuition: 9500,
            minGrade: 94,
          },
          {
            field: "computer_science",
            name: "Bachelor of Computer Engineering",
            nameAr: "بكالوريوس هندسة الحاسبات",
            years: 5,
            tuition: 9500,
            minGrade: 96,
            tags: HIGH_DEMAND,
          },
          {
            field: "engineering",
            name: "Bachelor of Engineering (Credit Hours, CUFE)",
            nameAr: "بكالوريوس الهندسة (ساعات معتمدة)",
            years: 5,
            tuition: 98000,
            minGrade: 90,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
          },
        ],
      },
      {
        slug: "computers-artificial-intelligence",
        name: "Faculty of Computers and Artificial Intelligence",
        nameAr: "كلية الحاسبات والذكاء الاصطناعي",
        description:
          "Computing, data science and AI degrees with a strong graduate-employment record.",
        descriptionAr:
          "برامج الحوسبة وعلم البيانات والذكاء الاصطناعي مع معدلات توظيف مرتفعة للخريجين.",
        programs: [
          {
            field: "computer_science",
            name: "Bachelor of Computer Science",
            nameAr: "بكالوريوس علوم الحاسب",
            tuition: 8500,
            minGrade: 93,
            tags: HIGH_DEMAND,
          },
          {
            field: "artificial_intelligence",
            name: "Bachelor of Artificial Intelligence",
            nameAr: "بكالوريوس الذكاء الاصطناعي",
            tuition: 8500,
            minGrade: 94,
            tags: HIGH_DEMAND_SCHOLARSHIP,
          },
          {
            field: "information_technology",
            name: "Bachelor of Information Systems",
            nameAr: "بكالوريوس نظم المعلومات",
            tuition: 8500,
            minGrade: 91,
          },
        ],
      },
      {
        slug: "economics-political-science",
        name: "Faculty of Economics and Political Science",
        nameAr: "كلية الاقتصاد والعلوم السياسية",
        description:
          "Economics, political science and statistics, taught in both Arabic and English sections.",
        descriptionAr:
          "الاقتصاد والعلوم السياسية والإحصاء، وتُدرَّس بالشعبتين العربية والإنجليزية.",
        programs: [
          {
            field: "economics_political_science",
            name: "Bachelor of Economics",
            nameAr: "بكالوريوس الاقتصاد",
            tuition: 7500,
            minGrade: 92,
          },
          {
            field: "economics_political_science",
            name: "Bachelor of Political Science",
            nameAr: "بكالوريوس العلوم السياسية",
            tuition: 7500,
            minGrade: 91,
          },
        ],
      },
      {
        slug: "law",
        name: "Faculty of Law",
        nameAr: "كلية الحقوق",
        description:
          "The country's largest law school, with Arabic, English and French sections.",
        descriptionAr:
          "أكبر كلية حقوق في البلاد، وتضم شعباً عربية وإنجليزية وفرنسية.",
        programs: [
          {
            field: "law",
            name: "Bachelor of Law",
            nameAr: "ليسانس الحقوق",
            tuition: 6500,
            minGrade: 78,
          },
        ],
      },
      {
        slug: "pharmacy",
        name: "Faculty of Pharmacy",
        nameAr: "كلية الصيدلة",
        description:
          "Clinical and industrial pharmacy with teaching laboratories and hospital placements.",
        descriptionAr:
          "الصيدلة الإكلينيكية والصناعية مع معامل تدريس وتدريب بالمستشفيات.",
        programs: [
          {
            field: "pharmacy",
            name: "Doctor of Pharmacy (PharmD)",
            nameAr: "دكتور صيدلة",
            years: 6,
            tuition: 11000,
            minGrade: 95,
            tags: HIGH_DEMAND,
          },
        ],
      },
    ],
  },

  {
    slug: "ain-shams-university",
    name: "Ain Shams University",
    nameAr: "جامعة عين شمس",
    type: "PUBLIC",
    city: "Cairo",
    cityAr: "القاهرة",
    establishedYear: 1950,
    addressLine: "Khalifa El-Maamon Street, Abbassia, Cairo",
    addressLineAr: "شارع خليفة المأمون، العباسية، القاهرة",
    phone: "0226831474",
    email: "info@asu.edu.eg",
    websiteUrl: "https://www.asu.edu.eg",
    description:
      "A large public university in eastern Cairo, known for its medical, engineering and language faculties.",
    descriptionAr:
      "جامعة حكومية كبيرة في شرق القاهرة، تشتهر بكليات الطب والهندسة والألسن.",
    aboutRich:
      "Ain Shams University opened in 1950 as Egypt's third state university and now teaches around one hundred and eighty thousand students across fifteen faculties in the Abbassia district of Cairo.\n\nIt is best known for the Faculty of Medicine and its associated hospitals, the Faculty of Engineering, and Al-Alsun, the country's leading school of languages and translation. English-taught credit-hour programmes run alongside the regular track in engineering, computing and business.",
    aboutRichAr:
      "افتُتحت جامعة عين شمس عام ١٩٥٠ لتكون ثالث جامعة حكومية في مصر، ويدرس بها اليوم نحو مائة وثمانين ألف طالب في خمس عشرة كلية بحي العباسية بالقاهرة.\n\nتشتهر الجامعة بكلية الطب ومستشفياتها وكلية الهندسة وكلية الألسن، وهي أبرز كلية للغات والترجمة في البلاد. وتعمل برامج الساعات المعتمدة التي تُدرَّس بالإنجليزية جنباً إلى جنب مع البرنامج العادي في الهندسة والحوسبة وإدارة الأعمال.",
    latitude: 30.0771,
    longitude: 31.2836,
    isFeatured: true,
    isRecommended: true,
    viewCount: 31400,
    images: GALLERY_B,
    minimumScores: {
      THANAWEYA_AMMA: 90,
      IGCSE: 86,
      AMERICAN_DIPLOMA: 83,
      STEM: 88,
      AL_AZHAR: 88,
      ARAB_CERTIFICATE: 86,
    },
    faculties: [
      {
        slug: "medicine",
        name: "Faculty of Medicine",
        nameAr: "كلية الطب",
        description:
          "Teaching hospitals in Abbassia and Demerdash provide clinical training from the third year.",
        descriptionAr:
          "مستشفيات العباسية والدمرداش التعليمية توفر التدريب الإكلينيكي اعتباراً من السنة الثالثة.",
        programs: [
          {
            field: "medicine",
            name: "Bachelor of Medicine and Surgery (MBBCh)",
            nameAr: "بكالوريوس الطب والجراحة",
            years: 6,
            tuition: 11500,
            minGrade: 96.5,
            tags: HIGH_DEMAND,
          },
        ],
      },
      {
        slug: "engineering",
        name: "Faculty of Engineering",
        nameAr: "كلية الهندسة",
        description:
          "Mechanical, electrical, civil and computer engineering, plus the English-taught ASUEEP track.",
        descriptionAr:
          "الهندسة الميكانيكية والكهربية والمدنية وهندسة الحاسبات، إضافة إلى برنامج ASUEEP الذي يُدرَّس بالإنجليزية.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Mechanical Engineering",
            nameAr: "بكالوريوس الهندسة الميكانيكية",
            years: 5,
            tuition: 9000,
            minGrade: 93,
          },
          {
            field: "computer_science",
            name: "Bachelor of Computer and Systems Engineering",
            nameAr: "بكالوريوس هندسة الحاسبات والنظم",
            years: 5,
            tuition: 9000,
            minGrade: 95,
            tags: HIGH_DEMAND,
          },
          {
            field: "engineering",
            name: "Bachelor of Engineering (ASUEEP, Credit Hours)",
            nameAr: "بكالوريوس الهندسة (البرنامج الإنجليزي، ساعات معتمدة)",
            years: 5,
            tuition: 92000,
            minGrade: 88,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
          },
        ],
      },
      {
        slug: "al-alsun",
        name: "Faculty of Al-Alsun (Languages)",
        nameAr: "كلية الألسن",
        description:
          "Fifteen language departments and Egypt's best-known translation programme.",
        descriptionAr: "خمسة عشر قسماً للغات وأشهر برنامج ترجمة في مصر.",
        programs: [
          {
            field: "languages_translation",
            name: "Bachelor of Languages and Translation",
            nameAr: "ليسانس الألسن والترجمة",
            tuition: 7000,
            minGrade: 88,
            tags: HIGH_DEMAND,
          },
        ],
      },
      {
        slug: "computer-information-sciences",
        name: "Faculty of Computer and Information Sciences",
        nameAr: "كلية الحاسبات والمعلومات",
        description:
          "Software engineering, information systems and scientific computing.",
        descriptionAr: "هندسة البرمجيات ونظم المعلومات والحوسبة العلمية.",
        programs: [
          {
            field: "computer_science",
            name: "Bachelor of Computer Science",
            nameAr: "بكالوريوس علوم الحاسب",
            tuition: 8000,
            minGrade: 92,
            tags: HIGH_DEMAND,
          },
          {
            field: "data_science",
            name: "Bachelor of Scientific Computing",
            nameAr: "بكالوريوس الحاسبات العلمية",
            tuition: 8000,
            minGrade: 91,
          },
        ],
      },
      {
        slug: "business",
        name: "Faculty of Business",
        nameAr: "كلية التجارة",
        description:
          "Accounting, business administration and an English-taught business section.",
        descriptionAr: "المحاسبة وإدارة الأعمال وشعبة تجارة إنجليزي.",
        programs: [
          {
            field: "business_administration",
            name: "Bachelor of Business Administration",
            nameAr: "بكالوريوس إدارة الأعمال",
            tuition: 6500,
            minGrade: 80,
          },
          {
            field: "accounting",
            name: "Bachelor of Accounting",
            nameAr: "بكالوريوس المحاسبة",
            tuition: 6500,
            minGrade: 80,
          },
        ],
      },
    ],
  },

  {
    slug: "alexandria-university",
    name: "Alexandria University",
    nameAr: "جامعة الإسكندرية",
    type: "PUBLIC",
    city: "Alexandria",
    cityAr: "الإسكندرية",
    establishedYear: 1938,
    addressLine: "22 El-Guish Road, Chatby, Alexandria",
    addressLineAr: "٢٢ طريق الجيش، الشاطبي، الإسكندرية",
    phone: "034295007",
    email: "info@alexu.edu.eg",
    websiteUrl: "https://alexu.edu.eg",
    description:
      "The Mediterranean coast's largest university, strong in medicine, engineering and maritime-related sciences.",
    descriptionAr:
      "أكبر جامعة على ساحل البحر المتوسط، ولها ثقل في الطب والهندسة والعلوم المرتبطة بالبحار.",
    aboutRich:
      "Alexandria University began in 1938 as a branch of Fouad I University and became independent in 1942. Its faculties are spread across the Chatby and Smouha districts and teach around one hundred and eighty thousand students.\n\nThe university has particular strength in medicine, pharmacy, engineering and agriculture, and its Faculty of Fine Arts is one of only a handful in Egypt. A branch campus in Juba, South Sudan, extends its regional reach.",
    aboutRichAr:
      "بدأت جامعة الإسكندرية عام ١٩٣٨ كفرع لجامعة فؤاد الأول ثم استقلت عام ١٩٤٢. تتوزع كلياتها بين حيي الشاطبي وسموحة ويدرس بها نحو مائة وثمانين ألف طالب.\n\nتتميز الجامعة في الطب والصيدلة والهندسة والزراعة، وكلية الفنون الجميلة بها واحدة من كليات قليلة في مصر. كما يمتد حضورها الإقليمي عبر فرع في جوبا بجنوب السودان.",
    latitude: 31.2085,
    longitude: 29.9187,
    isFeatured: true,
    viewCount: 22900,
    images: GALLERY_A,
    minimumScores: {
      THANAWEYA_AMMA: 89,
      IGCSE: 85,
      AMERICAN_DIPLOMA: 82,
      STEM: 87,
      AL_AZHAR: 87,
      ARAB_CERTIFICATE: 85,
    },
    faculties: [
      {
        slug: "medicine",
        name: "Faculty of Medicine",
        nameAr: "كلية الطب",
        description: "Clinical teaching at the Alexandria Main University Hospital.",
        descriptionAr: "التدريب الإكلينيكي بمستشفى الإسكندرية الجامعي الرئيسي.",
        programs: [
          {
            field: "medicine",
            name: "Bachelor of Medicine and Surgery (MBBCh)",
            nameAr: "بكالوريوس الطب والجراحة",
            years: 6,
            tuition: 11000,
            minGrade: 96,
            tags: HIGH_DEMAND,
          },
          {
            field: "dentistry",
            name: "Bachelor of Dental Surgery",
            nameAr: "بكالوريوس طب وجراحة الفم والأسنان",
            years: 5,
            tuition: 10500,
            minGrade: 95,
            tags: HIGH_DEMAND,
          },
        ],
      },
      {
        slug: "engineering",
        name: "Faculty of Engineering",
        nameAr: "كلية الهندسة",
        description:
          "Twelve departments including naval architecture and marine engineering.",
        descriptionAr:
          "اثنا عشر قسماً من بينها العمارة البحرية والهندسة البحرية.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Naval Architecture and Marine Engineering",
            nameAr: "بكالوريوس العمارة البحرية والهندسة البحرية",
            years: 5,
            tuition: 9000,
            minGrade: 92,
            tags: HIGH_DEMAND_SCHOLARSHIP,
          },
          {
            field: "engineering",
            name: "Bachelor of Chemical Engineering",
            nameAr: "بكالوريوس الهندسة الكيميائية",
            years: 5,
            tuition: 9000,
            minGrade: 93,
          },
        ],
      },
      {
        slug: "fine-arts",
        name: "Faculty of Fine Arts",
        nameAr: "كلية الفنون الجميلة",
        description:
          "Painting, sculpture, graphic design and architecture, admitting by portfolio.",
        descriptionAr:
          "التصوير والنحت والجرافيك والعمارة، والقبول بها عن طريق اختبار قدرات.",
        programs: [
          {
            field: "fine_arts",
            name: "Bachelor of Fine Arts",
            nameAr: "بكالوريوس الفنون الجميلة",
            years: 5,
            tuition: 8000,
            minGrade: 75,
          },
          {
            field: "architecture",
            name: "Bachelor of Architecture (Fine Arts)",
            nameAr: "بكالوريوس العمارة (فنون جميلة)",
            years: 5,
            tuition: 8500,
            minGrade: 85,
          },
        ],
      },
      {
        slug: "pharmacy",
        name: "Faculty of Pharmacy",
        nameAr: "كلية الصيدلة",
        description: "PharmD track with hospital and industry placements.",
        descriptionAr: "برنامج دكتور صيدلة مع تدريب بالمستشفيات والصناعة.",
        programs: [
          {
            field: "pharmacy",
            name: "Doctor of Pharmacy (PharmD)",
            nameAr: "دكتور صيدلة",
            years: 6,
            tuition: 10500,
            minGrade: 94,
            tags: HIGH_DEMAND,
          },
        ],
      },
    ],
  },

  {
    slug: "american-university-in-cairo",
    name: "The American University in Cairo",
    nameAr: "الجامعة الأمريكية بالقاهرة",
    type: "PRIVATE",
    city: "New Cairo",
    cityAr: "القاهرة الجديدة",
    establishedYear: 1919,
    addressLine: "AUC Avenue, New Cairo",
    addressLineAr: "شارع الجامعة الأمريكية، القاهرة الجديدة",
    phone: "0226152000",
    email: "admissions@aucegypt.edu",
    websiteUrl: "https://www.aucegypt.edu",
    description:
      "An American-accredited liberal arts university in New Cairo, teaching entirely in English.",
    descriptionAr:
      "جامعة معتمدة أمريكياً بنظام الفنون الحرة في القاهرة الجديدة، وتُدرَّس بالكامل بالإنجليزية.",
    aboutRich:
      "The American University in Cairo was founded in 1919 and is accredited in both Egypt and the United States. Its four-hundred-acre New Cairo campus opened in 2008 and houses five schools covering business, engineering, sciences, humanities and global affairs.\n\nTeaching follows a US liberal arts model: students complete a core curriculum before declaring a major, courses are credit-hour based, and English is the language of instruction throughout. AUC awards need-based financial aid and merit scholarships to a substantial share of its Egyptian undergraduates.",
    aboutRichAr:
      "تأسست الجامعة الأمريكية بالقاهرة عام ١٩١٩ وهي معتمدة في مصر والولايات المتحدة معاً. افتُتح حرمها بالقاهرة الجديدة عام ٢٠٠٨ على مساحة أربعمائة فدان ويضم خمس كليات تغطي إدارة الأعمال والهندسة والعلوم والعلوم الإنسانية والشؤون الدولية.\n\nيتبع التدريس النموذج الأمريكي للفنون الحرة: يدرس الطالب متطلبات أساسية قبل تحديد تخصصه، والمقررات بنظام الساعات المعتمدة، ولغة الدراسة الإنجليزية بالكامل. وتمنح الجامعة مساعدات مالية ومنحاً تفوقية لنسبة كبيرة من طلابها المصريين.",
    latitude: 30.0194,
    longitude: 31.5,
    isFeatured: true,
    isRecommended: true,
    isTrending: true,
    viewCount: 63700,
    images: GALLERY_B,
    minimumScores: {
      THANAWEYA_AMMA: 85,
      IGCSE: 80,
      AMERICAN_DIPLOMA: 78,
      STEM: 85,
      ARAB_CERTIFICATE: 82,
    },
    faculties: [
      {
        slug: "school-of-sciences-and-engineering",
        name: "School of Sciences and Engineering",
        nameAr: "كلية العلوم والهندسة",
        description:
          "ABET-accredited engineering and computing degrees on a credit-hour system.",
        descriptionAr:
          "برامج هندسية وحاسوبية معتمدة من ABET بنظام الساعات المعتمدة.",
        programs: [
          {
            field: "computer_science",
            name: "Bachelor of Science in Computer Science",
            nameAr: "بكالوريوس علوم الحاسب",
            tuition: 480000,
            minGrade: 85,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            coop: true,
            english: IELTS_60,
            applicationFee: 1500,
          },
          {
            field: "engineering",
            name: "Bachelor of Science in Mechanical Engineering",
            nameAr: "بكالوريوس الهندسة الميكانيكية",
            tuition: 480000,
            minGrade: 85,
            tags: HIGH_DEMAND,
            coop: true,
            english: IELTS_60,
            applicationFee: 1500,
          },
          {
            field: "architecture",
            name: "Bachelor of Science in Architectural Engineering",
            nameAr: "بكالوريوس الهندسة المعمارية",
            years: 5,
            tuition: 495000,
            minGrade: 85,
            english: IELTS_60,
            applicationFee: 1500,
          },
        ],
      },
      {
        slug: "school-of-business",
        name: "School of Business",
        nameAr: "كلية إدارة الأعمال",
        description:
          "AACSB-accredited business school with majors in accounting, finance and marketing.",
        descriptionAr:
          "كلية أعمال معتمدة من AACSB بتخصصات في المحاسبة والتمويل والتسويق.",
        programs: [
          {
            field: "business_administration",
            name: "Bachelor of Business Administration",
            nameAr: "بكالوريوس إدارة الأعمال",
            tuition: 470000,
            minGrade: 82,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            coop: true,
            english: IELTS_60,
            applicationFee: 1500,
          },
          {
            field: "accounting",
            name: "Bachelor of Accounting",
            nameAr: "بكالوريوس المحاسبة",
            tuition: 470000,
            minGrade: 82,
            english: IELTS_60,
            applicationFee: 1500,
          },
        ],
      },
      {
        slug: "school-of-humanities-and-social-sciences",
        name: "School of Humanities and Social Sciences",
        nameAr: "كلية العلوم الإنسانية والاجتماعية",
        description:
          "Journalism, political science, economics, psychology and the arts.",
        descriptionAr:
          "الصحافة والعلوم السياسية والاقتصاد وعلم النفس والفنون.",
        programs: [
          {
            field: "mass_communication",
            name: "Bachelor of Arts in Journalism and Mass Communication",
            nameAr: "بكالوريوس الصحافة والإعلام",
            tuition: 455000,
            minGrade: 80,
            english: IELTS_60,
            applicationFee: 1500,
          },
          {
            field: "economics_political_science",
            name: "Bachelor of Arts in Economics",
            nameAr: "بكالوريوس الاقتصاد",
            tuition: 455000,
            minGrade: 82,
            tags: HIGH_DEMAND,
            english: IELTS_60,
            applicationFee: 1500,
          },
        ],
      },
    ],
  },

  {
    slug: "german-university-in-cairo",
    name: "German University in Cairo",
    nameAr: "الجامعة الألمانية بالقاهرة",
    type: "PRIVATE",
    city: "New Cairo",
    cityAr: "القاهرة الجديدة",
    establishedYear: 2002,
    addressLine: "Main Entrance, Al Tagamoa Al Khames, New Cairo",
    addressLineAr: "المدخل الرئيسي، التجمع الخامس، القاهرة الجديدة",
    phone: "0227590700",
    email: "info@guc.edu.eg",
    websiteUrl: "https://www.guc.edu.eg",
    description:
      "German-curriculum engineering, pharmacy and design programmes with a semester abroad in Germany.",
    descriptionAr:
      "برامج هندسة وصيدلة وتصميم بمناهج ألمانية مع فصل دراسي في ألمانيا.",
    aboutRich:
      "The German University in Cairo opened in 2002 under an agreement between the Egyptian and German governments, with academic supervision from the universities of Ulm and Stuttgart. Its New Cairo campus teaches roughly twelve thousand students.\n\nCurricula follow German engineering and pharmacy models, with mandatory industrial training, a bachelor thesis, and the option of a semester or a full master's degree at a partner university in Germany. Teaching is in English, with German language courses running through every programme.",
    aboutRichAr:
      "افتُتحت الجامعة الألمانية بالقاهرة عام ٢٠٠٢ باتفاق بين الحكومتين المصرية والألمانية وبإشراف أكاديمي من جامعتي أولم وشتوتجارت، ويدرس بحرمها في القاهرة الجديدة نحو اثني عشر ألف طالب.\n\nتتبع المناهج النموذج الألماني في الهندسة والصيدلة، وتشمل تدريباً صناعياً إلزامياً ورسالة تخرج وإمكانية دراسة فصل دراسي أو درجة ماجستير كاملة في إحدى الجامعات الشريكة بألمانيا. لغة الدراسة الإنجليزية مع مقررات لغة ألمانية في كل البرامج.",
    latitude: 30.0261,
    longitude: 31.4966,
    isFeatured: true,
    isRecommended: true,
    viewCount: 41300,
    images: GALLERY_B,
    minimumScores: {
      THANAWEYA_AMMA: 80,
      IGCSE: 75,
      AMERICAN_DIPLOMA: 74,
      STEM: 80,
      ARAB_CERTIFICATE: 78,
    },
    faculties: [
      {
        slug: "engineering-materials-science",
        name: "Faculty of Engineering and Materials Science",
        nameAr: "كلية الهندسة وعلوم المواد",
        description:
          "Mechatronics, IET, materials and design engineering on the German model.",
        descriptionAr:
          "الميكاترونيات وهندسة الاتصالات وعلوم المواد وهندسة التصميم على النمط الألماني.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Mechatronics Engineering",
            nameAr: "بكالوريوس هندسة الميكاترونيات",
            years: 5,
            durationLabel: "5 years including a mandatory industrial internship",
            durationLabelAr: "٥ سنوات تشمل تدريباً صناعياً إلزامياً",
            tuition: 195000,
            minGrade: 80,
            tags: HIGH_DEMAND,
            coop: true,
            english: IELTS_55,
            applicationFee: 1000,
          },
          {
            field: "engineering",
            name: "Bachelor of Information Engineering and Technology",
            nameAr: "بكالوريوس هندسة المعلومات والتكنولوجيا",
            years: 5,
            tuition: 195000,
            minGrade: 80,
            tags: HIGH_DEMAND,
            coop: true,
            english: IELTS_55,
            applicationFee: 1000,
          },
        ],
      },
      {
        slug: "pharmacy-biotechnology",
        name: "Faculty of Pharmacy and Biotechnology",
        nameAr: "كلية الصيدلة والتكنولوجيا الحيوية",
        description:
          "Pharmacy and biotechnology with German-accredited laboratory training.",
        descriptionAr:
          "الصيدلة والتكنولوجيا الحيوية مع تدريب معملي معتمد ألمانياً.",
        programs: [
          {
            field: "pharmacy",
            name: "Bachelor of Pharmacy and Biotechnology",
            nameAr: "بكالوريوس الصيدلة والتكنولوجيا الحيوية",
            years: 5,
            tuition: 205000,
            minGrade: 85,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            english: IELTS_55,
            applicationFee: 1000,
          },
        ],
      },
      {
        slug: "applied-sciences-arts",
        name: "Faculty of Applied Sciences and Arts",
        nameAr: "كلية العلوم التطبيقية والفنون",
        description:
          "Product design, graphic design and media engineering studios.",
        descriptionAr:
          "استوديوهات تصميم المنتجات والجرافيك وهندسة الوسائط.",
        programs: [
          {
            field: "applied_arts",
            name: "Bachelor of Product Design",
            nameAr: "بكالوريوس تصميم المنتجات",
            years: 5,
            tuition: 185000,
            minGrade: 75,
            english: IELTS_55,
            applicationFee: 1000,
          },
          {
            field: "applied_arts",
            name: "Bachelor of Graphic Design",
            nameAr: "بكالوريوس التصميم الجرافيكي",
            years: 5,
            tuition: 185000,
            minGrade: 75,
            english: IELTS_55,
            applicationFee: 1000,
          },
        ],
      },
      {
        slug: "management-technology",
        name: "Faculty of Management Technology",
        nameAr: "كلية إدارة التكنولوجيا",
        description:
          "Business informatics, finance and technology management.",
        descriptionAr: "معلوماتية الأعمال والتمويل وإدارة التكنولوجيا.",
        programs: [
          {
            field: "business_administration",
            name: "Bachelor of Business Informatics",
            nameAr: "بكالوريوس معلوماتية الأعمال",
            tuition: 175000,
            minGrade: 75,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
            applicationFee: 1000,
          },
        ],
      },
    ],
  },

  {
    slug: "british-university-in-egypt",
    name: "The British University in Egypt",
    nameAr: "الجامعة البريطانية في مصر",
    type: "PRIVATE",
    city: "El Shorouk",
    cityAr: "مدينة الشروق",
    establishedYear: 2005,
    addressLine: "Suez Desert Road, El Sherouk City",
    addressLineAr: "طريق السويس الصحراوي، مدينة الشروق",
    phone: "0226890000",
    email: "info@bue.edu.eg",
    websiteUrl: "https://www.bue.edu.eg",
    description:
      "UK-validated degrees awarded jointly with British partner universities, taught in English.",
    descriptionAr:
      "درجات معتمدة بريطانياً تُمنح بالاشتراك مع جامعات بريطانية شريكة، وتُدرَّس بالإنجليزية.",
    aboutRich:
      "The British University in Egypt was established in 2005 with support from the UK and Egyptian governments. Students graduate with both an Egyptian degree and a validated UK award from a partner such as London South Bank University or Loughborough.\n\nThe El Shorouk campus runs faculties in engineering, informatics, business, dentistry, nursing, pharmacy, arts and design, and law. Teaching follows UK quality assurance procedures, including external examiners and a placement year option on several programmes.",
    aboutRichAr:
      "تأسست الجامعة البريطانية في مصر عام ٢٠٠٥ بدعم من الحكومتين البريطانية والمصرية. ويتخرج الطالب حاملاً درجة مصرية ودرجة بريطانية معتمدة من إحدى الجامعات الشريكة مثل جامعة لندن ساوث بانك أو لافبرا.\n\nيضم حرم مدينة الشروق كليات الهندسة والحاسبات وإدارة الأعمال وطب الأسنان والتمريض والصيدلة والفنون والتصميم والحقوق. ويتبع التدريس إجراءات ضمان الجودة البريطانية بما فيها الممتحنون الخارجيون وخيار سنة تدريب عملي في عدد من البرامج.",
    latitude: 30.1274,
    longitude: 31.6169,
    isFeatured: true,
    isTrending: true,
    viewCount: 27500,
    images: GALLERY_A,
    minimumScores: {
      THANAWEYA_AMMA: 78,
      IGCSE: 72,
      AMERICAN_DIPLOMA: 72,
      STEM: 78,
      ARAB_CERTIFICATE: 76,
    },
    faculties: [
      {
        slug: "engineering",
        name: "Faculty of Engineering",
        nameAr: "كلية الهندسة",
        description:
          "Civil, mechanical, electrical and architectural engineering with a UK-validated award.",
        descriptionAr:
          "الهندسة المدنية والميكانيكية والكهربية والمعمارية بدرجة بريطانية معتمدة.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Civil Engineering",
            nameAr: "بكالوريوس الهندسة المدنية",
            years: 5,
            tuition: 168000,
            minGrade: 78,
            tags: HIGH_DEMAND,
            coop: true,
            english: IELTS_55,
            applicationFee: 800,
          },
          {
            field: "architecture",
            name: "Bachelor of Architectural Engineering",
            nameAr: "بكالوريوس الهندسة المعمارية",
            years: 5,
            tuition: 172000,
            minGrade: 78,
            english: IELTS_55,
            applicationFee: 800,
          },
        ],
      },
      {
        slug: "informatics-computer-science",
        name: "Faculty of Informatics and Computer Science",
        nameAr: "كلية الحاسبات وتكنولوجيا المعلومات",
        description:
          "Software engineering, data science and cyber security, with an optional placement year.",
        descriptionAr:
          "هندسة البرمجيات وعلم البيانات والأمن السيبراني مع خيار سنة تدريب عملي.",
        programs: [
          {
            field: "computer_science",
            name: "Bachelor of Computer Science",
            nameAr: "بكالوريوس علوم الحاسب",
            tuition: 160000,
            minGrade: 78,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            coop: true,
            english: IELTS_55,
            applicationFee: 800,
          },
          {
            field: "data_science",
            name: "Bachelor of Data Science",
            nameAr: "بكالوريوس علم البيانات",
            tuition: 160000,
            minGrade: 80,
            tags: HIGH_DEMAND,
            coop: true,
            english: IELTS_55,
            applicationFee: 800,
          },
        ],
      },
      {
        slug: "dentistry",
        name: "Faculty of Dentistry",
        nameAr: "كلية طب الأسنان",
        description: "Clinical dentistry with an on-campus teaching clinic.",
        descriptionAr: "طب أسنان إكلينيكي مع عيادة تعليمية داخل الحرم الجامعي.",
        programs: [
          {
            field: "dentistry",
            name: "Bachelor of Dental Surgery",
            nameAr: "بكالوريوس طب وجراحة الفم والأسنان",
            years: 5,
            tuition: 245000,
            minGrade: 88,
            tags: HIGH_DEMAND,
            english: IELTS_55,
            applicationFee: 800,
          },
        ],
      },
      {
        slug: "business-administration-economics-political-science",
        name: "Faculty of Business Administration, Economics and Political Science",
        nameAr: "كلية إدارة الأعمال والاقتصاد والعلوم السياسية",
        description:
          "Business, economics and political science with a UK dual award.",
        descriptionAr:
          "إدارة الأعمال والاقتصاد والعلوم السياسية بدرجة بريطانية مزدوجة.",
        programs: [
          {
            field: "business_administration",
            name: "Bachelor of Business Administration",
            nameAr: "بكالوريوس إدارة الأعمال",
            tuition: 148000,
            minGrade: 70,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
            applicationFee: 800,
          },
        ],
      },
    ],
  },

  {
    slug: "future-university-in-egypt",
    name: "Future University in Egypt",
    nameAr: "جامعة المستقبل في مصر",
    type: "PRIVATE",
    city: "New Cairo",
    cityAr: "القاهرة الجديدة",
    establishedYear: 2006,
    addressLine: "90th Street, Fifth Settlement, New Cairo",
    addressLineAr: "شارع التسعين، التجمع الخامس، القاهرة الجديدة",
    phone: "0226186100",
    email: "info@fue.edu.eg",
    websiteUrl: "https://fue.edu.eg",
    description:
      "A New Cairo private university with health sciences, engineering, business and computing faculties.",
    descriptionAr:
      "جامعة خاصة بالقاهرة الجديدة تضم كليات العلوم الصحية والهندسة وإدارة الأعمال والحاسبات.",
    aboutRich:
      "Future University in Egypt opened in 2006 on 90th Street in the Fifth Settlement. It teaches around ten thousand students across seven faculties, with oral and dental medicine, pharmacy and engineering the largest.\n\nProgrammes run on a credit-hour system with English as the language of instruction, and the university operates its own dental teaching hospital and pharmaceutical laboratories on campus.",
    aboutRichAr:
      "افتُتحت جامعة المستقبل في مصر عام ٢٠٠٦ بشارع التسعين في التجمع الخامس، ويدرس بها نحو عشرة آلاف طالب في سبع كليات، أكبرها طب الفم والأسنان والصيدلة والهندسة.\n\nتعمل البرامج بنظام الساعات المعتمدة ولغة الدراسة الإنجليزية، وتدير الجامعة مستشفى تعليمياً لطب الأسنان ومعامل صيدلانية داخل الحرم الجامعي.",
    latitude: 30.0074,
    longitude: 31.4913,
    viewCount: 18600,
    images: GALLERY_B,
    minimumScores: {
      THANAWEYA_AMMA: 75,
      IGCSE: 70,
      AMERICAN_DIPLOMA: 70,
      STEM: 75,
      ARAB_CERTIFICATE: 73,
    },
    faculties: [
      {
        slug: "oral-dental-medicine",
        name: "Faculty of Oral and Dental Medicine",
        nameAr: "كلية طب الفم والأسنان",
        description: "Dental surgery with an on-campus teaching hospital.",
        descriptionAr: "طب وجراحة الأسنان مع مستشفى تعليمي داخل الحرم.",
        programs: [
          {
            field: "dentistry",
            name: "Bachelor of Oral and Dental Medicine",
            nameAr: "بكالوريوس طب الفم والأسنان",
            years: 5,
            tuition: 215000,
            minGrade: 85,
            tags: HIGH_DEMAND,
            english: IELTS_55,
            applicationFee: 750,
          },
        ],
      },
      {
        slug: "pharmacy",
        name: "Faculty of Pharmacy",
        nameAr: "كلية الصيدلة",
        description: "Clinical pharmacy with hospital rotations from year four.",
        descriptionAr: "الصيدلة الإكلينيكية مع تدريب بالمستشفيات من السنة الرابعة.",
        programs: [
          {
            field: "pharmacy",
            name: "Doctor of Pharmacy (PharmD)",
            nameAr: "دكتور صيدلة",
            years: 6,
            tuition: 178000,
            minGrade: 82,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            english: IELTS_55,
            applicationFee: 750,
          },
        ],
      },
      {
        slug: "engineering-technology",
        name: "Faculty of Engineering and Technology",
        nameAr: "كلية الهندسة والتكنولوجيا",
        description:
          "Architectural, mechatronics, electrical and civil engineering.",
        descriptionAr:
          "الهندسة المعمارية والميكاترونيات والكهربية والمدنية.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Mechatronics Engineering",
            nameAr: "بكالوريوس هندسة الميكاترونيات",
            years: 5,
            tuition: 142000,
            minGrade: 72,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
            applicationFee: 750,
          },
          {
            field: "architecture",
            name: "Bachelor of Architectural Engineering",
            nameAr: "بكالوريوس الهندسة المعمارية",
            years: 5,
            tuition: 146000,
            minGrade: 72,
            english: IELTS_55,
            applicationFee: 750,
          },
        ],
      },
      {
        slug: "computers-information-technology",
        name: "Faculty of Computers and Information Technology",
        nameAr: "كلية الحاسبات وتكنولوجيا المعلومات",
        description:
          "Software engineering, networks and information systems.",
        descriptionAr: "هندسة البرمجيات والشبكات ونظم المعلومات.",
        programs: [
          {
            field: "computer_science",
            name: "Bachelor of Computer Science",
            nameAr: "بكالوريوس علوم الحاسب",
            tuition: 128000,
            minGrade: 70,
            tags: HIGH_DEMAND,
            english: IELTS_55,
            applicationFee: 750,
          },
          {
            field: "information_technology",
            name: "Bachelor of Information Technology",
            nameAr: "بكالوريوس تكنولوجيا المعلومات",
            tuition: 128000,
            minGrade: 70,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
            applicationFee: 750,
          },
        ],
      },
      {
        slug: "commerce-business-administration",
        name: "Faculty of Commerce and Business Administration",
        nameAr: "كلية التجارة وإدارة الأعمال",
        description:
          "Accounting, marketing, finance and business information systems.",
        descriptionAr: "المحاسبة والتسويق والتمويل ونظم معلومات الأعمال.",
        programs: [
          {
            field: "business_administration",
            name: "Bachelor of Business Administration",
            nameAr: "بكالوريوس إدارة الأعمال",
            tuition: 105000,
            minGrade: 65,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
            applicationFee: 750,
          },
          {
            field: "accounting",
            name: "Bachelor of Accounting",
            nameAr: "بكالوريوس المحاسبة",
            tuition: 105000,
            minGrade: 65,
            english: IELTS_55,
            applicationFee: 750,
          },
        ],
      },
    ],
  },

  {
    slug: "misr-international-university",
    name: "Misr International University",
    nameAr: "جامعة مصر الدولية",
    type: "PRIVATE",
    city: "Cairo",
    cityAr: "القاهرة",
    establishedYear: 1996,
    addressLine: "Km 28 Cairo-Ismailia Road, Ahmed Orabi District",
    addressLineAr: "الكيلو ٢٨ طريق القاهرة الإسماعيلية، منطقة أحمد عرابي",
    phone: "0244774601",
    email: "info@miuegypt.edu.eg",
    websiteUrl: "https://www.miuegypt.edu.eg",
    description:
      "One of Egypt's earliest private universities, with pharmacy, dentistry, engineering and mass communication.",
    descriptionAr:
      "من أوائل الجامعات الخاصة في مصر، وتضم الصيدلة وطب الأسنان والهندسة والإعلام.",
    aboutRich:
      "Misr International University was licensed in 1996, making it one of the first four private universities in Egypt. Its campus sits on the Cairo-Ismailia road and teaches around eight thousand students.\n\nThe university is known for its pharmacy and dentistry faculties and for a mass communication school with working television and radio studios. All programmes are credit-hour based and taught in English.",
    aboutRichAr:
      "رُخِّصت جامعة مصر الدولية عام ١٩٩٦ لتكون من أوائل أربع جامعات خاصة في مصر. ويقع حرمها على طريق القاهرة الإسماعيلية ويدرس بها نحو ثمانية آلاف طالب.\n\nتشتهر الجامعة بكليتي الصيدلة وطب الأسنان وبكلية الإعلام التي تضم استوديوهات تلفزيونية وإذاعية عاملة. وجميع البرامج بنظام الساعات المعتمدة وتُدرَّس بالإنجليزية.",
    latitude: 30.1381,
    longitude: 31.5453,
    viewCount: 15200,
    images: GALLERY_A,
    minimumScores: {
      THANAWEYA_AMMA: 74,
      IGCSE: 70,
      AMERICAN_DIPLOMA: 70,
      STEM: 74,
      ARAB_CERTIFICATE: 72,
    },
    faculties: [
      {
        slug: "pharmacy",
        name: "Faculty of Pharmacy",
        nameAr: "كلية الصيدلة",
        description: "Pharmaceutical sciences with industrial placements.",
        descriptionAr: "العلوم الصيدلية مع تدريب في الصناعة.",
        programs: [
          {
            field: "pharmacy",
            name: "Doctor of Pharmacy (PharmD)",
            nameAr: "دكتور صيدلة",
            years: 6,
            tuition: 168000,
            minGrade: 80,
            tags: HIGH_DEMAND,
            english: IELTS_55,
            applicationFee: 700,
          },
        ],
      },
      {
        slug: "oral-dental-medicine",
        name: "Faculty of Oral and Dental Medicine",
        nameAr: "كلية طب الفم والأسنان",
        description: "Dentistry with simulation labs and a teaching clinic.",
        descriptionAr: "طب الأسنان مع معامل محاكاة وعيادة تعليمية.",
        programs: [
          {
            field: "dentistry",
            name: "Bachelor of Oral and Dental Medicine",
            nameAr: "بكالوريوس طب الفم والأسنان",
            years: 5,
            tuition: 205000,
            minGrade: 84,
            tags: HIGH_DEMAND,
            english: IELTS_55,
            applicationFee: 700,
          },
        ],
      },
      {
        slug: "mass-communication",
        name: "Faculty of Mass Communication",
        nameAr: "كلية الإعلام",
        description:
          "Journalism, public relations and radio and television production.",
        descriptionAr: "الصحافة والعلاقات العامة والإنتاج الإذاعي والتلفزيوني.",
        programs: [
          {
            field: "mass_communication",
            name: "Bachelor of Mass Communication",
            nameAr: "بكالوريوس الإعلام",
            tuition: 112000,
            minGrade: 65,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
            applicationFee: 700,
          },
        ],
      },
      {
        slug: "engineering",
        name: "Faculty of Engineering",
        nameAr: "كلية الهندسة",
        description: "Mechanical, electrical and architectural engineering.",
        descriptionAr: "الهندسة الميكانيكية والكهربية والمعمارية.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Electrical Engineering",
            nameAr: "بكالوريوس الهندسة الكهربية",
            years: 5,
            tuition: 132000,
            minGrade: 70,
            english: IELTS_55,
            applicationFee: 700,
          },
        ],
      },
      {
        slug: "computer-science",
        name: "Faculty of Computer Science",
        nameAr: "كلية علوم الحاسب",
        description: "Software engineering and information systems.",
        descriptionAr: "هندسة البرمجيات ونظم المعلومات.",
        programs: [
          {
            field: "computer_science",
            name: "Bachelor of Computer Science",
            nameAr: "بكالوريوس علوم الحاسب",
            tuition: 118000,
            minGrade: 68,
            tags: HIGH_DEMAND,
            english: IELTS_55,
            applicationFee: 700,
          },
        ],
      },
    ],
  },

  {
    slug: "nile-university",
    name: "Nile University",
    nameAr: "جامعة النيل",
    type: "PRIVATE",
    city: "6th of October City",
    cityAr: "مدينة السادس من أكتوبر",
    establishedYear: 2006,
    addressLine: "26th of July Corridor, Sheikh Zayed, Giza",
    addressLineAr: "محور ٢٦ يوليو، الشيخ زايد، الجيزة",
    phone: "0238271500",
    email: "info@nu.edu.eg",
    websiteUrl: "https://nu.edu.eg",
    description:
      "A research-focused, non-profit university built around engineering, computing and business.",
    descriptionAr:
      "جامعة بحثية غير هادفة للربح تتمحور حول الهندسة والحوسبة وإدارة الأعمال.",
    aboutRich:
      "Nile University was founded in 2006 as Egypt's first non-profit, research-oriented private university. Its Sheikh Zayed campus hosts a technology incubator and a set of funded research centres in nanotechnology, informatics and renewable energy.\n\nUndergraduate programmes are deliberately few and concentrated in engineering, computer science and business, and students join research groups and startup projects alongside coursework. Merit scholarships cover a large share of tuition for high-scoring applicants.",
    aboutRichAr:
      "تأسست جامعة النيل عام ٢٠٠٦ لتكون أول جامعة خاصة بحثية غير هادفة للربح في مصر. ويضم حرمها بالشيخ زايد حاضنة تكنولوجية ومراكز بحثية ممولة في النانو تكنولوجي والمعلوماتية والطاقة المتجددة.\n\nبرامج البكالوريوس محدودة العدد عن قصد وتتركز في الهندسة وعلوم الحاسب وإدارة الأعمال، وينضم الطلاب إلى مجموعات بحثية ومشروعات ناشئة إلى جانب دراستهم. وتغطي المنح التفوقية جزءاً كبيراً من المصروفات للمتقدمين الحاصلين على درجات مرتفعة.",
    latitude: 30.0176,
    longitude: 30.9834,
    isRecommended: true,
    isTrending: true,
    viewCount: 20400,
    images: GALLERY_B,
    minimumScores: {
      THANAWEYA_AMMA: 82,
      IGCSE: 76,
      AMERICAN_DIPLOMA: 75,
      STEM: 82,
      ARAB_CERTIFICATE: 80,
    },
    faculties: [
      {
        slug: "engineering-applied-sciences",
        name: "School of Engineering and Applied Sciences",
        nameAr: "كلية الهندسة والعلوم التطبيقية",
        description:
          "Communications, energy and industrial engineering with funded research labs.",
        descriptionAr:
          "هندسة الاتصالات والطاقة والهندسة الصناعية مع معامل بحثية ممولة.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Communications and Information Engineering",
            nameAr: "بكالوريوس هندسة الاتصالات والمعلومات",
            years: 4,
            tuition: 158000,
            minGrade: 82,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            coop: true,
            english: IELTS_55,
            applicationFee: 900,
          },
          {
            field: "engineering",
            name: "Bachelor of Energy Engineering",
            nameAr: "بكالوريوس هندسة الطاقة",
            tuition: 158000,
            minGrade: 80,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            coop: true,
            english: IELTS_55,
            applicationFee: 900,
          },
        ],
      },
      {
        slug: "information-technology-computer-science",
        name: "School of Information Technology and Computer Science",
        nameAr: "كلية تكنولوجيا المعلومات وعلوم الحاسب",
        description:
          "Computer science and AI with a mandatory research or startup capstone.",
        descriptionAr:
          "علوم الحاسب والذكاء الاصطناعي مع مشروع تخرج بحثي أو ريادي إلزامي.",
        programs: [
          {
            field: "computer_science",
            name: "Bachelor of Computer Science",
            nameAr: "بكالوريوس علوم الحاسب",
            tuition: 152000,
            minGrade: 82,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            coop: true,
            english: IELTS_55,
            applicationFee: 900,
          },
          {
            field: "artificial_intelligence",
            name: "Bachelor of Artificial Intelligence",
            nameAr: "بكالوريوس الذكاء الاصطناعي",
            tuition: 152000,
            minGrade: 84,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            coop: true,
            english: IELTS_55,
            applicationFee: 900,
          },
        ],
      },
      {
        slug: "business-administration",
        name: "School of Business Administration",
        nameAr: "كلية إدارة الأعمال",
        description: "Entrepreneurship-led business degrees with incubator access.",
        descriptionAr:
          "برامج إدارة أعمال قائمة على ريادة الأعمال مع إتاحة الحاضنة التكنولوجية.",
        programs: [
          {
            field: "business_administration",
            name: "Bachelor of Business Administration",
            nameAr: "بكالوريوس إدارة الأعمال",
            tuition: 138000,
            minGrade: 78,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
            applicationFee: 900,
          },
        ],
      },
    ],
  },

  {
    slug: "egypt-university-of-informatics",
    name: "Egypt University of Informatics",
    nameAr: "جامعة مصر للمعلوماتية",
    type: "SPECIALIZED",
    city: "New Administrative Capital",
    cityAr: "العاصمة الإدارية الجديدة",
    establishedYear: 2021,
    addressLine: "Knowledge City, New Administrative Capital",
    addressLineAr: "مدينة المعرفة، العاصمة الإدارية الجديدة",
    phone: "0227920000",
    email: "info@eui.edu.eg",
    websiteUrl: "https://eui.edu.eg",
    description:
      "A specialised informatics university in the New Capital, focused on computing, AI and digital business.",
    descriptionAr:
      "جامعة متخصصة في المعلوماتية بالعاصمة الإدارية، وتركز على الحوسبة والذكاء الاصطناعي والأعمال الرقمية.",
    aboutRich:
      "Egypt University of Informatics opened in 2021 in Knowledge City in the New Administrative Capital, as part of the state's plan to build a specialised digital-skills pipeline.\n\nEvery programme sits within computing or its applications: computer science and engineering, information systems, business informatics and digital arts and design. Curricula are developed with industry partners, and students complete internships with technology companies operating in the New Capital.",
    aboutRichAr:
      "افتُتحت جامعة مصر للمعلوماتية عام ٢٠٢١ في مدينة المعرفة بالعاصمة الإدارية الجديدة، ضمن خطة الدولة لبناء منظومة متخصصة في المهارات الرقمية.\n\nتقع جميع البرامج داخل مجال الحوسبة أو تطبيقاتها: علوم وهندسة الحاسب ونظم المعلومات ومعلوماتية الأعمال والفنون والتصميم الرقمي. وتُطوَّر المناهج بالتعاون مع شركاء من الصناعة، ويقضي الطلاب فترات تدريب في شركات التكنولوجيا العاملة بالعاصمة الإدارية.",
    latitude: 30.0131,
    longitude: 31.7407,
    isRecommended: true,
    isTrending: true,
    viewCount: 24800,
    images: GALLERY_B,
    minimumScores: {
      THANAWEYA_AMMA: 76,
      IGCSE: 72,
      AMERICAN_DIPLOMA: 70,
      STEM: 76,
      ARAB_CERTIFICATE: 74,
    },
    faculties: [
      {
        slug: "computing-information-sciences",
        name: "College of Computing and Information Sciences",
        nameAr: "كلية الحوسبة وعلوم المعلومات",
        description:
          "Computer science, AI and cyber security built with industry input.",
        descriptionAr:
          "علوم الحاسب والذكاء الاصطناعي والأمن السيبراني بمناهج مصممة مع الصناعة.",
        programs: [
          {
            field: "computer_science",
            name: "Bachelor of Computer Science",
            nameAr: "بكالوريوس علوم الحاسب",
            tuition: 122000,
            minGrade: 76,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            coop: true,
            english: IELTS_55,
            applicationFee: 600,
          },
          {
            field: "artificial_intelligence",
            name: "Bachelor of Artificial Intelligence",
            nameAr: "بكالوريوس الذكاء الاصطناعي",
            tuition: 122000,
            minGrade: 78,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            coop: true,
            english: IELTS_55,
            applicationFee: 600,
          },
          {
            field: "data_science",
            name: "Bachelor of Data Science",
            nameAr: "بكالوريوس علم البيانات",
            tuition: 122000,
            minGrade: 78,
            tags: HIGH_DEMAND,
            coop: true,
            english: IELTS_55,
            applicationFee: 600,
          },
        ],
      },
      {
        slug: "engineering-technology",
        name: "College of Engineering and Technology",
        nameAr: "كلية الهندسة والتكنولوجيا",
        description: "Computer engineering and communications technology.",
        descriptionAr: "هندسة الحاسبات وتكنولوجيا الاتصالات.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Computer Engineering",
            nameAr: "بكالوريوس هندسة الحاسبات",
            years: 5,
            tuition: 132000,
            minGrade: 78,
            tags: HIGH_DEMAND,
            coop: true,
            english: IELTS_55,
            applicationFee: 600,
          },
        ],
      },
      {
        slug: "business-informatics",
        name: "College of Business Informatics",
        nameAr: "كلية معلوماتية الأعمال",
        description: "Digital business, fintech and business analytics.",
        descriptionAr: "الأعمال الرقمية والتكنولوجيا المالية وتحليلات الأعمال.",
        programs: [
          {
            field: "business_administration",
            name: "Bachelor of Business Informatics",
            nameAr: "بكالوريوس معلوماتية الأعمال",
            tuition: 108000,
            minGrade: 72,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
            applicationFee: 600,
          },
        ],
      },
      {
        slug: "digital-arts-design",
        name: "College of Digital Arts and Design",
        nameAr: "كلية الفنون والتصميم الرقمي",
        description: "Game design, animation and interactive media.",
        descriptionAr: "تصميم الألعاب والرسوم المتحركة والوسائط التفاعلية.",
        programs: [
          {
            field: "applied_arts",
            name: "Bachelor of Digital Media Design",
            nameAr: "بكالوريوس تصميم الوسائط الرقمية",
            tuition: 112000,
            minGrade: 70,
            english: IELTS_55,
            applicationFee: 600,
          },
        ],
      },
    ],
  },

  {
    slug: "zewail-city-of-science-and-technology",
    name: "Zewail City of Science and Technology",
    nameAr: "مدينة زويل للعلوم والتكنولوجيا",
    type: "SPECIALIZED",
    city: "6th of October City",
    cityAr: "مدينة السادس من أكتوبر",
    establishedYear: 2011,
    addressLine: "Sheikh Zayed District, 6th of October City, Giza",
    addressLineAr: "حي الشيخ زايد، مدينة السادس من أكتوبر، الجيزة",
    phone: "0238540407",
    email: "admissions@zewailcity.edu.eg",
    websiteUrl: "https://www.zewailcity.edu.eg",
    description:
      "A non-profit research city offering highly selective science and engineering degrees.",
    descriptionAr:
      "مدينة بحثية غير هادفة للربح تقدم برامج علمية وهندسية شديدة الانتقائية.",
    aboutRich:
      "Zewail City of Science and Technology was established in 2011 as a national project for scientific research, named after the Nobel laureate Ahmed Zewail. It combines a university, research institutes and a technology park on one site in 6th of October City.\n\nAdmission is among the most selective in Egypt: applicants sit the university's own entrance examination in mathematics, physics and English, and a large majority of admitted students receive partial or full scholarships. Undergraduate degrees cover nanotechnology, biomedical sciences, communications and computing.",
    aboutRichAr:
      "أُنشئت مدينة زويل للعلوم والتكنولوجيا عام ٢٠١١ كمشروع قومي للبحث العلمي، وسُميت باسم العالم الحاصل على جائزة نوبل أحمد زويل. وتجمع في موقع واحد بمدينة السادس من أكتوبر بين جامعة ومعاهد بحثية ومجمع تكنولوجي.\n\nيُعد القبول بها من الأشد انتقائية في مصر: يؤدي المتقدمون اختبار قبول خاصاً بالمدينة في الرياضيات والفيزياء واللغة الإنجليزية، ويحصل الجزء الأكبر من المقبولين على منح جزئية أو كاملة. وتغطي برامج البكالوريوس النانو تكنولوجي والعلوم الطبية الحيوية والاتصالات والحوسبة.",
    latitude: 29.9755,
    longitude: 30.9294,
    isRecommended: true,
    viewCount: 29100,
    images: GALLERY_A,
    minimumScores: {
      THANAWEYA_AMMA: 90,
      IGCSE: 85,
      AMERICAN_DIPLOMA: 84,
      STEM: 90,
      ARAB_CERTIFICATE: 88,
    },
    faculties: [
      {
        slug: "engineering",
        name: "School of Engineering and Applied Sciences",
        nameAr: "كلية الهندسة والعلوم التطبيقية",
        description:
          "Nanotechnology, renewable energy and communications engineering.",
        descriptionAr:
          "النانو تكنولوجي والطاقة المتجددة وهندسة الاتصالات.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Nanotechnology Engineering",
            nameAr: "بكالوريوس هندسة النانو تكنولوجي",
            tuition: 96000,
            minGrade: 90,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            english: IELTS_60,
          },
          {
            field: "engineering",
            name: "Bachelor of Renewable Energy Engineering",
            nameAr: "بكالوريوس هندسة الطاقة المتجددة",
            tuition: 96000,
            minGrade: 90,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            english: IELTS_60,
          },
        ],
      },
      {
        slug: "computational-sciences",
        name: "School of Computational Sciences and Artificial Intelligence",
        nameAr: "كلية العلوم الحاسوبية والذكاء الاصطناعي",
        description:
          "Computer science, AI and computational modelling with research placements.",
        descriptionAr:
          "علوم الحاسب والذكاء الاصطناعي والنمذجة الحاسوبية مع تدريب بحثي.",
        programs: [
          {
            field: "computer_science",
            name: "Bachelor of Computer Science and Artificial Intelligence",
            nameAr: "بكالوريوس علوم الحاسب والذكاء الاصطناعي",
            tuition: 96000,
            minGrade: 91,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            english: IELTS_60,
          },
        ],
      },
      {
        slug: "biomedical-sciences",
        name: "School of Biomedical Sciences",
        nameAr: "كلية العلوم الطبية الحيوية",
        description: "Biomedical sciences with laboratory research from year two.",
        descriptionAr: "العلوم الطبية الحيوية مع بحث معملي من السنة الثانية.",
        programs: [
          {
            field: "science",
            name: "Bachelor of Biomedical Sciences",
            nameAr: "بكالوريوس العلوم الطبية الحيوية",
            tuition: 96000,
            minGrade: 90,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            english: IELTS_60,
          },
        ],
      },
    ],
  },

  {
    slug: "arab-academy-science-technology",
    name: "Arab Academy for Science, Technology and Maritime Transport",
    nameAr: "الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري",
    type: "SPECIALIZED",
    city: "Alexandria",
    cityAr: "الإسكندرية",
    establishedYear: 1972,
    addressLine: "Abu Qir Campus, Alexandria",
    addressLineAr: "حرم أبو قير، الإسكندرية",
    phone: "035622366",
    email: "info@aast.edu",
    websiteUrl: "https://www.aast.edu",
    description:
      "An Arab League institution specialising in maritime transport, engineering, computing and logistics.",
    descriptionAr:
      "مؤسسة تابعة لجامعة الدول العربية متخصصة في النقل البحري والهندسة والحاسبات واللوجستيات.",
    aboutRich:
      "The Arab Academy for Science, Technology and Maritime Transport was founded in 1972 under the Arab League and remains the region's leading maritime training institution. It now runs campuses in Alexandria, Cairo, Aswan and Sheikh Zayed.\n\nAlongside its maritime college, which trains deck and marine engineering officers to international STCW standards, the academy teaches engineering, computing, management and international transport and logistics. Programmes are credit-hour based and taught in English.",
    aboutRichAr:
      "تأسست الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري عام ١٩٧٢ تحت مظلة جامعة الدول العربية، وما زالت أبرز مؤسسة للتدريب البحري في المنطقة، ولها اليوم فروع في الإسكندرية والقاهرة وأسوان والشيخ زايد.\n\nإلى جانب كلية النقل البحري التي تؤهل ضباط الملاحة والهندسة البحرية وفق معايير STCW الدولية، تدرّس الأكاديمية الهندسة والحاسبات والإدارة والنقل الدولي واللوجستيات. والبرامج بنظام الساعات المعتمدة وتُدرَّس بالإنجليزية.",
    latitude: 31.3,
    longitude: 30.0667,
    isFeatured: true,
    viewCount: 17800,
    images: GALLERY_A,
    minimumScores: {
      THANAWEYA_AMMA: 78,
      IGCSE: 73,
      AMERICAN_DIPLOMA: 72,
      STEM: 78,
      ARAB_CERTIFICATE: 76,
    },
    faculties: [
      {
        slug: "maritime-transport",
        name: "College of Maritime Transport and Technology",
        nameAr: "كلية النقل البحري والتكنولوجيا",
        description:
          "Deck officer and marine engineering training to international STCW standards.",
        descriptionAr:
          "تأهيل ضباط الملاحة والهندسة البحرية وفق معايير STCW الدولية.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Marine Engineering",
            nameAr: "بكالوريوس الهندسة البحرية",
            tuition: 118000,
            minGrade: 78,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            coop: true,
            english: IELTS_55,
            applicationFee: 700,
          },
          {
            field: "engineering",
            name: "Bachelor of Nautical Science",
            nameAr: "بكالوريوس العلوم الملاحية",
            tuition: 118000,
            minGrade: 78,
            tags: HIGH_DEMAND,
            coop: true,
            english: IELTS_55,
            applicationFee: 700,
          },
        ],
      },
      {
        slug: "engineering-technology",
        name: "College of Engineering and Technology",
        nameAr: "كلية الهندسة والتكنولوجيا",
        description:
          "Mechanical, electrical, construction and industrial engineering.",
        descriptionAr:
          "الهندسة الميكانيكية والكهربية وهندسة التشييد والهندسة الصناعية.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Construction Engineering",
            nameAr: "بكالوريوس هندسة التشييد",
            years: 5,
            tuition: 124000,
            minGrade: 75,
            english: IELTS_55,
            applicationFee: 700,
          },
          {
            field: "engineering",
            name: "Bachelor of Industrial Engineering",
            nameAr: "بكالوريوس الهندسة الصناعية",
            years: 5,
            tuition: 124000,
            minGrade: 75,
            tags: HIGH_DEMAND,
            english: IELTS_55,
            applicationFee: 700,
          },
        ],
      },
      {
        slug: "computing-information-technology",
        name: "College of Computing and Information Technology",
        nameAr: "كلية الحاسبات وتكنولوجيا المعلومات",
        description: "Computer science, software engineering and networks.",
        descriptionAr: "علوم الحاسب وهندسة البرمجيات والشبكات.",
        programs: [
          {
            field: "computer_science",
            name: "Bachelor of Computer Science",
            nameAr: "بكالوريوس علوم الحاسب",
            tuition: 116000,
            minGrade: 73,
            tags: HIGH_DEMAND,
            english: IELTS_55,
            applicationFee: 700,
          },
        ],
      },
      {
        slug: "international-transport-logistics",
        name: "College of International Transport and Logistics",
        nameAr: "كلية النقل الدولي واللوجستيات",
        description:
          "Supply chain, logistics and international trade management.",
        descriptionAr: "سلاسل الإمداد واللوجستيات وإدارة التجارة الدولية.",
        programs: [
          {
            field: "business_administration",
            name: "Bachelor of International Transport and Logistics",
            nameAr: "بكالوريوس النقل الدولي واللوجستيات",
            tuition: 104000,
            minGrade: 70,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            english: IELTS_55,
            applicationFee: 700,
          },
        ],
      },
    ],
  },

  {
    slug: "cairo-city-university",
    name: "City University of Cairo",
    nameAr: "جامعة المدينة بالقاهرة",
    type: "PRIVATE",
    city: "Badr City",
    cityAr: "مدينة بدر",
    establishedYear: 2023,
    addressLine: "New Heliopolis City, Universities Road, Badr",
    addressLineAr: "مدينة هليوبوليس الجديدة، طريق الجامعات، بدر",
    phone: "01067035847",
    email: "info@cuc.edu.eg",
    websiteUrl: "https://cuc.edu.eg",
    description:
      "A new private university in Badr City built around fifth-generation technology programmes.",
    descriptionAr:
      "جامعة خاصة حديثة بمدينة بدر تتمحور حول برامج تكنولوجيا الجيل الخامس.",
    aboutRich:
      "City University of Cairo is a private Egyptian university established by republican decree 53 of 2020 and opened to students in 2023. Its campus sits on Universities Road in New Heliopolis City, Badr.\n\nThe university's stated aim is to deliver programmes aligned with fifth-generation technologies, combining theoretical knowledge with practical application. It holds an independent legal personality, allowing it to manage its own budget and set its own academic strategy, and it operates modern laboratories, career counselling and a research support office for undergraduates.",
    aboutRichAr:
      "جامعة المدينة بالقاهرة جامعة مصرية خاصة تأسست بموجب القرار الجمهوري رقم ٥٣ لعام ٢٠٢٠ وفتحت أبوابها للطلاب عام ٢٠٢٣، ويقع حرمها على طريق الجامعات بمدينة هليوبوليس الجديدة ببدر.\n\nتهدف الجامعة إلى تقديم برامج تعليمية تتماشى مع أحدث تقنيات الجيل الخامس، وتجمع بين المعرفة النظرية والتطبيق العملي. وتتمتع بشخصية اعتبارية مستقلة تتيح لها إدارة ميزانيتها وتحديد استراتيجيتها التعليمية، كما تضم معامل حديثة وخدمات إرشاد مهني ومكتباً لدعم البحث لطلاب البكالوريوس.",
    latitude: 30.1355,
    longitude: 31.7238,
    isRecommended: true,
    isTrending: true,
    viewCount: 13900,
    images: GALLERY_B,
    minimumScores: {
      THANAWEYA_AMMA: 70,
      IGCSE: 65,
      AMERICAN_DIPLOMA: 65,
      STEM: 70,
      ARAB_CERTIFICATE: 68,
    },
    faculties: [
      {
        slug: "computer-science-artificial-intelligence",
        name: "Faculty of Computer Science and Artificial Intelligence",
        nameAr: "كلية علوم الحاسب والذكاء الاصطناعي",
        description:
          "Computing and AI programmes built around fifth-generation technologies.",
        descriptionAr:
          "برامج الحوسبة والذكاء الاصطناعي المبنية على تقنيات الجيل الخامس.",
        programs: [
          {
            field: "computer_science",
            name: "Bachelor of Computer Science",
            nameAr: "بكالوريوس علوم الحاسب",
            tuition: 98000,
            minGrade: 70,
            tags: HIGH_DEMAND_SCHOLARSHIP,
            english: IELTS_55,
            applicationFee: 500,
          },
          {
            field: "artificial_intelligence",
            name: "Bachelor of Artificial Intelligence",
            nameAr: "بكالوريوس الذكاء الاصطناعي",
            tuition: 98000,
            minGrade: 72,
            tags: HIGH_DEMAND,
            english: IELTS_55,
            applicationFee: 500,
          },
        ],
      },
      {
        slug: "engineering",
        name: "Faculty of Engineering",
        nameAr: "كلية الهندسة",
        description: "Communications, mechatronics and architectural engineering.",
        descriptionAr: "هندسة الاتصالات والميكاترونيات والهندسة المعمارية.",
        programs: [
          {
            field: "engineering",
            name: "Bachelor of Communications Engineering",
            nameAr: "بكالوريوس هندسة الاتصالات",
            years: 5,
            tuition: 112000,
            minGrade: 72,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
            applicationFee: 500,
          },
        ],
      },
      {
        slug: "business",
        name: "Faculty of Business",
        nameAr: "كلية الأعمال",
        description: "Business administration, marketing and digital commerce.",
        descriptionAr: "إدارة الأعمال والتسويق والتجارة الرقمية.",
        programs: [
          {
            field: "business_administration",
            name: "Bachelor of Business Administration",
            nameAr: "بكالوريوس إدارة الأعمال",
            tuition: 86000,
            minGrade: 65,
            tags: CREDIT_HOURS_FAST,
            english: IELTS_55,
            applicationFee: 500,
          },
        ],
      },
      {
        slug: "mass-communication",
        name: "Faculty of Mass Communication",
        nameAr: "كلية الإعلام",
        description: "Digital media, public relations and advertising.",
        descriptionAr: "الإعلام الرقمي والعلاقات العامة والإعلان.",
        programs: [
          {
            field: "mass_communication",
            name: "Bachelor of Digital Media",
            nameAr: "بكالوريوس الإعلام الرقمي",
            tuition: 84000,
            minGrade: 65,
            english: IELTS_55,
            applicationFee: 500,
          },
        ],
      },
    ],
  },
];

/** Feature bullets for a university, chosen by sector. */
export function featuresFor(type: UniversityType): FeatureSeed[] {
  if (type === "PUBLIC") return commonFeatures("public");
  if (type === "SPECIALIZED") return commonFeatures("specialized");
  return commonFeatures("private");
}

/** Admission and tuition prose for a university, chosen by sector. */
export function blocksFor(
  type: UniversityType,
  name: string,
  nameAr: string,
): ContentBlockSeed[] {
  return type === "PUBLIC"
    ? publicSectorBlocks(name, nameAr)
    : privateSectorBlocks(name, nameAr);
}
