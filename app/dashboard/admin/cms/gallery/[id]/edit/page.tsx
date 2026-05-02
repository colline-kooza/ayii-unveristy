"use client";

import { use } from "react";
import { GalleryImageForm } from "@/components/admin/cms/gallery-image-form";

export default function EditGalleryImagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <GalleryImageForm mode="edit" imageId={id} />;
}
