import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, token } from "../env";

if (process.env.NODE_ENV === "production" && !token) {
  throw new Error("❌ SANITY_API_TOKEN is missing in production.");
}

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token, // Only set if available
});
