import { LandingSmoothScroll } from "@/components/landing/smooth-scroll";
import { ThemePortal } from "@/components/theme-portal";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  Bell,
  MapPin,
  Menu,
  Phone,
  Sparkles,
  Users,
  X,
  Instagram,
} from "lucide-react";
import { GallerySlideshow } from "./gallery-slideshow";
import { Button } from "@/components/ui/button";
import { LogoWord } from "@/components/salon/logo";
import { Photo } from "@/components/salon/photo";
import { Stars } from "@/components/salon/stars";
import { SALON, reviews, services } from "@/lib/salon/data";
import { categoryLabel, CATEGORY_ORDER } from "@/lib/salon/category-labels";
import { formatDuration, formatPriceRange } from "@/lib/salon/format";
import { cn } from "@/lib/utils";
import { landingCopy, type LandingLocale } from "@/lib/i18n/landing";
import { getStoredLocale, setStoredLocale } from "@/lib/i18n";

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [category, setCategory] = useState<"all" | "wellness" | "vaccines" | "dental" | "diagnostics" | "grooming">("all");
  const [locale, setLocale] = useState<LandingLocale>("en");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stored = getStoredLocale();
    setLocale(stored === "sw" ? "sw" : "en");
  }, []);

  const L = landingCopy[locale];
  const featured = services.filter((s) => s.popular);

  const navItems = [
    { href: "#services", label: L.nav.services },
    { href: "#about", label: L.nav.about },
    { href: "#gallery", label: L.nav.gallery },
    { href: "#reviews", label: L.nav.reviews },
    { href: "#faq", label: "FAQs" },
    { href: "#location", label: L.nav.location },
  ];

  function switchLang() {
    const next: LandingLocale = locale === "en" ? "sw" : "en";
    setLocale(next);
    setStoredLocale(next);
  }

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <ThemePortal portal="public" />
      <LandingSmoothScroll />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,color] duration-300",
          scrolled ? "glass-nav shadow-soft" : "bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
          <a href="#top" className="animate-fade-up" data-logo-reveal>
            <LogoWord light={!scrolled} />
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={cn(
                  "text-support transition-colors duration-150",
                  scrolled ? "text-muted hover:text-ink" : "text-surface/80 hover:text-surface",
                )}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={switchLang}
              className={cn(
                "rounded-full border px-3 py-1.5 text-micro font-medium uppercase tracking-wide transition-colors",
                scrolled
                  ? "border-line text-ink hover:bg-surface-2"
                  : "border-white/60 text-white hover:bg-white/15",
              )}
              aria-label="Change language"
            >
              {locale === "en" ? "SW" : "EN"}
            </button>
            <Link to="/app/services" className="hidden md:block">
              <Button size="md" variant={scrolled ? "primary" : "inverse"} className={scrolled ? "h-12 bg-ink text-white" : "h-12"}>
                {L.nav.book}
              </Button>
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              className={cn(
                "flex size-11 items-center justify-center rounded-full md:hidden",
                scrolled ? "text-ink" : "text-surface",
              )}
              onClick={() => setMenu(true)}
            >
              <Menu className="size-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fixed inset-0 z-50 bg-bg px-6 py-6 md:hidden">
          <div className="flex items-center justify-between">
            <LogoWord />
            <button
              type="button"
              aria-label="Close menu"
              className="flex size-11 items-center justify-center"
              onClick={() => setMenu(false)}
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          </div>
          <nav className="mt-12 flex flex-col gap-6">
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenu(false)}
                className="font-display text-3xl font-normal tracking-tight"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <Link to="/app/services" className="mt-10 block" onClick={() => setMenu(false)}>
            <Button className="h-14 w-full bg-ink text-white">{L.hero.book}</Button>
          </Link>
          <Link
            to="/enter"
            search={{ as: "customer" }}
            className="mt-3 block"
            onClick={() => setMenu(false)}
          >
            <Button variant="secondary" className="h-14 w-full">
              {L.footer.customerSignIn}
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => {
              switchLang();
            }}
            className="mt-6 w-full rounded-full border border-line py-3 text-support"
          >
            {locale === "en" ? "Badilisha lugha: Kiswahili" : "Change language: English"}
          </button>
          <Link to="/enter" className="mt-4 block text-center text-support text-muted" onClick={() => setMenu(false)}>
            {L.footer.staff} &amp; {L.footer.admin}
          </Link>
        </div>
      )}

      <section id="top" className="relative min-h-dvh">
        <div className="absolute inset-0 overflow-hidden">
          <div data-parallax className="absolute inset-[-8%] size-[116%]">
            <Photo
              src="/images/vet/figma-hero-dog.jpg"
              alt="Richmond Vet hospital"
              className="size-full [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
              priority
            />
          </div>
        </div>
        <div className="hero-scrim absolute inset-0" />
        <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-end px-5 pb-20 pt-32 md:px-8 md:pb-24">
          <p
            className="animate-fade-up text-micro uppercase tracking-[0.22em] text-surface/80"
            style={{ animationDelay: "40ms" }}
          >
            {L.hero.kicker}
          </p>
          <h1
            className="animate-fade-up mt-4 max-w-xl font-display text-hero font-normal text-surface"
            style={{ animationDelay: "120ms" }}
          >
            {L.hero.title}
          </h1>
          <p
            className="animate-fade-up mt-3 font-script text-2xl text-surface/90 md:text-3xl"
            style={{ animationDelay: "160ms" }}
          >
            {L.hero.tagline}
          </p>
          <p
            className="animate-fade-up mt-5 max-w-md text-body text-surface/80"
            style={{ animationDelay: "200ms" }}
          >
            {L.hero.body}
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "280ms" }}
          >
            <Link to="/app/services">
              <Button variant="inverse" className="h-14 px-7 shadow-soft">
                {L.hero.book}
                <ArrowRight className="size-4" strokeWidth={1.75} />
              </Button>
            </Link>
            <a href="#services">
              <Button
                variant="quiet"
                className="h-14 border-2 border-white/90 bg-white/15 px-6 text-white backdrop-blur-sm hover:bg-white/25"
                style={{ color: "#ffffff" }}
              >
                {L.hero.explore}
              </Button>
            </a>
          </div>
          <div
            className="animate-fade-up mt-10 flex items-center gap-3 text-surface"
            style={{ animationDelay: "360ms" }}
          >
            <Stars value={5} light />
            <span className="text-support text-surface/80">{L.hero.rating}</span>
          </div>
        </div>
      </section>

      <section id="services" data-reveal className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <p className="text-micro uppercase tracking-[0.18em] text-muted">{L.houses.kicker}</p>
        <h2 className="mt-3 font-display text-title font-normal tracking-tight">{L.houses.title}</h2>
        <p className="mt-3 max-w-lg text-body text-muted">
          {L.houses.body}
        </p>
        <div data-reveal className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {CATEGORY_ORDER.map((c) => (
            <Link
              key={c}
              to="/app/services"
              search={{ category: c }}
              className="group flex flex-col overflow-hidden rounded-[28px] border border-line bg-surface shadow-soft transition-transform duration-300 active:scale-[0.98]"
            >
              <div className="aspect-[4/3] overflow-hidden bg-surface-2">
                <Photo
                  src={
                    c === "wellness"
                      ? "/images/vet/service-wellness.jpg"
                      : c === "vaccines"
                        ? "/images/vet/service-vaccine.jpg"
                        : c === "dental"
                          ? "/images/vet/service-dental.jpg"
                          : c === "diagnostics"
                            ? "/images/vet/service-diagnostics.jpg"
                            : "/images/vet/service-grooming.jpg"
                  }
                  alt={categoryLabel(c)}
                  className="size-full rounded-none"
                  imgClassName="transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <p className="px-3 py-3 font-display text-body tracking-tight text-ink md:px-4 md:py-4">
                {categoryLabel(c)}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto hide-scroll">
          {(["all", "wellness", "vaccines", "dental", "diagnostics", "grooming"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "h-10 shrink-0 rounded-full px-4 text-support capitalize transition-colors duration-150",
                category === c ? "bg-ink text-white" : "border border-line bg-transparent text-ink",
              )}
            >
              {c === "all" ? L.houses.all : categoryLabel(c)}
            </button>
          ))}
        </div>
        <div className="mt-10 flex gap-5 overflow-x-auto pb-4 hide-scroll md:grid md:grid-cols-3 md:overflow-visible">
          {featured
            .filter((s) => category === "all" || s.category === category)
            .map((s) => (
              <Link
                key={s.id}
                to="/app/services/$serviceId"
                params={{ serviceId: s.id }}
                className="group w-72 shrink-0 md:w-auto"
              >
                <div className="overflow-hidden rounded-[28px] shadow-soft">
                  <Photo
                    src={s.image}
                    alt={s.name}
                    position={s.imagePosition}
                    className="aspect-4/5 w-full"
                    imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 text-body font-medium">{s.name}</p>
                <p className="mt-1 text-support text-muted">
                  {formatPriceRange(s.priceMin, s.priceMax)}
                  <span className="mx-2 text-line">·</span>
                  {formatDuration(s.durationMin, s.durationMax)}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-support text-ink">
                  {L.houses.explore} <ArrowRight className="size-3.5" strokeWidth={1.75} />
                </span>
              </Link>
            ))}
        </div>
      </section>

      <section data-reveal className="bg-surface">
        <div className="mx-auto grid max-w-6xl items-stretch gap-0 md:grid-cols-2">
          <Photo
            src="/images/vet/figma-puppy-arms.jpg"
            alt="Veterinary care at The Richmond Veterinary Hospital"
            className="min-h-80 md:min-h-[36rem]"
          />
          <div className="flex flex-col justify-center px-5 py-16 md:px-16">
            <p className="text-micro uppercase tracking-[0.18em] text-muted">Signature experience</p>
            <h2 className="mt-3 font-display text-title font-normal">Care that feels right.</h2>
            <p className="mt-5 max-w-md text-body text-muted">
              Gentle handling, clear guidance, and visits built around how your pet actually feels. Our team takes the time the care deserves.
            </p>
            <Link to="/app/services" search={{ category: "wellness" }} className="mt-8 inline-flex items-center gap-2 text-body">
              Explore wellness services
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <p data-reveal className="text-micro uppercase tracking-[0.18em] text-muted">Why Richmond Vet</p>
        <h2 className="mt-3 max-w-md font-display text-title font-normal">More than an appointment.</h2>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line">
          {[
            { icon: Users, title: "Experienced veterinarians", body: "Professionals who put pets first." },
            { icon: CalendarCheck, title: "Easy booking", body: "Choose your service, vet and time in minutes." },
            { icon: Bell, title: "Thoughtful reminders", body: "We'll let you know when it's time for the visit." },
            { icon: Sparkles, title: "Simple payments", body: "Convenient mobile money when you're ready to book." },
          ].map((f) => (
            <div key={f.title} className="lg:px-6 first:lg:pl-0 last:lg:pr-0">
              <f.icon className="size-5 text-ink" strokeWidth={1.75} />
              <h3 className="mt-5 text-section font-normal">{f.title}</h3>
              <p className="mt-2 text-body text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="bg-surface px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-micro uppercase tracking-[0.18em] text-muted">Our care</p>
          <h2 className="mt-3 font-display text-title font-normal">
            Real care.
            <br />
            Real comfort.
          </h2>
          <p className="mt-3 max-w-md text-body text-muted">A quiet look through the clinic. The slideshow plays on its own.</p>
          <div className="mt-12">
            <GallerySlideshow />
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
        <Photo src="/images/vet/team.jpg" alt="Our veterinary team" className="h-80 rounded-[24px] md:h-[30rem]" />
        <div>
          <p className="text-micro uppercase tracking-[0.18em] text-muted">Our story</p>
          <h2 className="mt-3 font-display text-title font-normal">
            Your clinic.
            <br />
            Your pet’s place.
          </h2>
          <p className="mt-6 max-w-md text-body text-muted">
            The Richmond Veterinary Hospital is a modern companion animal hospital on Church Road, Richmond. We built it for thoughtful, unhurried care — wellness, vaccines, dental, diagnostics, surgery, and grooming — with the same care we would want for our own pets.
          </p>
          <Link to="/app" className="mt-8 inline-flex items-center gap-2 text-body">
            Meet the team
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </Link>
        </div>
      </section>

      <section id="reviews" className="bg-surface px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-micro uppercase tracking-[0.18em] text-muted">Pet parent love</p>
          <h2 className="mt-3 font-display text-title font-normal">Loved by pet parents.</h2>
          <blockquote className="mt-12 max-w-3xl">
            <Stars />
            <p className="mt-5 font-display text-title font-normal tracking-tight text-ink">
              “{reviews[0].text}”
            </p>
            <footer className="mt-4 text-support text-muted">
              {reviews[0].name} · {reviews[0].service}
            </footer>
          </blockquote>
          <div className="mt-12 flex gap-4 overflow-x-auto pb-2 hide-scroll">
            {reviews.slice(1).map((r) => (
              <figure key={r.id} className="w-72 shrink-0 border-t border-line pt-6">
                <Stars />
                <blockquote className="mt-4 text-body text-ink">“{r.text}”</blockquote>
                <figcaption className="mt-4 text-support text-muted">
                  {r.name} · {r.service}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>


      <section id="faq" className="bg-surface px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="text-micro uppercase tracking-[0.18em] text-muted">FAQs</p>
          <h2 className="mt-3 font-display text-title font-normal">Answers for pet parents.</h2>
          <p className="mt-3 text-body text-muted">
            Common questions about visits, vaccines, emergencies and payments.
          </p>
          <div className="mt-12 space-y-3">
            {[
              {
                q: "Do I need to book an appointment, or can I walk in?",
                a: "We welcome walk-ins during normal clinic hours, though booking ensures minimal waiting. Critical pet emergencies always receive immediate triage priority.",
              },
              {
                q: "What vaccinations does my dog or puppy need in the UK?",
                a: "Core vaccines for dogs in the UK include Canine Parvovirus, Distemper, Canine Infectious Hepatitis, and Leptospirosis (L4). We also offer Kennel Cough and Rabies certification for international travel.",
              },
              {
                q: "How do I know if my pet has an emergency?",
                a: "Signs include difficulty breathing, severe lethargy, continuous vomiting, suspected poisoning, or acute trauma. Call our emergency triage desk at +44 20 7946 0850 immediately.",
              },
              {
                q: "What payment methods are accepted?",
                a: "We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, and bank transfer / cash.",
              },
              {
                q: "Do you offer medicated grooming?",
                a: "Yes. Medicated baths, anti-tick/flea treatment, ear cleaning, nail trim and sanitary care — gentle handling for sensitive skin and anxious pets.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-[20px] border border-line bg-bg px-5 py-4"
              >
                <summary className="cursor-pointer list-none text-body font-medium text-ink outline-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-muted transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-body text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="location" className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <p className="text-micro uppercase tracking-[0.18em] text-muted">Location</p>
        <h2 className="mt-3 font-display text-title font-normal">Come see us.</h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-section font-normal">{SALON.name}</p>
            <p className="mt-2 text-body text-muted">
              {SALON.addressLine1}
              <br />
              {SALON.addressLine2}
            </p>
            <p className="mt-8 text-micro uppercase tracking-[0.16em] text-muted">Opening hours</p>
            <p className="mt-2 text-body">
              Mon–Sat
              <br />
              {SALON.hoursShort}
            </p>
            <p className="mt-1 text-body text-muted">Sunday · Closed</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={SALON.mapsApp} target="_blank" rel="noreferrer">
                <Button variant="primary" size="md" className="h-12">
                  <MapPin className="size-4" strokeWidth={1.75} />
                  Get directions
                </Button>
              </a>
              <a href={SALON.phoneHref}>
                <Button variant="secondary" size="md" className="h-12">
                  <Phone className="size-4" strokeWidth={1.75} />
                  Call clinic
                </Button>
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-[24px] border border-line bg-brand-soft">
            <iframe
              title="Map of The Richmond Veterinary Hospital"
              src={SALON.mapEmbed}
              className="h-72 w-full md:h-96 grayscale"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <Photo src="/images/vet/hero.jpg" alt="" className="absolute inset-0 size-full min-h-[28rem]" />
        <div className="cta-scrim absolute inset-0" />
        <div className="relative mx-auto flex min-h-[28rem] max-w-6xl flex-col items-center justify-center px-5 py-24 text-center md:px-8 md:py-32">
          <p className="text-micro uppercase tracking-[0.22em] text-surface/80">Ready when you are.</p>
          <h2 className="mt-4 font-display text-hero font-normal text-surface">{L.cta.title}</h2>
          <p className="mx-auto mt-5 max-w-md text-body text-surface/75">
            Choose your service, pick your time, and you're done.
          </p>
          <Link to="/app/services" className="mt-10 inline-block">
            <Button variant="inverse" className="h-14 px-8">
              {L.cta.book}
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-line bg-bg">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
          <div>
            <LogoWord />
            <p className="mt-3 text-support text-muted">
              {SALON.addressLine1}, {SALON.addressLine2}
            </p>
            <p className="mt-1 text-support text-muted">{SALON.phone}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-support text-muted">
            {navItems.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-ink">
                {n.label}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-5 text-support text-muted">
            <a href={SALON.instagram} className="inline-flex items-center gap-2 hover:text-ink">
              <Instagram className="size-4" strokeWidth={1.75} />
              Instagram
            </a>
            <a href={SALON.whatsapp} className="hover:text-ink">
              WhatsApp
            </a>
            <a href={SALON.facebook} className="hover:text-ink">
              Facebook
            </a>
            <a href={SALON.tiktok} className="hover:text-ink">
              TikTok
            </a>
          </div>
        </div>
          <div className="mx-auto max-w-6xl px-5 pb-10 text-support text-muted md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>© 2026 The Richmond Veterinary Hospital</span>
            <span className="flex flex-wrap gap-4">
              <Link to="/enter" search={{ as: "customer" }} className="hover:text-ink">
                Customer sign in
              </Link>
              <Link to="/enter" search={{ as: "staff" }} className="hover:text-ink">
                Staff
              </Link>
              <Link to="/enter" search={{ as: "admin" }} className="hover:text-ink">
                Admin
              </Link>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
