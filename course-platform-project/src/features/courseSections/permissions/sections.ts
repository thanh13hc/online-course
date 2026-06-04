import { CourseSectionTable, UserRole } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export function canCreateSections({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canUpdateSections({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export function canDeleteSections({ role }: { role: UserRole | undefined }) {
  return role === "admin";
}

export const wherePublicCourseSections = eq(
  CourseSectionTable.status,
  "public"
);
