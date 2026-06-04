"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProduct } from "@/server/db/actions/products";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeleteProductAlert({ id }: { id: string }) {
  const [isDeletePending, startDeleteTransition] = useTransition();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this
          product.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          disabled={isDeletePending}
          onClick={() => {
            startDeleteTransition(async () => {
              const { error, message } = await deleteProduct(id);

              const fn = error ? toast.error : toast.success;

              fn(message);
            });
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
