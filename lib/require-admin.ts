import "server-only";
import { auth } from "@/lib/auth";

// Every mutating server action must call this first. Middleware already
// blocks unauthenticated page loads under /admin, but server actions can in
// principle be invoked directly, so each one re-checks the session itself.
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}
