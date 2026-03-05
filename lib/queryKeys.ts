export const queryKeys = {
  // Auth
  me: ["me"] as const,

  // Admin — Users
  students: {
    all: (params?: Record<string, any>) => ["students", params] as const,
    detail: (id: string) => ["students", id] as const,
  },
  lecturers: {
    all: (params?: Record<string, any>) => ["lecturers", params] as const,
    detail: (id: string) => ["lecturers", id] as const,
  },

  // Courses
  courses: {
    all: (params?: Record<string, any>) => ["courses", params] as const,
    detail: (id: string) => ["courses", id] as const,
    mine: ["courses", "mine"] as const, // lecturer's own courses
    enrolled: ["courses", "enrolled"] as const, // student's enrolled courses
  },

  // Assignments
  assignments: {
    byCourse: (courseId: string) => ["assignments", courseId] as const,
    detail: (id: string) => ["assignments", "detail", id] as const,
  },

  // Submissions
  submissions: {
    byAssignment: (assignmentId: string) =>
      ["submissions", assignmentId] as const,
    mine: (assignmentId: string) =>
      ["submissions", "mine", assignmentId] as const,
  },

  // Live Lectures
  liveLecture: {
    byCourse: (courseId: string) => ["live-lecture", courseId] as const,
  },

  // Messaging
  messages: {
    conversations: ["messages", "conversations"] as const,
    thread: (partnerId: string) => ["messages", "thread", partnerId] as const,
  },

  // Notifications
  notifications: {
    all: (params?: Record<string, any>) => ["notifications", params] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },

  // Library
  library: {
    pastPapers: (params?: Record<string, any>) =>
      ["library", "past-papers", params] as const,
    journals: (params?: Record<string, any>) =>
      ["library", "journals", params] as const,
    newspapers: (params?: Record<string, any>) =>
      ["library", "newspapers", params] as const,
  },

  // Admin Overview
  admin: {
    stats: ["admin", "stats"] as const,
    allCourses: (params?: Record<string, any>) =>
      ["admin", "courses", params] as const,
    allAssignments: (params?: Record<string, any>) =>
      ["admin", "assignments", params] as const,
    allSubmissions: (params?: Record<string, any>) =>
      ["admin", "submissions", params] as const,
    auditLog: (params?: Record<string, any>) =>
      ["admin", "audit-log", params] as const,
  },
} as const;
