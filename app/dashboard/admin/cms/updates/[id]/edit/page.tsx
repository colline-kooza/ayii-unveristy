"use client";

import { use } from "react";
import { SchoolUpdateForm } from "@/components/admin/cms/school-update-form";

export default function EditSchoolUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <SchoolUpdateForm mode="edit" updateId={id} />;
}
