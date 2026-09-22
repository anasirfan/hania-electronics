"use client";

import { use } from "react";
import { ProductForm } from "@/features/admin/product-form";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ProductForm productId={id} />;
}
