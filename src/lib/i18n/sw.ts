/**
 * Kiswahili cha kila siku (Tanzania) — si tafsiri ya neno kwa neno.
 * Bado inahitaji ukaguzi wa mzungumzaji asilia kabla ya launch.
 */
import type { Dict } from "./en";

export const sw: Dict = {
  common: {
    book: "Weka miadi",
    continue: "Endelea",
    back: "Rudi nyuma",
    cancel: "Ghairi",
    save: "Hifadhi",
    loading: "Subiri kidogo…",
    notConnected: "Bado haijaunganishwa",
  },
  customer: {
    homeGreeting: "Uko tayari kujipamba?",
    noAppointments: "Bado huna miadi",
    joinWaitlist: "Jiunge kwenye foleni",
    myWaitlist: "Foleni yangu",
    payDeposit: "Lipa deposit",
    requestSent: "Ombi limetumwa",
  },
  staff: {
    today: "Leo",
    acceptRequest: "Kubali ombi",
    walkIn: "Mteja wa walk-in",
  },
  admin: {
    integrations: "Miunganisho",
    featureFlags: "Vipengele",
    messageLog: "Ujumbe uliotumwa",
  },
};
