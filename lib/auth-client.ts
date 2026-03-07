import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

// Use relative URL (empty string = same origin) so it always targets the
// correct domain on both localhost and any hosted environment.
// Never hardcode a URL here — it breaks session cookies on production.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [emailOTPClient()],
});
