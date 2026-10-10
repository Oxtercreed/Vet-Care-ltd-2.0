import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SalonBoot } from "@/lib/salon/boot";
import { MotionProvider } from "@/components/motion-provider";
import appCss from "../styles.css?url";

const APP_NAME = "Vet Care LTD";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Vet Care LTD — Thoughtful veterinary care on Migombani Street, Mikocheni. Book wellness, vaccines, dental, diagnostics and grooming in Dar es Salaam.",
      },
      { name: "theme-color", content: "#2E3094" },
      {
        name: "keywords",
        content:
          "vet care Dar es Salaam, veterinary clinic Mikocheni, pet hospital Migombani, dog cat vaccines Tanzania, Vet Care LTD, book vet appointment Dar es Salaam, animal hospital Mikocheni",
      },
      { name: "geo.region", content: "TZ-02" },
      { name: "geo.placename", content: "Dar es Salaam" },
      
      { property: "og:title", content: APP_NAME },
      { property: "og:description", content: "Thoughtful veterinary care in Mikocheni, Dar es Salaam. Book wellness, vaccines, dental, diagnostics and grooming." },
      { property: "og:image", content: "/og.jpg" },
      { name: "apple-mobile-web-app-title", content: "Vet Care LTD" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "canonical", href: "https://wsalon-six.vercel.app/" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" data-theme="ivory" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-ink">
        <PreviewHostBridge />
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
