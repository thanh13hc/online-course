"use client";

import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

function Layout({ children }: { children: ReactNode }) {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const pathName = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();
      if (
        (userRole === "manager" && pathName.startsWith("/search")) ||
        (userRole === "manager" && pathName === "/")
      ) {
        router.push("/managers/properties", { scroll: false });
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(false);
      }
    }
  }, [pathName, authUser, router]);

  if (authLoading || isLoading) return <>Loading</>;

  return (
    <div className="w-full h-full">
      <Navbar />
      <main
        className={`h-full flex w-full flex-col`}
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;
