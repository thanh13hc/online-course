import { getCourseTag, getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getCourseSectionGlobalTag() {
  return getGlobalTag("courseSections");
}

export function getCourseSctionIdTag(id: string) {
  return getIdTag("courseSections", id);
}

export function getCourseSectionCourseTag(courseId: string) {
  return getCourseTag("courseSections", courseId);
}

export function revalidateCourseSectionCache({
  id,
  courseId,
}: {
  id: string;
  courseId: string;
}) {
  revalidateTag(getCourseSectionGlobalTag());
  revalidateTag(getCourseSctionIdTag(id));
  revalidateTag(getCourseSectionCourseTag(courseId));
}
