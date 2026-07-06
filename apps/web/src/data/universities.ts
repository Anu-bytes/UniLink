import type { University } from "@/lib/types";

// ---------------------------------------------------------------------------
// DUMMY DATA — sample Egyptian universities for Phase 1.
// Coordinates are approximate. Replace with the seeded Postgres/PostGIS data.
// ---------------------------------------------------------------------------

export const UNIVERSITIES: University[] = [
  {
    id: "u-cairo",
    slug: "cairo-university",
    name: { en: "Cairo University", ar: "جامعة القاهرة" },
    bio: {
      en: "One of Egypt's oldest and largest public universities, offering a broad range of undergraduate and postgraduate programs across science, medicine, and the humanities.",
      ar: "من أعرق وأكبر الجامعات الحكومية في مصر، وتقدّم مجموعة واسعة من برامج البكالوريوس والدراسات العليا في العلوم والطب والإنسانيات.",
    },
    address: { en: "Giza Square, Giza", ar: "ميدان الجيزة، الجيزة" },
    city: { en: "Giza", ar: "الجيزة" },
    governorate: { en: "Giza", ar: "الجيزة" },
    lat: 30.0264,
    lng: 31.2091,
    accreditation: ["NAQAAE", "QS World Rankings"],
    isVerified: false,
    nationalOrInternational: "national",
    established: 1908,
    rating: 4.7,
    faculties: [
      {
        id: "f-cairo-eng",
        name: { en: "Faculty of Engineering", ar: "كلية الهندسة" },
        fieldOfStudy: "engineering",
        accreditation: ["ABET"],
        departments: [
          {
            id: "d-cairo-eng-mech",
            name: { en: "Mechanical Engineering", ar: "الهندسة الميكانيكية" },
            durationYears: 5,
            programs: [
              {
                id: "p-cairo-eng-mech-bsc",
                name: { en: "BSc Mechanical Engineering", ar: "بكالوريوس هندسة ميكانيكية" },
                degreeType: "undergraduate",
                fieldOfStudy: "engineering",
                minFees: 22000,
                maxFees: 35000,
                durationYears: 5,
                careers: { en: "Manufacturing, automotive, energy.", ar: "التصنيع والسيارات والطاقة." },
              },
            ],
          },
          {
            id: "d-cairo-eng-comm",
            name: { en: "Communications & Electronics", ar: "هندسة الاتصالات والإلكترونيات" },
            durationYears: 5,
            programs: [
              {
                id: "p-cairo-eng-comm-bsc",
                name: { en: "BSc Communications Engineering", ar: "بكالوريوس هندسة اتصالات" },
                degreeType: "undergraduate",
                fieldOfStudy: "engineering",
                minFees: 22000,
                maxFees: 35000,
                durationYears: 5,
              },
            ],
          },
        ],
      },
      {
        id: "f-cairo-med",
        name: { en: "Faculty of Medicine (Kasr Al-Ainy)", ar: "كلية الطب (قصر العيني)" },
        fieldOfStudy: "medicine",
        departments: [
          {
            id: "d-cairo-med-mbbch",
            name: { en: "Human Medicine", ar: "الطب البشري" },
            durationYears: 6,
            programs: [
              {
                id: "p-cairo-med-mbbch",
                name: { en: "MBBCh Medicine & Surgery", ar: "بكالوريوس الطب والجراحة" },
                degreeType: "undergraduate",
                fieldOfStudy: "medicine",
                minFees: 35000,
                maxFees: 48000,
                durationYears: 6,
              },
            ],
          },
        ],
      },
      {
        id: "f-cairo-cs",
        name: { en: "Faculty of Computers & AI", ar: "كلية الحاسبات والذكاء الاصطناعي" },
        fieldOfStudy: "cs-ai-it",
        departments: [
          {
            id: "d-cairo-cs-ai",
            name: { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي" },
            durationYears: 4,
            programs: [
              {
                id: "p-cairo-cs-ai-bsc",
                name: { en: "BSc Artificial Intelligence", ar: "بكالوريوس الذكاء الاصطناعي" },
                degreeType: "undergraduate",
                fieldOfStudy: "cs-ai-it",
                minFees: 28000,
                maxFees: 42000,
                durationYears: 4,
                careers: { en: "Machine learning, data science.", ar: "تعلّم الآلة وعلم البيانات." },
              },
              {
                id: "p-cairo-cs-ai-msc",
                name: { en: "MSc Data Science", ar: "ماجستير علم البيانات" },
                degreeType: "postgraduate",
                fieldOfStudy: "cs-ai-it",
                minFees: 45000,
                maxFees: 60000,
                durationYears: 2,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "u-ainshams",
    slug: "ain-shams-university",
    name: { en: "Ain Shams University", ar: "جامعة عين شمس" },
    bio: {
      en: "A major public university in Cairo known for its engineering, medical, and business faculties.",
      ar: "جامعة حكومية كبرى في القاهرة تشتهر بكليات الهندسة والطب والتجارة.",
    },
    address: { en: "El-Khalyfa El-Mamoun, Abbassia, Cairo", ar: "الخليفة المأمون، العباسية، القاهرة" },
    city: { en: "Cairo", ar: "القاهرة" },
    governorate: { en: "Cairo", ar: "القاهرة" },
    lat: 30.0776,
    lng: 31.2853,
    accreditation: ["NAQAAE"],
    isVerified: false,
    nationalOrInternational: "national",
    established: 1950,
    rating: 4.5,
    faculties: [
      {
        id: "f-ains-eng",
        name: { en: "Faculty of Engineering", ar: "كلية الهندسة" },
        fieldOfStudy: "engineering",
        departments: [
          {
            id: "d-ains-eng-arch",
            name: { en: "Architecture", ar: "الهندسة المعمارية" },
            durationYears: 5,
            programs: [
              {
                id: "p-ains-eng-arch-bsc",
                name: { en: "BSc Architectural Engineering", ar: "بكالوريوس الهندسة المعمارية" },
                degreeType: "undergraduate",
                fieldOfStudy: "engineering",
                minFees: 24000,
                maxFees: 38000,
                durationYears: 5,
              },
            ],
          },
        ],
      },
      {
        id: "f-ains-pharm",
        name: { en: "Faculty of Pharmacy", ar: "كلية الصيدلة" },
        fieldOfStudy: "pharmacy",
        departments: [
          {
            id: "d-ains-pharm-clin",
            name: { en: "Clinical Pharmacy", ar: "الصيدلة الإكلينيكية" },
            durationYears: 5,
            programs: [
              {
                id: "p-ains-pharm-clin-bsc",
                name: { en: "PharmD Clinical Pharmacy", ar: "دكتور صيدلة إكلينيكية" },
                degreeType: "undergraduate",
                fieldOfStudy: "pharmacy",
                minFees: 30000,
                maxFees: 45000,
                durationYears: 5,
              },
            ],
          },
        ],
      },
      {
        id: "f-ains-bus",
        name: { en: "Faculty of Business", ar: "كلية التجارة" },
        fieldOfStudy: "business",
        departments: [
          {
            id: "d-ains-bus-acc",
            name: { en: "Accounting", ar: "المحاسبة" },
            durationYears: 4,
            programs: [
              {
                id: "p-ains-bus-acc-bsc",
                name: { en: "BSc Accounting", ar: "بكالوريوس المحاسبة" },
                degreeType: "undergraduate",
                fieldOfStudy: "business",
                minFees: 18000,
                maxFees: 28000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "u-alexandria",
    slug: "alexandria-university",
    name: { en: "Alexandria University", ar: "جامعة الإسكندرية" },
    bio: {
      en: "A leading public university on the Mediterranean coast with strong medical and engineering schools.",
      ar: "جامعة حكومية رائدة على ساحل البحر المتوسط تتميّز بكليات الطب والهندسة.",
    },
    address: { en: "El-Shatby, Alexandria", ar: "الشاطبي، الإسكندرية" },
    city: { en: "Alexandria", ar: "الإسكندرية" },
    governorate: { en: "Alexandria", ar: "الإسكندرية" },
    lat: 31.2018,
    lng: 29.9089,
    accreditation: ["NAQAAE"],
    isVerified: false,
    nationalOrInternational: "national",
    established: 1938,
    rating: 4.4,
    faculties: [
      {
        id: "f-alex-med",
        name: { en: "Faculty of Medicine", ar: "كلية الطب" },
        fieldOfStudy: "medicine",
        departments: [
          {
            id: "d-alex-med-hm",
            name: { en: "Human Medicine", ar: "الطب البشري" },
            durationYears: 6,
            programs: [
              {
                id: "p-alex-med-mbbch",
                name: { en: "MBBCh Medicine & Surgery", ar: "بكالوريوس الطب والجراحة" },
                degreeType: "undergraduate",
                fieldOfStudy: "medicine",
                minFees: 32000,
                maxFees: 46000,
                durationYears: 6,
              },
            ],
          },
        ],
      },
      {
        id: "f-alex-tour",
        name: { en: "Faculty of Tourism & Hotels", ar: "كلية السياحة والفنادق" },
        fieldOfStudy: "tourism",
        departments: [
          {
            id: "d-alex-tour-hm",
            name: { en: "Hotel Management", ar: "إدارة الفنادق" },
            durationYears: 4,
            programs: [
              {
                id: "p-alex-tour-hm-bsc",
                name: { en: "BSc Hotel Management", ar: "بكالوريوس إدارة الفنادق" },
                degreeType: "undergraduate",
                fieldOfStudy: "tourism",
                minFees: 16000,
                maxFees: 26000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "u-auc",
    slug: "american-university-in-cairo",
    name: { en: "The American University in Cairo", ar: "الجامعة الأمريكية بالقاهرة" },
    bio: {
      en: "Egypt's leading English-language liberal arts university, offering internationally accredited programs.",
      ar: "الجامعة الرائدة في مصر التي تدرّس باللغة الإنجليزية وتقدّم برامج معتمدة دوليًا.",
    },
    address: { en: "AUC Avenue, New Cairo", ar: "شارع الجامعة الأمريكية، القاهرة الجديدة" },
    city: { en: "New Cairo", ar: "القاهرة الجديدة" },
    governorate: { en: "Cairo", ar: "القاهرة" },
    lat: 30.019,
    lng: 31.4996,
    accreditation: ["MSCHE (USA)", "NAQAAE"],
    isVerified: true,
    nationalOrInternational: "international",
    established: 1919,
    rating: 4.8,
    faculties: [
      {
        id: "f-auc-bus",
        name: { en: "School of Business", ar: "كلية إدارة الأعمال" },
        fieldOfStudy: "business",
        accreditation: ["AACSB", "EQUIS"],
        departments: [
          {
            id: "d-auc-bus-ba",
            name: { en: "Business Administration", ar: "إدارة الأعمال" },
            durationYears: 4,
            programs: [
              {
                id: "p-auc-bus-ba-bsc",
                name: { en: "BSc Business Administration", ar: "بكالوريوس إدارة الأعمال" },
                degreeType: "undergraduate",
                fieldOfStudy: "business",
                minFees: 420000,
                maxFees: 560000,
                durationYears: 4,
                careers: { en: "Consulting, finance, entrepreneurship.", ar: "الاستشارات والتمويل وريادة الأعمال." },
              },
              {
                id: "p-auc-bus-mba",
                name: { en: "MBA", ar: "ماجستير إدارة الأعمال" },
                degreeType: "postgraduate",
                fieldOfStudy: "business",
                minFees: 480000,
                maxFees: 620000,
                durationYears: 2,
              },
            ],
          },
        ],
      },
      {
        id: "f-auc-cs",
        name: { en: "Computer Science & Engineering", ar: "علوم وهندسة الحاسب" },
        fieldOfStudy: "cs-ai-it",
        departments: [
          {
            id: "d-auc-cs",
            name: { en: "Computer Science", ar: "علوم الحاسب" },
            durationYears: 4,
            programs: [
              {
                id: "p-auc-cs-bsc",
                name: { en: "BSc Computer Science", ar: "بكالوريوس علوم الحاسب" },
                degreeType: "undergraduate",
                fieldOfStudy: "cs-ai-it",
                minFees: 430000,
                maxFees: 570000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
      {
        id: "f-auc-media",
        name: { en: "Journalism & Mass Communication", ar: "الصحافة والإعلام" },
        fieldOfStudy: "media",
        departments: [
          {
            id: "d-auc-media",
            name: { en: "Multimedia Journalism", ar: "الصحافة متعددة الوسائط" },
            durationYears: 4,
            programs: [
              {
                id: "p-auc-media-bsc",
                name: { en: "BA Multimedia Journalism", ar: "بكالوريوس الصحافة متعددة الوسائط" },
                degreeType: "undergraduate",
                fieldOfStudy: "media",
                minFees: 400000,
                maxFees: 520000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "u-guc",
    slug: "german-university-in-cairo",
    name: { en: "German University in Cairo", ar: "الجامعة الألمانية بالقاهرة" },
    bio: {
      en: "A private university offering German-standard engineering, pharmacy, and management education.",
      ar: "جامعة خاصة تقدّم تعليمًا في الهندسة والصيدلة والإدارة وفق المعايير الألمانية.",
    },
    address: { en: "New Cairo City", ar: "مدينة القاهرة الجديدة" },
    city: { en: "New Cairo", ar: "القاهرة الجديدة" },
    governorate: { en: "Cairo", ar: "القاهرة" },
    lat: 29.9866,
    lng: 31.442,
    accreditation: ["NAQAAE", "German Accreditation Council"],
    isVerified: true,
    nationalOrInternational: "international",
    established: 2002,
    rating: 4.6,
    faculties: [
      {
        id: "f-guc-eng",
        name: { en: "Faculty of Engineering", ar: "كلية الهندسة" },
        fieldOfStudy: "engineering",
        departments: [
          {
            id: "d-guc-eng-mecha",
            name: { en: "Mechatronics", ar: "الميكاترونكس" },
            durationYears: 5,
            programs: [
              {
                id: "p-guc-eng-mecha-bsc",
                name: { en: "BSc Mechatronics Engineering", ar: "بكالوريوس هندسة الميكاترونكس" },
                degreeType: "undergraduate",
                fieldOfStudy: "engineering",
                minFees: 120000,
                maxFees: 160000,
                durationYears: 5,
              },
            ],
          },
        ],
      },
      {
        id: "f-guc-pharm",
        name: { en: "Faculty of Pharmacy & Biotechnology", ar: "كلية الصيدلة والتكنولوجيا الحيوية" },
        fieldOfStudy: "pharmacy",
        departments: [
          {
            id: "d-guc-pharm",
            name: { en: "Pharmacy", ar: "الصيدلة" },
            durationYears: 5,
            programs: [
              {
                id: "p-guc-pharm-bsc",
                name: { en: "PharmD Pharmacy", ar: "دكتور صيدلة" },
                degreeType: "undergraduate",
                fieldOfStudy: "pharmacy",
                minFees: 110000,
                maxFees: 150000,
                durationYears: 5,
              },
            ],
          },
        ],
      },
      {
        id: "f-guc-mgmt",
        name: { en: "Faculty of Management Technology", ar: "كلية إدارة التكنولوجيا" },
        fieldOfStudy: "business",
        departments: [
          {
            id: "d-guc-mgmt",
            name: { en: "Management", ar: "الإدارة" },
            durationYears: 4,
            programs: [
              {
                id: "p-guc-mgmt-bsc",
                name: { en: "BSc Management Technology", ar: "بكالوريوس إدارة التكنولوجيا" },
                degreeType: "undergraduate",
                fieldOfStudy: "business",
                minFees: 95000,
                maxFees: 135000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "u-zewail",
    slug: "zewail-city",
    name: { en: "Zewail City of Science & Technology", ar: "مدينة زويل للعلوم والتكنولوجيا" },
    bio: {
      en: "A non-profit research university focused on science, engineering, and advanced technology.",
      ar: "جامعة بحثية غير هادفة للربح تركّز على العلوم والهندسة والتكنولوجيا المتقدمة.",
    },
    address: { en: "October Gardens, 6th of October", ar: "حدائق أكتوبر، السادس من أكتوبر" },
    city: { en: "6th of October", ar: "السادس من أكتوبر" },
    governorate: { en: "Giza", ar: "الجيزة" },
    lat: 29.9198,
    lng: 30.976,
    accreditation: ["NAQAAE"],
    isVerified: true,
    nationalOrInternational: "international",
    established: 2011,
    rating: 4.7,
    faculties: [
      {
        id: "f-zew-eng",
        name: { en: "Engineering & Applied Sciences", ar: "الهندسة والعلوم التطبيقية" },
        fieldOfStudy: "engineering",
        departments: [
          {
            id: "d-zew-eng-nano",
            name: { en: "Nanotechnology", ar: "تكنولوجيا النانو" },
            durationYears: 4,
            programs: [
              {
                id: "p-zew-eng-nano-bsc",
                name: { en: "BSc Nanoscience & Nanotechnology", ar: "بكالوريوس علوم وتكنولوجيا النانو" },
                degreeType: "undergraduate",
                fieldOfStudy: "applied-sciences",
                minFees: 90000,
                maxFees: 130000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
      {
        id: "f-zew-cs",
        name: { en: "Computational Sciences", ar: "العلوم الحاسوبية" },
        fieldOfStudy: "cs-ai-it",
        departments: [
          {
            id: "d-zew-cs",
            name: { en: "Computer Science & AI", ar: "علوم الحاسب والذكاء الاصطناعي" },
            durationYears: 4,
            programs: [
              {
                id: "p-zew-cs-bsc",
                name: { en: "BSc Computer Science & AI", ar: "بكالوريوس علوم الحاسب والذكاء الاصطناعي" },
                degreeType: "undergraduate",
                fieldOfStudy: "cs-ai-it",
                minFees: 95000,
                maxFees: 140000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "u-nile",
    slug: "nile-university",
    name: { en: "Nile University", ar: "جامعة النيل" },
    bio: {
      en: "A research-oriented private university specializing in technology, engineering, and business.",
      ar: "جامعة خاصة ذات توجّه بحثي متخصصة في التكنولوجيا والهندسة وإدارة الأعمال.",
    },
    address: { en: "Sheikh Zayed, 6th of October", ar: "الشيخ زايد، السادس من أكتوبر" },
    city: { en: "6th of October", ar: "السادس من أكتوبر" },
    governorate: { en: "Giza", ar: "الجيزة" },
    lat: 30.009,
    lng: 30.97,
    accreditation: ["NAQAAE"],
    isVerified: true,
    nationalOrInternational: "national",
    established: 2006,
    rating: 4.4,
    faculties: [
      {
        id: "f-nile-cs",
        name: { en: "School of Information Technology", ar: "كلية تكنولوجيا المعلومات" },
        fieldOfStudy: "cs-ai-it",
        departments: [
          {
            id: "d-nile-cs",
            name: { en: "Data Science", ar: "علم البيانات" },
            durationYears: 4,
            programs: [
              {
                id: "p-nile-cs-bsc",
                name: { en: "BSc Data Science", ar: "بكالوريوس علم البيانات" },
                degreeType: "undergraduate",
                fieldOfStudy: "cs-ai-it",
                minFees: 92000,
                maxFees: 130000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
      {
        id: "f-nile-bus",
        name: { en: "School of Business", ar: "كلية إدارة الأعمال" },
        fieldOfStudy: "business",
        departments: [
          {
            id: "d-nile-bus",
            name: { en: "Business Informatics", ar: "المعلوماتية التجارية" },
            durationYears: 4,
            programs: [
              {
                id: "p-nile-bus-bsc",
                name: { en: "BSc Business Informatics", ar: "بكالوريوس المعلوماتية التجارية" },
                degreeType: "undergraduate",
                fieldOfStudy: "business",
                minFees: 88000,
                maxFees: 125000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "u-msa",
    slug: "msa-university",
    name: { en: "MSA University", ar: "جامعة أكتوبر للعلوم الحديثة والآداب" },
    bio: {
      en: "A private university offering programs in pharmacy, dentistry, arts, and engineering with UK partnerships.",
      ar: "جامعة خاصة تقدّم برامج في الصيدلة وطب الأسنان والفنون والهندسة بشراكات بريطانية.",
    },
    address: { en: "26th July Corridor, 6th of October", ar: "محور 26 يوليو، السادس من أكتوبر" },
    city: { en: "6th of October", ar: "السادس من أكتوبر" },
    governorate: { en: "Giza", ar: "الجيزة" },
    lat: 29.976,
    lng: 30.949,
    accreditation: ["NAQAAE", "University of Greenwich (UK)"],
    isVerified: false,
    nationalOrInternational: "national",
    established: 1996,
    rating: 4.2,
    faculties: [
      {
        id: "f-msa-dent",
        name: { en: "Faculty of Dentistry", ar: "كلية طب الأسنان" },
        fieldOfStudy: "dentistry",
        departments: [
          {
            id: "d-msa-dent",
            name: { en: "Oral & Dental Medicine", ar: "طب الفم والأسنان" },
            durationYears: 5,
            programs: [
              {
                id: "p-msa-dent-bds",
                name: { en: "BDS Dentistry", ar: "بكالوريوس طب وجراحة الفم والأسنان" },
                degreeType: "undergraduate",
                fieldOfStudy: "dentistry",
                minFees: 150000,
                maxFees: 190000,
                durationYears: 5,
              },
            ],
          },
        ],
      },
      {
        id: "f-msa-arts",
        name: { en: "Faculty of Arts & Design", ar: "كلية الفنون والتصميم" },
        fieldOfStudy: "arts-design",
        departments: [
          {
            id: "d-msa-arts",
            name: { en: "Graphic Design", ar: "التصميم الجرافيكي" },
            durationYears: 4,
            programs: [
              {
                id: "p-msa-arts-ba",
                name: { en: "BA Graphic Design", ar: "بكالوريوس التصميم الجرافيكي" },
                degreeType: "undergraduate",
                fieldOfStudy: "arts-design",
                minFees: 100000,
                maxFees: 140000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "u-helwan",
    slug: "helwan-university",
    name: { en: "Helwan University", ar: "جامعة حلوان" },
    bio: {
      en: "A public university renowned for its fine and applied arts, engineering, and tourism faculties.",
      ar: "جامعة حكومية تشتهر بكليات الفنون الجميلة والتطبيقية والهندسة والسياحة.",
    },
    address: { en: "Ain Helwan, Helwan", ar: "عين حلوان، حلوان" },
    city: { en: "Helwan", ar: "حلوان" },
    governorate: { en: "Cairo", ar: "القاهرة" },
    lat: 29.87,
    lng: 31.33,
    accreditation: ["NAQAAE"],
    isVerified: false,
    nationalOrInternational: "national",
    established: 1975,
    rating: 4.1,
    faculties: [
      {
        id: "f-helwan-arts",
        name: { en: "Faculty of Applied Arts", ar: "كلية الفنون التطبيقية" },
        fieldOfStudy: "arts-design",
        departments: [
          {
            id: "d-helwan-arts",
            name: { en: "Interior Design", ar: "التصميم الداخلي" },
            durationYears: 5,
            programs: [
              {
                id: "p-helwan-arts-bsc",
                name: { en: "BA Interior Design", ar: "بكالوريوس التصميم الداخلي" },
                degreeType: "undergraduate",
                fieldOfStudy: "arts-design",
                minFees: 15000,
                maxFees: 25000,
                durationYears: 5,
              },
            ],
          },
        ],
      },
      {
        id: "f-helwan-tour",
        name: { en: "Faculty of Tourism & Hotels", ar: "كلية السياحة والفنادق" },
        fieldOfStudy: "tourism",
        departments: [
          {
            id: "d-helwan-tour",
            name: { en: "Tourism Studies", ar: "الدراسات السياحية" },
            durationYears: 4,
            programs: [
              {
                id: "p-helwan-tour-bsc",
                name: { en: "BSc Tourism Studies", ar: "بكالوريوس الدراسات السياحية" },
                degreeType: "undergraduate",
                fieldOfStudy: "tourism",
                minFees: 14000,
                maxFees: 22000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "u-mansoura",
    slug: "mansoura-university",
    name: { en: "Mansoura University", ar: "جامعة المنصورة" },
    bio: {
      en: "A major Delta public university with distinguished medicine, dentistry, and engineering schools.",
      ar: "جامعة حكومية كبرى في الدلتا تتميّز بكليات الطب وطب الأسنان والهندسة.",
    },
    address: { en: "El-Gomhoria St, Mansoura", ar: "شارع الجمهورية، المنصورة" },
    city: { en: "Mansoura", ar: "المنصورة" },
    governorate: { en: "Dakahlia", ar: "الدقهلية" },
    lat: 31.0409,
    lng: 31.3785,
    accreditation: ["NAQAAE"],
    isVerified: false,
    nationalOrInternational: "national",
    established: 1972,
    rating: 4.3,
    faculties: [
      {
        id: "f-mans-dent",
        name: { en: "Faculty of Dentistry", ar: "كلية طب الأسنان" },
        fieldOfStudy: "dentistry",
        departments: [
          {
            id: "d-mans-dent",
            name: { en: "Oral & Dental Medicine", ar: "طب الفم والأسنان" },
            durationYears: 5,
            programs: [
              {
                id: "p-mans-dent-bds",
                name: { en: "BDS Dentistry", ar: "بكالوريوس طب وجراحة الفم والأسنان" },
                degreeType: "undergraduate",
                fieldOfStudy: "dentistry",
                minFees: 30000,
                maxFees: 45000,
                durationYears: 5,
              },
            ],
          },
        ],
      },
      {
        id: "f-mans-eng",
        name: { en: "Faculty of Engineering", ar: "كلية الهندسة" },
        fieldOfStudy: "engineering",
        departments: [
          {
            id: "d-mans-eng",
            name: { en: "Electrical Engineering", ar: "الهندسة الكهربية" },
            durationYears: 5,
            programs: [
              {
                id: "p-mans-eng-bsc",
                name: { en: "BSc Electrical Engineering", ar: "بكالوريوس الهندسة الكهربية" },
                degreeType: "undergraduate",
                fieldOfStudy: "engineering",
                minFees: 20000,
                maxFees: 33000,
                durationYears: 5,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "u-assiut",
    slug: "assiut-university",
    name: { en: "Assiut University", ar: "جامعة أسيوط" },
    bio: {
      en: "The first public university in Upper Egypt, strong in medicine, engineering, and applied sciences.",
      ar: "أول جامعة حكومية في صعيد مصر، وتتميّز في الطب والهندسة والعلوم التطبيقية.",
    },
    address: { en: "Assiut University St, Assiut", ar: "شارع جامعة أسيوط، أسيوط" },
    city: { en: "Assiut", ar: "أسيوط" },
    governorate: { en: "Assiut", ar: "أسيوط" },
    lat: 27.1857,
    lng: 31.169,
    accreditation: ["NAQAAE"],
    isVerified: false,
    nationalOrInternational: "national",
    established: 1957,
    rating: 4.0,
    faculties: [
      {
        id: "f-assiut-med",
        name: { en: "Faculty of Medicine", ar: "كلية الطب" },
        fieldOfStudy: "medicine",
        departments: [
          {
            id: "d-assiut-med",
            name: { en: "Human Medicine", ar: "الطب البشري" },
            durationYears: 6,
            programs: [
              {
                id: "p-assiut-med-mbbch",
                name: { en: "MBBCh Medicine & Surgery", ar: "بكالوريوس الطب والجراحة" },
                degreeType: "undergraduate",
                fieldOfStudy: "medicine",
                minFees: 28000,
                maxFees: 42000,
                durationYears: 6,
              },
            ],
          },
        ],
      },
      {
        id: "f-assiut-sci",
        name: { en: "Faculty of Science", ar: "كلية العلوم" },
        fieldOfStudy: "applied-sciences",
        departments: [
          {
            id: "d-assiut-sci",
            name: { en: "Biotechnology", ar: "التكنولوجيا الحيوية" },
            durationYears: 4,
            programs: [
              {
                id: "p-assiut-sci-bsc",
                name: { en: "BSc Biotechnology", ar: "بكالوريوس التكنولوجيا الحيوية" },
                degreeType: "undergraduate",
                fieldOfStudy: "applied-sciences",
                minFees: 16000,
                maxFees: 26000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "u-fue",
    slug: "future-university-in-egypt",
    name: { en: "Future University in Egypt", ar: "جامعة المستقبل في مصر" },
    bio: {
      en: "A private university in New Cairo offering dentistry, pharmacy, economics, and business programs.",
      ar: "جامعة خاصة في القاهرة الجديدة تقدّم برامج طب الأسنان والصيدلة والاقتصاد وإدارة الأعمال.",
    },
    address: { en: "End of 90th St, New Cairo", ar: "نهاية شارع التسعين، القاهرة الجديدة" },
    city: { en: "New Cairo", ar: "القاهرة الجديدة" },
    governorate: { en: "Cairo", ar: "القاهرة" },
    lat: 30.008,
    lng: 31.49,
    accreditation: ["NAQAAE"],
    isVerified: true,
    nationalOrInternational: "national",
    established: 2006,
    rating: 4.1,
    faculties: [
      {
        id: "f-fue-dent",
        name: { en: "Faculty of Oral & Dental Medicine", ar: "كلية طب الفم والأسنان" },
        fieldOfStudy: "dentistry",
        departments: [
          {
            id: "d-fue-dent",
            name: { en: "Dentistry", ar: "طب الأسنان" },
            durationYears: 5,
            programs: [
              {
                id: "p-fue-dent-bds",
                name: { en: "BDS Dentistry", ar: "بكالوريوس طب وجراحة الفم والأسنان" },
                degreeType: "undergraduate",
                fieldOfStudy: "dentistry",
                minFees: 130000,
                maxFees: 175000,
                durationYears: 5,
              },
            ],
          },
        ],
      },
      {
        id: "f-fue-econ",
        name: { en: "Faculty of Economics & Political Science", ar: "كلية الاقتصاد والعلوم السياسية" },
        fieldOfStudy: "economics-poli",
        departments: [
          {
            id: "d-fue-econ",
            name: { en: "Political Science", ar: "العلوم السياسية" },
            durationYears: 4,
            programs: [
              {
                id: "p-fue-econ-bsc",
                name: { en: "BSc Political Science", ar: "بكالوريوس العلوم السياسية" },
                degreeType: "undergraduate",
                fieldOfStudy: "economics-poli",
                minFees: 85000,
                maxFees: 120000,
                durationYears: 4,
              },
            ],
          },
        ],
      },
    ],
  },
];
