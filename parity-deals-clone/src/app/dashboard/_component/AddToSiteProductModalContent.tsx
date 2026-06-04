"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { env } from "@/data/env/client";
import { CopyCheckIcon, CopyIcon, CopyXIcon } from "lucide-react";
import { useState } from "react";

type CopyState = "idle" | "copied" | "error";

export function AddToSiteProductModalContent({ id }: { id: string }) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const code = `<script src="${env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}/banner"></script>`;

  const Icon = {
    idle: CopyIcon,
    copied: CopyCheckIcon,
    error: CopyXIcon,
  }[copyState];

  const copyText = {
    idle: "Copy code",
    copied: "Copied",
    error: "Error",
  }[copyState];

  return (
    <DialogContent className="max-w-max">
      <DialogHeader>
        <DialogTitle className="text-2xl">Start Earning PPP Sales!</DialogTitle>
        <DialogDescription>
          All you need to do is copy the below script into your site and your
          customers will start seeing PPP discounts
        </DialogDescription>
      </DialogHeader>

      <pre className="mb-4 overflow-x-auto p-4 bg-secondary rounded max-w-screen-xl text-secondary-foreground">
        <code>{code}</code>
      </pre>

      <div className="flex gap-2">
        <Button
          onClick={() =>
            navigator.clipboard
              .writeText(code)
              .then(() => {
                setCopyState("copied");
              })
              .catch(() => {
                setCopyState("error");
              })
              .then(() => {
                setTimeout(() => {
                  setCopyState("idle");
                }, 2000);
              })
          }
        >
          <Icon className="size-4 mr-2" />
          {copyText}
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
}
