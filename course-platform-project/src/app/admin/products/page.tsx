import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import {
  CourseProductTable,
  ProductTable as ProductTableDb,
  PurchaseTable,
} from "@/drizzle/schema";
import ProductTable from "@/features/products/components/ProductTable";
import { getProductGlobalTag } from "@/features/products/db/cache";
import { asc, countDistinct, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container my-6">
      <PageHeader title="Products">
        <Button asChild>
          <Link href="/admin/products/new">New Product</Link>
        </Button>
      </PageHeader>
      <ProductTable products={products} />
    </div>
  );
}

async function getProducts() {
  "use cache";
  cacheTag(getProductGlobalTag());

  return db
    .select({
      id: ProductTableDb.id,
      name: ProductTableDb.name,
      status: ProductTableDb.status,
      priceInDollars: ProductTableDb.priceInDollars,
      description: ProductTableDb.description,
      imageUrl: ProductTableDb.imageUrl,
      coursesCount: countDistinct(CourseProductTable.courseId),
      customersCount: countDistinct(PurchaseTable.userId),
    })
    .from(ProductTableDb)
    .leftJoin(PurchaseTable, eq(ProductTableDb.id, PurchaseTable.productId))
    .leftJoin(
      CourseProductTable,
      eq(CourseProductTable.productId, ProductTableDb.id)
    )
    .orderBy(asc(ProductTableDb.name))
    .groupBy(ProductTableDb.id);
}
