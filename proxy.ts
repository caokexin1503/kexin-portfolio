import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Uses the Edge-safe auth config only (no Prisma/bcrypt) so this can run in
// the Edge middleware runtime. Actual credential verification happens in
// lib/auth.ts on the Node runtime, when /admin/login submits.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};
