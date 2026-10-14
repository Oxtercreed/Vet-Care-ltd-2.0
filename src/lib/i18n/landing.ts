/**
 * Landing page copy — EN + natural Tanzanian Kiswahili.
 */
export type LandingLocale = "en" | "sw";

export const landingCopy = {
  en: {
    nav: {
      services: "Services",
      about: "About",
      gallery: "Gallery",
      reviews: "Reviews",
      location: "Location",
      book: "Book",
      signIn: "Sign in",
    },
    hero: {
      kicker: "Care · Comfort · Clarity",
      title: "Thoughtful care",
      tagline: "for the ones you love.",
      body: "Veterinary hospital on Church Road, Richmond — wellness, vaccines, dental, diagnostics & medicated grooming. Book in a few taps.",
      book: "Book an appointment",
      explore: "Explore services",
      rating: "4.9 · Church Road, Richmond · London",
    },
    houses: {
      kicker: "Five pillars of care",
      title: "Find the right visit.",
      body: "Wellness exams, vaccines, dental care, diagnostics and medicated grooming — choose what your pet needs.",
      all: "All",
      explore: "Explore",
    },
    cta: {
      title: "Your pet’s next visit is waiting.",
      body: "Pick a service, choose a time, and you’re done.",
      book: "Book an appointment",
    },
    footer: {
      customerSignIn: "Customer sign in",
      staff: "Staff",
      admin: "Admin",
    },
    lang: "English",
    langOther: "Kiswahili",
  },
  sw: {
    nav: {
      services: "Huduma",
      about: "Kuhusu sisi",
      gallery: "Picha",
      reviews: "Maoni",
      location: "Mahali",
      book: "Weka miadi",
      signIn: "Ingia",
    },
    hero: {
      kicker: "Huduma · Faraja · Uwazi",
      title: "Huduma yenye moyo",
      tagline: "kwa wapendwa wako.",
      body: "Hospitali ya mifugo Church Road, Richmond — uchunguzi, chanjo, meno, lab na huduma za wanyama. Weka miadi kwa haraka.",
      book: "Weka miadi",
      explore: "Angalia huduma",
      rating: "4.9 · Church Road, Richmond · London",
    },
    houses: {
      kicker: "Nguzo tano za huduma",
      title: "Chagua ziara inayofaa.",
      body: "Uchunguzi wa afya, chanjo, meno, uchunguzi wa maabara na usafi wa dawa — chagua unachohitaji mnyama wako.",
      all: "Zote",
      explore: "Angalia",
    },
    cta: {
      title: "Ziara ya mnyama wako inakungoja.",
      body: "Chagua huduma, chagua muda, umemaliza.",
      book: "Weka miadi",
    },
    footer: {
      customerSignIn: "Ingia kama mteja",
      staff: "Staff",
      admin: "Admin",
    },
    lang: "Kiswahili",
    langOther: "English",
  },
} as const;

export type LandingCopy = (typeof landingCopy)["en"];
