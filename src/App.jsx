import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import ScrollFX from "./scrollFX";
import {
  requestScrollRefresh,
  cancelScrollRefresh,
} from "./scrollRefresh";
import { createFrameDecoder } from "./frameDecoder";
import { blogPosts } from "./blogsData";
import { submitToGoogleSheets } from "./formService";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Play,
  Pause,
  Plus,
  Minus,
  CheckCircle2,
  Download,
  Maximize2,
  FileText,
  CalendarDays,
  CreditCard,
  GraduationCap,
  Award,
  Camera,
  Users,
  FileCheck,
} from "lucide-react";

function Facebook({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function Instagram({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true,
});

// DEBUG: verify which module version the browser executes
if (typeof window !== "undefined") {
  window.__appVersion = "v5";
}

const admissionClasses = [
  "Early Year",
  "Nursery",
  "LKG",
  "UKG",
  ...Array.from({ length: 10 }, (_, index) => `Class ${index + 1}`),
];

const openAdmissionModal = () =>
  window.dispatchEvent(new CustomEvent("open-admission-modal"));

const IMG = {
  hero: "https://jhsbgm.in/wp-content/uploads/2024/04/C-1.jpg",
  about: "/images/DSC.png",
  chairman: "/images/Chenraj-Roychand.JPG",
  bg: "/images/JHS_bg_upscaled.jpg",
  ataglance: "/images/at-glance.jpg",
  ataglancebg: "/images/at-glance-bg.JPG",
  bg2: "/images/bg2.JPG",
  library: "/images/Library.JPG",
  librarybg: "/images/librarybg.JPG",
  eligibility: "/images/eligibility.JPG",
  eligibilitybg: "/images/eligibilitybg.JPG",
  scheduleinterview: "/images/schedule-interview.JPG",
  scheduleinterviewbg: "/images/schedule-interview-bg.JPG",
  documentsrequired: "/images/documents-required.JPG",
  documentsrequiredbg: "/images/documents-required-bg.JPG",
  academics: "/images/academics.JPG",
  academicsbg: "/images/academics-bg.jpg",
  infinitum: "/images/Infinitum.jpg",
  badge: "/images/Badging-ceremony.jpg",
  ganesh: "/images/Ganesh-chaturthi.jpg",
  ncc: "/images/NCC.JPG",
  ncc2: "/images/NCC2.JPG",
  scouts: "/images/Scouts.JPG",
  campus: "/images/campus.JPG",
  ganeshchaturthi: "/images/ganesh-chaturthi.png",
  chess: "/images/chess.JPG",
  yoga: "/images/yoga-day.jpg",
  labchemistry: "/images/lab-chemistry.JPG",
  adieuparty: "/images/adieu-party.jpg",
  annualday: "/images/annual-day.jpg",
  performingartsmusic: "/images/performing-arts-music.JPG",
  inhousepublications: "/images/in-house-publications.JPG",
  campuslife: "/images/campus-life.JPG",
  schoolmoments: "/images/school-moments.jpg",
  learningbeyondclassroom: "/images/learning-beyond-classroom.jpg",
  ourphilosophy: "/images/our-philosophy.jpg",
  ourcommunity: "/images/our-community.jpg",
  smartclassroom: "/images/smart-classroom.JPG",
  safetyfirst: "/images/safety-first.JPG",
  readresearchdiscover: "/images/read-research-discover.JPG",
  beyondtextbooks: "/images/beyond-textbooks.JPG",
  spaceforcuriosity: "/images/space-for-curiosity.JPG",
  preprimarylearning: "/images/pre-primary-learning.JPG",
  cocurricularactivities: "/images/co-curricular-activities.JPG",
  toppers2023: "/images/2023-toppers.jpg",
  toppers2024: "/images/2024-toppers.jpg",
  toppers2025: "/images/2025-toppers.jpg",
  contactPhoneEmail: "/images/contact-phone-email.jpg",
  contactPhone: "/images/contact-phone.jpg",
  contactEmail: "/images/contact-email.jpg",
  faqQuestionsAnswers: "/images/faq-questions-answers.jpg",
  faqHelpdesk: "/images/faq-helpdesk.jpg",
  achievementmatters: "/images/achievement-matters.png",
  beyondacademics: "/images/beyond-academics.jpg",
  cultureencouragement: "/images/culture-encouragement.jpg",
  helpersday: "/images/helpers-day.jpg",
  jigyasa: "/images/jigyasa.jpg",
  carnival: "/images/carnival.jpg",
  carnival2: "/images/carnival2.jpg",
  carnivalbg: "/images/carnivalbg.jpg",
  infinitumvyoma: "/images/infinitum-vyoma.pdf",
  infinitumvyoma2: "/images/infinitum-vyoma2.jpeg",
  sportscricket: "/images/sports-cricket.JPG",
  ncc3: "/images/NCC3.JPG",
  gogreenday: "/images/go-green-day.jpg",
  swimming: "/images/swimming.JPG",
  nanhekalakar: "/images/nanhe-kalakar.png",
  gallerybg: "/images/gallery-bg.png",
  beyondclassroom: "/images/beyond-classroom2.jpg",
  independenceday: "/images/independence-day.jpg",
  athletics: "https://jhsbgm.in/wp-content/uploads/2024/04/athletics.jpg",
  arts: "https://jhsbgm.in/wp-content/uploads/2024/04/performing-arts.jpg",
  publications: "https://jhsbgm.in/wp-content/uploads/2024/04/publications.jpg",
  gallery1: "https://jhsbgm.in/wp-content/uploads/2024/04/jhs-bg_4.jpg",
  gallery2: "https://jhsbgm.in/wp-content/uploads/2024/04/jhs-bg_3.jpg",
  gallery3: "https://jhsbgm.in/wp-content/uploads/2024/04/C-2.jpg",
  foodHero: "/images/food-menu-hero.jpg",
  foodHeroIndian: "/images/food-hero-indian.jpg",
  foodCafeteriaIntro: "/images/food-cafeteria-intro.jpg",
  foodMonday: "/images/food-monday.jpg",
  foodTuesday: "/images/food-tuesday.jpg",
  foodWednesday: "/images/food-wednesday.jpg",
  foodThursday: "/images/food-thursday.jpg",
  foodFriday: "/images/food-friday.jpg",
  foodSaturday: "/images/food-saturday.jpg",
  disclosureSchool: "/images/disclosure-school.jpg",
  disclosureCbse: "/images/disclosure-cbse.jpg",
  disclosureCode: "/images/disclosure-code.jpg",
  disclosurePrincipal: "/images/disclosure-principal.jpg",
  disclosureEmail: "/images/documents-required.JPG",
  disclosureContact: "/images/schedule-interview.JPG",
  disclosureIntro: "/images/disclosure-intro.jpg",
};

const HOME_PAGE_IMAGES = [
  IMG.bg,
  IMG.carnival,
  IMG.annualday,
  IMG.infinitum,
  IMG.badge,
  IMG.yoga,
  IMG.ncc,
  IMG.scouts,
  IMG.chess,
  IMG.performingartsmusic,
  IMG.inhousepublications,
  IMG.campuslife,
  IMG.learningbeyondclassroom,
  IMG.schoolmoments,
  IMG.ncc2,
  IMG.campus,
  IMG.labchemistry,
  IMG.academics,
  IMG.preprimarylearning,
  "/images/logo.png",
];

const preloadAndDecodeImage = (src) => {
  return new Promise((resolve) => {
    if (!src || typeof src !== "string" || src.startsWith("data:") || src.endsWith(".pdf")) {
      resolve();
      return;
    }
    const img = new Image();
    img.decoding = "async";
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const tryDecode = () => {
      if (typeof img.decode === "function") {
        img.decode().then(finish).catch(finish);
      } else {
        finish();
      }
    };

    img.onload = tryDecode;
    img.onerror = finish;
    img.src = src;

    if (img.complete) {
      tryDecode();
    }

    setTimeout(finish, 6000);
  });
};

const disclosureDocuments = [
  {
    title: "School Affiliation Certificate",
    category: "Affiliation & Trust",
    url: "/pdf/school-affiliation-certificate.pdf",
    code: "CBSE-AFF-2024",
  },
  {
    title: "Societies/Trust Certificate",
    category: "Affiliation & Trust",
    url: "/pdf/socities-trust-certificate.pdf",
    code: "TRUST-DEED-BGM",
  },
  {
    title: "No Objection Certificate",
    category: "Affiliation & Trust",
    url: "/pdf/no-objection-certificate.pdf",
    code: "STATE-NOC-KAR",
  },
  {
    title: "Permission Certificate",
    category: "Affiliation & Trust",
    url: "/pdf/permission-certificate.pdf",
    code: "RECOG-CERT-PRI",
  },
  {
    title: "Admission Form",
    category: "Academic & Governance",
    url: "/pdf/admission-form.pdf",
    code: "ADM-FORM-2026",
  },
  {
    title: "Fee Structure of School",
    category: "Academic & Governance",
    url: "/pdf/fees-structure.pdf",
    code: "FEES-ANN-2026",
  },
  {
    title: "Building Safety Certificate",
    category: "Safety & Compliance",
    url: "/pdf/building-safety-certificate.pdf",
    code: "PWD-BLDG-SAFE",
  },
  {
    title: "Fire-Safety Certificate",
    category: "Safety & Compliance",
    url: "/pdf/fire-safety-certificate.pdf",
    code: "FIRE-SAFE-CERT",
  },
  {
    title: "DEO Certificate",
    category: "Safety & Compliance",
    url: "/pdf/deo-certificate.pdf",
    code: "DEO-VERIF-BGM",
  },
  {
    title: "Water, Health and Sanitation Certificate",
    category: "Safety & Compliance",
    url: "/pdf/water-health-and-sanitation-certificate.pdf",
    code: "HEALTH-SANIT-CERT",
  },
  {
    title: "Annual Academic Calendar",
    category: "Academic & Governance",
    url: "/pdf/annual-academic-calender.pdf",
    code: "ACAD-CAL-2026",
  },
  {
    title: "List of School Management Committee (SMC)",
    category: "Academic & Governance",
    url: "/pdf/list-of-school-management-committee.pdf",
    code: "SMC-MEMBERS-LIST",
  },
  {
    title: "List of Parents Teachers Association (PTA) Members",
    category: "Academic & Governance",
    url: "/pdf/parent-teacher-association.pdf",
    code: "PTA-MEMBERS-LIST",
  },
  {
    title: "Board Examination Result",
    category: "Academic & Governance",
    url: "/pdf/board-examination-result.pdf",
    code: "AISSE-100-RESULT",
  },
  {
    title: "Mandatory Disclosure SARAS",
    category: "Affiliation & Trust",
    url: "/pdf/mandatory-disclosure-details-SARAS.pdf",
    code: "SARAS-COMPL-PUB",
  },
];

const learningContent = {
  academics: {
    title: "Learning should feel alive.",
    description:
      "From the first questions in preschool to the confidence of the senior years, JHS turns concepts into experiences through exploration, application and reflection.",
    support:
      "Pre-school discovery, CBSE depth and future-ready skills grow together.",
  },
  gallery: {
    title: "Everyday learning has a story.",
    description:
      "The most meaningful school moments happen between the timetable lines: a team finding its rhythm, a new idea taking shape, or a student finding their voice.",
    support: "Browse the visual journal of life at JHS.",
  },
  contact: {
    title: "A conversation can open possibility.",
    description:
      "Choosing a school is personal. Our admissions team is here to help you understand the campus, curriculum and community at your pace.",
    support: "Visit us, call us or send an enquiry.",
  },
  lifeSkills: {
    title: "Learning should travel with you.",
    description:
      "Jigyasa helps students practise communication, decision-making, creativity and independence in situations that feel real and relevant.",
    support: "Confidence is built by doing, reflecting and trying again.",
  },
  default: {
    title: "Learning should feel alive.",
    description:
      "Jain Heritage School combines academic excellence, values, creativity, leadership and joyful discovery to create a learning experience that goes beyond the classroom.",
    support: "A child-centred journey from curiosity to capability.",
  },
};
const documents = [
  {
    title: "Student Aadhaar Card",
    category: "IDENTITY VERIFICATION",
    spec: "Original Aadhaar card for on-campus verification + 2 clear self-attested photocopies.",
    badge: "MANDATORY",
    icon: "id",
    copies: "2 Copies",
  },
  {
    title: "Previous School Transfer Certificate",
    category: "ACADEMIC TRANSITION",
    spec: "Original TC issued by the previous recognized school, countersigned by education authority.",
    badge: "MANDATORY",
    icon: "tc",
    copies: "Original TC",
  },
  {
    title: "Previous Academic Marks Card",
    category: "PERFORMANCE RECORD",
    spec: "Cumulative marks transcript or authenticated report card of the preceding academic year.",
    badge: "REQUIRED",
    icon: "marks",
    copies: "2 Sets",
  },
  {
    title: "Five Passport Size Photographs",
    category: "STUDENT PROFILE",
    spec: "Recent colour photographs of the student in formal attire with plain white background.",
    badge: "REQUIRED",
    icon: "photo",
    copies: "5 Photos",
  },
  {
    title: "Official Birth Certificate",
    category: "CIVIC RECORD",
    spec: "Birth certificate issued by Municipal Corporation or authorized Registrar of Births & Deaths.",
    badge: "MANDATORY",
    icon: "birth",
    copies: "Original + 2 Copies",
  },
  {
    title: "Parents' / Guardian Aadhaar Cards",
    category: "PARENT IDENTITY",
    spec: "Clear photocopies of Aadhaar cards for both parents or appointed legal guardian.",
    badge: "REQUIRED",
    icon: "parent",
    copies: "2 Sets",
  },
  {
    title: "Parents' Passport Size Photographs",
    category: "GUARDIAN PROFILE",
    spec: "Two recent colour passport-size photographs each of father and mother / guardian.",
    badge: "REQUIRED",
    icon: "parent-photo",
    copies: "2 Each",
  },
];
const galleryItems = [
  // Campus
  {
    image: IMG.campus,
    category: "Campus",
    title: "A campus made for movement",
  },
  {
    image: IMG.campuslife,
    category: "Campus",
    title: "Life on our expansive campus",
  },
  {
    image: IMG.library,
    category: "Campus",
    title: "The Knowledge Hub & Library",
  },
  {
    image: IMG.spaceforcuriosity,
    category: "Campus",
    title: "Spaces built for curiosity",
  },
  {
    image: IMG.beyondclassroom,
    category: "Campus",
    title: "Learning beyond four walls",
  },
  {
    image: IMG.gallery1,
    category: "Campus",
    title: "Architectural grandeur & grounds",
  },

  // Sports
  {
    image: IMG.sportscricket,
    category: "Sports",
    title: "Championship cricket pitch",
  },
  {
    image: IMG.swimming,
    category: "Sports",
    title: "Olympic-spec swimming arena",
  },
  {
    image: IMG.chess,
    category: "Sports",
    title: "Grandmaster tactics & focus",
  },
  {
    image: IMG.athletics,
    category: "Sports",
    title: "Track & field athletics meet",
  },
  {
    image: IMG.yoga,
    category: "Sports",
    title: "Mindfulness, posture & balance",
  },

  // Learning
  {
    image: IMG.labchemistry,
    category: "Learning",
    title: "Where ideas become experiments",
  },
  {
    image: IMG.academics,
    category: "Learning",
    title: "Collaborative classroom inquiry",
  },
  {
    image: IMG.readresearchdiscover,
    category: "Learning",
    title: "Research, discovery & reading",
  },
  {
    image: IMG.smartclassroom,
    category: "Learning",
    title: "Next-generation digital classrooms",
  },
  {
    image: IMG.preprimarylearning,
    category: "Learning",
    title: "Foundations in early childhood",
  },
  {
    image: IMG.beyondtextbooks,
    category: "Learning",
    title: "Real-world experiential education",
  },

  // Cultural
  {
    image: IMG.ganeshchaturthi,
    category: "Cultural",
    title: "Learning through festive celebration",
  },
  {
    image: IMG.annualday,
    category: "Cultural",
    title: "Annual Day showcase of talent",
  },
  {
    image: IMG.carnival,
    category: "Cultural",
    title: "JHS community carnival & joy",
  },
  {
    image: IMG.performingartsmusic,
    category: "Cultural",
    title: "Rhythm, melody & stage presence",
  },
  {
    image: IMG.nanhekalakar,
    category: "Cultural",
    title: "Nanhe Kalakar artistic showcase",
  },
  {
    image: IMG.independenceday,
    category: "Cultural",
    title: "Patriotic spirit & flag hoisting",
  },
  {
    image: IMG.adieuparty,
    category: "Cultural",
    title: "Adieu ceremony & farewell",
  },

  // Leadership
  {
    image: IMG.ncc2,
    category: "Leadership",
    title: "National Cadet Corps discipline",
  },
  {
    image: IMG.ncc,
    category: "Leadership",
    title: "Service, dignity & honour",
  },
  {
    image: IMG.ncc3,
    category: "Leadership",
    title: "Cadet parade & precision drills",
  },
  {
    image: IMG.scouts,
    category: "Leadership",
    title: "Bharat Scouts & Guides in action",
  },
  {
    image: IMG.badge,
    category: "Leadership",
    title: "Investiture ceremony & badges",
  },
  {
    image: IMG.helpersday,
    category: "Leadership",
    title: "Gratitude & community service",
  },
];

const menus = [
  { label: "Home", path: "/" },
  {
    label: "About Us",
    children: [
      ["Chairman Message", "/about/chairman-message"],
      ["At a Glance", "/about/at-a-glance"],
      ["Infrastructure", "/about/infrastructure"],
      ["Library", "/about/library"],
    ],
  },
  {
    label: "Admissions",
    children: [
      ["Eligibility", "/admissions/eligibility"],
      ["Schedule Interview", "/admissions/schedule-interview"],
      ["Documents Required", "/admissions/documents-required"],
    ],
  },
  { label: "Academics", path: "/academics" },
  {
    label: "Student Life",
    children: [
      ["Awards and Honors", "/student-life/awards-and-honors"],
      ["School Anthem", "/student-life/school-anthem"],
      ["Life Skills", "/student-life/life-skills"],
      ["Infinitum Vyoma", "/student-life/infinitum-vyoma"],
      ["Food Menu", "/student-life/food-menu"],
    ],
  },
  {
    label: "Gallery",
    children: [["Photos & Videos", "/gallery/photos-videos"]],
  },
  { label: "News", children: [["Events & Calendar", "/news/events-calendar"]] },
  { label: "Disclosure", path: "/disclosure" },
  { label: "Blogs", path: "/blogs" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact Us", path: "/contact-us" },
];

function useReveal() {
  const location = useLocation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: "450px 0px 350px 0px",
      },
    );

    const observeUnrevealed = () => {
      const elements = document.querySelectorAll("[data-reveal]:not(.revealed)");
      elements.forEach((el) => {
        observer.observe(el);
      });
    };

    observeUnrevealed();
    const timer1 = setTimeout(observeUnrevealed, 80);
    const timer2 = setTimeout(observeUnrevealed, 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
    };
  }, [location.pathname]);
}

const HERO_FRAME_COUNT = 230;
const HERO_FIRST_FRAME = "/hero-frames/frame-0001.webp";
let heroFramesCache = null;
let heroFramesPromise = null;
const heroProgressListeners = new Set();
let heroLoadedCount = 0;

// Eagerly preload frame 1 as early as script evaluates
let eagerHeroFirstFrame = null;
if (typeof window !== "undefined") {
  eagerHeroFirstFrame = new Image();
  eagerHeroFirstFrame.src = HERO_FIRST_FRAME;
}

export const heroDecoder = createFrameDecoder({
  totalFrames: HERO_FRAME_COUNT,
  windowAhead: 14,
  windowBehind: 6,
  maxDecodedBudget: 28,
});
if (eagerHeroFirstFrame) {
  heroDecoder.setFallback(eagerHeroFirstFrame);
  heroDecoder.setFrame(0, eagerHeroFirstFrame);
}

export function areHeroFramesLoaded() {
  return (
    heroFramesCache &&
    heroFramesCache.length === HERO_FRAME_COUNT &&
    heroLoadedCount >= HERO_FRAME_COUNT &&
    heroDecoder.isBatchDecoded(0, 16)
  );
}

export function isFirstFrameReady() {
  return !!(
    (heroFramesCache?.[0]?.naturalWidth || heroFramesCache?.[0]?.width) ||
    (eagerHeroFirstFrame?.complete && (eagerHeroFirstFrame?.naturalWidth || eagerHeroFirstFrame?.width))
  );
}

if (typeof window !== "undefined") {
  window.isFirstFrameReady = isFirstFrameReady;
  window.firstFrameReady = isFirstFrameReady;
}

function preloadHeroFrames(onProgress) {
  if (onProgress) heroProgressListeners.add(onProgress);
  if (areHeroFramesLoaded()) {
    onProgress?.(100);
    return Promise.resolve(heroFramesCache);
  }
  if (heroFramesPromise) {
    if (onProgress && heroLoadedCount > 0) {
      onProgress(Math.round((heroLoadedCount / HERO_FRAME_COUNT) * 100));
    }
    return heroFramesPromise;
  }

  heroFramesPromise = new Promise((resolve) => {
    const frames = heroFramesCache || new Array(HERO_FRAME_COUNT).fill(null);
    heroFramesCache = frames;
    let loadedCount = 0;
    const CONCURRENCY = 20;

    const loadFrame = (index) =>
      new Promise((res) => {
        if (index === 1 && eagerHeroFirstFrame?.complete && (eagerHeroFirstFrame.naturalWidth > 0 || eagerHeroFirstFrame.width > 0)) {
          res(eagerHeroFirstFrame);
          return;
        }
        if (frames[index - 1] && (frames[index - 1].naturalWidth > 0 || frames[index - 1].width > 0)) {
          res(frames[index - 1]);
          return;
        }

        const src = `/hero-frames/frame-${String(index).padStart(4, "0")}.webp`;
        let attempt = 0;
        let settled = false;

        const tryLoad = () => {
          if (settled) return;
          attempt++;
          const img = index === 1 && eagerHeroFirstFrame ? eagerHeroFirstFrame : new Image();
          img.decoding = "async";

          let timer = null;
          const onDone = async () => {
            if (settled) return;
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            if (w > 0 && h > 0) {
              settled = true;
              if (timer) clearTimeout(timer);
              if (index <= 5 && typeof img.decode === "function") {
                try {
                  await img.decode();
                } catch { }
              }
              res(img);
            } else {
              retry();
            }
          };

          const retry = () => {
            if (settled) return;
            if (timer) clearTimeout(timer);
            if (attempt >= 4) {
              settled = true;
              res(null);
              return;
            }
            const delay = Math.min(40 * attempt, 200);
            setTimeout(tryLoad, delay);
          };

          timer = setTimeout(retry, 2500);
          img.onload = onDone;
          img.onerror = retry;
          if (!img.src) img.src = src;

          const currW = img.naturalWidth || img.width;
          if (img.complete && currW > 0) {
            onDone();
          }
        };

        tryLoad();
      });

    let lastReportedPercent = -1;
    const markLoaded = (currentIndex, img) => {
      const w = img?.naturalWidth || img?.width;
      if (img && w > 0) {
        frames[currentIndex - 1] = img;
        heroDecoder.setFrame(currentIndex - 1, img);
        if (currentIndex <= 16) {
          heroDecoder.decodeSingleFrame(currentIndex - 1);
        }
      }
      loadedCount++;
      heroLoadedCount = loadedCount;
      const percent = Math.round((loadedCount / HERO_FRAME_COUNT) * 85);
      if (percent !== lastReportedPercent) {
        lastReportedPercent = percent;
        heroProgressListeners.forEach((fn) => {
          try { fn(percent); } catch { }
        });
        window.dispatchEvent(
          new CustomEvent("hero-frames-progress", {
            detail: { loaded: loadedCount, total: HERO_FRAME_COUNT, percent, frameIndex: currentIndex - 1, img },
          }),
        );
      }
    };

    (async () => {
      // 1. First frame immediately
      const firstImg = await loadFrame(1);
      markLoaded(1, firstImg || eagerHeroFirstFrame);
      window.dispatchEvent(new CustomEvent("hero-first-frame-ready", { detail: { img: firstImg || eagerHeroFirstFrame } }));

      // 2. Load all remaining frames with concurrency
      const remaining = [];
      for (let i = 2; i <= HERO_FRAME_COUNT; i++) {
        remaining.push(i);
      }

      let cursor = 0;
      const worker = async () => {
        while (cursor < remaining.length) {
          const idx = remaining[cursor++];
          const img = await loadFrame(idx);
          markLoaded(idx, img);
        }
      };

      const workers = [];
      for (let w = 0; w < Math.min(CONCURRENCY, remaining.length); w++) {
        workers.push(worker());
      }
      await Promise.all(workers);

      // Verify every frame is valid - backfill any missing frame with nearest valid frame
      for (let i = 0; i < HERO_FRAME_COUNT; i++) {
        const w = frames[i]?.naturalWidth || frames[i]?.width;
        if (!frames[i] || !(w > 0)) {
          let fallback = null;
          for (let d = 1; d < HERO_FRAME_COUNT; d++) {
            const pw = frames[i - d]?.naturalWidth || frames[i - d]?.width;
            if (i - d >= 0 && frames[i - d] && pw > 0) {
              fallback = frames[i - d];
              break;
            }
            const nw = frames[i + d]?.naturalWidth || frames[i + d]?.width;
            if (i + d < HERO_FRAME_COUNT && frames[i + d] && nw > 0) {
              fallback = frames[i + d];
              break;
            }
          }
          frames[i] = fallback || frames[0] || eagerHeroFirstFrame;
        }
      }

      heroDecoder.setImages(frames);
      await heroDecoder.preloadInitialBatch(16, (decodedSoFar, limit) => {
        const decodePercent = 85 + Math.round((decodedSoFar / limit) * 15);
        if (decodePercent !== lastReportedPercent) {
          lastReportedPercent = decodePercent;
          heroProgressListeners.forEach((fn) => {
            try { fn(decodePercent); } catch { }
          });
        }
      });
      heroLoadedCount = HERO_FRAME_COUNT;
      heroFramesCache = frames;
      heroDecoder.updatePlayhead(0);
      heroProgressListeners.forEach((fn) => {
        try { fn(100); } catch { }
      });
      heroProgressListeners.clear();
      window.dispatchEvent(new CustomEvent("hero-all-frames-ready", { detail: { frames } }));
      resolve(frames);
    })();
  });

  return heroFramesPromise;
}

const CONTACT_FRAME_COUNT = 164;
const CONTACT_FIRST_FRAME = "/contact-frames/frame-0001.webp";
let contactFramesCache = null;
let contactFramesPromise = null;
const contactProgressListeners = new Set();
let contactLoadedCount = 0;

let eagerContactFirstFrame = null;
if (typeof window !== "undefined") {
  eagerContactFirstFrame = new Image();
  eagerContactFirstFrame.src = CONTACT_FIRST_FRAME;
}

export const contactDecoder = createFrameDecoder({
  totalFrames: CONTACT_FRAME_COUNT,
  windowAhead: 14,
  windowBehind: 6,
  maxDecodedBudget: 28,
});
if (eagerContactFirstFrame) {
  contactDecoder.setFallback(eagerContactFirstFrame);
  contactDecoder.setFrame(0, eagerContactFirstFrame);
}

export function areContactFramesLoaded() {
  return (
    contactFramesCache &&
    contactFramesCache.length === CONTACT_FRAME_COUNT &&
    contactLoadedCount >= CONTACT_FRAME_COUNT &&
    contactDecoder.isBatchDecoded(0, 14)
  );
}

function preloadContactFrames(onProgress) {
  if (onProgress) contactProgressListeners.add(onProgress);
  if (areContactFramesLoaded()) {
    onProgress?.(100);
    return Promise.resolve(contactFramesCache);
  }
  if (contactFramesPromise) {
    if (onProgress && contactLoadedCount > 0) {
      onProgress(Math.round((contactLoadedCount / CONTACT_FRAME_COUNT) * 100));
    }
    return contactFramesPromise;
  }

  contactFramesPromise = new Promise((resolve) => {
    const frames = contactFramesCache || new Array(CONTACT_FRAME_COUNT).fill(null);
    contactFramesCache = frames;
    let loadedCount = 0;
    const CONCURRENCY = 20;

    const loadFrame = (index) =>
      new Promise((res) => {
        if (index === 1 && eagerContactFirstFrame?.complete && (eagerContactFirstFrame.naturalWidth > 0 || eagerContactFirstFrame.width > 0)) {
          res(eagerContactFirstFrame);
          return;
        }
        if (frames[index - 1] && (frames[index - 1].naturalWidth > 0 || frames[index - 1].width > 0)) {
          res(frames[index - 1]);
          return;
        }

        const src = `/contact-frames/frame-${String(index).padStart(4, "0")}.webp`;
        let attempt = 0;
        let settled = false;

        const tryLoad = () => {
          if (settled) return;
          attempt++;
          const img = index === 1 && eagerContactFirstFrame ? eagerContactFirstFrame : new Image();
          img.decoding = "async";

          let timer = null;
          const onDone = async () => {
            if (settled) return;
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            if (w > 0 && h > 0) {
              settled = true;
              if (timer) clearTimeout(timer);
              if (index <= 5 && typeof img.decode === "function") {
                try {
                  await img.decode();
                } catch { }
              }
              res(img);
            } else {
              retry();
            }
          };

          const retry = () => {
            if (settled) return;
            if (timer) clearTimeout(timer);
            if (attempt >= 4) {
              settled = true;
              res(null);
              return;
            }
            const delay = Math.min(40 * attempt, 200);
            setTimeout(tryLoad, delay);
          };

          timer = setTimeout(retry, 2500);
          img.onload = onDone;
          img.onerror = retry;
          if (!img.src) img.src = src;

          const currW = img.naturalWidth || img.width;
          if (img.complete && currW > 0) {
            onDone();
          }
        };

        tryLoad();
      });

    let lastReportedPercent = -1;
    const markLoaded = (currentIndex, img) => {
      const w = img?.naturalWidth || img?.width;
      if (img && w > 0) {
        frames[currentIndex - 1] = img;
        contactDecoder.setFrame(currentIndex - 1, img);
        if (currentIndex <= 14) {
          contactDecoder.decodeSingleFrame(currentIndex - 1);
        }
      }
      loadedCount++;
      contactLoadedCount = loadedCount;
      const percent = Math.round((loadedCount / CONTACT_FRAME_COUNT) * 85);
      if (percent !== lastReportedPercent) {
        lastReportedPercent = percent;
        contactProgressListeners.forEach((fn) => {
          try { fn(percent); } catch { }
        });
        window.dispatchEvent(
          new CustomEvent("contact-frames-progress", {
            detail: { loaded: loadedCount, total: CONTACT_FRAME_COUNT, percent, frameIndex: currentIndex - 1, img },
          }),
        );
      }
    };

    (async () => {
      const firstImg = await loadFrame(1);
      markLoaded(1, firstImg || eagerContactFirstFrame);

      const remaining = [];
      for (let i = 2; i <= CONTACT_FRAME_COUNT; i++) {
        remaining.push(i);
      }

      let cursor = 0;
      const worker = async () => {
        while (cursor < remaining.length) {
          const idx = remaining[cursor++];
          const img = await loadFrame(idx);
          markLoaded(idx, img);
        }
      };

      const workers = [];
      for (let w = 0; w < Math.min(CONCURRENCY, remaining.length); w++) {
        workers.push(worker());
      }
      await Promise.all(workers);

      for (let i = 0; i < CONTACT_FRAME_COUNT; i++) {
        const w = frames[i]?.naturalWidth || frames[i]?.width;
        if (!frames[i] || !(w > 0)) {
          let fallback = null;
          for (let d = 1; d < CONTACT_FRAME_COUNT; d++) {
            const pw = frames[i - d]?.naturalWidth || frames[i - d]?.width;
            if (i - d >= 0 && frames[i - d] && pw > 0) {
              fallback = frames[i - d];
              break;
            }
            const nw = frames[i + d]?.naturalWidth || frames[i + d]?.width;
            if (i + d < CONTACT_FRAME_COUNT && frames[i + d] && nw > 0) {
              fallback = frames[i + d];
              break;
            }
          }
          frames[i] = fallback || frames[0] || eagerContactFirstFrame;
        }
      }

      contactDecoder.setImages(frames);
      await contactDecoder.preloadInitialBatch(14, (decodedSoFar, limit) => {
        const decodePercent = 85 + Math.round((decodedSoFar / limit) * 15);
        if (decodePercent !== lastReportedPercent) {
          lastReportedPercent = decodePercent;
          contactProgressListeners.forEach((fn) => {
            try { fn(decodePercent); } catch { }
          });
        }
      });
      contactLoadedCount = CONTACT_FRAME_COUNT;
      contactFramesCache = frames;
      contactDecoder.updatePlayhead(0);
      contactProgressListeners.forEach((fn) => {
        try { fn(100); } catch { }
      });
      contactProgressListeners.clear();
      window.dispatchEvent(new CustomEvent("contact-all-frames-ready", { detail: { frames } }));
      resolve(frames);
    })();
  });

  return contactFramesPromise;
}

const SPORTS_FRAME_COUNT = 201;
const SPORTS_FIRST_FRAME = "/sports-frames/frame-0001.webp";
let sportsFramesCache = null;
let sportsFramesPromise = null;
const sportsProgressListeners = new Set();
let sportsLoadedCount = 0;

