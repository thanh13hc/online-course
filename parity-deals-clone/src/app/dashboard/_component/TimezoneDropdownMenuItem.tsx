import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createUrl } from "@/lib/utils";
import Link from "next/link";

export function TimezoneDropdownMenuItem({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return (
    <DropdownMenuItem asChild>
      <Link
        href={createUrl("/dashboard/analytics", searchParams, {
          timezone: userTimezone,
        })}
      >
        {userTimezone}
      </Link>
    </DropdownMenuItem>
  );
}
