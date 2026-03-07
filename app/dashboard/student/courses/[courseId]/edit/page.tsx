"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Save,
  Loader2,
  Plus,
  Trash2,
  GripVertical
} from "lucide-react";
import { useCourse } from "@/hooks/useCourses";
import { useCourseResources } from "@/hooks/useCourseResources";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { SelectInput } from "@/components/shared/SelectInput";
import { SimpleImageUpload } from "@/components/FormInputs/SimpleImageUpload";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useMe } from "@/hooks/useAuth";

const RESOURCE_TYPES = [
  { value: "PDF", label: "PDF Document" },
  { value: "DOCUMENT", label: "Document" },
  { value: "VIDEO", label: "Video" },
  { value: "LINK", label: "External Link" },
  { value: "IMAGE", label: "Image" },
  { value: "EMBEDDED_CONTENT", label: "Rich Content" },
];

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { data: user } = useMe();
  const queryClient = useQueryClient();
  
  const { data: course, isLoading } = useCourse(courseId);
  const { data: resources } = useCourseResources(courseId);

  const [outline, setOutline] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    type: "PDF",
    category: "",
    url: "",
    content: "",
    fileKey: "",
    order: 0,
  });

  useEffect(() => {
    if (course?.outline) {
      setOutline(course.outline);
    }
  }, [course]);

  const canManage = user?.role === "LECTURER" || user?.role === "ADMIN";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course || !canManage) {
    return (
      <div className="p-6 lg:p-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-gray-600 mt-2">You don't have permission to edit this course</p>
          <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  const handleSaveOutline = async () => {
    try {
      setIsSaving(true);
      await apiClient.patch(`/courses/${courseId}/outline`, { outline });
      toast.success("Course outline saved successfully");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    } catch (error) {
      toast.error("Failed to save outline");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddResource = async () => {
    if (!newResource.title || !newResource.category) {
      toast.error("Please fill in title and category");
      return;
    }

    try {
      await apiClient.post(`/courses/${courseId}/resources`, newResource);
      toast.success("Resource added successfully");
      queryClient.invalidateQueries({ queryKey: ["course-resources", courseId] });
      setNewResource({
        title: "",
        description: "",
        type: "PDF",
        category: "",
        url: "",
        content: "",
        fileKey: "",
        order: 0,
      });
    } catch (error) {
      toast.error("Failed to add resource");
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      await apiClient.delete(`/courses/${courseId}/resources/${resourceId}`);
      toast.success("Resource deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["course-resources", courseId] });
    } catch (error) {
      toast.error("Failed to delete resource");
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto min-h-screen bg-[#fcfdfe]">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/student/courses/${courseId}`)}
          className="gap-2 hover:bg-gray-50 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black lg:text-4xl italic">
            Edit Course Content
          </h1>
          <p className="text-gray-600 text-base font-medium italic mt-2">
            {course.title}
          </p>
        </div>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="outline" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="outline">Course Outline</TabsTrigger>
          <TabsTrigger value="resources">Manage Resources</TabsTrigger>
        </TabsList>

        {/* Course Outline Tab */}
        <TabsContent value="outline" className="space-y-6">
          <Card className="rounded-[2rem] border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Course Outline Editor</CardTitle>
              <p className="text-sm text-gray-500">Create a comprehensive course outline with objectives, topics, schedule, and grading criteria</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <RichTextEditor
                value={outline}
                onChange={setOutline}
                placeholder="Create your course outline here. Include course objectives, topics, schedule, grading criteria, and any other important information..."
                minHeight="500px"
              />
              
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveOutline}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary-600 text-white gap-2 h-12 px-8 rounded-xl"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Outline
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          {/* Add New Resource */}
          <Card className="rounded-[2rem] border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Resource
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Resource Title</Label>
                  <Input
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    placeholder="e.g., Week 1 Lecture Notes"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Resource Type</Label>
                  <SelectInput
                    label="Type"
                    options={RESOURCE_TYPES}
                    value={newResource.type}
                    onValueChange={(value) => setNewResource({ ...newResource, type: value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category / Module</Label>
                  <Input
                    value={newResource.category}
                    onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                    placeholder="e.g., Week 1, Module 1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={newResource.order}
                    onChange={(e) => setNewResource({ ...newResource, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Input
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  placeholder="Brief description..."
                />
              </div>

              {/* Conditional fields based on type */}
              {newResource.type === "LINK" && (
                <div className="space-y-2">
                  <Label>External URL</Label>
                  <Input
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}

              {(newResource.type === "PDF" || newResource.type === "DOCUMENT" || newResource.type === "IMAGE") && (
                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <SimpleImageUpload
                    value={newResource.fileKey}
                    onChange={(value) => setNewResource({ ...newResource, fileKey: value })}
                    label="Upload File"
                  />
                </div>
              )}

              {newResource.type === "VIDEO" && (
                <div className="space-y-2">
                  <Label>Video URL</Label>
                  <Input
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              )}

              {newResource.type === "EMBEDDED_CONTENT" && (
                <div className="space-y-2">
                  <Label>Rich Content</Label>
                  <RichTextEditor
                    value={newResource.content}
                    onChange={(value) => setNewResource({ ...newResource, content: value })}
                    placeholder="Create rich content..."
                    minHeight="300px"
                  />
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleAddResource}
                  className="bg-primary hover:bg-primary-600 text-white gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Resource
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Resources */}
          <Card className="rounded-[2rem] border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Existing Resources</CardTitle>
              <p className="text-sm text-gray-500">{resources?.length || 0} resources</p>
            </CardHeader>
            <CardContent>
              {!resources || resources.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No resources yet. Add your first resource above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resources.map((resource: any) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">{resource.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500">{resource.type}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{resource.category}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">Order: {resource.order}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteResource(resource.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