let eagerSportsFirstFrame = null;
if (typeof window !== "undefined") {
  eagerSportsFirstFrame = new Image();
  eagerSportsFirstFrame.src = SPORTS_FIRST_FRAME;
}

export const sportsDecoder = createFrameDecoder({
  totalFrames: SPORTS_FRAME_COUNT,
  windowAhead: 14,
  windowBehind: 6,
  maxDecodedBudget: 28,
});
if (eagerSportsFirstFrame) {
  sportsDecoder.setFallback(eagerSportsFirstFrame);
  sportsDecoder.setFrame(0, eagerSportsFirstFrame);
}

export function areSportsFramesLoaded() {
  return (
    sportsFramesCache &&
    sportsFramesCache.length === SPORTS_FRAME_COUNT &&
    sportsLoadedCount >= SPORTS_FRAME_COUNT &&
    sportsDecoder.isBatchDecoded(0, 14)
  );
}

function preloadSportsFrames(onProgress) {
  if (onProgress) sportsProgressListeners.add(onProgress);
  if (areSportsFramesLoaded()) {
    onProgress?.(100);
    return Promise.resolve(sportsFramesCache);
  }
  if (sportsFramesPromise) {
    if (onProgress && sportsLoadedCount > 0) {
      onProgress(Math.round((sportsLoadedCount / SPORTS_FRAME_COUNT) * 100));
    }
    return sportsFramesPromise;
  }

  sportsFramesPromise = new Promise((resolve) => {
    const frames = sportsFramesCache || new Array(SPORTS_FRAME_COUNT).fill(null);
    sportsFramesCache = frames;
    let loadedCount = 0;
    const CONCURRENCY = 20;

    const loadFrame = (index) =>
      new Promise((res) => {
        if (index === 1 && eagerSportsFirstFrame?.complete && (eagerSportsFirstFrame.naturalWidth > 0 || eagerSportsFirstFrame.width > 0)) {
          res(eagerSportsFirstFrame);
          return;
        }
        if (frames[index - 1] && (frames[index - 1].naturalWidth > 0 || frames[index - 1].width > 0)) {
          res(frames[index - 1]);
          return;
        }

        const src = `/sports-frames/frame-${String(index).padStart(4, "0")}.webp`;
        let attempt = 0;
        let settled = false;

        const tryLoad = () => {
          if (settled) return;
          attempt++;
          const img = index === 1 && eagerSportsFirstFrame ? eagerSportsFirstFrame : new Image();
          img.decoding = "async";

          let timer = null;
          const onDone = async () => {
            if (settled) return;
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            if (w > 0 && h > 0) {
              settled = true;
              if (timer) clearTimeout(timer);
              if (index <= 5 && typeof img.decode === "function") {
                try {
                  await img.decode();
                } catch { }
              }
              res(img);
            } else {
              retry();
            }
          };

          const retry = () => {
            if (settled) return;
            if (timer) clearTimeout(timer);
            if (attempt >= 4) {
              settled = true;
              res(null);
              return;
            }
            const delay = Math.min(40 * attempt, 200);
            setTimeout(tryLoad, delay);
          };

          timer = setTimeout(retry, 2500);
          img.onload = onDone;
          img.onerror = retry;
          if (!img.src) img.src = src;

          const currW = img.naturalWidth || img.width;
          if (img.complete && currW > 0) {
            onDone();
          }
        };

        tryLoad();
      });

    let lastReportedPercent = -1;
    const markLoaded = (currentIndex, img) => {
      const w = img?.naturalWidth || img?.width;
      if (img && w > 0) {
        frames[currentIndex - 1] = img;
        sportsDecoder.setFrame(currentIndex - 1, img);
        if (currentIndex <= 14) {
          sportsDecoder.decodeSingleFrame(currentIndex - 1);
        }
      }
      loadedCount++;
      sportsLoadedCount = loadedCount;
      const percent = Math.round((loadedCount / SPORTS_FRAME_COUNT) * 85);
      if (percent !== lastReportedPercent) {
        lastReportedPercent = percent;
        sportsProgressListeners.forEach((fn) => {
          try { fn(percent); } catch { }
        });
        window.dispatchEvent(
          new CustomEvent("sports-frames-progress", {
            detail: { loaded: loadedCount, total: SPORTS_FRAME_COUNT, percent, frameIndex: currentIndex - 1, img },
          }),
        );
      }
    };

    (async () => {
      const firstImg = await loadFrame(1);
      markLoaded(1, firstImg || eagerSportsFirstFrame);

      const remaining = [];
      for (let i = 2; i <= SPORTS_FRAME_COUNT; i++) {
        remaining.push(i);
      }

      let cursor = 0;
      const worker = async () => {
        while (cursor < remaining.length) {
          const idx = remaining[cursor++];
          const img = await loadFrame(idx);
          markLoaded(idx, img);
        }
      };

      const workers = [];
      for (let w = 0; w < Math.min(CONCURRENCY, remaining.length); w++) {
        workers.push(worker());
      }
      await Promise.all(workers);

      for (let i = 0; i < SPORTS_FRAME_COUNT; i++) {
        const w = frames[i]?.naturalWidth || frames[i]?.width;
        if (!frames[i] || !(w > 0)) {
          let fallback = null;
          for (let d = 1; d < SPORTS_FRAME_COUNT; d++) {
            const pw = frames[i - d]?.naturalWidth || frames[i - d]?.width;
            if (i - d >= 0 && frames[i - d] && pw > 0) {
              fallback = frames[i - d];
              break;
            }
            const nw = frames[i + d]?.naturalWidth || frames[i + d]?.width;
            if (i + d < SPORTS_FRAME_COUNT && frames[i + d] && nw > 0) {
              fallback = frames[i + d];
              break;
            }
          }
          frames[i] = fallback || frames[0] || eagerSportsFirstFrame;
        }
      }

      sportsDecoder.setImages(frames);
      await sportsDecoder.preloadInitialBatch(14, (decodedSoFar, limit) => {
        const decodePercent = 85 + Math.round((decodedSoFar / limit) * 15);
        if (decodePercent !== lastReportedPercent) {
          lastReportedPercent = decodePercent;
          sportsProgressListeners.forEach((fn) => {
            try { fn(decodePercent); } catch { }
          });
        }
      });
      sportsLoadedCount = SPORTS_FRAME_COUNT;
      sportsFramesCache = frames;
      sportsDecoder.updatePlayhead(0);
      sportsProgressListeners.forEach((fn) => {
        try { fn(100); } catch { }
      });
      sportsProgressListeners.clear();
      window.dispatchEvent(new CustomEvent("sports-all-frames-ready", { detail: { frames } }));
      resolve(frames);
    })();
  });

  return sportsFramesPromise;
}

// Silently prefetch remaining frame sequences when idle and not scrolling
function idlePrefetchOtherFrames() {
  const runPrefetch = () => {
    if (typeof window === "undefined") return;
    const pathname = window.location.pathname;
    if (window.__isUserScrolling) {
      setTimeout(runPrefetch, 4000);
      return;
    }
    if (pathname !== "/" && pathname !== "" && !areHeroFramesLoaded()) {
      preloadHeroFrames();
    }
    if (pathname !== "/contact-us" && !areContactFramesLoaded()) {
      preloadContactFrames();
    }
    if (pathname !== "/gallery/photos-videos" && !areSportsFramesLoaded()) {
      preloadSportsFrames();
    }
  };

  if (typeof window !== "undefined") {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(runPrefetch, { timeout: 12000 });
    } else {
      setTimeout(runPrefetch, 8000);
    }
  }
}

function GlobalLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(1);
  const lineRef = useRef(null);
  const percentRef = useRef(null);
  const isFirstLoadRef = useRef(true);

  // Lock scrolling completely while assets & all target frames are loading
  useEffect(() => {
    if (loading) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (window.__lenis) {
        window.__lenis.stop();
        window.__lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        if (window.__lenis) window.__lenis.start();
      };
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (window.__lenis) window.__lenis.start();
    }
  }, [loading]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setProgress(1);

    const pathname = location.pathname;
    const cleanPath = pathname.replace(/\/+$/, "") || "/";
    const isHomePage = cleanPath === "/";
    const isContactPage = cleanPath.includes("contact-us");
    const isSportsPage = cleanPath.includes("photos-videos");
    const hasFrameSequence = isHomePage || isContactPage || isSportsPage;

    let assetsDone = false;
    let framesDone = !hasFrameSequence;
    let windowLoaded = document.readyState === "complete";
    let firstFramePainted =
      !isHomePage ||
      !!(heroFramesCache?.[0]?.naturalWidth || heroFramesCache?.[0]?.width) ||
      !!(eagerHeroFirstFrame?.complete && (eagerHeroFirstFrame?.naturalWidth || eagerHeroFirstFrame?.width));
    let firstFrameReady = firstFramePainted;
    let assetsProg = 10;
    let framesProg = !hasFrameSequence ? 100 : 0;
    let isAllDone = false;

    // Smooth continuous progress interpolation state
    let displayVal = 1;
    let targetVal = 10;
    let rafId = null;

    const updateCombinedTarget = () => {
      if (cancelled) return;
      const real = hasFrameSequence
        ? Math.round(assetsProg * 0.3 + framesProg * 0.7)
        : assetsProg;
      targetVal = Math.max(targetVal, Math.min(isAllDone ? 100 : 99, real));
    };

    const finishLoading = () => {
      if (cancelled) return;
      if (isHomePage && !areHeroFramesLoaded()) {
        preloadHeroFrames().then(() => {
          if (!cancelled) finishLoading();
        });
        return;
      }
      if (isContactPage && !areContactFramesLoaded()) {
        preloadContactFrames().then(() => {
          if (!cancelled) finishLoading();
        });
        return;
      }
      if (isSportsPage && !areSportsFramesLoaded()) {
        preloadSportsFrames().then(() => {
          if (!cancelled) finishLoading();
        });
        return;
      }
      isFirstLoadRef.current = false;
      setLoading(false);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (window.__lenis) {
        window.__lenis.start();
        window.__isUserScrolling = false;
      }
      document.dispatchEvent(new Event("qb-loader-done"));
      requestScrollRefresh();
      idlePrefetchOtherFrames();
    };

    const checkAllDone = () => {
      if (cancelled || isAllDone) return;
      if (isHomePage && !areHeroFramesLoaded()) return;
      if (isContactPage && !areContactFramesLoaded()) return;
      if (isSportsPage && !areSportsFramesLoaded()) return;
      if (assetsDone && framesDone && (windowLoaded || document.readyState === "complete" || document.readyState === "interactive") && (firstFramePainted || firstFrameReady)) {
        isAllDone = true;
        targetVal = 100;
      }
    };

    let lastReportedInt = 1;

    // 60/120fps continuous progress ticker — smoothly interpolates towards real progress without freezing
    const tick = () => {
      if (cancelled) return;

      if (isAllDone) {
        targetVal = 100;
        displayVal = 100;
      }

      const diff = targetVal - displayVal;
      if (diff > 0.05) {
        const step = isAllDone
          ? 100
          : Math.max(1.2, Math.min(4.5, diff * 0.28));
        displayVal = Math.min(targetVal, displayVal + step);
      } else if (!isAllDone && displayVal < 94) {
        displayVal = Math.min(94, displayVal + 0.25);
      }

      const intVal = Math.min(100, Math.floor(displayVal));

      // Direct high-performance DOM update for 60/120fps fluidity
      if (lineRef.current) {
        lineRef.current.style.width = `${displayVal}%`;
      }
      if (percentRef.current && intVal !== lastReportedInt) {
        percentRef.current.textContent = `${intVal}%`;
      }

      if (intVal !== lastReportedInt) {
        lastReportedInt = intVal;
        setProgress((prev) => (intVal > prev ? intVal : prev));
      }

      if (isAllDone && displayVal >= 99.0) {
        if (isHomePage && !areHeroFramesLoaded()) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        if (isContactPage && !areContactFramesLoaded()) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        if (isSportsPage && !areSportsFramesLoaded()) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        if (lineRef.current) lineRef.current.style.width = "100%";
        if (percentRef.current) percentRef.current.textContent = "100%";
        setProgress(100);
        requestAnimationFrame(() => {
          if (!cancelled) finishLoading();
        });
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // Track full window load state
    if (!windowLoaded && document.readyState !== "complete" && document.readyState !== "interactive") {
      const onWindowLoad = () => {
        windowLoaded = true;
        checkAllDone();
      };
      window.addEventListener("load", onWindowLoad, { once: true });
    } else {
      windowLoaded = true;
    }

    // On Home page: ensure hero first frame has painted before releasing loader
    if (isHomePage && !firstFramePainted) {
      const onFirstFrame = () => {
        firstFramePainted = true;
        firstFrameReady = true;
        checkAllDone();
      };
      window.addEventListener("hero-first-frame-ready", onFirstFrame, { once: true });
    }

    // 1. Preload and decode critical above-the-fold media assets & fonts without blocking on below-the-fold images
    const waitForAssets = async () => {
      try {
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        if (cancelled) return;

        // Prioritize immediate above-the-fold DOM images
        const domImages = Array.from(document.images);
        const priorityImages = domImages.slice(0, 8);
        priorityImages.forEach((img) => {
          if (img.loading !== "eager") img.loading = "eager";
        });

        // Collect critical image URLs required by the current route
        const urlSet = new Set();
        urlSet.add("/images/logo.png");
        if (isHomePage) {
          urlSet.add(IMG.bg);
          urlSet.add(IMG.campus);
        }
        priorityImages.forEach((img) => {
          const src = img.currentSrc || img.src;
          if (src && typeof src === "string" && !src.startsWith("data:") && !src.endsWith(".pdf")) {
            urlSet.add(src);
          }
        });

        const uniqueUrls = Array.from(urlSet);
        const videos = Array.from(document.querySelectorAll("video")).slice(0, 2);
        const total = Math.max(1, uniqueUrls.length + videos.length + 1); // +1 for fonts
        let loaded = 0;

        const handleOneLoaded = () => {
          loaded++;
          assetsProg = Math.min(100, Math.round((loaded / total) * 100));
          updateCombinedTarget();
        };

        // Preload priority image URLs into memory
        const imagePromises = uniqueUrls.map((url) =>
          preloadAndDecodeImage(url).then(() => {
            handleOneLoaded();
          })
        );

        // Also ensure priority DOM image elements complete
        const domPromises = priorityImages.map((img) => {
          return new Promise((resolve) => {
            if (img.complete) {
              resolve();
              return;
            }
            let done = false;
            const finish = () => {
              if (done) return;
              done = true;
              resolve();
            };
            img.addEventListener("load", finish, { once: true });
            img.addEventListener("error", finish, { once: true });
            setTimeout(finish, 800);
          });
        });

        // Video readiness (loadeddata/canplay is sufficient for initial view without blocking)
        const videoPromises = videos.map(
          (video) =>
            new Promise((resolve) => {
              if (video.readyState >= 2) {
                handleOneLoaded();
                resolve();
                return;
              }
              let done = false;
              const onDone = () => {
                if (done) return;
                done = true;
                handleOneLoaded();
                resolve();
              };
              video.addEventListener("loadeddata", onDone, { once: true });
              video.addEventListener("canplay", onDone, { once: true });
              video.addEventListener("canplaythrough", onDone, { once: true });
              video.addEventListener("error", onDone, { once: true });
              setTimeout(onDone, 1000);
            })
        );

        // Font readiness
        const fontPromise = document.fonts?.ready
          ? document.fonts.ready.then(() => handleOneLoaded()).catch(() => handleOneLoaded())
          : Promise.resolve().then(() => handleOneLoaded());

        await Promise.all([
          ...imagePromises,
          ...domPromises,
          ...videoPromises,
          fontPromise,
        ]);
      } catch {
        // Continue even if an optional font or image fails
      }
      if (!cancelled) {
        assetsDone = true;
        assetsProg = 100;
        updateCombinedTarget();
        checkAllDone();
      }
    };

    // 2. Preload frames with real continuous progress
    if (isHomePage) {
      if (areHeroFramesLoaded()) {
        framesDone = true;
        framesProg = 100;
        firstFramePainted = true;
        firstFrameReady = true;
        updateCombinedTarget();
        checkAllDone();
      } else {
        preloadHeroFrames((percent) => {
          framesProg = percent;
          updateCombinedTarget();
        })
          .then(() => {
            if (!cancelled) {
              framesDone = true;
              framesProg = 100;
              firstFramePainted = true;
              firstFrameReady = true;
              updateCombinedTarget();
              checkAllDone();
            }
          })
          .catch(() => {
            if (!cancelled) {
              framesDone = true;
              checkAllDone();
            }
          });
      }
    } else if (isContactPage) {
      if (areContactFramesLoaded()) {
        framesDone = true;
        framesProg = 100;
        updateCombinedTarget();
        checkAllDone();
      } else {
        preloadContactFrames((percent) => {
          framesProg = percent;
          updateCombinedTarget();
        })
          .then(() => {
            if (!cancelled) {
              framesDone = true;
              framesProg = 100;
              updateCombinedTarget();
              checkAllDone();
            }
          })
          .catch(() => {
            if (!cancelled) {
              framesDone = true;
              checkAllDone();
            }
          });
      }
    } else if (isSportsPage) {
      if (areSportsFramesLoaded()) {
        framesDone = true;
        framesProg = 100;
        updateCombinedTarget();
        checkAllDone();
      } else {
        preloadSportsFrames((percent) => {
          framesProg = percent;
          updateCombinedTarget();
        })
          .then(() => {
            if (!cancelled) {
              framesDone = true;
              framesProg = 100;
              updateCombinedTarget();
              checkAllDone();
            }
          })
          .catch(() => {
            if (!cancelled) {
              framesDone = true;
              checkAllDone();
            }
          });
      }
    }

    waitForAssets();
    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  return (
    <div
      className={`global-loader ${loading ? "is-visible" : "is-hidden"}`}
      aria-hidden={!loading}
    >
      <div className="loader-inner">
        <div className="loader-logo">
          <img src="/images/logo.png" alt="Jain Heritage School" decoding="async" />
        </div>
        <p>JAIN HERITAGE SCHOOL</p>
        <div className="loader-line">
          <span ref={lineRef} style={{ width: `${progress}%` }} />
        </div>
        <div ref={percentRef} className="loader-percent">{progress}%</div>
      </div>
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false),
    [active, setActive] = useState(null),
    [solid, setSolid] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    setOpen(false);
    setActive(null);
  }, [loc.pathname]);

  useEffect(() => {
    let ticking = false;
    const f = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setSolid((prev) => {
            const next = window.scrollY > 50;
            return prev === next ? prev : next;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={"header " + (solid ? "solid" : "")}>
      <Link className="brand" to="/">
        <span className="brand-orb">
          <img
            src="/images/logo.png"
            alt="JHS Belagavi Logo"
            width="50px"
            className="h-10 w-auto object-contain"
            decoding="async"
          />
        </span>
        <span>
          <strong>JAIN HERITAGE SCHOOL</strong>
          <small>BEST CBSE SCHOOL IN BELAGAVI</small>
        </span>
      </Link>
      <nav className={open ? "nav open" : "nav"}>
        {menus.map((m, i) =>
          m.children ? (
            <div className="nav-group" key={m.label}>
              <button
                className="nav-item"
                onClick={() => setActive(active === i ? null : i)}
              >
                {m.label}
                <ChevronDown size={14} />
              </button>
              <div className={"dropdown " + (active === i ? "show" : "")}>
                {m.children.map(([t, p]) => (
                  <Link key={p} to={p}>
                    {t}
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link className="nav-item" key={m.label} to={m.path}>
              {m.label}
            </Link>
          ),
        )}
      </nav>
      <button className="header-cta" onClick={openAdmissionModal}>
        Apply Now <ArrowDownRight size={16} />
      </button>
      <button className="hamb" onClick={() => setOpen(!open)}>
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}

function SmoothScroll() {
  const location = useLocation();

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      syncTouch: false,
      infinite: false,
      autoRaf: false,
    });

    window.__lenis = lenis;

    let scrollTimer = null;
    const onLenisScroll = (e) => {
      if (e && Math.abs(e.velocity || 0) > 0.05) {
        window.__isUserScrolling = true;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          window.__isUserScrolling = false;
        }, 700);
      }
      ScrollTrigger.update();
    };
    lenis.on("scroll", onLenisScroll);

    const onRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update, false, true);
    gsap.ticker.lagSmoothing(500, 33);

    const onOpenModal = () => lenis.stop();
    const onCloseModal = () => lenis.start();
    window.addEventListener("open-admission-modal", onOpenModal);
    window.addEventListener("close-admission-modal", onCloseModal);

    return () => {
      clearTimeout(scrollTimer);
      window.__isUserScrolling = false;
      cancelScrollRefresh();
      window.removeEventListener("open-admission-modal", onOpenModal);
      window.removeEventListener("close-admission-modal", onCloseModal);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(update);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  // On route change: immediately reset scroll and refresh layout
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }
    ScrollTrigger.clearScrollMemory();
    const timer = setTimeout(() => {
      requestScrollRefresh();
    }, 120);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}

/* Aardvark-inspired floating book motif — a single reusable layered book
   (cover + gilt + pages) animated by scrollFX.js + CSS. Every placement on
   the site reuses this one component with a different composition class. */
function FloatingBook({ variant = "chip", pos = "", depth = "near", style }) {
  return (
    <div
      className={[
        "floating-book",
        `floating-book--${variant}`,
        depth === "far" ? "floating-book--depth-far" : "",
        pos,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <div className="floating-book-inner">
        <span className="floating-book-pages" />
        <span className="floating-book-bottom" />
      </div>
    </div>
  );
}

function FloatingBooksDecoration({ count = 3, className = "" }) {
  /* Renders a small cluster of floating books as a contextual accent.
     Keeps the existing FloatingBook component and animations intact but
     lets each call site control how many books appear and apply its own
     positioning class. */
  const variants = [
    { variant: "band-a", depth: "near" },
    { variant: "band-b", depth: "near" },
    { variant: "band-c", depth: "far" },
    { variant: "chip-gold", depth: "far" },
    {
      variant: "chip",
      depth: "far",
      style: { "--book-cover": "var(--purple)", "--book-cover-2": "#55317e" },
    },
  ];
  return (
    <div
      className={`floating-books-decoration ${className}`.trim()}
      aria-hidden="true"
    >
      {variants.slice(0, count).map((b, i) => (
        <FloatingBook
          key={i}
          variant={b.variant}
          pos={`fb-pos-${String.fromCharCode(97 + i)}`}
          depth={b.depth}
          style={b.style}
        />
      ))}
    </div>
  );
}

/* =========================================================
   SECTION DIVIDER — thin editorial rule between major sections
   Inspired by: mhdesignbuild.in / Royal Baagh editorial rhythm
   ========================================================= */
function SectionDivider({ label = "" }) {
  return (
    <div className="section-divider" aria-hidden="true">
      <span className="sd-line" />
      {label && <span className="sd-label">{label}</span>}
      <span className="sd-line" />
    </div>
  );
}

/* =========================================================
   CINEMATIC STAT COUNTER — large editorial number with label
   ========================================================= */
function StatCounter({ value, suffix = "", label }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const num = parseFloat(value);
    if (isNaN(num)) return;
    el.dataset.counter = num;
    el.dataset.counterSuffix = suffix;
  }, [value, suffix]);
  return (
    <div className="stat-counter">
      <span ref={ref} className="stat-counter-value" data-counter={parseFloat(value) || 0} data-counter-suffix={suffix}>
        {value}{suffix}
      </span>
      <span className="stat-counter-label">{label}</span>
    </div>
  );
}

/* =========================================================
   EDITORIAL MARQUEE — bottom-of-section moving text
   Inspired by: Draft & Stone marquee text strips
   ========================================================= */
function EditorialMarquee({ items, dark = false }) {
  return (
    <div className={`editorial-marquee ${dark ? "editorial-marquee--dark" : ""}`.trim()}>
      <div className="em-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="em-item">
            {item} <i aria-hidden="true">◆</i>
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   HORIZONTAL SCROLL STRIP — cinematic sideways gallery
   Scroll-driven: vertical page scroll moves the track sideways.
   The section is pinned for exactly as long as it takes to
   travel through every card, then releases cleanly.

   Lenis + GSAP ScrollTrigger compatibility notes:
   • Lenis fires native scroll events, so ScrollTrigger reads
     window.scrollY correctly — no scrollerProxy needed.
   • We do NOT scope gsap.context() to the section element
     because the section itself is the pin target; scoping
     causes GSAP to fight its own pin calculations.
   • scrub: true (= scrub: 0 lag) keeps movement 1-to-1 with
     scroll position, which works best with Lenis's own lerp.
   • overflow must NOT be hidden on the outer section — the
     pin spacer is injected as a sibling and needs to be visible.
   ========================================================= */
function HorizontalScrollStrip({ items }) {
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const stRef = useRef(null); // holds the ScrollTrigger instance
  const tweenRef = useRef(null); // holds the scrubbed horizontal tween

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const isMobile = () => window.innerWidth < 769;

    // ── Single, stable ScrollTrigger built ONCE ──────────────────────
    //
    // HOW TRAVEL IS MEASURED (this is what makes every middle card visible):
    // We slide the track by exactly the distance between the FIRST card's left
    // edge and the LAST card's right edge minus one viewport. Using the real
    // card rects — not `track.scrollWidth` — matters because `.hscroll-track`
    // carries `padding: 0 8vw`. `scrollWidth` includes that trailing 8vw, so
    // the old measurement overshot by ~1 card and the strip ended on empty
    // space (and, with the pin broken, that overshoot was the only part of the
    // range ever seen). Card-to-card measurement lands the final card flush to
    // the right viewport edge with no dead travel at either end.
    const measureTravel = () => {
      const cards = track.querySelectorAll(".hscroll-card");
      if (cards.length < 2) return 0;
      const first = cards[0];
      const last = cards[cards.length - 1];
      // Distance from the first card's left edge to the last card's right
      // edge, measured in the track's own (untransformed) coordinate space.
      const spanLeft = first.offsetLeft;
      const spanRight = last.offsetLeft + last.offsetWidth;
      const contentWidth = spanRight - spanLeft;
      const viewport = section.clientWidth;
      // Travel = how far the track must move so the last card's right edge
      // sits at the viewport's right edge, plus the leading gutter so the
      // first card starts exactly at the viewport's left edge.
      const leadingGutter = first.offsetLeft; // == 8vw padding
      const travel = contentWidth - viewport + leadingGutter;
      return Math.max(0, Math.round(travel));
    };

    let st = null;

    const create = () => {
      if (st || isMobile()) return;

      // Deterministic start state: the track begins untranslated so the first
      // card is flush to the left edge of the pinned viewport.
      gsap.set(track, { x: 0 });

      const getTravel = () => measureTravel();

      const tween = gsap.to(track, {
        x: () => -getTravel(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getTravel()}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          fastScrollEnd: false,
          onRefresh: () => { },
        },
      });

      tweenRef.current = tween;
      stRef.current = tween.scrollTrigger;
      st = tween.scrollTrigger;
      // expose for scrollFX containerAnimation lookups
      track.__hscrollTween = tween;
    };

    const destroy = () => {
      if (stRef.current) { stRef.current.kill(); stRef.current = null; }
      if (tweenRef.current) { tweenRef.current.kill(); tweenRef.current = null; }
      st = null;
      gsap.set(track, { clearProps: "x,transform" });
    };

    // Enter/leave the pinned mode as the viewport crosses the mobile bp.
    const syncMode = () => {
      if (isMobile()) {
        destroy();
      } else if (!st) {
        create();
        st?.refresh(); // refresh ONLY this trigger, not the whole page
      }
    };

    // Build synchronously so track.__hscrollTween is available for downstream listeners,
    // and run targeted trigger refresh on the next animation frame.
    create();
    const rafId = requestAnimationFrame(() => {
      st?.refresh();
    });

    // ── ResizeObserver: the robust, race-free re-measure trigger ──────
    // Fires when the track's content box actually changes size (images
    // finishing decode, fonts settling, layout shifts). We refresh only
    // THIS trigger, avoiding the global-refresh storm that corrupted
    // measurements before. Defers refresh if user is actively scrolling.
    let roRaf = 0;
    let pendingRoRefresh = false;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(roRaf);
      roRaf = requestAnimationFrame(() => {
        if (typeof window !== "undefined" && window.__isUserScrolling) {
          pendingRoRefresh = true;
          return;
        }
        pendingRoRefresh = false;
        syncMode();
        st?.refresh();
      });
    });
    ro.observe(track);

    const onScrollSettle = () => {
      if (pendingRoRefresh && !window.__isUserScrolling) {
        pendingRoRefresh = false;
        syncMode();
        st?.refresh();
      }
    };
    window.addEventListener("scroll", onScrollSettle, { passive: true });

    // Window resize toggles pinned/mobile mode (RO covers width changes too,
    // but this guarantees mode switching at the breakpoint).
    let resizeTimer = null;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(syncMode, 160);
    };
    window.addEventListener("resize", onResize);

    // When the global loader finishes (hero frames decoded, layout final)
    // do ONE targeted refresh of this trigger.
    const onLoaderDone = () => {
      syncMode();
      st?.refresh();
    };
    document.addEventListener("qb-loader-done", onLoaderDone, { once: true });

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(roRaf);
      clearTimeout(resizeTimer);
      ro.disconnect();
      window.removeEventListener("scroll", onScrollSettle);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("qb-loader-done", onLoaderDone);
      if (track) delete track.__hscrollTween;
      destroy();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hscroll-section"
      aria-label="Photo gallery horizontal scroll"
    >
      <div className="hscroll-track" ref={trackRef}>
        {items.map((item, i) => (
          <div key={i} className="hscroll-card">
            <div className="hscroll-card-inner">
              {/* eager decode: card width is CSS-fixed, but decoding the
                  image up-front keeps the track's scrollWidth stable so the
                  pin travel is measured correctly (no lazy-load race). */}
              <img src={item.image} alt={item.title} decoding="async" />
              <div className="hscroll-card-overlay">
                <span className="eyebrow">{item.category}</span>
                <h3>{item.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hscroll-hint" aria-hidden="true">
        <span />
        SCROLL TO EXPLORE
      </div>
    </section>
  );
}

/* =========================================================
   CINEMATIC IMAGE REVEAL — clip-path reveal with overlay
   Inspired by: mhdesignbuild.in / Royal Baagh image masking
   ========================================================= */
function CinematicReveal({ image, alt, kicker, headline, body, reverse = false }) {
  const revealRef = useRef(null);
  useLayoutEffect(() => {
    const el = revealRef.current;
    if (!el) return;
    const img = el.querySelector(".cr-image");
    const copy = el.querySelector(".cr-copy");
    if (!img || !copy) return;

    // Prevent duplicate scrollFX registrations that create micro-stutter
    img.dataset.fxClipDone = "1";
    copy.dataset.fxRevealDone = "1";

    const ctx = gsap.context(() => {
      gsap.fromTo(img,
        { clipPath: "inset(0 100% 0 0)", scale: 1.12 },
        {
          clipPath: "inset(0 0% 0 0)",
          scale: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 75%", once: true },
          onComplete: () => {
            img.classList.add("cr-revealed");
          },
        }
      );
      gsap.fromTo(copy.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 72%", once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={revealRef} className={`cinematic-reveal ${reverse ? "cinematic-reveal--reverse" : ""}`.trim()}>
      <div className="cr-image-wrap">
        <img className="cr-image" src={image} alt={alt} loading="eager" decoding="async" />
      </div>
      <div className="cr-copy">
        {kicker && <p className="eyebrow cr-kicker">{kicker}</p>}
        <h2 className="cr-headline">{headline}</h2>
        {body && <p className="cr-body">{body}</p>}
      </div>
    </div>
  );
}

/* =========================================================
   STICKY STORYTELLING PANEL — scroll-driven image + copy swap
   Synchronized directly with scroll progress so slowing/stopping
   the scroll slows/stops the animation. Each panel occupies its own
   generous scroll "window" and the sticky left column holds in place.
   ========================================================= */
function StickyStoryteller({ panels }) {
  const wrapRef = useRef(null);
  const stickyRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const count = panels.length;

  const setActive = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(count - 1, idx));
    if (clamped !== activeIndexRef.current) {
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
    }
  }, [count]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const panelsEl = wrap.querySelector(".sst-panels");
    if (!panelsEl) return;

    const panelEls = Array.from(panelsEl.querySelectorAll(".sst-panel"));
    if (!panelEls.length) return;

    // Eagerly preload and decode all panel images to avoid decode latency or blank flashes
    panels.forEach((p) => {
      if (p.image) {
        const img = new Image();
        img.decoding = "async";
        img.src = p.image;
        if (typeof img.decode === "function") {
          img.decode().catch(() => { });
        }
      }
    });

    let rafId = null;
    let isNearViewport = false;
    let cachedOffsets = [];
    let cachedWrapTop = 0;
    let cachedWrapHeight = 0;
    let cachedStickyHeight = 0;

    const measureOffsets = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const rect = wrap.getBoundingClientRect();
      cachedWrapTop = rect.top + scrollY;
      cachedWrapHeight = rect.height;
      if (stickyRef.current) {
        cachedStickyHeight = stickyRef.current.offsetHeight;
      }
      cachedOffsets = panelEls.map((el) => ({
        top: el.offsetTop,
        bottom: el.offsetTop + el.offsetHeight,
      }));
    };
    measureOffsets();

    const resolveActive = () => {
      if (!isNearViewport) return;
      const vh = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const wrapRectTop = cachedWrapTop - scrollY;
      const wrapRectBottom = wrapRectTop + cachedWrapHeight;

      // Guard: skip if section is far offscreen to save work
      if (wrapRectBottom < -120) {
        if (activeIndexRef.current !== count - 1) setActive(count - 1);
        return;
      }
      if (wrapRectTop > vh + 120) {
        if (activeIndexRef.current !== 0) setActive(0);
        return;
      }

      // Focal reading line is calibrated at ~42% from the viewport top on desktop.
      // On mobile and tablet (single-column stacked view), calibrate reading focal line dynamically
      // right below the pinned image and stage pills.
      const isStacked = window.innerWidth <= 900;
      let focalY = vh * 0.42;
      if (isStacked && cachedStickyHeight) {
        focalY = cachedStickyHeight + Math.min(80, vh * 0.12);
      }
      const panelCount = cachedOffsets.length;
      if (!panelCount) return;

      const firstTop = wrapRectTop + cachedOffsets[0].top;
      const lastBottom = wrapRectTop + cachedOffsets[panelCount - 1].bottom;

      let nextIdx = 0;

      if (firstTop > focalY) {
        nextIdx = 0;
      } else if (lastBottom <= focalY) {
        nextIdx = panelCount - 1;
      } else {
        let found = false;
        for (let i = 0; i < panelCount; i++) {
          const pTop = wrapRectTop + cachedOffsets[i].top;
          const pBottom = wrapRectTop + cachedOffsets[i].bottom;
          if (pTop <= focalY && pBottom > focalY) {
            nextIdx = i;
            found = true;
            break;
          }
        }
        if (!found) {
          let minDist = Infinity;
          for (let i = 0; i < panelCount; i++) {
            const pTop = wrapRectTop + cachedOffsets[i].top;
            const pBottom = wrapRectTop + cachedOffsets[i].bottom;
            const center = (pTop + pBottom) / 2;
            const dist = Math.abs(center - focalY);
            if (dist < minDist) {
              minDist = dist;
              nextIdx = i;
            }
          }
        }
      }

      setActive(nextIdx);
    };

    const handleScroll = () => {
      if (!isNearViewport) return;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        resolveActive();
        rafId = null;
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        isNearViewport = entries[0]?.isIntersecting ?? false;
        if (isNearViewport) {
          measureOffsets();
          resolveActive();
        }
      },
      { rootMargin: "350px 0px 350px 0px" }
    );
    io.observe(wrap);

    const onResizeOrRefresh = () => {
      measureOffsets();
      resolveActive();
    };

    // Attach passive listeners for scroll and window resize
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", onResizeOrRefresh, { passive: true });

    // Initial check on mount
    resolveActive();

    // Re-check whenever ScrollTrigger or layout refreshes
    ScrollTrigger.addEventListener("refresh", onResizeOrRefresh);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", onResizeOrRefresh);
      ScrollTrigger.removeEventListener("refresh", onResizeOrRefresh);
    };
  }, [panels, count, setActive]);

  const scrollToStage = (idx) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const panelEls = Array.from(wrap.querySelectorAll(".sst-panel"));
    const targetEl = panelEls[idx];
    if (!targetEl) return;

    // Immediate UI feedback on click
    setActive(idx);

    const vh = window.innerHeight;
    const rect = targetEl.getBoundingClientRect();
    const isStacked = window.innerWidth <= 900;
    let targetOffset = vh * 0.42;
    if (isStacked && stickyRef.current) {
      const stickyRect = stickyRef.current.getBoundingClientRect();
      targetOffset = stickyRect.bottom + 20;
    }
    const scrollY = window.scrollY || window.pageYOffset || 0;
    // Align panel top with focal line so target stage becomes actively focused and visible
    const targetScrollY = Math.max(0, scrollY + rect.top - targetOffset + 2);

    if (window.__lenis) {
      window.__lenis.scrollTo(targetScrollY, { duration: 0.9 });
    } else {
      window.scrollTo({
        top: targetScrollY,
        behavior: "smooth",
      });
    }
  };

  return (
    <div ref={wrapRef} className="sticky-storyteller">
      {/* ── Left sticky panel ── */}
      <div ref={stickyRef} className="sst-sticky">
        <div className="sst-image-wrap">
          {panels.map((panel, i) => (
            <img
              key={i}
              src={panel.image}
              alt={panel.title}
              className={`sst-image ${activeIndex === i ? "sst-image--active" : ""}`.trim()}
              loading="eager"
              decoding="async"
            />
          ))}
          {/* Active stage badge on image */}
          <div className="sst-image-badge" aria-live="polite">
            <span className="sst-badge-dot" />
            <span>{panels[activeIndex]?.kicker || `STAGE 0${activeIndex + 1}`}</span>
          </div>
        </div>

        {/* Quick-jump stage indicator pills */}
        <div className="sst-stage-track" aria-label="Learning Stages">
          {panels.map((panel, i) => (
            <button
              key={i}
              type="button"
              className={`sst-stage-pill ${activeIndex === i ? "is-active" : ""}`}
              onClick={() => scrollToStage(i)}
              aria-label={`Go to ${panel.kicker}: ${panel.title}`}
            >
              <span className="ssp-num">0{i + 1}</span>
              <span className="ssp-name">
                {panel.kicker.replace(/^STAGE\s*\d+\s*[·•-]\s*/i, "")}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Right scrollable panels ── */}
      <div className="sst-panels">
        {panels.map((panel, i) => (
          <div
            key={i}
            className={`sst-panel ${activeIndex === i ? "sst-panel--active" : ""}`.trim()}
            onClick={() => scrollToStage(i)}
            style={{ cursor: "pointer" }}
            title={`Click to view ${panel.kicker}`}
          >
            <div className="sst-panel-meta">
              <span className="sst-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="sst-kicker-badge">{panel.kicker}</span>
            </div>
            <h4>{panel.title}</h4>
            <p>{panel.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
function BookChip({ side = "right", tone = "gold", size = "s2", seed = 0 }) {
  return (
    <span
      className={`book-chip book-chip--${side} book-chip--${size} book-chip--r${seed % 4}`}
      aria-hidden="true"
    >
      <FloatingBook
        variant={`chip-${tone}`}
        style={{ position: "relative", inset: "auto" }}
      />
    </span>
  );
}

function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef(heroFramesCache || new Array(HERO_FRAME_COUNT).fill(null));
  const currentFrameRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(() => areHeroFramesLoaded());
  const [firstFrameReady, setFirstFrameReady] = useState(
    !!(heroFramesCache?.[0]?.naturalWidth || heroFramesCache?.[0]?.width || (eagerHeroFirstFrame?.complete && (eagerHeroFirstFrame?.naturalWidth || eagerHeroFirstFrame?.width)))
  );
  const words = ["Beyond", "Curiosity", "Knowledge", "Imagination", "Vibrant"];
  const heroWordRef = useRef(null);
  const lastHeroWordRef = useRef(words[0]);

  const canvasDimsRef = useRef({ width: 0, height: 0, dpr: 1 });
  const lastDrawnFrameRef = useRef(-1);
  const contextRef = useRef(null);

  const getCanvasContext = useCallback(() => {
    if (contextRef.current) return contextRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (ctx) {
      ctx.imageSmoothingQuality = "medium";
      contextRef.current = ctx;
    }
    return ctx;
  }, []);

  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    if (
      canvasDimsRef.current.width !== width ||
      canvasDimsRef.current.height !== height ||
      canvasDimsRef.current.dpr !== dpr
    ) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvasDimsRef.current = { width, height, dpr };
      contextRef.current = null;
      lastDrawnFrameRef.current = -1;
      const ctx = getCanvasContext();
      if (ctx) ctx.imageSmoothingQuality = "medium";
    }
  }, [getCanvasContext]);

  // Paint helper - strictly draws into existing texture without reallocating canvas dimensions
  const paintFrameToCanvas = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return false;
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    if (!imgW || !imgH) return false;
    const context = getCanvasContext();
    if (!context) return false;
    if (!canvasDimsRef.current.width) {
      updateCanvasDimensions();
    }
    const { width, height, dpr } = canvasDimsRef.current;
    if (!width || !height) return false;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const scale = Math.max(
      width / imgW,
      height / imgH,
    );
    const imageWidth = imgW * scale;
    const imageHeight = imgH * scale;
    context.drawImage(
      img,
      Math.round((width - imageWidth) / 2),
      Math.round((height - imageHeight) / 2),
      Math.round(imageWidth),
      Math.round(imageHeight),
    );
    return true;
  }, [getCanvasContext, updateCanvasDimensions]);

  useEffect(() => {
    let cancelled = false;

    if (areHeroFramesLoaded()) {
      setIsLoaded(true);
      setFirstFrameReady(true);
      if (heroFramesCache) framesRef.current = heroFramesCache;
      return;
    }

    const onProgress = (e) => {
      if (!cancelled && e.detail) {
        if (heroFramesCache && framesRef.current !== heroFramesCache) {
          framesRef.current = heroFramesCache;
        }
        if (
          e.detail.frameIndex !== undefined &&
          Math.abs(e.detail.frameIndex - currentFrameRef.current) <= 4
        ) {
          const activeImg = framesRef.current[currentFrameRef.current] || heroFramesCache?.[currentFrameRef.current] || e.detail.img;
          if (activeImg) {
            paintFrameToCanvas(activeImg);
          }
        }
      }
    };
    window.addEventListener("hero-frames-progress", onProgress);

    preloadHeroFrames().then((loadedFrames) => {
      if (!cancelled) {
        framesRef.current = loadedFrames;
        setIsLoaded(true);
        setFirstFrameReady(true);
      }
    });

    return () => {
      cancelled = true;
      window.removeEventListener("hero-frames-progress", onProgress);
    };
  }, [paintFrameToCanvas]);

  // Repaint immediately when exact playhead frame completes asynchronous decode
  useEffect(() => {
    const unsub = heroDecoder.addListener((decodedIdx) => {
      if (decodedIdx === currentFrameRef.current) {
        const confirmed = heroDecoder.getConfirmedFrame(decodedIdx);
        if (confirmed?.image) {
          paintFrameToCanvas(confirmed.image);
        }
      }
    });
    return unsub;
  }, [paintFrameToCanvas]);

  // Paint the first frame immediately on mount (before all frames load)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const confirmed0 = heroDecoder.getConfirmedFrame(0);
    const initialImg = confirmed0?.image || heroFramesCache?.[0] || eagerHeroFirstFrame;
    if (initialImg && (initialImg.naturalWidth > 0 || initialImg.width > 0)) {
      framesRef.current[0] = initialImg;
      setFirstFrameReady(true);
      paintFrameToCanvas(initialImg);
    } else {
      const firstImg = eagerHeroFirstFrame || new Image();
      firstImg.onload = () => {
        if (!framesRef.current[0]) framesRef.current[0] = firstImg;
        if (heroFramesCache && !heroFramesCache[0]) heroFramesCache[0] = firstImg;
        heroDecoder.setFrame(0, firstImg);
        setFirstFrameReady(true);
        paintFrameToCanvas(firstImg);
      };
      if (!firstImg.src) firstImg.src = HERO_FIRST_FRAME;
    }

    const onFirstFrameReady = (e) => {
      if (e.detail?.img) {
        framesRef.current[0] = e.detail.img;
        heroDecoder.setFrame(0, e.detail.img);
        setFirstFrameReady(true);
        paintFrameToCanvas(e.detail.img);
      }
    };
    window.addEventListener("hero-first-frame-ready", onFirstFrameReady);

    const onResize = () => {
      updateCanvasDimensions();
      const confirmed = heroDecoder.getConfirmedFrame(currentFrameRef.current);
      const activeImg = confirmed?.image || framesRef.current[currentFrameRef.current] || heroFramesCache?.[0] || eagerHeroFirstFrame;
      if (activeImg) paintFrameToCanvas(activeImg);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("hero-first-frame-ready", onFirstFrameReady);
      window.removeEventListener("resize", onResize);
    };
  }, [paintFrameToCanvas, updateCanvasDimensions]);

  useEffect(() => {
    if (!sectionRef.current || !canvasRef.current)
      return undefined;

    const drawFrame = (frame) => {
      heroDecoder.updatePlayhead(frame);
      const confirmed = heroDecoder.getConfirmedFrame(frame);
      if (confirmed?.image) {
        const painted = paintFrameToCanvas(confirmed.image);
        if (painted) {
          lastDrawnFrameRef.current = frame;
        }
      }
    };

    const updateFrameForProgress = (p) => {
      const clampedP = Math.max(0, Math.min(1, p));
      const frameIndex = Math.min(
        HERO_FRAME_COUNT - 1,
        Math.max(0, Math.round(clampedP * (HERO_FRAME_COUNT - 1))),
      );
      if (frameIndex !== lastDrawnFrameRef.current) {
        currentFrameRef.current = frameIndex;
        drawFrame(frameIndex);
      }
      const wordIndex = Math.min(
        words.length - 1,
        Math.floor(clampedP * words.length),
      );
      const nextWord = words[wordIndex];
      if (nextWord !== lastHeroWordRef.current) {
        lastHeroWordRef.current = nextWord;
        if (heroWordRef.current) {
          heroWordRef.current.textContent = nextWord;
        }
      }
    };

    const resize = () => {
      updateCanvasDimensions();
      drawFrame(currentFrameRef.current);
    };
    drawFrame(0);
    window.addEventListener("resize", resize);

    const playhead = { frame: 0 };
    const tween = gsap.to(playhead, {
      frame: HERO_FRAME_COUNT - 1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.85,
      },
      onUpdate: () => {
        const frameIndex = Math.min(
          HERO_FRAME_COUNT - 1,
          Math.max(0, Math.round(playhead.frame)),
        );
        if (frameIndex !== lastDrawnFrameRef.current) {
          currentFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }
        const p = Math.max(0, Math.min(1, playhead.frame / (HERO_FRAME_COUNT - 1)));
        const wordIndex = Math.min(
          words.length - 1,
          Math.floor(p * words.length),
        );
        const nextWord = words[wordIndex];
        if (nextWord !== lastHeroWordRef.current) {
          lastHeroWordRef.current = nextWord;
          if (heroWordRef.current) {
            heroWordRef.current.textContent = nextWord;
          }
        }
      },
    });

    const onReady = () => {
      syncFrames();
      updateCanvasDimensions();
      tween.scrollTrigger?.refresh();
      lastDrawnFrameRef.current = -1;
      drawFrame(currentFrameRef.current || 0);
    };
    document.addEventListener("qb-loader-done", onReady);
    window.addEventListener("hero-all-frames-ready", onReady);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("qb-loader-done", onReady);
      window.removeEventListener("hero-all-frames-ready", onReady);
      tween.kill();
    };
  }, [paintFrameToCanvas, updateCanvasDimensions]);

  return (
    <section ref={sectionRef} className="hero-scroll">
      <div
        className="hero-scroll-pin"
        style={{
          backgroundImage: `url(${HERO_FIRST_FRAME})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow yellow">BEST CBSE SCHOOL IN BELAGAVI</p>
          <h1>
            Learning
            <br />
            <span ref={heroWordRef} className="hero-changing-word">{words[0]}</span>
            <br />
            Limits.
          </h1>
          <p>
            Where academic excellence, creativity, leadership and joyful
            discovery come together.
          </p>
          <Link className="pill light" to="/contact-us">
            Contact Us <ArrowDownRight size={18} />
          </Link>
        </div>
        <div className="hero-meta">JAIN HERITAGE SCHOOL / 2026—27</div>
        <div className="scroll-mark">
          <span />
          SCROLL TO EXPLORE
        </div>
      </div>
    </section>
  );
}

function LegacyHero() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  const rafRef = useRef(null);
  const lastTime = useRef(-1);

  const [heroWord, setHeroWord] = useState("Beyond");

  const words = ["Beyond", "Curiosity", "Knowledge", "Imagination", "Vibrant"];

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;

    let ticking = false;

    /*
     * ---------------------------------------
     * Calculate scroll progress
     * ---------------------------------------
     */
    const calculateProgress = () => {
      const rect = section.getBoundingClientRect();

      const scrollDistance = section.offsetHeight - window.innerHeight;

      if (scrollDistance <= 0) {
        targetProgress.current = 0;
        return;
      }

      let progress = -rect.top / scrollDistance;

      progress = Math.max(0, Math.min(1, progress));

      targetProgress.current = progress;

      ticking = false;
    };

    /*
     * ---------------------------------------
     * Scroll event
     * ---------------------------------------
     */
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(calculateProgress);

        ticking = true;
      }
    };

    /*
     * ---------------------------------------
     * Animation loop
     * ---------------------------------------
     */
    const animate = () => {
      /*
       * Smoothly follow scroll position.
       */
      const difference = targetProgress.current - currentProgress.current;

      currentProgress.current += difference * 0.15;

      /*
       * Snap when extremely close. 0.15 0.0001
       */
      if (Math.abs(difference) < 0.0001) {
        currentProgress.current = targetProgress.current;
      }

      /*
       * -----------------------------------
       * VIDEO
       * -----------------------------------
       */
      if (
        video.readyState >= 2 &&
        Number.isFinite(video.duration) &&
        video.duration > 0
      ) {
        const maxTime = video.duration - 0.03;

        const newTime = currentProgress.current * maxTime;

        /*
         * Don't seek repeatedly to practically the same frame.
         */
        if (Math.abs(newTime - lastTime.current) > 0.02) {
          try {
            video.currentTime = newTime;

            lastTime.current = newTime;
          } catch { }
        }
      }

      /*
       * -----------------------------------
       * HERO TEXT
       * -----------------------------------
       */
      const index = Math.min(
        words.length - 1,
        Math.floor(currentProgress.current * words.length),
      );

      setHeroWord((prev) => (prev !== words[index] ? words[index] : prev));

      rafRef.current = requestAnimationFrame(animate);
    };

    /*
     * ---------------------------------------
     * Video metadata
     * ---------------------------------------
     */
    const handleLoaded = () => {
      video.pause();

      try {
        video.currentTime = 0;
      } catch { }

      currentProgress.current = 0;
      targetProgress.current = 0;
      lastTime.current = 0;

      calculateProgress();
    };

    video.addEventListener("loadedmetadata", handleLoaded);

    window.addEventListener("scroll", handleScroll, { passive: true });

    window.addEventListener("resize", calculateProgress);

    calculateProgress();

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      window.removeEventListener("scroll", handleScroll);

      window.removeEventListener("resize", calculateProgress);

      video.removeEventListener("loadedmetadata", handleLoaded);

      video.pause();
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-scroll">
      <div className="hero-scroll-pin">
        <video
          ref={videoRef}
          src="/videos/drone2.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />

        <div className="hero-shade" />

        <div className="hero-copy">
          <p className="eyebrow yellow">BEST CBSE SCHOOL IN BELAGAVI</p>

          <h1 className="hero-title-animated">
            Learning
            <br />
            <span className="hero-changing-word">{heroWord}</span>
            <br />
            Limits.
          </h1>

          <p>
            Where academic excellence, creativity, leadership and joyful
            discovery come together.
          </p>

          <Link className="pill light pulse-cta" to="/about/at-a-glance">
            Discover JHS
            <ArrowDownRight size={18} />
          </Link>
        </div>

        <div className="hero-meta">JAIN HERITAGE SCHOOL / 2026—27</div>

        <div className="scroll-mark">
          <span />
          SCROLL TO EXPLORE
        </div>
      </div>
    </section>
  );
}

function useScrollAnimatedWord(ref) {
  useLayoutEffect(() => {
    const characters = ref.current?.querySelectorAll(".animated-heading-char");

    if (!ref.current || !characters?.length) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(characters, {
        opacity: 1,
        filter: "none",
        x: 0,
        y: 0,
        scale: 1,
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      // Subtle, tasteful vertical reveal - prevents horizontal blowout and letter clipping
      gsap.set(characters, {
        opacity: 0,
        y: 14,
        scale: 0.98,
        willChange: "transform, opacity",
      });

      gsap.to(characters, {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.03,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          end: "bottom 55%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
        onComplete: () => {
          gsap.set(characters, { clearProps: "willChange" });
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);
}

function getPlainTextContent(node) {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((entry) => getPlainTextContent(entry)).join(" ");
  }

  if (React.isValidElement(node)) {
    return getPlainTextContent(node.props?.children);
  }

  return "";
}

function findEmphasizedText(node) {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return "";
  }

  if (Array.isArray(node)) {
    for (const child of node) {
      const match = findEmphasizedText(child);
      if (match) return match;
    }
    return "";
  }

  if (React.isValidElement(node)) {
    const tagName = String(node.type || "").toLowerCase();
    const text = getPlainTextContent(node.props?.children).trim();

    if (["i", "em", "strong", "b", "mark"].includes(tagName) && text) {
      return text;
    }

    return findEmphasizedText(node.props?.children);
  }

  return "";
}

function AnimatedHeading({
  as: Component = "h2",
  title,
  highlightWord,
  className = "",
  animate = true,
}) {
  const highlightRef = useRef(null);

  if (!animate) {
    return (
      <Component className={`animated-heading ${className}`.trim()}>
        {title}
      </Component>
    );
  }

  useScrollAnimatedWord(highlightRef);

  const textContent = getPlainTextContent(title).replace(/\s+/g, " ").trim();
  const words = textContent ? textContent.split(/\s+/).filter(Boolean) : [];

  const emphasizedWord = findEmphasizedText(title);
  const resolvedWord = (
    highlightWord ||
    emphasizedWord ||
    words[words.length - 1] ||
    ""
  )
    .trim()
    .replace(/[.,!?;:]/g, "");

  if (!textContent) {
    return null;
  }

  let targetIndex = words.findIndex(
    (word) =>
      word.replace(/[.,!?;:]/g, "").toLowerCase() ===
      resolvedWord.toLowerCase(),
  );

  // If resolvedWord contains multiple words (e.g. "in motion") or did not match directly,
  // find matching word from the sub-tokens or fallback to the last word of the title.
  if (targetIndex === -1 && words.length > 0) {
    const subWords = resolvedWord.split(/\s+/).filter(Boolean);
    const lastSubWord = subWords[subWords.length - 1];
    if (lastSubWord) {
      targetIndex = words.findIndex(
        (word) =>
          word.replace(/[.,!?;:]/g, "").toLowerCase() ===
          lastSubWord.toLowerCase(),
      );
    }
    if (targetIndex === -1) {
      targetIndex = words.length - 1;
    }
  }

  const effectiveWord =
    targetIndex > -1
      ? words[targetIndex].replace(/[.,!?;:]/g, "")
      : resolvedWord;

  const leadingWords =
    targetIndex > -1 ? words.slice(0, targetIndex).join(" ") : "";
  const trailingWords =
    targetIndex > -1 ? words.slice(targetIndex + 1).join(" ") : "";

  const highlightChars = (effectiveWord || "").split("");

  return (
    <Component className={`animated-heading ${className}`.trim()}>
      {leadingWords && (
        <span className="animated-heading-static">{leadingWords}</span>
      )}
      {leadingWords && " "}
      <span ref={highlightRef} className="animated-heading-word">
        {highlightChars.map((character, index) => (
          <span key={`${character}-${index}`} className="animated-heading-char">
            {character}
          </span>
        ))}
      </span>
      {trailingWords && (
        <span className="animated-heading-static"> {trailingWords}</span>
      )}
    </Component>
  );
}

function PageHero({ kicker, title, desc, image = IMG.hero, children }) {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;

    const bg = hero.querySelector(".page-hero-bg");
    const insignia = hero.querySelector(".page-hero-insignia");
    const eyebrow = hero.querySelector(".page-hero-eyebrow");
    const heading = hero.querySelector(".page-hero-title");
    const description = hero.querySelector(".page-hero-description");
    const actions = hero.querySelectorAll(
      ".page-hero-content a, .page-hero-content button",
    );
    const scrollCue = hero.querySelector(".page-hero-scroll-cue");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bg,
        { opacity: 0, scale: 1.08, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: "power3.out" },
      );

      gsap.to(bg, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      const sequence = [insignia, eyebrow, heading, description, ...actions, scrollCue].filter(
        Boolean,
      );
      gsap.fromTo(
        sequence,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
        },
      );
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="page-hero">
      <div
        className="page-hero-bg"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(6,37,59,.9),rgba(6,37,59,.25)),url(${image})`,
        }}
      />
      <div className="page-hero-content">
        <div className="page-hero-insignia">
          <span className="phi-dot" />
          <span className="phi-text">JAIN HERITAGE SCHOOL • BELAGAVI</span>
          <span className="phi-badge">EST. 2011</span>
        </div>
        <p className="eyebrow yellow page-hero-eyebrow">{kicker}</p>
        <AnimatedHeading
          as="h1"
          title={title}
          className="page-hero-title"
          animate={false}
        />
        {desc && <p className="page-hero-description">{desc}</p>}
        {children}
      </div>
      <div className="page-hero-scroll-cue" aria-hidden="true">
        <span className="ph-cue-line" />
        <span className="ph-cue-label">SCROLL TO EXPLORE</span>
      </div>
    </section>
  );
}

