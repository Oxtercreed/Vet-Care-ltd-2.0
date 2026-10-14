import type { Category, Service, Stylist, TeamMember } from "./types";

export const TEST_PRICE_TSH = 500;

export function applyTestPrices<T extends { priceMin: number; priceMax?: number; depositPercent: number }>(
  list: T[],
): T[] {
  return list.map((s) => ({
    ...s,
    priceMin: TEST_PRICE_TSH,
    priceMax: TEST_PRICE_TSH,
    depositPercent: 100,
  }));
}

export const SALON = {
  name: "The Richmond Veterinary Hospital",
  short: "Richmond Vet",
  tagline: "Happy pets make happy people.",
  brandWords: "Care · Comfort · Clarity",
  phone: "+44 20 7946 0850",
  phoneHref: "tel:+442079460850",
  whatsapp: "https://wa.me/447700900850",
  instagram: "https://instagram.com/richmondvet.uk",
  facebook: "https://facebook.com/richmondvet.uk",
  tiktok: "",
  addressLine1: "24 Church Road",
  addressLine2: "Richmond, Greater London, TW10 6TW",
  hours: "Mon – Sat · 8:00 AM – 7:00 PM",
  hoursShort: "8:00 AM – 7:00 PM",
  rating: 4.9,
  reviewCount: 340,
  mapEmbed:
    "https://maps.google.com/maps?q=Richmond+Greater+London+UK&hl=en&z=16&output=embed",
  mapsLink:
    "https://maps.google.com/?q=Church+Road+Richmond+London+UK",
  mapsApp:
    "https://maps.google.com/?q=Church+Road+Richmond+London+UK",
  cancellationPolicy:
    "Free cancellation up to 24 hours before your appointment. Within 24 hours, the deposit may be retained according to The Richmond Veterinary Hospital policy.",
  depositPolicy:
    "A deposit holds your slot. The remaining balance is paid at the clinic after your visit.",
  whatToBring:
    "Bring your pet’s previous vaccination records if available. For first visits, arrive 10 minutes early for registration.",
};

export const services: Service[] = [
  {
    id: "wellness-exam",
    name: "Health & Wellness Exam",
    category: "wellness",
    description:
      "A thorough physical examination with vital signs, weight check, and clear guidance tailored to your pet’s age and lifestyle.",
    priceMin: 35000,
    priceMax: 55000,
    durationMin: 30,
    durationMax: 45,
    rating: 4.9,
    reviewCount: 142,
    image: "/images/vet/service-wellness.jpg",
    gallery: [
      "/images/vet/service-wellness.jpg",
      "/images/vet/figma-hero-dog.jpg",
      "/images/vet/team.jpg",
    ],
    includes: [
      "Complete physical examination & vital signs",
      "Weight check & tailored nutritional advice",
      "Heart, lungs, eyes, ears & dental check",
    ],
    popular: true,
    signature: true,
    acceptsReference: false,
    depositPercent: 30,
    nextAvailable: "Today 10:00 AM",
    featuredReview: {
      quote: "They took time to explain everything. Our dog felt calm the whole visit.",
      name: "Amina K.",
    },
  },
  {
    id: "vaccines-prevention",
    name: "Vaccines & Parasite Prevention",
    category: "vaccines",
    description:
      "Essential core vaccinations and parasite protection to keep your pet protected year-round, with official certificates.",
    priceMin: 45000,
    priceMax: 75000,
    durationMin: 20,
    durationMax: 30,
    rating: 4.9,
    reviewCount: 198,
    image: "/images/vet/service-vaccine.jpg",
    gallery: [
      "/images/vet/service-vaccine.jpg",
      "/images/vet/figma-puppy-arms.jpg",
      "/images/vet/cat-care.jpg",
    ],
    includes: [
      "Core viral booster (DHLPP / FVRCP)",
      "Official Rabies immunization certificate",
      "Broad-spectrum deworming & tick/flea prevention",
    ],
    popular: true,
    signature: true,
    acceptsReference: false,
    depositPercent: 30,
    nextAvailable: "Today 11:30 AM",
    featuredReview: {
      quote: "Quick, professional, and they sent the certificate the same day.",
      name: "James M.",
    },
  },
  {
    id: "dental-care",
    name: "Dental Care & Hygiene",
    category: "dental",
    description:
      "Safe ultrasonic cleaning and polishing to remove tartar, prevent gum disease, and keep breath fresh.",
    priceMin: 50000,
    priceMax: 120000,
    durationMin: 45,
    durationMax: 60,
    rating: 4.8,
    reviewCount: 87,
    image: "/images/vet/service-dental.jpg",
    gallery: [
      "/images/vet/service-dental.jpg",
      "/images/vet/hero.jpg",
      "/images/vet/team.jpg",
    ],
    includes: [
      "Ultrasonic tartar & plaque scaling",
      "Gentle tooth polishing & oral rinse",
      "Gingivitis check & home dental advice",
    ],
    popular: true,
    signature: false,
    acceptsReference: false,
    depositPercent: 40,
    nextAvailable: "Tomorrow 9:00 AM",
    featuredReview: {
      quote: "Our cat’s breath is better and she eats more comfortably now.",
      name: "Grace N.",
    },
  },
  {
    id: "diagnostics",
    name: "Ultrasound & Lab Diagnostics",
    category: "diagnostics",
    description:
      "Fast, precise in-house diagnostics and imaging for quick answers and effective care plans.",
    priceMin: 60000,
    priceMax: 150000,
    durationMin: 30,
    durationMax: 60,
    rating: 4.9,
    reviewCount: 64,
    image: "/images/vet/service-diagnostics.jpg",
    gallery: [
      "/images/vet/service-diagnostics.jpg",
      "/images/vet/figma-hero-dog.jpg",
      "/images/vet/team.jpg",
    ],
    includes: [
      "High-resolution abdominal ultrasound scan",
      "Complete Blood Count (CBC) & organ chemistry",
      "Rapid tick-borne parasite & viral testing",
    ],
    popular: false,
    signature: true,
    acceptsReference: false,
    depositPercent: 40,
    nextAvailable: "Today 2:00 PM",
    featuredReview: {
      quote: "Results the same afternoon. Clear explanation of next steps.",
      name: "David O.",
    },
  },
  {
    id: "medicated-grooming",
    name: "Medicated Pet Grooming",
    category: "grooming",
    description:
      "Gentle therapeutic baths and grooming to soothe sensitive skin and maintain coat vitality.",
    priceMin: 40000,
    priceMax: 90000,
    durationMin: 45,
    durationMax: 75,
    rating: 4.8,
    reviewCount: 112,
    image: "/images/vet/service-grooming.jpg",
    gallery: [
      "/images/vet/service-grooming.jpg",
      "/images/vet/figma-puppy-arms.jpg",
      "/images/vet/cat-care.jpg",
    ],
    includes: [
      "Medicated wash & anti-tick/flea treatment",
      "Ear cleaning & safe nail trim",
      "Hygienic sanitary trim & paw pad care",
    ],
    popular: true,
    signature: false,
    acceptsReference: false,
    depositPercent: 30,
    nextAvailable: "Today 3:30 PM",
    featuredReview: {
      quote: "Soft coat, no more itching. They were so gentle with our anxious pup.",
      name: "Sarah L.",
    },
  },
];

