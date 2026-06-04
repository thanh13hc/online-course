"use client";

import { ComponentProps, useState } from "react";
import { Button } from "./ui/button";
import { Copy, CopyCheck, CopyX } from "lucide-react";

type CopyState = "idle" | "copied" | "error";

export function CopyEventButton({
  eventId,
  clerkUserId,
  ...buttonProps
}: Omit<ComponentProps<typeof Button>, "children" | "onClick"> & {
  eventId: string;
  clerkUserId: string;
}) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const CopyIcon = {
    idle: Copy,
    copied: CopyCheck,
    error: CopyX,
  }[copyState];

  const copyText = {
    idle: "Copy Link",
    copied: "Copied!",
    error: "Error",
  }[copyState];

  return (
    <Button
      {...buttonProps}
      onClick={() => {
        navigator.clipboard
          .writeText(`${location.origin}/book/${clerkUserId}/${eventId}`)
          .then(() => {
            setCopyState("copied");
          })
          .catch(() => {
            setCopyState("error");
          })
          .finally(() => {
            setTimeout(() => {
              setCopyState("idle");
            }, 2000);
          });
      }}
    >
      <CopyIcon className="size-4 mr-2" />
      {copyText}
    </Button>
  );
}
