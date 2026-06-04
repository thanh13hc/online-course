import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { AddToSiteProductModalContent } from "./AddToSiteProductModalContent";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteProductAlert } from "./DeleteProductAlert";

export function ProductGrid({
  products,
}: {
  products: {
    id: string;
    name: string;
    url: string;
    description?: string | null;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-col-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}

export function ProductCard({
  id,
  name,
  url,
  description,
}: {
  id: string;
  name: string;
  url: string;
  description?: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between items-end">
          <CardTitle>
            <Link href={`/dashboard/products/${id}/edit`}>{name}</Link>
          </CardTitle>

          <Dialog>
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" className="size-8 p-0">
                    <div className="sr-only"></div>
                    <DotsHorizontalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/products/${id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <DialogTrigger asChild>
                    <DropdownMenuItem>Add to Site</DropdownMenuItem>
                  </DialogTrigger>

                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AddToSiteProductModalContent id={id} />
              <DeleteProductAlert id={id} />
            </AlertDialog>
          </Dialog>
        </div>

        <CardDescription>{url}</CardDescription>
      </CardHeader>
      {description && <CardContent>{description}</CardContent>}
    </Card>
  );
}
