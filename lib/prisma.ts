import { PrismaClient } from "@/lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

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
            Coupon: "CP_",
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
            Coupon_Usage_History: "CouHist_",
            User_Coupon: "UsrCou_",
          };

          const prefix = modelPrefixMap[model as string];

          const data = args.data as Record<string, any>;
          if (prefix && !data.id) {
            const uniqueString = crypto
              .randomUUID()
              .substring(0, 9)
              .toUpperCase();

            data.id = `${prefix}${uniqueString}`;
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
