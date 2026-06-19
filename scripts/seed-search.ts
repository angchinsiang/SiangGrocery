/**
 * Seed Meilisearch with Grocery data from Postgres.
 * Run: npx tsx scripts/seed-search.ts
 */
import "dotenv/config";
import prisma from "../lib/prisma";
import meili from "../lib/meilisearch";

async function seed() {
  console.log("Fetching groceries from Postgres...");

  const groceries = await prisma.grocery.findMany({
    where: { status: true },
    include: {
      groceryMedias: {
        include: { media: { select: { url: true } } },
        where: { media: { status: "ACTIVE", type: "IMAGE" } },
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
      listedProducts: {
        select: {
          original_price: true,
          discount_price: true,
          total_qty: true,
          reserved_qty: true,
          locked_in_qty: true,
        },
        where: { isDisplay: true },
        take: 1,
      },
    },
  });

  // ponytail: flatten to what search needs — no nested objects in Meilisearch
  const documents = groceries.map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description,
    category: g.category,
    form: g.form,
    MoU: g.MoU,
    country: g.country,
    isPromotion: g.isPromotion,
    image: g.groceryMedias[0]?.media.url || "",
    price: g.listedProducts[0]?.discount_price ?? 0,
    oriPrice: g.listedProducts[0]?.original_price ?? 0,
    inStock:
      (g.listedProducts[0]?.total_qty ?? 0) -
        (g.listedProducts[0]?.reserved_qty ?? 0) -
        (g.listedProducts[0]?.locked_in_qty ?? 0) >
      0,
  }));

  console.log(`Indexing ${documents.length} products into Meilisearch...`);

  const index = meili.index("groceries");

  // Configure searchable & filterable fields
  await index.updateSettings({
    searchableAttributes: ["name", "description", "category"],
    filterableAttributes: ["category", "form", "country", "isPromotion", "inStock"],
    sortableAttributes: ["price", "name"],
  });

  const task = await index.addDocuments(documents);
  console.log(`Enqueued task ${task.taskUid}. Waiting for completion...`);

  await meili.tasks.waitForTask(task.taskUid);
  console.log(`Done! ${documents.length} products indexed.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
