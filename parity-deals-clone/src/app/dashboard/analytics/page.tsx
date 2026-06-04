import { HasPermission } from "@/components/HasPermission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CHART_INTERVALS,
  getViewsByCountryChartData,
  getViewsByDayChartData,
  getViewsByPPPChartData,
} from "@/server/db/productViews";
import { canAccessAnalytics } from "@/server/permissions";
import { auth } from "@clerk/nextjs/server";
import { ViewByCountryChart } from "@/app/dashboard/_component/charts/ViewByCountryChart";
import { ViewByPPPChart } from "@/app/dashboard/_component/charts/ViewByPPPChart";
import { ViewByDayChart } from "@/app/dashboard/_component/charts/ViewByDayChart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { createUrl } from "@/lib/utils";
import { getProducts } from "@/server/db/products";
import { TimezoneDropdownMenuItem } from "@/app/dashboard/_component/TimezoneDropdownMenuItem";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    interval?: string;
    timezone?: string;
    productId?: string;
  }>;
}) {
  const { userId, redirectToSignIn } = await auth();

  if (userId == null) return redirectToSignIn();
  const params = await searchParams;

  const timezone = params.timezone || "UTC";
  const productId = params.productId;
  const interval =
    CHART_INTERVALS[params.interval as keyof typeof CHART_INTERVALS] ??
    CHART_INTERVALS.last7Days;

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Analytics</h1>

        <HasPermission permission={canAccessAnalytics}>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {interval.label}
                  <ChevronDownIcon className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(CHART_INTERVALS).map(([key, value]) => (
                  <DropdownMenuItem asChild key={key}>
                    <Link
                      href={createUrl("/dashboard/analytics", params, {
                        interval: key,
                      })}
                    >
                      {value.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ProductDropdown
              userId={userId}
              selectedProductId={productId}
              searchParams={params}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {timezone}
                  <ChevronDownIcon className="size-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    href={createUrl("/dashboard/analytics", params, {
                      timezone: "UTC",
                    })}
                  >
                    UTC
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={createUrl("/dashboard/analytics", params, {
                      timezone: "UTC",
                    })}
                  >
                    UTC
                  </Link>
                </DropdownMenuItem>
                <TimezoneDropdownMenuItem searchParams={params} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </HasPermission>
      </div>
      <HasPermission permission={canAccessAnalytics} renderFallback>
        <div className="flex flex-col gap-8">
          <ViewByDayCard
            timezone={timezone}
            userId={userId}
            interval={interval}
            productId={productId}
          />
          <ViewByPPPCard
            timezone={timezone}
            userId={userId}
            interval={interval}
            productId={productId}
          />
          <ViewByCountryCard
            timezone={timezone}
            userId={userId}
            interval={interval}
            productId={productId}
          />
        </div>
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

async function ViewByPPPCard(
  props: Parameters<typeof getViewsByDayChartData>[0]
) {
  const chartData = await getViewsByPPPChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewByPPPChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ViewByCountryCard(
  props: Parameters<typeof getViewsByDayChartData>[0]
) {
  const chartData = await getViewsByCountryChartData(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per Country</CardTitle>
      </CardHeader>
      <CardContent>
        <ViewByCountryChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

async function ProductDropdown({
  userId,
  selectedProductId,
  searchParams,
}: {
  userId: string;
  selectedProductId?: string;
  searchParams: Record<string, string>;
}) {
  const products = await getProducts(userId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {products.find((p) => p.id === selectedProductId)?.name ??
            "All Products"}
          <ChevronDownIcon className="size-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link
            href={createUrl("/dashboard/analytics", searchParams, {
              productId: undefined,
            })}
          >
            All Products
          </Link>
        </DropdownMenuItem>
        {products.map((product) => (
          <DropdownMenuItem asChild key={product.id}>
            <Link
              href={createUrl("/dashboard/analytics", searchParams, {
                productId: product.id,
              })}
            >
              {product.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
