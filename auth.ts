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
    async signIn(params: { user: User; profile?: Profile }) {
      const { user, profile } = params;
      const { name, email, image } = user ?? {};
      const { id, login, bio } = profile ?? {};

      try {
        const existingUser = await client.withConfig({ useCdn: false }).fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

        if (!existingUser) {
          console.log("🆕 Creating new author in Sanity...");

          await writeClient.create({
            _type: "author",
            _id: id!.toString(),
            name,
            username: login,
            email,
            image,
            bio: bio || "",
          });

          console.log("✅ Author created successfully.");
        }

        return true;
      } catch (error) {
        console.error("❌ signIn error:", error);
        return false;
      }
    },

    async jwt(params: {
      token: JWT;
      account?: any;
      profile?: Profile;
    }) {
      const { token, account, profile } = params;
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile.id,
          });
        token.id = user?._id;
      }
      return token;
    },

    async session(params: { session: Session; token: JWT & { id?: string } }) {
      const { session, token } = params;
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});
