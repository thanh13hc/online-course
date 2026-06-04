"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonForm as TLessonForm, lessonSchema } from "../schema/lessons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RequiredLabelIcon } from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import { LessonStatus, lessonStatuses } from "@/drizzle/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createLesson, updateLesson } from "../actions/lessons";
import { YoutubeVideoPlayer } from "./YoutubeVideoPlayer";

export function LessonForm({
  lesson,
  defaultSectionId,
  sections,
  onSuccess,
}: {
  lesson?: {
    id: string;
    name: string;
    status: LessonStatus;
    youtubeVideoId: string;
    description: string | null;
    sectionId: string;
  };
  defaultSectionId?: string;
  sections: { id: string; name: string }[];
  onSuccess?: () => void;
}) {
  const form = useForm<TLessonForm>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson?.name ?? "",
      status: lesson?.status ?? "public",
      youtubeVideoId: lesson?.youtubeVideoId ?? "",
      description: lesson?.description ?? "",
      sectionId:
        lesson?.sectionId ?? defaultSectionId ?? sections?.[0]?.id ?? "",
    },
  });

  const videoId = form.watch("youtubeVideoId");

  async function onSubmit(values: TLessonForm) {
    const action =
      lesson == null ? createLesson : updateLesson.bind(null, lesson.id);
    const data = await action(values);
    actionToast({ actionData: data });

    if (!data.error) onSuccess?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col @container"
      >
        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabelIcon />
                  Name
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="youtubeVideoId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabelIcon />
                  Youtube Video Id
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sectionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem value={s.id} key={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lessonStatuses.map((s) => (
                      <SelectItem value={s} key={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-20 resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>

        {videoId && (
          <div className="aspect-video">
            <YoutubeVideoPlayer videoId={videoId} />
          </div>
        )}
      </form>
    </Form>
  );
}
