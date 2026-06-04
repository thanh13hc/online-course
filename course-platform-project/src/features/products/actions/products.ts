"use server";

import { getCurrentUser } from "@/services/clerk";
import { redirect } from "next/navigation";
import {
  canCreateProducts,
  canUpdateProducts,
  canDeleteProducts,
} from "../permissions/products";
import { ProductForm, productSchema } from "../schema/products";
import {
  insertProduct,
  updateProduct as updateProductDb,
  deleteProduct as deleteProductDb,
} from "../db/products";

export async function createProduct(unsafeData: ProductForm) {
  const { success, data } = productSchema.safeParse(unsafeData);

  if (!success || !canCreateProducts(await getCurrentUser())) {
    return { error: true, message: "There was an error creating your product" };
  }

  const product = await insertProduct(data);

  redirect(`/admin/products/${product.id}/edit`);
}

export async function updateProduct(id: string, unsafeData: ProductForm) {
  const { success, data } = productSchema.safeParse(unsafeData);

  if (!success || !canUpdateProducts(await getCurrentUser())) {
    return { error: true, message: "There was an error update your product" };
  }

  await updateProductDb(id, data);

  return { error: false, message: "Successfully updated your product" };
}

export async function deleteProduct(id: string) {
  if (!canDeleteProducts(await getCurrentUser())) {
    return { error: true, message: "There was an error deleting your product" };
  }

  await deleteProductDb(id);

  return { error: false, message: "Successfully deleted your product" };
}
