"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CreatePropertyPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.rpc("insert_property", {
      p_title: title,
      p_description: description,
      p_price: Number(price),
      p_city: city,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Redirection vers mes biens
    router.push("/my-properties");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
          Créer un bien
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Titre"
            className="w-full p-2 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            placeholder="Prix"
            className="w-full p-2 border rounded-lg"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />

          <input
            type="text"
            placeholder="Ville"
            className="w-full p-2 border rounded-lg"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Création..." : "Créer le bien"}
          </button>
        </form>
      </div>
    </div>
  );
}