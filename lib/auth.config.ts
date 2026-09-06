import type { NextAuthConfig } from "next-auth";

// Edge-safe base config, shared by middleware.ts (Edge runtime) and lib/auth.ts
// (Node runtime, where the Credentials provider + Prisma + bcrypt live).
// Keeping this file free of Node-only imports is what lets middleware verify
// the session JWT without bundling Prisma's native engine into the Edge bundle.
export const authConfig = {
  // Vercel sets this automatically; other hosts (a VPS, `next start` behind
  // your own reverse proxy) need it explicit or Auth.js throws UntrustedHost
  // on every auth() call in production.
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isProtectedAdminRoute =
        pathname.startsWith("/admin") && pathname !== "/admin/login";
      if (isProtectedAdminRoute) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
