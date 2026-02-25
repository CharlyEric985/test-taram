// app/properties/page.tsx
import PropertyCard from '@/components/PropertyCard';
import { supabase } from '@/lib/supabaseClient';

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

export default async function PropertiesPage() {
  // Récupération des propriétés publiées côté serveur
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error:', error.message);
    return <div>Impossible de charger les propriétés.</div>;
  }

  const properties: Property[] = data as Property[];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Biens publiés</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}