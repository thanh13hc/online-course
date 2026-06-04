"use server";

import { db } from "@/drizzle/db";
import { getPurchaseGlobalTag } from "@/features/purchases/db/cache";
import { getUserGlobalTag } from "@/features/users/db/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { desc } from "drizzle-orm";
import { PurchaseTable as DbPurchasesTable } from "@/drizzle/schema";
import { PageHeader } from "@/components/PageHeader";
import { PurchaseTable } from "@/features/purchases/components/PurchaseTable";

export default async function PurchasesPage() {
  const purchases = await getPurchases();

  return (
    <div className="container my-6">
      <PageHeader title="Sales" />

      <PurchaseTable purchases={purchases} />
    </div>
  );
}

async function getPurchases() {
  "use cache";

  cacheTag(getUserGlobalTag(), getPurchaseGlobalTag());

  return db.query.PurchaseTable.findMany({
    columns: {
      id: true,
      pricePaidInCents: true,
      refundedAt: true,
      productDetails: true,
      createdAt: true,
    },
    orderBy: desc(DbPurchasesTable.createdAt),
    with: { user: { columns: { name: true } } },
  });
}
