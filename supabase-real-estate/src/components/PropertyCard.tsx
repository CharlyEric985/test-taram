"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

interface Property {
  id: string;
  title: string;
  price: number;
  city: string;
  is_published: boolean;
}

interface Props {
  property: Property;
  isOwner?: boolean; // 🔥 important
}

export default function PropertyCard({ property, isOwner }: Props) {
  const [published, setPublished] = useState(property.is_published);
  const [loading, setLoading] = useState(false);

  const togglePublish = async () => {
    setLoading(true);

    const { error } = await supabase
      .from("properties")
      .update({ is_published: !published })
      .eq("id", property.id);

    if (!error) {
      setPublished(!published);
    } else {
      console.error(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4">
      <h3 className="text-xl font-bold">{property.title}</h3>
      <p>{property.city}</p>
      <p className="font-semibold text-green-600">{property.price} €</p>

      <p className="mt-2">
        Status :{" "}
        <span className={published ? "text-green-600" : "text-red-500"}>
          {published ? "Publié" : "Non publié"}
        </span>
      </p>

      {isOwner && (
        <button
          onClick={togglePublish}
          disabled={loading}
          className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
        >
          {loading
            ? "Modification..."
            : published
            ? "Dépublier"
            : "Publier"}
        </button>
      )}
    </div>
  );
}