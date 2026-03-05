import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  const sessionCookie = cookies.find((c) =>
    c.trim().startsWith("better-auth.session_token="),
  );

  return sessionCookie ? sessionCookie.split("=")[1].trim() : null;
}