export const stylists: Stylist[] = [
  {
    id: "dr-amina",
    name: "Dr. Eleanor Davies",
    title: "Lead Veterinarian (BVSc MRCVS)",
    bio: "Gentle, thorough exams with clear explanations for every pet parent.",
    specialties: ["wellness", "vaccines", "diagnostics"],
    image: "/images/vet/team.jpg",
    initials: "ED",
    rating: 4.9,
  },
  {
    id: "dr-james",
    name: "Dr. James Sterling",
    title: "Veterinary Surgeon (BVM&S MRCVS)",
    bio: "Focused on diagnostics, dental care, and surgical support.",
    specialties: ["dental", "diagnostics", "wellness"],
    image: "/images/vet/team.jpg",
    initials: "JS",
    rating: 4.9,
  },
  {
    id: "nurse-grace",
    name: "Sophie Taylor",
    title: "Head Veterinary Nurse (RVN)",
    bio: "Calm handling and skilled medicated grooming for sensitive pets.",
    specialties: ["grooming", "vaccines", "wellness"],
    image: "/images/vet/team.jpg",
    initials: "ST",
    rating: 4.8,
  },
];

export const reviews = [
  {
    id: "r1",
    name: "Charlotte H.",
    rating: 5,
    text: "They took time to explain everything. Our dog felt calm the whole visit. Highly recommend Richmond Vet on Church Road.",
    service: "Health & Wellness Exam",
    date: "2 weeks ago",
  },
  {
    id: "r2",
    name: "James P.",
    rating: 5,
    text: "Quick vaccines, professional team, and they sent the certificate the same day. Easy booking too.",
    service: "Vaccines & Prevention",
    date: "1 month ago",
  },
  {
    id: "r3",
    name: "Emily W.",
    rating: 5,
    text: "Dental cleaning made a huge difference. Our cat eats more comfortably now. Clean clinic, kind staff.",
    service: "Dental Care",
    date: "3 weeks ago",
  },
  {
    id: "r4",
    name: "Arthur B.",
    rating: 5,
    text: "Ultrasound and lab results the same afternoon. Clear next steps. True peace of mind.",
    service: "Diagnostics",
    date: "1 week ago",
  },
  {
    id: "r5",
    name: "Fiona R.",
    rating: 5,
    text: "Medicated grooming was gentle and effective. Soft coat, no more itching. Will be back.",
    service: "Medicated Grooming",
    date: "5 days ago",
  },
];