function ScrollFrameHero({ variant = "contact" }) {
  const isContact = variant === "contact";
  const frameCount = isContact ? CONTACT_FRAME_COUNT : SPORTS_FRAME_COUNT;
  const firstFrameSrc = isContact ? CONTACT_FIRST_FRAME : SPORTS_FIRST_FRAME;
  const preloader = isContact ? preloadContactFrames : preloadSportsFrames;
  const checker = isContact ? areContactFramesLoaded : areSportsFramesLoaded;
  const initialCache = isContact ? contactFramesCache : sportsFramesCache;
  const decoder = isContact ? contactDecoder : sportsDecoder;

  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRef = useRef(null);
  const framesRef = useRef(initialCache || new Array(frameCount).fill(null));
  const currentFrameRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const [isLoaded, setIsLoaded] = useState(() => checker());
  const [firstFrameReady, setFirstFrameReady] = useState(
    () => !!(initialCache?.[0]?.naturalWidth || initialCache?.[0]?.width)
  );
  const milestoneElsRef = useRef([]);
  const activeMilestoneRef = useRef(-1);
  const vignetteRef = useRef(null);
  const shadeRef = useRef(null);

  const canvasDimsRef = useRef({ width: 0, height: 0, dpr: 1 });
  const contextRef = useRef(null);

  const getCanvasContext = useCallback(() => {
    if (contextRef.current) return contextRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (ctx) {
      ctx.imageSmoothingQuality = "medium";
      contextRef.current = ctx;
    }
    return ctx;
  }, []);

  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    if (
      canvasDimsRef.current.width !== width ||
      canvasDimsRef.current.height !== height ||
      canvasDimsRef.current.dpr !== dpr
    ) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvasDimsRef.current = { width, height, dpr };
      contextRef.current = null;
      lastDrawnFrameRef.current = -1;
      const ctx = getCanvasContext();
      if (ctx) ctx.imageSmoothingQuality = "medium";
    }
  }, [getCanvasContext]);

  const paintFrameToCanvas = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return false;
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    if (!imgW || !imgH) return false;
    const context = getCanvasContext();
    if (!context) return false;
    if (!canvasDimsRef.current.width) {
      updateCanvasDimensions();
    }
    const { width, height, dpr } = canvasDimsRef.current;
    if (!width || !height) return false;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const scale = Math.max(
      width / imgW,
      height / imgH,
    );
    const imageWidth = imgW * scale;
    const imageHeight = imgH * scale;
    context.drawImage(
      img,
      Math.round((width - imageWidth) / 2),
      Math.round((height - imageHeight) / 2),
      Math.round(imageWidth),
      Math.round(imageHeight),
    );
    return true;
  }, [getCanvasContext, updateCanvasDimensions]);

  // Milestones inspired by Royal Baagh's stage captions
  const milestones = isContact
    ? [
      {
        badge: "CAMPUS ARRIVAL",
        title: "Where Journeys Begin.",
        desc: "A vibrant academic campus nestled in Belagavi.",
      },
      {
        badge: "OPEN DOORS & CARE",
        title: "Dialogue, Trust & Community.",
        desc: "Direct counselling with leadership, admissions guidance, and student-first counsel.",
      },
      {
        badge: "STEP ONTO OUR GROUNDS",
        title: "Experience JHS in Person.",
        desc: "Walk our classrooms, sports complexes, and innovation laboratories.",
      },
    ]
    : [
      {
        badge: "ATHLETIC EXCELLENCE",
        title: "World-Class Sporting Grounds.",
        desc: "Expansive cricket pitches, synthetic basketball arenas, and track & field grounds.",
      },
      {
        badge: "DISCIPLINE & PLAY",
        title: "Character Forged in Play.",
        desc: "Professional coaching cultivating physical endurance, tactical mindset, and sportsmanship.",
      },
      {
        badge: "MEMORIES OF VICTORY",
        title: "Every Game Teaches Character.",
        desc: "District championships, annual athletic meets, and lifelong memories of growth.",
      },
    ];

  // Preload frames in background and monitor progress
  useEffect(() => {
    let cancelled = false;
    if (checker()) {
      setIsLoaded(true);
      setFirstFrameReady(true);
      const cache = isContact ? contactFramesCache : sportsFramesCache;
      if (cache) framesRef.current = cache;
      return;
    }

    preloader().then((loadedFrames) => {
      if (!cancelled) {
        framesRef.current = loadedFrames;
        setFirstFrameReady(true);
        setIsLoaded(true);
        requestScrollRefresh();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [variant, isContact, preloader, checker]);

  // Repaint immediately when exact playhead frame completes asynchronous decode
  useEffect(() => {
    const unsub = decoder.addListener((decodedIdx) => {
      if (decodedIdx === currentFrameRef.current) {
        const confirmed = decoder.getConfirmedFrame(decodedIdx);
        if (confirmed?.image) {
          paintFrameToCanvas(confirmed.image);
        }
      }
    });
    return unsub;
  }, [decoder, paintFrameToCanvas]);

  // Immediate paint of first frame on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const confirmed0 = decoder.getConfirmedFrame(0);
    const initialImg = confirmed0?.image || (isContact ? eagerContactFirstFrame : eagerSportsFirstFrame);
    if (initialImg && (initialImg.naturalWidth > 0 || initialImg.width > 0)) {
      framesRef.current[0] = initialImg;
      setFirstFrameReady(true);
      paintFrameToCanvas(initialImg);
    } else {
      const firstImg = (isContact ? eagerContactFirstFrame : eagerSportsFirstFrame) || new Image();
      firstImg.onload = () => {
        if (!framesRef.current[0]) framesRef.current[0] = firstImg;
        decoder.setFrame(0, firstImg);
        setFirstFrameReady(true);
        paintFrameToCanvas(firstImg);
      };
      if (!firstImg.src) firstImg.src = firstFrameSrc;
    }

    const onResize = () => {
      updateCanvasDimensions();
      const confirmed = decoder.getConfirmedFrame(currentFrameRef.current);
      const activeImg = confirmed?.image || (isContact ? eagerContactFirstFrame : eagerSportsFirstFrame);
      if (activeImg) paintFrameToCanvas(activeImg);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [variant, firstFrameSrc, isContact, decoder, paintFrameToCanvas, updateCanvasDimensions]);

  // Scroll scrubbing GSAP ScrollTrigger animation
  useEffect(() => {
    if (!sectionRef.current || !canvasRef.current) return undefined;

    const drawFrame = (frame) => {
      decoder.updatePlayhead(frame);
      const confirmed = decoder.getConfirmedFrame(frame);
      if (confirmed?.image) {
        const painted = paintFrameToCanvas(confirmed.image);
        if (painted) {
          lastDrawnFrameRef.current = frame;
        }
      }
    };

    const updateFrameForProgress = (p) => {
      const clampedP = Math.max(0, Math.min(1, p));
      const frameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.round(clampedP * (frameCount - 1))),
      );
      if (frameIndex !== lastDrawnFrameRef.current) {
        currentFrameRef.current = frameIndex;
        drawFrame(frameIndex);
      }

      // 1. Staged storytelling: smoothly fade out initial hero copy as scrolling begins
      if (copyRef.current) {
        if (clampedP <= 0.02) {
          copyRef.current.style.opacity = "1";
          copyRef.current.style.transform = "translateY(0px)";
          copyRef.current.style.pointerEvents = "auto";
        } else if (clampedP < 0.14) {
          const fade = 1 - (clampedP - 0.02) / 0.12;
          copyRef.current.style.opacity = Math.max(0, fade).toFixed(3);
          copyRef.current.style.transform = `translateY(-${((1 - fade) * 20).toFixed(1)}px)`;
          copyRef.current.style.pointerEvents = fade > 0.3 ? "auto" : "none";
        } else {
          copyRef.current.style.opacity = "0";
          copyRef.current.style.transform = "translateY(-20px)";
          copyRef.current.style.pointerEvents = "none";
        }
      }

      // 2. Sequential milestone display: prevents simultaneous content crowding
      let targetMilestone = -1;
      if (clampedP < 0.16) {
        targetMilestone = -1;
      } else if (clampedP >= 0.18 && clampedP <= 0.42) {
        targetMilestone = 0;
      } else if (clampedP >= 0.46 && clampedP <= 0.70) {
        targetMilestone = 1;
      } else if (clampedP >= 0.74 && clampedP <= 0.94) {
        targetMilestone = 2;
      } else {
        targetMilestone = -1;
      }
      if (targetMilestone !== activeMilestoneRef.current) {
        activeMilestoneRef.current = targetMilestone;
        milestoneElsRef.current.forEach((el, idx) => {
          if (el) el.classList.toggle("is-active", idx === targetMilestone);
        });
      }

      // 3. Contact hero: fade out dark vignette/shade as video transitions into clean white school crest
      if (isContact) {
        if (clampedP >= 0.78) {
          const fade = Math.max(0, 1 - (clampedP - 0.78) / 0.18);
          if (vignetteRef.current) vignetteRef.current.style.opacity = fade.toFixed(3);
          if (shadeRef.current) shadeRef.current.style.opacity = fade.toFixed(3);
        } else {
          if (vignetteRef.current) vignetteRef.current.style.opacity = "1";
          if (shadeRef.current) shadeRef.current.style.opacity = "1";
        }
      }
    };

    const resize = () => {
      updateCanvasDimensions();
      drawFrame(currentFrameRef.current);
    };
    drawFrame(0);
    window.addEventListener("resize", resize);

    const playhead = { frame: 0 };
    const tween = gsap.to(playhead, {
      frame: frameCount - 1,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.9,
      },
      onUpdate: () => {
        const p = Math.max(0, Math.min(1, playhead.frame / (frameCount - 1)));
        updateFrameForProgress(p);
      },
    });

    const onLoaderDone = () => {
      syncFrames();
      updateCanvasDimensions();
      tween.scrollTrigger?.refresh();
      lastDrawnFrameRef.current = -1;
      drawFrame(currentFrameRef.current);
    };
    document.addEventListener("qb-loader-done", onLoaderDone);

    const onAllReady = () => {
      syncFrames();
      updateCanvasDimensions();
      tween.scrollTrigger?.refresh();
      lastDrawnFrameRef.current = -1;
      drawFrame(currentFrameRef.current);
    };
    const readyEvent = isContact ? "contact-all-frames-ready" : "sports-all-frames-ready";
    window.addEventListener(readyEvent, onAllReady);

    requestScrollRefresh();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("qb-loader-done", onLoaderDone);
      window.removeEventListener(readyEvent, onAllReady);
      tween.kill();
    };
  }, [variant, frameCount, isContact, paintFrameToCanvas, updateCanvasDimensions]);

  return (
    <section ref={sectionRef} className={`hero-scroll subpage-frame-hero ${isContact ? "contact-hero" : "sports-hero"}`}>
      <div
        className="hero-scroll-pin"
        style={{
          backgroundImage: `url(${firstFrameSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <canvas ref={canvasRef} className="hero-canvas" />

        {/* Soft atmospheric vignette from Royal Baagh */}
        <div ref={vignetteRef} className="hero-vignette-overlay" />
        <div ref={shadeRef} className="hero-shade" />

        {/* Brand headline at top */}
        <div ref={copyRef} className="hero-copy subpage-hero-copy">
          <div className="page-hero-insignia" style={{ marginBottom: "16px" }}>
            <span className="phi-dot" />
            <span className="phi-text">JAIN HERITAGE SCHOOL • BELAGAVI</span>
            <span className="phi-badge">
              {isContact ? "DIRECT DIRECTORY" : "ATHLETICS ARENAS"}
            </span>
          </div>
          <p className="eyebrow yellow">
            {isContact ? "CONNECT WITH JAIN HERITAGE SCHOOL" : "CAMPUS & SPORTS GALLERIES"}
          </p>
          <h1 className="subpage-frame-hero-title">
            {isContact ? (
              <>
                Every Journey Begins
                <br />
                With a <span className="hero-changing-word">Conversation.</span>
              </>
            ) : (
              <>
                Where Spirit, Passion
                <br />
                &amp; Champions <span className="hero-changing-word">Unite.</span>
              </>
            )}
          </h1>
          <p className="subpage-hero-lead">
            {isContact
              ? "Tour our Belagavi campus, meet our educators, and explore our CBSE academic community."
              : "Discover the vibrant sporting arenas, creative showcases, and community milestones of JHS Belagavi."}
          </p>
          <div className="subpage-hero-actions">
            {isContact ? (
              <>
                <a href="#contact-details" className="pill light">
                  Get in Touch <ArrowDownRight size={18} />
                </a>
                <button
                  type="button"
                  onClick={openAdmissionModal}
                  className="pill ghost light"
                >
                  Schedule a Visit <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <a href="#gallery-view" className="pill light">
                View Photos &amp; Videos <ArrowDownRight size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Floating stage milestone captions (Royal Baagh inspiration) */}
        <div className="hero-stage-caption-container" aria-live="polite">
          {milestones.map((m, idx) => (
            <div
              key={m.badge}
              ref={(el) => (milestoneElsRef.current[idx] = el)}
              className="hero-stage-caption"
            >
              <div className="hsc-badge-row">
                <span className="hsc-index">0{idx + 1}</span>
                <span className="hsc-badge">{m.badge}</span>
              </div>
              <h3 className="hsc-title">{m.title}</h3>
              <p className="hsc-desc">{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Animated luxury scroll cue (Royal Baagh & MH Design Build inspiration) */}
        <div className="hero-scroll-cue-modern" aria-hidden="true">
          <div className="hero-scroll-cue-pill">
            <span>SCROLL DRONE FLIGHT</span>
          </div>
          <div className="hero-scroll-cue-line" />
        </div>

        <div className="hero-meta">
          {isContact ? "JHS BELAGAVI · 15.8497° N, 74.4977° E" : "JHS BELAGAVI · ATHLETICS & ARENAS"}
        </div>
      </div>
    </section>
  );
}

function SectionHead({ kicker, title, desc, highlightWord, chip = true }) {
  // Deterministic, intentional variation derived from the kicker so every
  // heading gets its own composition — but never a random one. The book is
  // ALWAYS placed to the right of the heading (side="right"); the seed only
  // varies tone, size and animation rhythm so headings don't look stamped.
  const seed = (kicker || "")
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const tone = ["gold", "blue", "green"][seed % 3];
  const size = ["s1", "s2", "s3"][seed % 3];
  return (
    <div className="section-head" data-reveal>
      {chip !== false && (
        <BookChip side="right" tone={tone} size={size} seed={seed} />
      )}
      <div className="sh-rule-row" aria-hidden="true">
        <span className="sh-rule" />
        <p className="eyebrow sh-kicker">{kicker}</p>
      </div>
      <AnimatedHeading as="h2" title={title} highlightWord={highlightWord} />
      {desc && <p>{desc}</p>}
    </div>
  );
}

function ImageCard({ image, label, title, text, to }) {
  return (
    <Link className="image-card smooth-zoom card-glow-track" to={to || "#"} data-reveal>
      <img src={image} alt={title || "JHS"} loading="eager" decoding="async" />
      <div className="image-card-overlay">
        <span className="ico-label">{label}</span>
        <h3>{title}</h3>
        {text && <p>{text}</p>}
        <ArrowDownRight />
      </div>
    </Link>
  );
}

const FLYTHROUGH_MOMENTS = [
  {
    id: "carnival",
    image: IMG.carnival,
    badge: "LEADERSHIP & STEWARDSHIP",
    title: "Carnival & Investiture",
    desc: "Student council induction, leadership pledges, and institutional stewardship.",
    link: "/news/events-calendar",
    stats: "24+ Houses & Clubs",
    coord: "Heritage Quadrangle",
    kicker: "CHAPTER 01",
  },
  {
    id: "annualday",
    image: IMG.annualday,
    badge: "CREATIVE BRILLIANCE",
    title: "Annual Day Symphony",
    desc: "Music, classical dance, theatricals, and cross-campus artistic excellence.",
    link: "/news/events-calendar",
    stats: "1,200+ Performers",
    coord: "Grand Auditorium",
    kicker: "CHAPTER 02",
  },
  {
    id: "infinitum",
    image: IMG.infinitum,
    badge: "INTELLECT & CULTURE",
    title: "Infinitum & Vyoma Fest",
    desc: "Inter-school conclaves, scientific hackathons, and multi-disciplinary debates.",
    link: "/news/events-calendar",
    stats: "40+ Partner Schools",
    coord: "Innovation Arena",
    kicker: "CHAPTER 03",
  },
  {
    id: "badge",
    image: IMG.badge,
    badge: "CHARACTER & DUTY",
    title: "Badging Ceremony",
    desc: "Instilling responsibility, integrity, character, and student governance.",
    link: "/news/events-calendar",
    stats: "Student Council",
    coord: "Central Assembly",
    kicker: "CHAPTER 04",
  },
  {
    id: "yoga",
    image: IMG.yoga,
    badge: "MIND & BODY",
    title: "International Yoga Day",
    desc: "Nurturing wellness, mindfulness, physical poise, and inner equilibrium.",
    link: "/news/events-calendar",
    stats: "Mindful Living",
    coord: "Sports Pavilion",
    kicker: "CHAPTER 05",
  },
  {
    id: "ncc",
    image: IMG.ncc,
    badge: "SERVICE & PATRIOTISM",
    title: "NCC & Scouts Drills",
    desc: "Discipline, camaraderie, national service, and character-building expeditions.",
    link: "/news/events-calendar",
    stats: "Troop No. 4",
    coord: "Parade Ground",
    kicker: "CHAPTER 06",
  },
];

function FeatureFlythrough() {
  const scrollerRef = useRef(null);
  const stageRef = useRef(null);
  const barFillRef = useRef(null);
  const scrollHintRef = useRef(null);
  const hudKickerRef = useRef(null);
  const hudBadgeRef = useRef(null);
  const hudTitleRef = useRef(null);
  const hudDescRef = useRef(null);
  const activeIdxRef = useRef(0);
  const [activeIdx] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const stage = stageRef.current;
    if (!scroller || !stage) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const total = FLYTHROUGH_MOMENTS.length;

    const ctx = gsap.context(() => {
      let flightRaf = null;
      let lastFlightP = -1;
      const prevVisible = new Array(total).fill(false);

      const applyFlight = (p) => {
        if (barFillRef.current) {
          barFillRef.current.style.width = `${Math.max(6, Math.min(100, p * 100))}%`;
        }
        if (scrollHintRef.current) {
          scrollHintRef.current.style.opacity = p > 0.92 ? "0" : "1";
        }

        // Active index follows current scroll segment with a slight lookahead without React re-render
        const curIndex = Math.min(total - 1, Math.max(0, Math.floor(p * total)));
        if (curIndex !== activeIdxRef.current) {
          activeIdxRef.current = curIndex;
          const m = FLYTHROUGH_MOMENTS[curIndex];
          if (m) {
            if (hudKickerRef.current) hudKickerRef.current.textContent = m.kicker;
            if (hudBadgeRef.current) hudBadgeRef.current.textContent = m.badge;
            if (hudTitleRef.current) hudTitleRef.current.textContent = m.title;
            if (hudDescRef.current) hudDescRef.current.textContent = m.desc;
          }
        }

        // Calibrate individual flight metrics so cards NEVER overlap
        FLYTHROUGH_MOMENTS.forEach((_, i) => {
          // Each card is centered at (i + 0.5) / total
          const center = (i + 0.5) / total;
          const span = 1.35 / total; // ~0.225 window
          const start = center - span / 2;
          const end = center + span / 2;

          const isVisible = p >= start && p <= end;
          if (!isVisible && !prevVisible[i]) {
            // Already offscreen and was already hidden; skip expensive CSS variable updates
            return;
          }
          prevVisible[i] = isVisible;

          if (!isVisible) {
            stage.style.setProperty(`--itemVisible-${i + 1}`, "hidden");
            stage.style.setProperty(`--itemOpacity-${i + 1}`, "0");
            return;
          }

          const localP = Math.max(0, Math.min(1, (p - start) / (end - start)));

          // Opacity: smooth fade in (0-0.25), steady focal plateau (0.25-0.75), smooth fade out (0.75-1.0)
          let opacity = 0;
          if (localP < 0.25) {
            opacity = localP / 0.25;
          } else if (localP <= 0.75) {
            opacity = 1.0;
          } else {
            opacity = (1 - localP) / 0.25;
          }

          // Z-Depth: flies from deep distance (-700px), pauses at focal range (-50px to +50px), then flies past camera (+750px)
          let z = -700;
          if (localP < 0.25) {
            z = -700 + (localP / 0.25) * 650;
          } else if (localP <= 0.75) {
            const midP = (localP - 0.25) / 0.5;
            z = -50 + midP * 100;
          } else {
            const exitP = (localP - 0.75) / 0.25;
            z = 50 + exitP * 700;
          }

          // Scale progression
          let scale = 0.75;
          if (localP < 0.25) {
            scale = 0.75 + (localP / 0.25) * 0.25;
          } else if (localP <= 0.75) {
            scale = 1.0 + ((localP - 0.25) / 0.5) * 0.05;
          } else {
            scale = 1.05 + ((localP - 0.75) / 0.25) * 0.3;
          }

          stage.style.setProperty(`--itemVisible-${i + 1}`, "visible");
          stage.style.setProperty(`--itemOpacity-${i + 1}`, opacity.toFixed(4));
          stage.style.setProperty(`--itemZ-${i + 1}`, `${z.toFixed(1)}px`);
          stage.style.setProperty(`--itemScale-${i + 1}`, scale.toFixed(3));
        });
      };

      const scheduleFlight = (p) => {
        lastFlightP = p;
        if (flightRaf) return;
        flightRaf = requestAnimationFrame(() => {
          applyFlight(lastFlightP);
          flightRaf = null;
        });
      };

      ScrollTrigger.create({
        trigger: scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => scheduleFlight(self.progress),
      });

      applyFlight(0);
    }, scrollerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const scrollToItem = (idx) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const total = FLYTHROUGH_MOMENTS.length;
    const targetProgress = (idx + 0.5) / total;
    const rect = scroller.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top + targetProgress * (scroller.offsetHeight - window.innerHeight);
    window.scrollTo({ top: scrollTop, behavior: "smooth" });
  };

  const activeMoment = FLYTHROUGH_MOMENTS[activeIdx] || FLYTHROUGH_MOMENTS[0];

  return (
    <div className="jhs-flythrough-container FlythroughPoints_container__ngP9w">
      <div ref={scrollerRef} className="jhs-flythrough-scroller FlythroughPoints_contentScroller__qBMcs">
        <div ref={stageRef} className="jhs-flythrough-stage FlythroughPoints_content__Jbw02">
          {/* Atmospheric ambient lighting & subtle grid */}
          <div className="jhs-flythrough-backdrop" aria-hidden="true" />
          <div className="jhs-flythrough-grid-overlay" aria-hidden="true" />

          {/* Top Cinematic Narrative HUD */}
          <div className="jhs-flythrough-hud">
            <div className="jhs-flythrough-kicker-pill">
              <span className="jhs-flythrough-caption-dot" />
              <span ref={hudKickerRef}>{activeMoment.kicker}</span>
              <span>·</span>
              <span ref={hudBadgeRef}>{activeMoment.badge}</span>
            </div>
            <h3 ref={hudTitleRef} className="jhs-flythrough-hud-title">
              {activeMoment.title}
            </h3>
            <p ref={hudDescRef} className="jhs-flythrough-hud-desc">
              {activeMoment.desc}
            </p>
          </div>

          {/* 3D Scene containing the flying figures */}
          <div className="jhs-flythrough-scene FlythroughPoints_scene__5mRZZ">
            {FLYTHROUGH_MOMENTS.map((item, index) => (
              <figure
                key={item.id}
                className="jhs-flythrough-figure FlythroughPoints_figure__oheb2"
                style={{ "--index": index }}
                data-item="figure"
              >
                <Link
                  to="/news/events-calendar"
                  className="jhs-flythrough-media Media_media__LG2WM FlythroughPoints_media__fCLef"
                  aria-label={`View ${item.title} on Events Calendar`}
                >
                  <div className="jhs-flythrough-caption FlythroughPoints_caption__htcmJ">
                    <span className="jhs-flythrough-caption-dot" />
                    <span>{item.badge}</span>
                  </div>
                  <div className="jhs-flythrough-media-frame">
                    <img src={item.image} alt={item.title} loading="eager" decoding="async" />
                    <div className="jhs-flythrough-card-overlay">
                      <span className="jhs-flythrough-coord">📍 {item.coord} · {item.stats}</span>
                      <div className="jhs-flythrough-card-foot">
                        <span>Explore Events Calendar</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </figure>
            ))}
          </div>

          {/* Bottom HUD (Scrub Progress Track & Dots) */}
          <div className="jhs-flythrough-bottom-hud">
            <div className="jhs-flythrough-hud-track">
              <span className="jhs-flythrough-hud-counter">
                {String(activeIdx + 1).padStart(2, "0")} / {String(FLYTHROUGH_MOMENTS.length).padStart(2, "0")}
              </span>
              <div className="jhs-flythrough-bar-outer">
                <div
                  ref={barFillRef}
                  className="jhs-flythrough-bar-fill"
                  style={{ width: "6%" }}
                />
              </div>
              <div className="jhs-flythrough-hud-dots">
                {FLYTHROUGH_MOMENTS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`jhs-flythrough-dot ${i === activeIdx ? "active" : ""}`}
                    onClick={() => scrollToItem(i)}
                    aria-label={`Jump to moment ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Scroll instruction hint */}
            <div
              ref={scrollHintRef}
              className="jhs-flythrough-scroll-hint"
            >
              <span>Scroll to fly through</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeeJHSInMotionSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const timerRef = useRef(null);
  const sectionRef = useRef(null);

  const stories = [
    {
      id: "campus-life",
      index: "01",
      category: "COMMUNITY & SPIRIT",
      title: "Campus Life & Vibrant Everyday Energy",
      snippet:
        "From early morning assemblies in the amphitheatre to collaborative open-air study circles, our 24-acre campus pulses with shared purpose, joy, and lifelong friendships.",
      image: IMG.campuslife,
      tag: "Lush Campus",
      highlight: "Belagavi Campus",
      link: "/gallery/photos-videos",
    },
    {
      id: "beyond-classrooms",
      index: "02",
      category: "DISCOVERY & APPLIED SCIENCE",
      title: "Learning Beyond Classrooms & Practical Discovery",
      snippet:
        "Field observations, robotics labs, eco-gardening, and interactive experiments encourage learners to test hypotheses and turn abstract concepts into tangible understanding.",
      image: IMG.learningbeyondclassroom,
      tag: "Hands-on Discovery",
      highlight: "NEP-Aligned Labs",
      link: "/gallery/photos-videos",
    },
    {
      id: "school-moments",
      index: "03",
      category: "ARTS & CREATIVE EXPRESSION",
      title: "School Moments, Celebrations & the Arts",
      snippet:
        "Every child finds their voice on stage. From grand theatrical annual days to intimate classical music renditions, creativity is nurtured as an essential life discipline.",
      image: IMG.schoolmoments,
      tag: "Stage & Spotlight",
      highlight: "Annual Festivals",
      link: "/gallery/photos-videos",
    },
    {
      id: "cadets-leadership",
      index: "04",
      category: "LEADERSHIP & SERVICE",
      title: "Cadets, Discipline & Service in Motion",
      snippet:
        "Through NCC drills, Scout expeditions, and house governance, JHS students cultivate the poise, self-reliance, and collaborative civic spirit that define tomorrow's leaders.",
      image: IMG.ncc2,
      tag: "Cadet Formations",
      highlight: "NCC & Scouts",
      link: "/gallery/photos-videos",
    },
    {
      id: "athletics-sports",
      index: "05",
      category: "ATHLETICS & STRATEGY",
      title: "Sportsmanship, Focus & Tactical Vigour",
      snippet:
        "Whether commanding the pitch in cricket and football or mastering chess tactics in quiet contemplation, students build physical resilience and graceful sportsmanship.",
      image: IMG.chess,
      tag: "Competitive Arena",
      highlight: "Multi-Sport Complex",
      link: "/gallery/photos-videos",
    },
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || isHovered || !isInView) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, isHovered, isInView, stories.length]);

  const activeStory = stories[activeIndex];

  return (
    <section ref={sectionRef} className="motion-showcase-section section scroll-reveal">
      <div className="motion-section-header">
        <SectionHead
          kicker="05 / GALLERY"
          title="See JHS in motion."
          desc="Step inside our world — where academic curiosity, leadership, sports, and creative arts unfold every day."
          chip
        />
        <div className="motion-header-meta">
          <div className="motion-pulse-badge">
            <span className="motion-pulse-dot" />
            <span>LIVE CAMPUS REEL</span>
          </div>
          <Link to="/gallery/photos-videos" className="motion-explore-pill">
            <span>Explore All Campus Moments</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div
        className="motion-theater"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* CINEMATIC SPOTLIGHT STAGE */}
        <div className="motion-spotlight">
          <div className="motion-canvas-wrapper">
            {stories.map((story, i) => (
              <div
                key={story.id}
                className={`motion-slide ${i === activeIndex ? "active" : ""}`}
                aria-hidden={i !== activeIndex}
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className="motion-slide-img"
                  loading="eager"
                  decoding="async"
                />
                <div className="motion-slide-overlay" />
              </div>
            ))}
          </div>

          <div className="motion-spotlight-content">
            <div className="motion-top-bar">
              <span className="motion-chapter-indicator">
                CHAPTER <strong>{activeStory.index}</strong> / {String(stories.length).padStart(2, "0")}
              </span>
              <span className="motion-tag-badge">{activeStory.tag}</span>
            </div>

            <div className="motion-story-body">
              <span className="motion-cat-pill">{activeStory.category}</span>
              <h3 className="motion-story-title">{activeStory.title}</h3>
              <p className="motion-story-snippet">{activeStory.snippet}</p>

              <div className="motion-action-row">
                <Link to={activeStory.link} className="motion-btn-primary">
                  <span>Explore Story & Gallery</span>
                  <ArrowRight size={16} />
                </Link>

                <div className="motion-playback-controls">
                  <button
                    type="button"
                    className="motion-ctrl-btn"
                    onClick={() =>
                      setActiveIndex(
                        (prev) => (prev - 1 + stories.length) % stories.length
                      )
                    }
                    aria-label="Previous story"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    className="motion-ctrl-btn"
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    type="button"
                    className="motion-ctrl-btn"
                    onClick={() =>
                      setActiveIndex((prev) => (prev + 1) % stories.length)
                    }
                    aria-label="Next story"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE CHAPTER REEL / SELECTOR CARDS */}
        <div className="motion-reel">
          <div className="motion-reel-header">
            <span className="motion-reel-title">STORY CHAPTERS</span>
            <span className="motion-reel-counter">
              {activeIndex + 1} of {stories.length}
            </span>
          </div>

          <div className="motion-reel-list">
            {stories.map((story, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={story.id}
                  type="button"
                  className={`motion-chapter-card ${isActive ? "active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className="mcc-thumb-wrap">
                    <img src={story.image} alt={story.title || "Story thumbnail"} className="mcc-thumb" loading="eager" decoding="async" />
                    <span className="mcc-num">{story.index}</span>
                  </div>

                  <div className="mcc-info">
                    <span className="mcc-category">{story.category}</span>
                    <h4 className="mcc-title">{story.title}</h4>
                    <span className="mcc-highlight">{story.highlight}</span>
                  </div>

                  <div className="mcc-progress-bar">
                    <div
                      className={`mcc-progress-fill ${isActive && isPlaying && !isHovered ? "running" : ""
                        }`}
                      style={{
                        width: isActive ? "100%" : "0%",
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* INSTITUTIONAL METRICS STRIP */}
      <div className="motion-metrics-ribbon">
        <div className="mm-stat-item">
          <strong>500+</strong>
          <span>Vibrant Campus Moments</span>
        </div>
        <div className="mm-divider" />
        <div className="mm-stat-item">
          <strong>20K+</strong>
          <span>Successful Kids</span>
        </div>
        <div className="mm-divider" />
        <div className="mm-stat-item">
          <strong>15+</strong>
          <span>Co-Curricular Disciplines</span>
        </div>
        <div className="mm-divider" />
        <div className="mm-stat-item">
          <strong>100%</strong>
          <span>Holistic Participation</span>
        </div>
      </div>
    </section>
  );
}

function Home() {
  useReveal();
  return (
    <>
      {/* SeaSats-inspired atmospheric background ambient aura */}
      <div className="jhs-ambient-aura" aria-hidden="true">
        <div className="aura-glow aura-gold" />
        <div className="aura-glow aura-emerald" />
      </div>
      <Hero />
      <main>
        <section className="marquee">
          <div className="marquee-track">
            <div className="marquee-set">
              LEARN ◆ LEAD ◆ CREATE ◆ BELONG ◆ LEARN ◆ LEAD ◆ CREATE ◆ BELONG ◆
            </div>

            <div className="marquee-set">
              LEARN ◆ LEAD ◆ CREATE ◆ BELONG ◆ LEARN ◆ LEAD ◆ CREATE ◆ BELONG ◆
            </div>
          </div>
        </section>

        <SectionDivider label="ABOUT" />

        <section className="intro section scroll-reveal">
          {/* Floating books: contextually accent the "About" intro heading */}
          <FloatingBooksDecoration className="intro-books-deco" count={3} />
          <div className="intro-grid">
            <SectionHead
              kicker="01 / ABOUT"
              chip
              title={
                <>
                  A school where <i>possibility</i> becomes a way of life.
                </>
              }
              desc="Jain Heritage School, Belagavi, believes education should make learning satisfying, fulfilling and joyous. Our approach combines academic rigour with values, creativity, leadership and opportunities to discover every child's strengths."
            />
            <div className="intro-image interactive-showcase" data-reveal>
              <img src={IMG.bg} alt="JHS Belagavi Campus Showcase" loading="eager" decoding="async" />

              {/* SeaSats QuickFish-style Interactive Feature Hotspots */}
              <div className="hotspot-layer" aria-label="Interactive campus highlights">
                {/* Hotspot 1: Academics & 360° Mentorship */}
                <div className="interactive-hotspot" style={{ top: "28%", left: "25%" }}>
                  <button type="button" className="hotspot-radar" aria-label="360° CBSE Curriculum">
                    <span className="radar-core" />
                    <span className="radar-ring r1" />
                    <span className="radar-ring r2" />
                  </button>
                  <div className="hotspot-tooltip">
                    <div className="tooltip-tag">01 · ACADEMICS</div>
                    <h4>360° CBSE Curriculum</h4>
                    <p>Rigorous academics combined with ethics, creativity, and self-discovery.</p>
                  </div>
                </div>

                {/* Hotspot 2: STEM & Innovation Labs */}
                <div className="interactive-hotspot" style={{ top: "62%", left: "68%" }}>
                  <button type="button" className="hotspot-radar" aria-label="Innovation & Labs">
                    <span className="radar-core" />
                    <span className="radar-ring r1" />
                    <span className="radar-ring r2" />
                  </button>
                  <div className="hotspot-tooltip tooltip-left">
                    <div className="tooltip-tag">02 · CAMPUS</div>
                    <h4>Innovation &amp; STEM Labs</h4>
                    <p>Hands-on experimental labs, digital classrooms, and extensive libraries.</p>
                  </div>
                </div>

                {/* Hotspot 3: Sports & NCC Wing */}
                <div className="interactive-hotspot" style={{ top: "45%", left: "82%" }}>
                  <button type="button" className="hotspot-radar" aria-label="Sports & NCC">
                    <span className="radar-core" />
                    <span className="radar-ring r1" />
                    <span className="radar-ring r2" />
                  </button>
                  <div className="hotspot-tooltip tooltip-left">
                    <div className="tooltip-tag">03 · LEADERSHIP</div>
                    <h4>NCC &amp; Sports Complex</h4>
                    <p>Discipline, championship athletics, and student governance in action.</p>
                  </div>
                </div>
              </div>

              {/* SeaSats-inspired Floating Depth Parallax Badges */}
              <div className="floating-depth-badge badge-top-right" data-speed="1.2">
                <span className="fdb-dot" />
                <span>Est. 2012 · Belagavi</span>
              </div>
              <div className="floating-depth-badge badge-bottom-left" data-speed="0.8">
                <span className="fdb-chip">CBSE</span>
                <span>Co-ed Excellence</span>
              </div>
            </div>
          </div>
          <div className="stat-strip">
            <div className="stat-item-card card-glow-track">
              <b>CBSE</b>
              <span>Curriculum</span>
            </div>
            <div className="stat-item-card card-glow-track">
              <b>Early Years — 10th Std.</b>
              <span>Learning Journey</span>
            </div>
            <div className="stat-item-card card-glow-track">
              <b>360°</b>
              <span>Holistic Development</span>
            </div>
          </div>
        </section>
        <section className="feature section dark scroll-reveal" id="moments-feature-section">
          <SectionHead
            kicker="02 / WHAT'S HAPPENING"
            title="Moments that make school memorable."
            desc="Step into our living canvas — scroll to fly through signature celebrations, leadership milestones, and the vibrant life of Jain Heritage School."
          />
          <FeatureFlythrough />
        </section>

        <section className="section scroll-reveal">
          <SectionHead
            kicker="03 / STUDENT LIFE"
            title="Growing minds. Growing people."
          />
          <div className="life-grid">
            <ImageCard
              image={IMG.ncc}
              label="DISCIPLINE · DEDICATION · DUTY"
              title="NCC"
              to="/student-life/awards-and-honors"
            />
            <ImageCard
              image={IMG.scouts}
              label="SERVICE · LEADERSHIP · DIVERSITY"
              title="Scouts & Guides"
              to="/student-life/life-skills"
            />
          </div>
        </section>
        <section className="section olive scroll-reveal" id="co-curricular-showcase">
          <SectionHead
            kicker="04 / CO-CURRICULAR"
            chip="left"
            title="More ways to shine."
            desc="Beyond the classroom, every learner discovers avenues to excel, express, compete, and flourish."
          />
          <div className="rows olive-rows">
            {[
              {
                title: "Athletics",
                img: IMG.chess,
                sub: "Sport & fitness",
                detail: "From tactical board mastery to endurance athletics and competitive team tournaments.",
                badge: "DISCIPLINE · FITNESS · STRATEGY",
                to: "/academics",
              },
              {
                title: "Performing Arts & Music",
                img: IMG.performingartsmusic,
                sub: "Dance, drama, music & art",
                detail: "Expressive stages, instrumental melodies, theatre productions, and visual art fostering creative courage.",
                badge: "CREATIVITY · EXPRESSION · STAGE",
                to: "/academics",
              },
              {
                title: "In-house Publications",
                img: IMG.inhousepublications,
                sub: "Stories, poems, essays & student voice",
                detail: "Student-led editorials, literary anthologies, creative essays, and authentic student journalism.",
                badge: "VOICE · LITERARY · JOURNALISM",
                to: "/academics",
              },
            ].map((item, i) => (
              <Link
                className="big-row olive-row-card"
                to={item.to}
                key={item.title}
                data-reveal
              >
                <div className="olive-row-index-wrap">
                  <span className="olive-row-num">0{i + 1}</span>
                  <span className="olive-row-indicator" aria-hidden="true" />
                </div>
                <div className="olive-row-content">
                  <span className="olive-row-kicker">{item.badge}</span>
                  <h3 className="olive-row-title">{item.title}</h3>
                  <p className="olive-row-sub">{item.sub}</p>
                  <p className="olive-row-detail">{item.detail}</p>
                </div>
                <div className="olive-row-media">
                  <div className="olive-row-img-frame">
                    <img src={item.img} alt={item.title} loading="eager" decoding="async" />
                    <span className="olive-media-overlay" aria-hidden="true" />
                    <span className="olive-corner olive-corner-tl" aria-hidden="true" />
                    <span className="olive-corner olive-corner-br" aria-hidden="true" />
                    <span className="olive-badge-pill">{item.sub}</span>
                  </div>
                </div>
                <div className="olive-row-action">
                  <div className="olive-row-arrow-circle" aria-label={`Explore ${item.title}`}>
                    <ArrowDownRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        {/* ── SEE JHS IN MOTION (REWORKED CINEMATIC SHOWCASE) ── */}
        <SeeJHSInMotionSection />

        {/* ── PREMIUM HORIZONTAL SCROLL GALLERY ── */}
        <HorizontalScrollStrip
          items={[
            { image: IMG.campus, category: "CAMPUS", title: "Spaces to explore" },
            { image: IMG.ncc2, category: "NCC", title: "Discipline in action" },
            { image: IMG.scouts, category: "SCOUTS", title: "Growing leaders" },
            { image: IMG.chess, category: "SPORTS", title: "Think and play" },
            { image: IMG.yoga, category: "WELLBEING", title: "Pause and balance" },
            { image: IMG.labchemistry, category: "LEARNING", title: "Ideas become experiments" },
          ]}
        />

        {/* ── EDITORIAL MARQUEE ── */}
        <EditorialMarquee
          items={["CBSE EXCELLENCE", "HOLISTIC GROWTH", "LEADERSHIP", "VALUES", "CREATIVITY", "INNOVATION"]}
        />

        {/* ── CINEMATIC REVEALS — school pillars ── */}
        <section className="cinematic-section section">
          <SectionHead
            kicker="06 / OUR PILLARS"
            title={<>What makes <i>JHS</i> different.</>}
          />
          <div className="cinematic-reveals">
            <CinematicReveal
              image={IMG.academics}
              alt="Academic excellence at JHS"
              kicker="01 / ACADEMICS"
              headline="Concepts that connect."
              body="CBSE-aligned learning that goes beyond the textbook — application, technology and holistic development in every class."
            />
            <CinematicReveal
              image={IMG.ncc2}
              alt="Student leadership at JHS"
              kicker="02 / LEADERSHIP"
              headline="Character builds quietly."
              body="NCC, Scouts, and co-curricular experiences develop discipline, responsibility and service from the earliest years."
              reverse
            />
            <CinematicReveal
              image={IMG.annualday}
              alt="Arts and creativity at JHS"
              kicker="03 / CREATIVITY"
              headline="Every voice deserves a stage."
              body="Performing arts, music, visual arts and publications give every student a medium to discover and express who they are."
            />
          </div>
        </section>

        {/* ── STICKY STORYTELLING PANEL ── */}
        <section className="section dark learning-journey-section">
          <SectionHead
            kicker="07 / THE LEARNING JOURNEY"
            title={<>From <i>curiosity</i> to capability.</>}
          />
          <StickyStoryteller
            panels={[
              {
                kicker: "STAGE 01 · Curiosity first",
                title: "Curiosity first.",
                body: "Play-based, sensory-rich discovery where toddlers explore, develop motor coordination, and build social confidence in a warm, caring environment.",
                image: IMG.academics,
              },
              {
                kicker: "STAGE 02 · Words & Wonder",
                title: "Words & Wonder.",
                body: "Early language immersion, creative expression, music, and interactive play encourage self-expression, sharing, and active imagination.",
                image: IMG.preprimarylearning,
              },
              {
                kicker: "STAGE 03 · Concepts take root",
                title: "Concepts take root.",
                body: "Foundational numeracy, phonics, storytelling, hands-on scientific exploration, and creative arts nurture deep conceptual understanding.",
                image: IMG.learningbeyondclassroom,
              },
              {
                kicker: "STAGE 04 · Confidence takes flight",
                title: "Confidence takes flight.",
                body: "Early literacy, analytical thinking, collaborative teamwork, and school readiness equip each child for a seamless leap into primary school.",
                image: IMG.badge,
              },
            ]}
          />
        </section>

        <CTA />
      </main>
    </>
  );
}

function splitTextChars(text) {
  return text.split("").map((char, index) => (
    <span key={`${text}-${index}`} className="quote-char">
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

function QuoteSectionLegacy() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);

  const bookRef = useRef(null);
  const coverRef = useRef(null);
  const leftPageRef = useRef(null);
  const rightPageRef = useRef(null);

  // Page turn refs - multiple pages that turn on scroll
  const page2Ref = useRef(null);
  const page3Ref = useRef(null);
  const page4Ref = useRef(null);
  const page5Ref = useRef(null);
  const page6Ref = useRef(null);

  // Text content refs for each page
  const page2TextRef = useRef(null);
  const page3TextRef = useRef(null);
  const page4TextRef = useRef(null);
  const page5TextRef = useRef(null);
  const page6TextRef = useRef(null);

  const location = useLocation();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const book = bookRef.current;
    const cover = coverRef.current;
    const leftPage = leftPageRef.current;
    const rightPage = rightPageRef.current;

    if (!section || !sticky || !book || !cover || !leftPage || !rightPage) {
      return;
    }

    const ctx = gsap.context(() => {
      // Get all character elements for text animations
      const page2Chars = page2TextRef.current?.querySelectorAll(".quote-char");
      const page3Chars = page3TextRef.current?.querySelectorAll(".quote-char");
      const page4Chars = page4TextRef.current?.querySelectorAll(".quote-char");
      const page5Chars = page5TextRef.current?.querySelectorAll(".quote-char");
      const page6Chars = page6TextRef.current?.querySelectorAll(".quote-char");

      // Initial book setup
      gsap.set(book, {
        scale: 0.94,
        rotateX: 4,
        transformPerspective: 1800,
        transformStyle: "preserve-3d",
      });

      // Cover setup - starts closed
      gsap.set(cover, {
        rotateY: 0,
        x: 0,
        z: 50,
        transformOrigin: "right center",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      });

      // Initial pages setup
      gsap.set([leftPage, rightPage], {
        opacity: 1,
        rotateY: 0,
        x: 0,
        filter: "blur(0px)",
        transformStyle: "preserve-3d",
        visibility: "visible",
      });

      // Setup turning pages - stacked under cover, will turn sequentially
      const turningPages = [
        page6Ref.current,
        page5Ref.current,
        page4Ref.current,
        page3Ref.current,
        page2Ref.current,
      ];
      turningPages.forEach((page, index) => {
        if (page) {
          gsap.set(page, {
            rotateY: 0,
            x: 0,
            z: 40 - index * 2,
            transformOrigin: "left center",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          });
        }
      });

      // Set all text chars to invisible initially
      gsap.set([page2Chars, page3Chars, page4Chars, page5Chars, page6Chars], {
        opacity: 0,
        xPercent: 18,
        y: 8,
        scale: 0.98,
        willChange: "transform, opacity",
      });

      // Main timeline with scroll trigger
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          // No GSAP pin here — the section already pins via CSS sticky
          // (.quote-section 400vh + .quote-sticky 100vh). A GSAP pin on top
          // of CSS sticky breaks on inner pages (containing-block and
          // overflow ancestors), leaving the book scrolled out of view.
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Book scales up and cover opens
      tl.to(book, { scale: 1, rotateX: 0, duration: 0.15 }, 0);
      tl.to(cover, { rotateY: -155, x: -30, duration: 0.25 }, 0.05);
      tl.to(leftPage, { rotateY: -8, x: -10, duration: 0.25 }, 0.08);
      tl.to(rightPage, { rotateY: 8, x: 10, duration: 0.25 }, 0.08);
      tl.to(
        ".quote-book-subhead",
        { opacity: 0, y: -18, duration: 0.15 },
        0.05,
      );

      // Phases 2-6: each page turns at its own unit position so the turns
      // are spread evenly across the whole scroll distance, and each page's
      // text reveals right after its turn (before the next turn begins).
      const pageRefs = [page2Ref, page3Ref, page4Ref, page5Ref, page6Ref];
      // charSets[k] is the text ON TOP of turning page k (page2Ref carries
      // page3TextRef, page3Ref carries page4TextRef, ...). Sheet 03 is already
      // visible on the right the moment the cover opens, so its text reveals
      // right after the cover opens — every later turn reveals the NEXT
      // sheet's text while that sheet sits on the right, before it turns.
      const charSets = [page3Chars, page4Chars, page5Chars, page6Chars];

      const revealChars = (chars, pos) => {
        if (!chars?.length) return;
        tl.fromTo(
          chars,
          {
            opacity: 0,
            xPercent: 18,
            y: 8,
            scale: 0.98,
          },
          {
            opacity: 1,
            xPercent: 0,
            y: 0,
            scale: 1,
            stagger: 0.006,
            duration: 0.3,
          },
          pos,
        );
      };

      // Sheet 03 (page2Ref) is the first visible right-hand page: animate its
      // text as soon as the cover finishes opening.
      revealChars(charSets[0], 0.35);

      pageRefs.forEach((pageRef, i) => {
        const pos = 1 + i;
        const page = pageRef.current;
        if (page) {
          tl.to(page, { rotateY: -155, x: -20, duration: 0.4 }, pos);
        }
        // Turning sheet k reveals the sheet underneath it, whose text is
        // charSets[i + 1]. The final sheet (07) has no animated text.
        revealChars(charSets[i + 1], pos + 0.45);
      });

      // Hide scroll hint after book opens
      tl.to(".quote-scroll-hint", { opacity: 0, y: -15, duration: 0.1 }, 0.1);

      window.__tlDebug = tl;
    }, section);

    return () => {
      // eslint-disable-next-line no-underscore-dangle
      delete window.__tlDebug;
      ctx.revert();
    };
  }, [location.pathname]);

  return (
    <section ref={sectionRef} className="quote-section quote-section-multipage">
      <div ref={stickyRef} className="quote-sticky">
        <div className="quote-book-subhead">BUILD AROUND POSSIBILITY</div>

        <div ref={bookRef} className="quote-book">
          <div className="quote-book-back" />
          <div className="quote-book-spine" />

          <div ref={leftPageRef} className="quote-page quote-page-left">
            <div className="quote-page-inner">
              <span className="quote-page-number">01</span>
              <div className="quote-watermark">JHS</div>
              <div className="quote-left-small">
                A JOURNEY
                <br />
                OF POSSIBILITY
              </div>
              <div className="quote-paper-divider" />
            </div>
          </div>

          <div ref={rightPageRef} className="quote-page quote-page-right">
            <div className="quote-page-inner">
              <span className="quote-page-number">02</span>
              <div className="quote-page-light" />
              <div className="quote-contents">
                <div
                  ref={page2TextRef}
                  className="quote-animated-line quote-line-1"
                >
                  {splitTextChars("Education is not only")}
                </div>
                <div className="quote-animated-line quote-line-2">
                  {splitTextChars("preparation for life.")}
                </div>
                <div className="quote-animated-line quote-line-3">
                  {splitTextChars("It is life itself.")}
                </div>
              </div>
              <div className="quote-watermark quote-watermark-right">
                BELAGAVI
              </div>
              <div className="quote-paper-divider" />
            </div>
          </div>

          <div
            ref={page2Ref}
            className="quote-page quote-page-turn quote-page-3"
          >
            <div className="quote-page-inner">
              <span className="quote-page-number">03</span>
              <div className="quote-page-light" />
              <div className="quote-contents">
                <div
                  ref={page3TextRef}
                  className="quote-animated-line quote-line-1"
                >
                  {splitTextChars("Learning should feel alive.")}
                </div>
                <div className="quote-animated-line quote-line-2">
                  {splitTextChars("From first questions to")}
                </div>
                <div className="quote-animated-line quote-line-3">
                  {splitTextChars("confident senior years.")}
                </div>
              </div>
              <div className="quote-watermark quote-watermark-right">JHS</div>
              <div className="quote-paper-divider" />
            </div>
          </div>

          <div
            ref={page3Ref}
            className="quote-page quote-page-turn quote-page-4"
          >
            <div className="quote-page-inner">
              <span className="quote-page-number">04</span>
              <div className="quote-page-light" />
              <div className="quote-contents">
                <div
                  ref={page4TextRef}
                  className="quote-animated-line quote-line-1"
                >
                  {splitTextChars("Every child has potential")}
                </div>
                <div className="quote-animated-line quote-line-2">
                  {splitTextChars("waiting to be discovered.")}
                </div>
                <div className="quote-animated-line quote-line-3">
                  {splitTextChars("Every voice matters.")}
                </div>
              </div>
              <div className="quote-watermark quote-watermark-right">
                BELAGAVI
              </div>
              <div className="quote-paper-divider" />
            </div>
          </div>

          <div
            ref={page4Ref}
            className="quote-page quote-page-turn quote-page-5"
          >
            <div className="quote-page-inner">
              <span className="quote-page-number">05</span>
              <div className="quote-page-light" />
              <div className="quote-contents">
                <div
                  ref={page5TextRef}
                  className="quote-animated-line quote-line-1"
                >
                  {splitTextChars("Sports, arts, leadership")}
                </div>
                <div className="quote-animated-line quote-line-2">
                  {splitTextChars("and life skills become part")}
                </div>
                <div className="quote-animated-line quote-line-3">
                  {splitTextChars("of the wider learning.")}
                </div>
              </div>
              <div className="quote-watermark quote-watermark-right">JHS</div>
              <div className="quote-paper-divider" />
            </div>
          </div>

          <div
            ref={page5Ref}
            className="quote-page quote-page-turn quote-page-6"
          >
            <div className="quote-page-inner">
              <span className="quote-page-number">06</span>
              <div className="quote-page-light" />
              <div className="quote-contents">
                <div
                  ref={page6TextRef}
                  className="quote-animated-line quote-line-1"
                >
                  {splitTextChars("JHS combines academic")}
                </div>
                <div className="quote-animated-line quote-line-2">
                  {splitTextChars("excellence, values, creativity")}
                </div>
                <div className="quote-animated-line quote-line-3">
                  {splitTextChars("and joyful discovery.")}
                </div>
              </div>
              <div className="quote-watermark quote-watermark-right">
                BELAGAVI
              </div>
              <div className="quote-paper-divider" />
            </div>
          </div>

          <div
            ref={page6Ref}
            className="quote-page quote-page-turn quote-page-7"
          >
            <div className="quote-page-inner">
              <span className="quote-page-number">07</span>
              <div className="quote-page-light" />
              <div className="quote-contents quote-contents-center">
                <div className="quote-final-message">
                  <p className="eyebrow">JAIN HERITAGE SCHOOL</p>
                  <h3>BELAGAVI</h3>
                  <div className="quote-cover-line" />
                  <small>EST. 2002</small>
                </div>
              </div>
              <div className="quote-watermark quote-watermark-right">JHS</div>
              <div className="quote-paper-divider" />
            </div>
          </div>

          <div ref={coverRef} className="quote-book-cover front-cover">
            <div className="quote-cover-inner">
              <p className="eyebrow quote-cover-kicker">JAIN HERITAGE SCHOOL</p>
              <h3>EDUCATION</h3>
              <span>A JOURNEY OF POSSIBILITY</span>
              <div className="quote-cover-line" />
              <small>EST. BELAGAVI</small>
            </div>
          </div>

          <div className="quote-book-cover back-cover" />
          <div className="quote-book-shadow" />
        </div>

        <div className="quote-scroll-hint">
          <span className="quote-scroll-line" />
          <span>SCROLL TO OPEN BOOK</span>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="cta cta--editorial scroll-reveal">
      {/* Floating book: accent beside the CTA headline */}
      <FloatingBooksDecoration className="cta-books-deco" count={2} />
      <div className="cta-copy">
        <p className="eyebrow cta-eyebrow gift-text-reveal">
          ADMISSIONS 2026—27
        </p>
        <h2 className="gift-text-reveal">
          Give your child
          <br />
          <em> a place to grow.</em>
        </h2>
        <p className="cta-subtext gift-text-reveal">
          Limited seats across Early years–10 for the coming session. Visit the
          campus, meet our faculty and see how learning comes alive at JHS.
        </p>
      </div>
      <button className="circle-cta pulse-cta" onClick={openAdmissionModal}>
        Schedule
        <br />
        Interview <ArrowDownRight />
      </button>
    </section>
  );
}

const pageData = {
  "/about/chairman-message": {
    k: "ABOUT US / LEADERSHIP",
    t: "Education with purpose.",
    d: "A vision rooted in character, curiosity, confidence and meaningful learning.",
    heroImage: IMG.bg,
    introImage: IMG.chairman,
    accent: "gold",
    blocks: [
      {
        number: "01",
        title: "A school beyond academics",
        text: "Jain Heritage School believes that education should make learning satisfying, fulfilling and joyous. Academic excellence is combined with values, creativity, leadership and opportunities that allow every learner to discover their strengths.",
        image: IMG.bg,
      },
      {
        number: "02",
        title: "Every child has potential",
        text: "Our learning environment encourages children to explore, question, experiment and express themselves. We believe every child is unique and deserves the right environment to grow with confidence.",
        image: IMG.about,
      },
      {
        number: "03",
        title: "Learning for life",
        text: "The purpose of education extends beyond examinations. JHS focuses on communication, leadership, responsibility, collaboration and values that help students become capable and compassionate citizens.",
        image: IMG.ncc,
      },
    ],
  },

  "/about/at-a-glance": {
    k: "ABOUT US",
    t: "JHS at a glance.",
    d: "A holistic CBSE learning journey designed around the child.",
    heroImage: IMG.ataglancebg,
    introImage: IMG.ataglance,
    accent: "green",
    blocks: [
      {
        number: "01",
        title: "Our philosophy",
        text: "Jain Heritage School aims to create a nurturing and inclusive learning environment where students are encouraged to achieve their potential through academic, creative, physical and social development.",
        image: IMG.ourphilosophy,
      },
      {
        number: "02",
        title: "Our learning environment",
        text: "The school combines modern infrastructure, qualified teachers, technology-supported learning and value-added experiences to create an engaging educational environment.",
        image: IMG.library,
      },
      {
        number: "03",
        title: "Our community",
        text: "Students, teachers and parents work together to create a supportive school community where learning, leadership and personal development are equally valued.",
        image: IMG.ourcommunity,
      },
    ],
  },

  "/about/infrastructure": {
    k: "ABOUT US / CAMPUS",
    t: "Spaces that inspire.",
    d: "A secure, technology-enabled and activity-rich campus designed for modern learning.",
    heroImage: IMG.bg,
    introImage: IMG.bg2,
    accent: "gold",
    blocks: [
      {
        number: "01",
        title: "Smart classrooms",
        text: "Digital boards, multimedia resources and technology-supported learning help students experience concepts rather than simply memorise them.",
        image: IMG.smartclassroom,
      },
      {
        number: "02",
        title: "Science, mathematics & computer labs",
        text: "Hands-on learning spaces encourage experimentation, practical problem solving and digital confidence.",
        image: IMG.labchemistry,
      },
      {
        number: "03",
        title: "Sports & activity spaces",
        text: "The campus supports athletics, basketball, volleyball, badminton, football, cricket, indoor games, yoga and other physical activities.",
        image: IMG.bg2,
      },
      {
        number: "04",
        title: "Safety first",
        text: "The school's published infrastructure information highlights CCTV surveillance, trained security personnel, child-friendly spaces, GPS-enabled transport and safety systems.",
        image: IMG.safetyfirst,
      },
      {
        number: "05",
        title: "Creative spaces",
        text: "Dedicated spaces for music, dance, art and other creative activities help students discover and develop their talents.",
        image: IMG.annualday,
      },
    ],
  },

  "/about/library": {
    k: "ABOUT US / LEARNING",
    t: "A world between pages.",
    d: "A vibrant academic resource centre that encourages reading, research and independent learning.",
    heroImage: IMG.librarybg,
    introImage: IMG.library,
    accent: "green",
    blocks: [
      {
        number: "01",
        title: "Read. Research. Discover.",
        text: "The JHS library serves as a dynamic academic resource centre supporting students and teachers with books, periodicals, digital resources and reference material.",
        image: IMG.readresearchdiscover,
      },
      {
        number: "02",
        title: "Beyond textbooks",
        text: "The library encourages independent reading and helps students develop literacy, critical thinking and a lifelong interest in learning.",
        image: IMG.beyondtextbooks,
      },
      {
        number: "03",
        title: "A space for curiosity",
        text: "Instead of being only a quiet reading room, the library is designed as a multifunctional learning space that supports exploration and discovery.",
        image: IMG.spaceforcuriosity,
      },
    ],
  },

  "/admissions/eligibility": {
    k: "ADMISSIONS",
    t: "Find your place at JHS.",
    d: "Admissions are based on age, grade availability, previous academic records and the school's admission process.",
    heroImage: IMG.eligibilitybg,
    introImage: IMG.eligibility,
    accent: "gold",
    type: "eligibility",
    blocks: [
      {
        number: "01",
        title: "Age-based eligibility",
        text: "The published JHS eligibility information provides age guidelines from Early Year through Grade 10.",
        image: IMG.eligibility,
      },
      {
        number: "02",
        title: "Assessment & interaction",
        text: "Depending on the grade, students may be required to participate in an entrance assessment or interaction to understand their readiness.",
        image: IMG.scheduleinterview,
      },
      {
        number: "03",
        title: "Documents",
        text: "Parents are required to provide relevant academic and identification documents during the admission process.",
        image: IMG.documentsrequired,
      },
    ],
  },

  "/admissions/schedule-interview": {
    k: "ADMISSIONS",
    t: "Start the conversation.",
    d: "Take the next step toward joining the Jain Heritage School community.",
    heroImage: IMG.scheduleinterviewbg,
    introImage: IMG.scheduleinterview,
    accent: "green",
    type: "admission-form",
    blocks: [
      {
        number: "01",
        title: "Enquire",
        text: "Share your child's details and preferred class with the admissions team.",
        image: IMG.scheduleinterview,
      },
      {
        number: "02",
        title: "Understand",
        text: "Connect with the school to understand the learning environment, curriculum and admission requirements.",
        image: IMG.smartclassroom,
      },
      {
        number: "03",
        title: "Visit",
        text: "Experience the campus and meet the people who make JHS a vibrant learning community.",
        image: IMG.campuslife,
      },
    ],
  },

  "/admissions/documents-required": {
    k: "ADMISSIONS",
    t: "Prepare your checklist.",
    d: "Keep the admission process simple, clear and organised.",
    heroImage: IMG.documentsrequiredbg,
    introImage: IMG.documentsrequired,
    accent: "gold",
    type: "documents",
    blocks: [
      {
        number: "01",
        title: "Student information",
        image: IMG.scheduleinterview,
        text: "Keep the student's identification and age-related documents ready.",
      },
      {
        number: "02",
        title: "Academic records",
        text: "Previous academic records may be required depending on the class for which admission is sought.",
        image: IMG.eligibility,
      },
      {
        number: "03",
        title: "Final verification",
        text: "Always confirm the latest document checklist with the JHS admissions team before submitting your application.",
        image: IMG.documentsrequired,
      },
    ],
  },

  "/academics": {
    k: "ACADEMICS",
    t: "Learning beyond textbooks.",
    d: "Conceptual clarity, application-based learning, technology and holistic development.",
    heroImage: IMG.academicsbg,
    introImage: IMG.academics,
    accent: "green",
    type: "academics",
    blocks: [
      {
        number: "01",
        title: "Pre-primary learning",
        text: "The early years programme focuses on physical, social and emotional development, communication, kinesthetic skills, creativity and stress-free learning.",
        image: IMG.preprimarylearning,
      },
      {
        number: "02",
        title: "Value-added courses",
        text: "JHS highlights value-added programmes such as Abacus and Robotics alongside its CBSE curriculum.",
        image: IMG.beyondclassroom,
      },
      {
        number: "03",
        title: "Application-based learning",
        text: "Students are encouraged to apply concepts to practical situations instead of relying solely on rote learning.",
        image: IMG.labchemistry,
      },
      {
        number: "04",
        title: "Technology integration",
        text: "Digital classrooms and technology-supported learning help students build future-ready skills.",
        image: IMG.smartclassroom,
      },
      {
        number: "05",
        title: "Holistic development",
        text: "Academics are complemented by sports, arts, leadership, life skills and co-curricular activities.",
        image: IMG.cocurricularactivities,
      },
    ],
  },

  "/student-life/awards-and-honors": {
    k: "STUDENT LIFE",
    t: "Celebrate the journey.",
    d: "Recognising effort, achievement, leadership and excellence.",
    heroImage: IMG.helpersday,
    introImage: IMG.badge,
    accent: "gold",
    type: "awards",
    possibility: {
      image: IMG.badge,
      description:
        "Every milestone matters when effort, discipline and curiosity are celebrated together.",
      cta: "Celebrate JHS",
      ctaLink: "/news/events-calendar",
    },
    blocks: [
      {
        number: "01",
        title: "Achievement matters",
        text: "Awards and recognition encourage students to pursue excellence while developing discipline, responsibility and confidence.",
        image: IMG.achievementmatters,
      },
      {
        number: "02",
        title: "Beyond academics",
        text: "Students are recognised across academics, sports, cultural activities, leadership and other areas of achievement.",
        image: IMG.beyondacademics,
      },
      {
        number: "03",
        title: "A culture of encouragement",
        text: "Recognition becomes a way of celebrating progress and inspiring students to keep learning and growing.",
        image: IMG.cultureencouragement,
      },
    ],
  },

  "/student-life/school-anthem": {
    k: "STUDENT LIFE",
    t: "One school. One voice.",
    d: "The JHS anthem celebrates belonging, ethics, knowledge, discipline and pride.",
    heroImage: IMG.independenceday,
    introImage: IMG.ncc,
    accent: "green",
    type: "anthem",
    blocks: [
      {
        number: "01",
        title: "Our vision",
        text: "To create naturalistic and holistic development that empowers students through the best practices of traditional and contemporary education.",
        image: IMG.ncc2,
      },
      {
        number: "02",
        title: "Our mission",
        text: "To provide a student-centric learning environment that develops leadership, self-discipline and self-confidence while encouraging excellence in academics, co-curricular activities and sports.",
        image: IMG.scouts,
      },
    ],
  },

  "/student-life/life-skills": {
    k: "STUDENT LIFE",
    t: "Skills for life.",
    d: "Learning that helps students navigate real-world challenges with confidence.",
    heroImage: IMG.carnivalbg,
    introImage: IMG.carnival2,
    accent: "gold",
    type: "lifeSkills",
    blocks: [
      {
        number: "01",
        title: "Jigyasa",
        text: "JHS presents Jigyasa as a life-skills initiative focused on practical and interpersonal abilities including communication, critical thinking, decision-making and adaptability.",
        image: IMG.jigyasa,
      },
      {
        number: "02",
        title: "Real-world abilities",
        text: "Activities such as stitching, first aid and basic cooking can help students become more independent and confident.",
        image: IMG.yoga,
      },
      {
        number: "03",
        title: "Career awareness",
        text: "Carnival with experienced professionals can expose students to career possibilities and help them think carefully about their future choices.",
        image: IMG.carnival,
      },
    ],
  },

  "/student-life/infinitum-vyoma": {
    k: "STUDENT LIFE / SIGNATURE EVENT",
    t: "Infinitum Vyoma.",
    d: "Boundless learning, leadership, culture and creativity.",
    heroImage: IMG.infinitumvyoma2,
    introImage: IMG.infinitum,
    accent: "green",
    type: "pdf",
    blocks: [
      {
        number: "01",
        title: "Limitless learning",
        text: "Infinitum Vyoma celebrates the boundless potential of young minds through vibrant experiences.",
        image: IMG.infinitum,
      },
      {
        number: "02",
        title: "Lead",
        text: "Students get opportunities to lead, collaborate, organise and take responsibility.",
        image: IMG.scouts,
      },
      {
        number: "03",
        title: "Create",
        text: "Culture, creativity and expression become part of the learning journey, allowing students to discover confidence beyond the classroom.",
        image: IMG.ganeshchaturthi,
      },
    ],
  },

  "/student-life/food-menu": {
    k: "STUDENT LIFE",
    t: "Good food. Good energy.",
    d: "A weekly school food menu designed around balanced nourishment and variety.",
    heroImage: IMG.foodHeroIndian,
    introImage: IMG.foodCafeteriaIntro,
    accent: "gold",
    type: "food",
    blocks: [
      {
        number: "01",
        title: "Monday",
        text: "Breakfast: Idli · Lunch: Chapathi Bhaaji",
        image: IMG.foodMonday,
      },
      {
        number: "02",
        title: "Tuesday",
        text: "Breakfast: Dosa · Lunch: Veg Biriyani",
        image: IMG.foodTuesday,
      },
      {
        number: "03",
        title: "Wednesday",
        text: "Breakfast: Vada · Lunch: Plain Rice & Sambar",
        image: IMG.foodWednesday,
      },
      {
        number: "04",
        title: "Thursday",
        text: "Breakfast: Poha · Lunch: Chapati & Green Peas Masala",
        image: IMG.foodThursday,
      },
      {
        number: "05",
        title: "Friday",
        text: "Breakfast: Upma · Lunch: Chapati & Mixed Vegetable Bhaaji",
        image: IMG.foodFriday,
      },
      {
        number: "06",
        title: "Saturday",
        text: "Breakfast: Poori · Lunch: Roti & Dal Makhani",
        image: IMG.foodSaturday,
      },
    ],
  },

  "/gallery/photos-videos": {
    k: "GALLERY",
    t: "Life at JHS.",
    d: "A visual journal of learning, sports, celebrations, creativity and community.",
    heroImage: IMG.gallerybg,
    introImage: IMG.campus,
    accent: "green",
    type: "gallery",
    blocks: [
      {
        number: "01",
        title: "Campus life",
        text: "Explore photographs from classrooms, activities, campus spaces and student experiences.",
        image: IMG.campus,
      },
      {
        number: "02",
        title: "Sports",
        text: "Athletics, team games, competitions and physical education form an important part of school life.",
        image: IMG.sportscricket,
      },
      {
        number: "03",
        title: "NCC & Scouts",
        text: "Leadership, discipline, service and teamwork come alive through NCC and Scouts & Guides.",
        image: IMG.ncc3,
      },
    ],
  },

  "/news/events-calendar": {
    k: "NEWS / EVENTS",
    t: "What's happening at JHS.",
    d: "Explore school celebrations, activities, special days and community events.",
    heroImage: IMG.adieuparty,
    introImage: IMG.annualday,
    accent: "gold",
    type: "events",
    blocks: [
      {
        number: "01",
        title: "Annual Day",
        text: "A celebration of student achievement, creativity and community.",
        image: IMG.annualday,
      },
      {
        number: "02",
        title: "Go Green Day",
        text: "A school activity encouraging environmental awareness.",
        image: IMG.gogreenday,
      },
      {
        number: "03",
        title: "Yoga Day",
        text: "An opportunity to encourage physical wellbeing, mindfulness and balance.",
        image: IMG.yoga,
      },
      {
        number: "04",
        title: "Sports Week",
        text: "A celebration of fitness, teamwork and sporting spirit.",
        image: IMG.swimming,
      },
      {
        number: "05",
        title: "Jigyasa Life Skills",
        text: "Experiential activities designed to develop practical life skills.",
        image: IMG.jigyasa,
      },
      {
        number: "06",
        title: "Children's Day / Nanhe Kalakar",
        text: "A celebration of childhood, creativity and student expression.",
        image: IMG.nanhekalakar,
      },
    ],
  },

  "/disclosure": {
    k: "DISCLOSURE",
    t: "Mandatory public disclosure.",
    d: "Important school information presented clearly and transparently.",
    heroImage: IMG.bg,
    introImage: IMG.disclosureIntro,
    accent: "green",
    type: "disclosure",
    blocks: [
      {
        number: "01",
        title: "School",
        text: "JAIN HERITAGE SCHOOL",
        image: IMG.bg,
      },
      {
        number: "02",
        title: "CBSE affiliation",
        text: "Affiliation No: 830593",
        image: IMG.disclosureCbse,
      },
      {
        number: "03",
        title: "School code",
        text: "School Code: 45531",
        image: IMG.disclosureCode,
      },
      {
        number: "04",
        title: "Principal",
        text: "Mrs. Rohini, M.Sc, M.Ed",
        image: IMG.bg,
      },
      {
        number: "05",
        title: "Email",
        text: "principal@jhsbgm.in",
        image: IMG.contactEmail,
      },
      {
        number: "06",
        title: "Contact",
        text: "+91-9741672021",
        image: IMG.disclosureContact,

      },
    ],
  },

  "/blogs": {
    k: "JHS JOURNAL",
    t: "Ideas that keep moving.",
    d: "Stories, education, school life, parenting and learning from the JHS community.",
    heroImage: IMG.bg,
    introImage: "/images/blogs/top-skills-every-child-learns-at-cbse-schools-in-belgaum.jpg",
    accent: "gold",
    type: "blogs",
    blocks: [
      {
        number: "01",
        title:
          "A Day at JHS in the Life of a Jainite and Its Empowering School Journey",
        text: "A look at how academic learning, values, activities, reflection and community experiences shape a student's day.",
        image: IMG.about,
      },
      {
        number: "02",
        title: "CBSE excellence from day one",
        text: "JHS describes a learning journey that begins with play-based early education and develops toward conceptual clarity, technology integration and holistic growth.",
        image: IMG.academics,
      },
      {
        number: "03",
        title: "Education beyond examinations",
        text: "School life includes sports, arts, leadership, public speaking, clubs and social initiatives alongside academic learning.",
        image: IMG.beyondclassroom,
      },
    ],
  },

  "/faq": {
    k: "HELP CENTRE",
    t: "Questions. Answered.",
    d: "Clear information for parents and students exploring JHS.",
    heroImage: IMG.bg,
    introImage: IMG.faqQuestionsAnswers,
    accent: "green",
    type: "faq",
    blocks: [
      {
        number: "01",
        title: "Why JHS?",
        text: "JHS combines a NEP-aligned CBSE approach, modern infrastructure and holistic development.",
        image: IMG.ourphilosophy,
      },
      {
        number: "02",
        title: "What age groups are covered?",
        text: "The published FAQ describes programmes from preschool through Grade 12.",
        image: IMG.preprimarylearning,
      },
      {
        number: "03",
        title: "How is campus safety handled?",
        text: "The school highlights CCTV surveillance, trained staff and a child-friendly campus.",
        image: IMG.safetyfirst,
      },
      {
        number: "04",
        title: "What extracurricular activities are available?",
        text: "Activities include robotics, performing arts, sports coaching and creative writing.",
        image: IMG.cocurricularactivities,
      },
      {
        number: "05",
        title: "How do teachers support students?",
        text: "JHS highlights CBSE-trained professionals, application-based learning, structured assessments and personalised mentoring.",
        image: IMG.smartclassroom,
      },
      {
        number: "06",
        title: "How does JHS support career readiness?",
        text: "Career counselling, expert sessions and community initiatives help students think about future pathways.",
        image: IMG.learningbeyondclassroom,
      },
    ],
  },

  "/contact-us": {
    k: "CONTACT",
    t: "Let's start a conversation.",
    d: "Visit, call or write to Jain Heritage School, Belagavi.",
    heroImage: IMG.bg,
    introImage: IMG.scheduleinterview,
    accent: "gold",
    type: "contact",
    blocks: [
      {
        number: "01",
        title: "Campus",
        text: "1598, Adjacent to Foundry Cluster, Dutch Industrial Estate, Rani Chennamma Nagar, Belagavi, Karnataka 590008",
        image: IMG.campus,
      },
      {
        number: "02",
        title: "Phone",
        text: "0831 248 3025 · +91 9108527077",
        image: IMG.contactPhoneEmail,
      },
      {
        number: "03",
        title: "Email",
        text: "principal@jhsbgm.in",
        image: IMG.contactEmail,
      },
      {
        number: "04",
        title: "Visiting hours",
        text: "Monday–Saturday · 8:00 AM–5:00 PM",
        image: IMG.campuslife,
      },
    ],
  },
};

const pageArchetypes = {
  "/about/chairman-message": {
    theme: "leadership",
    pill: "FOUNDER'S VISION & PURPOSE",
    possibilityTitle: "Pillars of Our Educational Vision",
    possibilityDesc: "Guiding principles established by Dr. Chenraj Roychand to inspire holistic, purpose-driven learning.",
    layoutMode: "editorial",
    showQuoteBook: true,
    showSpecialFirst: false,
    kicker: "01 / LEADERSHIP ETHOS",
  },
  "/about/at-a-glance": {
    theme: "glance",
    pill: "AT A GLANCE · BELAGAVI",
    possibilityTitle: "Foundations of Excellence",
    possibilityDesc: "The core philosophy, environment, and community standards that define daily life at JHS.",
    layoutMode: "grid",
    showQuoteBook: true,
    showSpecialFirst: false,
    showGlanceMetrics: true,
    kicker: "02 / INSTITUTIONAL OVERVIEW",
  },
  "/about/infrastructure": {
    theme: "campus",
    pill: "CAMPUS SPACES & ARCHITECTURE",
    possibilityTitle: "World-Class Learning Facilities",
    possibilityDesc: "Designed with safety, light, and technology to foster curiosity and hands-on discovery.",
    layoutMode: "grid",
    showQuoteBook: true,
    showSpecialFirst: false,
    showCoordinates: true,
    kicker: "03 / CAMPUS INFRASTRUCTURE",
  },
  "/about/library": {
    theme: "library",
    pill: "ACADEMIC RESOURCE CENTRE",
    possibilityTitle: "The Literary & Research Sanctuary",
    possibilityDesc: "Over 40,000 volumes, digital journals, and quiet alcoves dedicated to lifelong scholarship.",
    layoutMode: "editorial",
    showQuoteBook: true,
    showSpecialFirst: false,
    kicker: "04 / KNOWLEDGE SANCTUARY",
  },
  "/admissions/eligibility": {
    theme: "admissions",
    pill: "ADMISSIONS GUIDELINES & CRITERIA",
    possibilityTitle: "The Admissions Roadmap",
    possibilityDesc: "Clear, transparent parameters ensuring every child steps into an environment where they can thrive.",
    layoutMode: "roadmap",
    showQuoteBook: true,
    showSpecialFirst: true,
    stepBadge: "STEP 01",
    kicker: "01 / ADMISSION CRITERIA",
  },
  "/admissions/schedule-interview": {
    theme: "admissions",
    pill: "INTERACTIVE CAMPUS VISIT",
    possibilityTitle: "What to Expect During Your Visit",
    possibilityDesc: "An open, welcoming dialogue between educators, parents, and prospective students.",
    layoutMode: "roadmap",
    showQuoteBook: true,
    showSpecialFirst: true,
    stepBadge: "STEP 02",
    kicker: "02 / INTERACTIVE VISIT",
  },
  "/admissions/documents-required": {
    theme: "admissions",
    pill: "REQUIRED CREDENTIALS & RECORDS",
    possibilityTitle: "Smooth Verification & Onboarding",
    possibilityDesc: "Everything you need to finalize enrollment with speed and clarity.",
    layoutMode: "roadmap",
    showQuoteBook: true,
    showSpecialFirst: true,
    stepBadge: "STEP 03",
    kicker: "03 / DOCUMENT VERIFICATION",
  },
  "/academics": {
    theme: "academics",
    pill: "CBSE ACADEMIC FRAMEWORK & PEDAGOGY",
    possibilityTitle: "From Curiosity to Capability",
    possibilityDesc: "A developmental continuum spanning Early Years play to Senior Secondary career readiness.",
    layoutMode: "cards",
    showQuoteBook: true,
    showSpecialFirst: true,
    kicker: "ACADEMIC EXCELLENCE",
  },
  "/student-life/awards-and-honors": {
    theme: "awards",
    pill: "STUDENT ACCOLADES & MERIT",
    possibilityTitle: "The Culture of Achievement",
    possibilityDesc: "Celebrating academic toppers, sports champions, and community champions across Belagavi.",
    layoutMode: "cards",
    showQuoteBook: true,
    showSpecialFirst: true,
    kicker: "ACADEMIC & CO-CURRICULAR MERIT",
  },
  "/student-life/school-anthem": {
    theme: "anthem",
    pill: "VOICE OF JAIN HERITAGE",
    possibilityTitle: "Heritage, Pride & Belonging",
    possibilityDesc: "The poetic verses and musical score that unite generations of Jainites.",
    layoutMode: "editorial",
    showQuoteBook: true,
    showSpecialFirst: true,
    kicker: "SCHOOL TRADITION",
  },
  "/student-life/life-skills": {
    theme: "lifeskills",
    pill: "CHARACTER & EXPERIENTIAL LEARNING",
    possibilityTitle: "Learning Beyond the Textbook",
    possibilityDesc: "Hands-on life skills, NCC discipline, and environmental responsibility.",
    layoutMode: "cards",
    showQuoteBook: true,
    showSpecialFirst: true,
    kicker: "HOLISTIC GROWTH",
  },
  "/student-life/infinitum-vyoma": {
    theme: "magazine",
    pill: "STUDENT LITERARY PUBLICATIONS",
    possibilityTitle: "Creative Expressions & Perspectives",
    possibilityDesc: "The annual student-edited magazine capturing stories, original art, and scholarly essays.",
    layoutMode: "editorial",
    showQuoteBook: true,
    showSpecialFirst: true,
    kicker: "LITERARY CURATION",
  },
  "/student-life/food-menu": {
    theme: "food",
    pill: "WHOLESOME CAMPUS NUTRITION",
    possibilityTitle: "Nutrition, Health & Dining Values",
    possibilityDesc: "100% vegetarian, balanced culinary care prepared daily in our hygienic campus kitchen.",
    layoutMode: "cards",
    showQuoteBook: true,
    showSpecialFirst: true,
    kicker: "CAMPUS DINING",
  },
  "/gallery/photos-videos": {
    theme: "gallery",
    pill: "CAMPUS VISUAL ARCHIVE",
    possibilityTitle: "Life at JHS in Focus",
    possibilityDesc: "Photographic glimpses into academics, arts, sports, and memorable campus milestones.",
    layoutMode: "grid",
    showQuoteBook: true,
    showSpecialFirst: true,
    kicker: "VISUAL DIARY",
  },
  "/news/events-calendar": {
    theme: "events",
    pill: "ANNUAL CELEBRATIONS & EVENTS",
    possibilityTitle: "Milestones Across the Academic Year",
    possibilityDesc: "From national celebrations to inter-school tournaments, every month brings new energy.",
    layoutMode: "roadmap",
    showQuoteBook: true,
    showSpecialFirst: true,
    kicker: "ACADEMIC TIMELINE",
  },
  "/disclosure": {
    theme: "disclosure",
    pill: "MANDATORY PUBLIC DISCLOSURE · CBSE AFFILIATION NO. 830593",
    possibilityTitle: "Statutory Governance & Transparency",
    possibilityDesc: "Official CBSE affiliation documentation, land certificates, fire safety compliance, and fee structures.",
    layoutMode: "grid",
    showQuoteBook: true,
    showSpecialFirst: true,
    kicker: "STATUTORY COMPLIANCE",
  },
  "/blogs": {
    theme: "blogs",
    pill: "THE JHS JOURNAL & PERSPECTIVES",
    possibilityTitle: "Insights on Education & Parenting",
    possibilityDesc: "Expert articles from our faculty on child development, CBSE preparation, and holistic learning.",
    layoutMode: "editorial",
    showQuoteBook: true,
    showSpecialFirst: true,
    kicker: "THOUGHT LEADERSHIP",
  },
  "/faq": {
    theme: "faq",
    pill: "PARENT HELP CENTRE & ANSWERS",
    possibilityTitle: "Clear Guidance for Families",
    possibilityDesc: "Answers to the most frequent inquiries regarding admissions, curriculum, safety, and activities.",
    layoutMode: "cards",
    showQuoteBook: true,
    showSpecialFirst: true,
    kicker: "HELP & SUPPORT",
  },
  "/contact-us": {
    theme: "contact",
    pill: "CAMPUS DIRECTORY & INQUIRIES",
    possibilityTitle: "Connecting with Jain Heritage School",
    possibilityDesc: "We invite you to tour our Belagavi campus, meet our leadership, and explore the admissions journey.",
    layoutMode: "cards",
    showQuoteBook: true,
    showSpecialFirst: true,
    kicker: "DIRECT ENGAGEMENT",
  },
};

function ContentPage({ data }) {
  useReveal();
  const location = useLocation();
  const pathname = location.pathname;
  const archetype = pageArchetypes[pathname] || {
    theme: data.type || "default",
    pill: "CAMPUS & PHILOSOPHY",
    possibilityTitle: "Built Around Possibility",
    possibilityDesc: data.possibility?.description || data.d,
    layoutMode: "standard",
    showQuoteBook: true,
    showSpecialFirst: false,
    kicker: "THE JHS APPROACH",
  };

  const introRef = useRef(null);
  const alive = data.alive || {
    title: data.t.replace(/\.$/, "."),
    description: data.d,
    support: data.blocks?.[0]?.text,
  };

  useEffect(() => {
    if (data.type !== "admission-form") return undefined;
    const timer = setTimeout(openAdmissionModal, 350);
    return () => clearTimeout(timer);
  }, [data.type]);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        intro,
        { "--intro-parallax": "24px" },
        {
          "--intro-parallax": "-24px",
          ease: "none",
          scrollTrigger: {
            trigger: intro,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      className={`inner-page ${data.accent || "green"} editorial-page ${data.type ? `page-type-${data.type}` : ""
        } page-theme-${archetype.theme}`}
    >
      {pathname === "/contact-us" ? (
        <ScrollFrameHero variant="contact" />
      ) : pathname === "/gallery/photos-videos" ? (
        <ScrollFrameHero variant="sports" />
      ) : (
        <PageHero
          kicker={data.k}
          title={data.t}
          desc={data.d}
          image={data.heroImage}
        />
      )}

      <PageProgress />

      <main className="content-page">
        {/* INTRO SECTION WITH PER-PAGE ARCHETYPE TREATMENT */}
        <section
          className={`page-intro-content section page-intro-${archetype.theme}`}
        >
          <div className="intro-feature-image">
            <span className="ifi-corner-accent ifi-corner-tl" aria-hidden="true" />
            <span className="ifi-corner-accent ifi-corner-br" aria-hidden="true" />
            <img
              src={data.introImage}
              alt={`${data.t} introduction`}
              loading="eager"
              decoding="async"
            />
            <span className="ifi-index" aria-hidden="true">
              {archetype.stepBadge || "01"}
            </span>
            <div className="ifi-badge-stack" aria-hidden="true">
              <div className="ifi-caption-pill">
                <span>{archetype.pill}</span>
              </div>
              {archetype.theme === "disclosure" && (
                <div className="ifi-verified-seal">
                  <CheckCircle2 size={15} />
                  <span>CBSE AFFILIATED · OFFICIALLY VERIFIED</span>
                </div>
              )}
            </div>
            {archetype.stepBadge && (
              <div className="ifi-step-badge" aria-hidden="true">
                <span>{archetype.stepBadge}</span>
              </div>
            )}
          </div>

          <div className="page-intro-copy">
            <div className="sh-rule-row" aria-hidden="true">
              <span className="sh-rule" />
              <p className="eyebrow sh-kicker">{data.k || "JAIN HERITAGE SCHOOL"}</p>
            </div>
            <h2>{alive.title}</h2>
            <p>{alive.description}</p>
            {alive.support && (
              <strong className="alive-support">{alive.support}</strong>
            )}
            {archetype.showGlanceMetrics && (
              <div className="intro-glance-metrics" data-reveal>
                <div className="igm-item">
                  <span className="igm-num">2002</span>
                  <span className="igm-label">Established</span>
                </div>
                <div className="igm-item">
                  <span className="igm-num">20K+</span>
                  <span className="igm-label">Successful Kids</span>
                </div>
                <div className="igm-item">
                  <span className="igm-num">CBSE</span>
                  <span className="igm-label">Affiliation 830593</span>
                </div>
                <div className="igm-item">
                  <span className="igm-num">1:30</span>
                  <span className="igm-label">Teacher to Student ratio</span>
                </div>
              </div>
            )}
            {archetype.showCoordinates && (
              <div className="intro-coords-pill" data-reveal>
                <MapPin size={14} />
                <span>Belagavi Campus · 15.8497° N, 74.4977° E</span>
              </div>
            )}
          </div>
        </section>

        {/* PRIORITY SPECIAL CONTENT: rendered first for interactive tools */}
        {archetype.showSpecialFirst && (
          <>
            {data.type === "eligibility" && <EligibilityTable />}
            {data.type === "admission-form" && pathname !== "/admissions/schedule-interview" && <AdmissionJourney />}
            {data.type === "academics" && <AcademicCards />}
            {data.type === "documents" && <DocumentsChecklist />}
            {data.type === "lifeSkills" && <LifeSkillsSection />}
            {data.type === "awards" && <AwardsSection />}
            {data.type === "pdf" && <PdfShowcase />}
            {data.type === "gallery" && (
              <>
                <GalleryFlythrough />
                <CreativeGallery />
              </>
            )}
            {data.type === "events" && <EventsTimeline />}
            {data.type === "food" && <FoodMenu />}
            {data.type === "disclosure" && <DisclosureGrid />}
            {data.type === "faq" && <FAQSection />}
            {data.type === "blogs" && <BlogCards />}
            {data.type === "anthem" && <AnthemSection />}
            {data.type === "contact" && <ContactForm />}
          </>
        )}

        {/* BOOK ANIMATION: 3D physical book experience on all subpages */}
        <QuoteBook />

        {/* NON-PRIORITY SPECIAL CONTENT */}
        {!archetype.showSpecialFirst && (
          <>
            {data.type === "eligibility" && <EligibilityTable />}
            {data.type === "admission-form" && pathname !== "/admissions/schedule-interview" && <AdmissionJourney />}
            {data.type === "academics" && <AcademicCards />}
            {data.type === "documents" && <DocumentsChecklist />}
            {data.type === "lifeSkills" && <LifeSkillsSection />}
            {data.type === "awards" && <AwardsSection />}
            {data.type === "pdf" && <PdfShowcase />}
            {data.type === "gallery" && (
              <>
                <GalleryFlythrough />
                <CreativeGallery />
              </>
            )}
            {data.type === "events" && <EventsTimeline />}
            {data.type === "food" && <FoodMenu />}
            {data.type === "disclosure" && <DisclosureGrid />}
            {data.type === "faq" && <FAQSection />}
            {data.type === "blogs" && <BlogCards />}
            {data.type === "anthem" && <AnthemSection />}
            {data.type === "contact" && <ContactForm />}
          </>
        )}

        {/* CONTENT BLOCKS WITH TAILORED ARCHETYPE LAYOUT */}
        <PossibilitySection
          title={archetype.possibilityTitle}
          description={data.possibility?.description || archetype.possibilityDesc || alive.description}
          blocks={data.blocks}
          layoutMode={archetype.layoutMode}
          kicker={archetype.kicker || data.k || "THE JHS APPROACH"}
        />

        {data.type !== "disclosure" && <CTA />}
      </main>
    </div>
  );
}

function PossibilitySection({
  title = "Built Around Possibility",
  description,
  blocks = [],
  layoutMode = "standard",
  kicker = "THE JHS APPROACH",
}) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const wordRef = useRef(null);
  const lineRef = useRef(null);
  const location = useLocation();

  // Split title: first part in static span, final word styled & animated in italic
  const words = (title || "Built Around Possibility").trim().split(/\s+/).filter(Boolean);
  const highlightTarget = words.length > 1 ? words.pop() : words[0] || "Possibility";
  const firstPart = words.join(" ");

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const word = wordRef.current;
    const characters = word?.querySelectorAll(".possibility-char");
    const underline = lineRef.current;

    if (!section || !word || !characters?.length) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(characters, {
        opacity: 1,
        filter: "none",
        x: 0,
        y: 0,
        scale: 1,
      });
      if (underline) {
        gsap.set(underline, {
          scaleX: 1,
          opacity: 1,
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // Set initial states cleanly
      gsap.set(characters, {
        opacity: 0,
        y: 14,
        scale: 0.95,
        willChange: "transform, opacity",
      });

      if (underline) {
        gsap.set(underline, {
          scaleX: 0,
          opacity: 0.4,
          transformOrigin: "left center",
          willChange: "transform",
        });
      }

      // Master scroll-scrubbed timeline anchored directly to heading in viewport
      // Delayed trigger (top 68%) and extended distance (top 18%) for a slower, gradual reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heading || word,
          start: "top 75%",
          end: "top 25%",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Character-by-character smooth gradual reveal
      tl.to(
        characters,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.06,
          ease: "power1.out",
          duration: 1.0,
        },
        0,
      );

      // Synchronized golden underline expansion under the characters
      if (underline) {
        tl.to(
          underline,
          {
            scaleX: 1,
            opacity: 1,
            ease: "power1.out",
            duration: 1.4,
          },
          0.1,
        );
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, [title, location.pathname]);

  return (
    <section
      ref={sectionRef}
      className={`story-section section layout-${layoutMode}`}
    >
      {/* Floating books accent the editorial heading */}
      <FloatingBooksDecoration className="story-books-deco" count={2} />
      <div ref={headingRef} className="story-heading">
        <div className="sh-rule-row" aria-hidden="true">
          <span className="sh-rule" />
          <p className="eyebrow sh-kicker">{kicker}</p>
        </div>

        <h2 className="possibility-title">
          {firstPart && <span className="possibility-static">{firstPart} </span>}
          <i
            ref={wordRef}
            className="possibility-word"
            aria-label={highlightTarget}
          >
            {highlightTarget
              .split("")
              .map((character, index) => (
                <span
                  key={index}
                  className="possibility-char"
                  aria-hidden="true"
                >
                  {character}
                </span>
              ))}
            <span ref={lineRef} className="possibility-line" aria-hidden="true" />
          </i>
        </h2>

        {description && <p>{description}</p>}
      </div>

      {layoutMode === "grid" ? (
        <div className="story-grid-layout">
          {blocks.map((block, i) => {
            const blockImage =
              block.image ||
              [
                IMG.smartclassroom,
                IMG.labchemistry,
                IMG.bg2,
                IMG.safetyfirst,
                IMG.annualday,
              ][i % 5];
            return (
              <div key={block.title} className="story-grid-card" data-reveal>
                <div className="sgc-image-wrap">
                  <img
                    src={blockImage}
                    alt={block.title}
                    loading="eager"
                    decoding="async"
                  />
                  <span className="sgc-num">{block.number || `0${i + 1}`}</span>
                  <div className="sgc-badge">EXPLORE</div>
                </div>
                <div className="sgc-body">
                  <span className="sgc-kicker">{kicker}</span>
                  <h3>{block.title}</h3>
                  <p>{block.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : layoutMode === "roadmap" ? (
        <div className="story-roadmap-layout">
          {blocks.map((block, i) => {
            const blockImage =
              block.image ||
              [
                IMG.eligibility,
                IMG.scheduleinterview,
                IMG.documentsrequired,
              ][i % 3];
            return (
              <div key={block.title} className="story-roadmap-step" data-reveal>
                <div className="srs-spine">
                  <span className="srs-node">{block.number || `0${i + 1}`}</span>
                  {i < blocks.length - 1 && <span className="srs-line" />}
                </div>
                <div className="srs-card">
                  <div className="srs-card-img">
                    <img
                      src={blockImage}
                      alt={block.title}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="srs-card-content">
                    <span className="srs-badge">
                      STAGE {block.number || `0${i + 1}`}
                    </span>
                    <h3>{block.title}</h3>
                    <p>{block.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="story-list">
          {blocks.map((block, i) => {
            const storyImage =
              block.image ||
              [IMG.ncc, IMG.ncc2, IMG.library, IMG.annualday, IMG.academics][
              i % 5
              ];

            const isReverse = Boolean(i % 2);

            return (
              <article
                key={block.title}
                className={`story-row ${isReverse ? "story-row-reverse" : ""}`}
                data-reveal
              >
                <div className="story-image-column">
                  <div className="story-image-frame">
                    <span className="sif-corner sif-corner-tl" aria-hidden="true" />
                    <span className="sif-corner sif-corner-br" aria-hidden="true" />
                    <img
                      className="story-row-image"
                      src={storyImage}
                      alt={block.imageAlt || block.title}
                      loading="eager"
                      decoding="async"
                    />
                    <div className="story-image-overlay" />
                    <div className="story-image-badge">
                      <span>EXPLORE JHS</span>
                    </div>
                  </div>
                </div>

                <div className="story-content">
                  <div className="story-content-meta">
                    <span className="story-number">
                      {block.number || `0${i + 1}`}
                    </span>
                    <span className="story-meta-line" />
                    <span className="story-kicker">{kicker}</span>
                  </div>
                  <h3>{block.title}</h3>
                  <p>{block.text}</p>
                  <div className="story-indicator-row">
                    <span className="story-dot" />
                    <span className="story-tagline">
                      Holistic Learning Framework
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function AwardsSection() {
  const honors = [
    {
      year: "2025",
      title: "Board achievers",
      text: "Celebrating the latest JHS toppers and the steady discipline behind their results.",
      image: IMG.toppers2025,
    },
    {
      year: "2024",
      title: "Board achievers",
      text: "Another year of students showing what focused, confident learning can make possible.",
      image: IMG.toppers2024,
    },
    {
      year: "2023",
      title: "Board achievers",
      text: "A growing record of academic achievement built with support from teachers and families.",
      image: IMG.toppers2023,
    },
  ];

  return (
    <section className="awards-section section">
      <SectionHead
        kicker="AWARDS & HONORS"
        chip
        title="Excellence, year after year."
        desc="JHS is recognised for achieving a 100% AISSE Grade 10 result for five consecutive years, alongside the achievements of its toppers."
      />

      {/* Flagship Landmark Milestone Showcase */}
      <div className="honors-feature" data-reveal>
        <div className="honors-feature-content">
          <div className="honors-badge-pill">
            <span className="honors-badge-dot" />
            <span>LANDMARK RECORD • 5 CONSECUTIVE YEARS</span>
          </div>

          <div className="honors-stat-wrap">
            <strong className="honors-stat-num">100%</strong>
            <div className="honors-stat-meta">
              <span className="honors-stat-label">AISSE GRADE 10 RESULT</span>
              <span className="honors-stat-sub">Five Consecutive Years of Perfection</span>
            </div>
          </div>

          <p className="honors-feature-text">
            JHS is recognised for achieving a 100% AISSE Grade 10 result for five consecutive years, alongside the achievements of its toppers.
          </p>

          <div className="honors-metrics-row">
            <div className="honors-metric-chip">
              <span className="honors-metric-val">100%</span>
              <span className="honors-metric-lbl">Pass Rate</span>
            </div>
            <div className="honors-metric-chip">
              <span className="honors-metric-val">5 Yrs</span>
              <span className="honors-metric-lbl">Clean Streak</span>
            </div>
            <div className="honors-metric-chip">
              <span className="honors-metric-val">CBSE</span>
              <span className="honors-metric-lbl">Affiliation</span>
            </div>
          </div>
        </div>

        <div className="honors-feature-media">
          <img
            src={IMG.badge}
            alt="Students at a JHS badging ceremony"
            loading="eager"
            decoding="async"
          />
          <div className="honors-media-overlay" />
          <div className="honors-media-tag">
            <span>ANNUAL BADGING & RECOGNITION</span>
          </div>
        </div>
      </div>

      {/* Modern Achievers Cards Grid */}
      <div className="honors-grid">
        {honors.map((honor) => (
          <article className="honor-card" data-reveal key={honor.year}>
            <div className="honor-card-media">
              <img src={honor.image} alt={honor.title} loading="eager" decoding="async" />
              <div className="honor-media-scrim" />
              <div className="honor-card-chip">
                <span>CLASS OF {honor.year}</span>
              </div>
            </div>

            <div className="honor-card-body">
              <div className="honor-card-meta">
                <span className="honor-kicker">ACADEMIC EXCELLENCE</span>
                <span className="honor-year-num">{honor.year}</span>
              </div>
              <h3 className="honor-card-title">{honor.title}</h3>
              <span className="honor-card-rule" />
              <p className="honor-card-text">{honor.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DocumentsChecklist() {
  const renderDocIcon = (icon) => {
    switch (icon) {
      case "id":
        return <CreditCard className="document-file-icon" size={20} />;
      case "tc":
        return <GraduationCap className="document-file-icon" size={20} />;
      case "marks":
        return <Award className="document-file-icon" size={20} />;
      case "photo":
      case "parent-photo":
        return <Camera className="document-file-icon" size={20} />;
      case "parent":
        return <Users className="document-file-icon" size={20} />;
      default:
        return <FileCheck className="document-file-icon" size={20} />;
    }
  };

  return (
    <section className="documents-section section">
      <SectionHead
        kicker="ADMISSIONS / CHECKLIST"
        title="Bring the essentials."
        desc="A clear, verified checklist of documentation required for admission and registration."
      />
      <div className="documents-meta-banner" data-reveal>
        <div className="dmb-item">
          <span className="dmb-dot" />
          <span>ORIGINALS FOR ON-CAMPUS VERIFICATION</span>
        </div>
        <div className="dmb-item">
          <span className="dmb-dot" />
          <span>SELF-ATTESTED PHOTOCOPIES (2 SETS)</span>
        </div>
        <div className="dmb-item">
          <span className="dmb-dot" />
          <span>ADMISSIONS DESK ASSISTANCE AVAILABLE</span>
        </div>
      </div>
      <div className="documents-grid">
        {documents.map((item, index) => (
          <article className="document-card" data-reveal key={item.title}>
            <div className="doc-card-accent-line" aria-hidden="true" />
            <div className="doc-card-left">
              <span className="doc-num">{String(index + 1).padStart(2, "0")}</span>
              <div className="document-icon-wrap">
                {renderDocIcon(item.icon)}
              </div>
            </div>
            <div className="doc-card-right">
              <div className="document-card-top">
                <span className="doc-category-tag">{item.category}</span>
                <span className={`doc-status-badge ${item.badge === "MANDATORY" ? "badge-mandatory" : "badge-required"}`}>
                  <span className="doc-badge-dot" />
                  {item.badge}
                </span>
              </div>
              <h3 className="doc-card-title">{item.title}</h3>
              <p className="doc-card-spec">{item.spec}</p>
              <div className="doc-card-footer">
                <span className="doc-copies-pill">
                  <CheckCircle2 size={13} className="doc-copies-icon" />
                  <span className="doc-copies-text">{item.copies}</span>
                </span>
                <span className="doc-verify-cue">On-Campus Verification</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LifeSkillsSection() {
  const skills = [
    "Communication",
    "Critical thinking",
    "Decision making",
    "Adaptability",
    "First aid",
    "Basic cooking",
  ];
  return (
    <section className="skills-section section dark">
      <SectionHead
        kicker="JIGYASA / LIFE SKILLS"
        chip="left"
        title="Capability grows through practice."
        desc="Students learn to make thoughtful choices, collaborate and care for themselves and others."
      />
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <article className="skill-card" data-reveal key={skill}>
            <span>0{index + 1}</span>
            <h3>{skill}</h3>
            <p>
              Practical experiences that build confidence for everyday life.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PdfShowcase() {
  const pdf = "/pdf/infinitum-vyoma.pdf";
  return (
    <section className="pdf-section section">
      <SectionHead
        kicker="SIGNATURE EVENT / PDF"
        title="Explore Infinitum Vyoma."
        desc="Open the event document in a responsive viewer or download it for later."
      />
      <div className="pdf-card">
        <div className="pdf-meta">
          <FileText />
          <div>
            <strong>Infinitum Vyoma</strong>
            <span>Event publication</span>
          </div>
          <a className="pill green" href={pdf} download>
            Download <Download size={16} />
          </a>
        </div>
        <iframe title="Infinitum Vyoma document" src={pdf} />
        <a
          className="pdf-fullscreen"
          href={pdf}
          target="_blank"
          rel="noreferrer"
        >
          <Maximize2 size={16} /> Open full screen
        </a>
      </div>
    </section>
  );
}

function PageProgress() {
  return <div className="page-progress" aria-hidden="true" />;
}

function EligibilityTable() {
  const rows = [
    { grade: "Early Year", age: "2 years", stage: "Foundational Stage", badge: "Playway" },
    { grade: "Nursery", age: "3 years", stage: "Foundational Stage", badge: "Early Discovery" },
    { grade: "LKG", age: "4 years", stage: "Foundational Stage", badge: "Pre-Primary" },
    { grade: "UKG", age: "5 years", stage: "Foundational Stage", badge: "Pre-Primary" },
    { grade: "Grade 1", age: "6 years", stage: "Preparatory Stage", badge: "Primary" },
    { grade: "Grade 2", age: "7 years", stage: "Preparatory Stage", badge: "Primary" },
    { grade: "Grade 3", age: "8 years", stage: "Preparatory Stage", badge: "Primary" },
    { grade: "Grade 4", age: "9 years", stage: "Preparatory Stage", badge: "Primary" },
    { grade: "Grade 5", age: "10 years", stage: "Preparatory Stage", badge: "Primary" },
    { grade: "Grade 6", age: "11 years", stage: "Middle Stage", badge: "Middle School" },
    { grade: "Grade 7", age: "12 years", stage: "Middle Stage", badge: "Middle School" },
    { grade: "Grade 8", age: "13 years", stage: "Middle Stage", badge: "Middle School" },
    { grade: "Grade 9", age: "14 years", stage: "Secondary Stage", badge: "High School" },
    { grade: "Grade 10", age: "15 years", stage: "Secondary Stage", badge: "Board Year" },
  ];

  return (
    <section className="special-section section">
      <SectionHead
        kicker="ADMISSIONS / AGE GUIDE"
        title="Find the right starting point."
        desc="Published age guidelines for the JHS admission journey, aligned with CBSE and NEP frameworks."
      />

      <div className="eligibility-grid">
        {rows.map((row, i) => (
          <div className="eligibility-card" data-reveal key={row.grade}>
            <div className="eligibility-card-header">
              <span className="eligibility-idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="eligibility-stage-badge">{row.badge}</span>
            </div>

            <div className="eligibility-card-body">
              <span className="eligibility-stage-label">{row.stage}</span>
              <strong>{row.grade}</strong>
            </div>

            <div className="eligibility-card-footer">
              <span className="eligibility-age-label">Required Age</span>
              <em>{row.age}</em>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AdmissionJourney() {
  const steps = [
    {
      n: "01",
      subtitle: "DISCOVERY",
      title: "Explore",
      text: "Discover the JHS approach, campus, curriculum and activities.",
    },
    {
      n: "02",
      subtitle: "ENQUIRY",
      title: "Enquire",
      text: "Share your child's details with our dedicated admissions team.",
    },
    {
      n: "03",
      subtitle: "CONVERSATION",
      title: "Interact",
      text: "Participate in a friendly assessment or student interaction.",
    },
    {
      n: "04",
      subtitle: "CAMPUS TOUR",
      title: "Visit",
      text: "Experience the lush 10-acre campus and meet our community.",
    },
    {
      n: "05",
      subtitle: "WELCOME",
      title: "Join",
      text: "Complete enrolment formalities and step into the JHS family.",
    },
  ];

  return (
    <section className="journey section dark">
      <SectionHead
        kicker="THE ADMISSION JOURNEY"
        title="From enquiry to belonging."
        desc="A simple, transparent, and welcoming pathway for families."
      />

      <div className="journey-track-wrapper">
        <div className="journey-line-connector" aria-hidden="true" />
        <div className="journey-track">
          {steps.map((step) => (
            <div className="journey-card" data-reveal key={step.n}>
              <div className="journey-card-header">
                <span className="journey-step-num">{step.n}</span>
                <span className="journey-step-sub">{step.subtitle}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <div className="journey-card-glow" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
      <div className="journey-cta-wrap">
        <button className="pill light journey-cta" onClick={openAdmissionModal}>
          Schedule an Interview <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

function AcademicCards() {
  const cards = [
    [
      "01",
      "Pre-primary",
      "Physical, social and emotional development through playful and activity-based learning.",
      "EARLY FOUNDATION",
    ],
    [
      "02",
      "Abacus",
      "A value-added learning experience that develops numerical thinking and mental agility.",
      "STEM & NUMERACY",
    ],
    [
      "03",
      "Robotics",
      "Hands-on exploration that introduces students to technology, coding and problem solving.",
      "FUTURE TECH",
    ],
    [
      "04",
      "Application",
      "Learning that encourages students to connect abstract concepts with real-world situations.",
      "EXPERIENTIAL",
    ],
    [
      "05",
      "Technology",
      "Digital tools and smart classrooms support visual, immersive and interactive learning.",
      "SMART CAMPUS",
    ],
    [
      "06",
      "Co-curricular",
      "Sports, performing arts, leadership and clubs develop well-rounded, confident learners.",
      "HOLISTIC ARTS",
    ],
  ];

  return (
    <section className="academic-mosaic section">
      <SectionHead
        kicker="HOW WE LEARN"
        chip="left"
        title="Knowledge becomes experience."
        desc="A comprehensive curriculum balancing academic rigor with creative exploration."
      />

      <div className="academic-grid">
        {cards.map(([number, title, text, tag], i) => (
          <article
            className={`academic-card card-${i + 1}`}
            data-reveal
            key={title}
          >
            <div className="academic-card-top">
              <span className="academic-num">{number}</span>
              <span className="academic-tag">{tag}</span>
              <ArrowDownRight className="academic-arrow" />
            </div>
            <div className="academic-card-content">
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
            <div className="academic-card-hover-border" aria-hidden="true" />
          </article>
        ))}
      </div>
      <div className="academic-tracks">
        <article data-reveal className="academic-track-card">
          <div className="academic-track-media">
            <img
              src={IMG.academicsbg}
              alt="Pre Schooling at Jain Heritage School"
              loading="eager"
              decoding="async"
            />
            <div className="academic-track-badge">
              <span>EARLY YEARS PROGRAMME</span>
            </div>
          </div>
          <div className="academic-track-info">
            <p className="eyebrow">01 / PRE SCHOOLING</p>
            <h3>Curiosity starts early.</h3>
            <p>
              Play-based, stress-free learning develops communication, movement,
              creativity and social-emotional confidence through joyful
              discovery in dedicated child-friendly spaces.
            </p>
            <button className="pill green" onClick={openAdmissionModal}>
              Explore admissions <ArrowRight size={16} />
            </button>
          </div>
        </article>
        <article data-reveal className="academic-track-card academic-track-reverse">
          <div className="academic-track-info">
            <p className="eyebrow">02 / CBSE CURRICULUM</p>
            <h3>Concepts that connect.</h3>
            <p>
              Our CBSE journey combines strong academic foundations, application-based
              learning, smart classrooms, value-added programmes and a broad
              co-curricular experience for lifelong excellence.
            </p>
            <button className="pill green" onClick={openAdmissionModal}>
              Talk to admissions <ArrowRight size={16} />
            </button>
          </div>
          <div className="academic-track-media">
            <img
              src={IMG.academics}
              alt="CBSE learning at Jain Heritage School"
              loading="eager"
              decoding="async"
            />
            <div className="academic-track-badge">
              <span>CBSE AFFILIATED (GRADES 1–10)</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function GalleryFlythrough() {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);
  const lastActivePointRef = useRef(0);
  const [activePoint, setActivePoint] = useState(0);

  const waypoints = [
    {
      id: "01",
      kicker: "CAMPUS & ARCHITECTURE",
      title: "The Living Sanctuary",
      subtitle: "Eco-Conscious Space",
      desc: "Thoughtfully crafted architecture with expansive open greens, sunlit courtyards, and state-of-the-art facilities designed for holistic development.",
      image: IMG.campus,
      telemetry: {
        coords: "15.8497° N · 74.4977° E",
        elevation: "762M ELEVATION",
        tag: "SUSTAINABLE CAMPUS",
        stat: "Eco-Conscious Space",
      },
    },
    {
      id: "02",
      kicker: "STEM & RESEARCH",
      title: "Where Ideas Ignite",
      subtitle: "Experiential Science & Innovation",
      desc: "Advanced chemistry, physics, and robotics laboratories where theory transforms into tangible discovery under expert faculty mentorship.",
      image: IMG.labchemistry,
      telemetry: {
        coords: "STEM WING · LEVEL 02",
        elevation: "LAB 04 · CHEMISTRY",
        tag: "RESEARCH & DISCOVERY",
        stat: "100% EXPERIENTIAL",
      },
    },
    {
      id: "03",
      kicker: "CHAMPIONSHIP ATHLETICS",
      title: "Resilience in Motion",
      subtitle: "World-Class Sporting Grounds",
      desc: "BCCI-standard turf pitch, Olympic-length swimming pool, synthetic tennis courts, and indoor arenas breeding athletic excellence.",
      image: IMG.sportscricket,
      telemetry: {
        coords: "ARENA A · TURF OVAL",
        elevation: "BCCI SPECIFICATION",
        tag: "CHAMPIONSHIP SPORTS",
        stat: "12+ DISCIPLINES",
      },
    },
    {
      id: "04",
      kicker: "LEADERSHIP & SERVICE",
      title: "Honor. Duty. Discipline.",
      subtitle: "National Cadet Corps & Scouts",
      desc: "Rigorous drill training, adventure expeditions, and community service instilling unshakeable character, patriotism, and leadership.",
      image: IMG.ncc,
      telemetry: {
        coords: "PARADE GROUNDS · DRILL SQ",
        elevation: "ARMY WING CONTINGENT",
        tag: "DIRECTORATE HONORS",
        stat: "A-GRADE NCC",
      },
    },
    {
      id: "05",
      kicker: "PERFORMING ARTS & CULTURE",
      title: "The Creative Symphony",
      subtitle: "Music, Theater & Celebrations",
      desc: "Acoustic amphitheaters, dedicated Indian & Western music suites, and annual theatrical spectacles celebrating India's rich heritage.",
      image: IMG.performingartsmusic,
      telemetry: {
        coords: "CULTURAL WING · AMPHITHEATER",
        elevation: "ACOUSTIC HALL",
        tag: "ARTS & HERITAGE",
        stat: "ANNUAL INFINITUM",
      },
    },
  ];

  const centers = [0.08, 0.28, 0.50, 0.72, 0.92];

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return undefined;

    let transformRaf = null;
    let lastProgress = -1;
    const cardStates = new Array(centers.length).fill("");

    // Direct 3D transform updater
    const updateTransforms = (p) => {
      let closestIdx = 0;
      let minDistance = 999;

      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        const c = centers[idx];
        const dist = Math.abs(p - c);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }

        // Calculate 3D flythrough coordinates
        const inWindow = 0.22;
        const outWindow = 0.18;

        if (p < c - inWindow) {
          if (cardStates[idx] === "deep-bg") return;
          cardStates[idx] = "deep-bg";
          card.style.transform = `translate3d(0, 0, -1200px) scale(0.28)`;
          card.style.opacity = "0";
          card.style.pointerEvents = "none";
          card.style.visibility = "hidden";
        } else if (p < c) {
          cardStates[idx] = "approach";
          const t = (p - (c - inWindow)) / inWindow;
          const easeOut = 1 - Math.pow(1 - t, 2.2);
          const z = -1000 * (1 - easeOut);
          const scale = 0.35 + 0.65 * easeOut;
          const opacity = Math.min(1, easeOut * 1.2);

          card.style.transform = `translate3d(0, 0, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
          card.style.opacity = opacity.toFixed(3);
          card.style.pointerEvents = t > 0.75 ? "auto" : "none";
          card.style.visibility = "visible";
        } else if (p < c + outWindow) {
          cardStates[idx] = "pass";
          const t = (p - c) / outWindow;
          const easeIn = Math.pow(t, 1.8);
          const z = 850 * easeIn;
          const scale = 1.0 + 1.45 * easeIn;
          const opacity = Math.max(0, 1 - Math.pow(t, 1.2));

          card.style.transform = `translate3d(0, 0, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
          card.style.opacity = opacity.toFixed(3);
          card.style.pointerEvents = t < 0.25 ? "auto" : "none";
          card.style.visibility = "visible";
        } else {
          if (cardStates[idx] === "flown-past") return;
          cardStates[idx] = "flown-past";
          card.style.transform = `translate3d(0, 0, 950px) scale(2.6)`;
          card.style.opacity = "0";
          card.style.pointerEvents = "none";
          card.style.visibility = "hidden";
        }
      });

      if (closestIdx !== lastActivePointRef.current) {
        lastActivePointRef.current = closestIdx;
        setActivePoint(closestIdx);
      }
    };

    const scheduleTransforms = (p) => {
      lastProgress = p;
      if (transformRaf) return;
      transformRaf = requestAnimationFrame(() => {
        updateTransforms(lastProgress);
        transformRaf = null;
      });
    };

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scheduleTransforms(self.progress);
      },
      onLeave: () => {
        if (stageRef.current) stageRef.current.style.visibility = "hidden";
      },
      onEnterBack: () => {
        if (stageRef.current) stageRef.current.style.visibility = "visible";
      },
      onLeaveBack: () => {
        if (stageRef.current) stageRef.current.style.visibility = "hidden";
      },
      onEnter: () => {
        if (stageRef.current) stageRef.current.style.visibility = "visible";
      },
    });

    // Initial positioning
    updateTransforms(st.progress || 0);

    // Subtle 3D perspective mouse tilt throttled with rAF
    let mouseRaf = false;
    let stageTop = 0;
    let stageLeft = 0;
    let stageWidth = 0;
    let stageHeight = 0;
    const updateRect = () => {
      if (stage) {
        const r = stage.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset || 0;
        stageTop = r.top + scrollY;
        stageLeft = r.left;
        stageWidth = r.width || 1;
        stageHeight = r.height || 1;
      }
    };
    updateRect();
    window.addEventListener("resize", updateRect, { passive: true });
    stage.addEventListener("mouseenter", updateRect, { passive: true });

    const handleMouseMove = (e) => {
      if (mouseRaf) return;
      mouseRaf = true;
      requestAnimationFrame(() => {
        mouseRaf = false;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const curTop = stageTop - scrollY;
        if (curTop > window.innerHeight || curTop + stageHeight < 0) return;
        const x = (e.clientX - stageLeft) / stageWidth - 0.5;
        const y = (e.clientY - curTop) / stageHeight - 0.5;
        const tiltX = -y * 6;
        const tiltY = x * 6;
        stage.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
        stage.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      st.kill();
      window.removeEventListener("resize", updateRect);
      stage.removeEventListener("mouseenter", updateRect);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const jumpToWaypoint = (idx) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const wrapTop = rect.top + window.scrollY;
    const scrollable = wrap.offsetHeight - window.innerHeight;
    const targetY = wrapTop + centers[idx] * scrollable;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const jumpToGallery = () => {
    const gallery = document.getElementById("gallery-view");
    if (gallery) {
      gallery.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="gallery-flythrough-wrap" ref={wrapRef} aria-label="JHS Campus 3D Flythrough">
      <div className="gallery-flythrough-stage" ref={stageRef}>
        {/* Background Atmospheric Layer */}
        <div className="flythrough-ambient-aura" aria-hidden="true" />
        <div className="flythrough-hud-grid" aria-hidden="true" />

        {/* Top Telemetry Header */}
        <header className="flythrough-top-bar">
          <div className="ftb-left">
            <span className="ftb-radar-pulse" aria-hidden="true" />
            <span className="ftb-title">3D SPATIAL FLYTHROUGH</span>
            <span className="ftb-divider">·</span>
            <span className="ftb-sub">JHS IN FOCUS</span>
          </div>
          <div className="ftb-right">
            <span className="ftb-coords">15.8497° N, 74.4977° E</span>
            <span className="ftb-badge">LIVE SENSOR</span>
          </div>
        </header>

        {/* Interactive Waypoint Navigation Rail */}
        <nav className="flythrough-hud-rail" aria-label="Flythrough Waypoints">
          <div className="fhr-track" aria-hidden="true">
            <div
              className="fhr-indicator"
              style={{
                top: `${(activePoint / (waypoints.length - 1)) * 100}%`,
              }}
            />
          </div>
          {waypoints.map((wp, idx) => (
            <button
              key={wp.id}
              type="button"
              className={`fhr-pip ${activePoint === idx ? "active" : ""}`}
              onClick={() => jumpToWaypoint(idx)}
              aria-label={`Jump to Waypoint ${wp.id}: ${wp.title}`}
            >
              <span className="fhr-pip-num">{wp.id}</span>
              <span className="fhr-pip-label">{wp.kicker.split(" ")[0]}</span>
            </button>
          ))}
        </nav>

        {/* 3D Perspective World Stage */}
        <div className="flythrough-3d-world">
          {waypoints.map((wp, idx) => (
            <article
              key={wp.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              className="flythrough-card"
              tabIndex={0}
              aria-label={`${wp.title} - ${wp.subtitle}`}
            >
              <img
                src={wp.image}
                alt={wp.title}
                className="flythrough-card-bg"
                loading="eager"
                decoding="async"
              />
              <div className="flythrough-card-overlay" aria-hidden="true" />
              <div className="flythrough-card-grid" aria-hidden="true" />

              {/* Card Corner Reticles */}
              <span className="ftc-reticle ftc-tl" aria-hidden="true" />
              <span className="ftc-reticle ftc-tr" aria-hidden="true" />
              <span className="ftc-reticle ftc-bl" aria-hidden="true" />
              <span className="ftc-reticle ftc-br" aria-hidden="true" />

              {/* Card Header Telemetry */}
              <div className="ftc-telemetry-top">
                <div className="ftc-tag">
                  <span className="ftc-tag-dot" aria-hidden="true" />
                  <span>JHS ARCHIVE · POINT {wp.id} / 05</span>
                </div>
                <div className="ftc-coords">
                  <span>{wp.telemetry.coords}</span>
                  <span className="ftc-sep">·</span>
                  <span>{wp.telemetry.elevation}</span>
                </div>
              </div>

              {/* Center Crosshair */}
              <div className="ftc-crosshair" aria-hidden="true">
                <span className="ftc-cross-h" />
                <span className="ftc-cross-v" />
              </div>

              {/* Card Bottom Editorial Content */}
              <div className="ftc-content-bottom">
                <div className="ftc-kicker-row">
                  <span className="ftc-kicker-bar" aria-hidden="true" />
                  <p className="ftc-kicker">{wp.kicker}</p>
                </div>
                <h3 className="ftc-title">{wp.title}</h3>
                <h4 className="ftc-subtitle">{wp.subtitle}</h4>
                <p className="ftc-desc">{wp.desc}</p>
                <div className="ftc-badges-row">
                  <span className="ftc-pill-badge">{wp.telemetry.tag}</span>
                  <span className="ftc-pill-badge ftc-pill-gold">{wp.telemetry.stat}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Navigation & Scroll Hint */}
        <footer className="flythrough-bottom-bar">
          <div className="fbb-left">
            <div className="fbb-scroll-hint">
              <span className="fbb-mouse-wheel" aria-hidden="true">
                <span className="fbb-wheel-dot" />
              </span>
              <span>SCROLL TO FLYTHROUGH CAMPUS</span>
            </div>
          </div>
          <div className="fbb-right">
            <button
              type="button"
              className="fbb-skip-btn"
              onClick={jumpToGallery}
            >
              <span>EXPLORE FULL ARCHIVE</span>
              <ArrowDownRight size={16} />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}

function CreativeGallery() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const categories = [
    "All",
    ...new Set(galleryItems.map((item) => item.category)),
  ];
  const visible = galleryItems.filter(
    (item) => filter === "All" || item.category === filter,
  );

  const selectedIndex = selected
    ? visible.findIndex((item) => item.image === selected.image)
    : -1;

  const showPrev = useCallback(
    (e) => {
      e?.stopPropagation();
      if (visible.length === 0) return;
      const nextIdx = (selectedIndex - 1 + visible.length) % visible.length;
      setSelected(visible[nextIdx]);
    },
    [selectedIndex, visible],
  );

  const showNext = useCallback(
    (e) => {
      e?.stopPropagation();
      if (visible.length === 0) return;
      const nextIdx = (selectedIndex + 1) % visible.length;
      setSelected(visible[nextIdx]);
    },
    [selectedIndex, visible],
  );

  useEffect(() => {
    if (!selected) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft") showPrev(e);
      if (e.key === "ArrowRight") showNext(e);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected, showPrev, showNext]);

  return (
    <section id="gallery-view" className="creative-gallery section">
      <SectionHead
        kicker="VISUAL STORIES"
        title="See JHS in motion."
        desc="Learning, celebration, leadership and everyday school life."
      />

      <div className="gallery-filters" role="tablist">
        {categories.map((category) => {
          const count = category === "All"
            ? galleryItems.length
            : galleryItems.filter((it) => it.category === category).length;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={filter === category}
              className={filter === category ? "active" : ""}
              onClick={() => setFilter(category)}
              key={category}
            >
              <span>{category}</span>
              <span className="gf-count">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="masonry-gallery" key={filter}>
        {visible.map((item, i) => (
          <button
            type="button"
            className={`gallery-tile tile-${(i % 9) + 1}`}
            key={`${item.image}-${filter}`}
            onClick={() => setSelected(item)}
          >
            <img src={item.image} alt={item.title} loading="eager" decoding="async" />
            <div>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <strong>{item.title}</strong>
            </div>
          </button>
        ))}
      </div>

      {selected &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            onClick={() => setSelected(null)}
          >
            <div
              className="lightbox-dialog"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="lightbox-close-btn"
                aria-label="Close image preview"
                onClick={() => setSelected(null)}
              >
                <X size={22} />
              </button>

              {visible.length > 1 && (
                <>
                  <button
                    type="button"
                    className="lightbox-nav-btn prev"
                    aria-label="Previous image"
                    onClick={showPrev}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    className="lightbox-nav-btn next"
                    aria-label="Next image"
                    onClick={showNext}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="lightbox-media-wrap">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="lightbox-img"
                  decoding="async"
                />
              </div>

              <div className="lightbox-caption">
                <span className="lightbox-category">{selected.category}</span>
                <h3 className="lightbox-title">{selected.title}</h3>
                <span className="lightbox-counter">
                  {selectedIndex + 1} / {visible.length}
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}

function EventsTimeline() {
  const events = [
    {
      date: "2026-09-12",
      title: "Annual Day",
      text: "Celebration of talent, learning and achievement.",
      image: IMG.annualday,
    },
    {
      date: "2026-10-14",
      title: "Sports Week",
      text: "Fitness, teamwork and competitive spirit.",
      image: IMG.swimming,
    },
    {
      date: "2026-10-21",
      title: "Jigyasa",
      text: "Life skills and experiential learning.",
      image: IMG.jigyasa,
    },
    {
      date: "2026-11-14",
      title: "Children's Day",
      text: "Celebrating creativity through Nanhe Kalakar.",
      image: IMG.nanhekalakar,
    },
  ];
  const upcoming = events.filter(
    (event) => new Date(`${event.date}T23:59:59`) >= new Date(),
  );

  return (
    <section className="events-section section dark">
      <SectionHead
        kicker="EVENTS & CALENDAR"
        chip
        title="Moments worth remembering."
      />

      <div className="events-timeline">
        {upcoming.map((event, i) => (
          <article className="event-item" data-reveal key={event.title}>
            <div className="event-date">
              {new Date(`${event.date}T12:00:00`).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </div>

            <div className="event-dot" />

            <div className="event-body">
              <span>EVENT / {String(i + 1).padStart(2, "0")}</span>

              <h3>{event.title}</h3>

              <p>{event.text}</p>
              <img src={event.image} alt={event.title} loading="eager" decoding="async" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FoodMenu() {
  const menu = [
    ["MON", "Idli", "Chapathi Bhaaji"],
    ["TUE", "Dosa", "Veg Biriyani"],
    ["WED", "Vada", "Rice & Sambar"],
    ["THU", "Poha", "Chapati & Green Peas Masala"],
    ["FRI", "Upma", "Chapati & Mixed Veg Bhaaji"],
    ["SAT", "Poori", "Roti & Dal Makhani"],
  ];

  return (
    <section className="food-section section">
      <SectionHead kicker="WEEKLY MENU" title="Fuel for growing minds." />

      <div className="food-grid">
        {menu.map(([day, breakfast, lunch], i) => (
          <article className="food-card" data-reveal key={day}>
            <span>{day}</span>

            <div>
              <small>BREAKFAST</small>
              <h3>{breakfast}</h3>
            </div>

            <div>
              <small>LUNCH</small>
              <h3>{lunch}</h3>
            </div>

            <b>0{i + 1}</b>
          </article>
        ))}
      </div>
    </section>
  );
}

function DisclosureGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedDoc, setSelectedDoc] = useState(disclosureDocuments[0]);

  const categories = [
    "All",
    "Affiliation & Trust",
    "Safety & Compliance",
    "Academic & Governance",
  ];

  const filteredDocs =
    activeCategory === "All"
      ? disclosureDocuments
      : disclosureDocuments.filter((doc) => doc.category === activeCategory);

  const items = [
    ["School", "JAIN HERITAGE SCHOOL"],
    ["Affiliation", "830593"],
    ["School Code", "45531"],
    ["Principal", "Mrs. Rohini, M.Sc, M.Ed"],
    ["Email", "principal@jhsbgm.in"],
    ["Phone", "+91-9741672021"],
  ];

  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc);
  };

  return (
    <section className="disclosure-section section">
      <SectionHead
        kicker="PUBLIC INFORMATION"
        title="Important school details."
        desc="Statutory mandatory disclosure and compliance certificates published in accordance with CBSE guidelines."
      />

      <div className="disclosure-grid">
        {items.map(([label, value], i) => (
          <article className="disclosure-card" data-reveal key={label}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <small>{label}</small>
            <h3>{value}</h3>
          </article>
        ))}
      </div>

      <div className="disclosure-docs-header" data-reveal>
        <div className="ddh-title-wrap">
          <div className="sh-rule-row" aria-hidden="true">
            <span className="sh-rule" />
            <p className="eyebrow sh-kicker">MANDATORY PUBLIC DISCLOSURE</p>
          </div>
          <h3>Official Certificates & Records ({disclosureDocuments.length})</h3>
        </div>
        <div className="disclosure-filter-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`disc-filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(cat);
                const first =
                  cat === "All"
                    ? disclosureDocuments[0]
                    : disclosureDocuments.find((d) => d.category === cat);
                if (first) setSelectedDoc(first);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="disclosure-documents">
        {filteredDocs.map((doc, index) => {
          const isSelected = selectedDoc.title === doc.title;
          return (
            <details
              key={doc.title}
              open={isSelected}
              className={isSelected ? "selected-disclosure-doc" : ""}
            >
              <summary onClick={() => setSelectedDoc(doc)}>
                <div className="disc-summary-left">
                  <FileText size={18} />
                  <span className="disc-doc-title">{doc.title}</span>
                  {doc.code && <span className="disc-doc-code">{doc.code}</span>}
                </div>
                <div className="disc-summary-right">
                  <span className="disc-category-tag">{doc.category}</span>
                  <ChevronDown size={17} />
                </div>
              </summary>
              <div className="disclosure-preview">
                <div className="pdf-inline-preview">
                  <div className="pdf-inline-header">
                    <div>
                      <span>STATUTORY DOCUMENT PREVIEW</span>
                      <h3>{doc.title}</h3>
                    </div>
                    {doc.code && <span className="disc-doc-code">{doc.code}</span>}
                  </div>
                  <iframe title={`${doc.title} preview`} src={doc.url} loading="lazy" />
                  <div className="disc-preview-actions">
                    <a
                      className="pill green"
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      download
                    >
                      Download <Download size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(0);

  const faqs = [
    [
      "Why is Jain Heritage School considered a leading CBSE school in Belagavi?",
      "JHS combines a NEP-aligned CBSE approach, modern infrastructure and holistic development, achieving a 100% AISSE Grade 10 result for five consecutive years.",
    ],
    [
      "What age group does the school cater to?",
      "The published admissions guidelines cater to learners from preschool (Early Years, age 2+) through Grade 10 (age 15+).",
    ],
    [
      "How does JHS ensure student safety on campus?",
      "The campus features 24/7 CCTV surveillance, biometric visitor protocols, GPS-enabled school transport, certified infirmary staff, and a child-safe enclosed environment.",
    ],
    [
      "What extracurricular activities and sports are offered?",
      "Students engage in robotics, performing arts, cricket and athletics coaching, chess, yoga, NCC, Scouts & Guides, and literary debate societies.",
    ],
    [
      "How do teachers support academic growth?",
      "JHS highlights CBSE-trained educators, application-based pedagogy, low student-teacher ratios, regular structured assessments, and personalised student mentoring.",
    ],
    [
      "How does the school prepare students for future careers?",
      "Career counselling, competitive exam mentorship, expert guest lectures, leadership programmes (Infinitum Vyoma), and community initiatives foster future-ready confidence.",
    ],
  ];

  return (
    <section className="faq-section section dark">
      <SectionHead
        kicker="QUESTIONS & ANSWERS"
        title="You ask. We answer."
        desc="Clear, transparent information about admissions, curriculum, safety, and campus life at JHS Belagavi."
      />

      <div className="faq-list">
        {faqs.map(([question, answer], i) => (
          <article
            className={open === i ? "faq-item active" : "faq-item"}
            key={question}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="faq-num">{String(i + 1).padStart(2, "0")}</span>
              <strong>{question}</strong>
              <span className="faq-toggle-icon">
                {open === i ? <Minus size={18} /> : <Plus size={18} />}
              </span>
            </button>

            <div className="faq-answer">
              <div className="faq-answer-inner">
                <span className="faq-answer-dot" />
                <p>{answer}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BlogCards() {
  return (
    <section className="blog-section section">
      <SectionHead
        kicker="JHS JOURNAL"
        title="Stories worth reading."
        chip="left"
      />

      <div className="blog-grid">
        {blogPosts.map((post, i) => (
          <article className="blog-card" data-reveal key={post.slug || post.title}>
            <div className="blog-image">
              <img src={post.image} alt={post.title} loading="eager" decoding="async" />
              <span>{String(i + 1).padStart(2, "0")}</span>
            </div>

            <div className="blog-content">
              <small>JHS JOURNAL · {(post.category || "EDUCATION").toUpperCase()}</small>

              <h3>{post.title}</h3>

              <p>{post.text}</p>

              <Link className="blog-read" to={`/blogs/${post.slug}`}>
                Read Story
                <ArrowDownRight />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BlogDetail() {
  useReveal();
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug) || blogPosts[0];
  const paragraphs =
    post.paragraphs && post.paragraphs.length > 0 ? post.paragraphs : [post.text];

  const formattedDate = (() => {
    try {
      const d = new Date(
        post.date && post.date.includes("T") ? post.date : `${post.date}T12:00:00`
      );
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    } catch (e) { }
    return post.date || "November 2025";
  })();

  return (
    <article className="blog-detail">
      <PageHero
        kicker={`JHS JOURNAL · ${(post.category || "EDUCATION").toUpperCase()}`}
        title={post.title}
        desc={post.text}
        image={post.image}
      />

      <main className="article-copy section">
        <div data-reveal>
          <div className="blog-article-intro-row">
            <div className="blog-article-intro-text">
              <p className="eyebrow">
                {post.author || "JHS Editorial Team"} · {formattedDate}
              </p>
              <h2>{post.title}</h2>
              <p className="blog-lead">{paragraphs[0]}</p>
            </div>
            <div className="blog-article-intro-media">
              <img src={post.image} alt={post.title} loading="eager" decoding="async" />
            </div>
          </div>
          {paragraphs.slice(1).map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
          <div style={{ marginTop: "36px" }}>
            <Link className="pill green" to="/blogs">
              Back to journal <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      {/* ── PHYSICAL BOOK EXPERIENCE FOR BLOG ARTICLES ── */}
      <QuoteBook />
      <PossibilitySection
        image={post.image}
        description="At JHS, meaningful learning leaves room for curiosity, confidence and possibility."
        cta="Talk to admissions"
        onCta={openAdmissionModal}
        blocks={[
          {
            number: "01",
            title: "Make connections",
            text: "Ideas become memorable when students can connect them to people, places and experiences.",
          },
          {
            number: "02",
            title: "Find your voice",
            text: "A supportive community gives every learner space to contribute and grow.",
          },
        ]}
      />
    </article>
  );
}

function AnthemSection() {
  return (
    <section className="anthem-section section dark">
      <div className="anthem-mark" data-reveal>
        <span className="anthem-quote">“</span>
        <div>
          We are the Jainites, say hello hey hello <br />
          Cheer the green blue, cheer the purple, yellow <br />
          We dream big, smile wide, and persist mellow <br />
          <br />
          Where the seeds of ethics, and knowledge are sown <br />
          We go to the school, that taught us right and wrong <br />
          Respect, discipline, integrity, sympathy <br />
          Our hearts are filled, with courtesy and empathy <br />
          <br />
          Let’s play the anthem, with love and pride <br />
          For the school where we learn, the lessons in stride <br />
          We shall rise high, we are the Jainites, <br />
          The torch bearers, and those that ignite! <br />
          <br />
          We promise to mark, our footprints and shine <br />
          All the Jainites, let’s say hello hey hello <br />
          All the Jainites, say hello hey hello……”
        </div>
        <span className="anthem-quote closing">”</span>
      </div>

      <div className="anthem-content">
        <p className="eyebrow">JAIN HERITAGE SCHOOL</p>

        <h2>
          One voice.
          <br />
          One <i>heritage.</i>
        </h2>

        <p>
          The JHS anthem expresses the school's values of ethics, knowledge,
          respect, discipline, integrity, empathy and pride.
        </p>
      </div>
    </section>
  );
}

function PageTransition({ children }) {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";
  const [stage, setStage] = useState(isHome ? "done" : "entering");
  const pageRef = useRef(null);

  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    if (isHome) {
      setStage("done");
      requestScrollRefresh();
      return undefined;
    }

    setStage("entering");
    const timer = setTimeout(() => {
      setStage("done");
      requestScrollRefresh();
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname, isHome]);

  const classes = ["page-transition"];

  if (isHome) {
    classes.push("page-transition-visible");
  } else {
    classes.push("book-page");
    if (stage === "entering") {
      classes.push("page-turn-in");
    } else {
      classes.push("page-turn-done");
    }
  }

  return (
    <div className="book-stage">
      <div ref={pageRef} className={classes.join(" ")}>
        {children}
      </div>
    </div>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setVisible((prev) => {
            const next = window.scrollY > 400;
            return prev === next ? prev : next;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      className={`back-to-top ${visible ? "show" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ArrowUp size={20} strokeWidth={2} />
    </button>
  );
}

function ContactForm() {
  const [status, setStatus] = useState("idle");
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("error");
      return;
    }
    setStatus("sending");
    const formData = new FormData(form);
    const payload = {
      formType: "Direct Admissions Enquiry",
      studentName: formData.get("student") || "",
      parentName: formData.get("parent") || "",
      phone: formData.get("phone") || "",
      classSelection: formData.get("grade") || "",
      message: formData.get("message") || "",
    };
    try {
      await submitToGoogleSheets(payload);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };
  return (
    <section id="contact-details" className="contact-wrap section">
      <div className="contact-info">
        <div className="contact-kicker-row">
          <span className="contact-kicker-dot" />
          <p className="eyebrow">ADMISSIONS & ENQUIRY</p>
        </div>
        <h2>
          Let’s make the next step <i>clear.</i>
        </h2>
        <p>
          Tell us a little about your child and our admissions counselling team will connect with you within 24 hours.
        </p>

        <div className="contact-hours-card">
          <div className="chc-icon">
            <CalendarDays size={20} />
          </div>
          <div>
            <strong>Campus Admissions Desk</strong>
            <span>Monday – Saturday · 8:00 AM – 5:00 PM</span>
          </div>
        </div>

        <div className="contact-details-list">
          <a href="tel:08312483025" className="contact-pill-link">
            <Phone size={16} /> 0831 248 3025
          </a>
          <a href="mailto:principal@jhsbgm.in" className="contact-pill-link">
            <Mail size={16} /> principal@jhsbgm.in
          </a>
          <div className="contact-address-chip">
            <MapPin size={18} />
            <span>#1598 Adjacent to Foundry Cluster, Dutch Industrial Estate, Rani Chennamma Nagar, Belagavi 590008</span>
          </div>
          <div className="contact-social-row">
            <a
              href="https://www.facebook.com/jhsbgm/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-pill-link contact-social-pill"
              aria-label="Follow JHS Belagavi on Facebook"
            >
              <Facebook size={16} />
              <span>Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/jhsbgm/"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-pill-link contact-social-pill"
              aria-label="Follow JHS Belagavi on Instagram"
            >
              <Instagram size={16} />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      <div className="contact-form-container">
        <div className="contact-form-header">
          <h3>Direct Admissions Enquiry</h3>
          <p>Academic Year 2026–2027 Admissions Open</p>
        </div>
        <form className="contact-form" onSubmit={submit} noValidate>
          <div className="cf-field">
            <label>Student Name</label>
            <input name="student" required placeholder="Full name of student" />
          </div>
          <div className="cf-field">
            <label>Parent / Guardian Name</label>
            <input name="parent" required placeholder="Parent or guardian name" />
          </div>
          <div className="cf-field">
            <label>Mobile Number</label>
            <input
              name="phone"
              required
              pattern="[6-9][0-9]{9}"
              placeholder="10-digit mobile number"
            />
          </div>
          <div className="cf-field">
            <label>Grade Applying For</label>
            <select name="grade" defaultValue="" required>
              <option value="" disabled>
                Select Class
              </option>
              <option>Early Years</option>
              <option>Nursery</option>
              <option>LKG</option>
              <option>UKG</option>
              <option>Grade 1</option>
              <option>Grade 2</option>
              <option>Grade 3</option>
              <option>Grade 4</option>
              <option>Grade 5</option>
              <option>Grade 6</option>
              <option>Grade 7</option>
              <option>Grade 8</option>
              <option>Grade 9</option>
              <option>Grade 10</option>
            </select>
          </div>
          <div className="cf-field cf-full">
            <label>Your Message / Questions</label>
            <textarea name="message" required placeholder="Tell us about curriculum interest, or queries..." />
          </div>
          <div className="cf-submit-row">
            <button className="pill green" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send Enquiry"}{" "}
              <ArrowRight size={16} />
            </button>
            <span className="cf-privacy-note">Your details are kept strictly confidential.</span>
          </div>
          {status === "success" && (
            <p className="form-success" role="status">
              Thank you! Your enquiry has been received. Our admissions team will connect with you shortly.
            </p>
          )}
          {status === "error" && (
            <p className="form-error" role="alert">
              Please complete all required fields with valid details.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function AdmissionModal() {
  const initialForm = {
    studentName: "",
    parentName: "",
    phone: "",
    classSelection: "",
    message: "",
  };
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      setStatus("idle");
      setErrors({});
    };
    window.addEventListener("open-admission-modal", handleOpen);
    return () => window.removeEventListener("open-admission-modal", handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => event.key === "Escape" && setOpen(false);
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
      window.dispatchEvent(new CustomEvent("close-admission-modal"));
    };
  }, [open]);

  if (!open) return null;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setStatus("idle");
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.studentName.trim())
      nextErrors.studentName = "Enter the student's name.";
    if (!form.parentName.trim())
      nextErrors.parentName = "Enter the parent's name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s+/g, ""))) {
      nextErrors.phone = "Enter a valid 10-digit phone number.";
    }
    if (!form.classSelection) nextErrors.classSelection = "Select a class.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      await submitToGoogleSheets({
        formType: "Admission Modal Request",
        studentName: form.studentName,
        parentName: form.parentName,
        phone: form.phone,
        classSelection: form.classSelection,
        message: form.message,
      });
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) =>
        event.target === event.currentTarget && setOpen(false)
      }
    >
      <section
        className="admission-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admission-modal-title"
      >
        <button
          className="modal-close"
          onClick={() => setOpen(false)}
          aria-label="Close interview form"
        >
          <X size={20} />
        </button>
        <p className="eyebrow">ADMISSIONS / 2026-27</p>
        <h2 id="admission-modal-title">Let's plan the next step.</h2>
        {status === "success" ? (
          <div className="form-success" role="status">
            <strong>
              Thank you. Your request is with our admissions team.
            </strong>
            <button className="pill green" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        ) : (
          <form className="admission-form" onSubmit={submit} noValidate>
            <div className="admission-form-row">
              {[
                ["studentName", "Student Name", "text"],
                ["parentName", "Parent Name", "text"],
              ].map(([name, label, type]) => (
                <label key={name} className="admission-form-field">
                  {label}
                  <input
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={updateField}
                    autoComplete="off"
                  />
                  {errors[name] && <small>{errors[name]}</small>}
                </label>
              ))}
            </div>

            <div className="admission-form-row">
              <label className="admission-form-field">
                Phone Number
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateField}
                  autoComplete="off"
                />
                {errors.phone && <small>{errors.phone}</small>}
              </label>

              <label className="admission-class-field admission-form-field">
                Class Selection
                <select
                  name="classSelection"
                  value={form.classSelection}
                  onChange={updateField}
                >
                  <option value="">Select a class</option>
                  {admissionClasses.map((className) => (
                    <option key={className}>{className}</option>
                  ))}
                </select>
                {errors.classSelection && (
                  <small>{errors.classSelection}</small>
                )}
              </label>
            </div>

            <div className="admission-form-row admission-message-row">
              <label className="admission-form-field admission-message-field">
                Your Message / Questions
                <textarea
                  name="message"
                  value={form.message}
                  onChange={updateField}
                  placeholder="Tell us about curriculum interest, or queries..."
                  rows={3}
                />
              </label>
            </div>

            {status === "error" && (
              <p className="form-error">
                We could not send your request. Please try again.
              </p>
            )}
            <button
              className="pill green admission-submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending..." : "Request Interview"}{" "}
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

function App() {
  const location = useLocation();
  return (
    <>
      <GlobalLoader />
      <SmoothScroll />
      <ScrollFX />
      <Header />

      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />

          {Object.entries(pageData).map(([path, data]) => (
            <Route
              key={path}
              path={path}
              element={<ContentPage data={data} />}
            />
          ))}
        </Routes>
      </PageTransition>

      <Footer />

      <BackToTop />
      <AdmissionModal />
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Link className="brand footer-brand" to="/">
            <span className="brand-orb">
              <img
                src="/images/logo.png"
                alt="JHS Belagavi Logo"
                width="50px"
                className="h-10 w-auto object-contain"
                loading="eager"
                decoding="async"
              />
            </span>
            <span>
              <strong>JAIN HERITAGE SCHOOL</strong>
              <small>BEST CBSE SCHOOL IN BELAGAVI</small>
            </span>
          </Link>
          <p>
            Learning that builds knowledge, character, confidence and
            possibility.
          </p>
          <div className="footer-social-links">
            <a
              href="https://www.facebook.com/jhsbgm/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-pill"
              aria-label="JHS Belagavi on Facebook"
            >
              <Facebook size={16} />
              <span>Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/jhsbgm/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-pill"
              aria-label="JHS Belagavi on Instagram"
            >
              <Instagram size={16} />
              <span>Instagram</span>
            </a>
          </div>
        </div>
        <div className="footer-links">
          <div>
            <b>Explore</b>
            <Link to="/about/at-a-glance">About Us</Link>
            <Link to="/academics">Academics</Link>
            <Link to="/gallery/photos-videos">Gallery</Link>
            <Link to="/blogs">Blogs</Link>
          </div>
          <div>
            <b>Admissions</b>
            <Link to="/admissions/eligibility">Eligibility</Link>
            <Link to="/admissions/schedule-interview">Schedule Interview</Link>
            <Link to="/admissions/documents-required">Documents Required</Link>
            <Link to="/faq">FAQ</Link>
          </div>
          <div>
            <b>Contact</b>
            <span className="footer-contact-address">
              <MapPin size={14} />
              <span>#1598 Adjacent to Foundry Cluster, Dutch
                Industrial Estate, Rani Chennamma Nagar, Belagavi, Karnataka
                590008</span>
            </span>
            <span>
              <Phone size={14} /> 0831 248 3025
            </span>
            <span>
              <Mail size={14} /> principal@jhsbgm.in
            </span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Jain Heritage School, Belagavi | Designed
          by Jain Heritage School
        </span>
        {/* <span>Designed by Jain Heritage School</span> */}
      </div>
    </footer>
  );
}

// =========================================
// QuoteBook Component (inlined from QuoteBook.jsx)
// =========================================

const ANIMATION_CONFIG = {
  // Scrub factor: 0.8 = smooth GSAP physics interpolation for silky 3D page turns
  scrollScrub: 0.8,
  // Full 180° flip — pages lie flat when fully open
  pageTurnAngle: -180,
  coverTurnAngle: -180,
  textStagger: 0.14,
  textDuration: 0.7,
  pageTurnDuration: 1.0,
  coverTurnDuration: 1.2,
  // Physical book ease: fast start, slow finish (like real paper)
  pageTurnEase: "power2.inOut",
  coverTurnEase: "power2.inOut",
};

const getBookContent = (pathname) => {
  const contentMap = {
    "/about/chairman-message": {
      page1: {
        words: ["EDUCATION", "WITH", "PURPOSE."],
        italicWords: [1],
        backText: "A VISION ROOTED IN CHARACTER, CURIOSITY AND CONFIDENCE.",
      },
      page2: {
        words: ["LEADERS", "BUILD", "FUTURES.", "WE", "BUILD", "THEM."],
        italicWords: [1, 4],
        backText: "MEANINGFUL LEARNING THAT SHAPES TOMORROW'S CITIZENS.",
      },
    },
    "/about/at-a-glance": {
      page1: {
        words: ["JHS", "AT", "A", "GLANCE."],
        italicWords: [1],
        backText: "A HOLISTIC CBSE LEARNING JOURNEY DESIGNED AROUND THE CHILD.",
      },
      page2: {
        words: ["NURTURING", "POTENTIAL.", "INSPIRING", "GROWTH."],
        italicWords: [0, 2],
        backText: "WHERE EVERY STUDENT DISCOVERS THEIR STRENGTHS.",
      },
    },
    "/about/infrastructure": {
      page1: {
        words: ["SPACES", "THAT", "INSPIRE."],
        italicWords: [1],
        backText: "A SECURE, TECHNOLOGY-ENABLED CAMPUS FOR MODERN LEARNING.",
      },
      page2: {
        words: ["SMART", "ROOMS.", "BOLD", "SPACES.", "BRIGHT", "FUTURES."],
        italicWords: [0, 2, 4],
        backText: "DESIGNED TO SUPPORT EXPLORATION, CREATIVITY AND DISCOVERY.",
      },
    },
    "/about/library": {
      page1: {
        words: ["A", "WORLD", "BETWEEN", "PAGES."],
        italicWords: [1],
        backText: "A VIBRANT RESOURCE CENTRE FOR READING AND RESEARCH.",
      },
      page2: {
        words: ["READ.", "RESEARCH.", "DISCOVER."],
        italicWords: [0, 1, 2],
        backText: "WHERE CURIOSITY MEETS KNOWLEDGE EVERY DAY.",
      },
    },
    "/admissions/eligibility": {
      page1: {
        words: ["FIND", "YOUR", "PLACE", "AT", "JHS."],
        italicWords: [1, 3],
        backText: "ADMISSIONS BASED ON AGE, GRADE AND ACADEMIC READINESS.",
      },
      page2: {
        words: ["YOUR", "JOURNEY", "STARTS", "HERE."],
        italicWords: [0, 2],
        backText: "TAKE THE FIRST STEP TOWARD JOINING OUR COMMUNITY.",
      },
    },
    "/admissions/schedule-interview": {
      page1: {
        words: ["START", "THE", "CONVERSATION."],
        italicWords: [1],
        backText: "TAKE THE NEXT STEP TOWARD JOINING JHS.",
      },
      page2: {
        words: ["ENQUIRE.", "UNDERSTAND.", "VISIT."],
        italicWords: [0, 1, 2],
        backText: "EXPERIENCE THE CAMPUS AND MEET OUR COMMUNITY.",
      },
    },
    "/admissions/documents-required": {
      page1: {
        words: ["PREPARE", "YOUR", "CHECKLIST."],
        italicWords: [1],
        backText: "KEEP THE ADMISSION PROCESS SIMPLE AND ORGANISED.",
      },
      page2: {
        words: ["READY.", "SET.", "JOIN", "US."],
        italicWords: [0, 1],
        backText: "ALL DOCUMENTS VERIFIED, YOUR SEAT AWAITS.",
      },
    },
    "/academics": {
      page1: {
        words: ["LEARNING", "BEYOND", "TEXTBOOKS."],
        italicWords: [1],
        backText: "CONCEPTUAL CLARITY AND APPLICATION-BASED LEARNING.",
      },
      page2: {
        words: ["THINK.", "APPLY.", "GROW."],
        italicWords: [0, 1, 2],
        backText: "TECHNOLOGY AND HOLISTIC DEVELOPMENT IN EVERY LESSON.",
      },
    },
    "/student-life/awards-and-honors": {
      page1: {
        words: ["CELEBRATE", "THE", "JOURNEY."],
        italicWords: [1],
        backText: "RECOGNISING EFFORT, ACHIEVEMENT AND EXCELLENCE.",
      },
      page2: {
        words: ["EFFORT.", "DISCIPLINE.", "TRIUMPH."],
        italicWords: [0, 1, 2],
        backText: "EVERY MILESTONE MATTERS WHEN CURIOSITY IS CELEBRATED.",
      },
    },
    "/student-life/school-anthem": {
      page1: {
        words: ["ONE", "SCHOOL.", "ONE", "VOICE."],
        italicWords: [0, 2],
        backText: "THE JHS ANTHEM CELEBRATES BELONGING AND PRIDE.",
      },
      page2: {
        words: ["TOGETHER", "WE", "RISE.", "TOGETHER", "WE", "SHINE."],
        italicWords: [0, 3],
        backText: "ETHICS, KNOWLEDGE AND DISCIPLINE IN HARMONY.",
      },
    },
    "/student-life/life-skills": {
      page1: {
        words: ["SKILLS", "FOR", "LIFE."],
        italicWords: [1],
        backText: "LEARNING THAT NAVIGATES REAL-WORLD CHALLENGES.",
      },
      page2: {
        words: ["COMMUNICATE.", "CREATE.", "LEAD."],
        italicWords: [0, 1, 2],
        backText: "PRACTICAL ABILITIES THAT BUILD CONFIDENCE.",
      },
    },
    "/student-life/infinitum-vyoma": {
      page1: {
        words: ["INFINITUM", "VYOMA."],
        italicWords: [0],
        backText: "BOUNDLESS LEARNING, LEADERSHIP AND CREATIVITY.",
      },
      page2: {
        words: ["LEARN.", "LEAD.", "CREATE."],
        italicWords: [0, 1, 2],
        backText: "CULTURE AND EXPRESSION BEYOND THE CLASSROOM.",
      },
    },
    "/student-life/food-menu": {
      page1: {
        words: ["GOOD", "FOOD.", "GOOD", "ENERGY."],
        italicWords: [0, 2],
        backText: "A WEEKLY MENU DESIGNED FOR BALANCED NOURISHMENT.",
      },
      page2: {
        words: ["NOURISH.", "ENERGIZE.", "THRIVE."],
        italicWords: [0, 1, 2],
        backText: "VARIETY AND NUTRITION FUELLING EVERY SCHOOL DAY.",
      },
    },
    "/gallery/photos-videos": {
      page1: {
        words: ["LIFE", "AT", "JHS."],
        italicWords: [1],
        backText: "A VISUAL JOURNAL OF LEARNING AND CELEBRATION.",
      },
      page2: {
        words: ["CAPTURE.", "RELIVE.", "CHERISH."],
        italicWords: [0, 1, 2],
        backText: "SPORTS, CREATIVITY AND COMMUNITY IN EVERY FRAME.",
      },
    },
    "/news/events-calendar": {
      page1: {
        words: ["WHAT'S", "HAPPENING", "AT", "JHS."],
        italicWords: [1],
        backText: "CELEBRATIONS, ACTIVITIES AND COMMUNITY EVENTS.",
      },
      page2: {
        words: ["CELEBRATE.", "PARTICIPATE.", "MEMORIZE."],
        italicWords: [0, 1],
        backText: "SPECIAL DAYS THAT BRING THE SCHOOL TOGETHER.",
      },
    },
    "/disclosure": {
      page1: {
        words: ["TRANSPARENT.", "ACCOUNTABLE.", "TRUSTED."],
        italicWords: [0, 1, 2],
        backText: "IMPORTANT SCHOOL INFORMATION, CLEARLY PRESENTED.",
      },
      page2: {
        words: ["VERIFIED.", "OFFICIAL.", "ACCESSIBLE."],
        italicWords: [0, 1, 2],
        backText: "MANDATORY DISCLOSURE FOR OUR COMMUNITY.",
      },
    },
    "/blogs": {
      page1: {
        words: ["IDEAS", "THAT", "KEEP", "MOVING."],
        italicWords: [1, 2],
        backText: "STORIES FROM THE JHS COMMUNITY.",
      },
      page2: {
        words: ["INSPIRE.", "INFORM.", "CONNECT."],
        italicWords: [0, 1, 2],
        backText: "EDUCATION, PARENTING AND LEARNING TOGETHER.",
      },
    },
    "/faq": {
      page1: {
        words: ["QUESTIONS.", "ANSWERED."],
        italicWords: [0, 1],
        backText: "CLEAR INFORMATION FOR PARENTS AND STUDENTS.",
      },
      page2: {
        words: ["CLARITY.", "CONFIDENCE.", "JHS."],
        italicWords: [0, 1],
        backText: "EXPLORING JHS WITH ANSWERS THAT MATTER.",
      },
    },
    "/contact-us": {
      page1: {
        words: ["LET'S", "START", "A", "CONVERSATION."],
        italicWords: [1, 2],
        backText: "VISIT, CALL OR WRITE TO JAIN HERITAGE SCHOOL.",
      },
      page2: {
        words: ["REACH", "OUT.", "WE'RE", "HERE."],
        italicWords: [0, 2],
        backText: "YOUR GATEWAY TO THE JHS COMMUNITY.",
      },
    },
  };

  // Dedicated quotes for individual blog articles (/blogs/:slug)
  if (pathname && pathname.startsWith("/blogs/")) {
    return {
      page1: {
        words: ["REFLECT.", "ENGAGE.", "ILLUMINATE."],
        italicWords: [0, 2],
        backText: "INSIGHTS FROM THE JAIN HERITAGE COMMUNITY.",
      },
      page2: {
        words: ["WORDS", "THAT", "SPARK", "PERSPECTIVES."],
        italicWords: [1, 2],
        backText: "DEEPENING THE DIALOGUE BETWEEN HOME AND SCHOOL.",
      },
    };
  }

  return (
    contentMap[pathname] || {
      page1: {
        words: ["WHERE", "LEARNING", "MEETS", "POSSIBILITY."],
        italicWords: [1, 3],
        backText: "ROOTED IN VALUES, REACHING FOR THE WORLD.",
      },
      page2: {
        words: [
          "EVERY",
          "CHILD",
          "CARRIES",
          "A",
          "SPARK.",
          "WE",
          "HELP",
          "IT",
          "SHINE.",
        ],
        italicWords: [2, 5, 8],
        backText: "CURIOSITY TODAY, CONFIDENCE TOMORROW.",
      },
    }
  );
};

function QuoteBook() {
  const sectionRef = useRef(null);
  const bookRef = useRef(null);
  const coverRef = useRef(null);
  const page1Ref = useRef(null);
  const page2Ref = useRef(null);
  const backCoverRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const location = useLocation();

  // Get dynamic content based on current route
  const bookContent = getBookContent(location.pathname);
  const page1Content = bookContent.page1;
  const page2Content = bookContent.page2;

  const initializeElements = useCallback(() => {
    const book = bookRef.current;
    const cover = coverRef.current;
    const page1 = page1Ref.current;
    const page2 = page2Ref.current;
    const backCover = backCoverRef.current;
    const words1 = text1Ref.current?.querySelectorAll(".qb-word");
    const words2 = text2Ref.current?.querySelectorAll(".qb-word");

    // ── RESTING POSE ──
    // The book sits at a slight 3-D tilt so it never reads as a flat card.
    // `perspective` also lives on .qb-book-container in CSS; setting
    // transformPerspective here is what makes the ROTATION of each child
    // (the cover, the sheets) render with real depth instead of shearing.
    gsap.set(book, {
      rotateX: 8,
      rotateY: -10,
      scale: 0.9,
      xPercent: -25,
      transformPerspective: 2400,
      transformStyle: "preserve-3d",
    });
    gsap.set(".qb-ground-shadow", {
      scaleX: 0.55,
    });

    // ── SPINE is at the LEFT edge of every right-half panel ──
    // All movable pieces use transformOrigin: "0% 50%" (= left edge of the
    // element itself). Because every piece is position:absolute at right:0,
    // that left edge is exactly the binding — so a rotateY reads as the
    // sheet swinging on the spine, not spinning in place.
    const spineOrigin = "0% 50%";

    // zIndex ORDER (bottom → top):
    //   back cover 5 · page2 11 · page1 12 · front cover 40
    // The front cover starts on top so the book is CLOSED and we see the
    // cover face. Pages each keep a stable zIndex for the whole timeline —
    // we never flip zIndex mid-scrub (a `tl.set()` under scrub is not
    // reliably honoured and was causing layers to jump/dissolve).
    gsap.set(cover, {
      rotateY: 0,
      transformOrigin: spineOrigin,
      transformStyle: "preserve-3d",
      zIndex: 40,
      z: 0,
    });

    gsap.set(page1, {
      rotateY: 0,
      transformOrigin: spineOrigin,
      transformStyle: "preserve-3d",
      zIndex: 30,
      z: 0,
    });

    gsap.set(page2, {
      rotateY: 0,
      transformOrigin: spineOrigin,
      transformStyle: "preserve-3d",
      zIndex: 20,
      z: 0,
    });

    // Back cover: bottom of the stack, never animated.
    gsap.set(backCover, {
      rotateY: 0,
      transformOrigin: spineOrigin,
      transformStyle: "preserve-3d",
      zIndex: 5,
    });

    // Words hidden until their sheet is face-up and readable.
    if (words1?.length) gsap.set(words1, { opacity: 0, y: 16 });
    if (words2?.length) gsap.set(words2, { opacity: 0, y: 16 });
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      initializeElements();

      const {
        scrollScrub, pageTurnAngle, coverTurnAngle,
        textStagger, textDuration, pageTurnDuration, coverTurnDuration,
        pageTurnEase, coverTurnEase,
      } = ANIMATION_CONFIG;

      const words1 = text1Ref.current?.querySelectorAll(".qb-word");
      const words2 = text2Ref.current?.querySelectorAll(".qb-word");
      const book = bookRef.current;
      const cover = coverRef.current;
      const page1 = page1Ref.current;
      const page2 = page2Ref.current;

      /* ── Master scroll-scrubbed timeline ──────────────────────────
         The qb-section is 700 vh tall with a CSS sticky viewport, so
         the ScrollTrigger simply maps the full section scroll distance
         to the timeline.  scrub > 1 gives a natural lag that feels
         like the paper has weight.
      ─────────────────────────────────────────────────────────────── */
      /* ═══════
         BOOK SEQUENCE — open → turn → turn → direct close
         ───────────────────────────────
         Design rules this timeline follows (each one fixes a specific
         defect in the previous version):

         1. ONE PROPERTY, ONE TWEEN.
            The old timeline ran three overlapping tweens on `cover`
            (a z-lift, the rotateY, and a z-settle) that shared frames.
            Under `scrub` those fight each other, so the recorded rotateY
            OSCILLATED — the cover visibly flickered open/closed partway
            through the section. Every property below is driven by exactly
            one tween on a contiguous, non-overlapping time range.

         2. NO `tl.set()` INSIDE A SCRUBBED TIMELINE.
            z-index was changed with `tl.set(...)`. With scrub GSAP SEEKS
            the playhead instead of replaying, so a zero-duration set is
            not reliably applied and layers visibly jumped. Each layer now
            gets ONE fixed z-index that is correct for the entire sequence:
              back cover 5 · page2 20 · page1 30 · front cover 40.
            A turning sheet needs no depth change: it swings left, and its
            lower z-index naturally puts it BEHIND the still-flat sheet —
            which is what a real book does.

         3. COMPLEMENTARY PHASES, NOT A REVERSE.
            settle (0→2) · open (2→4.4) ·
            page1 (4.5→7.4) · page2 (7.5→10.4) · DIRECT CLOSE (10.5→12.7).
            The close is its own phase, so the pages STAY turned and only
            the cover sweeps shut over them — a direct close, not an undo.

         4. Z-LIFT GIVES THE PAPER THICKNESS.
            A sheet rotating on a hinge while perfectly flat in Z shears
            unrealistically. Each turning layer lifts forward in Z, peaks
            while edge-on (where its shadow is darkest), then settles as it
            lands.

         5. EVERYTHING IS ON ONE SCRUBBED TIMELINE.
            Scrolling DOWN plays it forward; scrolling UP plays it in exact
            reverse. Open and close are true mirrors of one another.
         ══════ */

      /* Shadows are driven through a CSS VARIABLE, not through GSAP's
         `filter`. A `filter` (even an empty drop-shadow) on `.qb-front-cover`
         or a `.qb-page` flattens that element into a single rendering group,
         which DEFEATS `transform-style: preserve-3d` for its children. With
         the 3-D context gone, `backface-visibility: hidden` stops working and
         you see the mirrored FRONT cover text through the board instead of a
         plain inside cover. Using a variable that the faces consume as a
         `box-shadow` gives the same visual depth with no flattening. */
      const SHADOW_OFF = 0;
      const SHADOW_PEAK = 1;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: scrollScrub,
          invalidateOnRefresh: true,
          onLeave: () => sectionRef.current?.classList.add("qb-past"),
          onEnterBack: () => sectionRef.current?.classList.remove("qb-past"),
        },
      });

      /* PHASE 0 — SETTLE (t 0 → 2): the closed book eases from its entry
         tilt into a more head-on pose; the scroll hint fades away. */
      tl.to(
        book,
        { rotateX: 2, rotateY: -3, scale: 0.97, duration: 2, ease: "power2.out" },
        0
      );
      tl.to(".qb-scroll-hint", { opacity: 0, y: -18, duration: 0.9 }, 0.2);

      /* PHASE 1 — THE COVER OPENS (t 2 → 4.4): the board lifts toward the
         reader, sweeps a full 180° on the spine, and settles. The dark inner
         base fades up underneath as it uncovers the pages. */
      const openStart = 2;
      const openDur = coverTurnDuration; // 1.2
      tl.to(
        book,
        { xPercent: 0, duration: openDur, ease: "power2.inOut" },
        openStart
      );
      tl.to(
        ".qb-ground-shadow",
        { scaleX: 1, duration: openDur, ease: "power2.inOut" },
        openStart
      );

      tl.to(
        cover,
        { rotateY: coverTurnAngle, duration: openDur, ease: coverTurnEase },
        openStart
      );
      tl.to(cover, { z: 30, duration: openDur * 0.5, ease: "power2.out" }, openStart);
      tl.to(
        cover,
        { z: 0, duration: openDur * 0.5, ease: "power2.in" },
        openStart + openDur * 0.5
      );
      tl.fromTo(
        cover,
        { "--qb-shadow": SHADOW_OFF },
        { "--qb-shadow": SHADOW_PEAK, duration: openDur * 0.5, ease: "power2.inOut" },
        openStart
      );
      tl.to(
        cover,
        { "--qb-shadow": SHADOW_OFF, duration: openDur * 0.5, ease: "power2.inOut" },
        openStart + openDur * 0.5
      );

      /* PHASE 2 — PAGE 1: words in, then the sheet turns.
         The copy starts appearing AS THE COVER FINISHES (not a beat later),
         so the reader never looks at an empty page: the cover lands at
         t≈3.2 and the first line has already begun to rise. */
      if (words1?.length) {
        tl.to(
          words1,
          {
            opacity: 1,
            y: 0,
            stagger: textStagger,
            duration: textDuration,
            ease: "power2.out",
          },
          3.3
        );
      }

      const p1TurnAt = 6.0;
      tl.to(
        page1,
        { rotateY: pageTurnAngle, duration: pageTurnDuration, ease: pageTurnEase },
        p1TurnAt
      );
      tl.to(page1, { z: 34, duration: pageTurnDuration * 0.5, ease: "power2.out" }, p1TurnAt);
      tl.to(
        page1,
        { z: 0, duration: pageTurnDuration * 0.5, ease: "power2.in" },
        p1TurnAt + pageTurnDuration * 0.5
      );
      tl.fromTo(
        page1,
        { "--qb-shadow": SHADOW_OFF },
        { "--qb-shadow": SHADOW_PEAK, duration: pageTurnDuration * 0.5, ease: "power2.inOut" },
        p1TurnAt
      );
      tl.to(
        page1,
        { "--qb-shadow": SHADOW_OFF, duration: pageTurnDuration * 0.5, ease: "power2.inOut" },
        p1TurnAt + pageTurnDuration * 0.5
      );
      if (words1?.length) {
        tl.to(
          words1,
          { opacity: 0, duration: 0.5, ease: "power1.in" },
          p1TurnAt + pageTurnDuration * 0.25
        );
      }

      /* PHASE 3 — PAGE 2: words in.
         As page 1 finishes turning to the left, page 2 is revealed on the right
         and its copy animates in. The reader comfortably reads quote 2.
         Page 2 stays in place on the right (it does not flip into empty space). */
      if (words2?.length) {
        tl.to(
          words2,
          {
            opacity: 1,
            y: 0,
            stagger: textStagger,
            duration: textDuration,
            ease: "power2.out",
          },
          7.2
        );
      }

      /* PHASE 4 — CLOSING THE BOOK (t 9.8 → 12.2):
         1. Words on page 2 fade out.
         2. Page 1 turns back from -180° to 0° (tucking back inside over page 2).
         3. Front cover sweeps shut from -180° to 0° over page 1.
         4. Dark base fades out and closed book returns to resting tilt.
         When closed, ALL pages (page1, page2, cover) are at rotateY: 0° —
         ZERO extra pages or sheets visible beside the book! */
      const closeStart = 9.8;
      const closeDur = coverTurnDuration;

      if (words2?.length) {
        tl.to(
          words2,
          { opacity: 0, duration: 0.4, ease: "power1.in" },
          closeStart
        );
      }

      // Page 1 folds back from -180° to 0°
      tl.to(
        page1,
        { rotateY: 0, duration: pageTurnDuration, ease: pageTurnEase },
        closeStart + 0.15
      );
      tl.to(page1, { z: 30, duration: pageTurnDuration * 0.5, ease: "power2.out" }, closeStart + 0.15);
      tl.to(
        page1,
        { z: 0, duration: pageTurnDuration * 0.5, ease: "power2.in" },
        closeStart + 0.15 + pageTurnDuration * 0.5
      );
      tl.fromTo(
        page1,
        { "--qb-shadow": SHADOW_OFF },
        { "--qb-shadow": SHADOW_PEAK, duration: pageTurnDuration * 0.5, ease: "power2.inOut" },
        closeStart + 0.15
      );
      tl.to(
        page1,
        { "--qb-shadow": SHADOW_OFF, duration: pageTurnDuration * 0.5, ease: "power2.inOut" },
        closeStart + 0.15 + pageTurnDuration * 0.5
      );

      // Front cover closes from -180° to 0° over page 1
      tl.to(
        cover,
        { rotateY: 0, duration: closeDur, ease: coverTurnEase },
        closeStart + 0.3
      );
      tl.to(cover, { z: 34, duration: closeDur * 0.5, ease: "power2.out" }, closeStart + 0.3);
      tl.to(
        cover,
        { z: 0, duration: closeDur * 0.5, ease: "power2.in" },
        closeStart + 0.3 + closeDur * 0.5
      );
      tl.fromTo(
        cover,
        { "--qb-shadow": SHADOW_OFF },
        { "--qb-shadow": SHADOW_PEAK, duration: closeDur * 0.5, ease: "power2.inOut" },
        closeStart + 0.3
      );
      tl.to(
        cover,
        { "--qb-shadow": SHADOW_OFF, duration: closeDur * 0.5, ease: "power2.inOut" },
        closeStart + 0.3 + closeDur * 0.5
      );

      tl.to(
        book,
        { xPercent: -25, rotateX: 8, rotateY: -10, scale: 0.9, duration: 1.2, ease: "power2.inOut" },
        closeStart + 0.3 + closeDur * 0.5
      );
      tl.to(
        ".qb-ground-shadow",
        { scaleX: 0.55, duration: 1.2, ease: "power2.inOut" },
        closeStart + 0.3 + closeDur * 0.5
      );

      /* Total timeline ≈ 12.2 units mapped across the 700vh section */
    });

    const onLoadRefresh = () => requestScrollRefresh();
    const onLoaderDoneRefresh = () => requestScrollRefresh();
    window.addEventListener("load", onLoadRefresh, { once: true });
    document.addEventListener("qb-loader-done", onLoaderDoneRefresh);

    return () => {
      window.removeEventListener("load", onLoadRefresh);
      document.removeEventListener("qb-loader-done", onLoaderDoneRefresh);
      ctx.revert();
    };
  }, [initializeElements, location.pathname]);

  const renderWords = (words, italicWords) =>
    words.map((word, index) => (
      <span
        key={`${word}-${index}`}
        className={`qb-word${italicWords.includes(index) ? " qb-word-italic" : ""}`}
      >
        {word}
      </span>
    ));

  return (
    <section ref={sectionRef} className="qb-section">
      <div className="qb-sticky">
        <p className="qb-kicker-top">QUOTE</p>

        <div className="qb-book-container">
          {/* Ground shadow: a soft ellipse UNDER the book that grounds it in
              space. It is a sibling of the book (not a child) so it is not
              affected by the book's 3-D rotation — it stays flat on the
              "table" and only breathes with the book's scale. */}
          <div className="qb-ground-shadow" aria-hidden="true" />

          <div ref={bookRef} className="qb-book">
            <div ref={page1Ref} className="qb-page qb-page-1">
              <div className="qb-page-face qb-page-front">
                <div ref={text1Ref} className="qb-page-content">
                  {renderWords(page1Content.words, page1Content.italicWords)}
                </div>
                <span className="qb-page-number">02</span>
              </div>
              {/* Clean back face keeps the sheet solid as it turns past 90° */}
              <div className="qb-page-face qb-page-back" />
            </div>

            <div ref={page2Ref} className="qb-page qb-page-2">
              <div className="qb-page-face qb-page-front">
                <div ref={text2Ref} className="qb-page-content">
                  {renderWords(page2Content.words, page2Content.italicWords)}
                </div>
                <span className="qb-page-number">03</span>
              </div>
              <div className="qb-page-face qb-page-back" />
            </div>

            {/* Back cover - bottom of the stack, hidden while closed */}
            <div ref={backCoverRef} className="qb-cover qb-back-cover">
              <div className="qb-cover-face qb-cover-front" />
              <div className="qb-cover-face qb-cover-back" />
            </div>

            <div ref={coverRef} className="qb-cover qb-front-cover">
              <div className="qb-cover-face qb-cover-front">
                <p className="qb-cover-kicker">BEST CBSE SCHOOL BELAGAVI</p>
                <h3 className="qb-cover-title">
                  <span className="qb-cover-line">JAIN HERITAGE</span>
                  <span className="qb-cover-line qb-cover-subtitle">
                    SCHOOL
                  </span>
                  <span className="qb-cover-line qb-cover-location">
                    BELAGAVI
                  </span>
                </h3>
                <span className="qb-cover-rule" />
                <small className="qb-cover-year">EST. 2011</small>
              </div>
              <div className="qb-cover-face qb-cover-back" />
            </div>
          </div>
        </div>

        <div className="qb-scroll-hint">
          <span className="qb-scroll-line" />
          SCROLL TO OPEN THE BOOK
        </div>
      </div>
    </section>
  );
}

export default App;
