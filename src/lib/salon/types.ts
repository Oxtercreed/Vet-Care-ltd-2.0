export type Category = "wellness" | "vaccines" | "dental" | "diagnostics" | "grooming";

export type Service = {
  id: string;
  name: string;
  category: Category;
  description: string;
  priceMin: number;
  priceMax?: number;
  durationMin: number;
  durationMax?: number;
  rating: number;
  reviewCount: number;
  image: string;
  imagePosition?: string;
  gallery: string[];
  includes: string[];
  popular?: boolean;
  signature?: boolean;
  available?: boolean;
  acceptsReference?: boolean;
  depositPercent: number;
  nextAvailable: string;
  featuredReview: { quote: string; name: string };
};

export type Stylist = {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: Category[];
  image?: string;
  initials: string;
  rating: number;
};

export type StaffRole = "stylist" | "receptionist" | "manager" | "admin";
export type ShiftStatus = "available" | "busy" | "on_break" | "offline";
export type Portal = "customer" | "staff" | "admin";

export type TeamMember = Stylist & {
  role: StaffRole;
  phone: string;
  email: string;
  serviceIds: string[];
  hours: { day: number; start: string; end: string; off?: boolean }[];
  breakStart?: string;
  breakEnd?: string;
  active?: boolean;
};

export type PaymentMethod = "mpesa" | "airtel" | "tigo";

export type AppointmentStatus =
  | "requested"
  | "payment_pending"
  | "confirmed"
  | "checked_in"
  | "in_service"
  | "completed"
  | "cancelled"
  | "no_show"
  | "expired";

export type BookingSource = "appointment" | "walk_in";

export type PetType = "Dog" | "Cat" | "Other";

export type BookingDraft = {
  serviceId: string | null;
  stylistId: string;
  date: string | null;
  time: string | null;
  style: string;
  notes: string;
  sensitivities: string[];
  photoName: string;
  photoData: string;
  paymentMethod: PaymentMethod;
  /** Pet patient details (vet-specific) */
  petName: string;
  petType: PetType;
  petBreed: string;
  petAge: string;
};

export type WaitlistEntry = {
  id: string;
  serviceId: string;
  stylistId: string;
  preferredDate: string;
  preferredTime?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  status: "waiting" | "offered" | "accepted" | "declined" | "expired" | "booked" | "cancelled";
  offeredDate?: string;
  offeredTime?: string;
  offerExpiresAt?: string;
};

export type Appointment = {
  id: string;
  serviceId: string;
  stylistId: string;
  anyStylist: boolean;
  date: string;
  time: string;
  style: string;
  notes: string;
  sensitivities: string[];
  photoName: string;
  photoData?: string;
  total: number;
  deposit: number;
  remaining: number;
  paymentMethod: PaymentMethod;
  status: AppointmentStatus;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  source: BookingSource;
  checkedInAt?: string;
  startedAt?: string;
  completedAt?: string;
  paymentRef?: string;
  cancelledAt?: string;
  cancelReason?: string;
  /** Pet patient details */
  petName?: string;
  petType?: PetType;
  petBreed?: string;
  petAge?: string;
  needsProviderConfirm?: boolean;
  providerConfirmed?: boolean;
  paymentOrderId?: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
};

export type CustomerRecord = {
  id: string;
  name: string;
  phone: string;
  since: string;
  notes?: string;
  preferredStylistId?: string;
  returning?: boolean;
};

export type Profile = {
  name: string;
  phone: string;
  mpesaPhone: string;
  reminders: boolean;
  stylistReadyAlerts: boolean;
};

export type Session = {
  portal: Portal | "customer";
  actorId: string;
  name: string;
  role: string;
};

export type SalonSettings = {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  hours: string;
  leadMinutes: number;
  depositPercentDefault: number;
  cancellationHours: number;
  mpesaEnabled: boolean;
  airtelEnabled: boolean;
  tigoEnabled: boolean;
  cashierCanDiscount: boolean;
  maxDiscountPercent: number;
};

export type NoticeTemplate = {
  id: string;
  title: string;
  body: string;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  audience?: "customer" | "staff" | "admin" | "all";
  href?: string;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: string;
  visible: boolean;
  order: number;
};

export type OfferRecord = {
  id: string;
  label: string;
  title: string;
  copy: string;
  serviceId: string;
  image?: string;
  active?: boolean;
  discountPercent?: number;
};

export type PaymentRecord = {
  id: string;
  appointmentId: string;
  amount: number;
  method: PaymentMethod;
  status: string;
  createdAt: string;
  ref?: string;
};

export type QueueEntry = {
  id: string;
  appointmentId: string;
  position: number;
  status: string;
};

export type ReviewRecord = {
  id: string;
  appointmentId?: string;
  customerName: string;
  rating: number;
  text: string;
  service?: string;
  createdAt: string;
};

export type AuditEvent = {
  id: string;
  action: string;
  actor: string;
  at: string;
  meta?: Record<string, unknown>;
};

export type TimeOff = {
  id: string;
  staffId: string;
  date: string;
  reason: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
};
