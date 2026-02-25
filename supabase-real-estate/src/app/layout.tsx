"use client";

import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import './globals.css';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // On n'affiche pas la navbar si on est sur la page login
  const showNavbar = pathname !== "/";

  return (
    <html lang="fr">
      <body className="bg-gray-50">
        {showNavbar && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}
