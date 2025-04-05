import { createClient } from "@hey-api/client-fetch";

export const heyApiServerClient = createClient({
  baseUrl: process.env.BACKEND_API_URL || "http://127.0.0.1:8000",
});
