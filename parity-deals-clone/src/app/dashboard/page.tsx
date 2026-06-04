import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import { NoProduct } from "./_component/NoProduct";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "./_component/ProductGrid";
import {
  CHART_INTERVALS,
  getViewsByDayChartData,
} from "@/server/db/productViews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewByDayChart } from "./_component/charts/ViewByDayChart";
import { HasPermission } from "@/components/HasPermission";
import { canAccessAnalytics } from "@/server/permissions";

export default async function DashboardPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const products = await getProducts(userId, { limit: 6 });

  if (products.length === 0) return <NoProduct />;

  return (
    <>
      <h2 className="mb-6 text-3xl font-semibold flex justify-between">
        <Link
          className="group flex gap-2 items-center hover:underline"
          href={`/dashboard/products`}
        >
          Products{" "}
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </Link>

        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="size-4 mr-2" />
            New Product
          </Link>
        </Button>
      </h2>

      {products && products.length > 0 && <ProductGrid products={products} />}

      <HasPermission permission={canAccessAnalytics}>
        <h2 className="my-6 text-3xl font-semibold">
          <Link
            className="group flex gap-2 items-center hover:underline"
            href={`/dashboard/analytics`}
          >
            Analytics{" "}
            <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
          </Link>
        </h2>
        <ViewByDayCard
          timezone={"UTC"}
          userId={userId}
          interval={CHART_INTERVALS.last7Days}
        />
      </HasPermission>
    </>
  );
}

async function ViewByDayCard(
  props: Parameters<typeof getViewsByDayChartData>[0]
) {
  const chartData = await getViewsByDayChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewByDayChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}
