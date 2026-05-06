import { PrismaClient } from "@/lib/generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter }).$extends({
    query: {
      $allModels: {
        async create({ model, args, query }) {
          const modelPrefixMap: Record<string, string> = {
            User: "USR_",
            Cart: "CRT_",
            Cart_Item: "CRTI_",
            Grocery: "GRC_",
            Wishlist: "WSH_",
            Wishlist_Item: "WSHI_",
            Coupon: "CPN_",
            Order_Ticket: "OT_",
            Grocery_Order: "GO_",
            Listed_Product: "LP_",
            Supply_Item: "SI_",
            Order_History: "OH_",
            Supplier: "SUP_",
            Comment: "CMT_",
            Logs: "LOGS_",
            Admin: "ADM_",
            Comment_Media: "CMTM_",
          };

          const prefix = modelPrefixMap[model as string];

          if (prefix && !args.data.id) {
            const uniqueString = crypto
              .randomUUID()
              .substring(0, 9)
              .toUpperCase();

            args.data.id = `${prefix}${uniqueString}`;
          }

          return query(args);
        },
      },
    },
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
