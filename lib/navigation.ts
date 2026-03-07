import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  MessageSquare,
  Bell,
  Library,
  CheckSquare,
  FileText,
  Settings,
  User,
  ClipboardList,
  Video,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  url: string;
  icon: any;
  badge?: string | number;
  items?: NavigationItem[];
}

export function getNavigationForRole(
  role: string,
  dynamicData?: { unreadNotifications?: number; unreadMessages?: number },
): NavigationItem[] {
  switch (role) {
    case "ADMIN":
      return [
        {
          title: "Overview",
          url: "/dashboard/admin/overview",
          icon: LayoutDashboard,
        },
        {
          title: "All Dashboards",
          url: "/dashboard/all-roles",
          icon: LayoutDashboard,
        },
        {
          title: "Users",
          url: "/dashboard/admin/users",
          icon: Users,
          items: [
            {
              title: "Students",
              url: "/dashboard/admin/users/students",
              icon: Users,
            },
            {
              title: "Lecturers",
              url: "/dashboard/admin/users/lecturers",
              icon: GraduationCap,
            },
          ],
        },
        {
          title: "Courses",
          url: "/dashboard/admin/courses",
          icon: BookOpen,
        },
        {
          title: "Library",
          url: "/dashboard/library",
          icon: Library,
          items: [
            {
              title: "Books",
              url: "/dashboard/library/books",
              icon: BookOpen,
            },
            {
              title: "Past Papers",
              url: "/dashboard/library/past-papers",
              icon: FileText,
            },
            {
              title: "Journals",
              url: "/dashboard/library/journals",
              icon: BookOpen,
            },
          ],
        },
        {
          title: "Messages",
          url: "/dashboard/messages",
          icon: MessageSquare,
          badge: dynamicData?.unreadMessages,
        },
        {
          title: "Notifications",
          url: "/dashboard/notifications",
          icon: Bell,
          badge: dynamicData?.unreadNotifications,
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
        },
        {
          title: "Profile",
          url: "/dashboard/profile",
          icon: User,
        },
      ];

    case "LECTURER":
      return [
        {
          title: "Overview",
          url: "/dashboard/lecturer",
          icon: LayoutDashboard,
        },
        {
          title: "All Dashboards",
          url: "/dashboard/all-roles",
          icon: LayoutDashboard,
        },
        {
          title: "My Courses",
          url: "/dashboard/lecturer/my-courses",
          icon: BookOpen,
        },
        {
          title: "Assignments",
          url: "/dashboard/lecturer/assignments",
          icon: FileText,
        },
        {
          title: "Submissions",
          url: "/dashboard/lecturer/submissions",
          icon: ClipboardList,
        },
        {
          title: "Live Classes",
          url: "/dashboard/lecturer/live-classes",
          icon: Video,
        },
        {
          title: "Library",
          url: "/dashboard/library",
          icon: Library,
          items: [
            {
              title: "Books",
              url: "/dashboard/library/books",
              icon: BookOpen,
            },
            {
              title: "Past Papers",
              url: "/dashboard/library/past-papers",
              icon: FileText,
            },
            {
              title: "Journals",
              url: "/dashboard/library/journals",
              icon: BookOpen,
            },
          ],
        },
        {
          title: "Messages",
          url: "/dashboard/messages",
          icon: MessageSquare,
          badge: dynamicData?.unreadMessages,
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
        },
        {
          title: "Profile",
          url: "/dashboard/profile",
          icon: User,
        },
      ];

    case "STUDENT":
      return [
        {
          title: "Overview",
          url: "/dashboard/student",
          icon: LayoutDashboard,
        },
        {
          title: "All Dashboards",
          url: "/dashboard/all-roles",
          icon: LayoutDashboard,
        },
        {
          title: "Courses",
          url: "/dashboard/student/courses",
          icon: BookOpen,
        },
        {
          title: "My Enrollments",
          url: "/dashboard/student/courses?tab=enrolled",
          icon: CheckSquare,
        },
        {
          title: "Assignments",
          url: "/dashboard/student/assignments",
          icon: FileText,
        },
        {
          title: "Live Classes",
          url: "/dashboard/student/live-classes",
          icon: Video,
        },
        {
          title: "Submissions",
          url: "/dashboard/student/submissions",
          icon: ClipboardList,
        },
        {
          title: "Library",
          url: "/dashboard/library",
          icon: Library,
          items: [
            {
              title: "Books",
              url: "/dashboard/library/books",
              icon: BookOpen,
            },
            {
              title: "Past Papers",
              url: "/dashboard/library/past-papers",
              icon: FileText,
            },
            {
              title: "Journals",
              url: "/dashboard/library/journals",
              icon: BookOpen,
            },
          ],
        },
        {
          title: "Messages",
          url: "/dashboard/messages",
          icon: MessageSquare,
          badge: dynamicData?.unreadMessages,
        },
        {
          title: "Notifications",
          url: "/dashboard/notifications",
          icon: Bell,
          badge: dynamicData?.unreadNotifications,
        },
        {
          title: "Settings",
          url: "/dashboard/settings",
          icon: Settings,
        },
        {
          title: "Profile",
          url: "/dashboard/profile",
          icon: User,
        },
      ];

    default:
      return [];
  }
}
