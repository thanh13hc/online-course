"use server";

import { getCurrentUser } from "@/services/clerk";
import { SectionForm, sectionSchema } from "../schema/sections";
import {
  canCreateSections,
  canUpdateSections,
  canDeleteSections,
} from "../permissions/sections";
import {
  getNextCourseSectionOrder,
  insertSection,
  updateSection as updateSectionDb,
  deleteSection as deleteSectionDb,
  updateSectionOrders as updateSectionOrdersDb
} from "../db/sections";

export async function createSection(courseId: string, unsafeData: SectionForm) {
  const { success, data } = sectionSchema.safeParse(unsafeData);

  if (!success || !canCreateSections(await getCurrentUser())) {
    return {
      error: true,
      message: "There was an error creating your course section",
    };
  }

  const order = await getNextCourseSectionOrder(courseId);

  await insertSection({
    ...data,
    courseId,
    order,
  });

  return { error: false, message: "Successfully created your section" };
}

export async function updateSection(id: string, unsafeData: SectionForm) {
  const { success, data } = sectionSchema.safeParse(unsafeData);

  if (!success || !canUpdateSections(await getCurrentUser())) {
    return {
      error: true,
      message: "There was an error update your course section",
    };
  }

  await updateSectionDb(id, data);

  return { error: false, message: "Successfully updated your section" };
}

export async function deleteSection(id: string) {
  if (!canDeleteSections(await getCurrentUser())) {
    return {
      error: true,
      message: "There was an error deleting your section",
    };
  }

  await deleteSectionDb(id);

  return { error: false, message: "Successfully deleted your section" };
}

export async function updateSectionOrders(sectionIds: string[]) {
  if (sectionIds.length === 0 || !canUpdateSections(await getCurrentUser())) {
    return { error: true, message: "Error reordering your sections" };
  }

  await updateSectionOrdersDb(sectionIds)

  return  { error: false, message: "Successfully reordering your sections" };
}
