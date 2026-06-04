"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductForm as TProductForm, productSchema } from "../schema/products";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { actionToast } from "@/hooks/use-toast";
import { createProduct, updateProduct } from "../actions/products";
import { ProductStatus, productStatuses } from "@/drizzle/schema";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/custom/multi-select";

export function ProductForm({
  product,
  courses,
}: {
  product?: {
    id: string;
    name: string;
    priceInDollars: number;
    description: string;
    imageUrl: string;
    status: ProductStatus;
    courseIds: string[];
  };
  courses: {
    id: string;
    name: string;
  }[];
}) {
  const form = useForm<TProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      priceInDollars: product?.priceInDollars ?? 0,
      description: product?.description ?? "",
      imageUrl: product?.imageUrl ?? "",
      status: product?.status ?? "private",
      courseIds: product?.courseIds ?? [],
    },
  });

  async function onSubmit(values: TProductForm) {
    const action =
      product == null ? createProduct : updateProduct.bind(null, product.id);
    const data = await action(values);

    actionToast({ actionData: data });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 items-start">
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
            name="priceInDollars"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabelIcon />
                  Price
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={1}
                    min={0}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        isNaN(e.target.valueAsNumber)
                          ? ""
                          : e.target.valueAsNumber
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabelIcon />
                  Image Url
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
                    {productStatuses.map((s) => (
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
            name="courseIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Includes Courses</FormLabel>
                <FormControl>
                  <MultiSelect
                    selectPlaceholder="Select courses"
                    searchPlaceholder="Search courses"
                    options={courses}
                    getValue={(c) => c.id}
                    getLabel={(c) => c.name}
                    selectedValues={field.value}
                    onSelectedValuesChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredLabelIcon />
                Description
              </FormLabel>
              <FormControl>
                <Textarea className="min-h-20 resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
