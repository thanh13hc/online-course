"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LessonStatus } from "@/drizzle/schema";
import { ReactNode, useState } from "react";
import { LessonForm } from "./LessonForm";

export default function LessonFormDialog({
  sections,
  children,
  defaultSectionId,
  lesson,
}: {
  sections?: { id: string; name: string }[];
  children: ReactNode;
  defaultSectionId?: string;
  lesson?: {
    id: string;
    name: string;
    status: LessonStatus;
    youtubeVideoId: string;
    description: string | null;
    sectionId: string;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {lesson == null ? "New lesson" : "Edit lesson"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <LessonForm
            sections={sections ?? []}
            defaultSectionId={defaultSectionId}
            lesson={lesson}
            onSuccess={() => {
              setIsOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
