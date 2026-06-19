import meili from "@/lib/meilisearch";
import StoreProductCard from "@/components/server/StoreProductCard";
import dummyImg from "@/public/DummyImg.jpg";

interface SearchHit {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  oriPrice: number;
  MoU: string;
  country: string;
  category: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let hits: SearchHit[] = [];
  if (query) {
    try {
      const results = await meili.index("groceries").search(query, { limit: 40 });
      hits = results.hits as SearchHit[];
    } catch (error) {
      console.error("Meilisearch error:", error);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">
        {query ? (
          <>
            Search results for &quot;<span className="text-green-600">{query}</span>
            &quot;
          </>
        ) : (
          "Search"
        )}
      </h1>

      {query && hits.length === 0 && (
        <p className="text-gray-500">
          No products found for &quot;{query}&quot;. Try a different search term.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {hits.map((hit) => (
          <StoreProductCard
            key={hit.id}
            SKU={hit.id}
            alt={hit.name}
            image={hit.image || dummyImg}
            price={hit.price}
            oriPrice={hit.oriPrice}
            unit={hit.MoU}
            country={hit.country}
          />
        ))}
      </div>
    </div>
  );
}
