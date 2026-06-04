"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  productDetailsSchema,
  type ProductDetailsFormValues,
} from "@/schemas/products";
import { createProduct, updateProduct } from "@/server/db/actions/products";
import { toast } from "sonner";

export function ProductDetailsForm({
  product,
}: {
  product?: {
    id: string;
    name: string;
    description: string | null;
    url: string;
  };
}) {
  const form = useForm<ProductDetailsFormValues>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: product
      ? { ...product, description: product.description ?? "" }
      : {
          name: "",
          url: "",
          description: "",
        },
  });

  const onSubmit = async (values: ProductDetailsFormValues) => {
    const action =
      product == null ? createProduct : updateProduct.bind(null, product.id);
    const data = await action(values);

    if (data != null) {
      const toastType = data.error ? "error" : "success";
      toast[toastType](data.error ? "Error" : "Success", {
        description: data.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter your website URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Include the protocol (http/https) and the full path to the
                  sales page
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea className="min-h-20 resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  An optional description to help distinguish product from other
                  products
                </FormDescription>
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
