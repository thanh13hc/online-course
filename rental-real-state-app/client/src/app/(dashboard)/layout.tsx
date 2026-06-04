"use client";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

function DashboarLayout({ children }: { children: ReactNode }) {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const pathName = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();
      if (
        (userRole === "manager" && pathName.startsWith("/tenants")) ||
        (userRole === "tenant" && pathName.startsWith("/managers"))
      ) {
        router.push(
          userRole === "manager"
            ? "/managers/properties"
            : "/tenants/favorites",
          { scroll: false },
        );
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(false);
      }
    }
  }, [pathName, authUser, router]);

  if (authLoading || isLoading) return <>Loading</>;
  if (!authUser?.userRole) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-primary-100">
        <Navbar />

        <div style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
          <main className="flex">
            <AppSidebar userType={authUser.userRole.toLowerCase()} />
            <div className="grow transition-all duration-300">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboarLayout;
