import NextAuth from "next-auth";

import GitHub from "next-auth/providers/github";
import type { JWT } from "next-auth/jwt";
import type { Session, User, Profile } from "next-auth";

import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/queries";
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }: { user: User; profile?: Profile }) {
      if (!profile) {
        console.error("❌ GitHub profile is missing.");
        return false;
      }

      const id = profile.id?.toString();
      if (!id) {
        console.error("❌ GitHub ID is missing.");
        return false;
      }

      try {
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

        if (!existingUser) {
          console.log("🆕 Creating new author in Sanity...");

          await writeClient.create({
            _type: "author",
            _id: id,
            name: user.name ?? "",
            username: profile.login ?? "",
            email: user.email ?? "",
            image: user.image ?? "",
            bio: profile.bio ?? "",
          });

          console.log("✅ Author created successfully.");
        }

        return true;
      } catch (error) {
        console.error("❌ signIn error:", error);
        return false;
      }
    },

    async jwt({ token, profile }: { token: JWT; profile?: Profile }) {
      if (profile?.id) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile.id });
        token.id = user?._id;
      }
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT & { id?: string };
    }) {
      if (token.id) {
        (session as any).id = token.id;
      }
      return session;
    },
  },
});
