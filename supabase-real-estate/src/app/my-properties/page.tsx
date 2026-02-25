"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PropertyCard from "@/components/PropertyCard";

interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  city: string;
  agent_id: string;
  is_published: boolean;
  created_at: string;
}

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setError("Vous devez être connecté.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("agent_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Erreur lors du chargement.");
      } else {
        setProperties(data as Property[]);
      }

      setLoading(false);
    };

    fetchProperties();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mes biens</h1>

      {properties.length === 0 ? (
        <p>Aucun bien trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} isOwner={true} />
          ))}
        </div>
      )}
    </div>
  );
}