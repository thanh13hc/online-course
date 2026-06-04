"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SectionForm as TSectionForm, sectionSchema } from "../schema/sections";
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
import { CourseSectionStatus, courseSectionStatuses } from "@/drizzle/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSection, updateSection } from "../actions/sections";

export function SectionForm({
  section,
  courseId,
  onSuccess,
}: {
  courseId: string;
  section?: { id: string; name: string; status: CourseSectionStatus };
  onSuccess?: () => void;
}) {
  const form = useForm<TSectionForm>({
    resolver: zodResolver(sectionSchema),
    defaultValues: section ?? {
      name: "",
      status: "public",
    },
  });

  async function onSubmit(values: TSectionForm) {
    const action =
      section == null
        ? createSection.bind(null, courseId)
        : updateSection.bind(null, section.id);
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
                    {courseSectionStatuses.map((s) => (
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
        </div>
        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
