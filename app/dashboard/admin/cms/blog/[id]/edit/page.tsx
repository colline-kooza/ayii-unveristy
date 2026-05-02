"use client";

import { use } from "react";
import { BlogPostForm } from "@/components/admin/cms/blog-post-form";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <BlogPostForm mode="edit" postId={id} />;
}