export const gallery = [
  { src: "/images/vet/figma-hero-dog.jpg", alt: "Happy dog at Richmond Vet", category: "Clinic" as const },
  { src: "/images/vet/service-wellness.jpg", alt: "Wellness examination", category: "Wellness" as const },
  { src: "/images/vet/service-vaccine.jpg", alt: "Vaccination care", category: "Vaccines" as const },
  { src: "/images/vet/service-dental.jpg", alt: "Dental care", category: "Dental" as const },
  { src: "/images/vet/service-diagnostics.jpg", alt: "Diagnostics suite", category: "Diagnostics" as const },
  { src: "/images/vet/service-grooming.jpg", alt: "Medicated grooming", category: "Grooming" as const },
  { src: "/images/vet/figma-puppy-arms.jpg", alt: "Puppy in caring hands", category: "Clinic" as const },
  { src: "/images/vet/cat-care.jpg", alt: "Cat care moment", category: "Clinic" as const },
  { src: "/images/vet/team.jpg", alt: "Our veterinary team", category: "Team" as const },
  { src: "/images/vet/hero.jpg", alt: "Richmond Vet clinic", category: "Clinic" as const },
];

export const signatures = [
  {
    id: "wellness-exam",
    title: "Wellness",
    copy: "Thorough exams with a gentle touch.",
    image: "/images/vet/service-wellness.jpg",
  },
  {
    id: "vaccines-prevention",
    title: "Vaccines",
    copy: "Protection that lasts, with clear records.",
    image: "/images/vet/service-vaccine.jpg",
  },
  {
    id: "diagnostics",
    title: "Diagnostics",
    copy: "Fast answers when you need them most.",
    image: "/images/vet/service-diagnostics.jpg",
  },
];

export const offer = {
  label: "This month",
  title: "10% off Wellness Exams",
  copy: "For weekday morning appointments.",
  serviceId: "wellness-exam",
  image: "/images/vet/service-wellness.jpg",
};

const WEEKDAY_HOURS = [1, 2, 3, 4, 5, 6].map((day) => ({
  day,
  start: "08:00",
  end: "19:00",
}));
const SUNDAY_OFF = [{ day: 0, start: "00:00", end: "00:00", off: true as const }];

export const team: TeamMember[] = [
  {
    id: "dr-amina",
    name: "Dr. Eleanor Davies",
    title: "Lead Veterinarian (BVSc MRCVS)",
    bio: "Gentle, thorough exams with clear explanations for every pet parent.",
    specialties: ["wellness", "vaccines", "diagnostics"],
    image: "/images/vet/team.jpg",
    initials: "ED",
    rating: 4.9,
    role: "stylist",
    phone: "+442079460850",
    email: "eleanor@richmondvet.co.uk",
    serviceIds: ["wellness-exam", "vaccines-prevention", "diagnostics"],
    hours: [...WEEKDAY_HOURS, ...SUNDAY_OFF],
    active: true,
  },
  {
    id: "dr-james",
    name: "Dr. James Sterling",
    title: "Veterinary Surgeon (BVM&S MRCVS)",
    bio: "Focused on diagnostics, dental care, and surgical support.",
    specialties: ["dental", "diagnostics", "wellness"],
    image: "/images/vet/team.jpg",
    initials: "JS",
    rating: 4.9,
    role: "stylist",
    phone: "+442079460851",
    email: "james@richmondvet.co.uk",
    serviceIds: ["dental-care", "diagnostics", "wellness-exam"],
    hours: [...WEEKDAY_HOURS, ...SUNDAY_OFF],
    active: true,
  },
  {
    id: "nurse-grace",
    name: "Sophie Taylor",
    title: "Head Veterinary Nurse (RVN)",
    bio: "Calm handling and skilled medicated grooming for sensitive pets.",
    specialties: ["grooming", "vaccines", "wellness"],
    image: "/images/vet/team.jpg",
    initials: "ST",
    rating: 4.8,
    role: "stylist",
    phone: "+442079460852",
    email: "sophie@richmondvet.co.uk",
    serviceIds: ["medicated-grooming", "vaccines-prevention", "wellness-exam"],
    hours: [...WEEKDAY_HOURS, ...SUNDAY_OFF],
    active: true,
  },
];

let liveServices: Service[] = services;
let liveTeam: TeamMember[] = team;

export function setLiveServices(next: Service[]) {
  liveServices = next;
}

export function setLiveTeam(next: TeamMember[]) {
  liveTeam = next;
}

export function getService(id: string) {
  return liveServices.find((s) => s.id === id) ?? services.find((s) => s.id === id);
}

export function getStylist(id: string) {
  const member = liveTeam.find((t) => t.id === id);
  if (member) return member;
  return stylists.find((s) => s.id === id);
}

export function stylistsFor(category: Category) {
  return liveTeam.filter((s) => s.role === "stylist" && s.specialties.includes(category) && s.active !== false);
}

export function getTeamMember(id: string) {
  return liveTeam.find((t) => t.id === id) ?? team.find((t) => t.id === id);
}

export function stylistsOnTeam() {
  return liveTeam.filter((t) => t.role === "stylist" && t.active !== false);
}

export function allTeam() {
  return liveTeam;
}
