/**
 * Get a default avatar image for users without profile pictures
 * Uses a consistent seed based on the user's name for the same person to always get the same image
 */
export function getDefaultAvatar(
  name: string,
  type: "student" | "lecturer" | "user" = "user",
): string {
  // Create a simple hash from the name to use as seed
  const seed = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Use pravatar.cc for consistent, professional-looking avatars
  // Range of 70 different avatar images
  const imageNumber = (seed % 70) + 1;

  return `https://i.pravatar.cc/400?img=${imageNumber}`;
}

/**
 * Get avatar URL with fallback to default image
 */
export function getAvatarUrl(
  imageUrl: string | null | undefined,
  name: string,
  type: "student" | "lecturer" | "user" = "user",
): string {
  return imageUrl || getDefaultAvatar(name, type);
}
