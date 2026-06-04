import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import { NoProduct } from "../_component/NoProduct";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { ProductGrid } from "../_component/ProductGrid";

export default async function Products() {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();

  const products = await getProducts(userId);

  if (products.length === 0) return <NoProduct />;

  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold flex justify-between">
        Products
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="size-4 mr-2" /> New Product
          </Link>
        </Button>
      </h1>
      <ProductGrid products={products} />
    </>
  );
}
