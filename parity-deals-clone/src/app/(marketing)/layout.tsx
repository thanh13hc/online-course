import { ReactNode } from "react";
import { NavBar } from "./_component/Navbar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="selection:bg-[hsl(320,65%,52%,20%)]">
      <NavBar />
      {children}
    </div>
  );
}
