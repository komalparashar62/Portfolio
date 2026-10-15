import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Komal Parashar — Product Designer & Product Thinker",
  description: "Thoughtful websites and digital products. Komal Parashar brings design craft and product management experience to help turn complex ideas into clear experiences.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
