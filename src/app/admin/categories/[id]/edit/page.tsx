"use client";

import { useParams } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";

export default function EditCategoryPage() {
  const params = useParams();
  const categoryId = params?.id as string;

  return (
    <CategoryForm
      mode="edit"
      categoryId={categoryId}
    />
  );
}