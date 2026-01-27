import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyPassword } from "@/lib/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();

        const user = await User.findOne({
          email: (credentials.email as string).toLowerCase(),
        }).select("+password");

        if (!user || !user.password) {
          return null;
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();

        let dbUser = await User.findOne({ email: user.email?.toLowerCase() });

        if (!dbUser) {
          dbUser = await User.create({
            email: user.email?.toLowerCase(),
            name: user.name,
            image: user.image,
            authProvider: "google",
            googleId: account.providerAccountId,
            password: null,
          });
        } else if (!dbUser.googleId) {
          dbUser.googleId = account.providerAccountId;
          dbUser.authProvider = "google";
          if (user.image && !dbUser.image) {
            dbUser.image = user.image;
          }
          await dbUser.save();
        }

        // Store role and id in user object for JWT callback
        user.id = dbUser._id.toString();
        (user as { role?: string }).role = dbUser.role;
      }

      return true;
    },
    async jwt({ token, user, trigger }) {
      // Only update token when user signs in (not on every request)
      if (user && user.id) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "user";
      }

      // Handle session update trigger
      if (trigger === "update" && token.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: (token.email as string).toLowerCase() });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.AUTH_SECRET || process.env.JWT_SECRET,
});
