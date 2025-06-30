import "server-only";
import { defineLive } from "next-sanity";
import { client } from "@/sanity/lib/client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_SERVER_TOKEN,   // Add your server token here
  browserToken: process.env.SANITY_BROWSER_TOKEN, // Optional, for client draft preview
});
