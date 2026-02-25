"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaHome, FaBuilding, FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      // Récupère l'utilisateur Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        // Si le rôle est dans le metadata
        if (user.user_metadata?.role) {
          setRole(user.user_metadata.role);
        } else {
          // Sinon récupérer depuis la table profiles
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          if (profile) setRole(profile.role);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  if (!user) return null; // pas de navbar si non connecté

  const isAgent = role === "agent";
  const isClient = role === "client";

  return (
    <nav className="bg-green-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <FaBuilding className="text-yellow-300" /> RealEstate
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/properties" className="hover:text-yellow-300 flex items-center gap-1">
              <FaHome /> Biens publiés
            </Link>

            {isAgent && (
              <Link href="/my-properties" className="hover:text-yellow-300 flex items-center gap-1">
                <FaBuilding /> Mes biens
              </Link>
            )}
            {isAgent &&  (
              <Link href="/create-property" className="hover:text-yellow-300 flex items-center gap-1">
                <FaBuilding /> Creer un bien
              </Link>
            )}

            {isClient && (
              <span className="px-3 py-1 rounded bg-yellow-300 text-green-600 flex items-center gap-1">
                <FaUser /> Client
              </span>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-yellow-300 text-green-600 px-3 py-1 rounded hover:bg-yellow-400 transition"
            >
              <FaSignOutAlt /> Déconnexion
            </button>
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Mobile */}
      {isOpen && (
        <div className="md:hidden bg-green-500 px-4 pb-4 space-y-2">
          <Link href="/properties" className="block hover:text-yellow-300 flex items-center gap-2">
            <FaHome /> Biens publiés
          </Link>

          {isAgent && (
            <Link href="/my-properties" className="block hover:text-yellow-300 flex items-center gap-2">
              <FaBuilding /> Mes biens
            </Link>
          )}
          {isAgent && (
            <Link href="/create-property" className="block hover:text-yellow-300 flex items-center gap-2">
              <FaBuilding /> Créer un bien
            </Link>
          )}

          {isClient && (
            <span className="block px-3 py-2 rounded bg-yellow-300 text-green-600 flex items-center gap-2">
              <FaUser /> Client
            </span>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center bg-yellow-300 text-green-600 px-3 py-2 rounded hover:bg-yellow-400 transition"
          >
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
}
