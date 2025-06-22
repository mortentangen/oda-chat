import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const runtime = "nodejs";

// Get allowed emails from environment variable, split by comma, and trim whitespace
const allowedEmails = (process.env.ALLOWED_EMAILS || "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean); // Remove any empty strings

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.email && allowedEmails.includes(user.email)) {
        return true;
      }
      return false;
    },
  },
});

export { handler as GET, handler as POST };
