import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { SalonBoot } from "@/lib/salon/boot";
import { MotionProvider } from "@/components/motion-provider";
import appCss from "../styles.css?url";

const APP_NAME = "The Richmond Veterinary Hospital";

/** Public site URL (set VITE_SITE_URL in Vercel, e.g. https://richmondvet.co.uk) — makes share-image and canonical links absolute. */
const SITE_URL = ((import.meta.env.VITE_SITE_URL as string | undefined) ?? "").trim().replace(/\/+$/, "");

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "The Richmond Veterinary Hospital — Compassionate veterinary care and surgery on Church Road, Richmond. Book wellness exams, vaccinations, dental, diagnostics, and grooming in London.",
      },
      { name: "theme-color", content: "#2E3094" },
      {
        name: "keywords",
        content:
          "veterinary hospital Richmond London, veterinary clinic Richmond Surrey, animal hospital London, pet clinic Church Road, dog cat vaccinations UK, The Richmond Veterinary Hospital, book vet appointment London",
      },
      { name: "geo.region", content: "GB-ENG" },
      { name: "geo.placename", content: "Richmond, London" },
      
      { property: "og:title", content: APP_NAME },
      { property: "og:description", content: "Compassionate veterinary care and surgical excellence in Richmond, Greater London. Book consultations, vaccinations, diagnostics, and wellness." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: APP_NAME },
      { property: "og:image", content: `${SITE_URL}/og.jpg` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL}/og.jpg` },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "Richmond Vet" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      ...(SITE_URL ? [{ rel: "canonical", href: `${SITE_URL}/` }] : []),
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" data-theme="ivory" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-ink">
        <AuthProvider>
          <MotionProvider>
            <SalonBoot />
            <Outlet />
          </MotionProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
