# UI Refactoring Plan - Clean & Consistent Design

## Design Principles
1. **Minimal Shadows**: Remove excessive shadow-xl, shadow-2xl - use shadow-sm or none
2. **Consistent Rounding**: Use rounded-lg (8px) max, avoid rounded-2xl, rounded-3xl
3. **Medium Font Sizes**: text-sm (14px) for body, text-base (16px) for emphasis
4. **ScrollArea**: Add to all modals for better content management
5. **Clean Spacing**: Consistent padding and gaps (p-4, p-6, gap-4, gap-6)
6. **Subtle Borders**: border-gray-200 instead of heavy borders

## Components to Refactor

### Modals (All need ScrollArea + Clean UI)
- [x] CreateStudentModal
- [x] CreateLecturerModal  
- [x] UpdateStudentModal
- [x] UpdateLecturerModal
- [x] CreateCourseModal
- [x] CreateAssignmentModal
- [x] SubmitAssignmentModal
- [x] LibraryAssetModal
- [x] ViewStudentProfileModal
- [x] ViewLecturerProfileModal
- [x] BulkUploadModal
- [x] ContentUploadModal

### Pages
- [ ] Student Dashboard (app/dashboard/student/page.tsx)
- [ ] Lecturer Dashboard (app/dashboard/lecturer/page.tsx)
- [ ] Student Courses (app/dashboard/student/courses/page.tsx)
- [ ] Lecturer Courses (app/dashboard/lecturer/my-courses/page.tsx)

## Style Changes

### Before (Excessive)
```tsx
className="rounded-3xl shadow-2xl shadow-blue-500/20 hover:scale-105"
className="text-[11px] font-black uppercase tracking-[0.2em]"
className="h-16 w-16 rounded-full bg-gradient-to-br"
```

### After (Clean)
```tsx
className="rounded-lg shadow-sm hover:shadow-md"
className="text-sm font-semibold"
className="h-10 w-10 rounded-lg bg-gray-50"
```

## Implementation Order
1. Update all modals with ScrollArea
2. Standardize font sizes (text-sm, text-base)
3. Remove excessive shadows and rounding
4. Clean up student/lecturer dashboards
5. Ensure consistency across all components
