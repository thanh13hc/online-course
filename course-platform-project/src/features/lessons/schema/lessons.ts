import { lessonStatuses } from "@/drizzle/schema";
import { z } from "zod";

export const lessonSchema = z.object({
  name: z.string().min(1, "Required"),
  sectionId: z.string().min(1, "Required"),
  status: z.enum(lessonStatuses),
  youtubeVideoId: z.string().min(1, "Required"),
  description: z
    .string()
    .transform((v) => (v.trim() === "" ? null : v))
    .nullable(),
});

export type LessonForm = z.infer<typeof lessonSchema>;
