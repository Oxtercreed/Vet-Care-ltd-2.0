import { createFileRoute, Link } from "@tanstack/react-router";
import { m } from "motion/react";
import { Button } from "@/components/ui/button";
import { getService, getStylist, SALON } from "@/lib/salon/data";
import { formatClock, formatLongDate, formatTsh } from "@/lib/salon/format";
import { useSalonStore } from "@/lib/salon/store";
import { CalendarPlus, MessageCircle } from "lucide-react";

type Search = { id?: string };

export const Route = createFileRoute("/app/book/success")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  component: SuccessPage,
});

function buildWhatsAppMessage(opts: {
  ref: string;
  service: string;
  date: string;
  time: string;
  petName?: string;
  petType?: string;
  guardianName: string;
  guardianPhone: string;
}) {
  const petLine = opts.petName
    ? `\n🐾 Pet: ${opts.petName}${opts.petType ? ` (${opts.petType})` : ""}`
    : "";
  return (
    `Hello The Richmond Veterinary Hospital, I have booked an appointment online:\n\n` +
    `📋 Ref: ${opts.ref}\n` +
    `🩺 Service: ${opts.service}\n` +
    `📅 Date: ${opts.date}\n` +
    `⏰ Time: ${opts.time}` +
    petLine +
    `\n👤 Pet parent: ${opts.guardianName} (${opts.guardianPhone})\n` +
    `📍 24 Church Road, Richmond, Greater London\n\n` +
    `Thank you!`
  );
}

function buildGoogleCalUrl(opts: {
  title: string;
  details: string;
  location: string;
  date: string;
  time: string;
}) {
  // All-day-ish 1h block from time
  const [hh, mm] = opts.time.split(":").map(Number);
  const start = opts.date.replace(/-/g, "") + "T" + String(hh).padStart(2, "0") + String(mm).padStart(2, "0") + "00";
  const endH = hh + 1;
  const end =
    opts.date.replace(/-/g, "") +
    "T" +
    String(endH).padStart(2, "0") +
    String(mm).padStart(2, "0") +
    "00";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    details: opts.details,
    location: opts.location,
    dates: `${start}/${end}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function SuccessPage() {
  const { id } = Route.useSearch();
  const appt = useSalonStore((s) => s.appointments.find((a) => a.id === id));
  const service = appt ? getService(appt.serviceId) : undefined;
  const stylist = appt && !appt.anyStylist ? getStylist(appt.stylistId) : undefined;

  const waiting =
    appt?.status === "requested" || (appt?.needsProviderConfirm && !appt?.providerConfirmed);
  const needsPay =
    appt?.status === "payment_pending" || (appt?.providerConfirmed && (appt?.remaining ?? 0) > 0);

  const waMsg =
    appt && service
      ? buildWhatsAppMessage({
          ref: appt.id,
          service: service.name,
          date: formatLongDate(appt.date),
          time: formatClock(appt.time),
          petName: appt.petName,
          petType: appt.petType,
          guardianName: appt.customerName,
          guardianPhone: appt.customerPhone,
        })
      : "";

  const waHref = waMsg
    ? `${SALON.whatsapp}?text=${encodeURIComponent(waMsg)}`
    : SALON.whatsapp;

  const calHref =
    appt && service
      ? buildGoogleCalUrl({
          title: `The Richmond Veterinary Hospital: ${service.name}${appt.petName ? ` — ${appt.petName}` : ""}`,
          details:
            `Booking Ref: ${appt.id}\n` +
            `Service: ${service.name}\n` +
            (appt.petName
              ? `Pet: ${appt.petName}${appt.petType ? ` (${appt.petType})` : ""}\n`
              : "") +
            `Pet parent: ${appt.customerName}\n` +
            `Phone: ${appt.customerPhone}\n` +
            `Clinic: ${SALON.name}, ${SALON.addressLine1}, ${SALON.addressLine2} (${SALON.phone})`,
          location: `${SALON.name}, ${SALON.addressLine1}, ${SALON.addressLine2}`,
          date: appt.date,
          time: appt.time,
        })
      : "#";

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col bg-bg px-6 pb-12 pt-16">
      <div className="text-center">
        <m.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          className="mx-auto"
        >
          <svg viewBox="0 0 48 48" className="mx-auto size-16" aria-hidden>
            <circle cx="24" cy="24" r="22" fill="none" className="stroke-line" strokeWidth="1.5" />
            <path
              d="M14 24.5 L21 31.5 L34 16.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="draw-check text-success"
            />
          </svg>
        </m.div>
        <m.h1
          className="mt-6 font-display text-title font-normal"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {waiting ? "Request sent" : needsPay ? "Confirmed — pay deposit" : "You're booked"}
        </m.h1>
        <p className="mt-2 text-body text-muted">
          {waiting
            ? "The clinic will confirm your time. You'll pay after they accept."
            : needsPay
              ? "Your time is held. Complete payment to finish the booking."
              : "Your appointment is confirmed."}
        </p>
      </div>

      {service && appt && (
        <m.div
          className="mt-10 rounded-[28px] border border-line bg-surface px-5 py-6 shadow-soft"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="font-display text-section font-normal">{service.name}</p>
          <p className="mt-1 text-body text-muted">
            {stylist ? `${stylist.name} · ${stylist.title}` : "Veterinarian to be confirmed"}
          </p>
          {appt.petName && (
            <p className="mt-3 text-body">
              🐾 {appt.petName}
              {appt.petType ? ` · ${appt.petType}` : ""}
              {appt.petBreed ? ` · ${appt.petBreed}` : ""}
              {appt.petAge ? ` · ${appt.petAge}` : ""}
            </p>
          )}
          <p className="mt-4 text-body">
            {formatLongDate(appt.date)}
            <br />
            {formatClock(appt.time)}
          </p>
          <p className="mt-4 text-support text-muted">
            Deposit {formatTsh(appt.deposit)} · Total {formatTsh(appt.total)}
          </p>
          <p className="mt-2 text-support text-muted">Ref {appt.id}</p>
        </m.div>
      )}

      {appt && service && (
        <m.div
          className="mt-4 space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <a href={waHref} target="_blank" rel="noreferrer">
            <Button variant="secondary" className="h-13 w-full gap-2">
              <MessageCircle className="size-4" strokeWidth={1.75} />
              Send booking on WhatsApp
            </Button>
          </a>
          <a href={calHref} target="_blank" rel="noreferrer">
            <Button variant="secondary" className="h-13 w-full gap-2">
              <CalendarPlus className="size-4" strokeWidth={1.75} />
              Add to Google Calendar
            </Button>
          </a>
        </m.div>
      )}

      <div className="mt-auto space-y-3 pt-10">
        {needsPay && appt && (
          <Link to="/app/appointments/$id" params={{ id: appt.id }}>
            <Button className="h-13 w-full bg-ink text-[var(--brand-ink)]">
              Pay deposit {formatTsh(appt.deposit)}
            </Button>
          </Link>
        )}
        <Link to="/app/appointments">
          <Button variant={needsPay ? "secondary" : undefined} className="h-13 w-full">
            View appointments
          </Button>
        </Link>
        <Link to="/app" className="block text-center text-support text-muted">
          Home
        </Link>
        <p className="text-center text-support text-muted">
          Allow notifications so you know when the clinic confirms or when it&apos;s time to pay.
        </p>
        <p className="text-center text-support text-muted">{SALON.name}</p>
      </div>
    </main>
  );
}
