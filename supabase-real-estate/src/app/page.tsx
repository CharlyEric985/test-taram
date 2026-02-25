"use client";

import { useState } from "react";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Authentification avec Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data.user) {
      // Récupérer rôle dans la table profiles
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        setError(profileError.message);
        return;
      }

      // Redirection selon rôle
      if (profileData.role === "agent") router.push("/my-properties");
      else router.push("/properties");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">Connexion</h2>

        {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type="password"
              placeholder="Mot de passe"
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-green-700 transition"
          >
            <FaSignInAlt /> {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
