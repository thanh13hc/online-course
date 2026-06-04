import { UserRole } from "@/drizzle/schema";

export const canAccessAdminPages = ({ role }: { role?: UserRole }) => {
  return role === "admin";
};
