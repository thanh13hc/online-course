import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CaretLeftIcon } from "@radix-ui/react-icons";

export function PageWithBackButton({
  children,
  backButtonHref,
  pageTitle,
}: {
  children: React.ReactNode;
  backButtonHref: string;
  pageTitle: string;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-8">
      <Button className="rounded-full" variant="outline" size="icon" asChild>
        <Link href={backButtonHref}>
          <div className="sr-only"></div>
          <CaretLeftIcon className="size-8" />
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold self-center">{pageTitle}</h1>
      <div className="col-start-2">{children}</div>
    </div>
  );
}
