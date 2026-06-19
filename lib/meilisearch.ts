import { Meilisearch } from "meilisearch";

const meiliClientSingleton = () =>
  new Meilisearch({
    host: process.env.MEILISEARCH_HOST || "http://localhost:7700",
    apiKey: process.env.MEILI_MASTER_KEY || "",
  });

declare const globalThis: {
  meiliGlobal: ReturnType<typeof meiliClientSingleton>;
} & typeof global;

const meili = globalThis.meiliGlobal ?? meiliClientSingleton();

export default meili;

if (process.env.NODE_ENV !== "production") globalThis.meiliGlobal = meili;
